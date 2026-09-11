export type GuidedFlowVariant = 'coupled' | 'edit-only' | 'flow-only';

export type FlowCell = {
  row: number;
  col: number;
  height: number;
};

export type GuidedFlowState = {
  rows: number;
  cols: number;
  cells: FlowCell[];
  mote: { row: number; col: number };
  goal: { row: number; col: number };
  variant: GuidedFlowVariant;
  arrived: boolean;
};

const MIN_HEIGHT = 0;
const MAX_HEIGHT = 4;
const PRESS_AMOUNT = 1;
const NEIGHBOUR_LIFT = 0.25;

export function createGuidedFlowState(variant: GuidedFlowVariant = 'coupled'): GuidedFlowState {
  const rows = 7;
  const cols = 7;
  const heights = [
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
  ];

  // One short visible descent lets the autonomous process reveal itself, then stop.
  heights[3][2] = 2.5;
  heights[2][3] = 2.75;
  heights[4][3] = 2.75;
  heights[3][5] = 2.5;

  const cells: FlowCell[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      cells.push({ row, col, height: heights[row][col] });
    }
  }

  return {
    rows,
    cols,
    cells,
    mote: { row: 3, col: 1 },
    goal: { row: 3, col: 5 },
    variant,
    arrived: false,
  };
}

export function getFlowCell(state: GuidedFlowState, row: number, col: number): FlowCell | undefined {
  return state.cells.find((cell) => cell.row === row && cell.col === col);
}

export function pressFlowCell(state: GuidedFlowState, row: number, col: number): GuidedFlowState {
  if (state.variant === 'flow-only') return state;
  const target = getFlowCell(state, row, col);
  if (!target) return state;

  const cells = state.cells.map((cell) => ({ ...cell }));
  const copy = cells.find((cell) => cell.row === row && cell.col === col)!;
  const amount = Math.min(PRESS_AMOUNT, copy.height - MIN_HEIGHT);
  if (amount <= 0) return state;

  copy.height -= amount;
  const neighbours = orthogonalPositions(state.rows, state.cols, row, col);
  const share = amount / neighbours.length;
  for (const neighbour of neighbours) {
    const cell = cells.find((candidate) => candidate.row === neighbour.row && candidate.col === neighbour.col)!;
    cell.height = Math.min(MAX_HEIGHT, cell.height + Math.min(NEIGHBOUR_LIFT, share));
  }

  return { ...state, cells };
}

export function advanceFlow(state: GuidedFlowState): GuidedFlowState {
  if (state.variant === 'edit-only' || state.arrived) return state;

  const current = getFlowCell(state, state.mote.row, state.mote.col)!;
  const candidates = orthogonalPositions(state.rows, state.cols, state.mote.row, state.mote.col)
    .map((position) => getFlowCell(state, position.row, position.col)!)
    .filter((cell) => cell.height < current.height - 1e-9)
    .sort((a, b) => a.height - b.height || a.row - b.row || a.col - b.col);

  if (candidates.length === 0) return state;
  if (candidates.length > 1 && Math.abs(candidates[0].height - candidates[1].height) < 1e-9) return state;

  const next = candidates[0];
  const mote = { row: next.row, col: next.col };
  const arrived = mote.row === state.goal.row && mote.col === state.goal.col;
  return { ...state, mote, arrived };
}

export function nextFlowCell(state: GuidedFlowState): { row: number; col: number } | null {
  const next = advanceFlow(state);
  if (next === state || (next.mote.row === state.mote.row && next.mote.col === state.mote.col)) return null;
  return next.mote;
}

function orthogonalPositions(rows: number, cols: number, row: number, col: number) {
  return [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ].filter((position) => position.row >= 0 && position.row < rows && position.col >= 0 && position.col < cols);
}
