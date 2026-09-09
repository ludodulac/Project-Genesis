import Phaser from 'phaser';
import { simulate } from '../simulation/simulate';
import { createInitialWorld, type Agent, type Cell, type CellId, type WorldState } from '../world/model';

interface Point { x: number; y: number }
interface CellShape { id: CellId; points: Point[] }

const GAME_WIDTH = 390;
const GAME_HEIGHT = 760;

// EXP-006 — DIRIGER LE VIVANT
// The world is now an orthogonal square grid that fills the phone. It extends
// past the lateral viewport and exposes only a small lower "step", suggesting
// that the visible board is a fragment of a larger mysterious world.
const CELL = 36;
const HEIGHT_PX = 8;
const ORIGIN_X = -21;
const ORIGIN_Y = 10;
const WORLD_LIP = 14;

const GROUND = [0x6edb8f, 0x7bde97, 0x68d6a0, 0x8dde8b, 0x72d8ae];
const WATER = 0x42bdec;
const AGENT_COLORS: Record<Agent['id'], number> = {
  'mote-a': 0xffd95a,
  'mote-b': 0xff846d,
  'mote-c': 0xf7f2df,
};

export class WorldScene extends Phaser.Scene {
  private world: WorldState = createInitialWorld();
  private visualHeights = new Map<CellId, number>();
  private cellShapes: CellShape[] = [];
  private agentPositions = new Map<Agent['id'], Point>();
  private board!: Phaser.GameObjects.Graphics;
  private actors!: Phaser.GameObjects.Graphics;
  private selected: CellId | null = null;

  constructor() { super('world'); }

  create(): void {
    this.board = this.add.graphics();
    this.actors = this.add.graphics();

    for (const cell of Object.values(this.world.cells)) {
      this.visualHeights.set(cell.id, cell.height);
    }
    for (const agent of this.world.agents) {
      this.agentPositions.set(agent.id, this.positionForCell(this.world.cells[agent.cellId]));
    }

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const hit = [...this.cellShapes].reverse().find((shape) => pointInPolygon(pointer.x, pointer.y, shape.points));
      if (!hit) return;
      this.selected = hit.id;
      this.world = simulate(this.world, { type: 'RAISE_CELL', cellId: hit.id }).state;
    });

    this.redraw(0);
  }

  update(time: number, delta: number): void {
    const terrainSmoothing = 1 - Math.exp(-delta / 110);
    const actorSmoothing = 1 - Math.exp(-delta / 125);

    for (const cell of Object.values(this.world.cells)) {
      const current = this.visualHeights.get(cell.id) ?? cell.height;
      this.visualHeights.set(cell.id, current + (cell.height - current) * terrainSmoothing);
    }

    for (const agent of this.world.agents) {
      const current = this.agentPositions.get(agent.id) ?? this.positionForCell(this.world.cells[agent.cellId]);
      const target = this.positionForCell(this.world.cells[agent.cellId]);
      this.agentPositions.set(agent.id, {
        x: current.x + (target.x - current.x) * actorSmoothing,
        y: current.y + (target.y - current.y) * actorSmoothing,
      });
    }

    this.redraw(time);
  }

  private redraw(time: number): void {
    this.board.clear();
    this.actors.clear();
    this.cellShapes = [];

    // The void is only visible below the small physical edge of the world.
    this.board.fillStyle(0x173f49, 1);
    this.board.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const worldBottom = ORIGIN_Y + this.world.rows * CELL;
    this.board.fillStyle(0x356f5f, 1);
    this.board.fillRect(0, Math.min(worldBottom, GAME_HEIGHT - WORLD_LIP), GAME_WIDTH, WORLD_LIP);
    this.board.fillStyle(0x24554f, 1);
    this.board.fillRect(0, Math.min(worldBottom + WORLD_LIP, GAME_HEIGHT - 3), GAME_WIDTH, 3);

    const cells = Object.values(this.world.cells).sort((a, b) => a.row - b.row || a.col - b.col);
    for (const cell of cells) this.drawCell(cell);

    for (const agent of this.world.agents) this.drawAgent(agent, time);
  }

  private drawCell(cell: Cell): void {
    const visualHeight = this.visualHeights.get(cell.id) ?? cell.height;
    const lift = visualHeight * HEIGHT_PX;
    const x = ORIGIN_X + cell.col * CELL;
    const baseY = ORIGIN_Y + cell.row * CELL;
    const topY = baseY - lift;

    const top: Point[] = [
      { x, y: topY },
      { x: x + CELL, y: topY },
      { x: x + CELL, y: topY + CELL },
      { x, y: topY + CELL },
    ];

    const baseColor = cell.kind === 'water-source'
      ? WATER
      : GROUND[(cell.row * 3 + cell.col * 5) % GROUND.length];

    // A narrow lower face keeps the terrain volumetric without rotating the grid.
    const faceHeight = Math.max(2, lift * 0.72);
    this.board.fillStyle(shade(baseColor, 0.70), 1);
    this.board.fillRect(x, topY + CELL, CELL, faceHeight);

    this.board.fillStyle(baseColor, 1);
    this.board.fillRect(x + 0.6, topY + 0.6, CELL - 1.2, CELL - 1.2);

    if (cell.kind === 'water-source') {
      this.board.fillStyle(0xbceeff, 0.82);
      this.board.fillCircle(x + CELL * 0.38, topY + CELL * 0.36, CELL * 0.11);
      this.board.fillStyle(0xffffff, 0.38);
      this.board.fillCircle(x + CELL * 0.31, topY + CELL * 0.29, CELL * 0.045);
    }

    this.board.lineStyle(
      this.selected === cell.id ? 2.2 : 0.7,
      this.selected === cell.id ? 0xffffff : 0x245e55,
      this.selected === cell.id ? 0.92 : 0.18,
    );
    this.strokePolygon(top);
    this.cellShapes.push({ id: cell.id, points: top });
  }

  private drawAgent(agent: Agent, time: number): void {
    const p = this.agentPositions.get(agent.id);
    if (!p) return;

    const bob = Math.sin(time / 230 + (agent.id === 'mote-b' ? 1.8 : agent.id === 'mote-c' ? 3.4 : 0)) * 1.4;
    const y = p.y + bob;

    this.actors.fillStyle(0x173f49, 0.13);
    this.actors.fillEllipse(p.x, y + 9, 19, 6);

    if (agent.carrying === 'water') {
      this.actors.lineStyle(3, 0x59c8f3, 0.95);
      this.actors.strokeCircle(p.x, y, 10.5);
    }

    this.actors.fillStyle(AGENT_COLORS[agent.id], 1);
    this.actors.fillCircle(p.x, y, 8.2);
    this.actors.fillStyle(0x173f49, 0.75);
    this.actors.fillCircle(p.x - 2.5, y - 1.5, 1.1);
    this.actors.fillCircle(p.x + 2.5, y - 1.5, 1.1);
  }

  private positionForCell(cell: Cell): Point {
    const height = this.visualHeights.get(cell.id) ?? cell.height;
    return {
      x: ORIGIN_X + cell.col * CELL + CELL / 2,
      y: ORIGIN_Y + cell.row * CELL + CELL / 2 - height * HEIGHT_PX,
    };
  }

  private strokePolygon(points: Point[]): void {
    this.board.beginPath();
    this.board.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) this.board.lineTo(point.x, point.y);
    this.board.closePath();
    this.board.strokePath();
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
    const a = points[i];
    const b = points[j];
    const crosses = (a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x;
    if (crosses) inside = !inside;
  }
  return inside;
}
