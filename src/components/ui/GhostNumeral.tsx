/**
 * GhostNumeral
 * The brand's chapter-divider device: a giant ExtraBold numeral in translucent
 * lighter cyan, cropped by the section edge, behind the headline. Decorative
 * only, so it is hidden from assistive technology and ignores the pointer.
 * The parent section clips it (`section-clip`), so it can never cause
 * horizontal scroll.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { cn } from '@/lib/cn';

interface GhostNumeralProps {
  value: string;
  /** Which edge the numeral bleeds off. */
  align?: 'left' | 'right';
  className?: string;
}

export function GhostNumeral({ value, align = 'right', className }: GhostNumeralProps) {
  return (
    <span
      aria-hidden="true"
      data-ghost-numeral=""
      className={cn(
        'pointer-events-none absolute -z-10 select-none text-[clamp(11rem,30vw,28rem)] font-extrabold leading-none tracking-[-0.06em] text-ghost',
        align === 'right' ? '-right-[0.07em] -top-[0.1em]' : '-left-[0.07em] -top-[0.1em]',
        className,
      )}
    >
      {value}
    </span>
  );
}
