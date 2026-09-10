import { describe, expect, it } from 'vitest';
import { advanceRisk, bankRisk, initialRiskState, RISK_WINDOWS } from '../src/experiments/exp032-voluntary-risk';

describe('EXP-032 voluntary risk', () => {
  it('makes every successful extra step worth more than the previous one', () => {
    let state = initialRiskState();
    const gains: number[] = [];
    for (let i = 0; i < 4; i += 1) {
      const before = state.carried;
      state = advanceRisk(state, true);
      gains.push(state.carried - before);
    }
    expect(gains).toEqual([1, 2, 3, 4]);
  });

  it('makes the challenge visibly tighten as the player pushes', () => {
    for (let i = 1; i < RISK_WINDOWS.length; i += 1) {
      expect(RISK_WINDOWS[i]).toBeLessThan(RISK_WINDOWS[i - 1]);
    }
  });

  it('lets the player bank carried value at any successful stopping point', () => {
    let state = advanceRisk(initialRiskState(), true);
    state = advanceRisk(state, true);
    const banked = bankRisk(state);
    expect(banked.banked).toBe(3);
    expect(banked.carried).toBe(0);
    expect(banked.step).toBe(0);
    expect(banked.alive).toBe(true);
  });

  it('loses only the unbanked chain on failure', () => {
    let state = advanceRisk(initialRiskState(), true);
    state = bankRisk(state);
    state = advanceRisk(state, true);
    state = advanceRisk(state, false);
    expect(state.banked).toBe(1);
    expect(state.carried).toBe(0);
    expect(state.alive).toBe(false);
  });
});
