/**
 * "Why Openavii" tests (Prompt §3.2)
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { photos } from '@/content/photos';
import { reasons, whySection } from '@/content/why';
import { renderWithProviders } from '@/test/render';
import { Why } from './Why';

describe('Why', () => {
  it('is the "why" section on the brand band with ghost numeral 05', () => {
    const { container } = renderWithProviders(<Why />);
    const section = container.querySelector('section#why');
    expect(section).toHaveAttribute('data-surface', 'brand');
    expect(section?.querySelector('[data-ghost-numeral]')).toHaveTextContent('05');
  });

  it('asks "Why Choose Openavii?" with the brand name in the accent', () => {
    renderWithProviders(<Why />);
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('Why Choose Openavii?');
    expect(h2.querySelector('[data-accent]')).toHaveTextContent('Openavii?');
  });

  it('gives six reasons, verbatim, each with a thin-line icon', () => {
    const { container } = renderWithProviders(<Why />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(6);
    reasons.forEach((reason, i) => {
      expect(within(items[i]).getByRole('heading', { level: 3, name: reason.title })).toBeInTheDocument();
      expect(within(items[i]).getByText(reason.description)).toBeInTheDocument();
    });
    expect(container.querySelectorAll('li svg[aria-hidden="true"]')).toHaveLength(6);
  });

  it('closes on the pull-statement and a photograph', () => {
    renderWithProviders(<Why />);
    expect(screen.getByText(whySection.pullStatement)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: photos['office-win'].alt })).toBeInTheDocument();
  });
});
