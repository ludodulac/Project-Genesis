import { describe, expect, it } from 'vitest';
import { EXP029_SCENARIOS, profile } from '../src/experiments/exp029-transfer';

describe('EXP-029 transfer scenarios', () => {
  it('keeps exactly the EXP-028 verb and rule set', () => {
    expect(EXP029_SCENARIOS).toHaveLength(3);
    for (const board of EXP029_SCENARIOS) {
      expect(board).toHaveLength(4);
      expect(board.every(row => row.length === 4)).toBe(true);
      expect(board.flat().every(cell => cell === 0 || cell === 1 || cell === 2)).toBe(true);
    }
  });

  it('each scenario contains both immediate and preparatory choices', () => {
    for (const board of EXP029_SCENARIOS) {
      const actions = profile(board);
      expect(actions.some(action => action.preparesOnly)).toBe(true);
      expect(actions.some(action => !action.preparesOnly)).toBe(true);
    }
  });

  it('new topologies do not collapse to one visible consequence', () => {
    for (const board of EXP029_SCENARIOS) {
      const actions = profile(board);
      const signatures = new Set(actions.map(action => `${action.cascadeSize}:${action.waves}:${action.preparesOnly}`));
      expect(signatures.size).toBeGreaterThanOrEqual(3);
    }
  });
});
