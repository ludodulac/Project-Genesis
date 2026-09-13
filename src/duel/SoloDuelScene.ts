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
const ACCENT: Record<ActionId, number> = {
  press: 0xf4d35e, brace: 0x66d9ef, retreat: 0x94a3b8, rush: 0xff8a4c, intercept: 0x38bdf8,
  break: 0xfb7185, reversal: 0xc084fc, fade: 0x5eead4, drive: 0xfacc15,
};
const ANIMATION: Record<ActionId, string> = {
  press: 'neko-press', brace: 'neko-brace', retreat: 'neko-retreat', rush: 'neko-rush', intercept: 'neko-intercept',
  break: 'neko-break', reversal: 'neko-reversal', fade: 'neko-fade', drive: 'neko-drive',
};

export class SoloDuelScene extends Phaser.Scene {
  private state!: SoloDuelState;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private machineSprite!: Phaser.GameObjects.Sprite;
  private arena!: Phaser.GameObjects.Graphics;
  private ui: Phaser.GameObjects.GameObject[] = [];
  private busy = false;
  private message = 'Choisissez une carte.';
  private reveal = '';

  constructor() { super('duel-v0-solo'); }

  preload() {
    this.load.spritesheet('neko-duel-v0', '/assets/duel/neko_duel_v0.png', { frameWidth: 192, frameHeight: 144 });
  }

  create() {
    this.cameras.main.setBackgroundColor('#080d17');
    this.createAnimations();
    this.arena = this.add.graphics();
    this.playerSprite = this.add.sprite(0, 0, 'neko-duel-v0', 0).setOrigin(0.5, 1).setScale(1.35);
    this.machineSprite = this.add.sprite(0, 0, 'neko-duel-v0', 0).setOrigin(0.5, 1).setScale(1.35).setFlipX(true).setTint(0xffb5c2);
    this.playerSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.restoreIdle(this.playerSprite));
    this.machineSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.restoreIdle(this.machineSprite));
    this.resetMatch();
  }

  private resetMatch() {
    this.state = createSoloDuelState();
    this.busy = false;
    this.message = 'Choisissez une carte.';
    this.reveal = '';
    this.playerSprite.clearTint();
    this.machineSprite.setTint(0xffb5c2);
    this.playerSprite.play('neko-idle');
    this.machineSprite.play('neko-idle');
    this.refresh();
  }

  private createAnimations() {
    if (this.anims.exists('neko-idle')) return;
    const specs: Array<[string, number, number, number, number]> = [
      ['idle', 0, 3, 6, -1], ['press', 12, 15, 12, 0], ['brace', 16, 19, 7, 0], ['retreat', 20, 23, 10, 0],
      ['rush', 24, 27, 14, 0], ['intercept', 28, 31, 12, 0], ['break', 32, 36, 10, 0], ['reversal', 37, 41, 12, 0],
      ['fade', 42, 45, 11, 0], ['drive', 46, 50, 11, 0], ['hit', 51, 55, 10, 0], ['win', 56, 59, 6, -1], ['lose', 60, 63, 7, 0],
    ];
    for (const [name, start, end, frameRate, repeat] of specs) {
      this.anims.create({ key: `neko-${name}`, frames: this.anims.generateFrameNumbers('neko-duel-v0', { start, end }), frameRate, repeat });
    }
  }

  private restoreIdle(sprite: Phaser.GameObjects.Sprite) {
    if (this.state.winner === null) sprite.play('neko-idle', true);
  }

  private choose(action: ActionId) {
    if (this.busy || this.state.winner !== null || !this.state.fighters[0].hand.includes(action)) return;
    this.busy = true;
    const machineAction = chooseMachineAction(this.state);
    this.reveal = `${ICON[action]} ${LABEL[action]}   VS   ?`;
    this.message = 'La machine choisit…';
    this.refresh();

    this.time.delayedCall(260, () => {
      this.reveal = `${ICON[action]} ${LABEL[action]}   VS   ${ICON[machineAction]} ${LABEL[machineAction]}`;
      this.playerSprite.play(ANIMATION[action], true);
      this.machineSprite.play(ANIMATION[machineAction], true);
      const result = resolveSoloExchange(this.state, action, machineAction);
      this.state = result.state;
      this.message = result.messages[0] ?? 'La position change.';
      this.refresh();
      this.tweenFighters();

      this.time.delayedCall(720, () => {
        if (this.state.winner === null) {
          this.busy = false;
          this.reveal = '';
          this.message = 'Nouvelle main : choisissez une carte.';
          this.refresh();
          return;
        }
        if (this.state.winner === 0) {
          this.message = 'Victoire — la machine est sortie du terrain.';
          this.playerSprite.play('neko-win', true);
          this.machineSprite.play('neko-lose', true);
        } else {
          this.message = 'Défaite — vous êtes sorti du terrain.';
          this.playerSprite.play('neko-lose', true);
          this.machineSprite.play('neko-win', true);
        }
        this.refresh();
      });
    });
  }

  private tweenFighters() {
    this.tweens.add({ targets: this.playerSprite, x: this.slotX(this.state.fighters[0].position), duration: 260, ease: 'Quad.Out' });
    this.tweens.add({ targets: this.machineSprite, x: this.slotX(this.state.fighters[1].position), duration: 260, ease: 'Quad.Out' });
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
    this.addTrackedText(18, 18, 'DUEL V0', { fontSize: '24px', fontStyle: 'bold', color: '#ffffff' });
    this.addTrackedText(18, 48, 'VS MACHINE · 9 COUPS · 4 CARTES EN MAIN', { fontSize: '12px', color: '#91a4bf' });
    this.addTrackedText(372, 20, `ÉCHANGE ${this.state.exchange + 1}`, { fontSize: '12px', color: '#91a4bf' }, 1);
  }

  private drawArena() {
    const g = this.arena;
    g.clear();
    g.fillStyle(0x101827, 1);
    g.fillRoundedRect(14, 142, 362, 330, 22);
    g.lineStyle(2, 0x27364f, 1);
    g.strokeRoundedRect(14, 142, 362, 330, 22);
    const y = 372;
    for (let slot = SOLO_ARENA_MIN; slot <= SOLO_ARENA_MAX; slot += 1) {
      const x = this.slotX(slot);
      const edge = slot === SOLO_ARENA_MIN || slot === SOLO_ARENA_MAX;
      g.fillStyle(edge ? 0x6b1f35 : 0x17243a, edge ? 0.9 : 0.9);
      g.fillRoundedRect(x - 19, y - 32, 38, 64, 8);
      g.lineStyle(edge ? 2 : 1, edge ? 0xff5577 : 0x38506e, 1);
      g.strokeRoundedRect(x - 19, y - 32, 38, 64, 8);
    }
    g.lineStyle(4, 0x667892, 0.8);
    g.lineBetween(34, 410, 356, 410);
    this.playerSprite.setPosition(this.slotX(this.state.fighters[0].position), 424);
    this.machineSprite.setPosition(this.slotX(this.state.fighters[1].position), 424);
    this.addTrackedText(28, 163, 'VOUS', { fontSize: '13px', fontStyle: 'bold', color: '#7dd3fc' });
    this.addTrackedText(362, 163, 'MACHINE', { fontSize: '13px', fontStyle: 'bold', color: '#fda4af' }, 1);
    this.addTrackedText(195, 208, this.reveal || 'CHOISISSEZ VOTRE COUP', { fontSize: this.reveal ? '15px' : '14px', fontStyle: 'bold', color: '#ffffff', align: 'center', wordWrap: { width: 330 } }, 0.5);
    this.addTrackedText(195, 448, this.message, { fontSize: '14px', color: '#d8e2f0', align: 'center', wordWrap: { width: 330 } }, 0.5);
  }

  private drawMachineHand() {
    this.addTrackedText(18, 88, 'MAIN ADVERSE', { fontSize: '11px', color: '#7789a3', fontStyle: 'bold' });
    const startX = 228;
    this.state.fighters[1].hand.forEach((_, index) => {
      const rect = this.add.rectangle(startX + index * 38, 103, 30, 42, 0x283246, 1).setStrokeStyle(1, 0x4c5d78);
      this.ui.push(rect);
      this.addTrackedText(startX + index * 38, 102, '?', { fontSize: '16px', color: '#a8b4c7', fontStyle: 'bold' }, 0.5, 0.5);
    });
  }

  private drawPlayerHand() {
    this.addTrackedText(18, 500, 'VOTRE MAIN', { fontSize: '12px', color: '#91a4bf', fontStyle: 'bold' });
    const cardY = 654;
    const cardWidth = 84;
    const gap = 8;
    const total = cardWidth * 4 + gap * 3;
    const startX = (390 - total) / 2 + cardWidth / 2;
    this.state.fighters[0].hand.forEach((action, index) => {
      const x = startX + index * (cardWidth + gap);
      const accent = ACCENT[action];
      const card = this.add.rectangle(x, cardY, cardWidth, 212, 0x131d2e, 1).setStrokeStyle(2, accent, this.busy ? 0.35 : 0.95);
      if (!this.busy && this.state.winner === null) {
        card.setInteractive({ useHandCursor: true });
        card.on('pointerdown', () => this.choose(action));
        card.on('pointerover', () => card.setFillStyle(0x1b2940, 1));
        card.on('pointerout', () => card.setFillStyle(0x131d2e, 1));
      }
      this.ui.push(card);
      this.addTrackedText(x, cardY - 67, ICON[action], { fontSize: '31px', fontStyle: 'bold', color: `#${accent.toString(16).padStart(6, '0')}` }, 0.5, 0.5);
      this.addTrackedText(x, cardY - 18, LABEL[action], { fontSize: '10px', fontStyle: 'bold', color: '#ffffff', align: 'center', wordWrap: { width: 72 } }, 0.5, 0.5);
      this.addTrackedText(x, cardY + 70, `${index + 1}`, { fontSize: '11px', color: '#64748b' }, 0.5, 0.5);
    });
    this.addTrackedText(195, 785, `PROCHAINS COUPS : ${this.state.fighters[0].queue.map((action) => ICON[action]).join('  ')}`, { fontSize: '12px', color: '#8190a8', align: 'center' }, 0.5);
    if (this.state.winner !== null) {
      const replay = this.add.text(195, 817, 'REJOUER', { fontFamily: 'system-ui, sans-serif', fontSize: '17px', fontStyle: 'bold', color: '#08111f', backgroundColor: '#f4d35e', padding: { x: 24, y: 10 } }).setOrigin(0.5, 1).setInteractive({ useHandCursor: true });
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
