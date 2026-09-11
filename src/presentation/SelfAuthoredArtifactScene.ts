import Phaser from 'phaser';
import {
  createArtifact,
  emptyArtifactState,
  moveArtifactPoint,
  type ArtifactState,
} from '../experiments/exp035-self-authored-artifact';

export class SelfAuthoredArtifactScene extends Phaser.Scene {
  private state: ArtifactState = emptyArtifactState();
  private strand!: Phaser.GameObjects.Graphics;
  private preview!: Phaser.GameObjects.Graphics;
  private nodes: Phaser.GameObjects.Arc[] = [];
  private gesture: Array<{ x: number; y: number }> = [];
  private draggingId: string | null = null;

  constructor() { super('self-authored-artifact'); }

  create() {
    this.cameras.main.setBackgroundColor('#f0eee7');

    this.add.circle(195, 380, 156, 0xffffff, 0.32)
      .setStrokeStyle(2, 0xc9c3b8, 0.55);
    this.add.circle(195, 380, 106, 0xffffff, 0.08)
      .setStrokeStyle(1, 0xd8d2c7, 0.35);

    this.strand = this.add.graphics();
    this.preview = this.add.graphics();

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.state.points.length === 0) {
        this.gesture = [{ x: pointer.x, y: pointer.y }];
        return;
      }

      const closest = this.closestPoint(pointer.x, pointer.y);
      if (closest && closest.distance <= 34) {
        this.draggingId = closest.id;
        this.state = moveArtifactPoint(this.state, closest.id, pointer.x, pointer.y);
        this.renderArtifact();
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;

      if (this.state.points.length === 0 && this.gesture.length > 0) {
        const last = this.gesture[this.gesture.length - 1];
        if (Phaser.Math.Distance.Between(last.x, last.y, pointer.x, pointer.y) >= 12) {
          this.gesture.push({ x: pointer.x, y: pointer.y });
          this.renderPreview();
        }
        return;
      }

      if (this.draggingId) {
        this.state = moveArtifactPoint(this.state, this.draggingId, pointer.x, pointer.y);
        this.renderArtifact();
      }
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.state.points.length === 0 && this.gesture.length > 0) {
        this.gesture.push({ x: pointer.x, y: pointer.y });
        this.state = createArtifact(this.gesture);
        this.gesture = [];
        this.preview.clear();
        this.renderArtifact();
        return;
      }

      this.draggingId = null;
    });
  }

  private closestPoint(x: number, y: number): { id: string; distance: number } | null {
    let best: { id: string; distance: number } | null = null;
    for (const point of this.state.points) {
      const distance = Phaser.Math.Distance.Between(x, y, point.x, point.y);
      if (!best || distance < best.distance) best = { id: point.id, distance };
    }
    return best;
  }

  private renderPreview() {
    this.preview.clear();
    if (this.gesture.length < 2) return;
    this.preview.lineStyle(8, 0x8d86a8, 0.22);
    for (let index = 1; index < this.gesture.length; index += 1) {
      const from = this.gesture[index - 1];
      const to = this.gesture[index];
      this.preview.lineBetween(from.x, from.y, to.x, to.y);
    }
  }

  private renderArtifact() {
    this.strand.clear();
    for (const node of this.nodes) node.destroy();
    this.nodes = [];

    if (this.state.points.length < 2) return;

    this.strand.lineStyle(20, 0x5b5668, 0.14);
    for (let index = 1; index < this.state.points.length; index += 1) {
      const from = this.state.points[index - 1];
      const to = this.state.points[index];
      this.strand.lineBetween(from.x + 2, from.y + 5, to.x + 2, to.y + 5);
    }

    this.strand.lineStyle(12, 0x7d76a0, 1);
    for (let index = 1; index < this.state.points.length; index += 1) {
      const from = this.state.points[index - 1];
      const to = this.state.points[index];
      this.strand.lineBetween(from.x, from.y, to.x, to.y);
    }

    this.state.points.forEach((point, index) => {
      const radius = index === 0 || index === this.state.points.length - 1 ? 14 : 12;
      const node = this.add.circle(point.x, point.y, radius, 0xf7c969)
        .setStrokeStyle(3, 0xffffff, 0.95);
      this.nodes.push(node);
    });
  }
}
