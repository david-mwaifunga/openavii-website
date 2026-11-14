// @vitest-environment node
/**
 * "Why Openavii" contract (Digest §7.6, Company Profile p. 19)
 * Six reasons, verbatim, with fixed slugs.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { digestSection, numberedItems } from '@/test/digest';
import { reasons, whySection } from './why';

const profile = numberedItems(digestSection('7.6'));

describe('why Openavii', () => {
  it('has six reasons with the Profile titles and descriptions verbatim', () => {
    expect(profile).toHaveLength(6);
    expect(reasons.map((r) => r.title)).toEqual(profile.map((p) => p.title));
    expect(reasons.map((r) => r.description)).toEqual(profile.map((p) => p.text));
  });

  it('uses the fixed slugs and an icon each', () => {
    expect(reasons.map((r) => r.slug)).toEqual([
      'business-first',
      'tailored',
      'secure-scalable',
      'end-to-end',
      'innovation-practicality',
      'long-term-support',
    ]);
    for (const r of reasons) expect(r.icon).toBeTruthy();
  });

  it('asks the question the section answers, in two tones', () => {
    expect(whySection.heading).toEqual({ plain: 'Why Choose', accent: 'Openavii?' });
  });

  it('pulls its closing statement straight from reason six', () => {
    expect(whySection.pullStatement).toBe("Our relationship doesn't end at launch.");
    expect(reasons[5].description).toContain(whySection.pullStatement);
  });
});
