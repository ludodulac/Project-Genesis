import { describe, expect, it } from 'vitest';
import { simulate } from '../src/simulation/simulate';
import { cellId, createInitialWorld } from '../src/world/model';

describe('terrain simulation', () => {
  it('raises the target more than its neighbours without mutating the input', () => {
    const world = createInitialWorld(3, 3);
    const targetId = cellId(1, 1);
    const beforeTarget = world.cells[targetId].height;
    const beforeNeighbour = world.cells[cellId(1, 0)].height;

    const result = simulate(world, { type: 'RAISE_CELL', cellId: targetId });

    expect(world.cells[targetId].height).toBe(beforeTarget);
    expect(result.state.cells[targetId].height).toBeCloseTo(beforeTarget + 0.62);
    expect(result.state.cells[cellId(1, 0)].height).toBeCloseTo(beforeNeighbour + 0.12);
  });

  it('moves the orb toward a clearly lower neighbouring cell', () => {
    const world = createInitialWorld(3, 3);
    const center = cellId(1, 1);
    world.orb.cellId = center;
    world.cells[center].height = 1.4;
    world.cells[cellId(0, 1)].height = 0.9;
    world.cells[cellId(1, 0)].height = 1.2;
    world.cells[cellId(1, 2)].height = 1.3;
    world.cells[cellId(2, 1)].height = 1.1;

    const result = simulate(world, { type: 'RAISE_CELL', cellId: cellId(2, 2) });

    expect(result.state.orb.cellId).toBe(cellId(0, 1));
    expect(result.events).toContainEqual({ type: 'ORB_MOVED', from: center, to: cellId(0, 1) });
  });
});
