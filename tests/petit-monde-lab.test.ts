import { describe, expect, it } from 'vitest';
import {
  applyPetitMondeAction,
  createPetitMonde,
  relation,
  stepPetitMonde,
} from '../src/experiments/petitMondeLab';

describe('Petit Monde laboratory', () => {
  it('is deterministic for the same seed and actions', () => {
    let a = createPetitMonde(17);
    let b = createPetitMonde(17);
    a = applyPetitMondeAction(a, { type: 'improve', place: 'river' });
    b = applyPetitMondeAction(b, { type: 'improve', place: 'river' });
    for (let i = 0; i < 30; i += 1) {
      a = stepPetitMonde(a);
      b = stepPetitMonde(b);
    }
    expect(a).toEqual(b);
  });

  it('keeps an established relation after the place is perturbed', () => {
    const before = createPetitMonde();
    const attachment = relation(before, 'human:mina', 'place:river');
    const after = applyPetitMondeAction(before, { type: 'improve', place: 'river' });
    expect(relation(after, 'human:mina', 'place:river')).toBe(attachment);
    expect(after.places.river.accessibility).toBeGreaterThan(before.places.river.accessibility);
    expect(after.places.river.calm).toBeLessThan(before.places.river.calm);
    expect(after.places.river.cover).toBeLessThan(before.places.river.cover);
  });

  it('turns repeated passage into a slower ecological condition', () => {
    const quiet = createPetitMonde(9);
    const busy = createPetitMonde(9);
    quiet.places.river.footfall = 0;
    busy.places.river.footfall = 1;

    const quietAfter = stepPetitMonde(quiet);
    const busyAfter = stepPetitMonde(busy);

    expect(busyAfter.places.river.vegetation).toBeLessThan(quietAfter.places.river.vegetation);
    expect(busyAfter.places.river.calm).toBeLessThan(quietAfter.places.river.calm);
  });

  it('lets preservation reverse pressure rather than awarding an abstract nature score', () => {
    let state = createPetitMonde(4);
    state.places.meadow.footfall = 0.8;
    const damagedVegetation = state.places.meadow.vegetation;
    state = applyPetitMondeAction(state, { type: 'preserve', place: 'meadow', enabled: true });
    for (let i = 0; i < 18; i += 1) state = stepPetitMonde(state);

    expect(state.places.meadow.footfall).toBeLessThan(0.8);
    expect(state.places.meadow.vegetation).toBeGreaterThan(damagedVegetation - 0.05);
    expect(state.places.meadow.preserved).toBe(true);
  });
});
