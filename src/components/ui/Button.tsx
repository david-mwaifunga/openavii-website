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
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

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
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-[1.02] active:scale-[0.98]
  `;

  // Variant-specific styles - theme responsive
  const variantStyles: Record<ButtonVariant, string> = {
    primary: `
      bg-gradient-to-r from-violet-600 to-indigo-600
      hover:from-violet-500 hover:to-indigo-500
      text-white shadow-lg shadow-violet-500/25
      hover:shadow-xl hover:shadow-violet-500/30
      focus:ring-violet-500
    `,
    secondary: `
      bg-gradient-to-r from-slate-700 to-slate-600
      dark:from-slate-800 dark:to-slate-700
      hover:from-slate-600 hover:to-slate-500
      dark:hover:from-slate-700 dark:hover:to-slate-600
      text-white shadow-lg shadow-slate-900/25
      focus:ring-slate-500
    `,
    outline: `
      border-2 border-violet-500/50 bg-transparent
      text-violet-600 dark:text-violet-400
      hover:bg-violet-500/10
      hover:border-violet-500 dark:hover:border-violet-400
      focus:ring-violet-500
    `,
    ghost: `
      bg-transparent
      text-slate-600 dark:text-slate-300
      hover:bg-slate-100 dark:hover:bg-white/5
      hover:text-slate-900 dark:hover:text-white
      focus:ring-slate-500
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
