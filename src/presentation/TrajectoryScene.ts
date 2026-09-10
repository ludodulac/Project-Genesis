import Phaser from 'phaser';
import { clampPull, launchVelocity, reflectVelocity, type Vec2 } from '../experiments/exp024-trajectory';

const W = 390;
const H = 760;
const R = 11;
const GRAVITY = 430;
const START = { x: 92, y: 650 };
const TARGET = { x: 308, y: 116, r: 24 };

interface Surface { x: number; y: number; w: number; h: number }

const SURFACES: Surface[] = [
  { x: 34, y: 478, w: 196, h: 18 },
  { x: 202, y: 304, w: 154, h: 18 },
  { x: 42, y: 188, w: 126, h: 18 },
];

export class TrajectoryScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private ball: Vec2 = { ...START };
  private velocity: Vec2 = { x: 0, y: 0 };
  private pulling = false;
  private pullPoint: Vec2 = { ...START };
  private flying = false;
  private flightMs = 0;
  private resetMs = 0;
  private targetPulse = 0;

  constructor() { super('trajectory'); }

  create(): void {
    this.gfx = this.add.graphics();
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.flying || this.resetMs > 0) return;
      if (Phaser.Math.Distance.Between(p.x, p.y, this.ball.x, this.ball.y) > 34) return;
      this.pulling = true;
      this.pullPoint = clampPull(this.ball, { x: p.x, y: p.y });
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!this.pulling) return;
      this.pullPoint = clampPull(this.ball, { x: p.x, y: p.y });
    });
    this.input.on('pointerup', () => {
      if (!this.pulling) return;
      this.pulling = false;
      const v = launchVelocity(this.ball, this.pullPoint);
      if (Math.hypot(v.x, v.y) < 45) return;
      this.velocity = v;
      this.flying = true;
      this.flightMs = 0;
    });
    this.redraw();
  }

  update(_time: number, delta: number): void {
    const dt = Math.min(delta, 24) / 1000;
    this.targetPulse = Math.max(0, this.targetPulse - delta / 420);

    if (this.resetMs > 0) {
      this.resetMs -= delta;
      if (this.resetMs <= 0) this.resetBall();
      this.redraw();
      return;
    }

    if (this.flying) {
      this.flightMs += delta;
      this.velocity.y += GRAVITY * dt;
      this.ball.x += this.velocity.x * dt;
      this.ball.y += this.velocity.y * dt;
      this.collideBounds();
      for (const surface of SURFACES) this.collideSurface(surface);

      const targetDistance = Phaser.Math.Distance.Between(this.ball.x, this.ball.y, TARGET.x, TARGET.y);
      if (targetDistance <= TARGET.r - 2) {
        this.targetPulse = 1;
        this.flying = false;
        this.resetMs = 380;
      } else if (this.ball.y > H + 40 || this.flightMs > 6500) {
        this.flying = false;
        this.resetMs = 140;
      }
    }

    this.redraw();
  }

  private collideBounds(): void {
    if (this.ball.x < R) {
      this.ball.x = R;
      this.velocity = reflectVelocity(this.velocity, { x: 1, y: 0 });
    } else if (this.ball.x > W - R) {
      this.ball.x = W - R;
      this.velocity = reflectVelocity(this.velocity, { x: -1, y: 0 });
    }
    if (this.ball.y < R) {
      this.ball.y = R;
      this.velocity = reflectVelocity(this.velocity, { x: 0, y: 1 });
    }
  }

  private collideSurface(s: Surface): void {
    const closestX = Phaser.Math.Clamp(this.ball.x, s.x, s.x + s.w);
    const closestY = Phaser.Math.Clamp(this.ball.y, s.y, s.y + s.h);
    const dx = this.ball.x - closestX;
    const dy = this.ball.y - closestY;
    const distSq = dx * dx + dy * dy;
    if (distSq >= R * R) return;

    let nx = 0;
    let ny = 0;
    const dist = Math.sqrt(distSq);
    if (dist > 0.0001) {
      nx = dx / dist;
      ny = dy / dist;
    } else {
      const left = Math.abs(this.ball.x - s.x);
      const right = Math.abs(this.ball.x - (s.x + s.w));
      const top = Math.abs(this.ball.y - s.y);
      const bottom = Math.abs(this.ball.y - (s.y + s.h));
      const m = Math.min(left, right, top, bottom);
      if (m === left) nx = -1;
      else if (m === right) nx = 1;
      else if (m === top) ny = -1;
      else ny = 1;
    }

    const inward = this.velocity.x * nx + this.velocity.y * ny;
    if (inward >= 0) return;
    const penetration = R - dist;
    this.ball.x += nx * (penetration + 0.5);
    this.ball.y += ny * (penetration + 0.5);
    this.velocity = reflectVelocity(this.velocity, { x: nx, y: ny });
  }

  private resetBall(): void {
    this.ball = { ...START };
    this.pullPoint = { ...START };
    this.velocity = { x: 0, y: 0 };
    this.flying = false;
    this.flightMs = 0;
    this.resetMs = 0;
  }

  private redraw(): void {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x13263a, 1);
    g.fillRect(0, 0, W, H);

    g.lineStyle(3, 0x74e7cf, 0.35 + this.targetPulse * 0.65);
    g.strokeCircle(TARGET.x, TARGET.y, TARGET.r + this.targetPulse * 8);
    g.lineStyle(7, 0x74e7cf, 0.9);
    g.strokeCircle(TARGET.x, TARGET.y, TARGET.r);

    for (const s of SURFACES) {
      g.fillStyle(0xdde7ef, 1);
      g.fillRoundedRect(s.x, s.y, s.w, s.h, 9);
    }

    if (this.pulling) {
      g.lineStyle(4, 0xffd760, 0.72);
      g.lineBetween(this.ball.x, this.ball.y, this.pullPoint.x, this.pullPoint.y);
      g.lineStyle(2, 0xffffff, 0.22);
      const mirrorX = this.ball.x + (this.ball.x - this.pullPoint.x) * 0.48;
      const mirrorY = this.ball.y + (this.ball.y - this.pullPoint.y) * 0.48;
      g.lineBetween(this.ball.x, this.ball.y, mirrorX, mirrorY);
    }

    g.fillStyle(0x081622, 0.28);
    g.fillCircle(this.ball.x + 2, this.ball.y + 5, R + 2);
    g.fillStyle(0xffd760, 1);
    g.fillCircle(this.ball.x, this.ball.y, R);
    g.fillStyle(0xffffff, 0.7);
    g.fillCircle(this.ball.x - 3, this.ball.y - 4, 3);
  }
}
