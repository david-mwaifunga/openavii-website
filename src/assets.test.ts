// @vitest-environment node
/**
 * Brand asset contract
 * Verifies that `npm run assets` (scripts/prepare-brand-assets.mjs) has
 * produced every optimised derivative the site needs, within its byte budget
 * and at the right dimensions, and that nothing outdated or oversized is left
 * in `public/`. The manifest below is the contract; the script is the
 * implementation. Speed is a brand principle, so budgets are enforced here.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const abs = (rel: string) => path.join(ROOT, rel);
const kb = (rel: string) => fs.statSync(abs(rel)).size / 1024;

/** Hard ceiling for any single file in public/ (Prompt §6.5). */
const PUBLIC_FILE_CEILING_KB = 400;

interface RasterSpec {
  file: string;
  maxKB: number;
  /** Exact width, or the maximum when `widthIsMax` is true. */
  width: number;
  widthIsMax?: boolean;
  /** Expected width:height ratio (content box of the approved artwork). */
  aspect?: number;
}

const LOGOS: RasterSpec[] = [
  { file: 'public/brand/logo/openavii-logo.png', maxKB: 40, width: 960, aspect: 4975 / 1453 },
  { file: 'public/brand/logo/openavii-logo-white.png', maxKB: 40, width: 960, aspect: 4975 / 1453 },
  { file: 'public/brand/logo/openavii-extended.png', maxKB: 50, width: 1440, aspect: 5155 / 912 },
  { file: 'public/brand/logo/openavii-extended-white.png', maxKB: 50, width: 1440, aspect: 5155 / 912 },
  { file: 'public/brand/logo/openavii-mark.png', maxKB: 40, width: 512, aspect: 4381 / 4271 },
  { file: 'public/brand/logo/openavii-mark-white.png', maxKB: 40, width: 512, aspect: 4381 / 4271 },
];

const BACKGROUNDS: RasterSpec[] = [
  { file: 'public/brand/bg/wave-dark.webp', maxKB: 200, width: 2560 },
  { file: 'public/brand/bg/wave-navy.webp', maxKB: 200, width: 2560 },
  { file: 'public/brand/bg/wave-light.webp', maxKB: 150, width: 2560 },
  { file: 'public/brand/bg/panel-brand.webp', maxKB: 150, width: 2560 },
];

const PHOTO_NAMES = [
  'commuter-laptop',
  'delighted-phone',
  'office-win',
  'cafe-sunlight',
  'field-tablet',
  'phone-coffee',
  'home-laptop',
  'partnership-handshake',
  'greenhouse-smile',
] as const;

const PHOTOS: RasterSpec[] = PHOTO_NAMES.map((name) => ({
  file: `public/brand/photo/${name}.webp`,
  maxKB: 350,
  width: 2400,
  widthIsMax: true,
}));

const TEAM_NAMES = ['david', 'chanda', 'walasi'] as const;
const TEAM = TEAM_NAMES.map((name) => `public/brand/team/${name}.webp`);

const ICONS: Array<{ file: string; size: number }> = [
  { file: 'src/app/icon.png', size: 512 },
  { file: 'src/app/apple-icon.png', size: 180 },
  { file: 'public/brand/icons/icon-192.png', size: 192 },
  { file: 'public/brand/icons/icon-512.png', size: 512 },
];

const SOCIAL = ['src/app/opengraph-image.png', 'src/app/twitter-image.png'];

/** Files from the outdated identity and the create-next-app boilerplate. */
const LEGACY = [
  'public/Openavii-Dark.png',
  'public/Openavii-Light.png',
  'public/favicon.png',
  'public/favicon.ico',
  'public/icon-512.png',
  'public/apple-touch-icon.png',
  'public/slide-images',
  'public/file.svg',
  'public/globe.svg',
  'public/next.svg',
  'public/window.svg',
];

/** Recursively list files under a directory. */
function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

describe('logo derivatives', () => {
  it.each(LOGOS)('$file exists, is within budget and has the approved proportions', async (spec) => {
    expect(fs.existsSync(abs(spec.file)), `${spec.file} is missing - run npm run assets`).toBe(true);
    expect(kb(spec.file)).toBeLessThanOrEqual(spec.maxKB);

    const meta = await sharp(abs(spec.file)).metadata();
    expect(meta.width).toBe(spec.width);
    expect(meta.hasAlpha).toBe(true);
    // Trimmed to the content box: the ratio must match the approved artwork.
    expect((meta.width ?? 0) / (meta.height ?? 1)).toBeCloseTo(spec.aspect ?? 0, 1);
  });

  it.each(LOGOS)('$file is trimmed to its content box (no transparent padding)', async (spec) => {
    const { data, info } = await sharp(abs(spec.file))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const alphaAt = (x: number, y: number) => data[(y * info.width + x) * 4 + 3];
    let minX = info.width;
    let maxX = 0;
    let minY = info.height;
    let maxY = 0;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (alphaAt(x, y) > 8) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    expect(minX).toBeLessThanOrEqual(4);
    expect(minY).toBeLessThanOrEqual(4);
    expect(info.width - 1 - maxX).toBeLessThanOrEqual(4);
    expect(info.height - 1 - maxY).toBeLessThanOrEqual(4);
  });

  it.each(LOGOS.filter((l) => l.file.endsWith('-white.png')))(
    '$file is the approved all-white alternative (every visible pixel is white)',
    async (spec) => {
      const { data, info } = await sharp(abs(spec.file))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      let visible = 0;
      for (let i = 0; i < info.width * info.height; i++) {
        const o = i * 4;
        if (data[o + 3] > 0) {
          visible++;
          expect(Math.min(data[o], data[o + 1], data[o + 2])).toBeGreaterThanOrEqual(250);
        }
      }
      expect(visible).toBeGreaterThan(1000);
    },
  );
});

describe('background artwork', () => {
  it.each(BACKGROUNDS)('$file exists within $maxKB KB at 2560 px wide', async (spec) => {
    expect(fs.existsSync(abs(spec.file)), `${spec.file} is missing - run npm run assets`).toBe(true);
    expect(kb(spec.file)).toBeLessThanOrEqual(spec.maxKB);
    expect((await sharp(abs(spec.file)).metadata()).width).toBe(spec.width);
  });
});

describe('brand photography', () => {
  it.each(PHOTOS)('$file exists within 350 KB and at most 2400 px wide', async (spec) => {
    expect(fs.existsSync(abs(spec.file)), `${spec.file} is missing - run npm run assets`).toBe(true);
    expect(kb(spec.file)).toBeLessThanOrEqual(spec.maxKB);
    const meta = await sharp(abs(spec.file)).metadata();
    expect(meta.format).toBe('webp');
    expect(meta.width ?? 0).toBeLessThanOrEqual(spec.width);
    // Wide enough for a full-bleed hero on a 1440 px laptop.
    expect(meta.width ?? 0).toBeGreaterThanOrEqual(1600);
  });

  it.each(TEAM)('%s keeps its transparent background, is <= 1000 px tall and <= 120 KB', async (file) => {
    expect(fs.existsSync(abs(file)), `${file} is missing - run npm run assets`).toBe(true);
    expect(kb(file)).toBeLessThanOrEqual(120);
    const meta = await sharp(abs(file)).metadata();
    expect(meta.hasAlpha).toBe(true);
    expect(meta.height ?? 0).toBeLessThanOrEqual(1000);
    const stats = await sharp(abs(file)).stats();
    // A real cut-out has fully transparent pixels (alpha channel minimum is 0).
    expect(stats.channels[3].min).toBe(0);
  });
});

describe('icons and social images', () => {
  it.each(ICONS)('$file is a $size x $size square', async ({ file, size }) => {
    expect(fs.existsSync(abs(file)), `${file} is missing - run npm run assets`).toBe(true);
    expect(kb(file)).toBeLessThanOrEqual(60);
    const meta = await sharp(abs(file)).metadata();
    expect([meta.width, meta.height]).toEqual([size, size]);
  });

  it('favicon.ico bundles 16, 32 and 48 px icons', () => {
    const file = 'src/app/favicon.ico';
    expect(fs.existsSync(abs(file)), `${file} is missing - run npm run assets`).toBe(true);
    const buf = fs.readFileSync(abs(file));
    expect(buf.readUInt16LE(0)).toBe(0); // reserved
    expect(buf.readUInt16LE(2)).toBe(1); // type: icon
    const count = buf.readUInt16LE(4);
    const sizes = Array.from({ length: count }, (_, i) => buf[6 + i * 16]).sort((a, b) => a - b);
    expect(sizes).toEqual([16, 32, 48]);
  });

  it('favicon.ico embeds RGBA PNGs (Next/Turbopack refuses RGB-only entries)', () => {
    const buf = fs.readFileSync(abs('src/app/favicon.ico'));
    const count = buf.readUInt16LE(4);
    for (let i = 0; i < count; i++) {
      const length = buf.readUInt32LE(6 + i * 16 + 8);
      const offset = buf.readUInt32LE(6 + i * 16 + 12);
      const png = buf.subarray(offset, offset + length);
      expect(png.subarray(1, 4).toString('latin1')).toBe('PNG');
      // IHDR colour type lives at byte 25 of a PNG file: 6 = truecolour + alpha.
      expect(png[25], `entry ${i} colour type`).toBe(6);
    }
  });

  it.each(SOCIAL)('%s is a 1200 x 630 card within 200 KB', async (file) => {
    expect(fs.existsSync(abs(file)), `${file} is missing - run npm run assets`).toBe(true);
    expect(kb(file)).toBeLessThanOrEqual(200);
    const meta = await sharp(abs(file)).metadata();
    expect([meta.width, meta.height]).toEqual([1200, 630]);
  });
});

describe('brand shapes', () => {
  /**
   * The six approved "Layout Shapes" are traced from the supplied artwork into
   * normalised SVG paths (clipPathUnits="objectBoundingBox") so photos can be
   * framed without a mask-image request on the LCP element.
   */
  it('exports six traced, normalised shape paths with their native aspect ratios', async () => {
    const mod = (await import('@/components/ui/shapePaths')) as {
      SHAPES: Record<string, { path: string; aspect: number }>;
    };
    const ids = Object.keys(mod.SHAPES);
    expect(ids).toEqual(['shape-1', 'shape-2', 'shape-3', 'shape-4', 'shape-5', 'shape-6']);
    for (const id of ids) {
      const { path: d, aspect } = mod.SHAPES[id];
      expect(d.startsWith('M')).toBe(true);
      expect(d.endsWith('Z')).toBe(true);
      expect(aspect).toBeGreaterThan(1);
      // Every coordinate is inside the unit box.
      const numbers = d.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
      // A real outline, not a degenerate box: at least 10 vertices. shape-5 (a rectangle
      // with one convex edge) legitimately simplifies to 12; the curvier shapes need 20-40.
      expect(numbers.length).toBeGreaterThanOrEqual(20);
      for (const n of numbers) {
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('public/ hygiene', () => {
  it.each(LEGACY)('outdated or boilerplate asset %s has been deleted', (rel) => {
    expect(fs.existsSync(abs(rel)), `${rel} must be removed`).toBe(false);
  });

  it(`no file in public/ exceeds ${PUBLIC_FILE_CEILING_KB} KB (no raw brand masters)`, () => {
    const oversized = walk(abs('public'))
      .map((file) => ({ file: path.relative(ROOT, file), kb: fs.statSync(file).size / 1024 }))
      .filter((f) => f.kb > PUBLIC_FILE_CEILING_KB);
    expect(oversized).toEqual([]);
  });

  it('every /brand/... path referenced by the source resolves to a file in public/', () => {
    const sources = walk(abs('src')).filter(
      (f) => /\.(ts|tsx|css)$/.test(f) && !/\.test\.(ts|tsx)$/.test(f),
    );
    const pattern = /["'`(](\/brand\/[A-Za-z0-9._/-]+)["'`)]/g;
    const missing: string[] = [];
    for (const file of sources) {
      const text = fs.readFileSync(file, 'utf8');
      for (const match of text.matchAll(pattern)) {
        if (!fs.existsSync(abs(`public${match[1]}`))) {
          missing.push(`${path.relative(ROOT, file)} -> ${match[1]}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
