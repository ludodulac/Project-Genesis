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

const FUNDAMENTALS: readonly ActionId[] = ['press', 'brace', 'retreat'];
const LABEL: Record<ActionId, string> = {
  press: 'PRESS', brace: 'BRACE', retreat: 'RETREAT', rush: 'RUSH', intercept: 'INTERCEPT',
  break: 'BREAK', reversal: 'REVERSAL', fade: 'FADE', drive: 'DRIVE',
};
const TECH_COLOR: Record<TechniqueId, number> = {
  rush: 0xf5a742, intercept: 0x54c8ff, break: 0xff6f91, reversal: 0xbf8cff, fade: 0x63e6be, drive: 0xffd43b,
};

export class DuelLabScene extends Phaser.Scene {
  private state!: DuelState;
  private pending: [ActionId | null, ActionId | null] = [null, null];
  private resolving = false;
  private visualPositions: [number, number] = [1, 5];
  private arena!: Phaser.GameObjects.Graphics;
  private controls: Phaser.GameObjects.GameObject[] = [];
  private reveal = '';
  private note = 'Choose privately. Both choices resolve together.';

  constructor() { super('duel-lab-v0'); }

  private get portrait() { return this.scale.width < 600; }
  private get trackLeft() { return this.portrait ? 45 : 122; }
  private get trackRight() { return this.portrait ? 345 : 722; }
  private get trackY() { return this.portrait ? 350 : 145; }
  private get step() { return (this.trackRight - this.trackLeft) / 6; }

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
    this.note = 'Choose privately. Both choices resolve together.';
    this.refreshControls();
  }

  private bindKeyboard() {
    const keyboard = this.input.keyboard;
    if (!keyboard) return;
    const map: Record<string, [0 | 1, number, boolean]> = {
      Q: [0, 0, false], W: [0, 1, false], E: [0, 2, false], A: [0, 0, true], S: [0, 1, true], D: [0, 2, true],
      I: [1, 0, false], O: [1, 1, false], P: [1, 2, false], J: [1, 0, true], K: [1, 1, true], L: [1, 2, true],
    };
    keyboard.on('keydown', (event: KeyboardEvent) => {
      if (this.state.winner !== null) {
        if (event.code === 'Space' || event.code === 'Enter') this.resetMatch();
        return;
      }
      const command = map[event.key.toUpperCase()];
      if (!command) return;
      const [player, slot, advanced] = command;
      this.choose(player, advanced ? this.state.players[player].active[slot] : FUNDAMENTALS[slot]);
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
    this.note = this.pending[0] && this.pending[1] ? 'Both locked.' : `P${player + 1} locked. Opponent choice is hidden.`;
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
          this.pending = [null, null]; this.reveal = ''; this.note = 'Choose again.'; this.resolving = false; this.refreshControls();
        } else {
          this.note = `P${this.state.winner + 1} wins. Tap REMATCH.`; this.refreshControls();
        }
      });
    });
  }

  private drawArena() {
    const g = this.arena;
    g.clear();
    const width = this.scale.width;
    const panelTop = this.portrait ? 272 : 22;
    const panelHeight = this.portrait ? 160 : 210;
    g.fillStyle(0x0f172a, 1);
    g.fillRoundedRect(this.portrait ? 12 : 22, panelTop, width - (this.portrait ? 24 : 44), panelHeight, 22);

    for (let slot = 0; slot <= 6; slot += 1) {
      const x = this.trackLeft + slot * this.step;
      const edge = slot === 0 || slot === 6;
      const cellWidth = this.portrait ? 42 : 76;
      const cellHeight = this.portrait ? 72 : 56;
      g.fillStyle(edge ? 0x4a1d2f : 0x17233a, edge ? 0.9 : 0.72);
      g.fillRoundedRect(x - cellWidth / 2, this.trackY - cellHeight / 2, cellWidth, cellHeight, 10);
      g.lineStyle(edge ? 3 : 1, edge ? 0xff668a : 0x37506f, edge ? 0.9 : 0.6);
      g.strokeRoundedRect(x - cellWidth / 2, this.trackY - cellHeight / 2, cellWidth, cellHeight, 10);
    }
    g.lineStyle(4, 0x6f87a8, 0.7);
    g.lineBetween(this.trackLeft - 25, this.trackY + (this.portrait ? 48 : 36), this.trackRight + 25, this.trackY + (this.portrait ? 48 : 36));
    this.drawFighter(0, this.visualPositions[0], 0x79a8ff);
    this.drawFighter(1, this.visualPositions[1], 0xff7d9a);

    for (const index of [0, 1] as const) {
      const x = this.trackLeft + this.visualPositions[index] * this.step;
      this.state.players[index].active.forEach((technique, slot) => {
        g.fillStyle(TECH_COLOR[technique], 1);
        g.fillCircle(x - 12 + slot * 12, this.trackY - (this.portrait ? 66 : 47), this.portrait ? 5 : 4.2);
      });
    }
  }

  private drawFighter(index: 0 | 1, position: number, color: number) {
    const x = this.trackLeft + position * this.step;
    const facing = index === 0 ? 1 : -1;
    const y = this.trackY;
    const size = this.portrait ? 1.25 : 1;
    const g = this.arena;
    g.fillStyle(color, 0.18); g.fillCircle(x, y - 5, 29 * size);
    g.lineStyle(5 * size, color, 1); g.strokeCircle(x, y - 5, 18 * size);
    g.lineBetween(x, y + 13, x, y + 38 * size);
    g.lineBetween(x, y + 23, x + 16 * facing * size, y + 11);
    g.lineBetween(x, y + 37, x - 10 * size, y + 52 * size);
    g.lineBetween(x, y + 37, x + 10 * size, y + 52 * size);
  }

  private refreshControls() {
    for (const object of this.controls) object.destroy();
    this.controls = [];
    if (this.portrait) this.refreshPortraitControls(); else this.refreshLandscapeControls();
  }

  private refreshPortraitControls() {
    this.addTrackedText(16, 12, 'DUEL · LAB V0', { fontSize: '18px', color: '#91a4bf', fontStyle: 'bold' });
    this.drawPortraitPlayerPanel(0, 16, 48);
    this.addTrackedText(195, 238, this.reveal || `EXCHANGE ${this.state.exchange + 1}`, { fontSize: '18px', color: '#ffffff', fontStyle: 'bold' }, 0.5);
    this.addTrackedText(195, 420, this.note, { fontSize: '15px', color: '#d5e0ee', align: 'center', wordWrap: { width: 350 } }, 0.5);
    this.drawPortraitPlayerPanel(1, 16, 478);
    if (this.state.winner !== null) this.createRematch(195, 786);
  }

  private drawPortraitPlayerPanel(playerIndex: 0 | 1, x: number, y: number) {
    const player = this.state.players[playerIndex];
    const locked = this.pending[playerIndex] !== null;
    this.addTrackedText(x, y, `JOUEUR ${playerIndex + 1}`, { fontSize: '17px', color: playerIndex === 0 ? '#79a8ff' : '#ff8ba3', fontStyle: 'bold' });
    this.addTrackedText(x + 112, y + 2, `ÉNERGIE ${player.energy}/5`, { fontSize: '15px', color: '#f7d154', fontStyle: 'bold' });
    this.addTrackedText(x + 250, y + 2, `APRÈS ${LABEL[nextTechnique(player)]}`, { fontSize: '12px', color: '#a9bad0' });
    if (locked) {
      const curtain = this.add.text(195, y + 86, 'CHOIX FAIT', { fontFamily: 'system-ui, sans-serif', fontSize: '22px', fontStyle: 'bold', color: '#d8e3f2', backgroundColor: '#1e2b42', padding: { x: 90, y: 24 } }).setOrigin(0.5);
      this.controls.push(curtain); return;
    }
    for (let slot = 0; slot < 3; slot += 1) {
      this.createActionButton(playerIndex, FUNDAMENTALS[slot], x + slot * 120, y + 34, false, 114, 54, 14);
      this.createActionButton(playerIndex, player.active[slot], x + slot * 120, y + 94, true, 114, 58, 14);
    }
  }

  private refreshLandscapeControls() {
    this.addTrackedText(22, 7, 'DUEL · LAB V0', { fontSize: '13px', color: '#91a4bf' });
    this.addTrackedText(422, 239, this.reveal || `EXCHANGE ${this.state.exchange + 1}`, { fontSize: '15px', color: this.reveal ? '#ffffff' : '#91a4bf', fontStyle: 'bold' }, 0.5);
    this.addTrackedText(422, 260, this.note, { fontSize: '12px', color: '#b9c8db' }, 0.5);
    this.drawLandscapePlayerPanel(0, 18, 'P1 · QWE / ASD');
    this.drawLandscapePlayerPanel(1, 434, 'P2 · IOP / JKL');
    if (this.state.winner !== null) this.createRematch(422, 322);
  }

  private drawLandscapePlayerPanel(playerIndex: 0 | 1, originX: number, title: string) {
    const player = this.state.players[playerIndex];
    const locked = this.pending[playerIndex] !== null;
    this.addTrackedText(originX, 286, title, { fontSize: '11px', color: playerIndex === 0 ? '#79a8ff' : '#ff8ba3', fontStyle: 'bold' });
    for (let pip = 0; pip < 5; pip += 1) this.controls.push(this.add.circle(originX + 118 + pip * 13, 292, 4, 0xf7d154, pip < player.energy ? 1 : 0.16));
    this.addTrackedText(originX + 268, 286, `NEXT ${LABEL[nextTechnique(player)]}`, { fontSize: '10px', color: '#7f92ad' });
    if (locked) {
      const curtain = this.add.text(originX + 172, 337, 'LOCKED', { fontFamily: 'system-ui, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#d8e3f2', backgroundColor: '#1e2b42', padding: { x: 94, y: 17 } }).setOrigin(0.5);
      this.controls.push(curtain); return;
    }
    for (let slot = 0; slot < 3; slot += 1) {
      this.createActionButton(playerIndex, FUNDAMENTALS[slot], originX + slot * 116, 306, false, 108, 35, 10);
      this.createActionButton(playerIndex, player.active[slot], originX + slot * 116, 347, true, 108, 35, 10);
    }
  }

  private createActionButton(player: 0 | 1, action: ActionId, x: number, y: number, advanced: boolean, width: number, height: number, fontSize: number) {
    const legal = isActionLegal(this.state, player, action);
    const technique = advanced ? action as TechniqueId : null;
    const suffix = technique ? ` · ${TECHNIQUE_COST[technique]}` : '';
    const button = this.add.text(x, y, `${LABEL[action]}${suffix}`, {
      fontFamily: 'system-ui, sans-serif', fontSize: `${fontSize}px`, fontStyle: advanced ? 'bold' : 'normal',
      color: legal ? '#edf5ff' : '#617087', backgroundColor: advanced ? '#22304a' : '#162033', align: 'center', padding: { x: 5, y: 8 },
    }).setFixedSize(width, height).setInteractive({ useHandCursor: legal });
    if (legal) button.on('pointerdown', () => this.choose(player, action));
    this.controls.push(button);
  }

  private createRematch(x: number, y: number) {
    const rematch = this.add.text(x, y, 'REMATCH', { fontFamily: 'system-ui, sans-serif', fontSize: this.portrait ? '24px' : '18px', fontStyle: 'bold', color: '#0b1020', backgroundColor: '#f7d154', padding: { x: this.portrait ? 38 : 22, y: this.portrait ? 16 : 10 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    rematch.on('pointerdown', () => this.resetMatch()); this.controls.push(rematch);
  }

  private addTrackedText(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle, origin = 0) {
    const object = this.add.text(x, y, text, { fontFamily: 'system-ui, sans-serif', ...style }).setOrigin(origin, 0);
    this.controls.push(object); return object;
  }
}
