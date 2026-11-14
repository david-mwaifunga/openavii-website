/**
 * ThemeProvider tests
 * Contract (Prompt §6.2): initialises from storage/system with no flash, keeps
 * the `openavii-theme` key and the setTheme / toggleTheme / resolvedTheme API,
 * reacts to system changes only while the theme is "system", and never throws
 * when storage is unavailable.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';
import { installMatchMedia } from '@/test/utils';

const KEY = 'openavii-theme';

/** Surfaces the context value so tests can read and drive it. */
function Probe() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setTheme('system')}>use system</button>
      <button onClick={() => setTheme('light')}>use light</button>
    </div>
  );
}

const renderProbe = () =>
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
const html = () => document.documentElement;

describe('ThemeProvider', () => {
  it('tells the inline script that the app is alive, so its no-hydration safety net stands down', () => {
    expect(html()).not.toHaveAttribute('data-hydrated');
    renderProbe();
    expect(html()).toHaveAttribute('data-hydrated');
  });

  it('applies a stored dark theme to <html> immediately', () => {
    localStorage.setItem(KEY, 'dark');
    renderProbe();
    expect(html()).toHaveClass('dark');
    expect(html().style.colorScheme).toBe('dark');
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('defaults to "system" and follows a dark system preference', () => {
    installMatchMedia({ dark: true });
    renderProbe();
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(html()).toHaveClass('dark');
  });

  it('defaults to light when the system prefers light', () => {
    installMatchMedia({ dark: false });
    renderProbe();
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(html()).toHaveClass('light');
    expect(html()).not.toHaveClass('dark');
  });

  it('toggles the resolved theme and persists the choice to openavii-theme', async () => {
    installMatchMedia({ dark: false });
    renderProbe();
    await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(localStorage.getItem(KEY)).toBe('dark');
    expect(html()).toHaveClass('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');

    await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(localStorage.getItem(KEY)).toBe('light');
    expect(html()).toHaveClass('light');
    expect(html()).not.toHaveClass('dark');
  });

  it('toggling while following the system flips away from what is currently shown', async () => {
    installMatchMedia({ dark: true });
    renderProbe();
    await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('reacts to operating-system changes while the theme is "system"', () => {
    const media = installMatchMedia({ dark: false });
    renderProbe();
    expect(html()).toHaveClass('light');
    act(() => media.setDark(true));
    expect(html()).toHaveClass('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('ignores operating-system changes once a theme has been chosen explicitly', async () => {
    const media = installMatchMedia({ dark: false });
    renderProbe();
    await userEvent.click(screen.getByRole('button', { name: 'use light' }));
    act(() => media.setDark(true));
    expect(html()).toHaveClass('light');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
  });

  it('returns to following the system after setTheme("system")', async () => {
    const media = installMatchMedia({ dark: false });
    renderProbe();
    await userEvent.click(screen.getByRole('button', { name: 'use light' }));
    await userEvent.click(screen.getByRole('button', { name: 'use system' }));
    act(() => media.setDark(true));
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('eases colours briefly on toggle with the theme-transition class, then removes it', async () => {
    // Real timers: Testing Library only recognises Jest's fake timers, so faking the
    // clock under Vitest stalls its async helpers. The removal takes 300 ms.
    renderProbe();
    await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(html()).toHaveClass('theme-transition');
    await waitFor(() => expect(html()).not.toHaveClass('theme-transition'), { timeout: 1500 });
  });

  it('leaves no transition class or pending timer behind when unmounted mid-transition', async () => {
    const view = renderProbe();
    await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(html()).toHaveClass('theme-transition');
    view.unmount();
    expect(html()).not.toHaveClass('theme-transition');
    // A stale timer from the unmounted tree must not touch a later one's class.
    html().classList.add('theme-transition');
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(html()).toHaveClass('theme-transition');
  });

  it('keeps working when storage is blocked (the choice lives in memory)', async () => {
    installMatchMedia({ dark: false });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    renderProbe();
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(html()).toHaveClass('dark');
  });

  it('throws a clear error when useTheme is used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/within a ThemeProvider/);
  });
});
