import Phaser from 'phaser';
import {
  alignJourneyPulse,
  clearJourneyLock,
  initialJourneyState,
  placeJourneyBridge,
  type JourneyState,
} from '../experiments/exp033-persistent-journey';

export class PersistentJourneyScene extends Phaser.Scene {
  private state: JourneyState = initialJourneyState();
  private traveler!: Phaser.GameObjects.Arc;
  private bridge!: Phaser.GameObjects.Rectangle;
  private pulse!: Phaser.GameObjects.Arc;
  private pulseVelocity = 190;
  private phaseGroup!: Phaser.GameObjects.Group;
  private busy = false;

  constructor() { super('persistent-journey'); }

  create() {
    this.cameras.main.setBackgroundColor('#0f1720');
    this.traveler = this.add.circle(72, 380, 15, 0xffe28a).setStrokeStyle(4, 0xffffff);
    this.phaseGroup = this.add.group();
    this.showPhase();
  }

  update(_: number, delta: number) {
    if (this.state.phase !== 2 || !this.pulse || this.busy) return;
    this.pulse.x += this.pulseVelocity * delta / 1000;
    if (this.pulse.x > 315) { this.pulse.x = 315; this.pulseVelocity = -Math.abs(this.pulseVelocity); }
    if (this.pulse.x < 75) { this.pulse.x = 75; this.pulseVelocity = Math.abs(this.pulseVelocity); }
  }

  private clearPhase() {
    this.phaseGroup.clear(true, true);
  }

  private showPhase() {
    this.clearPhase();
    if (this.state.phase === 0) this.showLocks();
    else if (this.state.phase === 1) this.showBridge();
    else if (this.state.phase === 2) this.showPulse();
    else this.showArrival();
  }

  private showLocks() {
    const xs = [160, 215, 270];
    xs.forEach((x, index) => {
      if (index < this.state.locksCleared) return;
      const lock = this.add.circle(x, 380, 20, 0xe15b64).setStrokeStyle(3, 0xffb1b7).setInteractive({ useHandCursor: true });
      lock.on('pointerdown', () => {
        if (this.busy) return;
        this.state = clearJourneyLock(this.state);
        this.tweens.add({ targets: lock, scale: 0, alpha: 0, duration: 120, onComplete: () => {
          if (this.state.phase === 1) this.moveTravelerTo(128, () => this.showPhase());
          else this.showPhase();
        }});
      });
      this.phaseGroup.add(lock);
    });
  }

  private showBridge() {
    const left = this.add.rectangle(115, 380, 70, 16, 0x4c6b57);
    const right = this.add.rectangle(295, 380, 70, 16, 0x4c6b57);
    this.bridge = this.add.rectangle(195, 500, 92, 18, 0x6ed0a8).setStrokeStyle(3, 0xbaf4dd).setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(this.bridge);
    this.bridge.on('drag', (_p: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      this.bridge.x = dragX;
      this.bridge.y = dragY;
    });
    this.bridge.on('dragend', () => {
      const placed = Phaser.Math.Distance.Between(this.bridge.x, this.bridge.y, 205, 380) < 55;
      this.state = placeJourneyBridge(this.state, placed);
      if (!placed) {
        this.tweens.add({ targets: this.bridge, x: 195, y: 500, duration: 160 });
        return;
      }
      this.busy = true;
      this.tweens.add({ targets: this.bridge, x: 205, y: 380, duration: 150, onComplete: () => {
        this.moveTravelerTo(270, () => {
          this.busy = false;
          this.showPhase();
        });
      }});
    });
    this.phaseGroup.addMultiple([left, right, this.bridge]);
  }

  private showPulse() {
    const gate = this.add.rectangle(300, 380, 24, 100, 0x3d4f66).setStrokeStyle(3, 0x7191ba);
    const glow = this.add.rectangle(195, 380, 76, 44, 0xf4cf66, 0.25).setStrokeStyle(2, 0xf4cf66);
    this.pulse = this.add.circle(88, 380, 13, 0x78a8ff).setStrokeStyle(3, 0xffffff);
    this.input.on('pointerdown', () => {
      if (this.state.phase !== 2 || this.busy) return;
      const aligned = Math.abs(this.pulse.x - 195) <= 38;
      this.state = alignJourneyPulse(this.state, aligned);
      if (!aligned) {
        this.cameras.main.shake(100, 0.004);
        return;
      }
      this.busy = true;
      this.tweens.add({ targets: gate, alpha: 0, duration: 140 });
      this.moveTravelerTo(335, () => {
        this.busy = false;
        this.showPhase();
      });
    });
    this.phaseGroup.addMultiple([gate, glow, this.pulse]);
  }

  private showArrival() {
    const portal = this.add.circle(335, 380, 38, 0x8f7cff, 0.18).setStrokeStyle(4, 0xb8aaff);
    this.phaseGroup.add(portal);
    this.tweens.add({ targets: portal, scale: 1.25, alpha: 0.55, yoyo: true, repeat: -1, duration: 650 });
  }

  private moveTravelerTo(x: number, onComplete: () => void) {
    this.busy = true;
    this.tweens.add({ targets: this.traveler, x, duration: 300, ease: 'Sine.easeInOut', onComplete: () => {
      this.busy = false;
      onComplete();
    }});
  }
}
