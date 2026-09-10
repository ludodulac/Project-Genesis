import Phaser from 'phaser';
import { cloneBoard, tap, type Board } from '../experiments/exp028-threshold';
import { EXP029_SCENARIOS } from '../experiments/exp029-transfer';

const W = 390;
const H = 760;
const N = 4;
const CELL = 62;
const GAP = 10;
const OX = (W - (N * CELL + (N - 1) * GAP)) / 2;
const OY = 230;

export class TransferScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private scenario = 0;
  private board: Board = cloneBoard(EXP029_SCENARIOS[0]);
  private busy = false;
  private pulse = new Set<string>();

  constructor() { super('transfer'); }

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
      void this.play(row, col);
    });
    this.redraw();
  }

  private async play(row: number, col: number): Promise<void> {
    this.busy = true;
    const before = cloneBoard(this.board);
    const result = tap(this.board, row, col);

    if (result.waves.length === 0) {
      this.board = result.board;
      this.pulse = new Set([`${row}:${col}`]);
      this.redraw();
      await this.delay(120);
      this.pulse.clear();
      this.redraw();
    } else {
      this.board = before;
      for (const wave of result.waves) {
        this.pulse = new Set(wave.bursts.map(p => `${p.row}:${p.col}`));
        this.redraw();
        await this.delay(150);
        this.board = cloneBoard(wave.board);
        this.pulse.clear();
        this.redraw();
        await this.delay(90);
      }
      this.board = result.board;
    }

    if (this.board.every(line => line.every(cell => cell === 0))) {
      await this.delay(500);
      this.scenario = (this.scenario + 1) % EXP029_SCENARIOS.length;
      this.board = cloneBoard(EXP029_SCENARIOS[this.scenario]);
      this.redraw();
    }

    this.busy = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => this.time.delayedCall(ms, resolve));
  }

  private redraw(): void {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x102236, 1);
    g.fillRect(0, 0, W, H);

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const state = this.board[r][c];
        const x = OX + c * (CELL + GAP);
        const y = OY + r * (CELL + GAP);

        g.fillStyle(0x091726, 0.82);
        g.fillRoundedRect(x, y, CELL, CELL, 16);
        if (!state) continue;

        const active = this.pulse.has(`${r}:${c}`);
        const radius = active ? 25 : state === 2 ? 21 : 16;
        g.fillStyle(state === 2 ? 0xffd45f : 0x70ead0, active ? 1 : 0.94);
        g.fillCircle(x + CELL / 2, y + CELL / 2, radius);

        if (state === 2) {
          g.lineStyle(3, 0xffffff, 0.36);
          g.strokeCircle(x + CELL / 2, y + CELL / 2, radius + 5);
        }
        if (active) {
          g.lineStyle(4, 0xffffff, 0.7);
          g.strokeCircle(x + CELL / 2, y + CELL / 2, radius + 6);
        }
      }
    }
  }
}
