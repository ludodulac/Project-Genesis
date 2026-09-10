export type Cell = 0 | 1 | 2;
export type Board = Cell[][];
export interface Pos { row: number; col: number }
export interface Wave { bursts: Pos[]; board: Board }
export interface TurnResult { board: Board; waves: Wave[] }

export const EXP028_START: Board = [
  [0, 1, 1, 0],
  [1, 2, 2, 0],
  [0, 1, 2, 0],
  [0, 0, 0, 0],
];

const ORTHO = [[-1,0],[1,0],[0,-1],[0,1]] as const;
export const cloneBoard = (board: Board): Board => board.map(row => [...row]);

/**
 * One tap removes one charge from a cell. A cell that reaches zero bursts.
 * Every burst removes one charge from each orthogonal neighbour; neighbours
 * reaching zero burst together on the next wave. Damage persists between taps.
 */
export function tap(board: Board, row: number, col: number): TurnResult {
  const next = cloneBoard(board);
  const current = next[row]?.[col] ?? 0;
  if (current === 0) return { board: next, waves: [] };

  next[row][col] = (current - 1) as Cell;
  if (next[row][col] !== 0) return { board: next, waves: [] };

  let frontier: Pos[] = [{ row, col }];
  const waves: Wave[] = [];
  const burst = new Set<string>();

  while (frontier.length) {
    const unique = frontier.filter(p => {
      const key = `${p.row}:${p.col}`;
      if (burst.has(key)) return false;
      burst.add(key);
      return true;
    });
    if (!unique.length) break;

    const hits = new Map<string, { pos: Pos; count: number }>();
    for (const p of unique) {
      for (const [dr, dc] of ORTHO) {
        const nr = p.row + dr;
        const nc = p.col + dc;
        if ((next[nr]?.[nc] ?? 0) === 0) continue;
        const key = `${nr}:${nc}`;
        const entry = hits.get(key) ?? { pos: { row: nr, col: nc }, count: 0 };
        entry.count += 1;
        hits.set(key, entry);
      }
    }

    const following: Pos[] = [];
    for (const { pos, count } of hits.values()) {
      const value = next[pos.row][pos.col];
      const reduced = Math.max(0, value - count) as Cell;
      next[pos.row][pos.col] = reduced;
      if (reduced === 0) following.push(pos);
    }
    waves.push({ bursts: unique, board: cloneBoard(next) });
    frontier = following;
  }

  return { board: next, waves };
}
