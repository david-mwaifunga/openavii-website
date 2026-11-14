/**
 * Closing call to action tests (Prompt §3.2)
 * The cover line as the final headline, four ways to get in touch (quote,
 * WhatsApp, call, email) and the full contact grid - all from content/site.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { closingCta, contactLabels } from '@/content/contact';
import { photos } from '@/content/photos';
import { site } from '@/content/site';
import { renderWithProviders } from '@/test/render';
import { ContactCta } from './ContactCta';

describe('ContactCta', () => {
  it('is the "contact" section on the dark brand surface with ghost numeral 08', () => {
    const { container } = renderWithProviders(<ContactCta />);
    const section = container.querySelector('section#contact');
    expect(section).toHaveAttribute('data-surface', 'dark');
    expect(section?.querySelector('[data-ghost-numeral]')).toHaveTextContent('08');
  });

  it('closes on the brand cover line, the second line in the accent colour', () => {
    renderWithProviders(<ContactCta />);
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('Turning Bright Ideas into Digital Reality.');
    expect(h2.querySelectorAll('[data-line]')).toHaveLength(2);
    expect(h2.querySelectorAll('[data-line]')[1].className).toContain('text-accent-text');
    expect(screen.getByText(closingCta.sub)).toBeInTheDocument();
  });

  it('offers four ways in: quote, WhatsApp, call and email', async () => {
    renderWithProviders(<ContactCta />);
    const actions = screen.getByRole('group', { name: 'Get in touch' });
    const whatsapp = within(actions).getByRole('link', { name: closingCta.actions.whatsapp });
    expect(whatsapp.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/260967223048\?text=/);
    expect(decodeURIComponent(whatsapp.getAttribute('href') ?? '')).toContain(closingCta.whatsappMessage);
    expect(whatsapp).toHaveAttribute('target', '_blank');
    expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(actions).getByRole('link', { name: closingCta.actions.call })).toHaveAttribute(
      'href',
      `tel:${site.contact.phones[0].e164}`,
    );
    expect(within(actions).getByRole('link', { name: closingCta.actions.email })).toHaveAttribute(
      'href',
      `mailto:${site.contact.email}`,
    );
    await userEvent.click(within(actions).getByRole('button', { name: closingCta.actions.quote }));
    expect(screen.getByRole('dialog', { name: 'Discuss Your Project' })).toBeInTheDocument();
  });

  it('lays out the full contact grid from the single source of facts', () => {
    renderWithProviders(<ContactCta />);
    const grid = screen.getByRole('list', { name: 'Contact details' });
    for (const phone of site.contact.phones) {
      expect(within(grid).getByRole('link', { name: phone.display })).toHaveAttribute('href', `tel:${phone.e164}`);
    }
    for (const email of [site.contact.email, site.contact.supportEmail]) {
      expect(within(grid).getByRole('link', { name: email })).toHaveAttribute('href', `mailto:${email}`);
    }
    expect(within(grid).getByRole('link', { name: site.domain })).toHaveAttribute('href', site.url);
    expect(within(grid).getByText(site.address.oneLine)).toBeInTheDocument();
    for (const label of Object.values(contactLabels)) {
      expect(within(grid).getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(grid.innerHTML).not.toMatch(/gmail/i);
  });

  it('keeps every contact link a 44 px touch target (a 22 px phone number is easy to miss)', () => {
    renderWithProviders(<ContactCta />);
    const grid = screen.getByRole('list', { name: 'Contact details' });
    const links = within(grid).getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(5);
    for (const link of links) expect(link.className, link.textContent ?? '').toContain('min-h-11');
  });

  it('shows the closing photograph', () => {
    renderWithProviders(<ContactCta />);
    expect(screen.getByRole('img', { name: photos['cafe-sunlight'].alt })).toBeInTheDocument();
  });
});
