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
import { installMatchMedia } from '@/test/utils';

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
});
