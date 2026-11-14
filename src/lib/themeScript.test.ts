/**
 * Pre-hydration theme script
 * The script runs inline in <head> before first paint, so the right theme is
 * on <html> before React hydrates: no flash of the wrong theme, no hydration
 * warning. It also adds the `js` class that gates scroll reveals.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { HYDRATION_GRACE_MS, THEME_STORAGE_KEY, themeScript } from './themeScript';
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

  it('still follows the system preference when storage is blocked, so a dark-mode visitor never gets a light first paint', () => {
    installMatchMedia({ dark: true });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    run();
    expect(html()).toHaveClass('dark');
    expect(html().style.colorScheme).toBe('dark');
  });

  it('falls back to light, without throwing, when matchMedia is missing', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(run).not.toThrow();
    expect(html()).toHaveClass('light');
    expect(html()).toHaveClass('js');
  });

  describe('safety net for an app that never starts', () => {
    // `.js` hides scroll-reveal content until the bundle shows it. If a script chunk fails to load,
    // nothing would ever show it, so the gate is dropped again unless the app announces itself.
    afterEach(() => vi.useRealTimers());

    it('drops the js gate when the app has not hydrated within the grace period', () => {
      vi.useFakeTimers();
      run();
      expect(html()).toHaveClass('js');
      vi.advanceTimersByTime(HYDRATION_GRACE_MS - 1);
      expect(html()).toHaveClass('js');
      vi.advanceTimersByTime(1);
      expect(html()).not.toHaveClass('js');
    });

    it('keeps the js gate once the app has marked the page as hydrated', () => {
      vi.useFakeTimers();
      run();
      html().setAttribute('data-hydrated', '');
      vi.advanceTimersByTime(HYDRATION_GRACE_MS * 2);
      expect(html()).toHaveClass('js');
    });

    it('gives a slow connection time to start: the grace period is several seconds', () => {
      expect(HYDRATION_GRACE_MS).toBeGreaterThanOrEqual(5000);
    });
  });
});
