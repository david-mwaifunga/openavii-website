/**
 * Badge Component
 * A small, stylish indicator component for labels and tags.
 * Features gradient backgrounds and subtle animations.
 * Theme-responsive for both light and dark modes.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { type ReactNode } from 'react';

/** Available badge style variants */
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'popular';

interface BadgeProps {
  /** The content to display inside the badge */
  children: ReactNode;
  /** Visual style variant of the badge */
  variant?: BadgeVariant;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Compact badge component for highlighting features, tags, or status indicators.
 * Includes a subtle pulse animation for the "popular" variant.
 * Adapts to both light and dark themes.
 */
export function Badge({
  children,
  variant = 'primary',
  className = '',
}: BadgeProps) {
  // Variant-specific styles with gradients and shadows - theme responsive
  const variantStyles: Record<BadgeVariant, string> = {
    primary: `
      bg-gradient-to-r from-violet-100 to-indigo-100
      dark:from-violet-600/20 dark:to-indigo-600/20
      text-violet-700 dark:text-violet-300
      border border-violet-300 dark:border-violet-500/30
    `,
    secondary: `
      bg-slate-100 dark:bg-slate-800/50
      text-slate-600 dark:text-slate-300
      border border-slate-300 dark:border-slate-700
    `,
    success: `
      bg-gradient-to-r from-emerald-100 to-teal-100
      dark:from-emerald-600/20 dark:to-teal-600/20
      text-emerald-700 dark:text-emerald-300
      border border-emerald-300 dark:border-emerald-500/30
    `,
    warning: `
      bg-gradient-to-r from-amber-100 to-orange-100
      dark:from-amber-600/20 dark:to-orange-600/20
      text-amber-700 dark:text-amber-300
      border border-amber-300 dark:border-amber-500/30
    `,
    popular: `
      bg-gradient-to-r from-rose-100 to-pink-100
      dark:from-rose-600/20 dark:to-pink-600/20
      text-rose-700 dark:text-rose-300
      border border-rose-300 dark:border-rose-500/30
      animate-pulse-subtle
    `,
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 text-xs font-medium
        md:px-3
        rounded-full backdrop-blur-sm
        transition-all duration-300
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
