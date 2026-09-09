import { neighboursOf, type CellId, type WorldState } from '../world/model';

export type TerrainVariant = 'accumulate' | 'redistribute';

const MAX_HEIGHT = 2.4;
const MIN_HEIGHT = 0.08;

export function applyTerrainVariant(
  world: WorldState,
  cellId: CellId,
  variant: TerrainVariant,
): WorldState {
  if (!world.cells[cellId]) return world;

  const cells = Object.fromEntries(
    Object.entries(world.cells).map(([id, cell]) => [id, { ...cell }]),
  ) as WorldState['cells'];

  if (variant === 'accumulate') {
    cells[cellId].height = Math.min(MAX_HEIGHT, cells[cellId].height + 0.46);
    for (const neighbour of neighboursOf(world, cellId)) {
      cells[neighbour.id].height = Math.min(MAX_HEIGHT, cells[neighbour.id].height + 0.09);
    }
  } else {
    // EXP-008 B: move matter rather than create it.
    // The touched cell rises strongly while its four direct neighbours give up
    // the same total amount when bounds do not interfere.
    const neighbours = neighboursOf(world, cellId);
    const requestedLift = 0.40;
    const availableRoom = MAX_HEIGHT - cells[cellId].height;
    const lift = Math.min(requestedLift, availableRoom);

    if (neighbours.length > 0 && lift > 0) {
      const requestedDrainPerCell = lift / neighbours.length;
      const drains = neighbours.map((neighbour) => Math.min(
        requestedDrainPerCell,
        cells[neighbour.id].height - MIN_HEIGHT,
      ));
      const totalDrain = drains.reduce((sum, amount) => sum + amount, 0);

      cells[cellId].height += totalDrain;
      neighbours.forEach((neighbour, index) => {
        cells[neighbour.id].height -= drains[index];
      });
    }
  }

  return {
    ...world,
    cells,
    agents: world.agents.map((agent) => ({ ...agent })),
  };
}

export function terrainMetrics(world: WorldState): {
  min: number;
  max: number;
  range: number;
  mean: number;
  localMinima: number;
} {
  const cells = Object.values(world.cells);
  const heights = cells.map((cell) => cell.height);
  const min = Math.min(...heights);
  const max = Math.max(...heights);
  const mean = heights.reduce((sum, height) => sum + height, 0) / heights.length;
  const localMinima = cells.filter((cell) => {
    const neighbours = neighboursOf(world, cell.id);
    return neighbours.length > 0 && neighbours.every((neighbour) => cell.height < neighbour.height - 0.02);
  }).length;

  return { min, max, range: max - min, mean, localMinima };
}
