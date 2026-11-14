/**
 * SEO metadata and structured data
 * One place for what search engines and social networks read: the page
 * metadata (title, description, canonical, Open Graph, Twitter), the viewport
 * theme colours, and the schema.org Organization JSON-LD. Everything is built
 * from content/site, so a phone number or address is never written twice.
 *
 * Icons are deliberately not declared here: Next.js file conventions
 * (icon.png, apple-icon.png, favicon.ico, opengraph-image.png and
 * twitter-image.png in src/app) supply them.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { Metadata, Viewport } from 'next';
import { site } from '@/content/site';

/**
 * Brand colours needed outside CSS (the web manifest and the browser theme
 * colour cannot read CSS variables). They mirror --brand-* in globals.css;
 * lib/seo.test.ts fails if the two ever drift apart.
 */
export const BRAND_COLOURS = {
  navy: '#223450',
  depth: '#111111',
  white: '#FEFEFE',
} as const;

const title = `${site.name} | ${site.tagline}`;

/** Registered as new copy in content/site, so the owner approves it with the rest. */
const description = site.description;

export const siteMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description,
  applicationName: site.name,
  authors: [{ name: 'David Mwaifunga' }],
  creator: 'David Mwaifunga',
  publisher: site.legalName,
  category: 'technology',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: site.name,
    title,
    description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const siteViewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND_COLOURS.white },
    { media: '(prefers-color-scheme: dark)', color: BRAND_COLOURS.depth },
  ],
};

/**
 * schema.org Organization for the home page. `sameAs` is added only when
 * content/site holds real social profile URLs (none yet), and the only
 * registration published is the PACRA number.
 */
export function organizationJsonLd(): Record<string, unknown> {
  const phones = site.contact.phones.map((phone) => phone.e164);
  const registration = site.registrations[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/brand/logo/openavii-logo.png`,
    slogan: site.tagline,
    description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.street}, ${site.address.area}`,
      addressLocality: site.address.city,
      addressCountry: site.address.countryCode,
    },
    telephone: phones,
    email: site.contact.email,
    contactPoint: [site.contact.email, site.contact.supportEmail].map((email, index) => ({
      '@type': 'ContactPoint',
      contactType: index === 0 ? 'sales' : 'customer support',
      email,
      telephone: phones[0],
      areaServed: site.address.countryCode,
      availableLanguage: 'English',
    })),
    identifier: {
      '@type': 'PropertyValue',
      propertyID: `${registration.authority} ${registration.label}`,
      value: registration.number,
    },
    ...(site.socialLinks.length > 0 ? { sameAs: site.socialLinks.map((link) => link.url) } : {}),
  };
}
