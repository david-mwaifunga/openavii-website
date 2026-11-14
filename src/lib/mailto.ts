/**
 * Enquiry e-mail builder
 * The site has no backend and stores nothing: an enquiry opens the visitor's
 * own mail app with the details pre-filled, addressed to the company mailbox.
 * Pure functions, so the whole flow is unit-tested.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { site } from '@/content/site';

/** What the visitor is enquiring about. */
export type InquiryType = 'package' | 'service' | 'custom';

export interface InquiryDetails {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

export interface MailtoInput {
  type: InquiryType;
  /** Package or service name (not needed for a custom project). */
  subjectName?: string;
  /** Indicative price range shown with a package. */
  priceRange?: string;
  details: InquiryDetails;
}

/** Field-level validation errors, keyed by field. */
export type InquiryErrors = Partial<Record<'name' | 'email', string>>;

/**
 * Longest value each field accepts. The whole enquiry travels inside a mailto: link, and
 * some mail apps (Outlook on Windows among them) cut off or refuse links longer than about
 * 2,000 characters, so the form stops the visitor writing past what is certain to fit.
 */
export const INQUIRY_LIMITS = { name: 80, email: 100, phone: 30, company: 80, message: 700 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Replace lone surrogates (what a broken paste can leave behind) with U+FFFD:
 * encodeURIComponent throws a URIError on them, which would make sending do nothing.
 * Written as a loop on purpose: a lookbehind regex is a syntax error in older Safari.
 */
function wellFormed(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = text.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        out += text[i] + text[i + 1];
        i++;
      } else {
        out += '�';
      }
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      out += '�';
    } else {
      out += text[i];
    }
  }
  return out;
}

/** The name with the type word after it, unless it already ends with that word ("... Services Service"). */
const named = (name: string, word: string): string =>
  new RegExp(`${word}s?$`, 'i').test(name) ? name : `${name} ${word}`;

/** Name and e-mail are required; the e-mail must look like one. */
export function validateInquiry(details: Pick<InquiryDetails, 'name' | 'email'>): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!details.name.trim()) errors.name = 'Enter your name';
  const email = details.email.trim();
  if (!email) errors.email = 'Enter your email address';
  else if (!EMAIL.test(email)) errors.email = 'Enter a valid email address';
  return errors;
}

/** A package or service enquiry with no name is a custom project: the subject never has a gap in it. */
const isCustom = ({ type, subjectName }: MailtoInput): boolean => type === 'custom' || !subjectName?.trim();

const subjectFor = (input: MailtoInput): string => {
  if (isCustom(input)) return 'Custom Project Enquiry';
  const word = input.type === 'package' ? 'Package' : 'Service';
  return `Enquiry: ${named(input.subjectName!.trim(), word)}`;
};

const introFor = (input: MailtoInput): string => {
  if (isCustom(input)) return 'I am interested in discussing a custom project.';
  const price = input.priceRange ? ` (${input.priceRange})` : '';
  return `I am interested in the ${named(input.subjectName!.trim(), input.type)}${price}.`;
};

/** Build the `mailto:` URL for an enquiry. */
export function buildMailto(input: MailtoInput): string {
  const { details } = input;
  // Name and e-mail are trimmed, exactly as validateInquiry reads them.
  const name = details.name.trim();
  const body = [
    `Hello ${site.name},`,
    '',
    introFor(input),
    '',
    '--- Client Information ---',
    `Name: ${name}`,
    `Email: ${details.email.trim()}`,
    `Phone: ${details.phone?.trim() || 'Not provided'}`,
    `Business: ${details.company?.trim() || 'Not provided'}`,
    '',
    '--- Additional Message ---',
    details.message?.trim() || 'No additional message.',
    '',
    '---',
    'Looking forward to hearing from you.',
    '',
    'Best regards,',
    name,
  ].join('\r\n');

  return `mailto:${site.contact.email}?subject=${encodeURIComponent(
    wellFormed(subjectFor(input)),
  )}&body=${encodeURIComponent(wellFormed(body))}`;
}
