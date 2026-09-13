import { describe, expect, it } from 'vitest';
import {
  SOLO_CARD_ORDER,
  chooseMachineAction,
  createSoloDuelState,
  evaluateMachineChoices,
  resolveSoloExchange,
  rotateCard,
} from '../src/duel/soloSimulation';

describe('DUEL V0 solo cards', () => {
  it('starts with four visible cards and keeps the remaining moves in a deterministic queue', () => {
    const state = createSoloDuelState();
    expect(state.fighters[0].hand).toEqual(SOLO_CARD_ORDER.slice(0, 4));
    expect(state.fighters[0].queue).toEqual(SOLO_CARD_ORDER.slice(4));
    expect(state.fighters[1].hand).toEqual(state.fighters[0].hand);
  });

  it('replaces exactly the used card and sends it to the back of the queue', () => {
    const fighter = createSoloDuelState().fighters[0];
    const cycled = rotateCard(fighter, 'brace');
    expect(cycled.hand).toEqual(['press', 'intercept', 'retreat', 'rush']);
    expect(cycled.queue).toEqual(['break', 'reversal', 'fade', 'drive', 'brace']);
  });

  it('evaluates every machine card against every currently visible player answer', () => {
    const state = createSoloDuelState();
    const choices = evaluateMachineChoices(state);
    expect(choices.map((choice) => choice.action)).toEqual(state.fighters[1].hand);
    for (const choice of choices) {
      expect(Number.isFinite(choice.score)).toBe(true);
      expect(Number.isFinite(choice.worstCase)).toBe(true);
      expect(Number.isFinite(choice.average)).toBe(true);
      expect(choice.knockouts).toBeGreaterThanOrEqual(0);
      expect(choice.knockouts).toBeLessThanOrEqual(state.fighters[0].hand.length);
    }
  });

  it('makes the machine choose only from its current four-card hand', () => {
    const state = createSoloDuelState();
    const action = chooseMachineAction(state);
    expect(state.fighters[1].hand).toContain(action);
  });

  it('cycles one card for both sides after every exchange', () => {
    const start = createSoloDuelState();
    const machineAction = chooseMachineAction(start);
    const result = resolveSoloExchange(start, 'press', machineAction);
    expect(result.state.fighters[0].hand).not.toContain('press');
    expect(result.state.fighters[0].queue.at(-1)).toBe('press');
    expect(result.state.fighters[1].hand).not.toContain(machineAction);
    expect(result.state.fighters[1].queue.at(-1)).toBe(machineAction);
  });

  it('is deterministic for identical visible hands and positions', () => {
    const a = createSoloDuelState();
    const b = createSoloDuelState();
    const machineA = chooseMachineAction(a);
    const machineB = chooseMachineAction(b);
    expect(machineA).toBe(machineB);
    expect(evaluateMachineChoices(a)).toEqual(evaluateMachineChoices(b));
    expect(resolveSoloExchange(a, 'press', machineA)).toEqual(resolveSoloExchange(b, 'press', machineB));
  });
});
