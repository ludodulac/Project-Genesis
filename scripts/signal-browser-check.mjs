import { chromium } from 'playwright';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 760 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const page = await context.newPage();
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(String(err)));

await page.goto('http://127.0.0.1:4173/?game=signal', { waitUntil: 'networkidle' });
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
await page.screenshot({ path: 'artifacts/signal-initial.png', fullPage: true });

const toPage = (x, y) => ({ x: box.x + x, y: box.y + y });
const node = (nx, ny) => toPage(38 + nx * 314, 165 + ny * 430);

// Seed 1 starts with operator 0 on node 4 (.27,.70). Drag it to free node 5 (.47,.18).
const op0 = node(.27, .70);
const free5 = node(.47, .18);
await page.touchscreen.tap(op0.x, op0.y);
await page.mouse.move(op0.x, op0.y);
await page.mouse.down();
await page.mouse.move(free5.x, free5.y, { steps: 8 });
await page.mouse.up();
await page.waitForTimeout(200);
await page.screenshot({ path: 'artifacts/signal-after-drag.png', fullPage: true });

// Operator 1 starts on node 6 (.47,.50). Tap to rotate it.
const op1 = node(.47, .50);
await page.touchscreen.tap(op1.x, op1.y);
await page.waitForTimeout(200);
await page.screenshot({ path: 'artifacts/signal-after-rotate.png', fullPage: true });

// Let the real-time loop run long enough to spawn and route visible traffic.
await page.waitForTimeout(6500);
await page.screenshot({ path: 'artifacts/signal-traffic.png', fullPage: true });

if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
fs.writeFileSync('artifacts/browser-check.json', JSON.stringify({ box, overflow, errors }, null, 2));
await browser.close();
