import Phaser from 'phaser';
import { clone030, EXP030_SCENARIOS, tap030, type Board } from '../experiments/exp030-discovery';

const W = 390, H = 760, N = 4, CELL = 62, GAP = 10;
const OX = (W - (N * CELL + (N - 1) * GAP)) / 2, OY = 230;

export class DiscoveryScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private scenario = 0;
  private board: Board = clone030(EXP030_SCENARIOS[0]);
  private busy = false;
  private pulse = new Set<string>();

  constructor() { super('discovery'); }

  create(): void {
    this.gfx = this.add.graphics();
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.busy) return;
      const col = Math.floor((p.x - OX) / (CELL + GAP));
      const row = Math.floor((p.y - OY) / (CELL + GAP));
      if (row < 0 || row >= N || col < 0 || col >= N) return;
      const x = OX + col * (CELL + GAP), y = OY + row * (CELL + GAP);
      if (p.x > x + CELL || p.y > y + CELL || this.board[row][col] === 0) return;
      void this.play(row, col);
    });
    this.redraw();
  }

  private async play(row: number, col: number): Promise<void> {
    this.busy = true;
    const before = clone030(this.board);
    const result = tap030(this.board, row, col);
    if (!result.waves.length) {
      this.board = result.board;
      this.pulse = new Set([`${row}:${col}`]); this.redraw();
      await this.delay(130); this.pulse.clear(); this.redraw();
    } else {
      this.board = before;
      for (const wave of result.waves) {
        this.pulse = new Set(wave.bursts.map(p => `${p.row}:${p.col}`)); this.redraw();
        await this.delay(150); this.board = clone030(wave.board); this.pulse.clear(); this.redraw();
        await this.delay(90);
      }
      this.board = result.board;
    }
    if (this.board.every(line => line.every(cell => cell === 0))) {
      await this.delay(550);
      this.scenario = (this.scenario + 1) % EXP030_SCENARIOS.length;
      this.board = clone030(EXP030_SCENARIOS[this.scenario]); this.redraw();
    }
    this.busy = false;
  }

  private delay(ms: number): Promise<void> { return new Promise(resolve => this.time.delayedCall(ms, resolve)); }

  private redraw(): void {
    const g = this.gfx; g.clear(); g.fillStyle(0x102236, 1); g.fillRect(0, 0, W, H);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const state = this.board[r][c], x = OX + c * (CELL + GAP), y = OY + r * (CELL + GAP);
      g.fillStyle(0x091726, 0.82); g.fillRoundedRect(x, y, CELL, CELL, 16);
      if (!state) continue;
      const active = this.pulse.has(`${r}:${c}`), radius = active ? 25 : state === 2 ? 21 : state === 3 ? 19 : 16;
      g.fillStyle(state === 3 ? 0xd993ff : state === 2 ? 0xffd45f : 0x70ead0, active ? 1 : 0.94);
      if (state === 3) g.fillRoundedRect(x + CELL / 2 - radius, y + CELL / 2 - radius, radius * 2, radius * 2, 7);
      else g.fillCircle(x + CELL / 2, y + CELL / 2, radius);
      if (state === 2) { g.lineStyle(3, 0xffffff, 0.36); g.strokeCircle(x + CELL / 2, y + CELL / 2, radius + 5); }
      if (active) { g.lineStyle(4, 0xffffff, 0.7); g.strokeCircle(x + CELL / 2, y + CELL / 2, radius + 6); }
    }
  }
}
