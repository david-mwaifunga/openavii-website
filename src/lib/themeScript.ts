/**
 * Pre-hydration theme script
 * Inlined in <head> by the root layout so the correct theme class is on <html>
 * before first paint - no flash of the wrong theme and no hydration warning.
 * It also adds the `js` class, which gates scroll-reveal styles so that
 * no-JS visitors and crawlers always see all content.
 *
 * Kept as plain ES5 in a string: it must run before any bundle loads, and it
 * must never throw (storage can be blocked, matchMedia can be missing).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

/** localStorage key holding "light" | "dark" | "system". Unchanged from the previous site. */
export const THEME_STORAGE_KEY = 'openavii-theme';

export const themeScript = `(function () {
  var root = document.documentElement;
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (stored !== 'light' && stored !== 'dark' && stored !== 'system') stored = 'system';
    var resolved = stored === 'system'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : stored;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  } catch (e) {}
  root.classList.add('js');
})();`;
