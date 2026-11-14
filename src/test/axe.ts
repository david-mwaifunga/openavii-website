/**
 * Configured axe instance for component tests.
 *
 * The `color-contrast` rule needs a real rendering engine (canvas + layout),
 * which jsdom does not provide, so it is disabled here. Contrast is enforced
 * instead - exactly and in all four colour contexts - by app/tokens.test.ts,
 * and re-checked against the real page in a browser during the QA pass.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { configureAxe } from 'vitest-axe';

export const axe = configureAxe({
  rules: {
    'color-contrast': { enabled: false },
  },
});
