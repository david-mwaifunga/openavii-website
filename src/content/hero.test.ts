// @vitest-environment node
/**
 * Hero contract (Digest §1 campaign line, §3 pillars)
 * The H1 and sub-line are the brand's campaign line verbatim; the four
 * pillars are the messaging framework's own words.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { digestLine, digestSection, plain, tableRows } from '@/test/digest';
import { hero } from './hero';

const campaign = plain(
  tableRows(digestSection('1. Company facts')).find((r) => r[0] === 'Campaign line')?.[1] ?? '',
);
const [campaignHeadline, campaignSub] = campaign.split(' / ');

describe('hero', () => {
  it('uses the campaign line as the headline, split over two lines', () => {
    expect(hero.headline).toEqual(['The Right Technology', 'Changes Everything.']);
    expect(hero.headline.join(' ')).toBe(campaignHeadline);
    expect(hero.sub).toBe(campaignSub);
  });

  it('opens with the company and place', () => {
    expect(hero.eyebrow).toBe('OPENAVII TECHNOLOGIES · LUSAKA, ZAMBIA');
  });

  it('offers a quote first and the services second', () => {
    expect(hero.primaryCta).toBe('Get a Quote');
    expect(hero.secondaryCta).toEqual({ label: 'See What We Do', href: '#services' });
  });

  it('has the four messaging pillars in order, each with a one-liner', () => {
    const pillars = plain(digestLine('**Supporting pillars [DOC]** — ')).replace(/\.$/, '').split(' · ');
    expect(pillars).toEqual(['We Understand', 'We Simplify', 'We Build', 'We Partner']);
    expect(hero.pillars.map((p) => p.title)).toEqual(pillars);
    for (const p of hero.pillars) expect(p.text.length).toBeGreaterThan(20);
  });
});
