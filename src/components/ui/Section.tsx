/**
 * Section
 * The page-rhythm wrapper. It sets the section's id and accessible name, its
 * colour surface, an optional ghost numeral and optional curved edges.
 *
 * Surfaces: `page` and `alt` follow the theme (light or dark); `dark` and
 * `brand` are fixed brand surfaces that scope their own semantic tokens with
 * `data-surface`, so any component inside is automatically correct on them.
 * Rhythm rule: never two adjacent sections with the same surface.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CurveDivider, type CurveTone, type CurveVariant } from './CurveDivider';
import { GhostNumeral } from './GhostNumeral';

export type Surface = 'page' | 'alt' | 'dark' | 'brand';

interface CurveSpec {
  /** Colour of the neighbouring section. */
  tone: CurveTone;
  variant?: CurveVariant;
}

interface SectionProps {
  id: string;
  surface: Surface;
  /** id of the heading that names this section. */
  labelledBy?: string;
  /** Ghost numeral shown behind the headline (chapter-divider device). */
  numeral?: string;
  numeralAlign?: 'left' | 'right';
  topCurve?: CurveSpec;
  bottomCurve?: CurveSpec;
  className?: string;
  children?: ReactNode;
}

const SURFACE_CLASS: Record<Surface, string> = {
  page: 'bg-page text-fg',
  alt: 'bg-alt text-fg',
  // dark and brand backgrounds come from [data-surface] in globals.css
  dark: '',
  brand: '',
};

export function Section({
  id,
  surface,
  labelledBy,
  numeral,
  numeralAlign,
  topCurve,
  bottomCurve,
  className,
  children,
}: SectionProps) {
  const fixed = surface === 'dark' || surface === 'brand';
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-surface={fixed ? surface : undefined}
      className={cn('section-clip py-section', SURFACE_CLASS[surface], className)}
    >
      {topCurve && <CurveDivider edge="top" {...topCurve} />}
      {numeral && <GhostNumeral value={numeral} align={numeralAlign} />}
      {children}
      {bottomCurve && <CurveDivider edge="bottom" {...bottomCurve} />}
    </section>
  );
}
