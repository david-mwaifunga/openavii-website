/**
 * Test utilities
 * Small, dependency-free helpers for controlling browser APIs that jsdom does
 * not implement. Kept separate from setup.ts so tests can import them.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { vi } from 'vitest';

/** Options for the controllable `matchMedia` stub. */
export interface MatchMediaOptions {
  /** Report `(prefers-color-scheme: dark)` as matching. */
  dark?: boolean;
  /** Report `(prefers-reduced-motion: reduce)` as matching. */
  reducedMotion?: boolean;
}

/** Handle returned by {@link installMatchMedia} for flipping state mid-test. */
export interface MatchMediaController {
  /** Change the colour scheme and notify `change` listeners. */
  setDark(dark: boolean): void;
}

/**
 * Install a `window.matchMedia` stub that understands the two media features
 * the site queries (colour scheme and reduced motion) and supports `change`
 * listeners, so theme tests can simulate the OS switching schemes.
 */
export function installMatchMedia(options: MatchMediaOptions = {}): MatchMediaController {
  let dark = options.dark ?? false;
  const reducedMotion = options.reducedMotion ?? false;
  const listeners = new Set<() => void>();

  const matches = (query: string): boolean => {
    if (query.includes('prefers-color-scheme: dark')) return dark;
    if (query.includes('prefers-reduced-motion: reduce')) return reducedMotion;
    return false;
  };

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => ({
      get matches() {
        return matches(query);
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, cb: () => void) => listeners.add(cb),
      removeEventListener: (_type: string, cb: () => void) => listeners.delete(cb),
      addListener: (cb: () => void) => listeners.add(cb),
      removeListener: (cb: () => void) => listeners.delete(cb),
      dispatchEvent: () => false,
    })),
  });

  return {
    setDark(next: boolean) {
      dark = next;
      listeners.forEach((cb) => cb());
    },
  };
}

/** A single observed element and its callback, as captured by the stub. */
interface ObserverRecord {
  callback: IntersectionObserverCallback;
  elements: Set<Element>;
}

/** Handle for driving the IntersectionObserver stub from a test. */
export interface IntersectionController {
  /** Report `element` as intersecting (or not) to every observer watching it. */
  trigger(element: Element, isIntersecting?: boolean): void;
  /** Number of observers currently watching at least one element. */
  activeCount(): number;
}

/**
 * Replace `IntersectionObserver` with a controllable stub. Without this the
 * scroll-reveal hook falls back to "visible immediately", which is correct
 * for no-JS/legacy browsers but hides the reveal behaviour we want to test.
 */
export function installIntersectionObserver(): IntersectionController {
  const records: ObserverRecord[] = [];

  class StubObserver {
    private record: ObserverRecord;
    constructor(callback: IntersectionObserverCallback) {
      this.record = { callback, elements: new Set() };
      records.push(this.record);
    }
    observe(element: Element) {
      this.record.elements.add(element);
    }
    unobserve(element: Element) {
      this.record.elements.delete(element);
    }
    disconnect() {
      this.record.elements.clear();
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  vi.stubGlobal('IntersectionObserver', StubObserver);

  return {
    trigger(element, isIntersecting = true) {
      for (const record of records) {
        if (!record.elements.has(element)) continue;
        record.callback(
          [{ target: element, isIntersecting } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      }
    },
    activeCount: () => records.filter((r) => r.elements.size > 0).length,
  };
}
