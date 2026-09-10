import Phaser from 'phaser';
import { createPredictionScenario, isPredictionScenarioId, type PredictionScenario } from '../experiments/exp023-prediction';
import { simulateToy } from '../simulation/simulate';
import { createToyWorld, type Agent, type Cell, type CellId, type WorldState } from '../world/model';

interface Point { x: number; y: number }
interface CellShape { id: CellId; points: Point[] }

const GAME_WIDTH = 390;
const GAME_HEIGHT = 760;
const CELL = 36;
const HEIGHT_PX = 22;
const ORIGIN_X = -21;
const ORIGIN_Y = 16;
const WORLD_LIP = 18;
const GROUND = [0x6edb8f, 0x7bde97, 0x68d6a0, 0x8dde8b, 0x72d8ae];

export class WorldScene extends Phaser.Scene {
  private world: WorldState = createToyWorld();
  private predictionScenario: PredictionScenario | null = null;
  private predictionDone = false;
  private visualHeights = new Map<CellId, number>();
  private cellShapes: CellShape[] = [];
  private agentPositions = new Map<Agent['id'], Point>();
  private board!: Phaser.GameObjects.Graphics;
  private actors!: Phaser.GameObjects.Graphics;
  private selected: CellId | null = null;
  private pulse = 0;

  constructor() { super('world'); }

  create(): void {
    const requested = new URLSearchParams(window.location.search).get('prediction');
    if (isPredictionScenarioId(requested)) {
      this.predictionScenario = createPredictionScenario(requested);
      this.world = this.predictionScenario.world;
    }

    this.board = this.add.graphics();
    this.actors = this.add.graphics();
    for (const c of Object.values(this.world.cells)) this.visualHeights.set(c.id, c.height);
    for (const a of this.world.agents) this.agentPositions.set(a.id, this.positionForCell(this.world.cells[a.cellId]));

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      const hit = [...this.cellShapes].reverse().find(s => pointInPolygon(p.x, p.y, s.points));
      if (!hit) return;
      if (this.predictionScenario) {
        if (this.predictionDone || hit.id !== this.predictionScenario.targetCellId) return;
        this.predictionDone = true;
      }

      this.selected = hit.id;
      const before = this.world.agents[0].cellId;
      const result = simulateToy(this.world, { type: 'PRESS_CELL', cellId: hit.id });
      this.world = result.state;
      if (this.world.agents[0].cellId !== before) this.pulse = 1;
    });

    this.redraw(0);
  }

  update(time: number, delta: number): void {
    const terrainEase = 1 - Math.exp(-delta / 90);
    const actorEase = 1 - Math.exp(-delta / 105);
    this.pulse = Math.max(0, this.pulse - delta / 230);

    for (const c of Object.values(this.world.cells)) {
      const visible = this.visualHeights.get(c.id) ?? c.height;
      this.visualHeights.set(c.id, visible + (c.height - visible) * terrainEase);
    }
    for (const a of this.world.agents) {
      const current = this.agentPositions.get(a.id) ?? this.positionForCell(this.world.cells[a.cellId]);
      const target = this.positionForCell(this.world.cells[a.cellId]);
      this.agentPositions.set(a.id, {
        x: current.x + (target.x - current.x) * actorEase,
        y: current.y + (target.y - current.y) * actorEase,
      });
    }
    this.redraw(time);
  }

  private redraw(time: number): void {
    this.board.clear();
    this.actors.clear();
    this.cellShapes = [];
    this.board.fillStyle(0x173f49, 1);
    this.board.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const bottom = ORIGIN_Y + this.world.rows * CELL;
    this.board.fillStyle(0x356f5f, 1);
    this.board.fillRect(0, Math.min(bottom, GAME_HEIGHT - WORLD_LIP), GAME_WIDTH, WORLD_LIP);
    this.board.fillStyle(0x183f3d, 1);
    this.board.fillRect(0, Math.min(bottom + WORLD_LIP, GAME_HEIGHT - 4), GAME_WIDTH, 4);

    for (const c of Object.values(this.world.cells).sort((a, b) => a.row - b.row || a.col - b.col)) this.drawCell(c);
    for (const a of this.world.agents) this.drawAgent(a, time);
  }

  private drawCell(c: Cell): void {
    const visibleHeight = this.visualHeights.get(c.id) ?? c.height;
    const lift = visibleHeight * HEIGHT_PX;
    const x = ORIGIN_X + c.col * CELL;
    const topY = ORIGIN_Y + c.row * CELL - lift;
    const base = GROUND[(c.row * 3 + c.col * 5) % GROUND.length];
    const top: Point[] = [
      { x, y: topY }, { x: x + CELL, y: topY },
      { x: x + CELL, y: topY + CELL }, { x, y: topY + CELL },
    ];
    const face = Math.max(4, lift * .9);

    this.board.fillStyle(0x102f34, .18);
    this.board.fillRect(x + 3, topY + CELL + face, CELL - 1, 4 + face * .22);
    this.board.fillStyle(shade(base, .55), 1);
    this.board.fillRect(x, topY + CELL, CELL, face);
    this.board.fillStyle(shade(base, .72), .96);
    this.board.fillRect(x + CELL - 3, topY + 2, 3, CELL + face - 2);
    this.board.fillStyle(base, 1);
    this.board.fillRect(x + .7, topY + .7, CELL - 1.4, CELL - 1.4);

    const prompted = this.predictionScenario && !this.predictionDone && this.predictionScenario.targetCellId === c.id;
    const selected = this.selected === c.id;
    this.board.lineStyle(prompted ? 3 : selected ? 2.4 : .7, prompted ? 0xfff4b0 : selected ? 0xffffff : 0x245e55, prompted ? 1 : selected ? .95 : .18);
    this.strokePolygon(top);
    this.cellShapes.push({ id: c.id, points: top });
  }

  private drawAgent(a: Agent, time: number): void {
    const p = this.agentPositions.get(a.id);
    if (!p) return;
    const bob = Math.sin(time / 170) * 1.2;
    const y = p.y + bob;
    const r = 10 + this.pulse * 2.2;

    this.actors.fillStyle(0x173f49, .18);
    this.actors.fillEllipse(p.x + 1, y + 11, 22, 7);
    if (this.pulse > 0) {
      this.actors.lineStyle(3, 0xffffff, this.pulse * .65);
      this.actors.strokeCircle(p.x, y, r + 6 * this.pulse);
    }
    this.actors.lineStyle(5, 0xffd95a, 1);
    this.actors.strokeCircle(p.x, y, r);
    this.actors.lineStyle(1.2, 0xfff1a8, .85);
    this.actors.strokeCircle(p.x, y, r - 3.2);
    this.actors.fillStyle(0x173f49, .78);
    this.actors.fillCircle(p.x - 3, y - 1.8, 1.25);
    this.actors.fillCircle(p.x + 3, y - 1.8, 1.25);
  }

  private positionForCell(c: Cell): Point {
    const h = this.visualHeights.get(c.id) ?? c.height;
    return { x: ORIGIN_X + c.col * CELL + CELL / 2, y: ORIGIN_Y + c.row * CELL + CELL / 2 - h * HEIGHT_PX };
  }

  private strokePolygon(points: Point[]): void {
    this.board.beginPath();
    this.board.moveTo(points[0].x, points[0].y);
    for (const p of points.slice(1)) this.board.lineTo(p.x, p.y);
    this.board.closePath();
    this.board.strokePath();
  }
}

function shade(color: number, factor: number): number {
  const r = Math.round(((color >> 16) & 255) * factor);
  const g = Math.round(((color >> 8) & 255) * factor);
  const b = Math.round((color & 255) * factor);
  return (r << 16) | (g << 8) | b;
}

function pointInPolygon(x: number, y: number, points: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i], b = points[j];
    const cross = (a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x;
    if (cross) inside = !inside;
  }
  return inside;
}
