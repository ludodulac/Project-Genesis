import { describe, expect, it } from 'vitest';
import { createPredictionScenario, type PredictionScenarioId } from '../src/experiments/exp023-prediction';
import { simulateToy } from '../src/simulation/simulate';

const ids: PredictionScenarioId[] = ['toward', 'near-but-stay', 'away', 'occupied'];

describe('EXP-023 discriminant prediction harness', () => {
  for (const id of ids) {
    it(`${id} produces the expected first consequence`, () => {
      const scenario = createPredictionScenario(id);
      const result = simulateToy(scenario.world, { type: 'PRESS_CELL', cellId: scenario.targetCellId });
      expect(result.state.agents[0].cellId).toBe(scenario.expectedCellId);
    });
  }

  it('contains both movement and non-movement cases', () => {
    const outcomes = ids.map((id) => {
      const scenario = createPredictionScenario(id);
      return scenario.expectedCellId === scenario.world.agents[0].cellId ? 'stay' : 'move';
    });
    expect(new Set(outcomes)).toEqual(new Set(['stay', 'move']));
  });

  it('contains a case where the actor moves away from the touched side', () => {
    const scenario = createPredictionScenario('away');
    const start = scenario.world.cells[scenario.world.agents[0].cellId];
    const target = scenario.world.cells[scenario.targetCellId];
    const expected = scenario.world.cells[scenario.expectedCellId];
    expect(target.col).toBeGreaterThan(start.col);
    expect(expected.col).toBeLessThan(start.col);
  });

  it('contains a nearby touch that does not move the actor', () => {
    const scenario = createPredictionScenario('near-but-stay');
    const start = scenario.world.cells[scenario.world.agents[0].cellId];
    const target = scenario.world.cells[scenario.targetCellId];
    expect(Math.abs(target.row - start.row) + Math.abs(target.col - start.col)).toBe(1);
    expect(scenario.expectedCellId).toBe(scenario.world.agents[0].cellId);
  });
});
