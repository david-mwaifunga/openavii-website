/**
 * Theme Toggle Component
 * An animated button to switch between light and dark themes.
 * Features smooth icon transitions and accessible design.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useTheme } from '@/context';
import { useMounted } from '@/hooks';

/**
 * Animated theme toggle button with sun/moon icons.
 * Displays a skeleton state during initial hydration to prevent flash.
 */
export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = useMounted();

  // Show skeleton during SSR/hydration
  if (!mounted) {
    return (
      <button
        className="
          relative w-10 h-10 rounded-xl
          bg-[var(--background-tertiary)]
          border border-[var(--border)]
          flex items-center justify-center
          transition-all duration-300
        "
        aria-label="Toggle theme"
        disabled
      >
        <div className="w-5 h-5 rounded-full bg-[var(--border)] animate-pulse" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-10 h-10 rounded-xl
        flex items-center justify-center
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[var(--background)]
        hover:scale-105 active:scale-95
        border border-line
        ${isDark
          ? 'bg-surface-tint hover:bg-navy-light/25'
          : 'bg-surface-muted hover:bg-navy-tint'
        }
      `}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun Icon - shown in dark mode */}
      <svg
        className={`
          absolute w-5 h-5 transition-all duration-500
          ${isDark
            ? 'opacity-100 rotate-0 scale-100 text-warning'
            : 'opacity-0 rotate-90 scale-0 text-warning'
          }
        `}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon Icon - shown in light mode */}
      <svg
        className={`
          absolute w-5 h-5 transition-all duration-500
          ${isDark
            ? 'opacity-0 -rotate-90 scale-0 text-fg-muted'
            : 'opacity-100 rotate-0 scale-100 text-fg-muted'
          }
        `}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}

export default ThemeToggle;
