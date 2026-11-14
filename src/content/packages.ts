/**
 * Website packages
 * The three packages, their features, delivery times and ZMW ranges are the
 * owner's existing data and are kept exactly (only the spelling is British).
 * Nothing here claims a package is "popular": there is no evidence for it.
 * `tone` replaces the legacy violet/indigo/purple colour keys with brand tones.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { newCopy } from './copy';

/** Brand tone a package card is set in (navy, teal or cyan fill). */
export type PackageTone = 'navy' | 'teal' | 'cyan';

export interface WebsitePackage {
  id: 'P1' | 'P2' | 'P3';
  name: string;
  tagline: string;
  suitableFor: string;
  features: readonly string[];
  deliveryTime: string;
  /** Indicative range in Zambian kwacha. */
  priceRange: { min: number; max: number; currency: 'ZMW' };
  tone: PackageTone;
}

export const packagesSection = {
  eyebrow: 'PACKAGES',
  /** Digest §7.1 headline #6, set as a statement. */
  heading: "Digital Doesn't Mean Complicated.",
  sub: newCopy(
    'packages.sub',
    'Three website packages with a clear scope, a stated delivery time and indicative pricing. Need something bigger? We build that too — see What We Do.',
  ), // COPY-NEW
  includedLabel: "What's Included",
  deliveryLabel: 'Delivery',
  cta: 'Get a Quote',
} as const;

export const packages = [
  {
    id: 'P1',
    name: 'Basic Startup Website',
    tagline: 'Simple & Professional',
    suitableFor: 'Early-stage startups requiring a simple online presence',
    features: [
      'Up to 3 website pages (Home, About, Contact)',
      'Modern, responsive design',
      'Mobile and desktop optimisation',
      'Contact form with email notifications',
      'Basic performance optimisation',
      'Deployment to live hosting',
      'One (1) round of revisions',
    ],
    deliveryTime: '5 - 7 working days',
    priceRange: { min: 3500, max: 6000, currency: 'ZMW' },
    tone: 'navy',
  },
  {
    id: 'P2',
    name: 'Standard Business Website',
    tagline: 'Stronger Online Presence',
    suitableFor: 'Businesses seeking a stronger online presence',
    features: [
      'Up to 5 website pages',
      'All features from Basic package',
      'Basic SEO setup (titles & meta descriptions)',
      'Social media & WhatsApp integration',
      'Simple animations and transitions',
      'Google Analytics integration',
      'Two (2) rounds of revisions',
    ],
    deliveryTime: '7 - 10 working days',
    priceRange: { min: 7000, max: 12000, currency: 'ZMW' },
    tone: 'teal',
  },
  {
    id: 'P3',
    name: 'Starter Plus (Growth-Ready)',
    tagline: 'Built for Growth',
    suitableFor: 'Businesses planning marketing and future growth',
    features: [
      'Up to 6 website pages',
      'All features from Standard package',
      'Blog / News section',
      'Content Management System (CMS)',
      'Lead capture forms',
      'Performance optimisation',
      'Two (2) rounds of revisions',
    ],
    deliveryTime: '10 - 14 working days',
    priceRange: { min: 12000, max: 20000, currency: 'ZMW' },
    tone: 'cyan',
  },
] as const satisfies readonly WebsitePackage[];

/** Replaces the old Custom Application and Consultancy cards (they now live in What We Do). */
export const beyondWebsites = {
  title: 'Beyond Websites',
  text: newCopy(
    'packages.beyond',
    'Custom software, SaaS, automation, integration or consultancy? Scope it with us.',
  ), // COPY-NEW
  cta: 'Get a Quote',
} as const;

/** Facts already in the package data, replacing unverifiable claims ("Secure Payment", "Free Support"). */
export const trustFacts = [
  newCopy('packages.trust.scope', 'Fixed scope per package'), // COPY-NEW
  newCopy('packages.trust.delivery', 'Delivery time stated up front'), // COPY-NEW
  newCopy('packages.trust.revisions', 'Revision rounds included'), // COPY-NEW
  newCopy('packages.trust.support', 'Support after launch available'), // COPY-NEW
] as const;

export const finePrint = newCopy(
  'packages.finePrint',
  'Prices are indicative, in Zambian kwacha (ZMW). Your written proposal confirms scope, timeline and price.',
); // COPY-NEW
