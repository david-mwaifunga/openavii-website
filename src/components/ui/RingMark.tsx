/**
 * RingMark
 * The approved ring mark used as an oversized, cropped, translucent watermark
 * behind headlines (Company Profile covers, billboard, apparel). Only the
 * approved Mark artwork is used - never redrawn - and it may be faded with
 * opacity only. Decorative: hidden from assistive technology.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import Image from 'next/image';
import { logos } from '@/content/photos';
import { cn } from '@/lib/cn';

interface RingMarkProps {
  tone?: 'colour' | 'white';
  /** Position, size and opacity (e.g. "right-[-8%] top-0 w-[60vw] opacity-10"). */
  className?: string;
}

export function RingMark({ tone = 'white', className }: RingMarkProps) {
  const mark = logos.mark;
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute select-none', className)}>
      <Image
        src={mark[tone === 'white' ? 'white' : 'colour']}
        alt=""
        width={mark.width}
        height={mark.height}
        unoptimized
        className="size-full"
      />
    </span>
  );
}
