export type WatershedCell = { row: number; col: number; height: number };
export type WaterPulse = { id: number; row: number; col: number; settled: boolean };
export type WatershedOutcome = 'playing' | 'won' | 'lost';

export type WatershedState = {
  rows: number;
  cols: number;
  cells: WatershedCell[];
  pulses: WaterPulse[];
  gardens: { row: number; col: number; wet: boolean; side: 'left' | 'right' }[];
  village: { row: number; col: number };
  source: { row: number; col: number };
  turn: number;
  maxTurns: number;
  nextPulseId: number;
  outcome: WatershedOutcome;
};

const EPSILON = 1e-9;
const LOWER_STEP = 0.5;
const PULSE_TURNS = new Set([4]);

export function createWatershedState(): WatershedState {
  const rows = 7;
  const cols = 7;
  const heights = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 6));

  // One shared watershed. Water descends a readable spine into a three-way
  // junction. Left/right feed the two gardens. The middle route reaches the
  // village, so doing nothing is a legible failure rather than a neutral wait.
  heights[0][3] = 5;
  heights[1][3] = 4;
  heights[2][3] = 3;
  heights[3][3] = 2;

  heights[3][2] = 1.5;
  heights[3][1] = 0.75;
  heights[4][1] = 0.25;
  heights[5][1] = 0;

  heights[3][4] = 1.5;
  heights[3][5] = 0.25;
  heights[4][5] = 0.1;
  heights[5][5] = 0;

  heights[4][3] = 1.25;
  heights[5][3] = 0.5;
  heights[6][3] = 0;

  const cells: WatershedCell[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) cells.push({ row, col, height: heights[row][col] });
  }

  return {
    rows,
    cols,
    cells,
    pulses: [{ id: 0, row: 0, col: 3, settled: false }],
    gardens: [
      { row: 5, col: 1, wet: false, side: 'left' },
      { row: 5, col: 5, wet: false, side: 'right' },
    ],
    village: { row: 6, col: 3 },
    source: { row: 0, col: 3 },
    turn: 0,
    maxTurns: 13,
    nextPulseId: 1,
    outcome: 'playing',
  };
}

export function getWatershedCell(state: WatershedState, row: number, col: number) {
  return state.cells.find((cell) => cell.row === row && cell.col === col);
}

export function playWatershedTurn(state: WatershedState, row: number, col: number): WatershedState {
  if (state.outcome !== 'playing') return state;
  const target = getWatershedCell(state, row, col);
  if (!target) return state;

  const cells = state.cells.map((cell) => ({ ...cell }));
  const edited = cells.find((cell) => cell.row === row && cell.col === col)!;
  edited.height = Math.max(0, edited.height - LOWER_STEP);

  let working: WatershedState = { ...state, cells };
  const moved = working.pulses.map((pulse) => advancePulse(working, pulse));
  working = { ...working, pulses: moved, turn: working.turn + 1 };

  const villageWet = moved.some((pulse) => pulse.row === working.village.row && pulse.col === working.village.col);
  const gardens = working.gardens.map((garden) => ({
    ...garden,
    wet: garden.wet || moved.some((pulse) => pulse.row === garden.row && pulse.col === garden.col),
  }));

  if (villageWet) return { ...working, gardens, outcome: 'lost' };
  if (gardens.every((garden) => garden.wet)) return { ...working, gardens, outcome: 'won' };

  let pulses = moved;
  let nextPulseId = working.nextPulseId;
  if (PULSE_TURNS.has(working.turn)) {
    pulses = [...pulses, { id: nextPulseId, row: working.source.row, col: working.source.col, settled: false }];
    nextPulseId += 1;
  }

  const outcome: WatershedOutcome = working.turn >= working.maxTurns ? 'lost' : 'playing';
  return { ...working, gardens, pulses, nextPulseId, outcome };
}

function advancePulse(state: WatershedState, pulse: WaterPulse): WaterPulse {
  if (pulse.settled) return pulse;
  const garden = state.gardens.find((g) => g.row === pulse.row && g.col === pulse.col);
  if (garden) return { ...pulse, settled: true };
  if (pulse.row === state.village.row && pulse.col === state.village.col) return { ...pulse, settled: true };

  const current = getWatershedCell(state, pulse.row, pulse.col)!;
  const candidates = [
    { row: pulse.row - 1, col: pulse.col },
    { row: pulse.row + 1, col: pulse.col },
    { row: pulse.row, col: pulse.col - 1 },
    { row: pulse.row, col: pulse.col + 1 },
  ]
    .filter((p) => p.row >= 0 && p.row < state.rows && p.col >= 0 && p.col < state.cols)
    .map((p) => getWatershedCell(state, p.row, p.col)!)
    .filter((cell) => cell.height < current.height - EPSILON)
    .sort((a, b) => a.height - b.height || a.row - b.row || a.col - b.col);

  if (candidates.length === 0) return pulse;
  if (candidates.length > 1 && Math.abs(candidates[0].height - candidates[1].height) < EPSILON) return pulse;
  return { ...pulse, row: candidates[0].row, col: candidates[0].col };
}
