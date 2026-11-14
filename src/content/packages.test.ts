// @vitest-environment node
/**
 * Packages contract (Prompt §3.2, §7)
 * The three website packages keep their data exactly - names, features,
 * delivery times and ZMW ranges - apart from British spelling. The legacy
 * violet/indigo/purple keys are gone in favour of brand tones.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { digestSection, tableRows } from '@/test/digest';
import { beyondWebsites, finePrint, packages, packagesSection, trustFacts } from './packages';

describe('packages', () => {
  it('keeps the three packages and their ZMW price ranges unchanged', () => {
    expect(packages.map((p) => p.id)).toEqual(['P1', 'P2', 'P3']);
    expect(packages.map((p) => p.name)).toEqual([
      'Basic Startup Website',
      'Standard Business Website',
      'Starter Plus (Growth-Ready)',
    ]);
    expect(packages.map((p) => [p.priceRange.min, p.priceRange.max])).toEqual([
      [3500, 6000],
      [7000, 12000],
      [12000, 20000],
    ]);
    expect(packages.every((p) => p.priceRange.currency === 'ZMW')).toBe(true);
  });

  it('keeps delivery times, taglines and audiences', () => {
    expect(packages.map((p) => p.deliveryTime)).toEqual([
      '5 - 7 working days',
      '7 - 10 working days',
      '10 - 14 working days',
    ]);
    expect(packages.map((p) => p.tagline)).toEqual([
      'Simple & Professional',
      'Stronger Online Presence',
      'Built for Growth',
    ]);
    expect(packages.map((p) => p.suitableFor)).toEqual([
      'Early-stage startups requiring a simple online presence',
      'Businesses seeking a stronger online presence',
      'Businesses planning marketing and future growth',
    ]);
  });

  it('keeps every feature, spelled the British way', () => {
    expect(packages[0].features).toEqual([
      'Up to 3 website pages (Home, About, Contact)',
      'Modern, responsive design',
      'Mobile and desktop optimisation',
      'Contact form with email notifications',
      'Basic performance optimisation',
      'Deployment to live hosting',
      'One (1) round of revisions',
    ]);
    expect(packages[1].features).toEqual([
      'Up to 5 website pages',
      'All features from Basic package',
      'Basic SEO setup (titles & meta descriptions)',
      'Social media & WhatsApp integration',
      'Simple animations and transitions',
      'Google Analytics integration',
      'Two (2) rounds of revisions',
    ]);
    expect(packages[2].features).toEqual([
      'Up to 6 website pages',
      'All features from Standard package',
      'Blog / News section',
      'Content Management System (CMS)',
      'Lead capture forms',
      'Performance optimisation',
      'Two (2) rounds of revisions',
    ]);
  });

  it('uses brand tones, not the legacy colour keys', () => {
    expect(packages.map((p) => p.tone)).toEqual(['navy', 'teal', 'cyan']);
    for (const p of packages) {
      expect(p).not.toHaveProperty('accentColor');
    }
    expect(JSON.stringify(packages)).not.toMatch(/violet|indigo|purple/i);
  });

  it('does not claim a "most popular" package (nothing supports it)', () => {
    for (const p of packages) expect(p).not.toHaveProperty('isPopular');
  });

  it('headlines the section with the brand line "Digital Doesn\'t Mean Complicated"', () => {
    const [, headline] = tableRows(digestSection('7.1'))[5];
    expect(packagesSection.heading).toBe(`${headline}.`);
  });

  it('sends bigger work to a custom quote through a "Beyond websites" card', () => {
    // Headlines are Title Case across the brand.
    expect(beyondWebsites.title).toBe('Beyond Websites');
    expect(beyondWebsites.text).toBe(
      'Custom software, SaaS, automation, integration or consultancy? Scope it with us.',
    );
    expect(beyondWebsites.cta).toBe('Get a Quote');
  });

  it('states the pricing terms plainly', () => {
    expect(finePrint).toBe(
      'Prices are indicative, in Zambian kwacha (ZMW). Your written proposal confirms scope, timeline and price.',
    );
  });

  it('replaces vague trust claims with four facts already in the package data', () => {
    expect(trustFacts).toEqual([
      'Fixed scope per package',
      'Delivery time stated up front',
      'Revision rounds included',
      'Support after launch available',
    ]);
    expect(JSON.stringify(trustFacts)).not.toMatch(/secure payment|free support/i);
  });
});
