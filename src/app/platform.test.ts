// @vitest-environment node
/**
 * Platform files: manifest, sitemap, robots and security headers (Prompt §6.4)
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import nextConfig from '../../next.config';
import { BRAND_COLOURS } from '@/lib/seo';
import manifest from './manifest';
import robots from './robots';
import sitemap from './sitemap';

const publicFile = (src: string) => fileURLToPath(new URL(`../../public${src}`, import.meta.url));

describe('manifest', () => {
  const m = manifest();

  it('names the app and uses the brand colours', () => {
    expect(m.name).toBe('Openavii Technologies');
    expect(m.short_name).toBe('Openavii');
    expect(m.start_url).toBe('/');
    expect(m.display).toBe('standalone');
    expect(m.theme_color).toBe(BRAND_COLOURS.navy);
    expect(m.background_color).toBe(BRAND_COLOURS.depth);
    expect(m.lang).toBe('en-ZM');
  });

  it('offers 192 and 512 px icons that exist, including a maskable one', () => {
    const icons = m.icons ?? [];
    expect(icons.map((i) => i.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']));
    expect(icons.some((i) => i.purpose === 'maskable')).toBe(true);
    for (const icon of icons) expect(fs.existsSync(publicFile(icon.src)), icon.src).toBe(true);
  });
});

describe('sitemap', () => {
  it('lists the single page on the canonical domain', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(1);
    expect(entries[0].url).toBe('https://www.openavii.com');
    expect(entries[0].priority).toBe(1);
  });
});

describe('robots', () => {
  it('allows crawling and points at the sitemap', () => {
    const r = robots();
    expect(r.rules).toEqual([{ userAgent: '*', allow: '/' }]);
    expect(r.sitemap).toBe('https://www.openavii.com/sitemap.xml');
  });
});

describe('next.config', () => {
  it('serves AVIF and WebP, and needs no custom image qualities (the default 75 is used everywhere)', () => {
    expect(nextConfig.images?.formats).toEqual(['image/avif', 'image/webp']);
    expect(nextConfig.images).not.toHaveProperty('qualities');
  });

  it('sends the four security headers on every route (HSTS belongs to the host)', async () => {
    const rules = (await nextConfig.headers?.()) ?? [];
    expect(rules).toHaveLength(1);
    expect(rules[0].source).toBe('/(.*)');
    const headers = Object.fromEntries(rules[0].headers.map((h) => [h.key, h.value]));
    expect(headers).toEqual({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'X-Frame-Options': 'DENY',
    });
  });

  it('does not advertise the framework', () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});
