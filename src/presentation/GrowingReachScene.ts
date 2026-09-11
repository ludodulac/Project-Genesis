import Phaser from 'phaser';
import {
  absorbReachObject,
  canAbsorb,
  initialGrowingReachState,
  type GrowingReachState,
} from '../experiments/exp034-growing-reach';

type ReachVisual = {
  id: string;
  radius: number;
  circle: Phaser.GameObjects.Arc;
};

export class GrowingReachScene extends Phaser.Scene {
  private state: GrowingReachState = initialGrowingReachState();
  private actor!: Phaser.GameObjects.Arc;
  private destination = new Phaser.Math.Vector2(195, 390);
  private visuals: ReachVisual[] = [];
  private speed = 230;
  private blockedUntil = 0;

  constructor() { super('growing-reach'); }

  create() {
    this.cameras.main.setBackgroundColor('#eef2e6');

    this.add.circle(195, 390, 150, 0xffffff, 0.22).setStrokeStyle(2, 0xcfd8c6, 0.65);

    const placements = [
      { id: 'small-a', x: 132, y: 344, color: 0xf08b6e },
      { id: 'small-b', x: 128, y: 438, color: 0xf08b6e },
      { id: 'small-c', x: 202, y: 296, color: 0xf08b6e },
      { id: 'medium', x: 264, y: 388, color: 0xe96f62 },
      { id: 'large', x: 314, y: 292, color: 0xd95763 },
    ];

    const initial = this.state.objects;
    for (const placement of placements) {
      const object = initial.find((candidate) => candidate.id === placement.id)!;
      const circle = this.add.circle(placement.x, placement.y, object.radius, placement.color)
        .setStrokeStyle(3, 0xffffff, 0.8);
      this.visuals.push({ id: object.id, radius: object.radius, circle });
    }

    this.actor = this.add.circle(195, 390, this.state.actorRadius, 0x4d7cfe)
      .setStrokeStyle(4, 0xffffff);

    this.tweens.add({ targets: this.actor, scale: 1.08, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.destination.set(
        Phaser.Math.Clamp(pointer.x, 28, 362),
        Phaser.Math.Clamp(pointer.y, 170, 610),
      );
    });
  }

  update(_: number, delta: number) {
    const dx = this.destination.x - this.actor.x;
    const dy = this.destination.y - this.actor.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 2) {
      const step = Math.min(distance, this.speed * delta / 1000);
      this.actor.x += dx / distance * step;
      this.actor.y += dy / distance * step;
    }

    this.checkContacts();
  }

  private checkContacts() {
    for (const visual of this.visuals) {
      const object = this.state.objects.find((candidate) => candidate.id === visual.id)!;
      if (object.consumed || !visual.circle.active) continue;

      const distance = Phaser.Math.Distance.Between(this.actor.x, this.actor.y, visual.circle.x, visual.circle.y);
      const contact = distance <= this.state.actorRadius + visual.radius;
      if (!contact) continue;

      if (canAbsorb(this.state.actorRadius, visual.radius)) {
        const before = this.state.actorRadius;
        this.state = absorbReachObject(this.state, visual.id);
        if (this.state.actorRadius === before) continue;

        this.tweens.add({ targets: visual.circle, scale: 0, alpha: 0, duration: 130, onComplete: () => visual.circle.destroy() });
        const diameter = this.state.actorRadius * 2;
        this.tweens.add({ targets: this.actor, displayWidth: diameter, displayHeight: diameter, duration: 170, ease: 'Back.Out' });
        continue;
      }

      if (this.time.now < this.blockedUntil) continue;
      this.blockedUntil = this.time.now + 260;
      this.destination.set(this.actor.x, this.actor.y);
      const push = Math.max(1, this.state.actorRadius + visual.radius - distance + 5);
      const nx = distance > 0 ? (this.actor.x - visual.circle.x) / distance : -1;
      const ny = distance > 0 ? (this.actor.y - visual.circle.y) / distance : 0;
      this.actor.x += nx * push;
      this.actor.y += ny * push;
      this.tweens.add({ targets: visual.circle, scale: 1.18, yoyo: true, duration: 90 });
    }
  }
}
