/**
 * Card Component
 * A flexible container component with glassmorphism effects and hover animations.
 * Supports multiple visual variants for different use cases.
 * Theme-responsive for both light and dark modes.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { type ReactNode, type HTMLAttributes } from 'react';

/** Available card style variants */
type CardVariant = 'default' | 'glass' | 'gradient' | 'featured' | 'premium';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** The content to display inside the card */
  children: ReactNode;
  /** Visual style variant of the card */
  variant?: CardVariant;
  /** Whether to add hover lift effect */
  hoverable?: boolean;
  /** Whether to show a decorative border glow */
  glowBorder?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Versatile card component with enhanced glassmorphism effects.
 * Features smooth hover animations, depth shadows, and modern glass aesthetics.
 * Adapts to both light and dark themes with premium visual polish.
 */
export function Card({
  children,
  variant = 'default',
  hoverable = true,
  glowBorder = false,
  className = '',
  ...props
}: CardProps) {
  // Base styles for all cards with enhanced transitions
  const baseStyles = `
    relative rounded-xl md:rounded-2xl overflow-hidden
    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
  `;

  // Variant-specific styles - Openavii enterprise palette (theme responsive)
  const variantStyles: Record<CardVariant, string> = {
    // Clean surface card with subtle border + soft navy shadow
    default: `
      bg-surface/90 dark:bg-surface/70
      backdrop-blur-xl backdrop-saturate-[180%]
      border border-line
      shadow-[0_2px_16px_-4px_rgba(22,34,53,0.08)]
      dark:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.35)]
    `,
    // Frosted glass surface
    glass: `
      bg-surface/70 dark:bg-surface/55
      backdrop-blur-2xl backdrop-saturate-[200%]
      border border-line
      shadow-[0_4px_24px_-6px_rgba(22,34,53,0.10)]
      dark:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.40)]
    `,
    // Subtle neutral gradient (white → soft grey/navy tint)
    gradient: `
      bg-gradient-to-br from-surface to-surface-muted
      backdrop-blur-xl backdrop-saturate-[150%]
      border border-line
      shadow-[0_2px_16px_-4px_rgba(22,34,53,0.08)]
      dark:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.35)]
    `,
    // Featured - white surface with an accent-tinted border (no heavy fill)
    featured: `
      bg-surface/95 dark:bg-surface/80
      backdrop-blur-xl backdrop-saturate-[180%]
      border border-accent/30 dark:border-accent/25
      shadow-[0_8px_32px_-8px_rgba(37,99,235,0.16)]
      dark:shadow-[0_8px_32px_-8px_rgba(37,99,235,0.22)]
    `,
    // Premium - elevated white with a soft, deeper shadow
    premium: `
      bg-surface/95 dark:bg-surface/80
      backdrop-blur-2xl backdrop-saturate-[200%]
      border border-line
      shadow-[0_10px_40px_-10px_rgba(22,34,53,0.14)]
      dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
    `,
  };

  // Consistent hover: small lift + slightly stronger shadow + accent border tint
  const hoverStyles = hoverable
    ? `hover:-translate-y-1 md:hover:-translate-y-1.5
       hover:border-accent/30
       hover:shadow-[0_16px_44px_-12px_rgba(22,34,53,0.18)]
       dark:hover:shadow-[0_16px_44px_-12px_rgba(37,99,235,0.20)]`
    : '';

  // Glow border effect - navy → cyan accent
  const glowStyles = glowBorder
    ? 'before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-accent/50 before:via-transparent before:to-cyan/40 before:-z-10'
    : '';

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${hoverStyles}
        ${glowStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Header component for consistent header styling
 */
export function CardHeader({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 pb-0 md:p-6 md:pb-0 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Content component for the main body
 */
export function CardContent({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 md:p-6 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Footer component for actions and additional info
 */
export function CardFooter({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 pt-0 md:p-6 md:pt-0 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
