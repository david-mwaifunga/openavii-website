/**
 * ShapedPhoto and ShapeDefs
 * Photographs framed in the six approved "Layout Shapes" (brand guideline
 * slide 37) or the chamfered frame (one cut corner). The shapes are traced
 * into SVG clip paths (clipPathUnits="objectBoundingBox"), defined once by
 * <ShapeDefs /> and referenced with `clip-path: url(#shape-N)`. Unlike a
 * mask-image this needs no extra request, so it is safe on the LCP photo.
 *
 * Photography direction: African professionals in everyday digital life; pair
 * with a navy scrim on the text side so type is always legible.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import Image from 'next/image';
import { photos, type PhotoId } from '@/content/photos';
import { cn } from '@/lib/cn';
import { SHAPES, type ShapeId } from './shapePaths';

/** Hidden SVG holding the six clip paths. Render once per page. */
export function ShapeDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {Object.entries(SHAPES).map(([id, shape]) => (
          <clipPath key={id} id={id} clipPathUnits="objectBoundingBox">
            <path d={shape.path} />
          </clipPath>
        ))}
      </defs>
    </svg>
  );
}

/** One cut corner (top right), the brand's chamfered photo frame. */
const CHAMFER = 'polygon(0 0, calc(100% - 2.75rem) 0, 100% 2.75rem, 100% 100%, 0 100%)';

const SCRIMS = {
  left: 'bg-linear-to-r from-scrim via-scrim/50 to-transparent',
  bottom: 'bg-linear-to-t from-scrim via-scrim/40 to-transparent',
} as const;

interface ShapedPhotoProps {
  photo: PhotoId;
  shape: ShapeId | 'chamfer';
  /** Responsive `sizes` hint, so the browser fetches no more than it shows. */
  sizes: string;
  /** Preload this image. Use for exactly one image: the LCP hero photo. */
  preload?: boolean;
  /** Navy scrim over the photo on the text side. */
  scrim?: 'left' | 'bottom' | 'none';
  /** Decorative photograph: empty alt text. */
  decorative?: boolean;
  /** CSS object-position, to keep the subject in frame. */
  objectPosition?: string;
  className?: string;
}

export function ShapedPhoto({
  photo,
  shape,
  sizes,
  preload = false,
  scrim = 'none',
  decorative = false,
  objectPosition,
  className,
}: ShapedPhotoProps) {
  const image = photos[photo];
  const isChamfer = shape === 'chamfer';
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        clipPath: isChamfer ? CHAMFER : `url(#${shape})`,
        // Shapes keep their native proportions, so their curves look as designed.
        aspectRatio: isChamfer ? `${image.width} / ${image.height}` : `${SHAPES[shape].aspect} / 1`,
      }}
    >
      <Image
        src={image.src}
        alt={decorative ? '' : image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        preload={preload}
        className="absolute inset-0 size-full object-cover"
        style={objectPosition ? { objectPosition } : undefined}
      />
      {scrim !== 'none' && (
        <div data-scrim={scrim} aria-hidden="true" className={cn('absolute inset-0', SCRIMS[scrim])} />
      )}
    </div>
  );
}
