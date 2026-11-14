/**
 * RingMark
 * The approved ring mark used as an oversized, cropped, translucent watermark
 * behind headlines (Company Profile covers, billboard, apparel). Only the
 * approved Mark artwork is used - never redrawn - and it is tinted only with a
 * palette colour: the artwork's alpha is applied as a CSS mask over a flat
 * brand colour, and the result is faded with opacity.
 *
 * It is a mask rather than an <img> on purpose: a very large, very faint image
 * would be reported by the browser as the page's Largest Contentful Paint
 * element and could hide the real one (the hero photograph).
 * Decorative: hidden from assistive technology.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { CSSProperties } from 'react';
import { logos } from '@/content/photos';
import { cn } from '@/lib/cn';

type RingTone = 'white' | 'cyan' | 'navy';

const TONES: Record<RingTone, string> = {
  white: 'bg-brand-white',
  cyan: 'bg-cyan',
  navy: 'bg-navy',
};

interface RingMarkProps {
  tone?: RingTone;
  /** Position, size and opacity (e.g. "right-[-8%] top-0 w-[60vw] opacity-10"). */
  className?: string;
}

export function RingMark({ tone = 'white', className }: RingMarkProps) {
  const mask = `url(${logos.mark.white})`;
  const style: CSSProperties = {
    // The white artwork's alpha is the shape; WebkitMask* keeps Safari before 15.4 working.
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    aspectRatio: `${logos.mark.width} / ${logos.mark.height}`,
  };

  return (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none absolute block select-none', TONES[tone], className)}
      style={style}
    />
  );
}
