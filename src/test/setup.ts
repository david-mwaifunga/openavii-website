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

beforeEach(() => {
  if (!hasDom) return;
  // Default environment: light scheme, motion allowed. Tests override via
  // installMatchMedia({ dark: true, reducedMotion: true }).
  installMatchMedia();
  // jsdom has no layout engine, so scrollIntoView is absent.
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  if (!hasDom) return;
  cleanup();
  document.documentElement.className = '';
  document.documentElement.removeAttribute('style');
  document.body.removeAttribute('style');
  try {
    localStorage.clear();
  } catch {
    /* storage unavailable - nothing to clear */
  }
});
