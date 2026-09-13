import Phaser from 'phaser';
import type { ActionId } from './simulation';
import {
  SOLO_ARENA_MAX,
  SOLO_ARENA_MIN,
  chooseMachineAction,
  createSoloDuelState,
  resolveSoloExchange,
  type SoloDuelState,
} from './soloSimulation';

const LABEL: Record<ActionId, string> = {
  press: 'PRESSION', brace: 'GARDE', retreat: 'REPLI', rush: 'RUÉE', intercept: 'INTERCEPTION',
  break: 'BRISE-GARDE', reversal: 'CONTRE', fade: 'ESQUIVE', drive: 'POUSSÉE',
};
const ICON: Record<ActionId, string> = {
  press: '✦', brace: '◈', retreat: '↶', rush: '»', intercept: '⊣', break: '✹', reversal: '↺', fade: '◇', drive: '◆',
};
const DETAIL: Record<ActionId, string> = {
  press: 'Avance 1 · pousse 1',
  brace: 'Bloque 1 poussée',
  retreat: 'Recule 1',
  rush: 'Avance 2 · pousse 2',
  intercept: 'Repousse Pression / Ruée',
  break: 'Avance 1 · brise les défenses',
  reversal: 'Renvoie une attaque proche',
  fade: 'Recule 2 · évite les coups lourds',
  drive: 'Au contact · pousse 3',
};
const ACCENT: Record<ActionId, number> = {
  press: 0xf4d35e, brace: 0x66d9ef, retreat: 0x94a3b8, rush: 0xff8a4c, intercept: 0x38bdf8,
  break: 0xfb7185, reversal: 0xc084fc, fade: 0x5eead4, drive: 0xfacc15,
};
const ACTION_FRAME: Record<ActionId, number> = {
  press: 1, brace: 2, retreat: 3, rush: 4, intercept: 5, break: 6, reversal: 7, fade: 8, drive: 9,
};

export class SoloDuelScene extends Phaser.Scene {
  private state!: SoloDuelState;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private machineSprite!: Phaser.GameObjects.Sprite;
  private arena!: Phaser.GameObjects.Graphics;
  private ui: Phaser.GameObjects.GameObject[] = [];
  private busy = false;
  private message = 'Choisissez un coup.';
  private reveal = '';

  constructor() { super('duel-v0-solo'); }

  preload() {
    this.load.spritesheet('neko-duel-v0', `${import.meta.env.BASE_URL}assets/duel/neko_duel_v0.png`, { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    this.cameras.main.setBackgroundColor('#080d17');
    this.arena = this.add.graphics();
    this.playerSprite = this.add.sprite(0, 0, 'neko-duel-v0', 0).setOrigin(0.5, 1).setScale(2.15);
    this.machineSprite = this.add.sprite(0, 0, 'neko-duel-v0', 0).setOrigin(0.5, 1).setScale(2.15).setFlipX(true).setTint(0xffb5c2);
    this.resetMatch();
  }

  private resetMatch() {
    this.state = createSoloDuelState();
    this.busy = false;
    this.message = 'Choisissez un coup.';
    this.reveal = '';
    this.playerSprite.clearTint().setFrame(0);
    this.machineSprite.setTint(0xffb5c2).setFrame(0);
    this.refresh();
  }

  private choose(action: ActionId) {
    if (this.busy || this.state.winner !== null || !this.state.fighters[0].hand.includes(action)) return;
    this.busy = true;
    const machineAction = chooseMachineAction(this.state);
    const before: [number, number] = [this.state.fighters[0].position, this.state.fighters[1].position];

    this.reveal = `${ICON[action]} ${LABEL[action]}   VS   …`;
    this.message = 'Choix verrouillé';
    this.refresh();

    this.time.delayedCall(180, () => {
      this.reveal = `${ICON[action]} ${LABEL[action]}   VS   ${ICON[machineAction]} ${LABEL[machineAction]}`;
      this.message = `${DETAIL[action]}   ·   ${DETAIL[machineAction]}`;
      this.playerSprite.setFrame(ACTION_FRAME[action]);
      this.machineSprite.setFrame(ACTION_FRAME[machineAction]);
      this.refresh();

      this.time.delayedCall(190, () => {
        const result = resolveSoloExchange(this.state, action, machineAction);
        this.state = result.state;
        this.message = result.messages[0] ?? 'Aucun avantage.';
        this.refresh();
        this.tweenFighters(before);

        this.time.delayedCall(500, () => {
          if (this.state.winner === null) {
            this.playerSprite.setFrame(0);
            this.machineSprite.setFrame(0);
            this.busy = false;
            this.reveal = '';
            this.message = 'À vous de lire les 4 cartes adverses.';
            this.refresh();
            return;
          }
          if (this.state.winner === 0) {
            this.message = 'VICTOIRE · adversaire hors de l’arène';
            this.playerSprite.setFrame(10);
            this.machineSprite.setFrame(11);
          } else {
            this.message = 'DÉFAITE · vous êtes hors de l’arène';
            this.playerSprite.setFrame(11);
            this.machineSprite.setFrame(10);
          }
          this.refresh();
        });
      });
    });
  }

  private tweenFighters(before: [number, number]) {
    const playerMoved = before[0] !== this.state.fighters[0].position;
    const machineMoved = before[1] !== this.state.fighters[1].position;
    this.tweens.add({
      targets: this.playerSprite,
      x: this.slotX(this.state.fighters[0].position),
      duration: playerMoved ? 300 : 180,
      ease: 'Cubic.Out',
    });
    this.tweens.add({
      targets: this.machineSprite,
      x: this.slotX(this.state.fighters[1].position),
      duration: machineMoved ? 300 : 180,
      ease: 'Cubic.Out',
    });
    if (playerMoved || machineMoved) this.cameras.main.shake(90, 0.0022);
  }

  private refresh() {
    for (const object of this.ui) object.destroy();
    this.ui = [];
    this.drawArena();
    this.drawHeader();
    this.drawMachineHand();
    this.drawPlayerHand();
  }

  private drawHeader() {
    this.addTrackedText(18, 15, 'DUEL', { fontSize: '23px', fontStyle: 'bold', color: '#ffffff' });
    this.addTrackedText(18, 44, '4 CARTES VISIBLES · POUSSEZ-LE DEHORS', { fontSize: '11px', color: '#91a4bf' });
    this.addTrackedText(372, 20, `#${this.state.exchange + 1}`, { fontSize: '12px', color: '#91a4bf' }, 1);
  }

  private drawArena() {
    const g = this.arena;
    g.clear();
    g.fillStyle(0x101827, 1);
    g.fillRoundedRect(14, 222, 362, 292, 22);
    g.lineStyle(2, 0x27364f, 1);
    g.strokeRoundedRect(14, 222, 362, 292, 22);

    const y = 410;
    for (let slot = SOLO_ARENA_MIN; slot <= SOLO_ARENA_MAX; slot += 1) {
      const x = this.slotX(slot);
      const edge = slot === SOLO_ARENA_MIN || slot === SOLO_ARENA_MAX;
      g.fillStyle(edge ? 0x711f38 : 0x17243a, 0.95);
      g.fillRoundedRect(x - 19, y - 31, 38, 62, 8);
      g.lineStyle(edge ? 2 : 1, edge ? 0xff5577 : 0x38506e, 1);
      g.strokeRoundedRect(x - 19, y - 31, 38, 62, 8);
    }
    g.lineStyle(4, 0x667892, 0.8);
    g.lineBetween(34, 449, 356, 449);

    if (!this.busy) {
      this.playerSprite.setPosition(this.slotX(this.state.fighters[0].position), 463);
      this.machineSprite.setPosition(this.slotX(this.state.fighters[1].position), 463);
    }

    this.addTrackedText(27, 239, 'VOUS  →', { fontSize: '12px', fontStyle: 'bold', color: '#7dd3fc' });
    this.addTrackedText(363, 239, '←  MACHINE', { fontSize: '12px', fontStyle: 'bold', color: '#fda4af' }, 1);
    this.addTrackedText(195, 274, this.reveal || 'CHOISISSEZ EN REGARDANT SA MAIN', {
      fontSize: this.reveal ? '14px' : '13px', fontStyle: 'bold', color: '#ffffff', align: 'center', wordWrap: { width: 338 },
    }, 0.5);
    this.addTrackedText(195, 486, this.message, { fontSize: '13px', color: '#d8e2f0', align: 'center', wordWrap: { width: 342 } }, 0.5);
  }

  private drawMachineHand() {
    this.addTrackedText(18, 73, 'MAIN ADVERSE — TOUT EST VISIBLE', { fontSize: '11px', color: '#fda4af', fontStyle: 'bold' });
    const cardWidth = 84;
    const gap = 8;
    const total = cardWidth * 4 + gap * 3;
    const startX = (390 - total) / 2 + cardWidth / 2;

    this.state.fighters[1].hand.forEach((action, index) => {
      const x = startX + index * (cardWidth + gap);
      const accent = ACCENT[action];
      const card = this.add.rectangle(x, 147, cardWidth, 122, 0x171f2f, 1).setStrokeStyle(2, accent, 0.8);
      this.ui.push(card);
      this.addTrackedText(x, 105, ICON[action], { fontSize: '22px', fontStyle: 'bold', color: `#${accent.toString(16).padStart(6, '0')}` }, 0.5, 0.5);
      this.addTrackedText(x, 130, LABEL[action], { fontSize: '9px', fontStyle: 'bold', color: '#ffffff', align: 'center', wordWrap: { width: 76 } }, 0.5, 0.5);
      this.addTrackedText(x, 168, DETAIL[action], { fontSize: '8px', color: '#b8c4d6', align: 'center', wordWrap: { width: 74 } }, 0.5, 0.5);
    });
  }

  private drawPlayerHand() {
    this.addTrackedText(18, 536, 'VOTRE MAIN', { fontSize: '11px', color: '#7dd3fc', fontStyle: 'bold' });
    const cardY = 666;
    const cardWidth = 84;
    const gap = 8;
    const total = cardWidth * 4 + gap * 3;
    const startX = (390 - total) / 2 + cardWidth / 2;

    this.state.fighters[0].hand.forEach((action, index) => {
      const x = startX + index * (cardWidth + gap);
      const accent = ACCENT[action];
      const card = this.add.rectangle(x, cardY, cardWidth, 222, 0x131d2e, 1).setStrokeStyle(2, accent, this.busy ? 0.35 : 0.95);
      if (!this.busy && this.state.winner === null) {
        card.setInteractive({ useHandCursor: true });
        card.on('pointerdown', () => this.choose(action));
        card.on('pointerover', () => card.setFillStyle(0x1b2940, 1));
        card.on('pointerout', () => card.setFillStyle(0x131d2e, 1));
      }
      this.ui.push(card);
      this.addTrackedText(x, cardY - 77, ICON[action], { fontSize: '30px', fontStyle: 'bold', color: `#${accent.toString(16).padStart(6, '0')}` }, 0.5, 0.5);
      this.addTrackedText(x, cardY - 36, LABEL[action], { fontSize: '10px', fontStyle: 'bold', color: '#ffffff', align: 'center', wordWrap: { width: 74 } }, 0.5, 0.5);
      this.addTrackedText(x, cardY + 19, DETAIL[action], { fontSize: '10px', color: '#c7d2e1', align: 'center', wordWrap: { width: 72 } }, 0.5, 0.5);
      this.addTrackedText(x, cardY + 88, `${index + 1}`, { fontSize: '10px', color: '#64748b' }, 0.5, 0.5);
    });

    this.addTrackedText(195, 794, `À VENIR : ${this.state.fighters[0].queue.map((action) => ICON[action]).join('  ')}`, { fontSize: '11px', color: '#8190a8', align: 'center' }, 0.5);
    if (this.state.winner !== null) {
      const replay = this.add.text(195, 830, 'REJOUER', {
        fontFamily: 'system-ui, sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#08111f',
        backgroundColor: '#f4d35e', padding: { x: 23, y: 9 },
      }).setOrigin(0.5, 1).setInteractive({ useHandCursor: true });
      replay.on('pointerdown', () => this.resetMatch());
      this.ui.push(replay);
    }
  }

  private slotX(slot: number): number { return 52 + slot * 47.7; }

  private addTrackedText(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle, originX = 0, originY = 0) {
    const object = this.add.text(x, y, text, { fontFamily: 'system-ui, sans-serif', ...style }).setOrigin(originX, originY);
    this.ui.push(object);
    return object;
  }
}
