/**
 * Team and clients tests (Prompt §3.2)
 * Three leaders on cyan tiles with name and title only; a client strip naming
 * only the two documented clients, typographically.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { clients, clientsSection } from '@/content/clients';
import { team } from '@/content/team';
import { renderWithProviders } from '@/test/render';
import { Team } from './Team';

describe('Team', () => {
  it('is the "team" section on the page surface with ghost numeral 06', () => {
    const { container } = renderWithProviders(<Team />);
    const section = container.querySelector('section#team');
    expect(section).not.toHaveAttribute('data-surface');
    expect(section?.querySelector('[data-ghost-numeral]')).toHaveTextContent('06');
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('A Team Built on Expertise, Integrity and Execution.');
    expect(h2.querySelector('[data-accent]')).toHaveTextContent('Expertise, Integrity and Execution.');
  });

  it('shows the three leaders with their titles, nothing more', () => {
    renderWithProviders(<Team />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(3);
    team.forEach((person, i) => {
      expect(within(cards[i]).getByRole('heading', { level: 3, name: person.name })).toBeInTheDocument();
      expect(within(cards[i]).getByText(person.title)).toBeInTheDocument();
      expect(within(cards[i]).getByRole('img', { name: person.alt })).toBeInTheDocument();
      // No bio, no extra paragraphs: heading, title and photo only.
      expect(cards[i].querySelectorAll('p')).toHaveLength(1);
    });
  });

  it('sets each cut-out on a cyan tile, as the Company Profile does', () => {
    renderWithProviders(<Team />);
    for (const card of screen.getAllByRole('article')) {
      expect(card.querySelector('[data-tone="cyan"]')).not.toBeNull();
    }
  });

  it('labels the client strip and names only the two documented clients', () => {
    renderWithProviders(<Team />);
    expect(screen.getByRole('list', { name: clientsSection.label })).toBeInTheDocument();
    const items = within(screen.getByRole('list', { name: clientsSection.label })).getAllByRole('listitem');
    expect(items.map((li) => li.textContent)).toEqual(clients.map((c) => c.name));
    expect(items).toHaveLength(2);
  });
});
