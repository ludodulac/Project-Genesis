import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 760 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const page = await context.newPage();
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push(String(err)));

const screenshots = {};
const hashShot = async (name) => {
  const buffer = await page.screenshot({ path: `artifacts/${name}.png`, fullPage: true });
  screenshots[name] = crypto.createHash('sha256').update(buffer).digest('hex');
};

await page.goto('http://127.0.0.1:4173/?game=signal&seed=1', { waitUntil: 'networkidle' });
await page.waitForSelector('canvas');
const canvas = page.locator('canvas');
const box = await canvas.boundingBox();
if (!box) throw new Error('SIGNAL canvas is missing');
if (Math.abs(box.width - 390) > 2 || Math.abs(box.height - 760) > 2) {
  throw new Error(`Unexpected canvas size ${box.width}x${box.height}`);
}
const overflow = await page.evaluate(() => ({
  w: document.documentElement.scrollWidth,
  h: document.documentElement.scrollHeight,
  iw: innerWidth,
  ih: innerHeight,
}));
if (overflow.w > overflow.iw + 2 || overflow.h > overflow.ih + 2) {
  throw new Error(`Page overflows viewport: ${JSON.stringify(overflow)}`);
}

const toPage = (x, y) => ({ x: box.x + x, y: box.y + y });
const node = (nx, ny) => toPage(38 + nx * 314, 154 + ny * 452);
const touchDrag = async (from, to) => {
  await page.evaluate(({ from, to }) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) throw new Error('canvas missing during drag');
    const dispatch = (type, point, buttons) => canvas.dispatchEvent(new PointerEvent(type, {
      pointerId: 7,
      pointerType: 'touch',
      isPrimary: true,
      bubbles: true,
      cancelable: true,
      clientX: point.x,
      clientY: point.y,
      buttons,
    }));
    dispatch('pointerdown', from, 1);
    for (let i = 1; i <= 8; i += 1) {
      dispatch('pointermove', {
        x: from.x + (to.x - from.x) * i / 8,
        y: from.y + (to.y - from.y) * i / 8,
      }, 1);
    }
    dispatch('pointerup', to, 0);
  }, { from, to });
  await page.waitForTimeout(160);
};

await hashShot('signal-seed1-initial');

// Seed 1: move switch node 6 -> node 3, then swap filter node 4 with alternator node 8.
const node6 = node(.48, .50);
const node3 = node(.28, .30);
const node4 = node(.28, .70);
const node8 = node(.70, .30);
await touchDrag(node6, node3);
await hashShot('signal-after-touch-drag');
await touchDrag(node4, node8);
await hashShot('signal-after-touch-swap');

// Touch each resulting operator once to exercise rotation/filter selection.
await page.touchscreen.tap(node3.x, node3.y);
await page.touchscreen.tap(node8.x, node8.y);
await page.touchscreen.tap(node4.x, node4.y);
await page.waitForTimeout(250);
await hashShot('signal-after-touch-rotate');

// Exercise live traffic and congestion rendering.
await page.waitForTimeout(7000);
await hashShot('signal-live-traffic');

// Verify three curated seeds are visually distinct in the actual browser.
for (const seed of [2, 3]) {
  await page.goto(`http://127.0.0.1:4173/?game=signal&seed=${seed}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');
  await page.waitForTimeout(250);
  await hashShot(`signal-seed${seed}-initial`);
}
const seedHashes = [screenshots['signal-seed1-initial'], screenshots['signal-seed2-initial'], screenshots['signal-seed3-initial']];
if (new Set(seedHashes).size !== 3) throw new Error('Seed screenshots are not structurally distinct');

// Verify a real loss and restart in-browser. Seed 2 naturally loses quickly without intervention.
await page.goto('http://127.0.0.1:4173/?game=signal&seed=2', { waitUntil: 'networkidle' });
await page.waitForSelector('canvas');
await page.waitForTimeout(45000);
await hashShot('signal-loss');
const lossBeforeRestart = screenshots['signal-loss'];
await page.waitForTimeout(450);
await page.touchscreen.tap(195, 380);
await page.waitForTimeout(350);
await hashShot('signal-restarted');
if (screenshots['signal-restarted'] === lossBeforeRestart) throw new Error('Restart did not visibly reset the game');

if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
fs.writeFileSync('artifacts/browser-check.json', JSON.stringify({ box, overflow, errors, screenshots }, null, 2));
await browser.close();
