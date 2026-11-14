/**
 * Theme Context
 * Light / dark / system theme for the whole site.
 *
 * The first paint is handled by the inline script in the root layout
 * (lib/themeScript), which puts the right class on <html> before React loads.
 * This provider then only has to keep that class in sync and expose the API:
 * it never sets state from an effect (the preference lives in external stores
 * read with useSyncExternalStore), so there is no flash and no hydration
 * mismatch. The server cannot know the visitor's preference, so it renders the
 * neutral defaults ("system", shown as light); components that differ by theme
 * switch with CSS, not with this value.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { THEME_STORAGE_KEY } from '@/lib/themeScript';
import { useMounted } from '@/hooks/useMounted';

/** Preference chosen by the visitor. */
export type Theme = 'light' | 'dark' | 'system';

/** The theme actually shown. */
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  /** The visitor's preference (light, dark, or follow the system). */
  theme: Theme;
  /** The theme currently applied to the page. */
  resolvedTheme: ResolvedTheme;
  /** Choose a theme; persisted to localStorage under `openavii-theme`. */
  setTheme: (theme: Theme) => void;
  /** Flip to the opposite of what is currently shown. */
  toggleTheme: () => void;
}

const DARK_QUERY = '(prefers-color-scheme: dark)';
const isTheme = (value: unknown): value is Theme =>
  value === 'light' || value === 'dark' || value === 'system';

/** Stored preference, or "system" when absent, invalid or storage is blocked. */
function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    /* storage blocked (private mode, policy) - fall through to the default */
  }
  return 'system';
}

/**
 * External store for the visitor's preference and the OS colour scheme.
 * `override` holds the latest choice in memory so toggling keeps working when
 * storage is blocked; a `storage` event from another tab clears it so the newer
 * stored value wins.
 */
function createThemeStore() {
  let override: Theme | null = null;
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      const media = window.matchMedia(DARK_QUERY);
      const onStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === THEME_STORAGE_KEY) {
          override = null;
          listener();
        }
      };
      window.addEventListener('storage', onStorage);
      media.addEventListener('change', listener);
      return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', onStorage);
        media.removeEventListener('change', listener);
      };
    },
    getTheme: (): Theme => override ?? readStoredTheme(),
    getSystemDark: (): boolean => window.matchMedia(DARK_QUERY).matches,
    setTheme(next: Theme) {
      override = next;
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* storage blocked - the in-memory override still applies */
      }
      notify();
    },
  };
}

const getServerTheme = (): Theme => 'system';
const getServerSystemDark = () => false;

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Theme provider. Wrap the app once, in the root layout.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createThemeStore);
  const theme = useSyncExternalStore(store.subscribe, store.getTheme, getServerTheme);
  const systemDark = useSyncExternalStore(store.subscribe, store.getSystemDark, getServerSystemDark);
  // False during the hydration render, so the server snapshot above can never
  // strip the class the inline script already applied.
  const hydrated = useMounted();

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  // Keep <html> in step with the resolved theme (a no-op after the inline script).
  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
  }, [hydrated, resolvedTheme]);

  // One removal timer at a time: a second toggle restarts the 300 ms window
  // instead of being cut short by the first toggle's timer.
  const transitionTimer = useRef<number | undefined>(undefined);
  useEffect(
    () => () => {
      window.clearTimeout(transitionTimer.current);
      document.documentElement.classList.remove('theme-transition');
    },
    [],
  );

  const setTheme = useCallback(
    (next: Theme) => {
      // Ease colours across the change instead of jumping.
      const root = document.documentElement;
      root.classList.add('theme-transition');
      window.clearTimeout(transitionTimer.current);
      transitionTimer.current = window.setTimeout(
        () => root.classList.remove('theme-transition'),
        300,
      );
      store.setTheme(next);
    },
    [store],
  );

  const toggleTheme = useCallback(
    () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    [resolvedTheme, setTheme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Read the theme API.
 * @throws if used outside a ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
