import Phaser from 'phaser';
import {
  advanceConflictingFlow,
  createConflictingFlowState,
  getConflictCell,
  pressConflictCell,
  type ConflictVariant,
  type ConflictingFlowState,
} from '../experiments/exp036-conflicting-flow';

const CELL = 42;
const HEIGHT_PX = 11;
const ORIGIN_X = 48;
const ORIGIN_Y = 220;
const GROUND = [0x76d89b, 0x6fd29c, 0x82dca0, 0x72d5a7];

type Point = { x: number; y: number };

export class ConflictingFlowScene extends Phaser.Scene {
  private state!: ConflictingFlowState;
  private visualHeights = new Map<string, number>();
  private moteVisuals = new Map<string, Phaser.Math.Vector2>();
  private board!: Phaser.GameObjects.Graphics;
  private actors!: Phaser.GameObjects.Graphics;
  private pulse = 0;

  constructor() { super('conflicting-flow'); }

  create() {
    const requested = new URLSearchParams(window.location.search).get('ablation');
    const variant: ConflictVariant = requested === 'single' || requested === 'aligned' ? requested : 'conflict';
    this.state = createConflictingFlowState(variant);
    this.board = this.add.graphics();
    this.actors = this.add.graphics();
    for (const cell of this.state.cells) this.visualHeights.set(this.key(cell.row, cell.col), cell.height);
    for (const mote of this.state.motes) {
      const p = this.cellCenter(mote.row, mote.col);
      this.moteVisuals.set(mote.id, new Phaser.Math.Vector2(p.x, p.y));
    }

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.state.resolved) return;
      const cell = this.closestCell(pointer.x, pointer.y);
      if (!cell) return;
      const next = pressConflictCell(this.state, cell.row, cell.col);
      if (next !== this.state) { this.state = next; this.pulse = 0.35; }
    });

    this.time.addEvent({ delay: 900, loop: true, callback: () => {
      const next = advanceConflictingFlow(this.state);
      if (next !== this.state) { this.state = next; this.pulse = this.state.resolved ? 1 : 0.5; }
    }});
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
    for (const mote of this.state.motes) {
      const visual = this.moteVisuals.get(mote.id)!;
      const target = this.cellCenter(mote.row, mote.col);
      visual.x += (target.x - visual.x) * moteEase;
      visual.y += (target.y - visual.y) * moteEase;
    }
    this.redraw();
  }

  private redraw() {
    this.board.clear(); this.actors.clear(); this.cameras.main.setBackgroundColor('#173f49');
    this.board.fillStyle(0x12343b, 1); this.board.fillRoundedRect(28, 152, 334, 384, 28);
    for (const cell of [...this.state.cells].sort((a,b) => a.row-b.row || a.col-b.col)) {
      const height = this.visualHeights.get(this.key(cell.row, cell.col)) ?? cell.height;
      const x = ORIGIN_X + cell.col * CELL;
      const y = ORIGIN_Y + cell.row * CELL - height * HEIGHT_PX;
      const face = Math.max(5, height * 7);
      const base = GROUND[(cell.row * 3 + cell.col * 5) % GROUND.length];
      this.board.fillStyle(0x0d2c31, 0.22); this.board.fillRoundedRect(x+2, y+CELL+face-1, CELL-3, 6, 3);
      this.board.fillStyle(this.shade(base, 0.57), 1); this.board.fillRect(x, y+CELL-1, CELL-2, face);
      this.board.fillStyle(base, 1); this.board.fillRoundedRect(x, y, CELL-2, CELL-2, 5);
      this.board.lineStyle(1, 0x174b49, 0.28); this.board.strokeRoundedRect(x, y, CELL-2, CELL-2, 5);
    }

    const goals = new Map<string, { row:number; col:number; color:number }>();
    for (const mote of this.state.motes) goals.set(`${mote.goal.row}:${mote.goal.col}:${mote.id}`, { ...mote.goal, color: mote.id === 'amber' ? 0xffd95a : 0x6de8ff });
    for (const goal of goals.values()) {
      const p = this.cellCenter(goal.row, goal.col); const gp = 1 + Math.sin(this.time.now/260)*0.08;
      this.actors.lineStyle(5, goal.color, 0.95); this.actors.strokeCircle(p.x, p.y, 16*gp);
      this.actors.lineStyle(2, goal.color, 0.45); this.actors.strokeCircle(p.x, p.y, 23*gp);
    }

    for (const mote of this.state.motes) {
      const p = this.moteVisuals.get(mote.id)!;
      const color = mote.id === 'amber' ? 0xffd95a : 0x6de8ff;
      const offset = this.state.motes.length > 1 ? (mote.id === 'amber' ? -7 : 7) : 0;
      const r = 9 + this.pulse * 1.5;
      this.actors.fillStyle(0x102f34, 0.22); this.actors.fillEllipse(p.x+offset, p.y+12, 22, 7);
      this.actors.lineStyle(5, color, mote.wrong ? 0.35 : 1); this.actors.strokeCircle(p.x+offset, p.y, r);
      this.actors.lineStyle(1.2, 0xffffff, mote.wrong ? 0.25 : 0.75); this.actors.strokeCircle(p.x+offset, p.y, r-3);
    }
  }

  private closestCell(x:number,y:number) {
    let best: {row:number;col:number;distance:number}|null = null;
    for (const cell of this.state.cells) {
      const c=this.cellCenter(cell.row,cell.col); const d=Phaser.Math.Distance.Between(x,y,c.x,c.y);
      if (d<=27 && (!best || d<best.distance)) best={row:cell.row,col:cell.col,distance:d};
    }
    return best ? {row:best.row,col:best.col} : null;
  }
  private cellCenter(row:number,col:number):Point {
    const cell=getConflictCell(this.state,row,col)!; const h=this.visualHeights.get(this.key(row,col)) ?? cell.height;
    return {x:ORIGIN_X+col*CELL+(CELL-2)/2,y:ORIGIN_Y+row*CELL+(CELL-2)/2-h*HEIGHT_PX};
  }
  private key(row:number,col:number){return `${row}:${col}`;}
  private shade(color:number,factor:number){const r=Math.round(((color>>16)&255)*factor),g=Math.round(((color>>8)&255)*factor),b=Math.round((color&255)*factor);return (r<<16)|(g<<8)|b;}
}
