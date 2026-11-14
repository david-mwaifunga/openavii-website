/**
 * Logo
 * Approved 2026 artwork only - never redrawn, recoloured, stretched, shadowed
 * or separated (brand guideline slide 29). Both the colour and the all-white
 * version are in the markup and CSS chooses between them (see .logo-on-light /
 * .logo-on-dark in globals.css), so there is no skeleton, flash or layout shift.
 *
 * Guideline rules enforced here:
 *   - minimum width 120 px (enforced with an inline min-width, even when the
 *     size comes from a class)
 *   - clear space of one third of the logo height on every side (`clearSpace`,
 *     which needs an explicit `width` to compute it)
 *   - true proportions (height: auto; intrinsic width/height from the artwork)
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import Image from 'next/image';
import { logos, type LogoVariant } from '@/content/photos';
import { cn } from '@/lib/cn';

interface LogoProps {
  /** `full` (ring + wordmark), `extended` (with tagline) or `mark` (ring only). */
  variant?: LogoVariant;
  /** `auto` shows colour on light surfaces and white on dark ones, by CSS. */
  tone?: 'auto' | 'colour' | 'white';
  /** Rendered width in px (raised to the 120 px minimum). Omit to size with a class. */
  width?: number;
  /** Add the guideline's clear space (needs `width`). */
  clearSpace?: boolean;
  /** Empty alt text, for a logo that repeats adjacent text. */
  decorative?: boolean;
  /** Classes for the image(s): size them here when `width` is not given. */
  className?: string;
}

export function Logo({
  variant = 'full',
  tone = 'auto',
  width,
  clearSpace = false,
  decorative = false,
  className,
}: LogoProps) {
  const logo = logos[variant];
  const rendered = width === undefined ? undefined : Math.max(width, logo.minWidth);
  const padding =
    clearSpace && rendered !== undefined ? (rendered * (logo.height / logo.width)) / 3 : undefined;

  const image = (src: string, toneClass?: string) => (
    <Image
      key={src}
      src={src}
      alt={decorative ? '' : logo.alt}
      width={logo.width}
      height={logo.height}
      unoptimized
      loading="eager"
      className={cn(toneClass, className)}
      style={{
        width: rendered === undefined ? undefined : `${rendered}px`,
        minWidth: `${logo.minWidth}px`,
        height: 'auto',
      }}
    />
  );

  return (
    <span
      className="inline-block align-middle"
      style={padding === undefined ? undefined : { padding: `${padding}px` }}
    >
      {tone === 'auto' && (
        <>
          {image(logo.colour, 'logo-on-light')}
          {image(logo.white, 'logo-on-dark')}
        </>
      )}
      {tone === 'colour' && image(logo.colour)}
      {tone === 'white' && image(logo.white)}
    </span>
  );
}
