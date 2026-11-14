/**
 * "Who We Are" tests (Prompt §3.2)
 * The Profile's story, the name explained (Open / avi / i) around the approved
 * mark, vision-mission-purpose, values, promise and principles.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { about } from '@/content/about';
import { photos } from '@/content/photos';
import { principles, strategy, values } from '@/content/values';
import { renderWithProviders } from '@/test/render';
import { WhoWeAre } from './WhoWeAre';

describe('WhoWeAre', () => {
  it('is the "who-we-are" section on the alt surface with ghost numeral 01', () => {
    const { container } = renderWithProviders(<WhoWeAre />);
    const section = container.querySelector('section#who-we-are');
    expect(section).not.toHaveAttribute('data-surface');
    const numeral = section?.querySelector('[data-ghost-numeral]');
    expect(numeral).toHaveTextContent('01');
    expect(numeral).toHaveAttribute('aria-hidden', 'true');
  });

  it('headlines the belief and tells the story in the Profile\'s own paragraphs', () => {
    renderWithProviders(<WhoWeAre />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(about.heading);
    for (const paragraph of about.paragraphs) expect(screen.getByText(paragraph)).toBeInTheDocument();
    expect(screen.getByText(strategy.differentiator)).toBeInTheDocument();
    expect(screen.getByText(about.callout.title)).toBeInTheDocument();
    expect(screen.getByText(about.callout.text)).toBeInTheDocument();
  });

  it('shows the photograph with factual alt text', () => {
    renderWithProviders(<WhoWeAre />);
    expect(screen.getByRole('img', { name: photos['home-laptop'].alt })).toBeInTheDocument();
  });

  it('explains the name: the mark, three captions and the ring footnote', () => {
    renderWithProviders(<WhoWeAre />);
    const group = screen.getByRole('group', { name: about.nameHeading });
    for (const part of about.nameMeaning) {
      expect(within(group).getByText(part.term)).toBeInTheDocument();
      expect(within(group).getByText(part.gloss)).toBeInTheDocument();
    }
    expect(within(group).getByText(about.ringFootnote)).toBeInTheDocument();
    // The mark is the approved artwork, shown unaltered and decorative here (the captions say it all).
    const mark = group.querySelector('img') as HTMLImageElement;
    expect(decodeURIComponent(mark.getAttribute('src') ?? '')).toContain('openavii-mark.png');
    expect(mark).toHaveAttribute('alt', '');
  });

  it('states vision, mission and purpose; the vision is labelled as a vision', () => {
    renderWithProviders(<WhoWeAre />);
    for (const key of ['vision', 'mission', 'purpose'] as const) {
      expect(screen.getByText(strategy[key].label)).toBeInTheDocument();
      expect(screen.getByText(strategy[key].text)).toBeInTheDocument();
    }
    expect(strategy.vision.label).toBe('Our vision');
  });

  it('lists the six values as chips, the promise, and the three principles', () => {
    renderWithProviders(<WhoWeAre />);
    const list = screen.getByRole('list', { name: 'Our values' });
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual(values.map((v) => v.name));
    expect(screen.getByText(strategy.promise)).toBeInTheDocument();
    for (const principle of principles) {
      expect(screen.getByRole('heading', { level: 3, name: principle.title })).toBeInTheDocument();
      expect(screen.getByText(principle.text)).toBeInTheDocument();
    }
  });
});
