// @vitest-environment node
/**
 * "Who We Are" contract (Digest §7.4, §1 name rationale)
 * The two Profile paragraphs are verbatim; the headline and the name-meaning
 * captions are condensed from the guideline and so are registered new copy.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { digestSection, plain } from '@/test/digest';
import { about } from './about';
import { copyNew } from './copy';

const paragraphs = digestSection('7.4')
  .split('\n')
  .filter((l) => /^\*[^*].*\*$/.test(l.trim()))
  .map((l) => plain(l));

describe('about', () => {
  it('uses the two Company Profile paragraphs verbatim', () => {
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(about.paragraphs).toEqual(paragraphs.slice(0, 2));
  });

  it('headlines the section with the belief behind the brand', () => {
    expect(about.heading).toBe('Technology Should Simplify Challenges, Not Create Them.');
    expect(copyNew.map((c) => c.text)).toContain(about.heading);
  });

  it('explains the name Open / avi / i in three captions plus the ring footnote', () => {
    expect(about.nameMeaning.map((m) => m.term)).toEqual(['Open', 'Avi', 'i']);
    expect(about.nameMeaning.map((m) => m.gloss)).toEqual([
      'Openness, accessibility and trust.',
      'Light: illuminating complexity, guiding smarter decisions.',
      'Ideas: every meaningful innovation begins with a single insight.',
    ]);
    expect(about.ringFootnote).toBe('The open ring: nothing is hidden.');
  });
});
