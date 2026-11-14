/**
 * Chip
 * A small label (for example the six core values). Outline by default; the
 * solid look uses the accent fill with near-black text, never white on cyan.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ChipProps {
  tone?: 'outline' | 'solid';
  className?: string;
  children: ReactNode;
}

export function Chip({ tone = 'outline', className, children }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-4 py-1.5 text-small font-bold',
        tone === 'solid' ? 'bg-accent-fill text-on-accent' : 'border border-line text-fg',
        className,
      )}
    >
      {children}
    </span>
  );
}
