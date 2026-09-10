import { describe, expect, it } from 'vitest';
import {
  alignJourneyPulse,
  clearJourneyLock,
  initialJourneyState,
  placeJourneyBridge,
} from '../src/experiments/exp033-persistent-journey';

describe('EXP-033 persistent journey', () => {
  it('does not advance before all three locks are cleared', () => {
    let state = initialJourneyState();
    state = clearJourneyLock(state);
    state = clearJourneyLock(state);
    expect(state.phase).toBe(0);
    expect(state.locksCleared).toBe(2);
  });

  it('advances to the bridge only after the third lock', () => {
    let state = initialJourneyState();
    state = clearJourneyLock(clearJourneyLock(clearJourneyLock(state)));
    expect(state.phase).toBe(1);
  });

  it('rejects a bridge miss and accepts a placed bridge', () => {
    let state = initialJourneyState();
    state = clearJourneyLock(clearJourneyLock(clearJourneyLock(state)));
    expect(placeJourneyBridge(state, false).phase).toBe(1);
    expect(placeJourneyBridge(state, true).phase).toBe(2);
  });

  it('finishes only when the final pulse is aligned', () => {
    let state = initialJourneyState();
    state = clearJourneyLock(clearJourneyLock(clearJourneyLock(state)));
    state = placeJourneyBridge(state, true);
    expect(alignJourneyPulse(state, false).phase).toBe(2);
    const done = alignJourneyPulse(state, true);
    expect(done.phase).toBe(3);
    expect(done.pulseAligned).toBe(true);
  });
});
