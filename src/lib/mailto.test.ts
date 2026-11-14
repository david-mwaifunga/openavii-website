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
import { INQUIRY_LIMITS, buildMailto, validateInquiry, type InquiryDetails } from './mailto';

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

  it('does not repeat the type word when the name already ends with it ("... Services Service")', () => {
    const service = parse(buildMailto({ type: 'service', subjectName: 'Digital Branding Services', details }));
    expect(service.subject).toBe('Enquiry: Digital Branding Services');
    expect(service.body).toContain('I am interested in the Digital Branding Services.');
    const pack = parse(buildMailto({ type: 'package', subjectName: 'Starter Package', priceRange: 'ZMW 1', details }));
    expect(pack.subject).toBe('Enquiry: Starter Package');
    expect(pack.body).toContain('I am interested in the Starter Package (ZMW 1).');
  });

  it('treats a package or service enquiry with no name as a custom project, never a subject with a gap in it', () => {
    for (const type of ['package', 'service'] as const) {
      const { subject, body } = parse(buildMailto({ type, details }));
      expect(subject).toBe('Custom Project Enquiry');
      expect(body).toContain('I am interested in discussing a custom project.');
      expect(parse(buildMailto({ type, subjectName: '   ', details })).subject).toBe('Custom Project Enquiry');
    }
  });

  it('writes the name and e-mail into the body trimmed, as validation reads them', () => {
    const { body } = parse(
      buildMailto({ type: 'custom', details: { ...details, name: '  Mulenga Banda  ', email: ' mulenga@example.com ' } }),
    );
    expect(body).toContain('Name: Mulenga Banda\r\n');
    expect(body).toContain('Email: mulenga@example.com\r\n');
    expect(body.endsWith('Best regards,\r\nMulenga Banda')).toBe(true);
  });

  it('survives a lone surrogate (a broken paste), which makes encodeURIComponent throw', () => {
    const build = () => buildMailto({ type: 'custom', details: { ...details, message: 'broken \uD83D paste, and \uDE00 another' } });
    expect(build).not.toThrow();
    expect(build()).toContain('%EF%BF%BD'); // U+FFFD, the replacement character
  });

  it('keeps a maximum-length, ordinary-text enquiry within the ~2,000 characters some mail apps allow in a link', () => {
    const fill = (length: number, unit: string) => unit.repeat(Math.ceil(length / unit.length)).slice(0, length);
    const url = buildMailto({
      type: 'service',
      subjectName: 'Custom Business and Enterprise Software Development', // among the longest names on the site
      details: {
        name: fill(INQUIRY_LIMITS.name, 'Mulenga '),
        email: fill(INQUIRY_LIMITS.email, 'mulenga.banda'),
        phone: fill(INQUIRY_LIMITS.phone, '+260 977 000 '),
        company: fill(INQUIRY_LIMITS.company, 'Banda and Sons '),
        // ordinary prose with a line break roughly every 60 characters
        message: fill(INQUIRY_LIMITS.message, 'We need a simple website for the shop.\nPlease call me after four. '),
      },
    });
    expect(url.length).toBeLessThanOrEqual(2000);
  });

  it('limits every field, because a longer link may be cut off or refused by the mail app', () => {
    expect(INQUIRY_LIMITS.message).toBeGreaterThanOrEqual(500); // room for a real brief
    for (const value of Object.values(INQUIRY_LIMITS)) expect(value).toBeGreaterThan(0);
    expect(Object.keys(INQUIRY_LIMITS).sort()).toEqual(['company', 'email', 'message', 'name', 'phone']);
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
