/**
 * IconRing
 * A thin-line icon inside a ring with the Mark's notch (an open ring: "nothing
 * is hidden"). The ring is a circle with pathLength 100 whose dash offset
 * leaves an 8 % gap (see .ring-path in globals.css); when the surrounding tile
 * is hovered or focused the ring draws itself open again. Decorative.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { IconName } from '@/content/icons';
import { Icon } from './Icon';

interface IconRingProps {
  icon: IconName;
  className?: string;
}

export function IconRing({ icon, className }: IconRingProps) {
  return (
    <span aria-hidden="true" className={`relative grid size-14 place-items-center ${className ?? ''}`}>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 56 56"
        className="absolute inset-0 size-full -rotate-[135deg]"
      >
        <circle
          className="ring-path"
          cx="28"
          cy="28"
          r="26.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength="100"
        />
      </svg>
      <Icon name={icon} size={26} />
    </span>
  );
}
