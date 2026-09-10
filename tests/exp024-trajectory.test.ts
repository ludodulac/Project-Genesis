import { describe, expect, it } from 'vitest';
import { clampPull, launchVelocity, reflectVelocity } from '../src/experiments/exp024-trajectory';

describe('EXP-024 trajectory probe', () => {
  it('maps pull direction to the opposite launch direction', () => {
    expect(launchVelocity({ x: 100, y: 100 }, { x: 70, y: 120 }, 1)).toEqual({ x: 30, y: -20 });
  });

  it('maps a stronger pull to proportionally greater speed', () => {
    const weak = launchVelocity({ x: 0, y: 0 }, { x: -10, y: 0 }, 1);
    const strong = launchVelocity({ x: 0, y: 0 }, { x: -30, y: 0 }, 1);
    expect(Math.hypot(strong.x, strong.y)).toBeCloseTo(Math.hypot(weak.x, weak.y) * 3);
  });

  it('clamps extreme pulls without changing their direction', () => {
    const clamped = clampPull({ x: 0, y: 0 }, { x: 300, y: 400 }, 100);
    expect(clamped.x).toBeCloseTo(60);
    expect(clamped.y).toBeCloseTo(80);
  });

  it('produces an understandable mirror bounce against a vertical surface', () => {
    const bounced = reflectVelocity({ x: 100, y: 20 }, { x: -1, y: 0 }, 1);
    expect(bounced).toEqual({ x: -100, y: 20 });
  });
});
