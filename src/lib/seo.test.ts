// @vitest-environment node
/**
 * SEO and structured data contract (Prompt §6.4, §7 "metadata")
 * Titles and description within search limits, canonical, Open Graph and
 * Twitter present, no obsolete keywords or icon block (Next's file conventions
 * supply the icons), and JSON-LD that matches the single source of facts.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseCssBlocks, parseDeclarations, resolveColor, toHex } from './contrast';
import { BRAND_COLOURS, organizationJsonLd, siteMetadata, siteViewport } from './seo';
import { site } from '@/content/site';

const title = siteMetadata.title as { default: string; template: string };

describe('siteMetadata', () => {
  it('has the agreed title and template', () => {
    expect(title.default).toBe('Openavii Technologies | Illuminating Your Digital Journey');
    expect(title.template).toBe('%s | Openavii Technologies');
    expect(title.default.length).toBeLessThanOrEqual(65);
  });

  it('has a description that fits a search result and says what the company does', () => {
    const description = siteMetadata.description as string;
    expect(description.length).toBeGreaterThanOrEqual(110);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description).toMatch(/Lusaka/);
    expect(description).toMatch(/custom software/);
  });

  it('declares the canonical site and a canonical URL', () => {
    expect((siteMetadata.metadataBase as URL).href).toBe('https://www.openavii.com/');
    expect(siteMetadata.alternates?.canonical).toBe('/');
  });

  it('describes the page to social networks in British English', () => {
    const og = siteMetadata.openGraph as Record<string, unknown>;
    expect(og.type).toBe('website');
    expect(og.locale).toBe('en_GB');
    expect(og.siteName).toBe('Openavii Technologies');
    expect(og.title).toBe(title.default);
    expect(og.description).toBe(siteMetadata.description);
    expect(siteMetadata.twitter).toMatchObject({ card: 'summary_large_image', title: title.default });
  });

  it('drops obsolete keywords and the icons block (the file conventions supply the icons)', () => {
    expect(siteMetadata).not.toHaveProperty('keywords');
    expect(siteMetadata).not.toHaveProperty('icons');
  });

  it('is indexable', () => {
    expect(siteMetadata.robots).toMatchObject({ index: true, follow: true });
  });
});

describe('siteViewport', () => {
  it('sets a theme colour for light and dark browser chrome from brand colours', () => {
    const themes = siteViewport.themeColor as Array<{ media: string; color: string }>;
    expect(themes.map((t) => t.media)).toEqual(['(prefers-color-scheme: light)', '(prefers-color-scheme: dark)']);
    expect(themes[0].color.toLowerCase()).toBe(BRAND_COLOURS.white.toLowerCase());
    expect(themes[1].color.toLowerCase()).toBe(BRAND_COLOURS.depth.toLowerCase());
  });
});

describe('brand colours used outside CSS', () => {
  it('match the design tokens in globals.css exactly (one palette, two places, never drifting)', () => {
    const css = fs.readFileSync(fileURLToPath(new URL('../app/globals.css', import.meta.url)), 'utf8');
    const root = parseCssBlocks(css).find((b) => b.selectors.includes(':root'));
    const tokens = parseDeclarations(root?.body ?? '');
    expect(BRAND_COLOURS.navy.toLowerCase()).toBe(toHex(resolveColor('var(--brand-navy)', tokens)));
    expect(BRAND_COLOURS.depth.toLowerCase()).toBe(toHex(resolveColor('var(--brand-depth)', tokens)));
    expect(BRAND_COLOURS.white.toLowerCase()).toBe(toHex(resolveColor('var(--brand-white)', tokens)));
  });
});

describe('organizationJsonLd', () => {
  const data = organizationJsonLd() as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  it('is a schema.org Organization with the legal name, URL, logo and slogan', () => {
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Organization');
    expect(data.name).toBe(site.name);
    expect(data.legalName).toBe('Openavii Technologies Limited');
    expect(data.url).toBe('https://www.openavii.com');
    expect(data.logo).toBe('https://www.openavii.com/brand/logo/openavii-logo.png');
    expect(data.slogan).toBe(site.tagline);
  });

  it('carries the Lusaka address, both phone numbers and the company e-mail addresses', () => {
    expect(data.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: 'No. 20 Buchi Close, Northmead',
      addressLocality: 'Lusaka',
      addressCountry: 'ZM',
    });
    expect(data.telephone).toEqual(['+260967223048', '+260972147626']);
    expect(data.email).toBe('info@openavii.com');
    const emails = data.contactPoint.map((c: { email: string }) => c.email);
    expect(emails).toEqual(['info@openavii.com', 'support@openavii.com']);
  });

  it('publishes the PACRA registration number and nothing else about registrations', () => {
    expect(data.identifier).toEqual({
      '@type': 'PropertyValue',
      propertyID: 'PACRA Company Registration No.',
      value: '120261049958',
    });
    expect(JSON.stringify(data)).not.toMatch(/TPIN|ZRA|ICTAZ|ZPPA|NAPSA|ZICTA|gmail/);
  });

  it('only lists sameAs profiles when real social URLs exist (none do yet)', () => {
    expect(site.socialLinks).toHaveLength(0);
    expect(data).not.toHaveProperty('sameAs');
  });

  it('serialises to valid JSON', () => {
    expect(() => JSON.parse(JSON.stringify(data))).not.toThrow();
  });
});
