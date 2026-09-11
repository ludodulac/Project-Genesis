import Phaser from 'phaser';
import {
  advanceFlow,
  createGuidedFlowState,
  getFlowCell,
  pressFlowCell,
  type GuidedFlowState,
  type GuidedFlowVariant,
} from '../experiments/exp035-guided-flow';

const CELL = 42;
const HEIGHT_PX = 11;
const ORIGIN_X = 48;
const ORIGIN_Y = 220;
const GROUND = [0x76d89b, 0x6fd29c, 0x82dca0, 0x72d5a7];

type Point = { x: number; y: number };

export class GuidedFlowScene extends Phaser.Scene {
  private state!: GuidedFlowState;
  private visualHeights = new Map<string, number>();
  private moteVisual = new Phaser.Math.Vector2();
  private board!: Phaser.GameObjects.Graphics;
  private actors!: Phaser.GameObjects.Graphics;
  private pulse = 0;

  constructor() { super('guided-flow'); }

  create() {
    const requested = new URLSearchParams(window.location.search).get('ablation');
    const variant: GuidedFlowVariant = requested === 'edit-only' || requested === 'flow-only' ? requested : 'coupled';
    this.state = createGuidedFlowState(variant);

    this.board = this.add.graphics();
    this.actors = this.add.graphics();
    for (const cell of this.state.cells) this.visualHeights.set(this.key(cell.row, cell.col), cell.height);

    const start = this.cellCenter(this.state.mote.row, this.state.mote.col);
    this.moteVisual.set(start.x, start.y);

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.state.arrived) return;
      const cell = this.closestCell(pointer.x, pointer.y);
      if (!cell) return;
      const next = pressFlowCell(this.state, cell.row, cell.col);
      if (next !== this.state) {
        this.state = next;
        this.pulse = Math.max(this.pulse, 0.35);
      }
    });

    this.time.addEvent({
      delay: 820,
      loop: true,
      callback: () => {
        const before = this.state;
        const next = advanceFlow(before);
        if (next !== before) {
          this.state = next;
          this.pulse = this.state.arrived ? 1 : 0.55;
        }
      },
    });
  }

  update(_: number, delta: number) {
    const terrainEase = 1 - Math.exp(-delta / 95);
    const moteEase = 1 - Math.exp(-delta / 120);
    this.pulse = Math.max(0, this.pulse - delta / 420);

    for (const cell of this.state.cells) {
      const key = this.key(cell.row, cell.col);
      const shown = this.visualHeights.get(key) ?? cell.height;
      this.visualHeights.set(key, shown + (cell.height - shown) * terrainEase);
    }

    const target = this.cellCenter(this.state.mote.row, this.state.mote.col);
    this.moteVisual.x += (target.x - this.moteVisual.x) * moteEase;
    this.moteVisual.y += (target.y - this.moteVisual.y) * moteEase;
    this.redraw();
  }

  private redraw() {
    this.board.clear();
    this.actors.clear();
    this.cameras.main.setBackgroundColor('#173f49');

    this.board.fillStyle(0x12343b, 1);
    this.board.fillRoundedRect(28, 152, 334, 384, 28);

    const ordered = [...this.state.cells].sort((a, b) => a.row - b.row || a.col - b.col);
    for (const cell of ordered) {
      const height = this.visualHeights.get(this.key(cell.row, cell.col)) ?? cell.height;
      const x = ORIGIN_X + cell.col * CELL;
      const y = ORIGIN_Y + cell.row * CELL - height * HEIGHT_PX;
      const face = Math.max(5, height * 7);
      const base = GROUND[(cell.row * 3 + cell.col * 5) % GROUND.length];

      this.board.fillStyle(0x0d2c31, 0.22);
      this.board.fillRoundedRect(x + 2, y + CELL + face - 1, CELL - 3, 6, 3);
      this.board.fillStyle(this.shade(base, 0.57), 1);
      this.board.fillRect(x, y + CELL - 1, CELL - 2, face);
      this.board.fillStyle(base, 1);
      this.board.fillRoundedRect(x, y, CELL - 2, CELL - 2, 5);
      this.board.lineStyle(1, 0x174b49, 0.28);
      this.board.strokeRoundedRect(x, y, CELL - 2, CELL - 2, 5);
    }

    const goal = this.cellCenter(this.state.goal.row, this.state.goal.col);
    const goalPulse = 1 + Math.sin(this.time.now / 260) * 0.08;
    this.actors.lineStyle(5, 0xd7fff0, 0.95);
    this.actors.strokeCircle(goal.x, goal.y, 16 * goalPulse);
    this.actors.lineStyle(2, 0x73f3c2, 0.8);
    this.actors.strokeCircle(goal.x, goal.y, 23 * goalPulse);

    const r = 10 + this.pulse * 2.5;
    this.actors.fillStyle(0x102f34, 0.22);
    this.actors.fillEllipse(this.moteVisual.x + 1, this.moteVisual.y + 12, 24, 7);
    if (this.pulse > 0) {
      this.actors.lineStyle(3, 0xffffff, this.pulse * 0.65);
      this.actors.strokeCircle(this.moteVisual.x, this.moteVisual.y, r + 7 * this.pulse);
    }
    this.actors.lineStyle(5, 0xffd95a, 1);
    this.actors.strokeCircle(this.moteVisual.x, this.moteVisual.y, r);
    this.actors.lineStyle(1.2, 0xfff1a8, 0.9);
    this.actors.strokeCircle(this.moteVisual.x, this.moteVisual.y, r - 3.2);
  }

  private closestCell(x: number, y: number): { row: number; col: number } | null {
    let best: { row: number; col: number; distance: number } | null = null;
    for (const cell of this.state.cells) {
      const center = this.cellCenter(cell.row, cell.col);
      const distance = Phaser.Math.Distance.Between(x, y, center.x, center.y);
      if (distance <= 27 && (!best || distance < best.distance)) best = { row: cell.row, col: cell.col, distance };
    }
    return best ? { row: best.row, col: best.col } : null;
  }

  private cellCenter(row: number, col: number): Point {
    const cell = getFlowCell(this.state, row, col)!;
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
