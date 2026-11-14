/**
 * Web app manifest
 * Lets the site be installed or pinned with the brand name, colours and the
 * 2026 icons (the white ring mark on the brand gradient).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { BRAND_COLOURS } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: `${site.tagline}. Lusaka-based technology partner.`,
    start_url: '/',
    display: 'standalone',
    lang: site.locale,
    background_color: BRAND_COLOURS.depth,
    theme_color: BRAND_COLOURS.navy,
    icons: [
      { src: '/brand/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
