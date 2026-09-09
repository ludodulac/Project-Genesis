import { neighboursOf, type CellId, type WorldState } from '../world/model';

// EXP-022c is intentionally isolated from the playable simulation.
// The tap supplies energy; visible terrain is the only allowed source of direction.
// A move is proposed only when the lowest neighbouring rim is visibly separated
// from the second-lowest one. No memory, random choice or fixed direction exists.
const HEIGHT_PX = 22;
const MIN_VISIBLE_GAP_PX = 2;
const MIN_VISIBLE_GAP_HEIGHT = MIN_VISIBLE_GAP_PX / HEIGHT_PX;

export interface OccupiedNudgePrediction {
  to: CellId | null;
  reason: 'visible-lowest-rim' | 'ambiguous-rim';
  gapPx: number;
}

export function predictOccupiedNudge(world: WorldState, from: CellId): OccupiedNudgePrediction {
  const neighbours = neighboursOf(world, from).sort((a, b) => a.height - b.height);
  if (neighbours.length < 2) return { to: null, reason: 'ambiguous-rim', gapPx: 0 };

  const gapHeight = neighbours[1].height - neighbours[0].height;
  const gapPx = gapHeight * HEIGHT_PX;
  if (gapHeight < MIN_VISIBLE_GAP_HEIGHT) {
    return { to: null, reason: 'ambiguous-rim', gapPx };
  }

  return { to: neighbours[0].id, reason: 'visible-lowest-rim', gapPx };
}
