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

  it('redistribution creates a wider relief range and more basins than accumulation', () => {
    const accumulatedMetrics = terrainMetrics(runVariant('accumulate'));
    const redistributedMetrics = terrainMetrics(runVariant('redistribute'));

    expect(redistributedMetrics.range).toBeGreaterThan(accumulatedMetrics.range);
    expect(redistributedMetrics.localMinima).toBeGreaterThanOrEqual(accumulatedMetrics.localMinima);
  });
});
