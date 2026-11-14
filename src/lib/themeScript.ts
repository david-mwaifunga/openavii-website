/**
 * Pre-hydration theme script
 * Inlined in <head> by the root layout so the correct theme class is on <html>
 * before first paint - no flash of the wrong theme and no hydration warning.
 * It also adds the `js` class, which gates scroll-reveal styles so that
 * no-JS visitors and crawlers always see all content.
 *
 * Kept as plain ES5 in a string: it must run before any bundle loads, and it
 * must never throw (storage can be blocked, matchMedia can be missing). Each
 * fragile call has its own try, so one failing never skips the next: blocked
 * storage must still honour the system theme, or a dark-mode visitor would get
 * a light first paint.
 *
 * The `js` gate hides reveal content until the app shows it, so it also needs a
 * safety net: if the bundle never starts (a chunk fails on a poor connection),
 * nothing would ever show that content. The app marks <html data-hydrated> once
 * it is alive (ThemeProvider); without that mark, the gate is dropped after a
 * grace period and the page simply shows everything, as it does without JavaScript.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

/** localStorage key holding "light" | "dark" | "system". Unchanged from the previous site. */
export const THEME_STORAGE_KEY = 'openavii-theme';

/** How long a page waits for the app to start before the `js` gate is dropped. */
export const HYDRATION_GRACE_MS = 6000;

export const themeScript = `(function () {
  var root = document.documentElement;
  var stored = 'system';
  try {
    var value = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (value === 'light' || value === 'dark' || value === 'system') stored = value;
  } catch (e) {}
  var resolved = stored;
  if (stored === 'system') {
    resolved = 'light';
    try {
      if (matchMedia('(prefers-color-scheme: dark)').matches) resolved = 'dark';
    } catch (e) {}
  }
  try {
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  } catch (e) {}
  root.classList.add('js');
  setTimeout(function () {
    if (!root.hasAttribute('data-hydrated')) root.classList.remove('js');
  }, ${HYDRATION_GRACE_MS});
})();`;
