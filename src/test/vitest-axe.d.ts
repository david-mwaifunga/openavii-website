/**
 * Type augmentation so `expect(results).toHaveNoViolations()` type-checks.
 * vitest-axe ships matcher types but does not register them on Vitest 4's
 * `Assertion` interface by itself.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';

declare module 'vitest' {
  // Type parameters must match Vitest's own declaration exactly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface Assertion<T = any> extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
