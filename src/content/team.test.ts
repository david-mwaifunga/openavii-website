// @vitest-environment node
/**
 * Team contract (Digest §1 leadership, §7.7)
 * Three people, names and titles exactly as documented. No bios, no surnames
 * (the only surname the brand documents give is the designer credit).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import { digestSection, plain, tableRows } from '@/test/digest';
import { team, teamSection } from './team';

const leadership = tableRows(digestSection('1. Company facts')).find((r) => r[0] === 'Leadership');
const documented = plain(leadership?.[1] ?? '')
  .split(' · ')
  .map((entry) => {
    const [name, title] = entry.split(' — ');
    return { name: name.trim(), title: title.replace(/\s*\(.*$/, '').trim() };
  });

describe('team', () => {
  it('has the three leaders with their documented titles, in order', () => {
    expect(documented).toEqual([
      { name: 'David', title: 'Chief Visionary Officer' },
      { name: 'Chanda', title: 'Director, Operations' },
      { name: 'Walasi', title: 'Director, Finance' },
    ]);
    expect(team.map(({ name, title }) => ({ name, title }))).toEqual(documented);
  });

  it('carries no bios and no surnames', () => {
    for (const person of team) {
      expect(Object.keys(person).sort()).toEqual(['alt', 'height', 'name', 'photo', 'slug', 'title', 'width']);
      expect(person.name).not.toMatch(/\s/);
    }
  });

  it('points each person at their transparent cut-out', () => {
    expect(team.map((p) => p.photo)).toEqual([
      '/brand/team/david.webp',
      '/brand/team/chanda.webp',
      '/brand/team/walasi.webp',
    ]);
    for (const p of team) expect(p.alt).toContain(p.name);
  });

  it('frames the section with the Profile line', () => {
    expect(teamSection.heading).toEqual({
      plain: 'A Team Built on',
      accent: 'Expertise, Integrity and Execution.',
    });
  });
});
