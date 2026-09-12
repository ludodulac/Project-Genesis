export type ConflictVariant = 'conflict' | 'single' | 'aligned';

export type ConflictCell = { row: number; col: number; height: number };
export type ConflictMote = { id: 'amber' | 'cyan'; row: number; col: number; goal: { row: number; col: number }; arrived: boolean; wrong: boolean };
export type ConflictingFlowState = {
  rows: number;
  cols: number;
  cells: ConflictCell[];
  motes: ConflictMote[];
  variant: ConflictVariant;
  resolved: boolean;
};

const MIN_HEIGHT = 0;

export function createConflictingFlowState(variant: ConflictVariant = 'conflict'): ConflictingFlowState {
  const rows = 7;
  const cols = 7;
  const heights = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 4));

  // Both autonomous processes arrive at the same fork. The two exits are tied,
  // so they wait until the player makes one branch strictly lower.
  heights[3][1] = 3;
  heights[3][2] = 2.5;
  heights[3][3] = 2;
  heights[2][3] = 2;
  heights[4][3] = 2;
  heights[1][3] = 0.5;
  heights[5][3] = 0.5;

  const cells: ConflictCell[] = [];
  for (let row = 0; row < rows; row += 1) for (let col = 0; col < cols; col += 1) cells.push({ row, col, height: heights[row][col] });

  const amberGoal = { row: 1, col: 3 };
  const cyanGoal = variant === 'aligned' ? amberGoal : { row: 5, col: 3 };
  const motes: ConflictMote[] = [
    { id: 'amber', row: 3, col: 1, goal: amberGoal, arrived: false, wrong: false },
  ];
  if (variant !== 'single') motes.push({ id: 'cyan', row: 3, col: 1, goal: cyanGoal, arrived: false, wrong: false });

  return { rows, cols, cells, motes, variant, resolved: false };
}

export function getConflictCell(state: ConflictingFlowState, row: number, col: number) {
  return state.cells.find((cell) => cell.row === row && cell.col === col);
}

export function pressConflictCell(state: ConflictingFlowState, row: number, col: number): ConflictingFlowState {
  if (state.resolved) return state;
  const target = getConflictCell(state, row, col);
  if (!target) return state;
  const cells = state.cells.map((cell) => ({ ...cell }));
  const copy = cells.find((cell) => cell.row === row && cell.col === col)!;
  if (copy.height <= MIN_HEIGHT) return state;
  copy.height = Math.max(MIN_HEIGHT, copy.height - 1);
  return { ...state, cells };
}

export function advanceConflictingFlow(state: ConflictingFlowState): ConflictingFlowState {
  if (state.resolved) return state;
  let changed = false;
  const motes = state.motes.map((mote) => {
    if (mote.arrived || mote.wrong) return mote;
    const next = nextCell(state, mote.row, mote.col);
    if (!next) return mote;
    changed = true;
    const arrived = next.row === mote.goal.row && next.col === mote.goal.col;
    const anyGoal = state.motes.some((other) => other.goal.row === next.row && other.goal.col === next.col);
    const wrong = anyGoal && !arrived;
    return { ...mote, row: next.row, col: next.col, arrived, wrong };
  });
  if (!changed) return state;
  const resolved = motes.every((mote) => mote.arrived || mote.wrong);
  return { ...state, motes, resolved };
}

function nextCell(state: ConflictingFlowState, row: number, col: number): ConflictCell | null {
  const current = getConflictCell(state, row, col)!;
  const candidates = [
    { row: row - 1, col }, { row: row + 1, col }, { row, col: col - 1 }, { row, col: col + 1 },
  ]
    .filter((p) => p.row >= 0 && p.row < state.rows && p.col >= 0 && p.col < state.cols)
    .map((p) => getConflictCell(state, p.row, p.col)!)
    .filter((cell) => cell.height < current.height - 1e-9)
    .sort((a, b) => a.height - b.height || a.row - b.row || a.col - b.col);
  if (candidates.length === 0) return null;
  if (candidates.length > 1 && Math.abs(candidates[0].height - candidates[1].height) < 1e-9) return null;
  return candidates[0];
}
