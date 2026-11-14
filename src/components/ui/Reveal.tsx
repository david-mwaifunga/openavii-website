/**
 * Reveal
 * Fades and lifts its content into place once, the first time it scrolls into
 * view ("illumination": things move from dim to lit). Only transform and
 * opacity animate. The hidden start state is a CSS rule gated behind the `.js`
 * class set by the inline theme script, so without JavaScript - and for
 * crawlers - all content is simply visible. `prefers-reduced-motion` shows the
 * final state at once (globals.css).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { createElement, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/cn';

type RevealTag = 'div' | 'li' | 'article' | 'section' | 'p' | 'span' | 'ul' | 'figure';

interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The element to render (keeps list and article markup valid). */
  as?: RevealTag;
  /** Direction the content arrives from. */
  variant?: 'up' | 'left' | 'right' | 'scale';
  /** Stagger delay in ms (keep steps at 80 ms or less). */
  delay?: number;
  children?: ReactNode;
}

export function Reveal({
  as = 'div',
  variant = 'up',
  delay = 0,
  className,
  children,
  ...rest
}: RevealProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      className: cn('scroll-animate', isVisible && 'is-visible', className),
      'data-reveal': variant === 'up' ? undefined : variant,
      style: delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined,
      ...rest,
    },
    children,
  );
}
