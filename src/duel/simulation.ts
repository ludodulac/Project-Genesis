export const ARENA_MIN = 0;
export const ARENA_MAX = 6;
export const MAX_ENERGY = 5;

export type FundamentalId = 'press' | 'brace' | 'retreat';
export type TechniqueId = 'rush' | 'intercept' | 'break' | 'reversal' | 'fade' | 'drive';
export type ActionId = FundamentalId | TechniqueId;

export const TECHNIQUE_ORDER: readonly TechniqueId[] = [
  'rush',
  'intercept',
  'reversal',
  'break',
  'fade',
  'drive',
] as const;

export const TECHNIQUE_COST: Record<TechniqueId, number> = {
  rush: 2,
  intercept: 2,
  break: 2,
  reversal: 3,
  fade: 1,
  drive: 3,
};

export interface DuelPlayerState {
  position: number;
  energy: number;
  active: TechniqueId[];
  queue: TechniqueId[];
}

export interface DuelState {
  players: [DuelPlayerState, DuelPlayerState];
  exchange: number;
  winner: 0 | 1 | null;
}

export interface ExchangeResult {
  state: DuelState;
  actions: [ActionId, ActionId];
  messages: string[];
}

export function createDuelState(): DuelState {
  return {
    players: [createPlayer(1), createPlayer(5)],
    exchange: 0,
    winner: null,
  };
}

function createPlayer(position: number): DuelPlayerState {
  return {
    position,
    energy: 3,
    active: [...TECHNIQUE_ORDER.slice(0, 3)],
    queue: [...TECHNIQUE_ORDER.slice(3)],
  };
}

export function isAdvanced(action: ActionId): action is TechniqueId {
  return (TECHNIQUE_ORDER as readonly string[]).includes(action);
}

export function isActionLegal(state: DuelState, playerIndex: 0 | 1, action: ActionId): boolean {
  if (state.winner !== null) return false;
  if (!isAdvanced(action)) return true;
  const player = state.players[playerIndex];
  return player.active.includes(action) && player.energy >= TECHNIQUE_COST[action];
}

export function nextTechnique(player: DuelPlayerState): TechniqueId {
  return player.queue[0];
}

export function cycleTechnique(player: DuelPlayerState, used: TechniqueId): DuelPlayerState {
  if (!player.active.includes(used)) {
    throw new Error(`Technique ${used} is not active`);
  }
  const incoming = player.queue[0];
  return {
    ...player,
    active: [...player.active.filter((id) => id !== used), incoming],
    queue: [...player.queue.slice(1), used],
  };
}

function spendAction(player: DuelPlayerState, action: ActionId): DuelPlayerState {
  if (!isAdvanced(action)) return { ...player };
  const cycled = cycleTechnique(player, action);
  return {
    ...cycled,
    energy: player.energy - TECHNIQUE_COST[action],
  };
}

function toward(index: 0 | 1): number {
  return index === 0 ? 1 : -1;
}

function away(index: 0 | 1): number {
  return -toward(index);
}

function clampPosition(value: number): number {
  return Math.max(ARENA_MIN, Math.min(ARENA_MAX, value));
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
  if (p0 < ARENA_MIN) return 1;
  if (p1 > ARENA_MAX) return 0;
  return null;
}

export function resolveExchange(state: DuelState, action0: ActionId, action1: ActionId): ExchangeResult {
  if (!isActionLegal(state, 0, action0)) throw new Error(`Illegal action for player 0: ${action0}`);
  if (!isActionLegal(state, 1, action1)) throw new Error(`Illegal action for player 1: ${action1}`);

  const actions: [ActionId, ActionId] = [action0, action1];
  const startPositions: [number, number] = [state.players[0].position, state.players[1].position];
  const startDistance = startPositions[1] - startPositions[0];
  const players: [DuelPlayerState, DuelPlayerState] = [
    spendAction(state.players[0], action0),
    spendAction(state.players[1], action1),
  ];
  const messages: string[] = [];

  // Retreats resolve first. They are agency-preserving but always concede territory.
  for (const index of [0, 1] as const) {
    const retreat = actionRetreat(actions[index]);
    if (retreat > 0) {
      players[index].position = clampPosition(players[index].position + away(index) * retreat);
      messages.push(`P${index + 1} cède du terrain`);
    }
  }

  // Public event-driven counters happen before normal forward movement.
  const counters: [number, number] = [
    counterImpact(action0, action1, startDistance),
    counterImpact(action1, action0, startDistance),
  ];
  const canceled: [boolean, boolean] = [counters[1] > 0, counters[0] > 0];

  if (counters[0] > 0 && counters[1] === 0) {
    players[1].position = pushPosition(players[1].position, 1, counters[0]);
    messages.push(action0 === 'reversal' ? 'P1 renverse l’engagement' : 'P1 intercepte l’entrée');
  }
  if (counters[1] > 0 && counters[0] === 0) {
    players[0].position = pushPosition(players[0].position, 0, counters[1]);
    messages.push(action1 === 'reversal' ? 'P2 renverse l’engagement' : 'P2 intercepte l’entrée');
  }

  let winner = winnerFromPositions(players[0].position, players[1].position);
  if (winner === null) {
    // Forward movement has to alter the arena. There is no legal "cycle in place" action.
    for (const index of [0, 1] as const) {
      if (canceled[index]) continue;
      const advance = actionAdvance(actions[index]);
      if (advance === 0) continue;
      const dir = toward(index);
      for (let step = 0; step < advance; step += 1) {
        const next = players[index].position + dir;
        const opponent = players[index === 0 ? 1 : 0].position;
        if ((index === 0 && next >= opponent) || (index === 1 && next <= opponent)) break;
        players[index].position = clampPosition(next);
      }
    }

    const adjacent = players[1].position - players[0].position === 1;
    if (adjacent) {
      const fadeEscapes: [boolean, boolean] = [
        wouldFadeEscape(action0, action1),
        wouldFadeEscape(action1, action0),
      ];
      let impact0 = canceled[0] || fadeEscapes[1] ? 0 : attackImpact(action0, action1, startDistance);
      let impact1 = canceled[1] || fadeEscapes[0] ? 0 : attackImpact(action1, action0, startDistance);
      impact0 = Math.max(0, impact0 - guardReduction(action1));
      impact1 = Math.max(0, impact1 - guardReduction(action0));

      if (impact0 > impact1) {
        players[1].position = pushPosition(players[1].position, 1, Math.max(1, impact0 - impact1));
        messages.push(`P1 gagne l’échange de ${impact0 - impact1}`);
      } else if (impact1 > impact0) {
        players[0].position = pushPosition(players[0].position, 0, Math.max(1, impact1 - impact0));
        messages.push(`P2 gagne l’échange de ${impact1 - impact0}`);
      } else if (impact0 > 0) {
        messages.push('Clash : personne ne cède');
      }
    }
    winner = winnerFromPositions(players[0].position, players[1].position);
  }

  // Energy is intentionally low-bookkeeping: one pip returns per completed exchange.
  for (const player of players) {
    player.energy = Math.min(MAX_ENERGY, player.energy + 1);
  }

  return {
    actions,
    messages,
    state: {
      players,
      exchange: state.exchange + 1,
      winner,
    },
  };
}
