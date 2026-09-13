import Phaser from 'phaser';
import {
  createDuelState,
  isActionLegal,
  nextTechnique,
  resolveExchange,
  TECHNIQUE_COST,
  type ActionId,
  type DuelState,
  type TechniqueId,
} from './simulation';

const WIDTH = 844;
const HEIGHT = 390;
const TRACK_LEFT = 122;
const TRACK_RIGHT = 722;
const TRACK_Y = 145;
const STEP = (TRACK_RIGHT - TRACK_LEFT) / 6;

const FUNDAMENTALS: readonly ActionId[] = ['press', 'brace', 'retreat'];
const LABEL: Record<ActionId, string> = {
  press: 'PRESS',
  brace: 'BRACE',
  retreat: 'RETREAT',
  rush: 'RUSH',
  intercept: 'INTERCEPT',
  break: 'BREAK',
  reversal: 'REVERSAL',
  fade: 'FADE',
  drive: 'DRIVE',
};

const TECH_COLOR: Record<TechniqueId, number> = {
  rush: 0xf5a742,
  intercept: 0x54c8ff,
  break: 0xff6f91,
  reversal: 0xbf8cff,
  fade: 0x63e6be,
  drive: 0xffd43b,
};

export class DuelLabScene extends Phaser.Scene {
  private state!: DuelState;
  private pending: [ActionId | null, ActionId | null] = [null, null];
  private resolving = false;
  private visualPositions: [number, number] = [1, 5];
  private arena!: Phaser.GameObjects.Graphics;
  private controls: Phaser.GameObjects.GameObject[] = [];
  private reveal = '';
  private note = 'Choose privately. Resolution begins when both players are locked.';

  constructor() {
    super('duel-lab-v0');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0b1020');
    this.arena = this.add.graphics();
    this.resetMatch();
    this.bindKeyboard();
  }

  update(_: number, delta: number) {
    const ease = 1 - Math.exp(-delta / 90);
    for (const index of [0, 1] as const) {
      this.visualPositions[index] += (this.state.players[index].position - this.visualPositions[index]) * ease;
    }
    this.drawArena();
  }

  private resetMatch() {
    this.state = createDuelState();
    this.pending = [null, null];
    this.resolving = false;
    this.visualPositions = [this.state.players[0].position, this.state.players[1].position];
    this.reveal = '';
    this.note = 'Choose privately. Resolution begins when both players are locked.';
    this.refreshControls();
  }

  private bindKeyboard() {
    const keyboard = this.input.keyboard;
    if (!keyboard) return;
    const map: Record<string, [0 | 1, number, boolean]> = {
      Q: [0, 0, false], W: [0, 1, false], E: [0, 2, false],
      A: [0, 0, true], S: [0, 1, true], D: [0, 2, true],
      I: [1, 0, false], O: [1, 1, false], P: [1, 2, false],
      J: [1, 0, true], K: [1, 1, true], L: [1, 2, true],
    };
    keyboard.on('keydown', (event: KeyboardEvent) => {
      if (this.state.winner !== null) {
        if (event.code === 'Space' || event.code === 'Enter') this.resetMatch();
        return;
      }
      const command = map[event.key.toUpperCase()];
      if (!command) return;
      const [player, slot, advanced] = command;
      const action = advanced ? this.state.players[player].active[slot] : FUNDAMENTALS[slot];
      this.choose(player, action);
    });
  }

  private choose(player: 0 | 1, action: ActionId) {
    if (this.resolving || this.state.winner !== null || this.pending[player] !== null) return;
    if (!isActionLegal(this.state, player, action)) {
      this.note = `P${player + 1}: not enough energy for ${LABEL[action]}.`;
      this.refreshControls();
      return;
    }
    this.pending[player] = action;
    this.note = this.pending[0] && this.pending[1]
      ? 'Both locked.'
      : `P${player + 1} locked. Opponent choice remains hidden.`;
    this.refreshControls();
    if (this.pending[0] && this.pending[1]) this.beginResolution();
  }

  private beginResolution() {
    if (!this.pending[0] || !this.pending[1]) return;
    this.resolving = true;
    const actions: [ActionId, ActionId] = [this.pending[0], this.pending[1]];
    this.time.delayedCall(180, () => {
      const result = resolveExchange(this.state, actions[0], actions[1]);
      this.state = result.state;
      this.reveal = `P1 ${LABEL[actions[0]]}  ×  ${LABEL[actions[1]]} P2`;
      this.note = result.messages.length > 0 ? result.messages.join(' · ') : 'No clean opening. The state still changed.';
      this.refreshControls();
      this.time.delayedCall(520, () => {
        if (this.state.winner === null) {
          this.pending = [null, null];
          this.reveal = '';
          this.note = 'Read the new position, energy and public cycle. Choose again.';
          this.resolving = false;
          this.refreshControls();
        } else {
          this.note = `P${this.state.winner + 1} owns the edge. Tap REMATCH or press Space.`;
          this.refreshControls();
        }
      });
    });
  }

  private drawArena() {
    const g = this.arena;
    g.clear();

    g.fillStyle(0x0f172a, 1);
    g.fillRoundedRect(22, 22, WIDTH - 44, 210, 22);

    // Territory: the outer cells are intentionally dangerous and visually distinct.
    for (let slot = 0; slot <= 6; slot += 1) {
      const x = TRACK_LEFT + slot * STEP;
      const edge = slot === 0 || slot === 6;
      g.fillStyle(edge ? 0x4a1d2f : 0x17233a, edge ? 0.9 : 0.72);
      g.fillRoundedRect(x - 38, TRACK_Y - 28, 76, 56, 12);
      g.lineStyle(edge ? 3 : 1, edge ? 0xff668a : 0x37506f, edge ? 0.9 : 0.6);
      g.strokeRoundedRect(x - 38, TRACK_Y - 28, 76, 56, 12);
    }
    g.lineStyle(4, 0x6f87a8, 0.7);
    g.lineBetween(TRACK_LEFT - 45, TRACK_Y + 36, TRACK_RIGHT + 45, TRACK_Y + 36);

    this.drawFighter(0, this.visualPositions[0], 0x79a8ff);
    this.drawFighter(1, this.visualPositions[1], 0xff7d9a);

    // Public availability is echoed on the body: three colored marks = active techniques.
    for (const index of [0, 1] as const) {
      const x = TRACK_LEFT + this.visualPositions[index] * STEP;
      const player = this.state.players[index];
      player.active.forEach((technique, slot) => {
        g.fillStyle(TECH_COLOR[technique], 1);
        g.fillCircle(x - 12 + slot * 12, TRACK_Y - 47, 4.2);
      });
    }
  }

  private drawFighter(index: 0 | 1, position: number, color: number) {
    const x = TRACK_LEFT + position * STEP;
    const facing = index === 0 ? 1 : -1;
    const g = this.arena;
    g.fillStyle(color, 0.18);
    g.fillCircle(x, TRACK_Y - 5, 29);
    g.lineStyle(5, color, 1);
    g.strokeCircle(x, TRACK_Y - 5, 18);
    g.lineBetween(x, TRACK_Y + 13, x, TRACK_Y + 38);
    g.lineBetween(x, TRACK_Y + 23, x + 16 * facing, TRACK_Y + 11);
    g.lineBetween(x, TRACK_Y + 37, x - 10, TRACK_Y + 52);
    g.lineBetween(x, TRACK_Y + 37, x + 10, TRACK_Y + 52);
  }

  private refreshControls() {
    for (const object of this.controls) object.destroy();
    this.controls = [];

    this.addTrackedText(22, 7, 'DUEL · LAB V0', { fontSize: '13px', color: '#91a4bf' });
    this.addTrackedText(WIDTH / 2, 239, this.reveal || `EXCHANGE ${this.state.exchange + 1}`, {
      fontSize: '15px', color: this.reveal ? '#ffffff' : '#91a4bf', fontStyle: 'bold',
    }, 0.5);
    this.addTrackedText(WIDTH / 2, 260, this.note, { fontSize: '12px', color: '#b9c8db' }, 0.5);

    this.drawPlayerPanel(0, 18, 'P1 · QWE / ASD');
    this.drawPlayerPanel(1, 434, 'P2 · IOP / JKL');

    if (this.state.winner !== null) {
      const rematch = this.add.text(WIDTH / 2, 322, 'REMATCH', {
        fontFamily: 'system-ui, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#0b1020', backgroundColor: '#f7d154',
        padding: { x: 22, y: 10 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      rematch.on('pointerdown', () => this.resetMatch());
      this.controls.push(rematch);
    }
  }

  private drawPlayerPanel(playerIndex: 0 | 1, originX: number, title: string) {
    const player = this.state.players[playerIndex];
    const locked = this.pending[playerIndex] !== null;
    this.addTrackedText(originX, 286, title, { fontSize: '11px', color: playerIndex === 0 ? '#79a8ff' : '#ff8ba3', fontStyle: 'bold' });

    for (let pip = 0; pip < 5; pip += 1) {
      const dot = this.add.circle(originX + 118 + pip * 13, 292, 4, 0xf7d154, pip < player.energy ? 1 : 0.16);
      this.controls.push(dot);
    }

    const next = nextTechnique(player);
    this.addTrackedText(originX + 268, 286, `NEXT ${LABEL[next]}`, { fontSize: '10px', color: '#7f92ad' });

    if (locked) {
      const curtain = this.add.text(originX + 172, 337, 'LOCKED', {
        fontFamily: 'system-ui, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#d8e3f2', backgroundColor: '#1e2b42',
        padding: { x: 94, y: 17 },
      }).setOrigin(0.5);
      this.controls.push(curtain);
      return;
    }

    const fundamentals = FUNDAMENTALS;
    for (let slot = 0; slot < 3; slot += 1) {
      this.createActionButton(playerIndex, fundamentals[slot], originX + slot * 116, 306, false);
      this.createActionButton(playerIndex, player.active[slot], originX + slot * 116, 347, true);
    }
  }

  private createActionButton(player: 0 | 1, action: ActionId, x: number, y: number, advanced: boolean) {
    const legal = isActionLegal(this.state, player, action);
    const technique = advanced ? action as TechniqueId : null;
    const suffix = technique ? ` ·${TECHNIQUE_COST[technique]}` : '';
    const background = advanced ? '#22304a' : '#162033';
    const button = this.add.text(x, y, `${LABEL[action]}${suffix}`, {
      fontFamily: 'system-ui, sans-serif', fontSize: advanced ? '10px' : '10px', fontStyle: advanced ? 'bold' : 'normal',
      color: legal ? '#edf5ff' : '#617087', backgroundColor: background, align: 'center', padding: { x: 8, y: 8 },
    }).setFixedSize(108, 35).setInteractive({ useHandCursor: legal });
    if (legal) button.on('pointerdown', () => this.choose(player, action));
    this.controls.push(button);
  }

  private addTrackedText(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle, origin = 0) {
    const object = this.add.text(x, y, text, { fontFamily: 'system-ui, sans-serif', ...style }).setOrigin(origin, 0);
    this.controls.push(object);
    return object;
  }
}
