import { describe, expect, it } from 'vitest';
import {
  createDuelState,
  cycleTechnique,
  isActionLegal,
  nextTechnique,
  resolveExchange,
  type DuelPlayerState,
} from '../src/duel/simulation';

describe('DUEL lab v0', () => {
  it('starts both fighters with identical public cycles', () => {
    const state = createDuelState();
    expect(state.players[0].active).toEqual(['rush', 'intercept', 'reversal']);
    expect(state.players[1].active).toEqual(state.players[0].active);
    expect(nextTechnique(state.players[0])).toBe('break');
    expect(nextTechnique(state.players[1])).toBe('break');
  });

  it('rotates an advanced technique deterministically instead of using time or shuffle', () => {
    let player: DuelPlayerState = createDuelState().players[0];
    player = cycleTechnique(player, 'reversal');
    expect(player.active).toEqual(['rush', 'intercept', 'break']);
    expect(player.queue).toEqual(['fade', 'drive', 'reversal']);

    player = cycleTechnique(player, 'rush');
    player = cycleTechnique(player, 'intercept');
    player = cycleTechnique(player, 'break');
    expect(player.active).toContain('reversal');
  });

  it('never rotates the cycle when a fundamental is used', () => {
    const start = createDuelState();
    const before = start.players[0].active;
    const result = resolveExchange(start, 'retreat', 'brace');
    expect(result.state.players[0].active).toEqual(before);
    expect(result.state.players[0].position).toBe(0);
  });

  it('makes spending reversal create a real public absence while fundamentals remain legal', () => {
    const start = createDuelState();
    const result = resolveExchange(start, 'reversal', 'rush');
    expect(result.state.players[0].active).not.toContain('reversal');
    expect(isActionLegal(result.state, 0, 'press')).toBe(true);
    expect(isActionLegal(result.state, 0, 'brace')).toBe(true);
    expect(isActionLegal(result.state, 0, 'retreat')).toBe(true);
  });

  it('uses energy as an extra tradeoff without changing deterministic cycle order', () => {
    const start = createDuelState();
    const result = resolveExchange(start, 'rush', 'brace');
    // Rush costs 2, then one pip returns after the exchange.
    expect(result.state.players[0].energy).toBe(2);
    expect(result.state.players[0].active).toEqual(['intercept', 'reversal', 'break']);
    expect(nextTechnique(result.state.players[0])).toBe('fade');
  });

  it('lets territory turn a close-range premium action into a ring-out threat', () => {
    const start = createDuelState();
    start.players[0].position = 4;
    start.players[1].position = 5;
    start.players[0].active = ['drive', 'rush', 'intercept'];
    start.players[0].queue = ['reversal', 'break', 'fade'];
    start.players[0].energy = 5;
    const result = resolveExchange(start, 'drive', 'brace');
    expect(result.state.winner).toBe(0);
  });

  it('is deterministic for identical state and actions', () => {
    const a = resolveExchange(createDuelState(), 'rush', 'intercept');
    const b = resolveExchange(createDuelState(), 'rush', 'intercept');
    expect(a).toEqual(b);
  });
});
