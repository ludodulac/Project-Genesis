import { describe, expect, it } from 'vitest';
import { EXP028_START, tap, type Board } from '../src/experiments/exp028-threshold';

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

  it('combines truly simultaneous hits before deciding the next wave', () => {
    const board: Board = [[1,1],[1,2]];
    const result = tap(board, 0, 0);
    expect(result.waves.map(w => w.bursts)).toEqual([
      [{ row: 0, col: 0 }],
      [{ row: 1, col: 0 }, { row: 0, col: 1 }],
      [{ row: 1, col: 1 }],
    ]);
    expect(result.board).toEqual([[0,0],[0,0]]);
  });

  it('never propagates diagonally', () => {
    const board: Board = [[1,0],[0,1]];
    expect(tap(board, 0, 0).board).toEqual([[0,0],[0,1]]);
  });

  it('keeps different choices meaningfully different on the human-test board', () => {
    const actions = EXP028_START.flatMap((row, r) => row.map((cell, c) => ({ cell, r, c })))
      .filter(action => action.cell !== 0)
      .map(action => {
        const result = tap(EXP028_START, action.r, action.c);
        return {
          cell: action.cell,
          bursts: result.waves.reduce((sum, wave) => sum + wave.bursts.length, 0),
        };
      });

    const readySizes = new Set(actions.filter(a => a.cell === 1).map(a => a.bursts));
    expect([...readySizes].sort()).toEqual([1,2]);
    expect(actions.filter(a => a.cell === 2).every(a => a.bursts === 0)).toBe(true);
  });

  it('allows a quiet preparation move to unlock a larger next-turn cascade', () => {
    const prepared = tap(EXP028_START, 1, 1);
    expect(prepared.waves).toHaveLength(0);

    const followUp = tap(prepared.board, 2, 1);
    const burstCount = followUp.waves.reduce((sum, wave) => sum + wave.bursts.length, 0);
    expect(burstCount).toBeGreaterThanOrEqual(5);
  });
});
