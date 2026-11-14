/**
 * Home page integration tests (Prompt §7)
 * The whole page assembled: sections in order, a single H1 and a sound heading
 * hierarchy, honest alt text, every in-page anchor landing somewhere, unique
 * ids, no axe violations in light and dark, the skip link first in tab order,
 * and exactly one eagerly-loaded photograph (the LCP hero image).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { sectionIds, site } from '@/content/site';
import { services } from '@/content/services';
import { axe } from '@/test/axe';
import { renderWithProviders } from '@/test/render';
import { installMatchMedia } from '@/test/utils';
import Home from './page';

const renderHome = () => renderWithProviders(<Home />);

describe('Home page', () => {
  it('renders every section, in page order', () => {
    const { container } = renderHome();
    const ids = [...container.querySelectorAll('main > section')].map((s) => s.id);
    expect(ids).toEqual([...sectionIds]);
  });

  it('has the four landmarks, each once', () => {
    renderHome();
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('has exactly one <h1>, the campaign line', () => {
    renderHome();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('The Right Technology Changes Everything.');
  });

  it('keeps headings in a sound order: never skips a level going deeper', () => {
    const { container } = renderHome();
    const levels = [...container.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => Number(h.tagName[1]));
    expect(levels[0]).toBe(1);
    levels.forEach((level, i) => {
      if (i > 0) expect(level, `heading ${i} jumps from h${levels[i - 1]} to h${level}`).toBeLessThanOrEqual(levels[i - 1] + 1);
    });
  });

  it('gives every image alt text; empty alt only for decorative images hidden from assistive tech', () => {
    const { container } = renderHome();
    const images = [...container.querySelectorAll('img')];
    expect(images.length).toBeGreaterThan(10);
    for (const img of images) {
      expect(img.hasAttribute('alt'), `${img.getAttribute('src')} has no alt`).toBe(true);
      if (img.getAttribute('alt') === '') {
        expect(img.closest('[aria-hidden="true"]'), `${img.getAttribute('src')} is empty-alt but not decorative`).not.toBeNull();
      }
    }
  });

  it('has unique ids across the page', () => {
    const { container } = renderHome();
    const ids = [...container.querySelectorAll('[id]')].map((el) => el.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });

  it('lands every in-page link on an element that exists (nav, footer, service links, problem cards)', () => {
    const { container } = renderHome();
    const hrefs = [...container.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href') as string);
    // Not vacuous: nav (6) + footer nav (6) + 15 services + problem cards + CTAs = 38 today.
    expect(hrefs.length).toBeGreaterThanOrEqual(30);
    const missing = [...new Set(hrefs)].filter((href) => href !== '#' && !container.querySelector(href));
    expect(missing).toEqual([]);
  });

  it('gives every service an anchor tile, and every nav link a section', () => {
    const { container } = renderHome();
    for (const service of services) expect(container.querySelector(`#service-${service.slug}`)).not.toBeNull();
    for (const item of site.nav) expect(container.querySelector(item.href)).not.toBeNull();
    expect(container.querySelector('#addons')).not.toBeNull();
    expect(container.querySelector('main#main')).not.toBeNull();
  });

  it('puts the skip link first in the tab order', async () => {
    renderHome();
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveFocus();
  });

  it('loads exactly one photograph eagerly: the hero (the LCP element)', () => {
    const { container } = renderHome();
    const photos = [...container.querySelectorAll('img')].filter((i) => (i.getAttribute('src') ?? '').includes('/brand/photo/') || decodeURIComponent(i.getAttribute('src') ?? '').includes('/brand/photo/'));
    expect(photos.length).toBeGreaterThanOrEqual(9);
    const eager = photos.filter((i) => i.getAttribute('loading') !== 'lazy');
    expect(eager).toHaveLength(1);
    expect(eager[0].getAttribute('alt')).toMatch(/evening train/);
  });

  it('has no axe violations in the light theme', async () => {
    installMatchMedia({ dark: false });
    const { container } = renderHome();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations in the dark theme', async () => {
    installMatchMedia({ dark: true });
    const { container } = renderHome();
    expect(document.documentElement).toHaveClass('dark');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps the old template out: no slideshow, "coming soon" or unverified claims', () => {
    renderHome();
    for (const text of [/coming soon/i, /available for new projects/i, /secure payment/i, /free support/i, /lightning/i]) {
      expect(screen.queryByText(text)).toBeNull();
    }
  });
});
