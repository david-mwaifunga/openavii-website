// @vitest-environment node
/**
 * Formatting helpers
 * Deterministic (no locale lookups) so server and browser always agree.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { formatZmw, formatZmwRange } from './format';
import { cn } from './cn';

describe('formatZmw', () => {
  it.each([
    [0, 'ZMW 0'],
    [999, 'ZMW 999'],
    [3500, 'ZMW 3,500'],
    [12000, 'ZMW 12,000'],
    [1234567, 'ZMW 1,234,567'],
  ])('%i -> %s', (amount, expected) => {
    expect(formatZmw(amount)).toBe(expected);
  });
});

describe('formatZmwRange', () => {
  it('shows the currency once, with an en dash', () => {
    expect(formatZmwRange({ min: 3500, max: 6000, currency: 'ZMW' })).toBe('ZMW 3,500 – 6,000');
    expect(formatZmwRange({ min: 12000, max: 20000, currency: 'ZMW' })).toBe('ZMW 12,000 – 20,000');
  });
});

describe('cn', () => {
  it('joins truthy class names and skips falsy ones', () => {
    expect(cn('a', false, null, undefined, '', 'b', 0 && 'c')).toBe('a b');
  });
});
