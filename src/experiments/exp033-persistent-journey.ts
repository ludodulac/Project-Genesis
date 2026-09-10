export type JourneyPhase = 0 | 1 | 2 | 3;

export type JourneyState = {
  phase: JourneyPhase;
  locksCleared: number;
  bridgePlaced: boolean;
  pulseAligned: boolean;
};

export function initialJourneyState(): JourneyState {
  return { phase: 0, locksCleared: 0, bridgePlaced: false, pulseAligned: false };
}

export function clearJourneyLock(state: JourneyState): JourneyState {
  if (state.phase !== 0 || state.locksCleared >= 3) return state;
  const locksCleared = state.locksCleared + 1;
  return { ...state, locksCleared, phase: locksCleared === 3 ? 1 : 0 };
}

export function placeJourneyBridge(state: JourneyState, placed: boolean): JourneyState {
  if (state.phase !== 1 || !placed) return state;
  return { ...state, bridgePlaced: true, phase: 2 };
}

export function alignJourneyPulse(state: JourneyState, aligned: boolean): JourneyState {
  if (state.phase !== 2 || !aligned) return state;
  return { ...state, pulseAligned: true, phase: 3 };
}
