// @vitest-environment node
/**
 * Closing call to action, footer and enquiry-form copy
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { digestSection, plain, tableRows } from '@/test/digest';
import { closingCta, contactLabels, footerCopy, inquiryCopy } from './contact';

const coverLine = plain(
  tableRows(digestSection('1. Company facts')).find((r) => r[0] === 'Cover line')?.[1] ?? '',
);

describe('closing call to action', () => {
  it('ends on the brand cover line, split over two lines', () => {
    expect(coverLine).toBe('Turning Bright Ideas into Digital Reality');
    expect(closingCta.heading).toEqual(['Turning Bright Ideas', 'into Digital Reality.']);
    expect(closingCta.heading.join(' ')).toBe(`${coverLine}.`);
  });

  it('asks the question the campaign asks, then invites the challenge', () => {
    expect(closingCta.sub).toBe(
      "Is your business ready for the digital shift? Tell us the challenge — we'll start by understanding it.",
    );
  });

  it('offers four ways in: quote, WhatsApp, call, email', () => {
    expect(closingCta.actions).toEqual({
      quote: 'Get a Quote',
      whatsapp: 'WhatsApp',
      call: 'Call',
      email: 'Email',
    });
    expect(closingCta.whatsappMessage.length).toBeGreaterThan(10);
  });

  it('labels the contact grid', () => {
    expect(contactLabels).toEqual({
      mobile: 'Mobile',
      email: 'Email',
      website: 'Website',
      address: 'Address',
    });
  });
});

describe('footer copy', () => {
  it('groups links under plain headings', () => {
    expect(footerCopy.exploreHeading).toBe('Explore');
    expect(footerCopy.servicesHeading).toBe('What We Do');
    expect(footerCopy.contactHeading).toBe('Contact');
  });
});

describe('enquiry form copy', () => {
  it('tells people exactly what sending does with their details', () => {
    expect(inquiryCopy.note).toBe(
      'Sending opens your email app with these details pre-filled. This website does not store them.',
    );
  });

  it('titles each enquiry type', () => {
    expect(inquiryCopy.titles).toEqual({
      package: 'Request a Quote',
      service: 'Request a Quote',
      custom: 'Discuss Your Project',
    });
  });

  it('marks name and email required, phone and business optional', () => {
    expect(inquiryCopy.fields.name.required).toBe(true);
    expect(inquiryCopy.fields.email.required).toBe(true);
    expect(inquiryCopy.fields.phone.required).toBe(false);
    expect(inquiryCopy.fields.company.required).toBe(false);
  });
});
