import { describe, expect, it } from 'vitest';
import { EXP030_SCENARIOS, tap030 } from '../src/experiments/exp030-discovery';

describe('EXP-030 discovery', () => {
  it('does not let direct contact alter the exceptional cell', () => {
    const result = tap030(EXP030_SCENARIOS[0], 0, 2);
    expect(result.board[0][2]).toBe(3);
    expect(result.waves).toHaveLength(0);
  });

  it('lets an adjacent burst alter the exceptional cell', () => {
    const result = tap030(EXP030_SCENARIOS[0], 1, 2);
    expect(result.board[0][2]).toBe(0);
  });

  it('keeps ordinary preparation behavior unchanged', () => {
    const result = tap030(EXP030_SCENARIOS[1], 1, 1);
    expect(result.board[1][1]).toBe(1);
    expect(result.waves).toHaveLength(0);
  });

  it('makes the second situation solvable by applying the discovered relation', () => {
    const result = tap030(EXP030_SCENARIOS[1], 1, 2);
    expect(result.board[0][1]).toBe(0);
  });
});
