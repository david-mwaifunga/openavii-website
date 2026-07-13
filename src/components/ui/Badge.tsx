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
  // Variant-specific styles - Openavii enterprise palette (theme responsive)
  const variantStyles: Record<BadgeVariant, string> = {
    // Quiet navy chip
    primary: `
      bg-navy-tint
      text-heading
      border border-line
    `,
    // Neutral chip
    secondary: `
      bg-surface-muted
      text-fg-muted
      border border-line
    `,
    // Status: success
    success: `
      bg-success/10
      text-success
      border border-success/30
    `,
    // Status: warning
    warning: `
      bg-warning/10
      text-warning
      border border-warning/30
    `,
    // Highlight - electric blue accent
    popular: `
      bg-accent/12
      text-accent
      border border-accent/35
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
