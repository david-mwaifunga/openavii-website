// @vitest-environment node
/**
 * "Who We Serve" contract (Digest §7.5, Company Profile pp. 8-9)
 * Seven sector cards. Six use the Profile's copy verbatim; NGOs have no
 * Profile copy, so that one line is new copy and registered as such.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { bulletItems, digestSection, plain } from '@/test/digest';
import { copyNew } from './copy';
import { sectors, sectorsSection } from './sectors';

const section = digestSection('7.5');
const profile = bulletItems(section).slice(0, 6);
const intro = plain(
  (section.split('\n').find((l) => /^\*[^*].*\*$/.test(l.trim())) as string).trim(),
);
// The closing paragraph sits after a bold title on the same line.
const closing = plain(
  (section.match(/\*\*A technology partner for every stage\*\*\s+—\s+\*(.+)\*/) as RegExpMatchArray)[1],
);

describe('sectors', () => {
  it('has seven sectors in the Digest order, NGOs last', () => {
    expect(sectors).toHaveLength(7);
    expect(sectors.map((s) => s.title)).toEqual([...profile.map((p) => p.title), 'NGOs']);
  });

  it('uses the Profile description verbatim for the six documented sectors', () => {
    expect(sectors.slice(0, 6).map((s) => s.description)).toEqual(profile.map((p) => p.text));
  });

  it('writes the NGO line as registered new copy, because the Profile has none', () => {
    const ngo = sectors[6];
    expect(ngo.description).toBe(
      'We help NGOs digitise operations and reporting so more of your effort goes into impact.',
    );
    expect(copyNew.map((c) => c.text)).toContain(ngo.description);
  });

  it('has unique slugs and an icon each', () => {
    expect(sectors.map((s) => s.slug)).toEqual([
      'smes',
      'corporate',
      'government',
      'education',
      'healthcare',
      'financial',
      'ngos',
    ]);
    for (const s of sectors) expect(s.icon).toBeTruthy();
  });

  it("frames the section with the Profile's own paragraphs", () => {
    expect(sectorsSection.heading).toBe('A Technology Partner for Every Stage.');
    expect(sectorsSection.intro).toBe(intro);
    expect(sectorsSection.closing).toBe(closing);
    expect(sectorsSection.closing.startsWith("Whether you're launching")).toBe(true);
  });
});
