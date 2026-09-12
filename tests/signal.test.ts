import { describe, expect, it } from 'vitest';
import { createSignalState, moveOperator, rotateOperator, stepSignal, type SignalState } from '../src/game/signal';

function run(state: SignalState) {
  for (let i = 0; i < 1600 && state.outcome === 'playing'; i += 1) stepSignal(state, .1);
  return state;
}

function rotateTo(state: SignalState, operatorId: number, orientation: number) {
  const operator = state.operators.find((entry) => entry.id === operatorId)!;
  let guard = 0;
  while (operator.orientation !== orientation && guard++ < 4) rotateOperator(state, operatorId);
}

function solveRepresentativeSeed(seed: number) {
  const state = createSignalState(seed);
  if (seed % 3 === 1) {
    expect(moveOperator(state, 0, 3)).toBe(true);
    expect(moveOperator(state, 1, 8)).toBe(true);
    rotateTo(state, 0, 0);
    rotateTo(state, 1, 0);
    rotateTo(state, 2, 0);
  } else if (seed % 3 === 2) {
    expect(moveOperator(state, 0, 3)).toBe(true);
    expect(moveOperator(state, 1, 8)).toBe(true);
    expect(moveOperator(state, 2, 4)).toBe(true);
    rotateTo(state, 0, 0);
    rotateTo(state, 1, 1);
    rotateTo(state, 2, 0);
  } else {
    expect(moveOperator(state, 0, 3)).toBe(true);
    expect(moveOperator(state, 1, 9)).toBe(true);
    expect(moveOperator(state, 2, 4)).toBe(true);
    rotateTo(state, 0, 0);
    rotateTo(state, 1, 2);
    rotateTo(state, 2, 0);
  }
  return run(state);
}

describe('SIGNAL game', () => {
  it('is deterministic for a seed', () => {
    const a = createSignalState(7);
    const b = createSignalState(7);
    for (let i = 0; i < 300; i += 1) { stepSignal(a, .1); stepSignal(b, .1); }
    expect(a).toEqual(b);
  });

  it('keeps already committed packets in flight when an operator moves', () => {
    const state = createSignalState(1);
    for (let i = 0; i < 80; i += 1) stepSignal(state, .1);
    const committed = state.packets.map((packet) => [packet.id, packet.next]);
    expect(moveOperator(state, 0, 3)).toBe(true);
    expect(state.packets.map((packet) => [packet.id, packet.next])).toEqual(committed);
  });

  it('moves, swaps and rotates visible operators', () => {
    const state = createSignalState(1);
    const switchOperator = state.operators[0];
    const filterOperator = state.operators[1];
    const alternator = state.operators[2];
    expect(moveOperator(state, switchOperator.id, 3)).toBe(true);
    expect(switchOperator.node).toBe(3);
    expect(moveOperator(state, filterOperator.id, alternator.node)).toBe(true);
    expect(filterOperator.node).toBe(8);
    expect(alternator.node).toBe(4);
    const old = switchOperator.orientation;
    expect(rotateOperator(state, switchOperator.id)).toBe(true);
    expect(switchOperator.orientation).not.toBe(old);
  });

  it('starts from genuinely different first three situations', () => {
    const signature = (state: SignalState) => JSON.stringify({
      x: state.nodes.map((node) => node.x),
      links: state.nodes.map((node) => node.links),
      sinks: state.nodes.map((node) => node.sink ?? null),
      operators: state.operators.map((operator) => [operator.kind, operator.node, operator.orientation]),
    });
    const signatures = [1, 2, 3].map((seed) => signature(createSignalState(seed)));
    expect(new Set(signatures).size).toBe(3);
  });

  it.each([1, 2, 3])('seed %i has real stakes without intervention', (seed) => {
    expect(run(createSignalState(seed)).outcome).toBe('lost');
  });

  it.each([1, 2, 3])('seed %i is machine-proven winnable through player actions', (seed) => {
    const result = solveRepresentativeSeed(seed);
    expect(result.outcome).toBe('won');
    expect(result.lost).toBeLessThanOrEqual(5);
  });
});
