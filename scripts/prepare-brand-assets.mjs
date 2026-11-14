#!/usr/bin/env node
/**
 * Brand asset pipeline
 * ---------------------------------------------------------------------------
 * Reads the approved 2026 brand masters from BRAND_SRC and writes ONLY
 * optimised derivatives into the repository. The masters themselves are never
 * copied or committed (they are 8334 px canvases and multi-megabyte photos);
 * speed is one of the brand's own digital-experience principles.
 *
 *   BRAND_SRC=... node scripts/prepare-brand-assets.mjs [--only=logos,photos]
 *   npm run assets
 *
 * Groups: logos | backgrounds | photos | team | icons | shapes | social
 *
 * Outputs
 *   public/brand/logo/*.png          trimmed, resized logos (+ all-white variants)
 *   public/brand/bg/*.webp           wave / panel artwork, 2560 px wide
 *   public/brand/photo/*.webp        nine brand photographs (<= 2400 px, <= 350 KB)
 *   public/brand/team/*.webp         transparent cut-outs (<= 1000 px tall, <= 120 KB)
 *   public/brand/icons/*.png         PWA icons
 *   src/app/{icon,apple-icon}.png, favicon.ico     Next.js icon conventions
 *   src/app/{opengraph,twitter}-image.png          1200 x 630 social card
 *   src/components/ui/shapePaths.ts  the six "Layout Shapes" traced to SVG paths
 *
 * The script is idempotent: the same masters always produce the same files.
 * It prints a size report and exits non-zero if any budget is exceeded.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_BRAND_SRC =
  String.raw`C:\Users\mwaif\OneDrive\Documents\Openavii Technologies Limited\BRANDING\Openavii`;
const BRAND_SRC = process.env.BRAND_SRC || DEFAULT_BRAND_SRC;

/** Masters are huge; do not let libvips cache them between operations. */
sharp.cache(false);

const GROUPS = ['logos', 'backgrounds', 'photos', 'team', 'icons', 'shapes', 'social'];
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const selected = onlyArg ? onlyArg.slice('--only='.length).split(',') : GROUPS;
const unknown = selected.filter((g) => !GROUPS.includes(g));
if (unknown.length) {
  console.error(`Unknown group(s): ${unknown.join(', ')}. Known: ${GROUPS.join(', ')}`);
  process.exit(1);
}

/** Palette hexes used for composed artwork (Digest §4.2). */
const COLOUR = { white: '#FEFEFE', cyanBright: '#00C0EC', depth: '#111111' };

const KB = 1024;
/** Every emitted file: { rel, width, height, kb, budgetKB }. */
const rows = [];

/* -------------------------------------------------------------------------- */
/* Small helpers                                                              */
/* -------------------------------------------------------------------------- */

/** Absolute path of a master, with a clear error when it cannot be read. */
function master(...segments) {
  const file = path.join(BRAND_SRC, ...segments);
  if (!existsSync(file)) {
    console.error(
      `\nBrand master not found:\n  ${file}\n\n` +
        `Set BRAND_SRC to the folder that contains "Brand Identity" and "Images".\n` +
        `Current BRAND_SRC: ${BRAND_SRC}\n`,
    );
    process.exit(1);
  }
  return file;
}

/** Open a master without the default pixel limit (8334 x 8334 canvases). */
const open = (file) => sharp(file, { limitInputPixels: false });

/** Write one derivative and record it for the size report. */
async function emit(rel, buffer, budgetKB) {
  const abs = path.join(ROOT, rel);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, buffer);
  const meta = /\.ico$/.test(rel) ? { width: 48, height: 48 } : await sharp(buffer).metadata();
  rows.push({
    rel: rel.replaceAll('\\', '/'),
    width: meta.width,
    height: meta.height,
    kb: buffer.length / KB,
    budgetKB,
  });
}

/**
 * Bounding box of the visible (alpha > threshold) pixels of a master.
 * The brand logos sit on 8334 px transparent canvases, so this is the "content
 * box" the guideline's proportions refer to.
 */
async function contentBox(file, threshold = 8) {
  const { data, info } = await open(file)
    .ensureAlpha()
    .extractChannel('alpha')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  let minX = W;
  let maxX = -1;
  let minY = H;
  let maxY = -1;
  for (let y = 0; y < H; y++) {
    const row = y * W;
    for (let x = 0; x < W; x++) {
      if (data[row + x] > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Palette-quantised PNG (small, alpha-preserving). */
const pngSmall = (pipeline, colours = 256) =>
  pipeline.png({ compressionLevel: 9, palette: true, quality: 92, effort: 10, colours, dither: 1 });

/**
 * Encode `raw` ({data, info}) as WebP at the highest quality (<= qualityMax)
 * that fits `maxBytes`, stepping the width down if even qualityMin is too big.
 * Returns the chosen buffer plus the parameters used, so the report is honest.
 */
async function webpToBudget(raw, { maxBytes, widths, qualityMax, qualityMin = 50, alpha = false }) {
  const base = () => sharp(raw.data, { raw: raw.info });
  const encode = (width, quality) => {
    let img = base();
    if (width !== raw.info.width) img = img.resize({ width, kernel: 'lanczos3' });
    return img
      .webp({ quality, alphaQuality: alpha ? 92 : 100, effort: 6, smartSubsample: true })
      .toBuffer();
  };
  for (const width of widths) {
    const top = await encode(width, qualityMax);
    if (top.length <= maxBytes) return { buffer: top, width, quality: qualityMax };
    let lo = qualityMin;
    let hi = qualityMax - 1;
    let best = null;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const buf = await encode(width, mid);
      if (buf.length <= maxBytes) {
        best = { buffer: buf, width, quality: mid };
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (best) return best;
  }
  throw new Error(`Could not fit within ${(maxBytes / KB).toFixed(0)} KB`);
}

/** Decode to raw pixels at (at most) `width`. */
async function rasterise(pipeline, width) {
  const { data, info } = await pipeline
    .resize({ width, withoutEnlargement: true, kernel: 'lanczos3' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

/* -------------------------------------------------------------------------- */
/* Logos                                                                      */
/* -------------------------------------------------------------------------- */

/** Set every visible pixel's RGB to white while keeping alpha (the approved all-white alternative). */
function toWhite({ data, info }) {
  const out = Buffer.from(data);
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * info.channels;
    out[o] = 255;
    out[o + 1] = 255;
    out[o + 2] = 255;
  }
  return sharp(out, { raw: info });
}

async function logos() {
  const dir = ['Brand Identity', 'Logo Files'];
  const specs = [
    { src: 'Main Logo@300x.png', out: 'openavii-logo', width: 960, budget: 40 },
    { src: 'Extended Mark@300x.png', out: 'openavii-extended', width: 1440, budget: 50 },
    { src: 'Mark@300x.png', out: 'openavii-mark', width: 512, budget: 40 },
  ];
  for (const spec of specs) {
    const file = master(...dir, spec.src);
    const box = await contentBox(file);
    // Trim to the content box, then resize. Lanczos keeps the ring's edge crisp.
    const colour = await rasterise(open(file).extract(box).ensureAlpha(), spec.width);
    await emit(
      `public/brand/logo/${spec.out}.png`,
      await pngSmall(sharp(colour.data, { raw: colour.info })).toBuffer(),
      spec.budget,
    );
    await emit(
      `public/brand/logo/${spec.out}-white.png`,
      await pngSmall(toWhite(colour)).toBuffer(),
      spec.budget,
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Background artwork                                                         */
/* -------------------------------------------------------------------------- */

async function backgrounds() {
  const dir = ['Brand Identity', 'Gradients', '300ppi'];
  const specs = [
    { src: 'Gradient 6.jpg', out: 'wave-dark', budget: 200 },
    { src: 'Gradient 5.jpg', out: 'wave-navy', budget: 200 },
    { src: 'Gradient 4.jpg', out: 'wave-light', budget: 150 },
    { src: 'Gradient 2.jpg', out: 'panel-brand', budget: 150 },
  ];
  for (const spec of specs) {
    const raw = await rasterise(open(master(...dir, spec.src)).removeAlpha(), 2560);
    const best = await webpToBudget(raw, {
      maxBytes: spec.budget * KB,
      widths: [2560],
      qualityMax: 94,
      qualityMin: 60,
    });
    await emit(`public/brand/bg/${spec.out}.webp`, best.buffer, spec.budget);
  }
}

/* -------------------------------------------------------------------------- */
/* Photography                                                                */
/* -------------------------------------------------------------------------- */

/** [master file, output name]. File names of the last two look like stock downloads: licence to be confirmed. */
const PHOTOS = [
  ['Asset 2.png', 'commuter-laptop'],
  ['Asset 3.png', 'delighted-phone'],
  ['Asset 4.png', 'office-win'],
  ['Asset 5.png', 'cafe-sunlight'],
  ['Asset 6.png', 'field-tablet'],
  ['Asset 7.png', 'phone-coffee'],
  ['Image 1.png', 'home-laptop'],
  ['business-partners-shaking-hands-agreement.jpg', 'partnership-handshake'],
  ['front-view-smiley-woman-working.jpg', 'greenhouse-smile'],
];

/** The PNG masters carry a 1 px non-opaque edge; 6 px is cropped to remove it with margin. */
const EDGE_CROP = 6;

async function photos() {
  for (const [srcName, outName] of PHOTOS) {
    const file = master('Images', 'Website Images', srcName);
    const meta = await open(file).metadata();
    const raw = await rasterise(
      open(file)
        .extract({
          left: EDGE_CROP,
          top: EDGE_CROP,
          width: meta.width - EDGE_CROP * 2,
          height: meta.height - EDGE_CROP * 2,
        })
        // Any remaining transparency is flattened onto the brand's depth colour.
        .flatten({ background: COLOUR.depth })
        .removeAlpha(),
      2400,
    );
    const best = await webpToBudget(raw, {
      maxBytes: 350 * KB,
      widths: [2400, 2200, 2000, 1800],
      qualityMax: 80,
      qualityMin: 60,
    });
    await emit(`public/brand/photo/${outName}.webp`, best.buffer, 350);
  }
}

async function team() {
  const people = [
    ['David.png', 'david'],
    ['Chanda.png', 'chanda'],
    ['Walasi Image.png', 'walasi'],
  ];
  for (const [srcName, outName] of people) {
    const file = master('Images', 'Team Photos', srcName);
    // Cut-outs keep their real transparency; only the height is capped.
    const { data, info } = await open(file)
      .ensureAlpha()
      .resize({ height: 1000, withoutEnlargement: true, kernel: 'lanczos3' })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const best = await webpToBudget(
      { data, info },
      { maxBytes: 120 * KB, widths: [info.width], qualityMax: 82, qualityMin: 55, alpha: true },
    );
    await emit(`public/brand/team/${outName}.webp`, best.buffer, 120);
  }
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

/** Assemble an .ico from PNG blobs (PNG-in-ICO is supported by every current browser). */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  let offset = 6 + 16 * entries.length;
  const directory = entries.map(({ size, buffer }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buffer.length;
    return entry;
  });
  return Buffer.concat([header, ...directory, ...entries.map((e) => e.buffer)]);
}

async function icons() {
  // The Mark Alternative is the white ring on the brand gradient: an opaque
  // square designed for exactly this use (Digest §6).
  const file = master('Brand Identity', 'Logo Files', 'Mark Alternative@300x-100.jpg');
  const square = (size) =>
    open(file).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer();

  await emit('src/app/icon.png', await square(512), 60);
  await emit('src/app/apple-icon.png', await square(180), 60);
  await emit('public/brand/icons/icon-192.png', await square(192), 60);
  await emit('public/brand/icons/icon-512.png', await square(512), 60);
  // Next/Turbopack decodes ICO entries as RGBA only, so add an (opaque) alpha channel.
  const squareRgba = (size) =>
    open(file)
      .resize(size, size, { kernel: 'lanczos3' })
      .ensureAlpha()
      .png({ compressionLevel: 9 })
      .toBuffer();
  const ico = buildIco(
    await Promise.all([16, 32, 48].map(async (size) => ({ size, buffer: await squareRgba(size) }))),
  );
  await emit('src/app/favicon.ico', ico, 60);
}

/* -------------------------------------------------------------------------- */
/* Shapes: trace the six "Layout Shapes" into normalised SVG paths            */
/* -------------------------------------------------------------------------- */

/** Moore-neighbour boundary trace of a binary mask; returns ordered boundary pixels. */
function traceBoundary(mask, W, H) {
  const fg = (x, y) => x >= 0 && y >= 0 && x < W && y < H && mask[y * W + x] === 1;
  // Neighbours in clockwise order (screen coordinates): W, NW, N, NE, E, SE, S, SW.
  const D = [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
  ];
  let sx = -1;
  let sy = -1;
  outer: for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (fg(x, y)) {
        sx = x;
        sy = y;
        break outer;
      }
    }
  }
  if (sx < 0) return [];
  const points = [];
  let px = sx;
  let py = sy;
  let back = 0; // direction index from p to its backtrack (background) pixel: start entered from the west
  let guard = W * H * 2;
  do {
    points.push([px, py]);
    let moved = false;
    for (let k = 1; k <= 8 && !moved; k++) {
      const idx = (back + k) % 8;
      const nx = px + D[idx][0];
      const ny = py + D[idx][1];
      if (fg(nx, ny)) {
        // The new backtrack is the neighbour examined just before the hit.
        const prev = (idx + 7) % 8;
        const bx = px + D[prev][0];
        const by = py + D[prev][1];
        px = nx;
        py = ny;
        back = D.findIndex(([dx, dy]) => px + dx === bx && py + dy === by);
        moved = true;
      }
    }
    if (!moved) break; // isolated pixel
  } while ((px !== sx || py !== sy) && --guard > 0);
  return points;
}

/** Ramer-Douglas-Peucker simplification of an open polyline. */
function rdp(points, epsilon) {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const len = Math.hypot(bx - ax, by - ay) || 1;
  let maxDist = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const dist = Math.abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / len;
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }
  if (maxDist <= epsilon) return [points[0], points[points.length - 1]];
  const left = rdp(points.slice(0, index + 1), epsilon);
  const right = rdp(points.slice(index), epsilon);
  return [...left.slice(0, -1), ...right];
}

/** Simplify a closed loop by splitting it at the point farthest from its start. */
function simplifyClosed(points, epsilon) {
  let far = 0;
  let best = -1;
  for (let i = 0; i < points.length; i++) {
    const d = Math.hypot(points[i][0] - points[0][0], points[i][1] - points[0][1]);
    if (d > best) {
      best = d;
      far = i;
    }
  }
  const a = rdp(points.slice(0, far + 1), epsilon);
  const b = rdp([...points.slice(far), points[0]], epsilon);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
}

async function shapes() {
  const RASTER_W = 1000;
  const out = {};
  for (let n = 1; n <= 6; n++) {
    const file = master('Brand Identity', 'Shapes', `Shape ${n}@300x.png`);
    const box = await contentBox(file, 128);
    const aspect = box.width / box.height;
    const H = Math.round(RASTER_W / aspect);
    const { data } = await open(file)
      .extract(box)
      .ensureAlpha()
      .extractChannel('alpha')
      .resize(RASTER_W, H, { fit: 'fill', kernel: 'lanczos3' })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const mask = new Uint8Array(RASTER_W * H);
    for (let i = 0; i < mask.length; i++) mask[i] = data[i] >= 128 ? 1 : 0;

    const boundary = traceBoundary(mask, RASTER_W, H);
    const loop = simplifyClosed(boundary, 1.1);
    // Normalise by the extent of the FULL boundary (pixel centres) so the path spans 0..1,
    // clamping the few simplified vertices that could land a hair outside.
    let x0 = Infinity;
    let x1 = -Infinity;
    let y0 = Infinity;
    let y1 = -Infinity;
    for (const [x, y] of boundary) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    const unit = (v, lo, hi) => Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
    const fmt = (v) => v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '') || '0';
    const d =
      loop
        .map(([x, y], i) => `${i ? 'L' : 'M'}${fmt(unit(x, x0, x1))} ${fmt(unit(y, y0, y1))}`)
        .join('') + 'Z';
    out[`shape-${n}`] = { aspect: Number(aspect.toFixed(3)), path: d };
  }

  const body = Object.entries(out)
    .map(
      ([id, s]) =>
        `  '${id}': {\n    /** Native width:height ratio of the approved artwork. */\n    aspect: ${s.aspect},\n    path: '${s.path}',\n  },`,
    )
    .join('\n');
  const ts = `/**
 * Brand shape outlines
 * AUTO-GENERATED by scripts/prepare-brand-assets.mjs from the approved
 * "Layout Shapes" artwork (Brand Identity/Shapes/Shape N@300x.png).
 * Do not edit by hand - re-run \`npm run assets -- --only=shapes\`.
 *
 * Paths use normalised 0-1 coordinates so they work as
 * <clipPath clipPathUnits="objectBoundingBox">, which lets a photograph be
 * framed in a brand shape without an extra mask-image request on the LCP element.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

export const SHAPES = {
${body}
} as const;

/** Identifier of one of the six approved shapes. */
export type ShapeId = keyof typeof SHAPES;
`;
  const rel = 'src/components/ui/shapePaths.ts';
  await fs.writeFile(path.join(ROOT, rel), ts);
  rows.push({ rel, width: '-', height: '-', kb: ts.length / KB, budgetKB: 30 });
}

/* -------------------------------------------------------------------------- */
/* Social card (Open Graph / Twitter), 1200 x 630                             */
/* -------------------------------------------------------------------------- */

/** Render Pango markup with a brand font file; returns { input, width, height }. */
async function typeset(markup, fontName, fontfile, extra = {}) {
  const { data, info } = await sharp({
    text: { text: markup, font: fontName, fontfile, rgba: true, ...extra },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { input: data, width: info.width, height: info.height };
}

async function social() {
  const W = 1200;
  const H = 630;
  const M = 72; // outer margin (also satisfies the logo's clear-space rule)
  const fonts = master('Brand Identity', 'Fonts', 'Geist');
  const extraBold = path.join(fonts, 'Geist-ExtraBold.ttf');
  const light = path.join(fonts, 'Geist-Light.ttf');
  const bold = path.join(fonts, 'Geist-Bold.ttf');
  master('Brand Identity', 'Fonts', 'Geist', 'Geist-ExtraBold.ttf');

  // 1. Background: the "black wave" gradient (Premium), cropped to the card.
  const wave = await open(master('Brand Identity', 'Gradients', '300ppi', 'Gradient 6.jpg'))
    .resize(W, H, { fit: 'cover', position: 'right' })
    .removeAlpha()
    .toBuffer();

  // 2. Navy/black scrim on the text side so type never sits on a bright wave.
  const scrim = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
       <defs><linearGradient id="s" x1="0" x2="1" y1="0" y2="0">
         <stop offset="0" stop-color="${COLOUR.depth}" stop-opacity="0.82"/>
         <stop offset="0.62" stop-color="${COLOUR.depth}" stop-opacity="0.35"/>
         <stop offset="1" stop-color="${COLOUR.depth}" stop-opacity="0"/>
       </linearGradient>
       <linearGradient id="d" x1="0" x2="1" y1="0" y2="0">
         <stop offset="0" stop-color="#233550"/><stop offset="0.2" stop-color="#1D4F6C"/>
         <stop offset="0.4" stop-color="#156C8C"/><stop offset="0.6" stop-color="#0E88AB"/>
         <stop offset="0.8" stop-color="#07A5CB"/><stop offset="1" stop-color="#01BFE7"/>
       </linearGradient></defs>
       <rect width="${W}" height="${H}" fill="url(#s)"/>
       <rect x="${M}" y="${M}" width="132" height="6" fill="url(#d)"/>
     </svg>`,
  );

  // 3. Headline (two-tone, tight tracking like the site's H1) and sub line.
  const tracking = Math.round(-0.04 * 96 * 1024);
  const line1 = await typeset(
    `<span foreground="${COLOUR.white}" letter_spacing="${tracking}">The Right Technology</span>`,
    'Geist ExtraBold 96',
    extraBold,
  );
  const line2 = await typeset(
    `<span foreground="${COLOUR.cyanBright}" letter_spacing="${tracking}">Changes Everything.</span>`,
    'Geist ExtraBold 96',
    extraBold,
  );
  const sub = await typeset(
    `<span foreground="${COLOUR.white}">Better customer experiences. Faster operations.</span>`,
    'Geist Light 34',
    light,
  );
  const url = await typeset(
    `<span foreground="${COLOUR.white}">www.openavii.com</span>`,
    'Geist Bold 30',
    bold,
  );

  // 4. The approved extended white logo, bottom-left (clear space >= 1/3 of its height).
  const logoWidth = 520;
  const logo = await sharp(
    path.join(ROOT, 'public/brand/logo/openavii-extended-white.png'),
  )
    .resize({ width: logoWidth })
    .toBuffer({ resolveWithObject: true });

  const top1 = M + 44;
  const lineGap = Math.round(line1.height * 0.92);
  const logoTop = H - M - logo.info.height;
  const layers = [
    { input: scrim, left: 0, top: 0 },
    { input: line1.input, left: M, top: top1 },
    { input: line2.input, left: M, top: top1 + lineGap },
    { input: sub.input, left: M, top: top1 + lineGap * 2 + 22 },
    { input: logo.data, left: M, top: logoTop },
    {
      input: url.input,
      left: W - M - url.width,
      top: logoTop + Math.round((logo.info.height - url.height) / 2),
    },
  ];

  const card = sharp(wave).composite(layers);
  // Smooth dark gradients band badly in 24-bit PNG at this size; a dithered
  // palette keeps the card under budget. Tighten the palette until it fits.
  let buffer = null;
  for (const colours of [256, 192, 128, 96, 64]) {
    buffer = await card
      .clone()
      .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10, colours, dither: 1 })
      .toBuffer();
    if (buffer.length <= 195 * KB) break;
  }
  await emit('src/app/opengraph-image.png', buffer, 200);
  await emit('src/app/twitter-image.png', buffer, 200);
}

/* -------------------------------------------------------------------------- */
/* Run                                                                        */
/* -------------------------------------------------------------------------- */

const RUNNERS = { logos, backgrounds, photos, team, icons, shapes, social };

console.log(`Brand masters: ${BRAND_SRC}`);
const started = Date.now();
// `social` needs the white extended logo, so it always runs after `logos`.
for (const group of GROUPS.filter((g) => selected.includes(g))) {
  const t = Date.now();
  process.stdout.write(`> ${group} ... `);
  await RUNNERS[group]();
  console.log(`${((Date.now() - t) / 1000).toFixed(1)}s`);
}

console.log('\nOutput'.padEnd(54) + 'Size'.padEnd(12) + 'KB'.padStart(8) + 'Budget'.padStart(9));
let over = 0;
for (const r of rows) {
  const flag = r.budgetKB && r.kb > r.budgetKB ? '  OVER' : '';
  if (flag) over++;
  console.log(
    r.rel.padEnd(53) +
      `${r.width}x${r.height}`.padEnd(12) +
      r.kb.toFixed(1).padStart(8) +
      String(r.budgetKB ?? '').padStart(9) +
      flag,
  );
}
const total = rows.reduce((sum, r) => sum + r.kb, 0);
console.log(`\n${rows.length} files, ${(total / KB).toFixed(2)} MB total, ${((Date.now() - started) / 1000).toFixed(1)}s`);
if (over) {
  console.error(`\n${over} file(s) exceed their byte budget.`);
  process.exit(2);
}
