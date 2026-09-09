import { neighboursOf, type Agent, type CellId, type WorldState } from '../world/model';

export type WorldAction = { type: 'RAISE_CELL'; cellId: CellId };

export type WorldEvent =
  | { type: 'TERRAIN_CHANGED'; cellIds: CellId[] }
  | { type: 'AGENT_MOVED'; agentId: Agent['id']; from: CellId; to: CellId }
  | { type: 'AGENT_CHARGED'; agentId: Agent['id']; element: 'water'; cellId: CellId }
  | { type: 'CELL_BLOOMED'; agentId: Agent['id']; cellId: CellId };

export interface SimulationResult {
  state: WorldState;
  events: WorldEvent[];
}

const MAX_HEIGHT = 2.4;
const MOVE_THRESHOLD = 0.045;
const BLOOM_LIFT = 0.24;

export function simulate(world: WorldState, action: WorldAction): SimulationResult {
  if (action.type !== 'RAISE_CELL' || !world.cells[action.cellId]) {
    return { state: world, events: [] };
  }

  const cells = Object.fromEntries(
    Object.entries(world.cells).map(([id, cell]) => [id, { ...cell }]),
  ) as WorldState['cells'];

  const changed = new Set<CellId>();
  const target = cells[action.cellId];
  target.height = Math.min(MAX_HEIGHT, target.height + 0.46);
  changed.add(target.id);

  for (const neighbour of neighboursOf(world, action.cellId)) {
    cells[neighbour.id].height = Math.min(MAX_HEIGHT, cells[neighbour.id].height + 0.09);
    changed.add(neighbour.id);
  }

  const next: WorldState = {
    ...world,
    cells,
    agents: world.agents.map((agent) => ({ ...agent })),
  };

  const events: WorldEvent[] = [];

  // Phase 1: every agent reads the same post-terrain state and chooses a move.
  // No interaction caused by another agent can alter a decision in this phase.
  const moveIntents = new Map<Agent['id'], CellId>();
  for (const agent of next.agents) {
    const current = next.cells[agent.cellId];
    const destination = neighboursOf(next, current.id)
      .filter((cell) => cell.height < current.height - MOVE_THRESHOLD)
      .sort((a, b) => a.height - b.height || a.id.localeCompare(b.id))[0];

    if (destination) moveIntents.set(agent.id, destination.id);
  }

  // Phase 2: apply all moves.
  for (const agent of next.agents) {
    const destination = moveIntents.get(agent.id);
    if (!destination) continue;
    const from = agent.cellId;
    agent.cellId = destination;
    events.push({ type: 'AGENT_MOVED', agentId: agent.id, from, to: destination });
  }

  // Phase 3: resolve cell interactions in a stable, explicit order.
  // Agent array order must never be a hidden gameplay variable.
  const interactionOrder = [...next.agents].sort((a, b) => a.id.localeCompare(b.id));
  for (const agent of interactionOrder) {
    const standingCell = next.cells[agent.cellId];
    if (standingCell.kind === 'water-source' && agent.carrying !== 'water') {
      agent.carrying = 'water';
      events.push({ type: 'AGENT_CHARGED', agentId: agent.id, element: 'water', cellId: standingCell.id });
      continue;
    }

    if (standingCell.kind === 'seed' && agent.carrying === 'water') {
      standingCell.kind = 'bloom';
      standingCell.height = Math.min(MAX_HEIGHT, standingCell.height + BLOOM_LIFT);
      agent.carrying = null;
      changed.add(standingCell.id);
      events.push({ type: 'CELL_BLOOMED', agentId: agent.id, cellId: standingCell.id });
    }
  }

  events.unshift({ type: 'TERRAIN_CHANGED', cellIds: [...changed] });
  return { state: next, events };
}
