export type PressureCell = 0 | 1 | 2;
export type PressureBoard = PressureCell[][];
export type PressureDirection = 'left' | 'right' | 'up' | 'down';

export type PressureState = {
  board: PressureBoard;
  turn: number;
  alive: boolean;
  cleared: number;
};

export type PressureStep = PressureState & {
  advanced: boolean;
  clearedThisTurn: number;
};

export const PRESSURE_SIZE = 4;

export const PRESSURE_INITIAL: PressureBoard = [
  [0, 0, 0, 0],
  [1, 2, 0, 0],
  [0, 0, 2, 1],
  [0, 1, 0, 0],
];

// Fully deterministic and externally previewable: no hidden spawn lottery.
export const PRESSURE_FEED: ReadonlyArray<{ cell: 1 | 2; col: number }> = [
  { cell: 1, col: 2 }, { cell: 2, col: 1 }, { cell: 1, col: 3 }, { cell: 2, col: 0 },
  { cell: 2, col: 2 }, { cell: 1, col: 1 }, { cell: 2, col: 0 }, { cell: 1, col: 3 },
  { cell: 1, col: 1 }, { cell: 2, col: 2 }, { cell: 1, col: 3 }, { cell: 2, col: 0 },
];

export function clonePressure(board: PressureBoard): PressureBoard {
  return board.map(row => [...row]);
}

export function initialPressureState(): PressureState {
  return { board: clonePressure(PRESSURE_INITIAL), turn: 0, alive: true, cleared: 0 };
}

export function nextPressureFeed(turn: number): { cell: 1 | 2; col: number } {
  return PRESSURE_FEED[turn % PRESSURE_FEED.length];
}

const delta: Record<PressureDirection, { dr: number; dc: number }> = {
  left: { dr: 0, dc: -1 }, right: { dr: 0, dc: 1 }, up: { dr: -1, dc: 0 }, down: { dr: 1, dc: 0 },
};

type Token = { row: number; col: number; value: 1 | 2; alive: boolean };

export function shiftPressure(board: PressureBoard, direction: PressureDirection): {
  board: PressureBoard; changed: boolean; cleared: number;
} {
  const { dr, dc } = delta[direction];
  const tokens: Token[] = [];
  for (let row = 0; row < PRESSURE_SIZE; row++) {
    for (let col = 0; col < PRESSURE_SIZE; col++) {
      const value = board[row][col];
      if (value) tokens.push({ row, col, value, alive: true });
    }
  }

  // Front-most pieces move first. Every token is processed exactly once.
  tokens.sort((a, b) => (b.row * dr + b.col * dc) - (a.row * dr + a.col * dc));
  const occupied = new Map<string, Token>();
  for (const token of tokens) occupied.set(`${token.row}:${token.col}`, token);

  let changed = false;
  let cleared = 0;

  for (const token of tokens) {
    if (!token.alive) continue;
    const nextRow = token.row + dr;
    const nextCol = token.col + dc;
    if (nextRow < 0 || nextRow >= PRESSURE_SIZE || nextCol < 0 || nextCol >= PRESSURE_SIZE) continue;

    const destination = occupied.get(`${nextRow}:${nextCol}`);
    if (destination?.alive) {
      if (destination.value !== token.value) {
        occupied.delete(`${token.row}:${token.col}`);
        occupied.delete(`${nextRow}:${nextCol}`);
        token.alive = false;
        destination.alive = false;
        changed = true;
        cleared += 2;
      }
      continue;
    }

    occupied.delete(`${token.row}:${token.col}`);
    token.row = nextRow;
    token.col = nextCol;
    occupied.set(`${nextRow}:${nextCol}`, token);
    changed = true;
  }

  const result: PressureBoard = Array.from({ length: PRESSURE_SIZE }, () => Array(PRESSURE_SIZE).fill(0) as PressureCell[]);
  for (const token of tokens) if (token.alive) result[token.row][token.col] = token.value;
  return { board: result, changed, cleared };
}

export function stepPressure(state: PressureState, direction: PressureDirection): PressureStep {
  if (!state.alive) return { ...state, board: clonePressure(state.board), advanced: false, clearedThisTurn: 0 };

  const shifted = shiftPressure(state.board, direction);
  if (!shifted.changed) {
    return { ...state, board: shifted.board, advanced: false, clearedThisTurn: 0 };
  }

  const board = shifted.board;
  const incoming = nextPressureFeed(state.turn);
  const blocked = board[0][incoming.col] !== 0;
  if (!blocked) board[0][incoming.col] = incoming.cell;

  return {
    board,
    turn: state.turn + 1,
    alive: !blocked,
    cleared: state.cleared + shifted.cleared,
    advanced: true,
    clearedThisTurn: shifted.cleared,
  };
}
