/**
 * Vitest configuration
 * jsdom environment + React plugin + the `@/` path alias (Vite resolves it
 * natively from tsconfig.json), so component tests import exactly as the
 * Next.js build does.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Tests live beside the code they cover (see CLAUDE.md "Testing").
    include: ['src/**/*.test.{ts,tsx}'],
    // Global CSS is parsed as plain text by tokens.test.ts; no CSS pipeline needed.
    css: false,
    restoreMocks: true,
  },
});
