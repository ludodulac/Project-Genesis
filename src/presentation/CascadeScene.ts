import Phaser from 'phaser';
import { trigger, type Board } from '../experiments/exp026-cascade';

const W = 390;
const H = 760;
const N = 5;
const CELL = 58;
const GAP = 8;
const OX = (W - (N * CELL + (N - 1) * GAP)) / 2;
const OY = 210;

const START: Board = [
  [0,2,0,1,0],
  [2,2,2,2,1],
  [0,2,1,2,0],
  [1,2,2,2,2],
  [0,1,0,2,0],
];

export class CascadeScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private board: Board = START.map(r => [...r]);
  private busy = false;
  private pulse = new Set<string>();

  constructor() { super('cascade'); }

  create(): void {
    this.gfx = this.add.graphics();
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.busy) return;
      const col = Math.floor((p.x - OX) / (CELL + GAP));
      const row = Math.floor((p.y - OY) / (CELL + GAP));
      if (row < 0 || row >= N || col < 0 || col >= N) return;
      const x = OX + col * (CELL + GAP);
      const y = OY + row * (CELL + GAP);
      if (p.x > x + CELL || p.y > y + CELL || this.board[row][col] === 0) return;
      this.play(row, col);
    });
    this.redraw();
  }

  private async play(row: number, col: number): Promise<void> {
    this.busy = true;
    const result = trigger(this.board, row, col);
    for (const wave of result.waves) {
      this.pulse = new Set(wave.cells.map(c => `${c.row}:${c.col}`));
      this.redraw();
      await new Promise<void>(resolve => this.time.delayedCall(260, resolve));
    }
    this.board = result.board;
    this.pulse.clear();
    this.redraw();
    await new Promise<void>(resolve => this.time.delayedCall(650, resolve));
    this.board = START.map(r => [...r]);
    this.busy = false;
    this.redraw();
  }

  private redraw(): void {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x13263a, 1);
    g.fillRect(0, 0, W, H);

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const state = this.board[r][c];
        const x = OX + c * (CELL + GAP);
        const y = OY + r * (CELL + GAP);
        g.fillStyle(0x0b1927, 0.75);
        g.fillRoundedRect(x, y, CELL, CELL, 14);
        if (!state) continue;
        const active = this.pulse.has(`${r}:${c}`);
        const radius = active ? 24 : state === 2 ? 19 : 14;
        g.fillStyle(state === 2 ? 0xffd760 : 0x74e7cf, active ? 1 : 0.9);
        g.fillCircle(x + CELL / 2, y + CELL / 2, radius);
        if (state === 2) {
          g.lineStyle(3, 0xffffff, 0.42);
          g.strokeCircle(x + CELL / 2, y + CELL / 2, radius + 4);
        }
      }
    }
  }
}
