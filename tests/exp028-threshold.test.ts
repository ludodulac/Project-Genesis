import { describe, expect, it } from 'vitest';
import { tap, type Board } from '../src/experiments/exp028-threshold';

describe('EXP-028 threshold cascade', () => {
  it('persists preparation without inventing a cascade', () => {
    const board: Board = [[2,2]];
    const result = tap(board, 0, 0);
    expect(result.board).toEqual([[1,2]]);
    expect(result.waves).toHaveLength(0);
  });

  it('a ready cell bursts and prepares an orthogonal neighbour', () => {
    const board: Board = [[1,2]];
    const result = tap(board, 0, 0);
    expect(result.board).toEqual([[0,1]]);
    expect(result.waves).toHaveLength(1);
  });

  it('propagates when a neighbour reaches zero', () => {
    const board: Board = [[1,1,2]];
    const result = tap(board, 0, 0);
    expect(result.board).toEqual([[0,0,1]]);
    expect(result.waves.map(w => w.bursts)).toEqual([
      [{ row: 0, col: 0 }],
      [{ row: 0, col: 1 }],
    ]);
  });

  it('combines simultaneous hits independent of source order', () => {
    const board: Board = [[0,1,0],[1,2,1],[0,1,0]];
    const first = tap(board, 0, 1);
    const second = tap(first.board, 1, 0);
    expect(second.board[1][1]).toBe(0);
    expect(second.waves.length).toBeGreaterThan(1);
  });

  it('never propagates diagonally', () => {
    const board: Board = [[1,0],[0,1]];
    expect(tap(board, 0, 0).board).toEqual([[0,0],[0,1]]);
  });
});
