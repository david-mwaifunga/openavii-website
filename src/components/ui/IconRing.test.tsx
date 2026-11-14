/**
 * IconRing tests
 * A thin-line icon inside the Mark's notched ring. Decorative: the tile's
 * title carries the meaning.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { IconRing } from './IconRing';

describe('IconRing', () => {
  it('draws a notched ring (pathLength 100, so CSS can open it) around the icon', () => {
    const { container } = render(<IconRing icon="Globe" />);
    const ring = container.querySelector('circle.ring-path') as SVGCircleElement;
    expect(ring).toHaveAttribute('pathLength', '100');
    expect(ring).toHaveAttribute('stroke', 'currentColor');
    expect(ring).toHaveAttribute('stroke-width', '1.5');
  });

  it('is entirely decorative', () => {
    const { container } = render(<IconRing icon="Database" />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    for (const svg of container.querySelectorAll('svg')) expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
