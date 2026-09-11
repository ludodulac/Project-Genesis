export type ReachObject = {
  id: string;
  radius: number;
  consumed: boolean;
};

export type GrowingReachState = {
  actorRadius: number;
  objects: ReachObject[];
};

export const INITIAL_ACTOR_RADIUS = 20;

export function initialGrowingReachState(): GrowingReachState {
  return {
    actorRadius: INITIAL_ACTOR_RADIUS,
    objects: [
      { id: 'small-a', radius: 9, consumed: false },
      { id: 'small-b', radius: 11, consumed: false },
      { id: 'small-c', radius: 8, consumed: false },
      { id: 'medium', radius: 22, consumed: false },
      { id: 'large', radius: 29, consumed: false },
    ],
  };
}

export function canAbsorb(actorRadius: number, objectRadius: number): boolean {
  return objectRadius < actorRadius;
}

export function absorbReachObject(state: GrowingReachState, id: string): GrowingReachState {
  const target = state.objects.find((object) => object.id === id);
  if (!target || target.consumed || !canAbsorb(state.actorRadius, target.radius)) return state;

  const actorRadius = Math.sqrt(state.actorRadius ** 2 + target.radius ** 2 * 0.8);
  return {
    actorRadius,
    objects: state.objects.map((object) => object.id === id ? { ...object, consumed: true } : object),
  };
}
