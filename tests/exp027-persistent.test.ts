import { describe, expect, it } from 'vitest';
import { step, type Board } from '../src/experiments/exp027-persistent';

describe('EXP-027 persistent consequence', () => {
  it('consumes the touched cell and primes charged neighbours', () => {
    const board: Board = [[0,2,0],[2,1,2],[0,2,0]];
    const result = step(board, 1, 1);
    expect(result.board).toEqual([[0,1,0],[1,0,1],[0,1,0]]);
  });

  it('keeps the consequence for the next decision', () => {
    const board: Board = [[0,2,0],[2,1,2],[0,2,0]];
    const first = step(board, 1, 1);
    const second = step(first.board, 0, 1);
    expect(second.board).toEqual([[0,0,0],[1,0,1],[0,1,0]]);
  });

  it('does nothing on an empty cell', () => {
    const board: Board = [[0,1],[2,0]];
    expect(step(board, 0, 0).board).toEqual(board);
  });
});
