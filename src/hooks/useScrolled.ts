/**
 * useScrolled
 * True once the page has scrolled past `threshold` pixels. Built on
 * useSyncExternalStore, so there is no setState-in-effect, the server render
 * is always "not scrolled" (the top of the page) and a refresh part-way down
 * the page is corrected on hydration.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

/**
 * @param threshold scroll distance in px after which the page counts as scrolled
 */
export function useScrolled(threshold = 24): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}
