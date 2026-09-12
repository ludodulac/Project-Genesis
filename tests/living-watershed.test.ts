import { describe, expect, it } from 'vitest';
import { createWatershedState, playWatershedTurn } from '../src/game/living-watershed';

const idle: [number, number] = [6, 6];

describe('Living Watershed vertical slice', () => {
  it('turns every terrain edit into one autonomous world step', () => {
    const start = createWatershedState();
    const next = playWatershedTurn(start, 3, 2);
    expect(next.turn).toBe(1);
    expect(next.pulses[0]).toMatchObject({ row: 1, col: 3 });
  });

  it('makes inaction at the shared junction eventually flood the village', () => {
    let state = createWatershedState();
    for (let i = 0; i < 6; i += 1) state = playWatershedTurn(state, idle[0], idle[1]);
    expect(state.outcome).toBe('lost');
    expect(state.pulses.some((pulse) => pulse.row === 6 && pulse.col === 3)).toBe(true);
  });

  it('can water the left garden, reshape the same junction, then water the right garden', () => {
    let state = createWatershedState();
    const actions: [number, number][] = [
      [3, 2], idle, idle, idle,
      [3, 3], [3, 3],
      [3, 4], [3, 4],
      idle, idle, idle,
    ];
    for (const [row, col] of actions) state = playWatershedTurn(state, row, col);
    expect(state.gardens.every((garden) => garden.wet)).toBe(true);
    expect(state.outcome).toBe('won');
  });

  it('freezes the resolved game state', () => {
    let state = createWatershedState();
    for (let i = 0; i < 6; i += 1) state = playWatershedTurn(state, idle[0], idle[1]);
    expect(playWatershedTurn(state, 0, 0)).toBe(state);
  });
});
