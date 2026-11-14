// @vitest-environment node
/**
 * Company facts contract
 * `site.ts` is the ONLY place for the company name, contact details, address,
 * registration and social links. Every value is checked against the Digest
 * (§1), including what must NOT appear: the stray Gmail address, the ZRA TPIN
 * and the registrations that are still "Awaiting Approval".
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { site } from './site';

describe('site facts', () => {
  it('names the company exactly as the brand documents do', () => {
    expect(site.name).toBe('Openavii Technologies');
    expect(site.legalName).toBe('Openavii Technologies Limited');
    expect(site.tagline).toBe('Illuminating Your Digital Journey');
    expect(site.url).toBe('https://www.openavii.com');
    expect(site.domain).toBe('www.openavii.com');
    expect(site.location).toEqual({ city: 'Lusaka', country: 'Zambia', countryCode: 'ZM' });
  });

  it('has both phone numbers, as display text and as dialable E.164', () => {
    expect(site.contact.phones.map((p) => p.e164)).toEqual(['+260967223048', '+260972147626']);
    expect(site.contact.phones.map((p) => p.display)).toEqual([
      '(+260) 967 223 048',
      '(+260) 972 147 626',
    ]);
  });

  it('uses the company e-mail addresses, never a personal mailbox', () => {
    expect(site.contact.email).toBe('info@openavii.com');
    expect(site.contact.supportEmail).toBe('support@openavii.com');
    expect(JSON.stringify(site)).not.toMatch(/gmail\.com/i);
  });

  it('links WhatsApp to the first number', () => {
    expect(site.contact.whatsapp.url).toBe('https://wa.me/260967223048');
  });

  it('states the physical address from the Company Profile', () => {
    expect(site.address.oneLine).toBe('No. 20 Buchi Close, Northmead, Lusaka');
    expect(site.address.city).toBe('Lusaka');
    expect(site.address.countryCode).toBe('ZM');
  });

  it('shows only the PACRA registration, never the TPIN or pending registrations', () => {
    expect(site.registrations).toEqual([
      { authority: 'PACRA', label: 'Company Registration No.', number: '120261049958' },
    ]);
    const everything = JSON.stringify(site);
    for (const pending of ['ICTAZ', 'ZPPA', 'NAPSA', 'ZICTA', 'Awaiting Approval', 'TPIN', 'ZRA']) {
      expect(everything).not.toContain(pending);
    }
  });

  it('only lists social links that have real https URLs (none are supplied yet)', () => {
    expect(site.socialLinks).toEqual([]);
    for (const link of site.socialLinks) {
      expect(link.url).toMatch(/^https:\/\//);
    }
  });

  it('carries the legal footer lines', () => {
    expect(site.copyright).toBe('© 2026 Openavii Technologies Limited. All rights reserved.');
    expect(site.credit).toBe('Designed & developed by David Mwaifunga');
    expect(site.registrationLine).toBe('Registered in Zambia · PACRA No. 120261049958');
  });

  it('defines the primary navigation, in the agreed order, with in-page anchors', () => {
    expect(site.nav).toEqual([
      { label: 'Who We Are', href: '#who-we-are' },
      { label: 'What We Do', href: '#services' },
      { label: 'How We Work', href: '#approach' },
      { label: 'Team', href: '#team' },
      { label: 'Packages', href: '#packages' },
      { label: 'Contact', href: '#contact' },
    ]);
    expect(site.navCta).toBe('Get a Quote');
  });
});
