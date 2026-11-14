// @vitest-environment node
/**
 * Photography and logo manifest contract
 * Every image the site shows is declared once, with factual alt text and the
 * intrinsic size of the optimised file (so next/image reserves space and the
 * layout never shifts). Sizes are checked against the files themselves.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { logos, photos } from './photos';
import { team } from './team';

const publicDir = fileURLToPath(new URL('../../public', import.meta.url));
const onDisk = (src: string) => path.join(publicDir, src);

/** Alt text from Prompt §5: factual descriptions of what each photograph shows. */
const ALT: Record<string, string> = {
  'commuter-laptop':
    'A man works on a laptop on an evening train, warm light against blue-teal windows',
  'delighted-phone': 'A woman reacts with delight to good news on her phone in a modern office',
  'office-win': 'A man in a blue shirt celebrates a win at his laptop in a bright office',
  'cafe-sunlight': 'A smiling man works on a laptop under a sunlit pergola',
  'field-tablet': 'A farm manager records data on a tablet in a greenhouse field',
  'phone-coffee': 'A man in an orange sweater smiles at his phone over coffee',
  'home-laptop': 'A mother works on a laptop at home while holding her baby',
  'partnership-handshake': 'Business partners shake hands to seal an agreement',
  'greenhouse-smile': 'A smiling woman in work overalls stands in a greenhouse',
};

describe('photos', () => {
  it('declares the nine brand photographs', () => {
    expect(Object.keys(photos).sort()).toEqual(Object.keys(ALT).sort());
  });

  it.each(Object.entries(ALT))('%s has factual alt text and its file exists', (id, alt) => {
    const photo = photos[id as keyof typeof photos];
    expect(photo.alt).toBe(alt);
    expect(photo.alt.length).toBeLessThanOrEqual(125);
    expect(photo.src).toBe(`/brand/photo/${id}.webp`);
    expect(fs.existsSync(onDisk(photo.src))).toBe(true);
  });

  it.each(Object.keys(ALT))('%s declares the real pixel size of its file', async (id) => {
    const photo = photos[id as keyof typeof photos];
    const meta = await sharp(onDisk(photo.src)).metadata();
    expect([photo.width, photo.height]).toEqual([meta.width, meta.height]);
  });
});

describe('team photos', () => {
  it.each(team.map((p) => [p.name, p] as const))('%s declares the real size of the cut-out', async (_name, person) => {
    const meta = await sharp(onDisk(person.photo)).metadata();
    expect([person.width, person.height]).toEqual([meta.width, meta.height]);
  });
});

describe('logos', () => {
  it.each(Object.entries(logos))('%s declares real sizes for both tones', async (_name, logo) => {
    for (const tone of ['colour', 'white'] as const) {
      const meta = await sharp(onDisk(logo[tone])).metadata();
      expect([logo.width, logo.height]).toEqual([meta.width, meta.height]);
    }
  });

  it('keeps the minimum logo width of 120 px from the brand guideline', () => {
    expect(logos.full.minWidth).toBeGreaterThanOrEqual(120);
    expect(logos.extended.minWidth).toBeGreaterThanOrEqual(120);
    expect(logos.mark.minWidth).toBeGreaterThanOrEqual(24);
  });
});
