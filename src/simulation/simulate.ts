import { neighboursOf, type Agent, type Cell, type CellId, type WorldState } from '../world/model';

export type WorldAction = { type: 'RAISE_CELL'; cellId: CellId };
export type WorldEvent =
  | { type: 'TERRAIN_CHANGED'; cellIds: CellId[] }
  | { type: 'AGENT_MOVED'; agentId: Agent['id']; from: CellId; to: CellId }
  | { type: 'AGENT_CHARGED'; agentId: Agent['id']; element: 'water'; cellId: CellId }
  | { type: 'CELL_BLOOMED'; agentId: Agent['id']; cellId: CellId }
  | { type: 'AGENT_ARRIVED'; agentId: Agent['id']; cellId: CellId };
export interface SimulationResult { state: WorldState; events: WorldEvent[]; }

const MAX_HEIGHT = 2.4;
const MIN_HEIGHT = 0.08;
const CLIMB_LIMIT = 0.16;
const BLOOM_LIFT = 0.24;
const SCULPT_LIFT = 0.40;

export function simulate(world: WorldState, action: WorldAction): SimulationResult {
  if (action.type !== 'RAISE_CELL' || !world.cells[action.cellId]) return { state: world, events: [] };

  const cells = Object.fromEntries(Object.entries(world.cells).map(([id, cell]) => [id, { ...cell }])) as WorldState['cells'];
  const changed = new Set<CellId>();
  const target = cells[action.cellId];
  const neighbours = neighboursOf(world, action.cellId);
  const requestedLift = Math.min(SCULPT_LIFT, MAX_HEIGHT - target.height);

  if (neighbours.length > 0 && requestedLift > 0) {
    const requestedDrain = requestedLift / neighbours.length;
    const drains = neighbours.map((n) => Math.max(0, Math.min(requestedDrain, cells[n.id].height - MIN_HEIGHT)));
    const totalDrain = drains.reduce((sum, amount) => sum + amount, 0);
    if (totalDrain > 0) {
      target.height += totalDrain; changed.add(target.id);
      neighbours.forEach((n, i) => { if (drains[i] > 0) { cells[n.id].height -= drains[i]; changed.add(n.id); } });
    }
  }

  const next: WorldState = { ...world, cells, agents: world.agents.map((agent) => ({ ...agent })) };
  const events: WorldEvent[] = [];
  const moveIntents = new Map<Agent['id'], CellId>();

  // EXP-009 — visible desire. Each mote wants its matching haven. It can cross
  // gentle slopes, but steep terrain blocks it. Sculpting therefore changes
  // routes without the player directly commanding a character.
  for (const agent of next.agents) {
    if (agent.arrived) continue;
    const current = next.cells[agent.cellId];
    const goal = next.cells[agent.targetId];
    const candidates = neighboursOf(next, current.id)
      .filter((cell) => cell.height <= current.height + CLIMB_LIMIT)
      .sort((a, b) => routeScore(a, goal) - routeScore(b, goal) || a.id.localeCompare(b.id));
    const destination = candidates[0];
    if (destination && routeScore(destination, goal) < routeScore(current, goal)) moveIntents.set(agent.id, destination.id);
  }

  for (const agent of next.agents) {
    const destination = moveIntents.get(agent.id);
    if (!destination) continue;
    const from = agent.cellId; agent.cellId = destination;
    events.push({ type: 'AGENT_MOVED', agentId: agent.id, from, to: destination });
  }

  const interactionOrder = [...next.agents].sort((a, b) => a.id.localeCompare(b.id));
  for (const agent of interactionOrder) {
    const standingCell = next.cells[agent.cellId];
    if (standingCell.id === agent.targetId && !agent.arrived) {
      agent.arrived = true;
      events.push({ type: 'AGENT_ARRIVED', agentId: agent.id, cellId: standingCell.id });
    }
    if (standingCell.kind === 'water-source' && agent.carrying !== 'water') {
      agent.carrying = 'water'; events.push({ type: 'AGENT_CHARGED', agentId: agent.id, element: 'water', cellId: standingCell.id }); continue;
    }
    if (standingCell.kind === 'seed' && agent.carrying === 'water') {
      standingCell.kind = 'bloom'; standingCell.height = Math.min(MAX_HEIGHT, standingCell.height + BLOOM_LIFT); agent.carrying = null; changed.add(standingCell.id);
      events.push({ type: 'CELL_BLOOMED', agentId: agent.id, cellId: standingCell.id });
    }
  }

  events.unshift({ type: 'TERRAIN_CHANGED', cellIds: [...changed] });
  return { state: next, events };
}

function routeScore(cell: Cell, goal: Cell): number {
  const distance = Math.abs(cell.row - goal.row) + Math.abs(cell.col - goal.col);
  return distance + cell.height * 0.18;
}
