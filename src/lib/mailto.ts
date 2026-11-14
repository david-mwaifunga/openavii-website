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

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Name and e-mail are required; the e-mail must look like one. */
export function validateInquiry(details: Pick<InquiryDetails, 'name' | 'email'>): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!details.name.trim()) errors.name = 'Enter your name';
  const email = details.email.trim();
  if (!email) errors.email = 'Enter your email address';
  else if (!EMAIL.test(email)) errors.email = 'Enter a valid email address';
  return errors;
}

const subjectFor = ({ type, subjectName }: MailtoInput): string => {
  if (type === 'custom') return 'Custom Project Enquiry';
  return `Enquiry: ${subjectName ?? ''} ${type === 'package' ? 'Package' : 'Service'}`;
};

const introFor = ({ type, subjectName, priceRange }: MailtoInput): string => {
  if (type === 'custom') return 'I am interested in discussing a custom project.';
  const price = priceRange ? ` (${priceRange})` : '';
  return `I am interested in the ${subjectName ?? ''} ${type}${price}.`;
};

/** Build the `mailto:` URL for an enquiry. */
export function buildMailto(input: MailtoInput): string {
  const { details } = input;
  const body = [
    `Hello ${site.name},`,
    '',
    introFor(input),
    '',
    '--- Client Information ---',
    `Name: ${details.name}`,
    `Email: ${details.email}`,
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
    details.name,
  ].join('\r\n');

  return `mailto:${site.contact.email}?subject=${encodeURIComponent(
    subjectFor(input),
  )}&body=${encodeURIComponent(body)}`;
}
