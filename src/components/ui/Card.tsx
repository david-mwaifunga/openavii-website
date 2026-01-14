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
type CardVariant = 'default' | 'glass' | 'gradient' | 'featured';

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
 * Versatile card component with glassmorphism effects.
 * Features smooth hover animations and optional glow effects.
 * Adapts to both light and dark themes.
 */
export function Card({
  children,
  variant = 'default',
  hoverable = true,
  glowBorder = false,
  className = '',
  ...props
}: CardProps) {
  // Base styles for all cards
  const baseStyles = `
    relative rounded-xl md:rounded-2xl overflow-hidden
    transition-all duration-500 ease-out
  `;

  // Variant-specific styles - theme responsive
  const variantStyles: Record<CardVariant, string> = {
    default: `
      bg-white dark:bg-slate-900/50
      backdrop-blur-xl
      border border-slate-200 dark:border-slate-800/50
      shadow-sm dark:shadow-none
    `,
    glass: `
      bg-white/70 dark:bg-white/5
      backdrop-blur-2xl
      border border-slate-200/50 dark:border-white/10
    `,
    gradient: `
      bg-gradient-to-br from-white via-slate-50 to-slate-100
      dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-800
      border border-slate-200 dark:border-slate-700/50
    `,
    featured: `
      bg-gradient-to-br from-violet-50 via-white to-indigo-50
      dark:from-violet-950/50 dark:via-slate-900 dark:to-indigo-950/50
      border border-violet-200 dark:border-violet-500/20
    `,
  };

  // Hover effect styles
  const hoverStyles = hoverable
    ? 'hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-violet-500/10'
    : '';

  // Glow border effect
  const glowStyles = glowBorder
    ? 'before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-violet-500/50 before:via-transparent before:to-indigo-500/50 before:-z-10'
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
