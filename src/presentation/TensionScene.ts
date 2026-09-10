import Phaser from 'phaser';
import { BASE_RADIUS, circlesOverlap, growHeld } from '../experiments/exp025-tension';

const W = 390;
const H = 760;
const PLAYER = { x: 195, y: 380 };
const THREATS = [
  { x: 82, y: 220, r: 17, vx: 74, vy: 54 },
  { x: 310, y: 254, r: 20, vx: -62, vy: 70 },
  { x: 92, y: 548, r: 18, vx: 82, vy: -48 },
  { x: 304, y: 570, r: 16, vx: -76, vy: -58 },
];

export class TensionScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private radius = BASE_RADIUS;
  private heldMs = 0;
  private holding = false;
  private threats = THREATS.map(t => ({ ...t }));
  private resetMs = 0;

  constructor() { super('tension'); }

  create(): void {
    this.gfx = this.add.graphics();
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.resetMs > 0) return;
      if (Phaser.Math.Distance.Between(p.x, p.y, PLAYER.x, PLAYER.y) <= this.radius + 18) this.holding = true;
    });
    this.input.on('pointerup', () => { this.holding = false; });
    this.input.on('pointerupoutside', () => { this.holding = false; });
    this.redraw();
  }

  update(_time: number, delta: number): void {
    const dt = Math.min(delta, 24) / 1000;
    if (this.resetMs > 0) {
      this.resetMs -= delta;
      if (this.resetMs <= 0) this.reset();
      this.redraw();
      return;
    }

    for (const t of this.threats) {
      t.x += t.vx * dt;
      t.y += t.vy * dt;
      if (t.x < t.r || t.x > W - t.r) { t.vx *= -1; t.x = Phaser.Math.Clamp(t.x, t.r, W - t.r); }
      if (t.y < t.r || t.y > H - t.r) { t.vy *= -1; t.y = Phaser.Math.Clamp(t.y, t.r, H - t.r); }
    }

    if (this.holding) {
      const grown = growHeld({ radius: this.radius, heldMs: this.heldMs }, delta);
      this.radius = grown.radius;
      this.heldMs = grown.heldMs;
      if (this.threats.some(t => circlesOverlap({ x: PLAYER.x, y: PLAYER.y, r: this.radius }, t))) {
        this.holding = false;
        this.resetMs = 220;
      }
    }
    this.redraw();
  }

  private reset(): void {
    this.radius = BASE_RADIUS;
    this.heldMs = 0;
    this.holding = false;
    this.threats = THREATS.map(t => ({ ...t }));
    this.resetMs = 0;
  }

  private redraw(): void {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x142335, 1);
    g.fillRect(0, 0, W, H);

    for (const t of this.threats) {
      g.fillStyle(0xff6b78, 0.96);
      g.fillCircle(t.x, t.y, t.r);
      g.lineStyle(3, 0xffb0b7, 0.55);
      g.strokeCircle(t.x, t.y, t.r + 3);
    }

    const danger = this.threats.reduce((m, t) => Math.min(m, Phaser.Math.Distance.Between(t.x, t.y, PLAYER.x, PLAYER.y) - t.r - this.radius), Infinity);
    const pulse = this.holding && danger < 34 ? 5 + Math.sin(this.time.now / 45) * 3 : 0;
    g.fillStyle(0x74e7cf, this.holding ? 0.94 : 0.78);
    g.fillCircle(PLAYER.x, PLAYER.y, this.radius);
    g.lineStyle(4, 0xd9fff6, 0.75);
    g.strokeCircle(PLAYER.x, PLAYER.y, this.radius + pulse);
    g.fillStyle(0xffffff, 0.42);
    g.fillCircle(PLAYER.x - this.radius * 0.28, PLAYER.y - this.radius * 0.3, Math.max(3, this.radius * 0.12));
  }
}
