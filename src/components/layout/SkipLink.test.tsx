/**
 * SkipLink tests
 * First focusable element on the page; jumps to <main id="main">.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('is the first thing a keyboard user reaches', async () => {
    render(
      <>
        <SkipLink />
        <a href="#a">Another link</a>
        <button>Button</button>
      </>,
    );
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveFocus();
  });

  it('points at the main landmark', () => {
    render(<SkipLink />);
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main');
  });

  it('is visually hidden until focused', () => {
    render(<SkipLink />);
    const { className } = screen.getByRole('link');
    expect(className).toContain('sr-only');
    expect(className).toContain('focus:not-sr-only');
  });
});
