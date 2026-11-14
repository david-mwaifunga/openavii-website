/**
 * Render helper
 * Renders UI inside the same providers the root layout supplies (theme and
 * the shared enquiry dialog), so components under test behave as on the page.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { InquiryProvider, ThemeProvider } from '@/context';

function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <InquiryProvider>{children}</InquiryProvider>
    </ThemeProvider>
  );
}

/** `render` with the site's providers. */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Providers, ...options });
}
