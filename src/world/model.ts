export type CellId = `${number}:${number}`;

export interface Cell {
  id: CellId;
  row: number;
  col: number;
  height: number;
}

export interface Orb {
  id: 'orb';
  cellId: CellId;
}

export interface WorldState {
  rows: number;
  cols: number;
  cells: Record<CellId, Cell>;
  orb: Orb;
}

export function cellId(row: number, col: number): CellId {
  return `${row}:${col}`;
}

export function createInitialWorld(rows = 12, cols = 12): WorldState {
  const cells = {} as Record<CellId, Cell>;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const id = cellId(row, col);
      const softRelief = ((row * 7 + col * 11) % 5) * 0.06;
      cells[id] = { id, row, col, height: 0.45 + softRelief };
    }
  }

  return {
    rows,
    cols,
    cells,
    orb: { id: 'orb', cellId: cellId(Math.floor(rows / 2), Math.floor(cols / 2)) },
  };
}

export function neighboursOf(world: WorldState, id: CellId): Cell[] {
  const cell = world.cells[id];
  if (!cell) return [];

  const offsets = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ] as const;

  return offsets
    .map(([dr, dc]) => world.cells[cellId(cell.row + dr, cell.col + dc)])
    .filter((candidate): candidate is Cell => Boolean(candidate));
}
