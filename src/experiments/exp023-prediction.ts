import { cellId, createToyWorld, type CellId, type WorldState } from '../world/model';

export type PredictionScenarioId = 'toward' | 'near-but-stay' | 'away' | 'occupied';

export interface PredictionScenario {
  id: PredictionScenarioId;
  world: WorldState;
  targetCellId: CellId;
  expectedCellId: CellId;
  discriminates: string;
}

const CENTER = cellId(3, 3);

function baseWorld(): WorldState {
  const world = createToyWorld(7, 7);
  for (const cell of Object.values(world.cells)) cell.height = 0.5;
  world.agents[0].cellId = CENTER;
  world.agents[0].targetId = CENTER;
  world.agents[0].previousCellId = undefined;
  return world;
}

export function createPredictionScenario(id: PredictionScenarioId): PredictionScenario {
  const world = baseWorld();

  if (id === 'toward') {
    const target = cellId(3, 4);
    return {
      id,
      world,
      targetCellId: target,
      expectedCellId: target,
      discriminates: 'A nearby press can create the unique lowest neighbour and attract the actor.',
    };
  }

  if (id === 'near-but-stay') {
    world.cells[CENTER].height = 0.6;
    world.cells[cellId(3, 2)].height = 0.2;
    world.cells[cellId(3, 4)].height = 0.6;
    const target = cellId(3, 4);
    return {
      id,
      world,
      targetCellId: target,
      expectedCellId: CENTER,
      discriminates: 'Touching next to the actor is not sufficient: equal best descents must not invent a direction.',
    };
  }

  if (id === 'away') {
    world.cells[CENTER].height = 0.6;
    world.cells[cellId(3, 2)].height = 0.28;
    world.cells[cellId(2, 3)].height = 0.64;
    world.cells[cellId(4, 3)].height = 0.66;
    world.cells[cellId(3, 4)].height = 0.62;
    const target = cellId(3, 5);
    return {
      id,
      world,
      targetCellId: target,
      expectedCellId: cellId(3, 2),
      discriminates: 'The actor follows local geometry, not the touched location: a press to the right can trigger a move left.',
    };
  }

  return {
    id,
    world,
    targetCellId: CENTER,
    expectedCellId: CENTER,
    discriminates: 'Pressing the occupied cell deepens that cell, so geometry predicts no lateral direction.',
  };
}

export function isPredictionScenarioId(value: string | null): value is PredictionScenarioId {
  return value === 'toward' || value === 'near-but-stay' || value === 'away' || value === 'occupied';
}
