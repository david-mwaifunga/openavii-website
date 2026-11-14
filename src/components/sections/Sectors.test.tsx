/**
 * "Who We Serve" tests (Prompt §3.2)
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { photos } from '@/content/photos';
import { sectors, sectorsSection } from '@/content/sectors';
import { renderWithProviders } from '@/test/render';
import { Sectors } from './Sectors';

describe('Sectors', () => {
  it('is the "sectors" section on the alt surface with ghost numeral 04', () => {
    const { container } = renderWithProviders(<Sectors />);
    const section = container.querySelector('section#sectors');
    expect(section).not.toHaveAttribute('data-surface');
    expect(section?.querySelector('[data-ghost-numeral]')).toHaveTextContent('04');
  });

  it('introduces the section with the Profile\'s own words', () => {
    renderWithProviders(<Sectors />);
    expect(screen.getByRole('heading', { level: 2, name: sectorsSection.heading })).toBeInTheDocument();
    expect(screen.getByText(sectorsSection.intro)).toBeInTheDocument();
    expect(screen.getByText(sectorsSection.closing)).toBeInTheDocument();
  });

  it('shows seven sector cards with title and description', () => {
    renderWithProviders(<Sectors />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(7);
    sectors.forEach((sector, i) => {
      expect(within(cards[i]).getByRole('heading', { level: 3, name: sector.title })).toBeInTheDocument();
      expect(within(cards[i]).getByText(sector.description)).toBeInTheDocument();
    });
  });

  it('anchors the grid with two chamfered photographs', () => {
    renderWithProviders(<Sectors />);
    for (const id of ['field-tablet', 'greenhouse-smile'] as const) {
      expect(screen.getByRole('img', { name: photos[id].alt })).toBeInTheDocument();
    }
  });
});
