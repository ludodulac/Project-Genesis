import Phaser from 'phaser';
import {
  applyPetitMondeAction,
  createPetitMonde,
  observableHistory,
  stepPetitMonde,
  type HumanId,
  type PetitMondeState,
  type PlaceId,
} from '../experiments/petitMondeLab';

const placeIds: PlaceId[] = ['home', 'river', 'meadow', 'grove'];
const humanIds: HumanId[] = ['mina', 'jo', 'lea'];
const humanColors: Record<HumanId, number> = { mina: 0xe56b6f, jo: 0x4d96ff, lea: 0x9b5de5 };

export class PetitMondeLabScene extends Phaser.Scene {
  private state: PetitMondeState = createPetitMonde();
  private graphics!: Phaser.GameObjects.Graphics;
  private phaseText!: Phaser.GameObjects.Text;
  private observationText!: Phaser.GameObjects.Text;
  private eventText!: Phaser.GameObjects.Text;
  private startAt = 0;
  private lastStepAt = 0;
  private interventionCount = 0;
  private selectedPlace: PlaceId = 'river';
  private fastMode = false;

  constructor() {
    super('PetitMondeLabScene');
  }

  create(): void {
    this.fastMode = new URLSearchParams(window.location.search).get('fast') === '1';
    this.startAt = this.time.now;
    this.lastStepAt = this.time.now;
    this.cameras.main.setBackgroundColor('#eef4dc');
    this.graphics = this.add.graphics();

    this.add.text(18, 14, 'PETIT MONDE — laboratoire', {
      fontFamily: 'system-ui, sans-serif', fontSize: '18px', color: '#243128', fontStyle: 'bold',
    });
    this.phaseText = this.add.text(18, 40, '', {
      fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#526052',
    });
    this.observationText = this.add.text(18, 545, 'Regarde d’abord ce qui revient.', {
      fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#243128', wordWrap: { width: 350 },
    });
    this.eventText = this.add.text(18, 596, '', {
      fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#526052', wordWrap: { width: 350 },
    });

    this.createButtons();
    this.renderWorld();
  }

  private observationMs(): number { return this.fastMode ? 12_000 : 5 * 60_000; }
  private interventionMs(): number { return this.fastMode ? 40_000 : 15 * 60_000; }

  private phase(): 'observation' | 'intervention' | 'after' {
    const elapsed = this.time.now - this.startAt;
    if (elapsed < this.observationMs()) return 'observation';
    if (elapsed < this.observationMs() + this.interventionMs()) return 'intervention';
    return 'after';
  }

  private createButtons(): void {
    const makeButton = (x: number, label: string, onClick: () => void) => {
      const text = this.add.text(x, 700, label, {
        fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#ffffff', backgroundColor: '#405c48',
        padding: { left: 10, right: 10, top: 8, bottom: 8 },
      }).setInteractive({ useHandCursor: true });
      text.on('pointerdown', () => {
        if (this.phase() !== 'intervention') {
          this.observationText.setText(this.phase() === 'observation' ? 'Pour l’instant, observe seulement.' : 'Maintenant, observe ce qui continue sans agir.');
          return;
        }
        onClick();
      });
    };

    makeButton(14, 'AMÉNAGER', () => {
      this.state = applyPetitMondeAction(this.state, { type: 'improve', place: this.selectedPlace });
      this.interventionCount += 1;
      this.observationText.setText(`${this.state.places[this.selectedPlace].name} a été aménagée. Regarde ce que le monde en fait.`);
    });
    makeButton(116, 'PRÉSERVER', () => {
      const place = this.state.places[this.selectedPlace];
      this.state = applyPetitMondeAction(this.state, { type: 'preserve', place: this.selectedPlace, enabled: !place.preserved });
      this.interventionCount += 1;
      this.observationText.setText(`${place.name} change d’usage. Regarde qui insiste, qui part et ce qui revient.`);
    });
    makeButton(224, 'LIBÉRER DU TEMPS', () => {
      this.state = applyPetitMondeAction(this.state, { type: 'free-time', enabled: !this.state.freeTime });
      this.interventionCount += 1;
      this.observationText.setText('Le rythme de la communauté change. Regarde où ce temps se déplace.');
    });
  }

  update(time: number): void {
    const stepEvery = this.fastMode ? 850 : 3_000;
    if (time - this.lastStepAt >= stepEvery) {
      this.state = stepPetitMonde(this.state);
      this.lastStepAt = time;
      if (this.state.recentEvents.length) this.eventText.setText(this.state.recentEvents.slice(-3).join('\n'));
      this.renderWorld();
    }
    this.updatePhaseLabel();
  }

  private updatePhaseLabel(): void {
    const phase = this.phase();
    const elapsed = this.time.now - this.startAt;
    if (phase === 'observation') {
      const remaining = Math.max(0, this.observationMs() - elapsed);
      this.phaseText.setText(`Observation — ${Math.ceil(remaining / 1000)} s avant toute intervention`);
    } else if (phase === 'intervention') {
      this.phaseText.setText(`Intervention — ${this.interventionCount}/3 actions tentées • clique un lieu puis une action`);
    } else {
      this.phaseText.setText('Après intervention — aucune nouvelle action nécessaire');
    }
  }

  private renderWorld(): void {
    this.graphics.clear();
    const positions: Record<PlaceId, { x: number; y: number; w: number; h: number }> = {
      home: { x: 18, y: 82, w: 156, h: 178 },
      river: { x: 216, y: 82, w: 156, h: 178 },
      meadow: { x: 18, y: 292, w: 156, h: 178 },
      grove: { x: 216, y: 292, w: 156, h: 178 },
    };

    this.children.list.filter((child) => child.getData('petitMondeLabel')).forEach((child) => child.destroy());

    for (const id of placeIds) {
      const p = this.state.places[id];
      const box = positions[id];
      const selected = id === this.selectedPlace;
      const green = Math.round(115 + p.vegetation * 90);
      const fill = Phaser.Display.Color.GetColor(Math.round(210 - p.footfall * 45), green, Math.round(170 - p.footfall * 25));
      this.graphics.fillStyle(fill, 1).fillRoundedRect(box.x, box.y, box.w, box.h, 14);
      this.graphics.lineStyle(selected ? 4 : 1, selected ? 0x2f5d50 : 0x73806f, selected ? 1 : 0.45).strokeRoundedRect(box.x, box.y, box.w, box.h, 14);

      if (id === 'river') this.graphics.fillStyle(0x86c5da, 0.72).fillRoundedRect(box.x + 103, box.y + 6, 38, box.h - 12, 18);

      this.graphics.fillStyle(0x4d7c4a, 0.72);
      for (let i = 0; i < Math.round(p.vegetation * 10); i += 1) {
        this.graphics.fillCircle(box.x + 12 + ((i * 37) % 125), box.y + 45 + ((i * 29) % 105), 2.4);
      }
      if (p.footfall > 0.25) {
        this.graphics.lineStyle(5, 0xb59a72, Math.min(0.65, p.footfall));
        this.graphics.lineBetween(box.x + 18, box.y + box.h - 28, box.x + box.w - 18, box.y + 48);
      }

      const label = this.add.text(box.x + 9, box.y + 8, p.name, { fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#243128', fontStyle: 'bold' });
      label.setData('petitMondeLabel', true).setInteractive({ useHandCursor: true });
      label.on('pointerdown', () => {
        this.selectedPlace = id;
        this.describePlace(id);
        this.renderWorld();
      });
    }

    const occupants: Record<PlaceId, HumanId[]> = { home: [], river: [], meadow: [], grove: [] };
    for (const id of humanIds) occupants[this.state.humans[id].place].push(id);
    for (const placeId of placeIds) {
      const box = positions[placeId];
      occupants[placeId].forEach((id, index) => {
        const human = this.state.humans[id];
        const x = box.x + 34 + index * 40;
        const y = box.y + 95 + (human.hesitation > 0 ? 8 : 0);
        this.graphics.fillStyle(humanColors[id], 1).fillCircle(x, y, 10);
        const name = this.add.text(x - 14, y + 13, human.name, { fontFamily: 'system-ui, sans-serif', fontSize: '10px', color: '#243128' });
        name.setData('petitMondeLabel', true).setInteractive({ useHandCursor: true });
        name.on('pointerdown', () => this.describeHuman(id));
        if (human.hesitation > 0) {
          const dots = this.add.text(x + 10, y - 18, '…', { fontFamily: 'serif', fontSize: '17px', color: '#5a5a4f' });
          dots.setData('petitMondeLabel', true);
        }
      });
    }

    const birds = this.state.birds;
    const birdBox = positions[birds.place];
    const count = Math.max(1, Math.round(birds.presence * 5));
    this.graphics.lineStyle(2, 0x3c4540, 0.82);
    for (let i = 0; i < count; i += 1) {
      const x = birdBox.x + 35 + i * 20;
      const y = birdBox.y + 58 + (i % 2) * 12;
      this.graphics.lineBetween(x - 5, y, x, y - 4);
      this.graphics.lineBetween(x, y - 4, x + 5, y);
    }
  }

  private describeHuman(id: HumanId): void {
    const human = this.state.humans[id];
    const place = this.state.places[human.place];
    this.observationText.setText(`${human.name} est à ${place.name}. ${observableHistory(this.state, id, human.place)}`);
  }

  private describePlace(id: PlaceId): void {
    const place = this.state.places[id];
    const people = humanIds.filter((humanId) => this.state.humans[humanId].place === id).map((humanId) => this.state.humans[humanId].name);
    const birds = this.state.birds.place === id && this.state.birds.presence > 0.35 ? ' Des oiseaux y sont présents.' : '';
    const use = place.footfall > 0.42 ? ' Beaucoup de passages récents restent visibles.' : place.footfall > 0.2 ? ' Quelques passages récents restent visibles.' : ' Peu de passages récents.';
    this.observationText.setText(`${place.name}. ${people.length ? `${people.join(', ')} y sont maintenant.` : 'Personne n’y est maintenant.'}${birds}${use}`);
  }
}
