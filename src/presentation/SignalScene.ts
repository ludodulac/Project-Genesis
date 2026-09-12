import Phaser from 'phaser';
import {
  createSignalState,
  defaultNext,
  demandInfo,
  moveOperator,
  orderedLinks,
  previewOperatorRoutes,
  rotateOperator,
  selectedFilterKind,
  stepSignal,
  type FlowKind,
  type Operator,
  type SignalState,
} from '../game/signal';

const COLOR: Record<FlowKind, number> = {
  cyan: 0x56e6ff,
  amber: 0xffc857,
  violet: 0xc99cff,
};

const OPERATOR_COLOR = {
  switch: 0xf6fbff,
  filter: 0x69e6b1,
  alternator: 0xffd166,
};

type Point = { x: number; y: number };

export class SignalScene extends Phaser.Scene {
  private state!: SignalState;
  private graphics!: Phaser.GameObjects.Graphics;
  private statText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private outcomeText!: Phaser.GameObjects.Text;
  private restartText!: Phaser.GameObjects.Text;
  private held: number | null = null;
  private dragPoint: Point | null = null;
  private seed = 1;
  private endedMs = 0;

  constructor() { super('signal'); }

  create() {
    const requestedSeed = Number(new URLSearchParams(window.location.search).get('seed'));
    if (Number.isFinite(requestedSeed) && requestedSeed > 0) this.seed = Math.floor(requestedSeed);

    this.graphics = this.add.graphics();
    this.add.text(28, 23, 'SIGNAL', {
      fontFamily: 'Arial', fontSize: '25px', fontStyle: 'bold', color: '#e9fbff',
    });
    this.statText = this.add.text(28, 58, '', {
      fontFamily: 'Arial', fontSize: '14px', color: '#9fc7d2',
    });
    this.hintText = this.add.text(195, 704, 'Glisse un opérateur • touche-le pour le modifier', {
      fontFamily: 'Arial', fontSize: '13px', color: '#83aeb9', align: 'center',
    }).setOrigin(.5);
    this.outcomeText = this.add.text(195, 342, '', {
      fontFamily: 'Arial', fontSize: '24px', fontStyle: 'bold', color: '#ffffff', align: 'center',
    }).setOrigin(.5).setVisible(false);
    this.restartText = this.add.text(195, 391, 'Touchez pour recommencer', {
      fontFamily: 'Arial', fontSize: '15px', color: '#d9f4f8',
    }).setOrigin(.5).setVisible(false);

    this.reset();
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.pointerDown(pointer));
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.held !== null) this.dragPoint = { x: pointer.x, y: pointer.y };
    });
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => this.pointerUp(pointer));
  }

  update(_: number, delta: number) {
    if (this.state.outcome === 'playing') stepSignal(this.state, Math.min(.05, delta / 1000));
    else this.endedMs += delta;
    this.draw();
  }

  private reset() {
    this.state = createSignalState(this.seed++);
    this.held = null;
    this.dragPoint = null;
    this.endedMs = 0;
    this.outcomeText.setVisible(false);
    this.restartText.setVisible(false);
  }

  private position(nodeId: number): Point {
    const node = this.state.nodes[nodeId];
    return { x: 38 + node.x * 314, y: 154 + node.y * 452 };
  }

  private nearestEditableNode(x: number, y: number) {
    let best: { id: number; distance: number } | null = null;
    for (const node of this.state.nodes) {
      if (node.links.length !== 2) continue;
      const point = this.position(node.id);
      const distance = Phaser.Math.Distance.Between(x, y, point.x, point.y);
      if (distance <= 38 && (!best || distance < best.distance)) best = { id: node.id, distance };
    }
    return best?.id ?? -1;
  }

  private pointerDown(pointer: Phaser.Input.Pointer) {
    if (this.state.outcome !== 'playing') {
      if (this.endedMs > 350) this.reset();
      return;
    }
    for (const operator of this.state.operators) {
      const point = this.position(operator.node);
      if (Phaser.Math.Distance.Between(pointer.x, pointer.y, point.x, point.y) <= 28) {
        this.held = operator.id;
        this.dragPoint = { x: pointer.x, y: pointer.y };
        return;
      }
    }
  }

  private pointerUp(pointer: Phaser.Input.Pointer) {
    if (this.held === null) return;
    const operator = this.state.operators.find((entry) => entry.id === this.held)!;
    const target = this.nearestEditableNode(pointer.x, pointer.y);
    if (target === operator.node) rotateOperator(this.state, operator.id);
    else if (target >= 0) moveOperator(this.state, operator.id, target);
    this.held = null;
    this.dragPoint = null;
  }

  private drawArrow(from: Point, toward: Point, color: number, alpha = 1, width = 3, length = 29) {
    const dx = toward.x - from.x;
    const dy = toward.y - from.y;
    const magnitude = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / magnitude;
    const uy = dy / magnitude;
    const start = { x: from.x + ux * 11, y: from.y + uy * 11 };
    const end = { x: from.x + ux * length, y: from.y + uy * length };
    this.graphics.lineStyle(width, color, alpha);
    this.graphics.lineBetween(start.x, start.y, end.x, end.y);
    const side = 6;
    this.graphics.lineBetween(end.x, end.y, end.x - ux * 7 - uy * side, end.y - uy * 7 + ux * side);
    this.graphics.lineBetween(end.x, end.y, end.x - ux * 7 + uy * side, end.y - uy * 7 - ux * side);
  }

  private drawOperator(operator: Operator) {
    const point = this.position(operator.node);
    const routes = previewOperatorRoutes(this.state, operator);
    const operatorColor = OPERATOR_COLOR[operator.kind];

    this.graphics.fillStyle(operatorColor, .16);
    this.graphics.fillCircle(point.x, point.y, 24);
    this.graphics.lineStyle(3, operatorColor, 1);
    this.graphics.strokeCircle(point.x, point.y, 21);

    if (routes.primary !== null) {
      const target = this.position(routes.primary);
      const routeColor = operator.kind === 'filter' ? COLOR[selectedFilterKind(operator)] : operatorColor;
      this.drawArrow(point, target, routeColor, 1, 4, 31);
    }
    if (routes.secondary !== null) {
      const target = this.position(routes.secondary);
      const alpha = operator.kind === 'filter' ? .45 : .22;
      this.drawArrow(point, target, operatorColor, alpha, 2, 27);
    }

    if (operator.kind === 'filter') {
      this.graphics.fillStyle(COLOR[selectedFilterKind(operator)], 1);
      this.graphics.fillCircle(point.x, point.y, 6);
      this.graphics.lineStyle(2, 0x0c2029, .9);
      this.graphics.strokeCircle(point.x, point.y, 7);
    } else if (operator.kind === 'alternator') {
      this.graphics.fillStyle(operatorColor, .95);
      this.graphics.fillCircle(point.x, point.y, 4);
    }
  }

  private draw() {
    this.graphics.clear();
    this.cameras.main.setBackgroundColor(this.state.outcome === 'lost' ? '#10181e' : '#09151d');
    this.graphics.fillStyle(0x10242e, 1);
    this.graphics.fillRoundedRect(18, 105, 354, 565, 24);

    for (const node of this.state.nodes) {
      const a = this.position(node.id);
      for (const targetId of node.links) {
        const b = this.position(targetId);
        this.graphics.lineStyle(5, 0x294652, .78);
        this.graphics.lineBetween(a.x, a.y, b.x, b.y);
        const mid = { x: Phaser.Math.Linear(a.x, b.x, .57), y: Phaser.Math.Linear(a.y, b.y, .57) };
        this.drawArrow(mid, b, 0x557582, .38, 2, 18);
      }
    }

    const demand = demandInfo(this.state);
    for (const node of this.state.nodes) {
      const point = this.position(node.id);
      const pressure = this.state.pressure[node.id] ?? 0;
      if (pressure >= 2) {
        this.graphics.fillStyle(0xff5f68, .1 + Math.min(.42, pressure * .055));
        this.graphics.fillCircle(point.x, point.y, 18 + pressure * 2.4);
        this.graphics.lineStyle(2, 0xff7b83, Math.min(.9, pressure / 8));
        this.graphics.strokeCircle(point.x, point.y, 15 + pressure * 1.7);
      }

      this.graphics.fillStyle(0x173744, 1);
      this.graphics.fillCircle(point.x, point.y, 9);

      if (node.source) {
        const hot = node.source === demand.current;
        if (hot) {
          const pulse = 21 + Math.sin(this.time.now / 130) * 3;
          this.graphics.fillStyle(COLOR[node.source], .12);
          this.graphics.fillCircle(point.x, point.y, pulse + 7);
          this.graphics.lineStyle(2, COLOR[node.source], .35);
          this.graphics.strokeCircle(point.x, point.y, pulse);
        }
        this.graphics.lineStyle(hot ? 5 : 4, COLOR[node.source], 1);
        this.graphics.strokeCircle(point.x, point.y, 16);
      }

      if (node.sink) {
        this.graphics.fillStyle(COLOR[node.sink], .28);
        this.graphics.fillCircle(point.x, point.y, 20);
        this.graphics.lineStyle(4, COLOR[node.sink], 1);
        this.graphics.strokeCircle(point.x, point.y, 14);
        this.graphics.fillStyle(COLOR[node.sink], .75);
        this.graphics.fillCircle(point.x, point.y, 5);
      }
    }

    for (const node of this.state.nodes) {
      if (node.links.length !== 2 || this.state.operators.some((operator) => operator.node === node.id)) continue;
      const target = defaultNext(this.state, node.id);
      if (target !== null) this.drawArrow(this.position(node.id), this.position(target), 0x6b8c98, .48, 2, 24);
    }

    for (const operator of this.state.operators) this.drawOperator(operator);

    for (const packet of this.state.packets) {
      const a = this.position(packet.node);
      const b = packet.next === null ? a : this.position(packet.next);
      const x = Phaser.Math.Linear(a.x, b.x, packet.progress);
      const y = Phaser.Math.Linear(a.y, b.y, packet.progress);
      this.graphics.fillStyle(COLOR[packet.kind], 1);
      this.graphics.fillCircle(x, y, 7);
      this.graphics.lineStyle(2, 0xffffff, .55);
      this.graphics.strokeCircle(x, y, 8);
      if (packet.wait > .2) {
        this.graphics.lineStyle(2, 0xff7b83, .8);
        this.graphics.strokeCircle(x, y, 11 + Math.sin(this.time.now / 90) * 2);
      }
    }

    if (this.held !== null && this.dragPoint) {
      for (const node of this.state.nodes) {
        if (node.links.length !== 2) continue;
        const point = this.position(node.id);
        this.graphics.lineStyle(2, 0xffffff, .18);
        this.graphics.strokeCircle(point.x, point.y, 29);
      }
      const operator = this.state.operators.find((entry) => entry.id === this.held)!;
      this.graphics.fillStyle(OPERATOR_COLOR[operator.kind], .28);
      this.graphics.fillCircle(this.dragPoint.x, this.dragPoint.y, 25);
      this.graphics.lineStyle(3, OPERATOR_COLOR[operator.kind], .75);
      this.graphics.strokeCircle(this.dragPoint.x, this.dragPoint.y, 21);
    }

    const remaining = Math.max(0, Math.ceil(this.state.duration - this.state.time));
    this.statText.setText(`${this.state.delivered} livrés   ${this.state.lost} perdus   ${remaining}s`);
    this.graphics.fillStyle(COLOR[demand.current], .95);
    this.graphics.fillCircle(329, 65, 6);
    this.graphics.lineStyle(2, 0x8baeb8, .65);
    this.graphics.lineBetween(338, 65, 346, 65);
    this.graphics.fillStyle(COLOR[demand.next], .48);
    this.graphics.fillCircle(354, 65, 5);

    if (this.state.outcome !== 'playing') {
      this.graphics.fillStyle(0x071116, .9);
      this.graphics.fillRoundedRect(52, 306, 286, 132, 20);
      const won = this.state.outcome === 'won';
      this.outcomeText.setText(won ? 'RÉSEAU STABLE' : 'RÉSEAU SATURÉ');
      this.outcomeText.setColor(won ? '#8dffc7' : '#ff8790');
      this.outcomeText.setVisible(true);
      this.restartText.setVisible(true);
    }
  }
}
