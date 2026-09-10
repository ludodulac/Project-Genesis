export type Cell = 0 | 1 | 2;
export type Board = Cell[][];

export interface Wave {
  cells: Array<{ row: number; col: number }>;
}

export interface CascadeResult {
  board: Board;
  waves: Wave[];
}

const ORTHO = [[-1,0],[1,0],[0,-1],[0,1]] as const;

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

export function trigger(board: Board, row: number, col: number): CascadeResult {
  const next = cloneBoard(board);
  if (!next[row]?.[col]) return { board: next, waves: [] };

  let frontier = [{ row, col }];
  const waves: Wave[] = [];
  const seen = new Set<string>();

  while (frontier.length) {
    const waveCells: Array<{ row: number; col: number }> = [];
    const following: Array<{ row: number; col: number }> = [];

    for (const p of frontier) {
      const key = `${p.row}:${p.col}`;
      if (seen.has(key) || next[p.row][p.col] === 0) continue;
      seen.add(key);
      waveCells.push(p);
      next[p.row][p.col] = 0;

      for (const [dr, dc] of ORTHO) {
        const nr = p.row + dr;
        const nc = p.col + dc;
        if (next[nr]?.[nc] === 2) {
          next[nr][nc] = 1;
          following.push({ row: nr, col: nc });
        }
      }
    }

    if (waveCells.length) waves.push({ cells: waveCells });
    frontier = following;
  }

  return { board: next, waves };
}
