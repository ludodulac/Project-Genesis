import { describe, expect, it } from 'vitest';
import {
  PRESSURE_INITIAL,
  initialPressureState,
  nextPressureFeed,
  shiftPressure,
  stepPressure,
  type PressureState,
} from '../src/experiments/exp031-global-pressure';

describe('EXP-031 global pressure', () => {
  it('moves the whole board one cell in the chosen direction', () => {
    const result = shiftPressure([
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 2, 0],
      [0, 0, 0, 0],
    ], 'down');
    expect(result.board).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 2, 0],
    ]);
  });

  it('clears opposite pieces when one is pushed into the other', () => {
    const result = shiftPressure([
      [0, 0, 0, 0],
      [1, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ], 'left');
    expect(result.cleared).toBe(2);
    expect(result.board[1]).toEqual([0, 0, 0, 0]);
  });

  it('lets equal pieces block rather than silently inventing a merge rule', () => {
    const result = shiftPressure([
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ], 'left');
    expect(result.cleared).toBe(0);
    expect(result.board[1]).toEqual([1, 1, 0, 0]);
    expect(result.changed).toBe(false);
  });

  it('does not advance the feed after a no-op swipe', () => {
    const state: PressureState = {
      board: [
        [1, 0, 0, 0],
        [2, 0, 0, 0],
        [1, 0, 0, 0],
        [2, 0, 0, 0],
      ],
      turn: 3,
      alive: true,
      cleared: 0,
    };
    const result = stepPressure(state, 'left');
    expect(result.advanced).toBe(false);
    expect(result.turn).toBe(3);
  });

  it('adds the visible deterministic incoming piece after an advancing swipe', () => {
    const state = initialPressureState();
    const incoming = nextPressureFeed(state.turn);
    const result = stepPressure(state, 'down');
    expect(result.advanced).toBe(true);
    expect(result.board[0][incoming.col]).toBe(incoming.cell);
    expect(result.turn).toBe(1);
  });

  it('ends the run only when the telegraphed entry cell is still occupied', () => {
    const state: PressureState = {
      board: [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
      turn: 0,
      alive: true,
      cleared: 0,
    };
    const result = stepPressure(state, 'right');
    expect(result.advanced).toBe(true);
    expect(result.alive).toBe(false);
  });

  it('starts with materially different consequences for different swipes', () => {
    const left = shiftPressure(PRESSURE_INITIAL, 'left');
    const down = shiftPressure(PRESSURE_INITIAL, 'down');
    expect(left.cleared).toBe(2);
    expect(down.cleared).toBe(0);
    expect(left.board).not.toEqual(down.board);
  });
});
