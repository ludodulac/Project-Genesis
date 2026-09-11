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
    const before = getFlowCell(state, 3, 4)!.height;
    const edited = pressFlowCell(state, 3, 4);
    expect(getFlowCell(edited, 3, 4)!.height).toBeLessThan(before);
    expect(advanceFlow(edited)).toBe(edited);
  });

  it('keeps flow active but disables editing in flow-only ablation', () => {
    const state = createGuidedFlowState('flow-only');
    expect(pressFlowCell(state, 3, 4)).toBe(state);
    const moved = advanceFlow(state);
    expect(moved.mote).toEqual({ row: 3, col: 2 });
  });

  it('lets an edit qualitatively change the next autonomous move in the coupled condition', () => {
    const state = createGuidedFlowState('coupled');
    const unedited = advanceFlow(state);
    expect(unedited.mote).toEqual({ row: 3, col: 2 });

    const edited = pressFlowCell(state, 2, 1);
    const redirected = advanceFlow(edited);
    expect(redirected.mote).toEqual({ row: 2, col: 1 });
  });

  it('lets one local correction turn a stopped flow into arrival', () => {
    let state = createGuidedFlowState('coupled');
    state = advanceFlow(state);
    state = advanceFlow(state);
    expect(state.mote).toEqual({ row: 3, col: 3 });
    expect(advanceFlow(state)).toBe(state);

    state = pressFlowCell(state, 3, 4);
    state = advanceFlow(state);
    expect(state.mote).toEqual({ row: 3, col: 4 });
    state = advanceFlow(state);
    expect(state.arrived).toBe(true);
  });
});
