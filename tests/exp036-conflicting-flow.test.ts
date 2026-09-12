import { describe, expect, it } from 'vitest';
import { advanceConflictingFlow, createConflictingFlowState, pressConflictCell } from '../src/experiments/exp036-conflicting-flow';

function reachFork(variant: 'conflict' | 'single' | 'aligned' = 'conflict') {
  let state = createConflictingFlowState(variant);
  state = advanceConflictingFlow(state);
  state = advanceConflictingFlow(state);
  return state;
}

describe('EXP-036 conflicting flow', () => {
  it('waits at the tied fork before an edit', () => {
    const state = reachFork();
    expect(state.motes.every((m) => m.row === 3 && m.col === 3)).toBe(true);
    expect(advanceConflictingFlow(state)).toBe(state);
  });

  it('makes one shared edit send both processes through the same branch', () => {
    let state = reachFork();
    state = pressConflictCell(state, 2, 3);
    state = advanceConflictingFlow(state);
    expect(state.motes.every((m) => m.row === 2 && m.col === 3)).toBe(true);
  });

  it('turns the shared branch into opposite outcomes in conflict', () => {
    let state = reachFork('conflict');
    state = pressConflictCell(state, 2, 3);
    state = advanceConflictingFlow(state);
    state = advanceConflictingFlow(state);
    expect(state.motes.find((m) => m.id === 'amber')?.arrived).toBe(true);
    expect(state.motes.find((m) => m.id === 'cyan')?.wrong).toBe(true);
    expect(state.resolved).toBe(true);
  });

  it('removes the tradeoff in the aligned ablation', () => {
    let state = reachFork('aligned');
    state = pressConflictCell(state, 2, 3);
    state = advanceConflictingFlow(state);
    state = advanceConflictingFlow(state);
    expect(state.motes.every((m) => m.arrived)).toBe(true);
  });

  it('removes the competing interest in the single ablation', () => {
    let state = reachFork('single');
    state = pressConflictCell(state, 2, 3);
    state = advanceConflictingFlow(state);
    state = advanceConflictingFlow(state);
    expect(state.motes).toHaveLength(1);
    expect(state.motes[0].arrived).toBe(true);
  });
});
