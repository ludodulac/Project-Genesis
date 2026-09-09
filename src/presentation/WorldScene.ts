import Phaser from 'phaser';
import { simulate } from '../simulation/simulate';
import { createInitialWorld, type Cell, type CellId, type WorldState } from '../world/model';

interface Point { x: number; y: number }
interface CellShape { id: CellId; points: Point[] }

const GAME_WIDTH = 390;
const GAME_HEIGHT = 760;

// EXP-005: dense full-screen terrain.
// Keep the balanced near-top-down angle, but increase terrain density and let
// the board extend beyond the viewport edges so the screen feels like the world.
const TILE_W = 54;
const TILE_H = 45;
const HEIGHT_PX = 12;
const ORIGIN_X = GAME_WIDTH / 2;
const ORIGIN_Y = 118;

const PALETTE = [0x6edb8f, 0x81e19c, 0x65d7a0, 0x98df88, 0x74d7b2];

export class WorldScene extends Phaser.Scene {
  private world: WorldState = createInitialWorld();
  private visualHeights = new Map<CellId, number>();
  private cellShapes: CellShape[] = [];
  private board!: Phaser.GameObjects.Graphics;
  private orbLayer!: Phaser.GameObjects.Graphics;
  private selected: CellId | null = null;
  private orbX = ORIGIN_X;
  private orbY = ORIGIN_Y;

  constructor() { super('world'); }

  create(): void {
    this.board = this.add.graphics();
    this.orbLayer = this.add.graphics();
    for (const cell of Object.values(this.world.cells)) this.visualHeights.set(cell.id, cell.height);

    const initialOrb = this.positionForCell(this.world.cells[this.world.orb.cellId], true);
    this.orbX = initialOrb.x;
    this.orbY = initialOrb.y;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const hit = [...this.cellShapes].reverse().find((shape) => pointInPolygon(pointer.x, pointer.y, shape.points));
      if (!hit) return;
      this.selected = hit.id;
      this.world = simulate(this.world, { type: 'RAISE_CELL', cellId: hit.id }).state;
    });

    this.redraw(0);
  }

  update(time: number, delta: number): void {
    const smoothing = 1 - Math.exp(-delta / 105);
    for (const cell of Object.values(this.world.cells)) {
      const current = this.visualHeights.get(cell.id) ?? cell.height;
      this.visualHeights.set(cell.id, current + (cell.height - current) * smoothing);
    }

    const orbTarget = this.positionForCell(this.world.cells[this.world.orb.cellId], true);
    this.orbX += (orbTarget.x - this.orbX) * (1 - Math.exp(-delta / 145));
    this.orbY += (orbTarget.y - this.orbY) * (1 - Math.exp(-delta / 145));
    this.redraw(time);
  }

  private redraw(time: number): void {
    this.board.clear();
    this.orbLayer.clear();
    this.cellShapes = [];

    this.board.fillStyle(0xcff4e4, 1);
    this.board.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const cells = Object.values(this.world.cells).sort((a, b) => (a.row + a.col) - (b.row + b.col) || a.row - b.row);
    for (const cell of cells) this.drawCell(cell);

    const bob = Math.sin(time / 260) * 1.5;
    this.orbLayer.fillStyle(0x183d55, 0.11);
    this.orbLayer.fillEllipse(this.orbX, this.orbY + 8, 22, 7);
    this.orbLayer.fillStyle(0xffd84f, 1);
    this.orbLayer.fillCircle(this.orbX, this.orbY - 1 + bob, 10.5);
    this.orbLayer.fillStyle(0xfff2a6, 0.95);
    this.orbLayer.fillCircle(this.orbX - 3.5, this.orbY - 5.5 + bob, 3.1);
  }

  private drawCell(cell: Cell): void {
    const visualHeight = this.visualHeights.get(cell.id) ?? cell.height;
    const center = this.positionFor(cell.row, cell.col, visualHeight);
    const lift = 3 + visualHeight * 5;
    const top: Point[] = [
      { x: center.x, y: center.y - TILE_H / 2 },
      { x: center.x + TILE_W / 2, y: center.y },
      { x: center.x, y: center.y + TILE_H / 2 },
      { x: center.x - TILE_W / 2, y: center.y },
    ];
    const rightSide = [top[1], top[2], { x: top[2].x, y: top[2].y + lift }, { x: top[1].x, y: top[1].y + lift }];
    const leftSide = [top[2], top[3], { x: top[3].x, y: top[3].y + lift }, { x: top[2].x, y: top[2].y + lift }];

    const baseColor = PALETTE[(cell.row * 2 + cell.col) % PALETTE.length];
    this.fillPolygon(rightSide, shade(baseColor, 0.84));
    this.fillPolygon(leftSide, shade(baseColor, 0.76));
    this.fillPolygon(top, baseColor);
    this.board.lineStyle(this.selected === cell.id ? 2.4 : 0.85, this.selected === cell.id ? 0xffffff : 0x2e816e, this.selected === cell.id ? 0.95 : 0.18);
    this.strokePolygon(top);
    this.cellShapes.push({ id: cell.id, points: top });
  }

  private positionForCell(cell: Cell, orb = false): Point {
    const height = this.visualHeights.get(cell.id) ?? cell.height;
    const point = this.positionFor(cell.row, cell.col, height);
    return orb ? { x: point.x, y: point.y - TILE_H / 2 - 5 } : point;
  }

  private positionFor(row: number, col: number, height: number): Point {
    return {
      x: ORIGIN_X + (col - row) * (TILE_W / 2),
      y: ORIGIN_Y + (col + row) * (TILE_H / 2) - height * HEIGHT_PX,
    };
  }

  private fillPolygon(points: Point[], color: number): void {
    this.board.fillStyle(color, 1);
    this.board.beginPath(); this.board.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) this.board.lineTo(point.x, point.y);
    this.board.closePath(); this.board.fillPath();
  }

  private strokePolygon(points: Point[]): void {
    this.board.beginPath(); this.board.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) this.board.lineTo(point.x, point.y);
    this.board.closePath(); this.board.strokePath();
  }
}

function shade(color: number, factor: number): number {
  const r = Math.round(((color >> 16) & 0xff) * factor);
  const g = Math.round(((color >> 8) & 0xff) * factor);
  const b = Math.round((color & 0xff) * factor);
  return (r << 16) | (g << 8) | b;
}

function pointInPolygon(x: number, y: number, points: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i]; const b = points[j];
    const crosses = (a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x;
    if (crosses) inside = !inside;
  }
  return inside;
}
