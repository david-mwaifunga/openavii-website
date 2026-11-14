/**
 * Harness smoke test
 * Proves the test toolchain itself: jsdom, the React plugin, jest-dom and
 * vitest-axe matchers, the `@/` alias and the matchMedia stub. If this file
 * is red, nothing else in the suite can be trusted.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from '@/test/axe';
import { installIntersectionObserver, installMatchMedia } from '@/test/utils';

describe('test harness', () => {
  it('renders React into jsdom and queries it with jest-dom matchers', () => {
    render(<h1>Illuminating Your Digital Journey</h1>);
    expect(
      screen.getByRole('heading', { name: 'Illuminating Your Digital Journey' }),
    ).toBeInTheDocument();
  });

  it('runs axe with the vitest-axe matcher', async () => {
    const { container } = render(
      <main>
        <h1>Title</h1>
      </main>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('reports real axe violations (the matcher is not a no-op)', async () => {
    // Built through the DOM, not JSX: the lint rules rightly reject this markup.
    const host = document.createElement('div');
    host.innerHTML = '<img src="/x.png">';
    document.body.appendChild(host);
    const results = await axe(host);
    expect(results.violations.map((v) => v.id)).toContain('image-alt');
    host.remove();
  });

  it('controls prefers-color-scheme through the matchMedia stub', () => {
    const media = installMatchMedia({ dark: false });
    expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(false);
    media.setDark(true);
    expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(true);
  });

  it('records the options an IntersectionObserver was created with, so a test can say when a reveal fires', () => {
    const io = installIntersectionObserver();
    const element = document.createElement('div');
    new IntersectionObserver(() => {}, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }).observe(element);
    expect(io.optionsFor(element)).toEqual({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
    expect(io.optionsFor(document.createElement('p'))).toBeUndefined();
  });

  it('controls the xl breakpoint through the matchMedia stub and tells only that query\'s listeners', () => {
    const media = installMatchMedia({ wide: false });
    const wide = window.matchMedia('(min-width: 80rem)');
    const dark = window.matchMedia('(prefers-color-scheme: dark)');
    const heardWide: boolean[] = [];
    const heardDark: boolean[] = [];
    wide.addEventListener('change', (event) => heardWide.push((event as MediaQueryListEvent).matches));
    dark.addEventListener('change', (event) => heardDark.push((event as MediaQueryListEvent).matches));
    expect(wide.matches).toBe(false);
    media.setWide(true);
    expect(wide.matches).toBe(true);
    expect(heardWide).toEqual([true]);
    expect(heardDark).toEqual([]);
    media.setWide(false);
    expect(heardWide).toEqual([true, false]);
  });
});
