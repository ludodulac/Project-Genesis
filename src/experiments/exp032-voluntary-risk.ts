export type RiskState = {
  step: number;
  carried: number;
  banked: number;
  alive: boolean;
  finished: boolean;
};

// Fixed, visible difficulty curve. Presentation shows the next window before commitment.
export const RISK_WINDOWS = [0.72, 0.62, 0.52, 0.42, 0.34, 0.27, 0.21] as const;

export function initialRiskState(): RiskState {
  return { step: 0, carried: 0, banked: 0, alive: true, finished: false };
}

export function advanceRisk(state: RiskState, success: boolean): RiskState {
  if (!state.alive || state.finished) return state;
  if (!success) return { ...state, alive: false, carried: 0 };
  const carried = state.carried + state.step + 1;
  const step = state.step + 1;
  return { ...state, step, carried, finished: step >= RISK_WINDOWS.length };
}

export function bankRisk(state: RiskState): RiskState {
  if (!state.alive || state.finished || state.carried === 0) return state;
  return { ...state, banked: state.banked + state.carried, carried: 0, step: 0 };
}

export function resetRisk(): RiskState {
  return initialRiskState();
}
