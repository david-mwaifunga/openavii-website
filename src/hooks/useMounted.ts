/**
 * useMounted Hook
 * Returns true after the component has mounted on the client.
 * Useful for preventing hydration mismatches with dynamic content.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useSyncExternalStore } from 'react';

/**
 * Subscribe function for useSyncExternalStore
 * No-op since mounted state never changes after mount
 */
function subscribe() {
  // No external subscription needed - mounted state is static after first render
  return () => {};
}

/**
 * Server snapshot - always false during SSR
 */
function getServerSnapshot() {
  return false;
}

/**
 * Client snapshot - always true after first render
 */
function getSnapshot() {
  return true;
}

/**
 * Hook to safely determine if the component has mounted.
 * Uses useSyncExternalStore to avoid hydration warnings and ESLint errors.
 *
 * @returns true after the component has mounted, false during SSR
 *
 * @example
 * ```tsx
 * const mounted = useMounted();
 *
 * if (!mounted) {
 *   return <Skeleton />;
 * }
 *
 * return <DynamicContent />;
 * ```
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useMounted;
