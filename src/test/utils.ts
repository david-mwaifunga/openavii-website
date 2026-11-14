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
  /** Report `(min-width: 80rem)` (the xl breakpoint) as matching. */
  wide?: boolean;
}

/** Handle returned by {@link installMatchMedia} for flipping state mid-test. */
export interface MatchMediaController {
  /** Change the colour scheme and notify the colour-scheme listeners. */
  setDark(dark: boolean): void;
  /** Cross the xl breakpoint and notify the width listeners. */
  setWide(wide: boolean): void;
}

type MediaListener = (event: { matches: boolean; media: string }) => void;

/**
 * Install a `window.matchMedia` stub that understands the media features the
 * site queries (colour scheme, reduced motion and the xl width) and supports
 * `change` listeners per query, so tests can simulate the OS switching schemes
 * or a window being resized across a breakpoint.
 */
export function installMatchMedia(options: MatchMediaOptions = {}): MatchMediaController {
  let dark = options.dark ?? false;
  let wide = options.wide ?? false;
  const reducedMotion = options.reducedMotion ?? false;
  const listeners = new Map<string, Set<MediaListener>>();

  const matches = (query: string): boolean => {
    if (query.includes('prefers-color-scheme: dark')) return dark;
    if (query.includes('prefers-reduced-motion: reduce')) return reducedMotion;
    if (query.includes('min-width: 80rem')) return wide;
    return false;
  };
  const listenersFor = (query: string) => {
    let set = listeners.get(query);
    if (!set) listeners.set(query, (set = new Set()));
    return set;
  };
  /** Tell the listeners of every query that mentions `feature`, as a browser would. */
  const notify = (feature: string) => {
    for (const [query, set] of listeners) {
      if (query.includes(feature)) set.forEach((cb) => cb({ matches: matches(query), media: query }));
    }
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
      addEventListener: (_type: string, cb: MediaListener) => listenersFor(query).add(cb),
      removeEventListener: (_type: string, cb: MediaListener) => listenersFor(query).delete(cb),
      addListener: (cb: MediaListener) => listenersFor(query).add(cb),
      removeListener: (cb: MediaListener) => listenersFor(query).delete(cb),
      dispatchEvent: () => false,
    })),
  });

  return {
    setDark(next: boolean) {
      dark = next;
      notify('prefers-color-scheme: dark');
    },
    setWide(next: boolean) {
      wide = next;
      notify('min-width: 80rem');
    },
  };
}

/** A single observed element and its callback, as captured by the stub. */
interface ObserverRecord {
  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit | undefined;
  elements: Set<Element>;
}

/** Handle for driving the IntersectionObserver stub from a test. */
export interface IntersectionController {
  /** Report `element` as intersecting (or not) to every observer watching it. */
  trigger(element: Element, isIntersecting?: boolean): void;
  /** Number of observers currently watching at least one element. */
  activeCount(): number;
  /** The options the observer watching `element` was created with (when it fires), or undefined. */
  optionsFor(element: Element): IntersectionObserverInit | undefined;
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
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.record = { callback, options, elements: new Set() };
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
    optionsFor: (element) => records.find((r) => r.elements.has(element))?.options,
  };
}
