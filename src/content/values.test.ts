// @vitest-environment node
/**
 * Strategy contract (Digest §2)
 * Vision, mission, purpose, promise, values and principles come from the
 * brand guideline. The vision is an aspiration and must never read as a
 * present-tense claim. Values are names only: the documents define none.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { capitalise, digestLine, digestSection, numberedItems, plain } from '@/test/digest';
import { principles, strategy, values } from './values';

describe('strategy statements', () => {
  it('quotes vision, mission, purpose and promise verbatim', () => {
    expect(strategy.vision.text).toBe(plain(digestLine('**Vision [DOC]** — ')));
    expect(strategy.mission.text).toBe(plain(digestLine('**Mission [DOC]** — ')));
    expect(strategy.purpose.text).toBe(plain(digestLine('**Purpose [DOC]** — ')));
    expect(strategy.promise).toBe(plain(digestLine('**Brand promise [DOC]** — ')));
  });

  it('labels the vision as a vision and keeps it an aspiration ("To become ...")', () => {
    expect(strategy.vision.label).toBe('Our vision');
    expect(strategy.vision.text.startsWith('To become Africa')).toBe(true);
    expect(strategy.vision.text).not.toMatch(/\b(is|are)\b.*most trusted/i);
  });

  it('has exactly the six core values, as names only', () => {
    expect(values).toHaveLength(6);
    expect(values.map((v) => v.name)).toEqual([
      'Innovation',
      'Integrity',
      'Excellence',
      'Simplicity',
      'Collaboration',
      'Impact',
    ]);
    for (const v of values) expect(Object.keys(v)).toEqual(['name']);
  });

  it('has the three principles with their one-liners', () => {
    const profile = numberedItems(digestSection('2. Strategy'));
    expect(profile).toHaveLength(3);
    expect(principles.map((p) => p.title)).toEqual(profile.map((p) => p.title));
    expect(principles.map((p) => p.text)).toEqual(profile.map((p) => capitalise(p.text)));
  });

  it('states the differentiator exactly as the positioning does', () => {
    expect(plain(digestLine('**Positioning [DOC]** — '))).toContain(strategy.differentiator);
    expect(strategy.differentiator).toBe(
      'Unlike many other technology providers that simply deliver software, Openavii begins by understanding the underlying business problem.',
    );
  });
});
