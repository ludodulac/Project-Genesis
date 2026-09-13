import type { ActionId } from './simulation';

export const SOLO_CARD_ORDER: readonly ActionId[] = [
  'press',
  'brace',
  'retreat',
  'rush',
  'intercept',
  'break',
  'reversal',
  'fade',
  'drive',
] as const;

export const SOLO_HAND_SIZE = 4;
export const SOLO_ARENA_MIN = 0;
export const SOLO_ARENA_MAX = 6;

export interface SoloFighterState {
  position: number;
  hand: ActionId[];
  queue: ActionId[];
}

export interface SoloDuelState {
  fighters: [SoloFighterState, SoloFighterState];
  exchange: number;
  winner: 0 | 1 | null;
}

export interface SoloExchangeResult {
  state: SoloDuelState;
  actions: [ActionId, ActionId];
  messages: string[];
}

export interface MachineChoiceScore {
  action: ActionId;
  score: number;
  worstCase: number;
  average: number;
  knockouts: number;
}

export function createSoloDuelState(): SoloDuelState {
  return {
    fighters: [createFighter(1), createFighter(5)],
    exchange: 0,
    winner: null,
  };
}

function createFighter(position: number): SoloFighterState {
  return {
    position,
    hand: [...SOLO_CARD_ORDER.slice(0, SOLO_HAND_SIZE)],
    queue: [...SOLO_CARD_ORDER.slice(SOLO_HAND_SIZE)],
  };
}

export function rotateCard(fighter: SoloFighterState, used: ActionId): SoloFighterState {
  const handIndex = fighter.hand.indexOf(used);
  if (handIndex < 0) throw new Error(`Card ${used} is not in hand`);
  const incoming = fighter.queue[0];
  if (!incoming) throw new Error('Card queue is empty');

  const hand = [...fighter.hand];
  hand.splice(handIndex, 1, incoming);
  return {
    ...fighter,
    hand,
    queue: [...fighter.queue.slice(1), used],
  };
}

function scoreMachineOutcome(before: SoloDuelState, result: SoloExchangeResult): number {
  if (result.state.winner === 1) return 1000;
  if (result.state.winner === 0) return -1000;

  const beforePlayer = before.fighters[0].position;
  const beforeMachine = before.fighters[1].position;
  const afterPlayer = result.state.fighters[0].position;
  const afterMachine = result.state.fighters[1].position;

  // The machine wants the player closer to the left ring-out while keeping
  // itself away from the right ring-out. Position is the whole objective.
  let score = (beforePlayer - afterPlayer) * 28 + (beforeMachine - afterMachine) * 18;
  if (afterPlayer === SOLO_ARENA_MIN) score += 12;
  if (afterMachine === SOLO_ARENA_MAX) score -= 18;
  return score;
}

export function evaluateMachineChoices(state: SoloDuelState): MachineChoiceScore[] {
  const machine = state.fighters[1];
  const player = state.fighters[0];

  return machine.hand.map((action) => {
    const outcomes = player.hand.map((playerAction) => {
      const result = resolveSoloExchange(state, playerAction, action);
      return {
        score: scoreMachineOutcome(state, result),
        knockout: result.state.winner === 1,
      };
    });
    const scores = outcomes.map((outcome) => outcome.score);
    const worstCase = Math.min(...scores);
    const average = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    const knockouts = outcomes.filter((outcome) => outcome.knockout).length;

    // Mostly minimax: prefer a move that remains useful against every visible
    // answer, then use average pressure and available ring-outs as tie-breakers.
    return {
      action,
      worstCase,
      average,
      knockouts,
      score: worstCase * 0.72 + average * 0.28 + knockouts * 8,
    };
  });
}

export function chooseMachineAction(state: SoloDuelState): ActionId {
  const ranked = evaluateMachineChoices(state)
    .map((choice, handIndex) => ({ ...choice, handIndex }))
    .sort((a, b) => b.score - a.score || b.average - a.average || a.handIndex - b.handIndex);

  return ranked[0]?.action ?? state.fighters[1].hand[0];
}

function toward(index: 0 | 1): number {
  return index === 0 ? 1 : -1;
}

function away(index: 0 | 1): number {
  return -toward(index);
}

function actionAdvance(action: ActionId): number {
  if (action === 'press' || action === 'break') return 1;
  if (action === 'rush') return 2;
  return 0;
}

function actionRetreat(action: ActionId): number {
  if (action === 'retreat') return 1;
  if (action === 'fade') return 2;
  return 0;
}

function isApproach(action: ActionId): boolean {
  return action === 'press' || action === 'rush';
}

function isStrike(action: ActionId): boolean {
  return action === 'press' || action === 'rush' || action === 'break' || action === 'drive';
}

function attackImpact(action: ActionId, opponentAction: ActionId, startDistance: number): number {
  if (action === 'press') return 1;
  if (action === 'rush') return 2;
  if (action === 'break') {
    return opponentAction === 'brace' || opponentAction === 'intercept' || opponentAction === 'reversal' ? 3 : 1;
  }
  if (action === 'drive') return startDistance === 1 ? 3 : 0;
  return 0;
}

function guardReduction(action: ActionId): number {
  return action === 'brace' ? 1 : 0;
}

function counterImpact(action: ActionId, opponentAction: ActionId, startDistance: number): number {
  if (action === 'intercept' && isApproach(opponentAction) && startDistance <= 3) return 2;
  if (action === 'reversal' && isStrike(opponentAction) && opponentAction !== 'break' && startDistance <= 2) return 3;
  return 0;
}

function wouldFadeEscape(action: ActionId, opponentAction: ActionId): boolean {
  return action === 'fade' && (opponentAction === 'rush' || opponentAction === 'break' || opponentAction === 'drive');
}

function pushPosition(position: number, playerIndex: 0 | 1, amount: number): number {
  return position + away(playerIndex) * amount;
}

function winnerFromPositions(p0: number, p1: number): 0 | 1 | null {
  if (p0 < SOLO_ARENA_MIN) return 1;
  if (p1 > SOLO_ARENA_MAX) return 0;
  return null;
}

export function resolveSoloExchange(
  state: SoloDuelState,
  playerAction: ActionId,
  machineAction: ActionId,
): SoloExchangeResult {
  if (state.winner !== null) throw new Error('Duel is already over');
  if (!state.fighters[0].hand.includes(playerAction)) throw new Error(`Player card ${playerAction} is not in hand`);
  if (!state.fighters[1].hand.includes(machineAction)) throw new Error(`Machine card ${machineAction} is not in hand`);

  const actions: [ActionId, ActionId] = [playerAction, machineAction];
  const startPositions: [number, number] = [state.fighters[0].position, state.fighters[1].position];
  const startDistance = startPositions[1] - startPositions[0];
  const fighters: [SoloFighterState, SoloFighterState] = [
    rotateCard(state.fighters[0], playerAction),
    rotateCard(state.fighters[1], machineAction),
  ];
  const messages: string[] = [];

  for (const index of [0, 1] as const) {
    const retreat = actionRetreat(actions[index]);
    if (retreat > 0) {
      fighters[index].position += away(index) * retreat;
      messages.push(index === 0 ? 'Vous cédez du terrain' : 'La machine cède du terrain');
    }
  }

  const counters: [number, number] = [
    counterImpact(playerAction, machineAction, startDistance),
    counterImpact(machineAction, playerAction, startDistance),
  ];
  const canceled: [boolean, boolean] = [counters[1] > 0, counters[0] > 0];

  if (counters[0] > 0 && counters[1] === 0) {
    fighters[1].position = pushPosition(fighters[1].position, 1, counters[0]);
    messages.push(playerAction === 'reversal' ? 'Votre contre renverse l’échange' : 'Vous interceptez la machine');
  }
  if (counters[1] > 0 && counters[0] === 0) {
    fighters[0].position = pushPosition(fighters[0].position, 0, counters[1]);
    messages.push(machineAction === 'reversal' ? 'La machine renverse l’échange' : 'La machine vous intercepte');
  }

  let winner = winnerFromPositions(fighters[0].position, fighters[1].position);
  if (winner === null) {
    for (const index of [0, 1] as const) {
      if (canceled[index]) continue;
      const advance = actionAdvance(actions[index]);
      const dir = toward(index);
      for (let step = 0; step < advance; step += 1) {
        const next = fighters[index].position + dir;
        const opponent = fighters[index === 0 ? 1 : 0].position;
        if ((index === 0 && next >= opponent) || (index === 1 && next <= opponent)) break;
        fighters[index].position = next;
      }
    }

    const adjacent = fighters[1].position - fighters[0].position === 1;
    if (adjacent) {
      const fadeEscapes: [boolean, boolean] = [
        wouldFadeEscape(playerAction, machineAction),
        wouldFadeEscape(machineAction, playerAction),
      ];
      let impact0 = canceled[0] || fadeEscapes[1] ? 0 : attackImpact(playerAction, machineAction, startDistance);
      let impact1 = canceled[1] || fadeEscapes[0] ? 0 : attackImpact(machineAction, playerAction, startDistance);
      impact0 = Math.max(0, impact0 - guardReduction(machineAction));
      impact1 = Math.max(0, impact1 - guardReduction(playerAction));

      if (impact0 > impact1) {
        fighters[1].position = pushPosition(fighters[1].position, 1, Math.max(1, impact0 - impact1));
        messages.push('Vous gagnez l’échange');
      } else if (impact1 > impact0) {
        fighters[0].position = pushPosition(fighters[0].position, 0, Math.max(1, impact1 - impact0));
        messages.push('La machine gagne l’échange');
      } else if (impact0 > 0) {
        messages.push('Clash : personne ne cède');
      }
    }
    winner = winnerFromPositions(fighters[0].position, fighters[1].position);
  }

  return {
    actions,
    messages,
    state: {
      fighters,
      exchange: state.exchange + 1,
      winner,
    },
  };
}
