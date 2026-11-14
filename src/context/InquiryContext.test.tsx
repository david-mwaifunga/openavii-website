/**
 * InquiryProvider tests
 * One shared enquiry dialog for the whole page: any button can open it with a
 * package, a service or a custom project. (The old site mounted a separate
 * modal in several sections.)
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InquiryProvider, useInquiry } from './InquiryContext';

function Triggers() {
  const { openInquiry } = useInquiry();
  return (
    <>
      <button onClick={() => openInquiry({ type: 'service', name: 'Custom Dashboards and Administrative Platforms' })}>
        service
      </button>
      <button onClick={() => openInquiry({ type: 'package', name: 'Basic Startup Website', priceRange: 'ZMW 3,500 – 6,000' })}>
        package
      </button>
      <button onClick={() => openInquiry({ type: 'custom' })}>custom</button>
    </>
  );
}

const setup = () =>
  render(
    <InquiryProvider>
      <Triggers />
    </InquiryProvider>,
  );

describe('InquiryProvider', () => {
  it('renders no dialog until something opens it', () => {
    setup();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens for a service with its name', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'service' }));
    const dialog = screen.getByRole('dialog', { name: 'Request a Quote' });
    expect(dialog).toHaveTextContent('Custom Dashboards and Administrative Platforms');
  });

  it('opens for a package with its price range', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'package' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Basic Startup Website');
    expect(screen.getByRole('dialog')).toHaveTextContent('ZMW 3,500 – 6,000');
  });

  it('opens for a custom project', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'custom' }));
    expect(screen.getByRole('dialog', { name: 'Discuss Your Project' })).toBeInTheDocument();
  });

  it('closes again and returns focus to the button that opened it', async () => {
    setup();
    const trigger = screen.getByRole('button', { name: 'custom' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('refuses to be used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Triggers />)).toThrow(/within an InquiryProvider/);
  });
});
