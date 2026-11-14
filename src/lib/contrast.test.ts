// @vitest-environment node
/**
 * Contrast engine tests
 * The engine is validated against the "script-verified" WCAG ratios published
 * in the brand Digest (§4.2) so the token tests built on it can be trusted.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import {
  contrastRatio,
  extractGradientStops,
  parseCssBlocks,
  parseDeclarations,
  resolveColor,
  toHex,
} from './contrast';

/** [foreground, background, ratio] copied from the Digest §4.2 table. */
const DIGEST_RATIOS: Array<[string, string, number]> = [
  ['#FEFEFE', '#223450', 12.43],
  ['#FEFEFE', '#1D4A68', 9.33],
  ['#FEFEFE', '#146F91', 5.61],
  ['#FEFEFE', '#099CC1', 3.19],
  ['#223450', '#099CC1', 3.9],
  ['#111111', '#099CC1', 5.88],
  ['#111111', '#00C0EC', 8.77],
  ['#223450', '#00C0EC', 5.82],
  ['#146F91', '#F2F2F2', 5.05],
  ['#00C0EC', '#223450', 5.82],
  ['#00C0EC', '#111111', 8.77],
  ['#223450', '#F2F2F2', 11.2],
  ['#FEFEFE', '#111111', 18.72],
  ['#02AF17', '#FEFEFE', 2.91],
  ['#5B6B80', '#FEFEFE', 5.39],
  ['#A9B7C6', '#223450', 6.13],
];

describe('contrastRatio', () => {
  it.each(DIGEST_RATIOS)('%s on %s is %s : 1 (matches the Digest)', (fg, bg, expected) => {
    expect(contrastRatio(fg, bg)).toBeCloseTo(expected, 1);
  });

  it('is symmetric and 21:1 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
  });
});

describe('resolveColor', () => {
  const tokens = {
    '--navy': '#223450',
    '--white': '#FEFEFE',
    '--fg': 'var(--navy)',
    '--muted': 'color-mix(in srgb, var(--navy) 78%, var(--white))',
    '--chain': 'var(--fg)',
  };

  it('parses short and long hex values', () => {
    expect(toHex(resolveColor('#fff', {}))).toBe('#ffffff');
    expect(toHex(resolveColor('#223450', {}))).toBe('#223450');
  });

  it('follows var() chains and fallbacks', () => {
    expect(toHex(resolveColor('var(--chain)', tokens))).toBe('#223450');
    expect(toHex(resolveColor('var(--missing, #ff0000)', tokens))).toBe('#ff0000');
  });

  it('throws on an unresolved variable rather than guessing', () => {
    expect(() => resolveColor('var(--missing)', tokens)).toThrow(/--missing/);
  });

  it('evaluates color-mix(in srgb) with one or two percentages', () => {
    // 78 % navy + 22 % white, channel by channel.
    expect(toHex(resolveColor('var(--muted)', tokens))).toBe('#526076');
    expect(toHex(resolveColor('color-mix(in srgb, #000000 50%, #ffffff)', {}))).toBe('#808080');
    expect(toHex(resolveColor('color-mix(in srgb, #000000, #ffffff)', {}))).toBe('#808080');
    expect(toHex(resolveColor('color-mix(in srgb, #000000 25%, #ffffff 75%)', {}))).toBe('#bfbfbf');
  });

  it('scales alpha by the percentages when they total less than 100 % (CSS Color 5), so a faded mix is never read as opaque', () => {
    // 30 % + 30 % of two opaque colours is a 60 %-opaque 50/50 blend, not an opaque one: a contrast
    // test fed the opaque value would pass for text that is really lighter than it looks.
    const [r, , b, alpha] = resolveColor('color-mix(in srgb, #ff0000 30%, #0000ff 30%)', {});
    expect(alpha).toBeCloseTo(0.6);
    expect(r).toBeCloseTo(127.5);
    expect(b).toBeCloseTo(127.5);
    // totals above 100 % are normalised and stay opaque
    expect(resolveColor('color-mix(in srgb, #ff0000 80%, #0000ff 80%)', {})[3]).toBeCloseTo(1);
    // exactly 100 % is untouched
    expect(resolveColor('color-mix(in srgb, #ff0000 60%, #0000ff 40%)', {})[3]).toBeCloseTo(1);
  });

  it('handles nested color-mix()', () => {
    const nested = 'color-mix(in srgb, color-mix(in srgb, #000000 50%, #ffffff) 50%, #ffffff)';
    // Intermediates stay in floating point, as in browsers: 127.5 -> 191.25 -> rounds to 191 (#bf).
    expect(toHex(resolveColor(nested, {}))).toBe('#bfbfbf');
  });
});

describe('CSS parsing', () => {
  const css = `
    /* a comment with { braces } */
    :root { --a: #111111; --b: color-mix(in srgb, var(--a) 50%, #ffffff); }
    .dark, [data-surface="dark"] { --a: #ffffff; }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  `;

  it('splits top-level blocks and selector lists', () => {
    const blocks = parseCssBlocks(css);
    expect(blocks.map((b) => b.selectors)).toEqual([
      [':root'],
      ['.dark', '[data-surface="dark"]'],
      ['@media (prefers-reduced-motion: reduce)'],
    ]);
  });

  it('ignores brace-less at-rule statements (@import, @source, @custom-variant) before a rule', () => {
    const withStatements = `
      @import "tailwindcss";
      @source not "../../docs";
      @custom-variant dark (&:is(.dark, .dark *));
      :root { --a: #111111; }
    `;
    expect(parseCssBlocks(withStatements).map((b) => b.selectors)).toEqual([[':root']]);
  });

  it('reads custom properties without tripping over commas inside functions', () => {
    const [root] = parseCssBlocks(css);
    expect(parseDeclarations(root.body)).toEqual({
      '--a': '#111111',
      '--b': 'color-mix(in srgb, var(--a) 50%, #ffffff)',
    });
  });

  it('extracts the colour stops of a linear gradient', () => {
    const stops = extractGradientStops(
      'linear-gradient(90deg, #233550 0%, #1D4F6C 20%, var(--x) 100%)',
      { '--x': '#01BFE7' },
    );
    expect(stops.map(toHex)).toEqual(['#233550', '#1d4f6c', '#01bfe7']);
  });
});
