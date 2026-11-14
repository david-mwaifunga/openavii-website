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
import { INQUIRY_LIMITS } from '@/lib/mailto';
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
    const { navigate, user } = setup();
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
  });

  it('limits every field to what fits in the mail link', () => {
    setup();
    expect(screen.getByLabelText(/Full name/)).toHaveAttribute('maxlength', String(INQUIRY_LIMITS.name));
    expect(screen.getByLabelText(/Email address/)).toHaveAttribute('maxlength', String(INQUIRY_LIMITS.email));
    expect(screen.getByLabelText(/Phone number/)).toHaveAttribute('maxlength', String(INQUIRY_LIMITS.phone));
    expect(screen.getByLabelText(/Business name/)).toHaveAttribute('maxlength', String(INQUIRY_LIMITS.company));
    expect(screen.getByLabelText(/Additional details/)).toHaveAttribute('maxlength', String(INQUIRY_LIMITS.message));
  });

  it('explains the asterisk, so a sighted visitor knows what it marks', () => {
    setup();
    expect(screen.getByText(/Required fields are marked/)).toBeInTheDocument();
  });

  describe('after sending', () => {
    // The enquiry travels in a mailto: link. A visitor with no mail app set up sees nothing happen, so the
    // dialog must not close behind them and lose what they typed: it stays, says what happened and how else to reach us.
    const send = async () => {
      const result = setup();
      await result.user.type(screen.getByLabelText(/Full name/), 'Mulenga Banda');
      await result.user.type(screen.getByLabelText(/Email address/), 'mulenga@example.com');
      await result.user.type(screen.getByLabelText(/Additional details/), 'Launch in March');
      await result.user.click(screen.getByRole('button', { name: 'Send Enquiry' }));
      return result;
    };

    it('says nothing until something has been sent', () => {
      setup();
      expect(screen.getByRole('status')).toBeEmptyDOMElement();
    });

    it('stays open and says what happened', async () => {
      const { onClose } = await send();
      expect(onClose).not.toHaveBeenCalled();
      expect(screen.getByRole('dialog', { name: 'Request a Quote' })).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('Your email app should now be open with your enquiry ready to send.');
    });

    it('offers the e-mail address and WhatsApp for the visitor whose mail app did not open', async () => {
      await send();
      const status = screen.getByRole('status');
      expect(status).toHaveTextContent('Nothing opened? Email info@openavii.com or message us on WhatsApp.');
      expect(within(status).getByRole('link', { name: 'info@openavii.com' })).toHaveAttribute('href', 'mailto:info@openavii.com');
      const whatsapp = within(status).getByRole('link', { name: 'WhatsApp' });
      expect(whatsapp.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/260967223048\?text=Hello/);
      expect(whatsapp).toHaveAttribute('target', '_blank');
      expect(whatsapp).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });

    it('keeps what was typed, so the visitor can send it again', async () => {
      const { navigate, user } = await send();
      expect(screen.getByLabelText(/Additional details/)).toHaveValue('Launch in March');
      await user.click(screen.getByRole('button', { name: 'Send Enquiry' }));
      expect(navigate).toHaveBeenCalledTimes(2);
    });

    it('turns Cancel into Close', async () => {
      const { onClose, user } = await send();
      expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
      const closers = screen.getAllByRole('button', { name: 'Close' }); // the header X and the footer button
      expect(closers).toHaveLength(2);
      await user.click(closers[1]);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
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
