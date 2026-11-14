/**
 * Button
 * One component for actions (<button>) and navigation (<a>, when `href` is
 * given). Pill-shaped, Bold labels (a documented deviation from the guideline's
 * Light weight for calls to action: Light fails legibility on a filled button),
 * and a 44 px minimum touch target. Colours come from the surface-aware
 * semantic tokens, so the same primary button is navy on light surfaces and
 * bright cyan on dark and brand surfaces.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconName } from '@/content/icons';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex min-h-11 select-none items-center justify-center gap-2 whitespace-nowrap rounded-pill font-bold tracking-tight ' +
  'transition-[background-color,color,border-color,transform] duration-200 ease-reveal active:translate-y-px ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-btn text-on-btn hover:bg-btn-hover',
  secondary: 'border-2 border-fg text-fg hover:bg-fg hover:text-page',
  ghost: 'text-fg hover:bg-alt',
  inverse: 'bg-brand-white text-navy hover:bg-mist',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 text-small',
  md: 'px-6 text-body',
  lg: 'px-8 text-lg',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Decorative icon after the label. */
  iconAfter?: IconName;
  children: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps & { href?: undefined; external?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = CommonProps & { href: string; external?: boolean } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', size = 'md', iconAfter, children, className, ...rest } = props;
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
  const content = (
    <>
      {children}
      {iconAfter && <Icon name={iconAfter} size={18} />}
    </>
  );

  if (typeof (rest as LinkProps).href === 'string') {
    const { href, external, ...anchor } = rest as LinkProps;
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...anchor}
      >
        {content}
      </a>
    );
  }

  const { type = 'button', ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...button}>
      {content}
    </button>
  );
}

export default Button;
