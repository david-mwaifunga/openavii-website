// @vitest-environment node
/**
 * Process contract (Digest §7.3, Company Profile pp. 7 and 17)
 * Five phases (Discover. Design. Develop. Deliver. Evolve.) carrying the
 * Profile's seven stages verbatim, each stage in exactly one phase.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { bulletItems, digestLine, digestSection, plain } from '@/test/digest';
import { approach, phases, processClosing, processHeading, stages } from './process';

const profile = bulletItems(digestSection('7.3'));

/** Digest §7.3 mapping of the 7 stages onto the 5 phases. */
const MAPPING: Record<string, string> = {
  Discovery: 'Discover',
  'Strategy and Planning': 'Discover',
  'Design and User Experience': 'Design',
  Development: 'Develop',
  'Testing and Quality Assurance': 'Develop',
  Deployment: 'Deliver',
  'Support and Continuous Improvement': 'Evolve',
};

describe('process', () => {
  it('has the five phases of the Profile headline, in order', () => {
    expect(phases.map((p) => p.label)).toEqual(['Discover', 'Design', 'Develop', 'Deliver', 'Evolve']);
    expect(processHeading).toBe('Discover. Design. Develop. Deliver. Evolve.');
  });

  it('has the seven Profile stages with their exact titles and descriptions', () => {
    expect(profile).toHaveLength(7);
    expect(stages.map((s) => s.title)).toEqual(profile.map((p) => p.title));
    expect(stages.map((s) => s.description)).toEqual(profile.map((p) => p.text));
  });

  it('maps every stage to exactly one phase, as the Digest specifies', () => {
    const labels = new Set(phases.map((p) => p.id));
    for (const stage of stages) {
      expect(labels.has(stage.phase)).toBe(true);
      const phaseLabel = phases.find((p) => p.id === stage.phase)?.label;
      expect(phaseLabel).toBe(MAPPING[stage.title]);
    }
    const placed = phases.flatMap((p) => stages.filter((s) => s.phase === p.id).map((s) => s.title));
    expect(placed.sort()).toEqual(stages.map((s) => s.title).sort());
  });

  it('keeps the approach statement and paragraph verbatim', () => {
    expect(approach.lines).toEqual(['Understand First.', 'Build Second.', 'Improve Continuously.']);
    const paragraph = plain(digestLine('**Approach [DOC, Profile PDF p.7]** — ')).replace(
      /^Understand First\. Build Second\. Improve Continuously\.\s*/,
      '',
    );
    expect(approach.paragraph).toBe(paragraph);
  });

  it('closes with the Profile\'s transparency statement and the journey call to action', () => {
    expect(processClosing.statement).toBe(
      'Every Openavii project is built on transparency, collaboration and innovation, transforming ideas into reliable digital solutions that create lasting business impact.',
    );
    expect(processClosing.cta).toBe('Start Your Digital Journey');
  });
});
