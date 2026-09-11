import { describe, expect, it } from 'vitest';
import {
  advanceFlow,
  createGuidedFlowState,
  getFlowCell,
  pressFlowCell,
} from '../src/experiments/exp035-guided-flow';

describe('EXP-035 guided flow', () => {
  it('keeps editing active but disables autonomous flow in edit-only ablation', () => {
    const state = createGuidedFlowState('edit-only');
    const before = getFlowCell(state, 3, 2)!.height;
    const edited = pressFlowCell(state, 3, 2);
    expect(getFlowCell(edited, 3, 2)!.height).toBeLessThan(before);
    expect(advanceFlow(edited)).toBe(edited);
  });

  it('keeps flow active but disables editing in flow-only ablation', () => {
    const state = createGuidedFlowState('flow-only');
    expect(pressFlowCell(state, 3, 2)).toBe(state);
    const moved = advanceFlow(state);
    expect(moved.mote).not.toEqual(state.mote);
  });

  it('lets an edit qualitatively change the next autonomous move in the coupled condition', () => {
    const state = createGuidedFlowState('coupled');
    const unedited = advanceFlow(state);
    expect(unedited.mote).toEqual({ row: 3, col: 2 });

    const edited = pressFlowCell(state, 2, 1);
    const redirected = advanceFlow(edited);
    expect(redirected.mote).toEqual({ row: 2, col: 1 });
  });

  it('can create a descending route all the way to the visible destination', () => {
    let state = createGuidedFlowState('coupled');
    state = pressFlowCell(state, 3, 2);
    state = advanceFlow(state);
    state = pressFlowCell(state, 3, 3);
    state = advanceFlow(state);
    state = pressFlowCell(state, 3, 4);
    state = advanceFlow(state);
    state = pressFlowCell(state, 3, 5);
    state = advanceFlow(state);
    expect(state.arrived).toBe(true);
  });
});
