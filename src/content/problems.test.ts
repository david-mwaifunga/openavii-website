// @vitest-environment node
/**
 * "Find the Fix" problem band contract (Digest §7.1)
 * Six problem-to-fix cards whose headline, body and call to action are the
 * social creatives' own words, each pointing at real services.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { digestSection, tableRows } from '@/test/digest';
import { explore, problems, problemsSection } from './problems';
import { services } from './services';

const rows = tableRows(digestSection('7.1'));
const row = (n: number) => rows[n - 1];

/** [Digest row number, services it links to] from Prompt §3.2. */
const EXPECTED: Array<[number, string[]]> = [
  [5, ['automation']],
  [11, ['custom-software', 'maintenance-support']],
  [7, ['integration-apis']],
  [8, ['dashboards']],
  [3, ['solution-architecture', 'database-design']],
  [9, ['maintenance-support', 'security-performance']],
];

describe('problems', () => {
  it('has six cards in the agreed order', () => {
    expect(problems).toHaveLength(6);
  });

  it.each(EXPECTED.map((e, i) => [i, ...e] as const))(
    'card %i is Digest row %i verbatim and links to %j',
    (index, digestRow, targets) => {
      const [, headline, body, cta] = row(digestRow);
      expect(problems[index].headline).toBe(headline);
      expect(problems[index].body).toBe(body);
      expect(problems[index].cta).toBe(cta);
      expect(problems[index].targets).toEqual(targets);
    },
  );

  it('only links to services that exist', () => {
    const slugs = new Set(services.map((s) => s.slug));
    for (const p of problems) {
      expect(p.targets.length).toBeGreaterThan(0);
      for (const target of p.targets) expect(slugs.has(target)).toBe(true);
    }
  });

  it('has unique ids', () => {
    expect(new Set(problems.map((p) => p.id)).size).toBe(6);
  });

  it('opens with the brand\'s own problem-first headline (Digest row 2)', () => {
    const [, headline, body] = row(2);
    expect(`${problemsSection.heading.plain} ${problemsSection.heading.accent}`).toBe(`${headline}.`);
    expect(problemsSection.heading.accent).toBe('Technology Problem.');
    expect(problemsSection.eyebrow).toBe('FIND THE FIX');
    expect(problemsSection.lead).toBe(`${body} Let's find the fix.`);
  });

  it('closes with the "Explore Solutions" pull-quote (Digest row 12) pointing at How We Work', () => {
    const [, headline, body, cta] = row(12);
    expect(explore).toEqual({ headline, body, cta, href: '#approach' });
  });
});
