/**
 * InquiryModal tests (Prompt §6.3, §7)
 * The enquiry form opens the visitor's own mail app (no backend): recipient is
 * the company mailbox, the package/service name travels in the subject and
 * body, all three enquiry types work, and name + email are required.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InquiryModal } from './InquiryModal';

const setup = (props: Partial<React.ComponentProps<typeof InquiryModal>> = {}) => {
  const navigate = vi.fn();
  const onClose = vi.fn();
  render(
    <InquiryModal
      isOpen
      onClose={onClose}
      navigate={navigate}
      type="package"
      subjectName="Standard Business Website"
      priceRange="ZMW 7,000 – 12,000"
      {...props}
    />,
  );
  return { navigate, onClose, user: userEvent.setup() };
};

const decode = (url: string) => {
  const [to, query] = url.slice('mailto:'.length).split('?');
  const params = new URLSearchParams(query);
  return { to, subject: params.get('subject') ?? '', body: params.get('body') ?? '' };
};

describe('InquiryModal', () => {
  it('shows the selected package and price in the dialog banner', () => {
    setup();
    const dialog = screen.getByRole('dialog', { name: 'Request a Quote' });
    expect(within(dialog).getByText('Selected package')).toBeInTheDocument();
    expect(within(dialog).getByText('Standard Business Website')).toBeInTheDocument();
    expect(within(dialog).getByText('ZMW 7,000 – 12,000')).toBeInTheDocument();
  });

  it('titles a service enquiry and a custom project correctly', () => {
    setup({ type: 'service', subjectName: 'Custom Dashboards and Administrative Platforms', priceRange: undefined });
    expect(screen.getByRole('dialog', { name: 'Request a Quote' })).toBeInTheDocument();
    expect(screen.getByText('Selected service')).toBeInTheDocument();
  });

  it('works for a custom project with no named service', () => {
    setup({ type: 'custom', subjectName: undefined, priceRange: undefined });
    expect(screen.getByRole('dialog', { name: 'Discuss Your Project' })).toBeInTheDocument();
    expect(screen.getByText('Custom project')).toBeInTheDocument();
  });

  it('labels every field and marks name and email as required', () => {
    setup();
    expect(screen.getByLabelText(/Full name/)).toBeRequired();
    expect(screen.getByLabelText(/Email address/)).toBeRequired();
    expect(screen.getByLabelText(/Phone number/)).not.toBeRequired();
    expect(screen.getByLabelText(/Business name/)).not.toBeRequired();
    expect(screen.getByLabelText(/Additional details/)).not.toBeRequired();
  });

  it('uses unique ids for its labels, so two forms never clash', () => {
    render(
      <>
        <InquiryModal isOpen onClose={() => {}} type="custom" />
        <InquiryModal isOpen onClose={() => {}} type="custom" />
      </>,
    );
    const ids = screen.getAllByLabelText(/Full name/).map((el) => el.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('refuses to send without a name and a valid email, and says what is wrong', async () => {
    const { navigate, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Send Enquiry' }));
    expect(navigate).not.toHaveBeenCalled();
    expect(await screen.findByText('Enter your name')).toBeInTheDocument();
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/)).toHaveAttribute('aria-invalid', 'true');

    await user.type(screen.getByLabelText(/Full name/), 'Mulenga');
    await user.type(screen.getByLabelText(/Email address/), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Send Enquiry' }));
    expect(navigate).not.toHaveBeenCalled();
    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('opens the mail app addressed to info@openavii.com with the package in subject and body', async () => {
    const { navigate, onClose, user } = setup();
    await user.type(screen.getByLabelText(/Full name/), 'Mulenga Banda');
    await user.type(screen.getByLabelText(/Email address/), 'mulenga@example.com');
    await user.type(screen.getByLabelText(/Additional details/), 'Launch in March');
    await user.click(screen.getByRole('button', { name: 'Send Enquiry' }));

    expect(navigate).toHaveBeenCalledTimes(1);
    const { to, subject, body } = decode(navigate.mock.calls[0][0]);
    expect(to).toBe('info@openavii.com');
    expect(subject).toBe('Enquiry: Standard Business Website Package');
    expect(body).toContain('Standard Business Website package (ZMW 7,000 – 12,000)');
    expect(body).toContain('Mulenga Banda');
    expect(body).toContain('Launch in March');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('tells people exactly what sending does with their details', () => {
    setup();
    expect(
      screen.getByText('Sending opens your email app with these details pre-filled. This website does not store them.'),
    ).toBeInTheDocument();
  });

  it('closes from Cancel without sending anything', async () => {
    const { navigate, onClose, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('starts on the name field so people can type straight away', () => {
    setup();
    expect(screen.getByLabelText(/Full name/)).toHaveFocus();
  });
});
