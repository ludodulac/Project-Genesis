import Phaser from 'phaser';
import {
  createWatershedState,
  getWatershedCell,
  playWatershedTurn,
  type WatershedState,
} from '../game/living-watershed';

const CELL = 42;
const HEIGHT_PX = 10;
const ORIGIN_X = 48;
const ORIGIN_Y = 205;
const GROUND = [0x77d79d, 0x71d2a0, 0x83dda4, 0x74d5aa];

type Point = { x: number; y: number };

export class LivingWatershedScene extends Phaser.Scene {
  private state!: WatershedState;
  private visualHeights = new Map<string, number>();
  private pulseVisuals = new Map<number, Phaser.Math.Vector2>();
  private board!: Phaser.GameObjects.Graphics;
  private actors!: Phaser.GameObjects.Graphics;
  private fx!: Phaser.GameObjects.Graphics;
  private outcomeAge = 0;
  private impact = 0;

  constructor() { super('living-watershed'); }

  create() {
    this.board = this.add.graphics();
    this.actors = this.add.graphics();
    this.fx = this.add.graphics();
    this.resetGame();

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.state.outcome !== 'playing') {
        if (this.outcomeAge > 500) this.resetGame();
        return;
      }
      const cell = this.closestCell(pointer.x, pointer.y);
      if (!cell) return;
      const beforeIds = new Set(this.state.pulses.map((pulse) => pulse.id));
      this.state = playWatershedTurn(this.state, cell.row, cell.col);
      for (const pulse of this.state.pulses) {
        if (!beforeIds.has(pulse.id)) {
          const source = this.cellCenter(this.state.source.row, this.state.source.col);
          this.pulseVisuals.set(pulse.id, new Phaser.Math.Vector2(source.x, source.y));
        }
      }
      this.impact = this.state.outcome === 'playing' ? 0.45 : 1;
      if (this.state.outcome !== 'playing') this.outcomeAge = 0;
    });
  }

  update(_: number, delta: number) {
    const terrainEase = 1 - Math.exp(-delta / 90);
    const actorEase = 1 - Math.exp(-delta / 115);
    this.impact = Math.max(0, this.impact - delta / 430);
    if (this.state.outcome !== 'playing') this.outcomeAge += delta;

    for (const cell of this.state.cells) {
      const key = this.key(cell.row, cell.col);
      const shown = this.visualHeights.get(key) ?? cell.height;
      this.visualHeights.set(key, shown + (cell.height - shown) * terrainEase);
    }

    for (const pulse of this.state.pulses) {
      let visual = this.pulseVisuals.get(pulse.id);
      if (!visual) {
        const p = this.cellCenter(pulse.row, pulse.col);
        visual = new Phaser.Math.Vector2(p.x, p.y);
        this.pulseVisuals.set(pulse.id, visual);
      }
      const target = this.cellCenter(pulse.row, pulse.col);
      visual.x += (target.x - visual.x) * actorEase;
      visual.y += (target.y - visual.y) * actorEase;
    }

    this.redraw();
  }

  private resetGame() {
    this.state = createWatershedState();
    this.visualHeights.clear();
    this.pulseVisuals.clear();
    this.outcomeAge = 0;
    this.impact = 0;
    for (const cell of this.state.cells) this.visualHeights.set(this.key(cell.row, cell.col), cell.height);
    for (const pulse of this.state.pulses) {
      const p = this.cellCenter(pulse.row, pulse.col);
      this.pulseVisuals.set(pulse.id, new Phaser.Math.Vector2(p.x, p.y));
    }
  }

  private redraw() {
    this.board.clear();
    this.actors.clear();
    this.fx.clear();
    this.cameras.main.setBackgroundColor(this.state.outcome === 'lost' ? '#263c40' : '#173f49');

    this.board.fillStyle(0x12343b, 1);
    this.board.fillRoundedRect(28, 140, 334, 404, 28);

    for (const cell of [...this.state.cells].sort((a, b) => a.row - b.row || a.col - b.col)) {
      const height = this.visualHeights.get(this.key(cell.row, cell.col)) ?? cell.height;
      const x = ORIGIN_X + cell.col * CELL;
      const y = ORIGIN_Y + cell.row * CELL - height * HEIGHT_PX;
      const face = Math.max(5, height * 6);
      const base = GROUND[(cell.row * 3 + cell.col * 5) % GROUND.length];
      const dim = this.state.outcome === 'lost' ? 0.68 : 1;
      const top = this.shade(base, dim);

      this.board.fillStyle(0x0d2c31, 0.22);
      this.board.fillRoundedRect(x + 2, y + CELL + face - 1, CELL - 3, 6, 3);
      this.board.fillStyle(this.shade(base, 0.55 * dim), 1);
      this.board.fillRect(x, y + CELL - 1, CELL - 2, face);
      this.board.fillStyle(top, 1);
      this.board.fillRoundedRect(x, y, CELL - 2, CELL - 2, 5);
      this.board.lineStyle(1, 0x174b49, 0.3);
      this.board.strokeRoundedRect(x, y, CELL - 2, CELL - 2, 5);
    }

    const source = this.cellCenter(this.state.source.row, this.state.source.col);
    this.actors.fillStyle(0x6de8ff, 0.22);
    this.actors.fillCircle(source.x, source.y, 18 + Math.sin(this.time.now / 240) * 2);
    this.actors.lineStyle(4, 0x9df4ff, 0.95);
    this.actors.strokeCircle(source.x, source.y, 13);

    for (const garden of this.state.gardens) {
      const p = this.cellCenter(garden.row, garden.col);
      const color = garden.side === 'left' ? 0xffd95a : 0xf4a8ff;
      const pulse = 1 + Math.sin(this.time.now / 300 + (garden.side === 'left' ? 0 : 1.4)) * 0.07;
      this.actors.fillStyle(color, garden.wet ? 0.22 : 0.07);
      this.actors.fillCircle(p.x, p.y, 18 * pulse);
      this.actors.lineStyle(4, color, garden.wet ? 1 : 0.82);
      this.actors.strokeCircle(p.x, p.y, 14 * pulse);
      if (garden.wet) {
        this.actors.lineStyle(2, 0xffffff, 0.75);
        this.actors.strokeCircle(p.x, p.y, 7 * pulse);
      }
    }

    const village = this.cellCenter(this.state.village.row, this.state.village.col);
    this.actors.fillStyle(0xff7e73, 0.2);
    this.actors.fillRoundedRect(village.x - 14, village.y - 13, 28, 26, 7);
    this.actors.lineStyle(4, 0xff9b91, 0.95);
    this.actors.strokeRoundedRect(village.x - 12, village.y - 11, 24, 22, 6);
    this.actors.lineBetween(village.x - 8, village.y - 11, village.x, village.y - 18);
    this.actors.lineBetween(village.x, village.y - 18, village.x + 8, village.y - 11);

    for (const pulse of this.state.pulses) {
      const p = this.pulseVisuals.get(pulse.id)!;
      this.actors.fillStyle(0x12343b, 0.25);
      this.actors.fillEllipse(p.x + 1, p.y + 10, 20, 6);
      this.actors.fillStyle(0x6de8ff, 0.9);
      this.actors.fillCircle(p.x, p.y, 8 + this.impact * 1.5);
      this.actors.lineStyle(2, 0xcffbff, 0.9);
      this.actors.strokeCircle(p.x, p.y, 10 + this.impact);
    }

    const remaining = Math.max(0, this.state.maxTurns - this.state.turn);
    const dotGap = 17;
    const width = this.state.maxTurns * dotGap;
    const startX = 195 - width / 2 + dotGap / 2;
    for (let i = 0; i < this.state.maxTurns; i += 1) {
      this.fx.fillStyle(0xd7fff0, i < remaining ? 0.72 : 0.12);
      this.fx.fillCircle(startX + i * dotGap, 112, 3.5);
    }

    if (this.state.outcome === 'won') {
      const glow = 0.45 + Math.sin(this.time.now / 220) * 0.12;
      this.fx.fillStyle(0xd7fff0, glow);
      this.fx.fillCircle(195, 618, 34 + this.impact * 9);
      this.fx.lineStyle(5, 0x76f4bd, 0.95);
      this.fx.strokeCircle(195, 618, 24);
      this.fx.lineBetween(183, 618, 192, 627);
      this.fx.lineBetween(192, 627, 210, 607);
    } else if (this.state.outcome === 'lost') {
      this.fx.lineStyle(6, 0xff8d84, 0.9);
      this.fx.strokeCircle(195, 618, 24 + this.impact * 5);
      this.fx.lineBetween(185, 608, 205, 628);
      this.fx.lineBetween(205, 608, 185, 628);
    }
  }

  private closestCell(x: number, y: number): { row: number; col: number } | null {
    let best: { row: number; col: number; distance: number } | null = null;
    for (const cell of this.state.cells) {
      const p = this.cellCenter(cell.row, cell.col);
      const distance = Phaser.Math.Distance.Between(x, y, p.x, p.y);
      if (distance <= 27 && (!best || distance < best.distance)) best = { row: cell.row, col: cell.col, distance };
    }
    return best ? { row: best.row, col: best.col } : null;
  }

  private cellCenter(row: number, col: number): Point {
    const cell = getWatershedCell(this.state, row, col)!;
    const height = this.visualHeights.get(this.key(row, col)) ?? cell.height;
    return {
      x: ORIGIN_X + col * CELL + (CELL - 2) / 2,
      y: ORIGIN_Y + row * CELL + (CELL - 2) / 2 - height * HEIGHT_PX,
    };
  }

  private key(row: number, col: number) { return `${row}:${col}`; }

  private shade(color: number, factor: number): number {
    const r = Math.round(((color >> 16) & 255) * factor);
    const g = Math.round(((color >> 8) & 255) * factor);
    const b = Math.round((color & 255) * factor);
    return (r << 16) | (g << 8) | b;
  }
}
