import { describe, expect, it } from 'vitest';
import {
  ARTIFACT_BOUNDS,
  ARTIFACT_POINT_COUNT,
  createArtifact,
  emptyArtifactState,
  moveArtifactPoint,
} from '../src/experiments/exp035-self-authored-artifact';

describe('EXP-035 self-authored artifact', () => {
  it('starts with no imposed artifact or goal state', () => {
    expect(emptyArtifactState().points).toEqual([]);
  });

  it('turns the first gesture into one persistent, readable five-point artifact', () => {
    const state = createArtifact([
      { x: 80, y: 250 },
      { x: 130, y: 280 },
      { x: 190, y: 240 },
      { x: 250, y: 310 },
      { x: 320, y: 270 },
    ]);
    expect(state.points).toHaveLength(ARTIFACT_POINT_COUNT);
    expect(state.points.map((point) => point.id)).toEqual(['p0', 'p1', 'p2', 'p3', 'p4']);
  });

  it('also leaves an imperfect artifact after a simple tap', () => {
    const state = createArtifact([{ x: 195, y: 380 }]);
    expect(state.points).toHaveLength(ARTIFACT_POINT_COUNT);
    expect(new Set(state.points.map((point) => `${point.x},${point.y}`)).size).toBeGreaterThan(2);
  });

  it('lets any existing point be moved while preserving the rest of the artifact', () => {
    const state = createArtifact([{ x: 195, y: 380 }]);
    const before = state.points.map((point) => ({ ...point }));
    const moved = moveArtifactPoint(state, 'p2', 260, 470);
    expect(moved.points[2]).toMatchObject({ id: 'p2', x: 260, y: 470 });
    expect(moved.points[0]).toEqual(before[0]);
    expect(moved.points[4]).toEqual(before[4]);
  });

  it('keeps modifications persistent and inside the play area', () => {
    const state = createArtifact([{ x: 195, y: 380 }]);
    const first = moveArtifactPoint(state, 'p1', -100, 900);
    const second = moveArtifactPoint(first, 'p3', 300, 220);
    expect(first.points[1].x).toBe(ARTIFACT_BOUNDS.minX);
    expect(first.points[1].y).toBe(ARTIFACT_BOUNDS.maxY);
    expect(second.points[1]).toEqual(first.points[1]);
    expect(second.points[3]).toMatchObject({ x: 300, y: 220 });
  });

  it('does not invent score, completion, failure, or automatic reset state', () => {
    const state = createArtifact([{ x: 120, y: 300 }, { x: 280, y: 430 }]);
    expect(Object.keys(state).sort()).toEqual(['points']);
  });
});
