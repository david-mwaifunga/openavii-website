/**
 * Section tests
 * The page-rhythm wrapper: id, accessible name, colour surface scope, ghost
 * numeral and curved edges. `page` and `alt` follow the theme; `dark` and
 * `brand` are fixed brand surfaces that scope their own semantic tokens.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from './Section';

describe('Section', () => {
  it('renders a labelled landmark with the given id', () => {
    render(
      <Section id="services" surface="brand" labelledBy="services-heading">
        <h2 id="services-heading">What we do</h2>
      </Section>,
    );
    const region = screen.getByRole('region', { name: 'What we do' });
    expect(region).toHaveAttribute('id', 'services');
  });

  it.each([
    ['dark', 'dark'],
    ['brand', 'brand'],
  ] as const)('scopes the %s surface tokens with data-surface', (surface, expected) => {
    const { container } = render(<Section id="x" surface={surface} />);
    expect(container.firstElementChild).toHaveAttribute('data-surface', expected);
  });

  it.each(['page', 'alt'] as const)('lets the %s surface follow the theme (no data-surface)', (surface) => {
    const { container } = render(<Section id="x" surface={surface} />);
    expect(container.firstElementChild).not.toHaveAttribute('data-surface');
  });

  it('uses theme-aware background tokens for page and alt', () => {
    const page = render(<Section id="p" surface="page" />).container.firstElementChild as HTMLElement;
    const alt = render(<Section id="a" surface="alt" />).container.firstElementChild as HTMLElement;
    expect(page.className).toContain('bg-page');
    expect(alt.className).toContain('bg-alt');
  });

  it('clips ghost numerals and curves so nothing can cause horizontal scroll', () => {
    const { container } = render(<Section id="x" surface="page" />);
    expect(container.firstElementChild?.className).toContain('section-clip');
  });

  it('shows a ghost numeral that is decorative only', () => {
    const { container } = render(<Section id="x" surface="alt" numeral="03" />);
    const numeral = container.querySelector('[data-ghost-numeral]');
    expect(numeral).toHaveTextContent('03');
    expect(numeral).toHaveAttribute('aria-hidden', 'true');
  });

  it('paints curved edges in the neighbouring section colour', () => {
    const { container } = render(
      <Section
        id="x"
        surface="brand"
        topCurve={{ tone: 'alt', variant: 'concave' }}
        bottomCurve={{ tone: 'page', variant: 'convex' }}
      />,
    );
    expect(container.querySelectorAll('svg[aria-hidden="true"]').length).toBeGreaterThanOrEqual(2);
  });

  it('pads sections with the fluid section spacing token', () => {
    const { container } = render(<Section id="x" surface="page" />);
    expect(container.firstElementChild?.className).toContain('py-section');
  });
});
