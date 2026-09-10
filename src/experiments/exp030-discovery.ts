export type Cell = 0 | 1 | 2 | 3;
export type Board = Cell[][];
export type Pos = { row: number; col: number };
export type Wave = { bursts: Pos[]; board: Board };
export type Result = { board: Board; waves: Wave[] };

export const clone030 = (board: Board): Board => board.map(row => [...row]);

const neighbors = (board: Board, row: number, col: number): Pos[] => [
  { row: row - 1, col }, { row: row + 1, col }, { row, col: col - 1 }, { row, col: col + 1 },
].filter(p => p.row >= 0 && p.row < board.length && p.col >= 0 && p.col < board[0].length);

// 1/2 are the known threshold material. 3 is deliberately only affected by a burst.
// Direct contact with 3 does nothing; one adjacent burst opens it completely.
export function tap030(input: Board, row: number, col: number): Result {
  const board = clone030(input);
  const cell = board[row]?.[col] ?? 0;
  if (cell === 0 || cell === 3) return { board, waves: [] };

  board[row][col] = (cell - 1) as Cell;
  if (board[row][col] !== 0) return { board, waves: [] };

  let frontier: Pos[] = [{ row, col }];
  const waves: Wave[] = [];
  while (frontier.length) {
    const hits = new Map<string, number>();
    for (const p of frontier) {
      for (const n of neighbors(board, p.row, p.col)) {
        if (board[n.row][n.col] !== 0) {
          const key = `${n.row}:${n.col}`;
          hits.set(key, (hits.get(key) ?? 0) + 1);
        }
      }
    }

    const next: Pos[] = [];
    for (const [key, count] of hits) {
      const [r, c] = key.split(':').map(Number);
      const value = board[r][c];
      if (value === 3) {
        board[r][c] = 0;
        next.push({ row: r, col: c });
      } else {
        board[r][c] = Math.max(0, value - count) as Cell;
        if (board[r][c] === 0) next.push({ row: r, col: c });
      }
    }
    waves.push({ bursts: frontier, board: clone030(board) });
    frontier = next;
  }
  return { board, waves };
}

// First situation makes the exception observable without requiring it.
// Second situation only clears if the observation changes how the player acts.
export const EXP030_SCENARIOS: Board[] = [
  [
    [0, 0, 3, 0],
    [0, 1, 1, 0],
    [0, 2, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 3, 0, 0],
    [0, 2, 1, 0],
    [0, 1, 2, 0],
    [0, 0, 1, 0],
  ],
];
