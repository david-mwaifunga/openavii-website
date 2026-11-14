/**
 * Company facts
 * The ONLY place for the company name, legal name, contact details, address,
 * registration, URLs and social links. Everything below is from the Company
 * Profile (Digest §1), except `description`, which is new copy registered for
 * the owner's approval. Deliberately absent: the ZRA TPIN, and the ICTAZ, ZPPA,
 * NAPSA and ZICTA registrations, which are still awaiting approval and must
 * never be presented as achieved.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { newCopy } from './copy';

/** A real social profile. Add one only when the owner supplies its URL. */
export interface SocialLink {
  platform: string;
  /** Full https URL. */
  url: string;
}

export const site = {
  name: 'Openavii Technologies',
  shortName: 'Openavii',
  legalName: 'Openavii Technologies Limited',
  tagline: 'Illuminating Your Digital Journey',
  /** One-sentence description for search results, link previews and the web manifest (110-160 characters). */
  description: newCopy(
    'site.description',
    'Lusaka-based technology partner. Websites, custom software, automation and consultancy that turn complex business challenges into practical, scalable solutions.',
  ), // COPY-NEW
  url: 'https://www.openavii.com',
  domain: 'www.openavii.com',
  locale: 'en-ZM',

  location: { city: 'Lusaka', country: 'Zambia', countryCode: 'ZM' },

  address: {
    street: 'No. 20 Buchi Close',
    area: 'Northmead',
    city: 'Lusaka',
    country: 'Zambia',
    countryCode: 'ZM',
    oneLine: 'No. 20 Buchi Close, Northmead, Lusaka',
  },

  contact: {
    email: 'info@openavii.com',
    supportEmail: 'support@openavii.com',
    phones: [
      { display: '(+260) 967 223 048', e164: '+260967223048' },
      { display: '(+260) 972 147 626', e164: '+260972147626' },
    ],
    whatsapp: { e164: '+260967223048', url: 'https://wa.me/260967223048' },
  },

  /** Only PACRA carries a number we may publish. */
  registrations: [
    { authority: 'PACRA', label: 'Company Registration No.', number: '120261049958' },
  ],
  registrationLine: 'Registered in Zambia · PACRA No. 120261049958',

  /** Empty until real profile URLs are supplied: no dead social buttons. */
  socialLinks: [] as readonly SocialLink[],

  copyright: '© 2026 Openavii Technologies Limited. All rights reserved.',
  credit: 'Designed & developed by David Mwaifunga',

  /** Primary navigation (desktop bar and mobile sheet). */
  nav: [
    { label: 'Who We Are', href: '#who-we-are' },
    { label: 'What We Do', href: '#services' },
    { label: 'How We Work', href: '#approach' },
    { label: 'Team', href: '#team' },
    { label: 'Packages', href: '#packages' },
    { label: 'Contact', href: '#contact' },
  ],
  navCta: 'Get a Quote',
} as const;

/** Section ids, in page order. The page test asserts they render in exactly this order. */
export const sectionIds = [
  'home',
  'problems',
  'who-we-are',
  'services',
  'approach',
  'sectors',
  'why',
  'team',
  'packages',
  'contact',
] as const;

export type SectionId = (typeof sectionIds)[number];
