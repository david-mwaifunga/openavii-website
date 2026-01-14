/**
 * Theme Context
 * Provides theme state management across the application.
 * Supports light/dark mode with system preference detection and localStorage persistence.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

/** Available theme options */
type Theme = 'light' | 'dark' | 'system';

/** Resolved theme (actual applied theme) */
type ResolvedTheme = 'light' | 'dark';

/** Theme context value interface */
interface ThemeContextValue {
  /** Current theme setting (light, dark, or system) */
  theme: Theme;
  /** The actual resolved theme being applied */
  resolvedTheme: ResolvedTheme;
  /** Function to update the theme */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
}

/** Local storage key for theme preference */
const THEME_STORAGE_KEY = 'openavii-theme';

/** Create the theme context */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// useSyncExternalStore helpers for mounted state
const subscribeMounted = () => () => {};
const getServerMounted = () => false;
const getClientMounted = () => true;

/**
 * Get the system's preferred color scheme
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolve the actual theme based on theme setting
 */
function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Apply theme class to document
 */
function applyThemeToDocument(resolvedTheme: ResolvedTheme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
}

/**
 * Theme Provider Component
 * Wraps the application to provide theme context and manage theme state.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore for mounted state to avoid ESLint warnings
  const mounted = useSyncExternalStore(subscribeMounted, getClientMounted, getServerMounted);

  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [initialized, setInitialized] = useState(false);

  // Initialize on mount - use queueMicrotask to avoid lint warning
  useEffect(() => {
    if (!mounted || initialized) return;

    // Get stored theme or default to light
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const initialTheme = storedTheme || 'light';
    const resolved = resolveTheme(initialTheme);

    // Use queueMicrotask to batch state updates
    queueMicrotask(() => {
      setThemeState(initialTheme);
      setResolvedTheme(resolved);
      setInitialized(true);
      applyThemeToDocument(resolved);
    });
  }, [mounted, initialized]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const newResolved = getSystemTheme();
      setResolvedTheme(newResolved);
      applyThemeToDocument(newResolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, theme]);

  /**
   * Update theme and persist to localStorage
   */
  const setTheme = useCallback((newTheme: Theme) => {
    const resolved = resolveTheme(newTheme);

    setThemeState(newTheme);
    setResolvedTheme(resolved);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyThemeToDocument(resolved);

    // Add transition class for smooth theme switching
    const root = document.documentElement;
    root.classList.add('theme-transition');
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = useCallback(() => {
    // Get current actual theme and toggle it
    const currentResolved = resolveTheme(theme);
    const newTheme: Theme = currentResolved === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to access theme context
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export default ThemeProvider;
