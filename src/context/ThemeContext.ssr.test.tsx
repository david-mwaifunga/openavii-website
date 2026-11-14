// @vitest-environment node
/**
 * ThemeProvider server rendering
 * Runs with no `window`, `document` or `localStorage`, exactly like the server
 * render of the root layout. The provider must not touch any of them while
 * rendering, and must render children with the neutral defaults.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ThemeProvider, useTheme } from './ThemeContext';

function Probe() {
  const { theme, resolvedTheme } = useTheme();
  // One text node: renderToString separates adjacent text nodes with comments.
  return <p>{`${theme}/${resolvedTheme}`}</p>;
}

describe('ThemeProvider on the server', () => {
  it('has no browser globals in this environment (guard for the test itself)', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof localStorage).toBe('undefined');
  });

  it('renders without touching window, document or localStorage', () => {
    const markup = renderToString(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    // The server cannot know the user's preference: "system", shown as light.
    // The inline script and hydration correct this before the user sees anything.
    expect(markup).toContain('system/light');
  });
});
