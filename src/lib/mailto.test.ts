// @vitest-environment node
/**
 * Enquiry e-mail builder tests (Prompt §6.3, §7)
 * The site has no backend: enquiries open the visitor's own mail app. The
 * recipient is the company address, the subject and body carry the package or
 * service name for all three enquiry types, and name + e-mail are required.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { buildMailto, validateInquiry, type InquiryDetails } from './mailto';

const details: InquiryDetails = {
  name: 'Mulenga Banda',
  email: 'mulenga@example.com',
  phone: '+260 977 000 000',
  company: 'Banda & Sons',
  message: 'We need a site by March.\nThanks!',
};

/** Parse a mailto: URL back into its parts. */
function parse(url: string) {
  expect(url.startsWith('mailto:')).toBe(true);
  const [to, query] = url.slice('mailto:'.length).split('?');
  const params = new URLSearchParams(query);
  return { to, subject: params.get('subject') ?? '', body: params.get('body') ?? '' };
}

describe('buildMailto', () => {
  it('always addresses the company mailbox, never a personal one', () => {
    for (const type of ['package', 'service', 'custom'] as const) {
      const { to } = parse(buildMailto({ type, subjectName: 'X', details }));
      expect(to).toBe('info@openavii.com');
    }
    expect(buildMailto({ type: 'custom', details })).not.toMatch(/gmail/i);
  });

  it('names the package in the subject and body, with its price range', () => {
    const { subject, body } = parse(
      buildMailto({
        type: 'package',
        subjectName: 'Standard Business Website',
        priceRange: 'ZMW 7,000 – 12,000',
        details,
      }),
    );
    expect(subject).toBe('Enquiry: Standard Business Website Package');
    expect(body).toContain('I am interested in the Standard Business Website package (ZMW 7,000 – 12,000).');
  });

  it('names the service in the subject and body', () => {
    const { subject, body } = parse(
      buildMailto({ type: 'service', subjectName: 'Systems Integration and API Development', details }),
    );
    expect(subject).toBe('Enquiry: Systems Integration and API Development Service');
    expect(body).toContain('I am interested in the Systems Integration and API Development service.');
  });

  it('handles a custom-project enquiry without a service name', () => {
    const { subject, body } = parse(buildMailto({ type: 'custom', details }));
    expect(subject).toBe('Custom Project Enquiry');
    expect(body).toContain('I am interested in discussing a custom project.');
  });

  it('carries every detail the visitor typed, and says so when optional ones are missing', () => {
    const full = parse(buildMailto({ type: 'custom', details })).body;
    for (const value of ['Mulenga Banda', 'mulenga@example.com', '+260 977 000 000', 'Banda & Sons', 'We need a site by March.\nThanks!']) {
      expect(full).toContain(value);
    }
    const sparse = parse(
      buildMailto({ type: 'custom', details: { name: 'A', email: 'a@b.co' } }),
    ).body;
    expect(sparse).toContain('Phone: Not provided');
    expect(sparse).toContain('Business: Not provided');
    expect(sparse).toContain('No additional message.');
  });

  it('percent-encodes everything so &, ?, # and newlines cannot break the link', () => {
    const url = buildMailto({ type: 'custom', details: { ...details, message: 'a&b=c?d#e\nline two' } });
    expect(url).not.toMatch(/[\s"<>]/);
    expect(url.split('?')).toHaveLength(2);
    expect(url.split('&').length).toBe(2); // exactly subject & body
    expect(parse(url).body).toContain('a&b=c?d#e\nline two');
  });
});

describe('validateInquiry', () => {
  it('requires a name and an e-mail address', () => {
    expect(validateInquiry({ name: '', email: '' })).toEqual({
      name: 'Enter your name',
      email: 'Enter your email address',
    });
  });

  it('rejects a malformed e-mail address', () => {
    expect(validateInquiry({ name: 'A', email: 'not-an-email' })).toEqual({
      email: 'Enter a valid email address',
    });
  });

  it('trims whitespace-only names', () => {
    expect(validateInquiry({ name: '   ', email: 'a@b.co' })).toEqual({ name: 'Enter your name' });
  });

  it('accepts valid details', () => {
    expect(validateInquiry({ name: 'A', email: 'a@b.co' })).toEqual({});
  });
});
