/**
 * SectionHeader tests
 * Eyebrow + two-tone H2 + lead. The key words of a headline take the accent
 * colour; the decorative devices are hidden from assistive technology.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders the eyebrow, an <h2> and the lead', () => {
    render(<SectionHeader eyebrow="WHAT WE DO" heading="Built Around Your Business." lead="One accountable partner." />);
    expect(screen.getByText('WHAT WE DO')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Built Around Your Business.' })).toBeInTheDocument();
    expect(screen.getByText('One accountable partner.')).toBeInTheDocument();
  });

  it('sets the accent words of a two-tone heading apart, joined by a single space', () => {
    render(
      <SectionHeader heading={{ plain: 'Why Choose', accent: 'Openavii?' }} />,
    );
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Why Choose Openavii?');
    const accent = heading.querySelector('[data-accent]');
    expect(accent).toHaveTextContent('Openavii?');
    expect(accent?.className).toContain('text-accent-text');
  });

  it('renders a multi-line heading as separate lines, one accessible heading', () => {
    render(<SectionHeader heading={{ lines: ['Understand First.', 'Build Second.', 'Improve Continuously.'] }} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Understand First. Build Second. Improve Continuously.');
    expect(heading.querySelectorAll('[data-line]')).toHaveLength(3);
  });

  it('gives the heading an id so its section can be labelled by it', () => {
    render(<SectionHeader id="services-heading" heading="Built Around Your Business." />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'services-heading');
  });

  it('balances heading text and limits the lead to a readable measure', () => {
    render(<SectionHeader heading="A heading" lead="A lead" />);
    expect(screen.getByRole('heading', { level: 2 }).className).toContain('text-balance');
    expect(screen.getByText('A lead').className).toContain('max-w-');
  });

  it('can centre its content', () => {
    const { container } = render(<SectionHeader align="center" heading="Centred" />);
    expect((container.firstElementChild as HTMLElement).className).toContain('text-center');
  });
});
