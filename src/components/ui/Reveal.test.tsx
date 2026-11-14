/**
 * Reveal tests (Prompt §4.5)
 * Scroll reveals fire once, then the content stays put. The hidden start state
 * is a CSS rule gated behind the .js class (see tokens.test.ts), so markup
 * itself never hides content.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { installIntersectionObserver } from '@/test/utils';
import { Reveal } from './Reveal';

describe('Reveal', () => {
  it('starts un-revealed and reveals when it scrolls into view', () => {
    const io = installIntersectionObserver();
    render(<Reveal>Hello</Reveal>);
    const el = screen.getByText('Hello');
    expect(el).toHaveClass('scroll-animate');
    expect(el).not.toHaveClass('is-visible');
    act(() => io.trigger(el, true));
    expect(el).toHaveClass('is-visible');
  });

  it('reveals only once: leaving the viewport never hides it again', () => {
    const io = installIntersectionObserver();
    render(<Reveal>Stay</Reveal>);
    const el = screen.getByText('Stay');
    act(() => io.trigger(el, true));
    act(() => io.trigger(el, false));
    expect(el).toHaveClass('is-visible');
  });

  it('shows the content immediately where IntersectionObserver does not exist', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<Reveal>Fallback</Reveal>);
    // The hook defers the state update with a microtask.
    await act(async () => {});
    expect(screen.getByText('Fallback')).toHaveClass('is-visible');
    vi.unstubAllGlobals();
  });

  it('supports directional variants and a stagger delay through CSS variables', () => {
    installIntersectionObserver();
    render(
      <Reveal variant="left" delay={160}>
        Slide
      </Reveal>,
    );
    const el = screen.getByText('Slide');
    expect(el).toHaveAttribute('data-reveal', 'left');
    expect(el.style.getPropertyValue('--reveal-delay')).toBe('160ms');
  });

  it('renders the element it is asked to (for valid list and article markup)', () => {
    installIntersectionObserver();
    render(
      <ul>
        <Reveal as="li">Item</Reveal>
      </ul>,
    );
    expect(screen.getByRole('listitem')).toHaveTextContent('Item');
  });

  it('passes through class names', () => {
    installIntersectionObserver();
    render(<Reveal className="grid gap-4">Grid</Reveal>);
    expect(screen.getByText('Grid')).toHaveClass('grid', 'gap-4', 'scroll-animate');
  });
});
