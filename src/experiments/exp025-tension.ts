export interface TensionState {
  radius: number;
  heldMs: number;
}

export const BASE_RADIUS = 24;
export const MAX_RADIUS = 82;
export const GROWTH_PER_SECOND = 34;

export function growHeld(state: TensionState, deltaMs: number): TensionState {
  const heldMs = state.heldMs + Math.max(0, deltaMs);
  return {
    heldMs,
    radius: Math.min(MAX_RADIUS, BASE_RADIUS + (heldMs / 1000) * GROWTH_PER_SECOND),
  };
}

export function circlesOverlap(a: { x: number; y: number; r: number }, b: { x: number; y: number; r: number }): boolean {
  return Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
}
