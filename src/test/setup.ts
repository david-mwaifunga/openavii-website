/**
 * Global test setup
 * Registers jest-dom + vitest-axe matchers, cleans the DOM between tests and
 * supplies the browser APIs jsdom does not implement (matchMedia,
 * scrollIntoView). Per-test helpers for controlling them live in ./utils.
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

beforeEach(() => {
  // Default environment: light scheme, motion allowed. Tests override via
  // installMatchMedia({ dark: true, reducedMotion: true }).
  installMatchMedia();
  // jsdom has no layout engine, so scrollIntoView is absent.
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
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
