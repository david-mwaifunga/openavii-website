/**
 * ThemeToggle
 * Switches between the light and dark themes. Both icons are always in the
 * markup and CSS shows the right one (the sun in dark, the moon in light), so
 * there is no skeleton and no flash while the page hydrates. The accessible
 * name states the action and updates once the visitor's real theme is known.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-pill border border-line text-fg transition-colors duration-200 hover:bg-alt',
        className,
      )}
    >
      <Icon name="Sun" className="hidden dark:block" />
      <Icon name="Moon" className="dark:hidden" />
    </button>
  );
}

export default ThemeToggle;
