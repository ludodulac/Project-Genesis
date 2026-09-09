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
    expect(result.state.cells[targetId].height).toBeCloseTo(beforeTarget + 0.46);
    expect(result.state.cells[cellId(1, 0)].height).toBeCloseTo(beforeNeighbour + 0.09);
  });

  it('moves agents deterministically toward a clearly lower neighbouring cell', () => {
    const world = createInitialWorld(5, 5);
    const agent = world.agents[0];
    const center = cellId(2, 2);
    agent.cellId = center;
    world.cells[center].height = 1.4;
    world.cells[cellId(1, 2)].height = 0.8;
    world.cells[cellId(2, 1)].height = 1.1;
    world.cells[cellId(2, 3)].height = 1.2;
    world.cells[cellId(3, 2)].height = 1.0;

    const result = simulate(world, { type: 'RAISE_CELL', cellId: cellId(4, 4) });

    expect(result.state.agents[0].cellId).toBe(cellId(1, 2));
    expect(result.events).toContainEqual({
      type: 'AGENT_MOVED',
      agentId: 'mote-a',
      from: center,
      to: cellId(1, 2),
    });
  });

  it('lets an agent collect water when it reaches the source', () => {
    const world = createInitialWorld(10, 10);
    const source = cellId(7, 8);
    const approach = cellId(7, 7);
    const agent = world.agents[0];
    agent.cellId = approach;
    world.cells[approach].height = 1.2;
    world.cells[source].height = 0.5;
    world.cells[cellId(6, 7)].height = 1.3;
    world.cells[cellId(8, 7)].height = 1.3;
    world.cells[cellId(7, 6)].height = 1.3;

    const result = simulate(world, { type: 'RAISE_CELL', cellId: cellId(0, 0) });

    expect(result.state.agents[0].cellId).toBe(source);
    expect(result.state.agents[0].carrying).toBe('water');
    expect(result.events).toContainEqual({
      type: 'AGENT_CHARGED',
      agentId: 'mote-a',
      element: 'water',
      cellId: source,
    });
  });
});
