import { describe, expect, it } from 'vitest';
import { applyTerrainVariant, terrainMetrics } from '../src/experiments/exp008Terrain';
import { cellId, createInitialWorld } from '../src/world/model';

const SCRIPT = [
  cellId(4, 4),
  cellId(4, 5),
  cellId(5, 4),
  cellId(7, 7),
  cellId(8, 7),
  cellId(8, 8),
  cellId(11, 3),
  cellId(11, 4),
] as const;

function runVariant(variant: 'accumulate' | 'redistribute') {
  let world = createInitialWorld(14, 10);
  for (const target of SCRIPT) world = applyTerrainVariant(world, target, variant);
  return world;
}

describe('EXP-008 terrain deformation variants', () => {
  it('redistribution approximately conserves average terrain height', () => {
    const initial = createInitialWorld(14, 10);
    const redistributed = runVariant('redistribute');

    expect(terrainMetrics(redistributed).mean).toBeCloseTo(terrainMetrics(initial).mean, 10);
  });

  it('accumulation increases average terrain height under the same action script', () => {
    const initial = createInitialWorld(14, 10);
    const accumulated = runVariant('accumulate');

    expect(terrainMetrics(accumulated).mean).toBeGreaterThan(terrainMetrics(initial).mean);
  });

  it('the variants create different terrain signatures under the same script', () => {
    const initialMetrics = terrainMetrics(createInitialWorld(14, 10));
    const accumulatedMetrics = terrainMetrics(runVariant('accumulate'));
    const redistributedMetrics = terrainMetrics(runVariant('redistribute'));

    // Accumulation produces the tallest extremes.
    expect(accumulatedMetrics.range).toBeGreaterThan(redistributedMetrics.range);

    // Redistribution still creates substantially more relief than the initial world,
    // but does so by carving additional basins instead of only raising the mean.
    expect(redistributedMetrics.range).toBeGreaterThan(initialMetrics.range);
    expect(redistributedMetrics.localMinima).toBeGreaterThan(accumulatedMetrics.localMinima);
  });
});
