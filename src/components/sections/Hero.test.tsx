/**
 * Hero tests (Prompt §3.2)
 * The campaign line as the one H1, a problem-first promise, two clear actions,
 * the four pillars, and an LCP-friendly photograph - with none of the old
 * template decoration.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hero } from '@/content/hero';
import { photos } from '@/content/photos';
import { renderWithProviders } from '@/test/render';
import { Hero } from './Hero';

describe('Hero', () => {
  it('is the home section on the dark brand surface, named by its H1', () => {
    const { container } = renderWithProviders(<Hero />);
    const section = container.querySelector('section#home');
    expect(section).toHaveAttribute('data-surface', 'dark');
    expect(screen.getByRole('region', { name: /The Right Technology/ })).toBe(section);
  });

  it('has the campaign line as its single H1 over two lines, the second in the accent colour', () => {
    renderWithProviders(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('The Right Technology Changes Everything.');
    const lines = h1.querySelectorAll('.hero-line');
    expect(lines).toHaveLength(2);
    expect(lines[1].querySelector('span')?.className).toContain('text-accent-text');
  });

  it('shows the eyebrow, the sub-line and the introduction', () => {
    renderWithProviders(<Hero />);
    expect(screen.getByText(hero.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(hero.sub)).toBeInTheDocument();
    expect(screen.getByText(hero.body)).toBeInTheDocument();
  });

  it('offers a quote (opening the enquiry dialog) and a way to the services', async () => {
    renderWithProviders(<Hero />);
    expect(screen.getByRole('link', { name: 'See What We Do' })).toHaveAttribute('href', '#services');
    await userEvent.click(screen.getByRole('button', { name: 'Get a Quote' }));
    expect(screen.getByRole('dialog', { name: 'Discuss Your Project' })).toBeInTheDocument();
  });

  it('lists the four pillars with their one-liners', () => {
    renderWithProviders(<Hero />);
    const pillars = screen.getByRole('list', { name: 'Our approach' });
    const items = within(pillars).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    hero.pillars.forEach((pillar, i) => {
      expect(items[i]).toHaveTextContent(pillar.title);
      expect(items[i]).toHaveTextContent(pillar.text);
    });
  });

  it('shows the hero photograph eagerly (it is the LCP element) with factual alt text', () => {
    renderWithProviders(<Hero />);
    const img = screen.getByRole('img', { name: photos['commuter-laptop'].alt });
    expect(img).not.toHaveAttribute('loading', 'lazy');
  });

  it('uses the wave artwork as a decorative background, not as a content image', () => {
    const { container } = renderWithProviders(<Hero />);
    const wave = container.querySelector('[data-wave]') as HTMLElement;
    expect(wave).toHaveAttribute('aria-hidden', 'true');
    expect(wave.className).toContain('wave-drift');
    expect(wave.style.backgroundImage).toContain('/brand/bg/wave-dark.webp');
  });

  it('keeps the ring watermark decorative, as a mask (so it can never be the LCP element)', () => {
    const { container } = renderWithProviders(<Hero />);
    const ring = container.querySelector('[style*="openavii-mark-white.png"]');
    expect(ring).not.toBeNull();
    expect(ring).toHaveAttribute('aria-hidden', 'true');
    expect([...container.querySelectorAll('img')].some((i) => (i.getAttribute('src') ?? '').includes('openavii-mark'))).toBe(false);
  });

  it('puts the headline across the full width and the actions in the first screen (headline before the actions in the DOM)', () => {
    const { container } = renderWithProviders(<Hero />);
    const h1 = container.querySelector('h1') as HTMLElement;
    const cta = screen.getByRole('button', { name: 'Get a Quote' });
    expect(h1.compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(h1.parentElement?.className).toContain('wrap');
  });

  it('has none of the old template decoration', () => {
    const { container } = renderWithProviders(<Hero />);
    expect(screen.queryByText(/available for new projects/i)).toBeNull();
    expect(container.querySelector('[class*="animate-bounce"], [class*="animate-pulse"], [class*="blur-"]')).toBeNull();
    expect(screen.queryByText(/captivate|pixel-perfect|lightning/i)).toBeNull();
  });
});
