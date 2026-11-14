/**
 * CurveDivider
 * Concave, convex and "swoosh" arcs between sections (brand device: curved-edge
 * panels). The arc is painted in the neighbouring section's flat colour using
 * the theme-level tokens (`--theme-page`, `--theme-alt`), which dark and brand
 * surfaces never redefine - so the join matches whatever theme is active.
 * Decorative only.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { cn } from '@/lib/cn';

export type CurveVariant = 'concave' | 'convex' | 'swoosh';
export type CurveTone = 'page' | 'alt' | 'dark';

/** The filled area is the NEXT section: below each curve. 1440 x 96 viewBox. */
const PATHS: Record<CurveVariant, string> = {
  concave: 'M0 96 L0 62 Q720 -34 1440 62 L1440 96 Z',
  convex: 'M0 96 L0 18 Q720 114 1440 18 L1440 96 Z',
  swoosh: 'M0 96 L0 64 C380 8 880 132 1440 22 L1440 96 Z',
};

const TONES: Record<CurveTone, string> = {
  page: 'text-theme-page',
  alt: 'text-theme-alt',
  dark: 'text-depth',
};

interface CurveDividerProps {
  /** Colour of the neighbouring section the curve is painted in. */
  tone: CurveTone;
  variant?: CurveVariant;
  /** Which edge of its section the curve sits on. */
  edge?: 'top' | 'bottom';
  className?: string;
}

export function CurveDivider({ tone, variant = 'concave', edge = 'bottom', className }: CurveDividerProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      className={cn(
        'pointer-events-none absolute inset-x-0 z-[1] block h-10 w-full sm:h-14 xl:h-24',
        edge === 'top' ? 'top-0 -scale-y-100' : 'bottom-0',
        TONES[tone],
        className,
      )}
    >
      <path d={PATHS[variant]} fill="currentColor" />
    </svg>
  );
}
