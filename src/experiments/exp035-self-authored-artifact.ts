export type ArtifactPoint = {
  id: string;
  x: number;
  y: number;
};

export type ArtifactState = {
  points: ArtifactPoint[];
};

export const ARTIFACT_POINT_COUNT = 5;
export const ARTIFACT_BOUNDS = {
  minX: 42,
  maxX: 348,
  minY: 150,
  maxY: 610,
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function clampPoint(x: number, y: number): Pick<ArtifactPoint, 'x' | 'y'> {
  return {
    x: clamp(x, ARTIFACT_BOUNDS.minX, ARTIFACT_BOUNDS.maxX),
    y: clamp(y, ARTIFACT_BOUNDS.minY, ARTIFACT_BOUNDS.maxY),
  };
}

export function emptyArtifactState(): ArtifactState {
  return { points: [] };
}

export function createArtifact(samples: ReadonlyArray<{ x: number; y: number }>): ArtifactState {
  if (samples.length === 0) return emptyArtifactState();

  const start = samples[0];
  const end = samples[samples.length - 1];
  const distance = Math.hypot(end.x - start.x, end.y - start.y);

  const source = distance >= 24
    ? samples
    : [
        { x: start.x - 36, y: start.y + 18 },
        { x: start.x - 14, y: start.y - 22 },
        { x: start.x + 10, y: start.y + 12 },
        { x: start.x + 30, y: start.y - 10 },
        { x: start.x + 44, y: start.y + 20 },
      ];

  const points: ArtifactPoint[] = [];
  for (let index = 0; index < ARTIFACT_POINT_COUNT; index += 1) {
    const t = index / (ARTIFACT_POINT_COUNT - 1);
    const sourceIndex = Math.round(t * (source.length - 1));
    const sample = source[sourceIndex];
    const clamped = clampPoint(sample.x, sample.y);
    points.push({ id: `p${index}`, ...clamped });
  }

  return { points };
}

export function moveArtifactPoint(
  state: ArtifactState,
  id: string,
  x: number,
  y: number,
): ArtifactState {
  if (!state.points.some((point) => point.id === id)) return state;
  const clamped = clampPoint(x, y);
  return {
    points: state.points.map((point) => point.id === id ? { ...point, ...clamped } : point),
  };
}
