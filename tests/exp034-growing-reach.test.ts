import { describe, expect, it } from 'vitest';
import {
  absorbReachObject,
  canAbsorb,
  initialGrowingReachState,
} from '../src/experiments/exp034-growing-reach';

describe('EXP-034 growing reach', () => {
  it('starts with the medium and large objects out of reach', () => {
    const state = initialGrowingReachState();
    expect(canAbsorb(state.actorRadius, 22)).toBe(false);
    expect(canAbsorb(state.actorRadius, 29)).toBe(false);
  });

  it('makes two small absorptions unlock the medium object', () => {
    let state = initialGrowingReachState();
    state = absorbReachObject(state, 'small-a');
    expect(canAbsorb(state.actorRadius, 22)).toBe(false);
    state = absorbReachObject(state, 'small-b');
    expect(canAbsorb(state.actorRadius, 22)).toBe(true);
  });

  it('makes absorbing the medium object unlock the large object', () => {
    let state = initialGrowingReachState();
    state = absorbReachObject(state, 'small-a');
    state = absorbReachObject(state, 'small-b');
    state = absorbReachObject(state, 'medium');
    expect(canAbsorb(state.actorRadius, 29)).toBe(true);
  });

  it('does not consume an object that is still too large', () => {
    const state = initialGrowingReachState();
    const next = absorbReachObject(state, 'medium');
    expect(next).toBe(state);
    expect(next.objects.find((object) => object.id === 'medium')?.consumed).toBe(false);
  });
});
