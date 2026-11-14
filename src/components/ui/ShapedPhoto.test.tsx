/**
 * ShapedPhoto and ShapeDefs tests
 * Photographs are framed in the six approved "Layout Shapes", traced into SVG
 * clip paths. The clip paths are inline (no mask-image request on the LCP
 * photo) and decorative framing never hides the photo's alt text.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { photos } from '@/content/photos';
import { SHAPES } from './shapePaths';
import { ShapeDefs, ShapedPhoto } from './ShapedPhoto';

describe('ShapeDefs', () => {
  it('defines all six shapes as bounding-box clip paths, hidden from assistive tech', () => {
    const { container } = render(<ShapeDefs />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    const clips = container.querySelectorAll('clipPath');
    expect([...clips].map((c) => c.id)).toEqual(Object.keys(SHAPES));
    for (const clip of clips) {
      expect(clip).toHaveAttribute('clipPathUnits', 'objectBoundingBox');
      expect(clip.querySelector('path')?.getAttribute('d')).toBe(SHAPES[clip.id as keyof typeof SHAPES].path);
    }
  });

  it('takes no layout space (an SVG with display:none would break clip-path in some browsers)', () => {
    const { container } = render(<ShapeDefs />);
    const svg = container.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('width')).toBe('0');
    expect(svg.getAttribute('height')).toBe('0');
    expect(svg.style.position).toBe('absolute');
  });
});

describe('ShapedPhoto', () => {
  it('shows the photograph with its factual alt text', () => {
    render(<ShapedPhoto photo="commuter-laptop" shape="shape-1" sizes="50vw" />);
    expect(screen.getByRole('img', { name: photos['commuter-laptop'].alt })).toBeInTheDocument();
  });

  it('clips the frame to the chosen brand shape and uses its native proportions', () => {
    const { container } = render(<ShapedPhoto photo="home-laptop" shape="shape-3" sizes="50vw" />);
    const frame = container.firstElementChild as HTMLElement;
    // jsdom normalises url(#x) to url("#x"); both are the same CSS.
    expect(frame.style.clipPath).toMatch(/^url\(["']?#shape-3["']?\)$/);
    expect(frame.style.aspectRatio.replace(/\s/g, '')).toBe(`${SHAPES['shape-3'].aspect}/1`);
  });

  it('offers the chamfered frame (one cut corner) without any SVG dependency', () => {
    const { container } = render(<ShapedPhoto photo="field-tablet" shape="chamfer" sizes="40vw" />);
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.style.clipPath).toMatch(/^polygon\(/);
  });

  it('can overlay a navy scrim on the text side', () => {
    const { container } = render(<ShapedPhoto photo="office-win" shape="shape-2" sizes="50vw" scrim="left" />);
    expect(container.querySelector('[data-scrim="left"]')).not.toBeNull();
  });

  it('keeps a decorative photograph out of the accessibility tree when asked', () => {
    const { container } = render(<ShapedPhoto photo="cafe-sunlight" shape="shape-5" sizes="50vw" decorative />);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).toHaveAttribute('alt', '');
  });

  it('reserves space with the real pixel size of the file', () => {
    const { container } = render(<ShapedPhoto photo="phone-coffee" shape="shape-6" sizes="33vw" />);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('width')).toBe(String(photos['phone-coffee'].width));
  });
});
