import Phaser from 'phaser';
import {
  initialPressureState,
  nextPressureFeed,
  stepPressure,
  type PressureDirection,
  type PressureState,
} from '../experiments/exp031-global-pressure';

const W = 390;
const H = 760;
const N = 4;
const CELL = 64;
const GAP = 10;
const BOARD = N * CELL + (N - 1) * GAP;
const OX = (W - BOARD) / 2;
const OY = 250;
const SWIPE_MIN = 26;

export class GlobalPressureScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private state: PressureState = initialPressureState();
  private startX = 0;
  private startY = 0;
  private busy = false;
  private flash = 0;

  constructor() { super('global-pressure'); }

  create(): void {
    this.gfx = this.add.graphics();
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.busy) return;
      this.startX = p.x;
      this.startY = p.y;
    });
    this.input.on('pointerup', (p: Phaser.Input.Pointer) => {
      if (this.busy) return;
      const dx = p.x - this.startX;
      const dy = p.y - this.startY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN) return;
      const direction: PressureDirection = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'right' : 'left')
        : (dy > 0 ? 'down' : 'up');
      void this.play(direction);
    });
    this.redraw();
  }

  private async play(direction: PressureDirection): Promise<void> {
    this.busy = true;
    const result = stepPressure(this.state, direction);
    if (!result.advanced) {
      this.flash = 1;
      this.redraw();
      await this.delay(90);
      this.flash = 0;
      this.redraw();
      this.busy = false;
      return;
    }

    this.state = result;
    if (result.clearedThisTurn > 0) {
      this.flash = 2;
      this.redraw();
      await this.delay(120);
      this.flash = 0;
    }
    this.redraw();

    if (!this.state.alive) {
      this.flash = 3;
      this.redraw();
      await this.delay(650);
      this.state = initialPressureState();
      this.flash = 0;
      this.redraw();
    }
    this.busy = false;
  }

  private redraw(): void {
    const g = this.gfx;
    g.clear();
    g.fillStyle(this.flash === 3 ? 0x281827 : 0x102033, 1);
    g.fillRect(0, 0, W, H);

    const incoming = nextPressureFeed(this.state.turn);
    const previewX = OX + incoming.col * (CELL + GAP) + CELL / 2;
    const previewY = OY - 68;
    g.lineStyle(2, incoming.cell === 1 ? 0x72ead1 : 0xffc969, 0.25);
    g.lineBetween(previewX, previewY + 18, previewX, OY - 10);
    g.fillStyle(incoming.cell === 1 ? 0x72ead1 : 0xffc969, 0.96);
    g.fillCircle(previewX, previewY, 14);

    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        const x = OX + col * (CELL + GAP);
        const y = OY + row * (CELL + GAP);
        const cell = this.state.board[row][col];
        g.fillStyle(0x0a1726, this.flash === 1 ? 0.68 : 0.92);
        g.fillRoundedRect(x, y, CELL, CELL, 15);
        if (!cell) continue;

        const radius = this.flash === 2 ? 20 : 18;
        g.fillStyle(cell === 1 ? 0x72ead1 : 0xffc969, 0.98);
        g.fillCircle(x + CELL / 2, y + CELL / 2, radius);
        g.lineStyle(3, 0xffffff, 0.18);
        g.strokeCircle(x + CELL / 2, y + CELL / 2, radius + 4);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => this.time.delayedCall(ms, resolve));
  }
}
