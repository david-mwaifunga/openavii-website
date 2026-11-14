// @vitest-environment node
/**
 * Server render of the home page
 * What search engines, link previews and no-JavaScript visitors actually
 * receive. This renders the page on the server (no window, no document) and
 * checks the HTML itself: all content is present, and the browser is told to
 * preload exactly one image - the hero photograph.
 *
 * React's server renderer adds a preload hint for every <img> that is not
 * lazy or low priority, so this guards against eager logos and decorative
 * marks quietly competing with the LCP image.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { InquiryProvider, ThemeProvider } from '@/context';
import { sectionIds, site } from '@/content/site';
import { services } from '@/content/services';
import { AMERICAN_SPELLING, BANNED_FILLER, INVENTED_CLAIMS, UNAPPROVED_REGISTRATIONS } from '@/test/copyRules';
import Home from './page';

const html = renderToString(
  <ThemeProvider>
    <InquiryProvider>
      <Home />
    </InquiryProvider>
  </ThemeProvider>,
);

describe('home page, server-rendered', () => {
  it('contains every section, in order, without any client JavaScript', () => {
    let last = -1;
    for (const id of sectionIds) {
      const at = html.indexOf(`id="${id}"`);
      expect(at, `section #${id} is missing from the server HTML`).toBeGreaterThan(last);
      last = at;
    }
  });

  it('contains the real content: the campaign line, all 15 services, the contact facts', () => {
    expect(html).toContain('The Right Technology');
    for (const service of services) expect(html).toContain(service.title);
    expect(html).toContain(site.contact.email);
    expect(html).toContain(site.registrations[0].number);
    expect(html).toContain('application/ld+json');
  });

  it('never ships scroll-reveal content hidden in the markup itself (hiding is a .js-gated CSS rule)', () => {
    expect(html).not.toMatch(/opacity:\s*0/);
  });

  it('asks the browser to preload exactly one image: the hero photograph', () => {
    const hints = [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="image"[^>]*>/g)].map((m) => m[0]);
    expect(hints, hints.join('\n')).toHaveLength(1);
    expect(hints[0]).toContain('commuter-laptop');
  });

  describe('every word the visitor can read (components and content together)', () => {
    // Visible text only: no scripts, styles or markup, and decoded entities.
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#x27;|&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ');

    it('is a substantial body of copy (guard against a vacuous scan)', () => {
      expect(text.length).toBeGreaterThan(15000);
    });

    it.each(BANNED_FILLER.map(([label, pattern]) => [label, pattern] as const))('contains no banned filler: %s', (_label, pattern) => {
      expect(text.match(pattern)?.[0]).toBeUndefined();
    });

    it('is written in British English', () => {
      expect(text.match(AMERICAN_SPELLING)?.[0]).toBeUndefined();
    });

    it('makes no invented claim and shows no unapproved registration', () => {
      for (const claim of INVENTED_CLAIMS) expect(text.match(claim)?.[0], String(claim)).toBeUndefined();
      expect(text.match(UNAPPROVED_REGISTRATIONS)?.[0]).toBeUndefined();
    });

    it('has no template residue or placeholders', () => {
      expect(text).not.toMatch(/lorem|ipsum|available for new projects|coming soon|\bTODO\b|XXX/i);
    });
  });

  it('keeps the page free of tracking code, third-party scripts and cookie handling', () => {
    // (The words "Google Analytics" legitimately appear as a feature of the website
    // packages the company sells; what must be absent is tracker code on this site.)
    expect(html).not.toMatch(
      /gtag\(|googletagmanager\.com|google-analytics\.com|fbq\(|hotjar|segment\.(com|io)|mixpanel|posthog|plausible|document\.cookie|cookieconsent/i,
    );
    const scripts = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
    expect(scripts.filter((src) => /^https?:\/\//.test(src))).toEqual([]);
  });
});
