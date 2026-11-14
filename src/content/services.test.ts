// @vitest-environment node
/**
 * Service catalogue contract (Digest §7.2, Company Profile pp. 11-15)
 * Exactly 15 services in four clusters, with the Profile's exact titles and
 * the first sentence of each description as the tile summary.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { digestSection, firstSentence, numberedItems } from '@/test/digest';
import { serviceClusters, services, servicesSection } from './services';

const profile = numberedItems(digestSection('7.2'));

/** Fixed slugs from Prompt §3.2, in catalogue order. */
const SLUGS = [
  'websites',
  'saas',
  'custom-software',
  'web-mobile-apps',
  'cms-content-branding',
  'automation',
  'integration-apis',
  'dashboards',
  'solution-architecture',
  'code-reviews',
  'ux-assessments',
  'database-design',
  'auth-rbac',
  'security-performance',
  'maintenance-support',
];

describe('services', () => {
  it('lists exactly 15 services with the fixed slugs, in order', () => {
    expect(profile).toHaveLength(15);
    expect(services.map((s) => s.slug)).toEqual(SLUGS);
    expect(new Set(services.map((s) => s.slug)).size).toBe(15);
  });

  it('uses the Profile titles verbatim', () => {
    expect(services.map((s) => s.title)).toEqual(profile.map((p) => p.title));
  });

  it("uses the first sentence of the Profile description as each tile's summary", () => {
    expect(services.map((s) => s.summary)).toEqual(profile.map((p) => firstSentence(p.text)));
    for (const s of services) {
      expect(s.summary.length).toBeGreaterThan(0);
      expect(s.summary.length).toBeLessThanOrEqual(220);
    }
  });

  it('groups them into Build (5), Automate and Connect (3), Architect and Advise (4), Secure and Sustain (3)', () => {
    expect(serviceClusters.map((c) => c.title)).toEqual([
      'Build',
      'Automate and Connect',
      'Architect and Advise',
      'Secure and Sustain',
    ]);
    const sizes = serviceClusters.map((c) => services.filter((s) => s.cluster === c.id).length);
    expect(sizes).toEqual([5, 3, 4, 3]);
    // Cluster membership follows catalogue order.
    const order = services.map((s) => s.cluster);
    expect(order).toEqual([...order].sort((a, b) => serviceClusters.findIndex((c) => c.id === a) - serviceClusters.findIndex((c) => c.id === b)));
  });

  it('gives every tile an icon and a palette tone, so no two neighbours share a colour', () => {
    const tones = ['navy', 'deep', 'teal', 'cyan'];
    for (const s of services) {
      expect(s.icon).toBeTruthy();
      expect(tones).toContain(s.tone);
    }
    // Tones cycle, so adjacent tiles differ in 1-, 2- and 3-column grids.
    for (const gap of [1, 2, 3]) {
      for (let i = 0; i + gap < services.length; i++) {
        expect(services[i].tone).not.toBe(services[i + gap].tone);
      }
    }
  });

  it('has the section copy: "Built Around Your Business."', () => {
    expect(servicesSection.heading).toBe('Built Around Your Business.');
    expect(servicesSection.lead.length).toBeGreaterThan(40);
  });
});
