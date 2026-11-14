/**
 * Header tests (Prompt §3.1, §4.6, §7)
 * Navigation from the content layer, a focus-managed full-screen menu below
 * the xl breakpoint, a transparent bar over the hero that turns solid on
 * scroll, and the primary "Get a Quote" action.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { act, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { site } from '@/content/site';
import { renderWithProviders } from '@/test/render';
import { installMatchMedia } from '@/test/utils';
import { Header } from './Header';

const scrollTo = (y: number) => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  act(() => {
    fireEvent.scroll(window);
  });
};

describe('Header', () => {
  it('is the page banner with a labelled primary navigation', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('links every navigation item to its section, from the content layer', () => {
    renderWithProviders(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    for (const item of site.nav) {
      expect(within(nav).getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
    }
  });

  it('links the logo home', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('link', { name: 'Openavii Technologies, home' })).toHaveAttribute('href', '#home');
  });

  it('is transparent over the hero (dark brand surface), then solid after scrolling', () => {
    scrollTo(0);
    renderWithProviders(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-surface', 'dark');
    scrollTo(160);
    expect(header).not.toHaveAttribute('data-surface');
    expect(header.className).toContain('bg-page');
    scrollTo(0);
    expect(header).toHaveAttribute('data-surface', 'dark');
  });

  it('opens a labelled menu with aria-expanded and aria-controls, and links inside it', async () => {
    renderWithProviders(<Header />);
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    expect(button.getAttribute('aria-controls')).toBe(dialog.id);
    for (const item of site.nav) {
      expect(within(dialog).getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
    }
  });

  it('closes the menu with Escape and returns focus to the menu button', async () => {
    renderWithProviders(<Header />);
    const button = screen.getByRole('button', { name: 'Menu' });
    await userEvent.click(button);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });

  it('closes the menu when a link is chosen', async () => {
    renderWithProviders(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    await userEvent.click(within(dialog).getByRole('link', { name: 'What We Do' }));
    expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull();
  });

  it('does not pull focus back to the menu button after a link is followed: the next Tab must continue from the section the link led to', async () => {
    renderWithProviders(<Header />);
    const button = screen.getByRole('button', { name: 'Menu' });
    await userEvent.click(button);
    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    await userEvent.click(within(dialog).getByRole('link', { name: 'Packages' }));
    expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull();
    expect(button).not.toHaveFocus();
    // ...whereas dismissing the menu without going anywhere still returns focus (see the Escape test).
  });

  it('closes the menu when the window grows to the xl breakpoint, where its button is hidden', async () => {
    const media = installMatchMedia({ wide: false });
    renderWithProviders(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
    act(() => media.setWide(true));
    expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull();
    // the page behind it is usable again
    expect(screen.getByRole('banner').closest('[inert]')).toBeNull();
  });

  it('shows the menu button only below the xl breakpoint and the bar only from it', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('button', { name: 'Menu' }).className).toContain('xl:hidden');
    expect(screen.getByRole('navigation', { name: 'Primary' }).className).toMatch(/hidden[^"]*xl:flex/);
  });

  it('opens the enquiry dialog from the Get a Quote button', async () => {
    renderWithProviders(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'Get a Quote' }));
    expect(screen.getByRole('dialog', { name: 'Discuss Your Project' })).toBeInTheDocument();
  });

  it('includes the theme toggle', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('button', { name: /Switch to (dark|light) theme/ })).toBeInTheDocument();
  });

  it('keeps the bar keyboard-friendly: every action in it carries a 44 px minimum', () => {
    renderWithProviders(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const actions = [
      screen.getByRole('button', { name: 'Menu' }),
      screen.getByRole('button', { name: /Switch to (dark|light) theme/ }),
      screen.getByRole('button', { name: 'Get a Quote' }),
      ...within(nav).getAllByRole('link'),
    ];
    expect(actions).toHaveLength(3 + site.nav.length);
    for (const action of actions) {
      const name = action.getAttribute('aria-label') ?? action.textContent;
      expect(action.className, `"${name}" needs size-11, h-11 or min-h-11`).toMatch(/(^|\s)(size-11|h-11|min-h-11)(\s|$)/);
    }
  });
});
