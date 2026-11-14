/**
 * ThemeToggle tests
 * Switches light and dark, announces the action, and never shows a skeleton:
 * both icons are in the markup and CSS shows the right one.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/context';
import { installMatchMedia } from '@/test/utils';
import { ThemeToggle } from './ThemeToggle';

const setup = () =>
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );

describe('ThemeToggle', () => {
  it('offers to switch to dark from the light theme, and persists the choice', async () => {
    installMatchMedia({ dark: false });
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('openavii-theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('starts in the visitor\'s system theme', () => {
    installMatchMedia({ dark: true });
    setup();
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('has both icons in the markup, hidden from assistive technology, and no skeleton', () => {
    setup();
    const button = screen.getByRole('button');
    const icons = button.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
    for (const icon of icons) expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(button).not.toBeDisabled();
    expect(button.querySelector('[class*="animate-pulse"]')).toBeNull();
  });

  it('is at least 44 px square (touch target)', () => {
    setup();
    const { className } = screen.getByRole('button');
    expect(className).toMatch(/size-11|h-11/);
  });
});
