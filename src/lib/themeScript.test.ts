/**
 * Pre-hydration theme script
 * The script runs inline in <head> before first paint, so the right theme is
 * on <html> before React hydrates: no flash of the wrong theme, no hydration
 * warning. It also adds the `js` class that gates scroll reveals.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it, vi } from 'vitest';
import { THEME_STORAGE_KEY, themeScript } from './themeScript';
import { installMatchMedia } from '@/test/utils';

/** Execute the script the way the browser does: as plain inline JavaScript. */
const run = () => new Function(themeScript)();
const html = () => document.documentElement;

describe('themeScript', () => {
  it('uses the storage key the site has always used', () => {
    expect(THEME_STORAGE_KEY).toBe('openavii-theme');
  });

  it('adds the js class so scroll reveals hide content only when scripting runs', () => {
    run();
    expect(html()).toHaveClass('js');
  });

  it('applies a stored dark theme (class and color-scheme) before paint', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    run();
    expect(html()).toHaveClass('dark');
    expect(html()).not.toHaveClass('light');
    expect(html().style.colorScheme).toBe('dark');
  });

  it('applies a stored light theme even when the system prefers dark', () => {
    installMatchMedia({ dark: true });
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    run();
    expect(html()).toHaveClass('light');
    expect(html()).not.toHaveClass('dark');
    expect(html().style.colorScheme).toBe('light');
  });

  it('defaults to the system preference when nothing is stored (dark)', () => {
    installMatchMedia({ dark: true });
    run();
    expect(html()).toHaveClass('dark');
  });

  it('defaults to the system preference when nothing is stored (light)', () => {
    installMatchMedia({ dark: false });
    run();
    expect(html()).toHaveClass('light');
  });

  it('follows the system when the stored value is "system"', () => {
    installMatchMedia({ dark: true });
    localStorage.setItem(THEME_STORAGE_KEY, 'system');
    run();
    expect(html()).toHaveClass('dark');
  });

  it('treats an unrecognised stored value as "system"', () => {
    installMatchMedia({ dark: true });
    localStorage.setItem(THEME_STORAGE_KEY, 'purple');
    run();
    expect(html()).toHaveClass('dark');
  });

  it('replaces a stale theme class rather than stacking them', () => {
    html().classList.add('light');
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    run();
    expect(html().classList.contains('light')).toBe(false);
    expect(html().classList.contains('dark')).toBe(true);
  });

  it('never throws when storage is blocked, and still marks the page as scripted', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(run).not.toThrow();
    expect(html()).toHaveClass('js');
  });
});
