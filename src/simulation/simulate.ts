import { neighboursOf, type CellId, type WorldState } from '../world/model';

export type WorldAction = { type: 'RAISE_CELL'; cellId: CellId };

export type WorldEvent =
  | { type: 'TERRAIN_CHANGED'; cellIds: CellId[] }
  | { type: 'ORB_MOVED'; from: CellId; to: CellId };

export interface SimulationResult {
  state: WorldState;
  events: WorldEvent[];
}

const MAX_HEIGHT = 2.4;

export function simulate(world: WorldState, action: WorldAction): SimulationResult {
  if (action.type !== 'RAISE_CELL' || !world.cells[action.cellId]) {
    return { state: world, events: [] };
  }

  const cells = Object.fromEntries(
    Object.entries(world.cells).map(([id, cell]) => [id, { ...cell }]),
  ) as WorldState['cells'];

  const changed = new Set<CellId>();
  const target = cells[action.cellId];
  target.height = Math.min(MAX_HEIGHT, target.height + 0.62);
  changed.add(target.id);

  for (const neighbour of neighboursOf(world, action.cellId)) {
    cells[neighbour.id].height = Math.min(MAX_HEIGHT, cells[neighbour.id].height + 0.12);
    changed.add(neighbour.id);
  }

  const next: WorldState = {
    ...world,
    cells,
    orb: { ...world.orb },
  };

  const events: WorldEvent[] = [
    { type: 'TERRAIN_CHANGED', cellIds: [...changed] },
  ];

  const orbCell = next.cells[next.orb.cellId];
  const lowerCandidates = neighboursOf(next, orbCell.id)
    .filter((cell) => cell.height < orbCell.height - 0.06)
    .sort((a, b) => a.height - b.height || a.id.localeCompare(b.id));

  if (lowerCandidates[0]) {
    const from = next.orb.cellId;
    next.orb.cellId = lowerCandidates[0].id;
    events.push({ type: 'ORB_MOVED', from, to: next.orb.cellId });
  }

  return { state: next, events };
}
