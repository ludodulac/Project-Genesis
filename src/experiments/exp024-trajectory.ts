export interface Vec2 { x: number; y: number }

export const MAX_PULL = 118;
export const LAUNCH_SCALE = 5.2;

export function clampPull(anchor: Vec2, pointer: Vec2, maxPull = MAX_PULL): Vec2 {
  const dx = pointer.x - anchor.x;
  const dy = pointer.y - anchor.y;
  const length = Math.hypot(dx, dy);
  if (length <= maxPull || length === 0) return { x: pointer.x, y: pointer.y };
  const scale = maxPull / length;
  return { x: anchor.x + dx * scale, y: anchor.y + dy * scale };
}

export function launchVelocity(anchor: Vec2, pulledTo: Vec2, scale = LAUNCH_SCALE): Vec2 {
  return {
    x: (anchor.x - pulledTo.x) * scale,
    y: (anchor.y - pulledTo.y) * scale,
  };
}

export function reflectVelocity(velocity: Vec2, normal: Vec2, restitution = 0.86): Vec2 {
  const dot = velocity.x * normal.x + velocity.y * normal.y;
  return {
    x: (velocity.x - 2 * dot * normal.x) * restitution,
    y: (velocity.y - 2 * dot * normal.y) * restitution,
  };
}
