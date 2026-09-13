export type PlaceId = 'home' | 'river' | 'meadow' | 'grove';
export type HumanId = 'mina' | 'jo' | 'lea';
export type ActivityId = 'rest' | 'useful' | 'social';
export type PlayerAction =
  | { type: 'improve'; place: PlaceId }
  | { type: 'preserve'; place: PlaceId; enabled: boolean }
  | { type: 'free-time'; enabled: boolean };

export interface PlaceState {
  id: PlaceId;
  name: string;
  x: number;
  y: number;
  accessibility: number;
  calm: number;
  cover: number;
  vegetation: number;
  preserved: boolean;
  footfall: number;
  birdVisits: number;
}

export interface HumanState {
  id: HumanId;
  name: string;
  place: PlaceId;
  activity: ActivityId;
  nextDecision: number;
  lastPlace: PlaceId;
  hesitation: number;
}

export interface BirdState {
  place: PlaceId;
  presence: number;
  nextDecision: number;
}

export interface PetitMondeState {
  tick: number;
  seed: number;
  freeTime: boolean;
  relations: Record<string, number>;
  places: Record<PlaceId, PlaceState>;
  humans: Record<HumanId, HumanState>;
  birds: BirdState;
  recentEvents: string[];
}

const placeIds: PlaceId[] = ['home', 'river', 'meadow', 'grove'];
const humanIds: HumanId[] = ['mina', 'jo', 'lea'];
const activities: ActivityId[] = ['rest', 'useful', 'social'];
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const relationKey = (from: string, to: string) => `${from}->${to}`;

function random(state: PetitMondeState): number {
  state.seed = (state.seed * 1664525 + 1013904223) >>> 0;
  return state.seed / 0x100000000;
}

function weightedPick<T>(state: PetitMondeState, rows: Array<{ value: T; score: number }>): T {
  const softened = rows.map((row) => ({ ...row, weight: Math.max(0.02, Math.exp(row.score * 2.2)) }));
  const total = softened.reduce((sum, row) => sum + row.weight, 0);
  let cursor = random(state) * total;
  for (const row of softened) {
    cursor -= row.weight;
    if (cursor <= 0) return row.value;
  }
  return softened[softened.length - 1]!.value;
}

export function relation(state: PetitMondeState, from: string, to: string): number {
  return state.relations[relationKey(from, to)] ?? 0;
}

function strengthen(state: PetitMondeState, from: string, to: string, amount: number): void {
  const key = relationKey(from, to);
  state.relations[key] = clamp((state.relations[key] ?? 0) + amount, -1, 1);
}

export function createPetitMonde(seed = 7): PetitMondeState {
  const state: PetitMondeState = {
    tick: 0,
    seed,
    freeTime: false,
    relations: {},
    places: {
      home: { id: 'home', name: 'Hameau', x: 78, y: 112, accessibility: 0.95, calm: 0.42, cover: 0.28, vegetation: 0.35, preserved: false, footfall: 0.25, birdVisits: 0.05 },
      river: { id: 'river', name: 'Rive', x: 278, y: 155, accessibility: 0.48, calm: 0.82, cover: 0.72, vegetation: 0.82, preserved: false, footfall: 0.08, birdVisits: 0.72 },
      meadow: { id: 'meadow', name: 'Prairie', x: 105, y: 390, accessibility: 0.68, calm: 0.68, cover: 0.45, vegetation: 0.88, preserved: false, footfall: 0.08, birdVisits: 0.45 },
      grove: { id: 'grove', name: 'Bosquet', x: 286, y: 405, accessibility: 0.52, calm: 0.9, cover: 0.92, vegetation: 0.95, preserved: false, footfall: 0.04, birdVisits: 0.55 },
    },
    humans: {
      mina: { id: 'mina', name: 'Mina', place: 'home', activity: 'rest', nextDecision: 1, lastPlace: 'home', hesitation: 0 },
      jo: { id: 'jo', name: 'Jo', place: 'home', activity: 'useful', nextDecision: 2, lastPlace: 'home', hesitation: 0 },
      lea: { id: 'lea', name: 'Léa', place: 'meadow', activity: 'rest', nextDecision: 3, lastPlace: 'meadow', hesitation: 0 },
    },
    birds: { place: 'river', presence: 0.78, nextDecision: 2 },
    recentEvents: [],
  };

  strengthen(state, 'human:mina', 'place:river', 0.48);
  strengthen(state, 'human:mina', 'activity:rest', 0.3);
  strengthen(state, 'human:jo', 'human:mina', 0.42);
  strengthen(state, 'human:jo', 'activity:social', 0.32);
  strengthen(state, 'human:lea', 'bird:flock', 0.5);
  strengthen(state, 'human:lea', 'place:meadow', 0.2);
  return state;
}

function placeScore(state: PetitMondeState, human: HumanState, place: PlaceState): number {
  const self = relation(state, `human:${human.id}`, `place:${place.id}`);
  const companions = humanIds
    .filter((id) => id !== human.id && state.humans[id].place === place.id)
    .reduce((sum, id) => sum + Math.max(0, relation(state, `human:${human.id}`, `human:${id}`)), 0);
  const birds = state.birds.place === place.id ? state.birds.presence * Math.max(0, relation(state, `human:${human.id}`, 'bird:flock')) : 0;
  const continuity = human.place === place.id ? 0.18 : 0;
  const preservationCost = place.preserved ? 0.5 : 0;
  return self + companions * 0.55 + birds * 0.75 + place.accessibility * 0.35 + place.calm * 0.12 + continuity - preservationCost;
}

function chooseActivity(state: PetitMondeState, human: HumanState): ActivityId {
  return weightedPick(state, activities.map((activity) => {
    let score = relation(state, `human:${human.id}`, `activity:${activity}`);
    if (activity === 'useful') score += state.freeTime ? -0.35 : 0.24;
    if (activity === 'social') {
      const others = humanIds.filter((id) => id !== human.id && state.humans[id].place === human.place).length;
      score += others * 0.28 + (state.freeTime ? 0.18 : 0);
    }
    if (activity === 'rest') score += state.places[human.place].calm * 0.18 + (state.freeTime ? 0.12 : 0);
    return { value: activity, score };
  }));
}

function decideHuman(state: PetitMondeState, human: HumanState): void {
  const oldPlace = human.place;
  const ranked = placeIds
    .map((id) => ({ id, score: placeScore(state, human, state.places[id]) }))
    .sort((a, b) => b.score - a.score);
  const strongestKnown = ranked[0]!;
  const chosen = weightedPick(state, ranked.map((row) => ({ value: row.id, score: row.score })));

  human.lastPlace = oldPlace;
  human.place = chosen;
  human.activity = chooseActivity(state, human);
  human.hesitation = strongestKnown.id !== chosen && strongestKnown.score - ranked.find((row) => row.id === chosen)!.score > 0.22 ? 2 : 0;
  human.nextDecision = state.tick + 3 + Math.floor(random(state) * 3);

  const place = state.places[chosen];
  place.footfall = clamp(place.footfall + 0.055);
  strengthen(state, `human:${human.id}`, `place:${chosen}`, 0.018);
  strengthen(state, `human:${human.id}`, `activity:${human.activity}`, 0.009);

  for (const otherId of humanIds) {
    if (otherId === human.id) continue;
    if (state.humans[otherId].place === chosen) strengthen(state, `human:${human.id}`, `human:${otherId}`, 0.01);
  }

  if (oldPlace !== chosen) state.recentEvents.push(`${human.name} va vers ${place.name}.`);
  if (human.hesitation > 0) state.recentEvents.push(`${human.name} hésite avant de changer ses habitudes.`);
}

function updatePlaces(state: PetitMondeState): void {
  for (const place of Object.values(state.places)) {
    place.footfall = clamp(place.footfall * 0.965);
    const recovery = place.preserved ? 0.022 : 0.008;
    place.vegetation = clamp(place.vegetation + recovery - place.footfall * 0.018);
    place.cover = clamp(place.cover + (place.vegetation - place.cover) * 0.05);
    place.calm = clamp(place.calm + 0.015 - place.footfall * 0.045);
  }
}

function updateBirds(state: PetitMondeState): void {
  if (state.tick < state.birds.nextDecision) return;
  const choices = placeIds.map((id) => {
    const p = state.places[id];
    return { value: id, score: p.cover * 0.9 + p.calm * 0.8 + p.vegetation * 0.55 - p.footfall * 1.25 };
  });
  const old = state.birds.place;
  const chosen = weightedPick(state, choices);
  state.birds.place = chosen;
  const p = state.places[chosen];
  state.birds.presence = clamp(0.18 + p.cover * 0.4 + p.calm * 0.35 - p.footfall * 0.35);
  p.birdVisits = clamp(p.birdVisits * 0.94 + state.birds.presence * 0.08);
  state.birds.nextDecision = state.tick + 2;
  if (old !== chosen) state.recentEvents.push(`Les oiseaux se déplacent vers ${p.name}.`);
}

export function stepPetitMonde(previous: PetitMondeState): PetitMondeState {
  const state = structuredClone(previous);
  state.tick += 1;
  state.recentEvents = [];
  updatePlaces(state);
  updateBirds(state);
  for (const id of humanIds) {
    const human = state.humans[id];
    if (human.hesitation > 0) human.hesitation -= 1;
    if (state.tick >= human.nextDecision) decideHuman(state, human);
  }
  return state;
}

export function applyPetitMondeAction(previous: PetitMondeState, action: PlayerAction): PetitMondeState {
  const state = structuredClone(previous);
  if (action.type === 'improve') {
    const p = state.places[action.place];
    p.accessibility = clamp(p.accessibility + 0.28);
    p.calm = clamp(p.calm - 0.12);
    p.cover = clamp(p.cover - 0.1);
    state.recentEvents = [`${p.name} devient plus accessible.`];
  } else if (action.type === 'preserve') {
    const p = state.places[action.place];
    p.preserved = action.enabled;
    p.accessibility = clamp(p.accessibility + (action.enabled ? -0.28 : 0.28));
    p.calm = clamp(p.calm + (action.enabled ? 0.18 : -0.18));
    state.recentEvents = [action.enabled ? `${p.name} est laissée tranquille.` : `${p.name} redevient accessible.`];
  } else {
    state.freeTime = action.enabled;
    state.recentEvents = [action.enabled ? 'La communauté libère du temps.' : 'Le rythme utile reprend.'];
  }
  return state;
}

export function observableHistory(state: PetitMondeState, humanId: HumanId, placeId: PlaceId): string {
  const strength = relation(state, `human:${humanId}`, `place:${placeId}`);
  if (strength > 0.72) return `${state.humans[humanId].name} revient très souvent ici.`;
  if (strength > 0.5) return `${state.humans[humanId].name} est souvent venue ici récemment.`;
  if (strength > 0.3) return `${state.humans[humanId].name} est déjà revenue ici plusieurs fois.`;
  return `${state.humans[humanId].name} n'a pas encore de routine claire ici.`;
}
