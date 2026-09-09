export type CellId = `${number}:${number}`;
export type CellKind = 'ground' | 'water-source' | 'seed' | 'bloom' | 'haven';
export type Element = 'water';

export interface Cell {
  id: CellId;
  row: number;
  col: number;
  height: number;
  kind: CellKind;
}

export interface Agent {
  id: 'mote-a' | 'mote-b' | 'mote-c';
  cellId: CellId;
  carrying: Element | null;
  targetId: CellId;
  arrived: boolean;
}

export interface WorldState {
  rows: number;
  cols: number;
  cells: Record<CellId, Cell>;
  agents: Agent[];
}

export function cellId(row: number, col: number): CellId { return `${row}:${col}`; }

export function createInitialWorld(rows = 20, cols = 12): WorldState {
  const cells = {} as Record<CellId, Cell>;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const id = cellId(row, col);
      const broadWave = Math.sin(row * 0.72) * 0.09 + Math.cos(col * 0.83) * 0.08;
      const localVariation = ((row * 7 + col * 11) % 5) * 0.025;
      cells[id] = { id, row, col, height: 0.52 + broadWave + localVariation, kind: 'ground' };
    }
  }

  const waterSource = cellId(Math.min(rows - 1, 7), Math.min(cols - 1, 8));
  if (cells[waterSource]) cells[waterSource].kind = 'water-source';

  const seedPositions = [cellId(Math.min(rows - 1, 5), Math.min(cols - 1, 3)), cellId(Math.min(rows - 1, 10), Math.min(cols - 1, 9)), cellId(Math.min(rows - 1, 16), Math.min(cols - 1, 5))];
  for (const seed of seedPositions) if (cells[seed] && cells[seed].kind === 'ground') cells[seed].kind = 'seed';

  const starts = [cellId(Math.min(rows - 1, 10), Math.min(cols - 1, 5)), cellId(Math.min(rows - 1, 12), Math.min(cols - 1, 7)), cellId(Math.min(rows - 1, 14), Math.min(cols - 1, 4))];
  const targets = [cellId(Math.min(rows - 1, 3), Math.min(cols - 1, 2)), cellId(Math.min(rows - 1, 4), Math.min(cols - 1, 9)), cellId(Math.min(rows - 1, 17), Math.min(cols - 1, 9))];
  for (const target of targets) if (cells[target]) cells[target].kind = 'haven';

  return {
    rows, cols, cells,
    agents: [
      { id: 'mote-a', cellId: starts[0], carrying: null, targetId: targets[0], arrived: starts[0] === targets[0] },
      { id: 'mote-b', cellId: starts[1], carrying: null, targetId: targets[1], arrived: starts[1] === targets[1] },
      { id: 'mote-c', cellId: starts[2], carrying: null, targetId: targets[2], arrived: starts[2] === targets[2] },
    ],
  };
}

export function neighboursOf(world: WorldState, id: CellId): Cell[] {
  const cell = world.cells[id];
  if (!cell) return [];
  const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const;
  return offsets.map(([dr, dc]) => world.cells[cellId(cell.row + dr, cell.col + dc)]).filter((candidate): candidate is Cell => Boolean(candidate));
}
