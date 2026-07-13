/**
 * Button Component
 * A versatile, animated button component with multiple variants and sizes.
 * Supports primary, secondary, and outline styles with smooth hover transitions.
 * Theme-responsive for both light and dark modes.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { type ReactNode, type ButtonHTMLAttributes } from 'react';

/** Available button style variants */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outline-inverse' | 'ghost';

/** Available button sizes */
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The content to display inside the button */
  children: ReactNode;
  /** Visual style variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Optional icon to display before the text */
  icon?: ReactNode;
}

/**
 * Reusable Button component with multiple variants and smooth animations.
 * Features gradient backgrounds, hover effects, and focus states.
 * Adapts to both light and dark themes.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  // Base styles applied to all button variants
  const baseStyles = `
    relative inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)]
    disabled:opacity-60 disabled:cursor-not-allowed
    disabled:hover:scale-100 disabled:hover:shadow-none disabled:shadow-none
    transform hover:scale-[1.02] active:scale-[0.98]
  `;

  // Variant-specific styles - Openavii enterprise palette (theme responsive)
  const variantStyles: Record<ButtonVariant, string> = {
    // Primary CTA: solid electric-blue accent with white text
    primary: `
      bg-accent-solid text-white
      shadow-sm shadow-accent-solid/25
      hover:bg-accent-solid-hover hover:shadow-md hover:shadow-accent-solid/30
      focus:ring-accent
    `,
    // Secondary: solid navy fill
    secondary: `
      bg-navy text-white
      shadow-sm shadow-navy/25
      hover:bg-navy-dark
      focus:ring-accent
    `,
    // Outline: transparent with navy border + navy/near-white text
    outline: `
      bg-transparent
      border border-navy dark:border-navy-light
      text-heading
      hover:bg-navy-tint
      focus:ring-accent
    `,
    // Outline for dark surfaces (footer, dark hero) - light border + white text
    'outline-inverse': `
      bg-transparent
      border border-white/35
      text-white
      hover:bg-white/10 hover:border-white/60
      focus:ring-white/70
    `,
    // Ghost: quiet text button
    ghost: `
      bg-transparent
      text-fg-muted
      hover:bg-surface-tint hover:text-fg
      focus:ring-accent
    `,
  };

  // Size-specific styles - mobile-first
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-sm md:px-4',
    md: 'px-4 py-2.5 text-sm md:px-6 md:py-3 md:text-base',
    lg: 'px-6 py-3 text-base md:px-8 md:py-4 md:text-lg',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Optional leading icon */}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export default Button;
