/**
 * "Find the Fix" tests (Prompt §3.2)
 * Six problem-to-fix cards in the brand's own words, each linking to the
 * service tile that solves it, plus the "Explore Solutions" pull-quote.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { explore, problems, problemsSection } from '@/content/problems';
import { renderWithProviders } from '@/test/render';
import { ProblemBand } from './ProblemBand';

describe('ProblemBand', () => {
  it('is the "problems" section on the page surface, headed by the problem-first line', () => {
    const { container } = renderWithProviders(<ProblemBand />);
    expect(container.querySelector('section#problems')).not.toHaveAttribute('data-surface');
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('Your Business Has a Technology Problem.');
    expect(h2.querySelector('[data-accent]')).toHaveTextContent('Technology Problem.');
    expect(screen.getByText(problemsSection.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(problemsSection.lead)).toBeInTheDocument();
  });

  it('shows six cards with the creatives\' headline and body verbatim', () => {
    renderWithProviders(<ProblemBand />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(6);
    problems.forEach((problem, i) => {
      expect(within(cards[i]).getByRole('heading', { level: 3, name: problem.headline })).toBeInTheDocument();
      expect(within(cards[i]).getByText(problem.body)).toBeInTheDocument();
    });
  });

  it('links each card to the first service that solves it, labelled with the creative\'s call to action', () => {
    renderWithProviders(<ProblemBand />);
    const cards = screen.getAllByRole('article');
    problems.forEach((problem, i) => {
      const link = within(cards[i]).getByRole('link', { name: new RegExp(problem.cta) });
      expect(link).toHaveAttribute('href', `#service-${problem.targets[0]}`);
    });
  });

  it('records every related service on the card so related tiles can light up', () => {
    renderWithProviders(<ProblemBand />);
    const cards = screen.getAllByRole('article');
    problems.forEach((problem, i) => {
      expect(cards[i].getAttribute('data-targets')?.split(' ')).toEqual([...problem.targets]);
      expect(cards[i]).toHaveClass('problem-card', 'tile');
    });
  });

  it('closes with the Explore Solutions pull-quote pointing at How We Work', () => {
    renderWithProviders(<ProblemBand />);
    expect(screen.getByRole('heading', { level: 3, name: explore.headline })).toBeInTheDocument();
    expect(screen.getByText(explore.body)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: new RegExp(explore.cta) })).toHaveAttribute('href', '#approach');
  });
});
