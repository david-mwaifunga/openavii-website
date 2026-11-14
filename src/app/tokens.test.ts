// @vitest-environment node
/**
 * Design-token contract
 * Parses the real `globals.css`, resolves custom properties the way a browser
 * would, and enforces the 2026 brand system: exact palette hexes, the required
 * semantic tokens in every colour context, WCAG 2.2 AA contrast for every
 * pairing the components use, motion rules and the removal of the old look.
 * Contrast is tested, not eyeballed (Prompt §1.6, §4.1).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  contrastRatio,
  extractGradientStops,
  parseCssBlocks,
  parseDeclarations,
  resolveColor,
  toHex,
  type TokenMap,
} from '@/lib/contrast';

const css = fs.readFileSync(fileURLToPath(new URL('./globals.css', import.meta.url)), 'utf8');
const blocks = parseCssBlocks(css);

/** Merge the declarations of every top-level block whose selector list contains `selector`. */
function declsFor(selector: string): TokenMap {
  const merged: TokenMap = {};
  for (const block of blocks) {
    if (block.selectors.includes(selector)) Object.assign(merged, parseDeclarations(block.body));
  }
  return merged;
}

const ROOT = declsFor(':root');

/** The four colour contexts a component can be rendered in. */
const CONTEXTS = {
  'light theme': { ...ROOT },
  'dark theme': { ...ROOT, ...declsFor('.dark') },
  'dark surface': { ...ROOT, ...declsFor('[data-surface="dark"]') },
  'brand surface': { ...ROOT, ...declsFor('[data-surface="brand"]') },
} satisfies Record<string, TokenMap>;
type ContextName = keyof typeof CONTEXTS;
const CONTEXT_NAMES = Object.keys(CONTEXTS) as ContextName[];

const AA = 4.5;
const LARGE_OR_UI = 3;

/** Digest §4.2 - the approved palette, verbatim. */
const PALETTE: Record<string, string> = {
  '--brand-navy': '#223450',
  '--brand-deep': '#1D4A68',
  '--brand-teal': '#146F91',
  '--brand-cyan': '#099CC1',
  '--brand-cyan-bright': '#00C0EC',
  '--brand-white': '#FEFEFE',
  '--brand-mist': '#F2F2F2',
  '--brand-depth': '#111111',
  '--brand-green': '#02AF17',
};

const REQUIRED_SEMANTIC = [
  '--page',
  '--surface',
  '--surface-alt',
  '--fg',
  '--fg-muted',
  '--heading',
  '--accent-text',
  '--accent-fill',
  '--on-accent',
  '--btn-primary-bg',
  '--btn-primary-fg',
  '--btn-primary-hover',
  '--line',
  '--focus',
] as const;

const ratio = (ctx: TokenMap, fg: string, bg: string) =>
  contrastRatio(resolveColor(`var(${fg})`, ctx), resolveColor(`var(${bg})`, ctx));

describe('raw palette', () => {
  it.each(Object.entries(PALETTE))('%s is exactly %s (Digest §4.2)', (name, hex) => {
    expect(ROOT[name]?.toUpperCase()).toBe(hex.toUpperCase());
  });

  it('keeps the section-divider gradient on the measured stops (Digest §4.3)', () => {
    const stops = extractGradientStops(ROOT['--grad-divider'], ROOT).map(toHex);
    expect(stops).toEqual(['#233550', '#1d4f6c', '#156c8c', '#0e88ab', '#07a5cb', '#01bfe7']);
  });
});

describe('semantic tokens', () => {
  it.each(CONTEXT_NAMES)('%s defines every required semantic token', (name) => {
    for (const token of REQUIRED_SEMANTIC) {
      expect(CONTEXTS[name][token], `${token} missing in ${name}`).toBeTruthy();
    }
  });

  it('semantic tokens reference only raw brand/theme tokens (keeps the resolver faithful to the browser)', () => {
    const declared: TokenMap[] = [
      ROOT,
      declsFor('.dark'),
      declsFor('[data-surface="dark"]'),
      declsFor('[data-surface="brand"]'),
    ];
    const offenders: string[] = [];
    for (const decls of declared) {
      for (const [name, value] of Object.entries(decls)) {
        if (!name.startsWith('--') || /^--(brand|grad|theme)-/.test(name)) continue;
        for (const ref of value.matchAll(/var\((--[\w-]+)/g)) {
          if (!/^--(brand|grad|theme)-/.test(ref[1])) offenders.push(`${name} -> ${ref[1]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('exposes theme-level page/alt colours that surfaces never redefine (used by curve dividers)', () => {
    for (const name of ['--theme-page', '--theme-alt']) {
      expect(declsFor('.dark')[name], `${name} must differ in dark`).toBeTruthy();
      expect(declsFor('[data-surface="dark"]')[name]).toBeUndefined();
      expect(declsFor('[data-surface="brand"]')[name]).toBeUndefined();
    }
  });
});

describe('WCAG 2.2 AA contrast of every semantic pairing', () => {
  /** [foreground, background, minimum ratio] - Prompt §4.1 plus the hover state. */
  const PAIRS: Array<[string, string, number]> = [
    ['--fg', '--page', AA],
    ['--fg', '--surface', AA],
    ['--fg', '--surface-alt', AA],
    ['--fg-muted', '--page', AA],
    ['--fg-muted', '--surface-alt', AA],
    ['--heading', '--page', AA],
    ['--accent-text', '--page', AA],
    ['--accent-text', '--surface-alt', AA],
    ['--btn-primary-fg', '--btn-primary-bg', AA],
    ['--btn-primary-fg', '--btn-primary-hover', AA],
    ['--on-accent', '--accent-fill', AA],
    ['--focus', '--page', LARGE_OR_UI],
  ];

  for (const name of CONTEXT_NAMES) {
    describe(name, () => {
      it.each(PAIRS)('%s on %s is at least %s : 1', (fg, bg, min) => {
        expect(ratio(CONTEXTS[name], fg, bg)).toBeGreaterThanOrEqual(min);
      });
    });
  }

  it('every colour stop of the brand band is AA for body text, muted text and accent text', () => {
    const ctx = CONTEXTS['brand surface'];
    const stops = extractGradientStops(ctx['--grad-band'], ctx);
    expect(stops.length).toBeGreaterThanOrEqual(2);
    for (const stop of stops) {
      for (const fg of ['--fg', '--fg-muted', '--heading', '--accent-text']) {
        expect(
          contrastRatio(resolveColor(`var(${fg})`, ctx), stop),
          `${fg} on band stop ${toHex(stop)}`,
        ).toBeGreaterThanOrEqual(AA);
      }
      expect(contrastRatio(resolveColor('var(--focus)', ctx), stop)).toBeGreaterThanOrEqual(
        LARGE_OR_UI,
      );
    }
  });

  it('fixed-colour service tiles keep AA text in rest and hover states (never white on #099CC1)', () => {
    for (const tone of ['navy', 'deep', 'teal', 'cyan', 'bright']) {
      for (const fg of ['fg', 'fg-muted']) {
        if (tone === 'bright' && fg === 'fg-muted') continue;
        const value = ratio(ROOT, `--tile-${tone}-${fg}`, `--tile-${tone}-bg`);
        expect(value, `tile ${tone} ${fg}`).toBeGreaterThanOrEqual(AA);
      }
    }
    // The accent tiles carry near-black text, as the brand rule requires.
    expect(toHex(resolveColor('var(--tile-cyan-fg)', ROOT))).toBe('#111111');
  });

  it('green is never used for text, buttons or states (it fails AA with white)', () => {
    const uses = [...css.matchAll(/var\(--brand-green\)/g)].length;
    expect(uses).toBe(0);
  });
});

describe('typography', () => {
  const theme = blocks
    .filter((b) => b.selectors[0]?.startsWith('@theme'))
    .map((b) => parseDeclarations(b.body))
    .reduce<TokenMap>((all, next) => Object.assign(all, next), {});
  const normalise = (v?: string) => v?.replace(/\s+/g, ' ').trim();

  it('uses the fluid scale from the brand system', () => {
    expect(normalise(theme['--text-h1'])).toBe('clamp(2.75rem, 1.2rem + 6.2vw, 6.5rem)');
    expect(normalise(theme['--text-h2'])).toBe('clamp(2.25rem, 1.2rem + 3.6vw, 4.75rem)');
    expect(normalise(theme['--text-h3'])).toBe('clamp(1.5rem, 1.1rem + 1.4vw, 2.25rem)');
    expect(normalise(theme['--text-lead'])).toBe('clamp(1.125rem, 1rem + 0.6vw, 1.5rem)');
    expect(theme['--text-h1--letter-spacing']).toBe('-0.04em');
    expect(theme['--text-h2--letter-spacing']).toBe('-0.035em');
  });

  it('is Geist only - no Geist Mono and no other brand font', () => {
    expect(theme['--font-sans']).toContain('--font-geist-sans');
    expect(css).not.toMatch(/geist[-_ ]mono/i);
    expect(css).not.toMatch(/--font-mono/);
    expect(css).not.toMatch(/poppins|inter\b/i);
  });
});

describe('the old look is gone', () => {
  it.each([
    ['electric blue #2563eb', /#2563eb/i],
    ['cyan-500 #06b6d4', /#06b6d4/i],
    ['blue-500 #3b82f6', /#3b82f6/i],
    ['violet / indigo / purple names', /violet|indigo|purple/i],
    ['backdrop-filter (glass)', /backdrop-filter/i],
    ['.glass classes', /\.glass/],
    ['--glass tokens', /--glass/],
    ['gradient text helpers', /text-gradient/],
    ['floating orb / particle keyframes', /@keyframes\s+(float|float-delayed|pulse-slow|ken-burns|spin-slow)/],
    ['legacy colour aliases', /--color-accent\s*:|--accent-solid|--cyan\s*:|--cyan-strong/],
  ])('contains no %s', (_label, pattern) => {
    expect(css).not.toMatch(pattern);
  });
});

describe('motion and accessibility rules', () => {
  const reduced = blocks.find((b) => b.selectors[0] === '@media (prefers-reduced-motion: reduce)');
  const noPref = blocks.find((b) => b.selectors[0] === '@media (prefers-reduced-motion: no-preference)');

  it('reduced motion collapses animation and transitions and restores auto scrolling', () => {
    expect(reduced, 'missing @media (prefers-reduced-motion: reduce)').toBeDefined();
    expect(reduced?.body).toMatch(/scroll-behavior:\s*auto/);
    expect(reduced?.body).toMatch(/animation-duration:\s*0\.0*1ms/);
    expect(reduced?.body).toMatch(/transition-duration:\s*0\.0*1ms/);
  });

  it('smooth scrolling is opt-in via no-preference and never applied to *', () => {
    expect(noPref, 'missing @media (prefers-reduced-motion: no-preference)').toBeDefined();
    expect(noPref?.body).toMatch(/scroll-behavior:\s*smooth/);
    const outside = blocks.filter((b) => b !== noPref).map((b) => b.body).join('\n');
    expect(outside).not.toMatch(/scroll-behavior:\s*smooth/);
    expect(blocks.some((b) => b.selectors.includes('*') && /scroll-behavior/.test(b.body))).toBe(false);
  });

  it('scroll reveals are hidden only when JavaScript is running (.js gate), so no-JS and crawlers see content', () => {
    const hidden = blocks.filter((b) => /(^|\s)\.scroll-animate\b/.test(b.selectors.join(' ')) && /opacity:\s*0\b/.test(b.body));
    expect(hidden.length).toBeGreaterThan(0);
    for (const block of hidden) {
      for (const selector of block.selectors) {
        expect(selector, 'opacity:0 must be gated behind .js').toMatch(/^\.js\s/);
      }
    }
  });

  it('keyframes animate transform/opacity only (plus the icon ring stroke)', () => {
    const allowed = new Set(['transform', 'opacity', 'stroke-dashoffset']);
    const keyframes = blocks.filter((b) => b.selectors[0]?.startsWith('@keyframes'));
    expect(keyframes.length).toBeGreaterThan(0);
    for (const frame of keyframes) {
      for (const [, body] of frame.body.matchAll(/[\w%.]+\s*\{([^}]*)\}/g)) {
        for (const property of Object.keys(parseDeclarations(body))) {
          expect(allowed, `${frame.selectors[0]} animates ${property}`).toContain(property);
        }
      }
    }
  });

  it('the single ambient animation (wave drift) is slow: 30 s or longer', () => {
    const match = css.match(/animation:\s*wave-drift\s+(\d+(?:\.\d+)?)s/);
    expect(match, 'wave-drift animation not found').not.toBeNull();
    expect(Number(match?.[1])).toBeGreaterThanOrEqual(30);
  });

  it('gives every interactive element a visible 2px focus ring in the focus token', () => {
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--focus\)/);
    expect(css).toMatch(/outline-offset:\s*2px/);
  });

  it('prevents horizontal scroll from ghost numerals and shaped photos (overflow: clip)', () => {
    expect(css).toMatch(/overflow:\s*clip/);
  });
});

describe('logo variants switch in CSS only (no mounted skeleton, no layout shift)', () => {
  const rule = (variant: string) =>
    blocks.filter((b) => b.selectors.some((s) => s.includes(variant)));

  it('shows the colour logo by default and the white logo in dark theme and on dark/brand surfaces', () => {
    const onLight = rule('.logo-on-light');
    const onDark = rule('.logo-on-dark');
    expect(onLight.length).toBeGreaterThan(0);
    expect(onDark.length).toBeGreaterThan(0);
    const darkContexts = ['.dark', '[data-surface="dark"]', '[data-surface="brand"]'];
    const darkRule = onDark.find((b) => /display:\s*block/.test(b.body) && b.selectors.some((s) => darkContexts.every((c) => s.includes(c)) || s.includes(':is(')));
    expect(darkRule, 'white logo must be displayed inside every dark context').toBeDefined();
    const hideRule = onLight.find((b) => /display:\s*none/.test(b.body));
    expect(hideRule, 'colour logo must be hidden inside dark contexts').toBeDefined();
  });
});
