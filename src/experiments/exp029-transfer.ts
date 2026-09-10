import { tap, type Board } from './exp028-threshold';

export const EXP029_SCENARIOS: Board[] = [
  [
    [0, 2, 1, 0],
    [1, 2, 2, 1],
    [0, 1, 2, 0],
    [0, 0, 0, 0],
  ],
  [
    [1, 2, 0, 1],
    [2, 2, 1, 2],
    [0, 1, 2, 1],
    [0, 0, 1, 0],
  ],
  [
    [0, 1, 2, 0],
    [1, 2, 2, 1],
    [2, 1, 2, 2],
    [0, 1, 1, 0],
  ],
];

export interface ActionProfile {
  row: number;
  col: number;
  cascadeSize: number;
  waves: number;
  preparesOnly: boolean;
}

export function profile(board: Board): ActionProfile[] {
  const beforeOccupied = occupied(board);
  const actions: ActionProfile[] = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) continue;
      const result = tap(board, row, col);
      const removed = beforeOccupied - occupied(result.board);
      actions.push({
        row,
        col,
        cascadeSize: removed,
        waves: result.waves.length,
        preparesOnly: result.waves.length === 0,
      });
    }
  }
  return actions;
}

function occupied(board: Board): number {
  return board.flat().filter(cell => cell !== 0).length;
}
