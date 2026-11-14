/**
 * CurveDivider tests
 * Concave, convex and swoosh arcs painted in the neighbouring section's flat
 * colour, so the join between surfaces is a curve, not a hard line.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { CurveDivider } from './CurveDivider';

const path = (container: HTMLElement) => container.querySelector('path')?.getAttribute('d');

describe('CurveDivider', () => {
  it('is decorative: hidden from assistive technology and unfocusable', () => {
    const { container } = render(<CurveDivider tone="alt" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('stretches to the full width of the section', () => {
    const { container } = render(<CurveDivider tone="page" />);
    expect(container.querySelector('svg')).toHaveAttribute('preserveAspectRatio', 'none');
  });

  it('draws a different arc for each variant', () => {
    const concave = path(render(<CurveDivider tone="page" variant="concave" />).container);
    const convex = path(render(<CurveDivider tone="page" variant="convex" />).container);
    const swoosh = path(render(<CurveDivider tone="page" variant="swoosh" />).container);
    expect(new Set([concave, convex, swoosh]).size).toBe(3);
  });

  it("is filled with the neighbour's colour through theme-level tokens, never the local surface", () => {
    const fills = {
      page: 'text-theme-page',
      alt: 'text-theme-alt',
      dark: 'text-depth',
    } as const;
    for (const [tone, cls] of Object.entries(fills)) {
      const { container, unmount } = render(<CurveDivider tone={tone as keyof typeof fills} />);
      expect(container.querySelector('svg')?.getAttribute('class')).toContain(cls);
      unmount();
    }
  });

  it('flips vertically at the top edge of a section', () => {
    const top = render(<CurveDivider tone="page" edge="top" />).container.querySelector('svg');
    const bottom = render(<CurveDivider tone="page" edge="bottom" />).container.querySelector('svg');
    expect(top?.getAttribute('class')).toContain('top-0');
    expect(top?.getAttribute('class')).toContain('-scale-y-100');
    expect(bottom?.getAttribute('class')).toContain('bottom-0');
    expect(bottom?.getAttribute('class')).not.toContain('-scale-y-100');
  });
});
