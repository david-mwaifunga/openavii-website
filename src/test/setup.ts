/**
 * Global test setup
 * Registers jest-dom + vitest-axe matchers, cleans the DOM between tests and
 * supplies the browser APIs jsdom does not implement (matchMedia,
 * scrollIntoView). Per-test helpers for controlling them live in ./utils.
 *
 * Files that opt into the `node` environment (`// @vitest-environment node`,
 * e.g. the asset and CSS-token contracts) have no `window`, so every DOM
 * touch below is guarded.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, expect, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as axeMatchers from 'vitest-axe/matchers';
import { installMatchMedia } from './utils';

expect.extend(axeMatchers);

const hasDom = typeof window !== 'undefined';

/**
 * React reports invalid HTML nesting, missing keys, act() problems and
 * hydration mismatches through console.error. A passing test must not
 * hide them, so any unexpected console.error fails the test that caused it.
 * A test that expects an error (e.g. a hook used outside its provider) says so
 * with its own `vi.spyOn(console, 'error').mockImplementation(() => {})`.
 */
let consoleErrors: unknown[][] = [];

beforeEach(() => {
  consoleErrors = [];
  vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    consoleErrors.push(args);
  });
  if (!hasDom) return;
  // Default environment: light scheme, motion allowed. Tests override via
  // installMatchMedia({ dark: true, reducedMotion: true }).
  installMatchMedia();
  // jsdom has no layout engine, so scrollIntoView is absent.
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  if (hasDom) cleanup();
  const unexpected = consoleErrors;
  consoleErrors = [];
  if (unexpected.length > 0) {
    const first = unexpected[0].map((a) => (a instanceof Error ? a.message : String(a))).join(' ');
    throw new Error(`Unexpected console.error during the test (${unexpected.length}): ${first.slice(0, 600)}`);
  }
  if (!hasDom) return;
  document.documentElement.className = '';
  document.documentElement.removeAttribute('style');
  document.documentElement.removeAttribute('data-hydrated');
  document.body.removeAttribute('style');
  try {
    localStorage.clear();
  } catch {
    /* storage unavailable - nothing to clear */
  }
});
