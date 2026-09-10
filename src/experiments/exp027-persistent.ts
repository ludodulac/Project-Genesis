export type Cell = 0 | 1 | 2;
export type Board = Cell[][];

export interface StepResult {
  board: Board;
  changed: Array<{ row: number; col: number }>;
}

const ORTHO = [[-1,0],[1,0],[0,-1],[0,1]] as const;

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

/**
 * One verb, persistent consequence:
 * touching a live cell consumes it. Each orthogonal charged neighbour (2)
 * becomes live (1). Nothing resets automatically, so every action changes
 * the opportunity map for the next action.
 */
export function step(board: Board, row: number, col: number): StepResult {
  const next = cloneBoard(board);
  if (!next[row]?.[col]) return { board: next, changed: [] };

  const changed = [{ row, col }];
  next[row][col] = 0;

  for (const [dr, dc] of ORTHO) {
    const nr = row + dr;
    const nc = col + dc;
    if (next[nr]?.[nc] === 2) {
      next[nr][nc] = 1;
      changed.push({ row: nr, col: nc });
    }
  }

  return { board: next, changed };
}
