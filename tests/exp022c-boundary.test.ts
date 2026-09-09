import { describe, expect, it } from 'vitest';
import { predictOccupiedNudge } from '../src/experiments/exp022c';
import { cellId, createToyWorld } from '../src/world/model';

const flat = () => {
  const world = createToyWorld(7, 7);
  for (const cell of Object.values(world.cells)) cell.height = 0.5;
  world.agents[0].cellId = cellId(3, 3);
  return world;
};

describe('EXP-022c occupied-cell boundary research', () => {
  it('refuses to invent a direction on symmetric terrain', () => {
    const world = flat();
    const prediction = predictOccupiedNudge(world, cellId(3, 3));
    expect(prediction.to).toBeNull();
    expect(prediction.reason).toBe('ambiguous-rim');
  });

  it('uses the unique visibly lowest neighbouring rim', () => {
    const world = flat();
    world.cells[cellId(3, 2)].height = 0.36;
    world.cells[cellId(2, 3)].height = 0.50;
    world.cells[cellId(4, 3)].height = 0.52;
    world.cells[cellId(3, 4)].height = 0.55;
    const prediction = predictOccupiedNudge(world, cellId(3, 3));
    expect(prediction.to).toBe(cellId(3, 2));
    expect(prediction.reason).toBe('visible-lowest-rim');
    expect(prediction.gapPx).toBeGreaterThanOrEqual(2);
  });

  it('rejects a mathematically unique but visually tiny advantage', () => {
    const world = flat();
    world.cells[cellId(3, 2)].height = 0.48;
    world.cells[cellId(2, 3)].height = 0.50;
    const prediction = predictOccupiedNudge(world, cellId(3, 3));
    expect(prediction.to).toBeNull();
    expect(prediction.reason).toBe('ambiguous-rim');
    expect(prediction.gapPx).toBeLessThan(2);
  });

  it('does not depend on the agent previous-cell memory', () => {
    const a = flat();
    const b = flat();
    a.cells[cellId(3, 4)].height = 0.34;
    b.cells[cellId(3, 4)].height = 0.34;
    a.agents[0].previousCellId = cellId(3, 4);
    b.agents[0].previousCellId = cellId(3, 2);
    expect(predictOccupiedNudge(a, cellId(3, 3))).toEqual(predictOccupiedNudge(b, cellId(3, 3)));
  });
});
