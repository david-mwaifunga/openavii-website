// @vitest-environment node
/**
 * Copy rules (Digest §3 "Writing rules for the site")
 * Applies to EVERY string the content layer exports: British English, no banned
 * filler, no invented claims, no placeholders, no unapproved registrations,
 * and a registry of all new (non-Digest) copy so it can be approved.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AMERICAN_SPELLING, BANNED_FILLER, INVENTED_CLAIMS, UNAPPROVED_REGISTRATIONS } from '@/test/copyRules';
import * as content from './index';

interface Entry {
  path: string;
  text: string;
}

/** Keys holding machine values (ids, URLs, paths), not words a visitor reads. */
const MACHINE_KEYS = new Set([
  'src',
  'href',
  'url',
  'e164',
  'number',
  'domain',
  'email',
  'supportEmail',
  'id',
  'slug',
  'icon',
  'tone',
  'cluster',
  'phase',
  'targets',
  'photo',
  'logo',
  'colour',
  'white',
  'width',
  'height',
  'aspect',
  'anchorId',
  'minWidth',
  'countryCode',
  'locale',
  'platform',
  'copyNew',
  // HTML attribute token ("organization" is the standard spelling), not copy.
  'autoComplete',
]);

function collect(value: unknown, trail: string[], out: Entry[]): Entry[] {
  if (typeof value === 'string') {
    out.push({ path: trail.join('.'), text: value });
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => collect(item, [...trail, String(i)], out));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (!MACHINE_KEYS.has(key)) collect(item, [...trail, key], out);
    }
  }
  return out;
}

/** Whole exports that are machine vocabularies (icon names, section ids) or the registry itself. */
const MACHINE_EXPORTS = new Set(['copyNew', 'CONTENT_ICONS', 'UI_ICONS', 'sectionIds']);

const entries: Entry[] = Object.entries(content)
  .filter(([name, value]) => typeof value !== 'function' && !MACHINE_EXPORTS.has(name))
  .flatMap(([name, value]) => collect(value, [name], []));

/** Report every offending string with where it lives, so a failure is actionable. */
function offenders(pattern: RegExp): string[] {
  return entries
    .filter((e) => pattern.test(e.text))
    .map((e) => `${e.path}: "${e.text.slice(0, 80)}"`);
}

describe('the copy inventory', () => {
  it('actually finds the site copy (guard against a vacuous scan)', () => {
    expect(entries.length).toBeGreaterThan(150);
  });
});

describe('banned filler (Digest §3)', () => {
  it.each(BANNED_FILLER.map(([label, pattern]) => [label, pattern] as const))('contains no %s', (_label, pattern) => {
    expect(offenders(pattern)).toEqual([]);
  });
});

describe('British English', () => {
  it('has no American spellings', () => {
    expect(offenders(AMERICAN_SPELLING)).toEqual([]);
  });

  it('writes "enquiry" for the form, not the American "inquiry"', () => {
    expect(offenders(/\binquir/i)).toEqual([]);
  });
});

describe('never invented, never unapproved', () => {
  it('claims no statistics, years in business, counts, awards, certifications or testimonials', () => {
    for (const claim of INVENTED_CLAIMS) expect(offenders(claim), String(claim)).toEqual([]);
  });

  it('never shows pending registrations or the tax identifier', () => {
    expect(offenders(UNAPPROVED_REGISTRATIONS)).toEqual([]);
  });

  it('keeps the vision an aspiration: "most trusted" appears only in the vision statement', () => {
    const mentions = entries.filter((e) => /most trusted/i.test(e.text));
    expect(mentions).toHaveLength(1);
    expect(mentions[0].text).toBe(content.strategy.vision.text);
  });

  it('has no placeholders or stationery sample data', () => {
    expect(offenders(/lorem|ipsum|\bTODO\b|\bTBC\b|XXX|007 Somewhere|david@openavii/i)).toEqual([]);
  });

  it('puts no personal e-mail address anywhere', () => {
    expect(offenders(/gmail\.com|yahoo\.com|hotmail\.com/i)).toEqual([]);
  });
});

describe('hygiene', () => {
  it('has no leading or trailing whitespace and no double spaces', () => {
    const bad = entries.filter((e) => e.text !== e.text.trim() || /\s{2,}/.test(e.text));
    expect(bad.map((e) => e.path)).toEqual([]);
  });

  it('has no empty strings', () => {
    expect(entries.filter((e) => e.text.length === 0).map((e) => e.path)).toEqual([]);
  });
});

describe('COPY-NEW registry', () => {
  const contentDir = fileURLToPath(new URL('.', import.meta.url));
  const sources = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts') && f !== 'copy.ts')
    .map((f) => fs.readFileSync(path.join(contentDir, f), 'utf8'));

  const markers = sources.reduce((n, s) => n + (s.match(/\/\/ COPY-NEW/g)?.length ?? 0), 0);
  const calls = sources.reduce((n, s) => n + (s.match(/\bnewCopy\(/g)?.length ?? 0), 0);

  it('lists every piece of new copy for approval, with unique ids', () => {
    expect(content.copyNew.length).toBeGreaterThan(20);
    expect(new Set(content.copyNew.map((c) => c.id)).size).toBe(content.copyNew.length);
    for (const item of content.copyNew) {
      expect(item.text.length).toBeGreaterThan(0);
    }
  });

  it('is complete: every // COPY-NEW marker is registered, and every registration is marked', () => {
    expect(markers).toBe(calls);
    expect(content.copyNew).toHaveLength(calls);
  });

  it('registers text that is really on the site (nothing orphaned)', () => {
    const onSite = new Set(entries.map((e) => e.text));
    const orphans = content.copyNew.filter((c) => !onSite.has(c.text) && !entries.some((e) => e.text.includes(c.text)));
    expect(orphans.map((c) => c.id)).toEqual([]);
  });
});
