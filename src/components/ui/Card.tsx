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

  // Variant-specific styles - theme responsive with enhanced glassmorphism
  const variantStyles: Record<CardVariant, string> = {
    default: `
      bg-white/80 dark:bg-slate-900/60
      backdrop-blur-xl backdrop-saturate-[180%]
      border border-slate-200/80 dark:border-slate-700/50
      shadow-[0_4px_24px_-1px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)]
      dark:shadow-[0_4px_24px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]
    `,
    glass: `
      bg-white/60 dark:bg-white/[0.04]
      backdrop-blur-2xl backdrop-saturate-[200%]
      border border-white/50 dark:border-white/[0.08]
      shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.2)]
      dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]
    `,
    gradient: `
      bg-gradient-to-br from-white/90 via-slate-50/80 to-slate-100/90
      dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-800/80
      backdrop-blur-xl backdrop-saturate-[150%]
      border border-slate-200/60 dark:border-slate-700/40
      shadow-[0_4px_20px_rgba(0,0,0,0.05)]
      dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]
    `,
    featured: `
      bg-gradient-to-br from-violet-50/90 via-white/95 to-indigo-50/90
      dark:from-violet-950/40 dark:via-slate-900/80 dark:to-indigo-950/40
      backdrop-blur-xl backdrop-saturate-[180%]
      border border-violet-200/60 dark:border-violet-500/20
      shadow-[0_8px_32px_rgba(139,92,246,0.08),inset_0_1px_0_rgba(255,255,255,0.15)]
      dark:shadow-[0_8px_32px_rgba(139,92,246,0.15),inset_0_1px_0_rgba(255,255,255,0.05)]
    `,
    premium: `
      bg-gradient-to-br from-white/95 via-white/90 to-slate-50/95
      dark:from-slate-800/60 dark:via-slate-900/70 dark:to-slate-800/60
      backdrop-blur-2xl backdrop-saturate-[200%]
      border border-white/60 dark:border-slate-600/30
      shadow-[0_8px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.4)]
      dark:shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]
    `,
  };

  // Enhanced hover effect styles with smooth depth
  const hoverStyles = hoverable
    ? `hover:-translate-y-1 md:hover:-translate-y-1.5
       hover:shadow-[0_16px_48px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.15)]
       dark:hover:shadow-[0_16px_48px_rgba(139,92,246,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]`
    : '';

  // Glow border effect with gradient
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
