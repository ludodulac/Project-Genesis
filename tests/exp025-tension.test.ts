import { describe, expect, it } from 'vitest';
import { BASE_RADIUS, MAX_RADIUS, circlesOverlap, growHeld } from '../src/experiments/exp025-tension';

describe('EXP-025 tactile tension probe', () => {
  it('grows only as held time increases', () => {
    const a = growHeld({ radius: BASE_RADIUS, heldMs: 0 }, 500);
    const b = growHeld(a, 500);
    expect(b.radius).toBeGreaterThan(a.radius);
    expect(b.heldMs).toBe(1000);
  });

  it('caps growth without inventing extra states', () => {
    const grown = growHeld({ radius: BASE_RADIUS, heldMs: 0 }, 10000);
    expect(grown.radius).toBe(MAX_RADIUS);
  });

  it('detects the visible collision boundary', () => {
    expect(circlesOverlap({ x: 0, y: 0, r: 20 }, { x: 39, y: 0, r: 20 })).toBe(true);
    expect(circlesOverlap({ x: 0, y: 0, r: 20 }, { x: 41, y: 0, r: 20 })).toBe(false);
  });
});
