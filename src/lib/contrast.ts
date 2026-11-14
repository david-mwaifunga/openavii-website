/**
 * Contrast engine and tiny CSS token reader
 * Used by the test suite to enforce WCAG 2.2 contrast on the real design
 * tokens in `src/app/globals.css` - exactly as the browser would resolve them
 * (var() chains, nested `color-mix(in srgb, ...)`), not as eyeballed hexes.
 * Validated against the brand Digest's script-verified ratio table.
 *
 * Deliberately dependency-free and CSS-subset only: it understands what the
 * token layer uses (hex, var(), color-mix in sRGB, linear/radial gradients).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

/** sRGB colour: channels 0-255 (unrounded), alpha 0-1. */
export type RGBA = readonly [number, number, number, number];

/** Map of CSS custom property name (`--x`) to its raw declared value. */
export type TokenMap = Record<string, string>;

/** A top-level CSS block: its selector list (or at-rule prelude) and raw body. */
export interface CssBlock {
  selectors: string[];
  body: string;
}

/* -------------------------------------------------------------------------- */
/* Colour maths                                                               */
/* -------------------------------------------------------------------------- */

/** Parse `#rgb`, `#rrggbb` or `#rrggbbaa`. */
export function parseHex(hex: string): RGBA {
  const h = hex.trim().replace(/^#/, '');
  const full =
    h.length === 3 || h.length === 4
      ? [...h].map((c) => c + c).join('')
      : h;
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(full)) {
    throw new Error(`Not a hex colour: "${hex}"`);
  }
  const channel = (i: number) => parseInt(full.slice(i, i + 2), 16);
  return [channel(0), channel(2), channel(4), full.length === 8 ? channel(6) / 255 : 1];
}

/** `#rrggbb` (rounded, alpha ignored). */
export function toHex(color: RGBA): string {
  return (
    '#' +
    color
      .slice(0, 3)
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')
  );
}

/** WCAG 2.x relative luminance of an opaque colour. */
export function relativeLuminance(color: RGBA): number {
  const [r, g, b] = color.slice(0, 3).map((v) => {
    const c = Math.round(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two opaque colours (hex strings or RGBA). */
export function contrastRatio(a: string | RGBA, b: string | RGBA): number {
  const ca = typeof a === 'string' ? parseHex(a) : a;
  const cb = typeof b === 'string' ? parseHex(b) : b;
  if (ca[3] < 1 || cb[3] < 1) {
    throw new Error('contrastRatio needs opaque colours; composite translucent ones first');
  }
  const [hi, lo] = [relativeLuminance(ca), relativeLuminance(cb)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* -------------------------------------------------------------------------- */
/* Small parsing helpers                                                      */
/* -------------------------------------------------------------------------- */

/** Split on `separator` at parenthesis/bracket depth 0 (so commas inside functions survive). */
function splitTopLevel(input: string, separator: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of input) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === separator && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim() !== '') parts.push(current.trim());
  return parts;
}

/** Contents of the first balanced `name( ... )` call at the start of `value`. */
function functionArgs(value: string, name: string): string {
  const start = value.indexOf('(', name.length - 1);
  let depth = 0;
  for (let i = start; i < value.length; i++) {
    if (value[i] === '(') depth++;
    if (value[i] === ')') {
      depth--;
      if (depth === 0) return value.slice(start + 1, i);
    }
  }
  throw new Error(`Unbalanced parentheses in "${value}"`);
}

/** Remove CSS comments. */
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * Split a stylesheet into its top-level blocks. Selector lists are split on
 * commas; at-rule preludes (`@media ...`) are kept whole. Nested bodies are
 * returned raw so callers can descend into at-rules themselves.
 */
export function parseCssBlocks(css: string): CssBlock[] {
  const source = stripComments(css);
  const blocks: CssBlock[] = [];
  let depth = 0;
  let prelude = '';
  let body = '';
  for (const ch of source) {
    // A brace-less at-rule (`@import ...;`, `@source ...;`) is a statement, not
    // part of the selector of the next rule.
    if (ch === ';' && depth === 0) {
      prelude = '';
      continue;
    }
    if (ch === '{') {
      depth++;
      if (depth === 1) continue;
    }
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        const head = prelude.trim();
        blocks.push({
          selectors: head.startsWith('@') ? [head] : splitTopLevel(head, ','),
          body,
        });
        prelude = '';
        body = '';
        continue;
      }
    }
    if (depth === 0) prelude += ch;
    else body += ch;
  }
  return blocks;
}

/** Direct declarations (depth 0) of a block body, as `{ property: value }`. */
export function parseDeclarations(body: string): Record<string, string> {
  const result: Record<string, string> = {};
  let depth = 0;
  let current = '';
  const flush = () => {
    const text = current.trim();
    current = '';
    if (!text) return;
    const colon = text.indexOf(':');
    if (colon < 1) return;
    result[text.slice(0, colon).trim()] = text.slice(colon + 1).trim();
  };
  for (const ch of body) {
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        current = ''; // a nested rule: drop its prelude
        continue;
      }
    }
    if (depth > 0) continue;
    if (ch === ';') flush();
    else current += ch;
  }
  flush();
  return result;
}

/* -------------------------------------------------------------------------- */
/* Colour resolution                                                          */
/* -------------------------------------------------------------------------- */

const MAX_DEPTH = 24;

/** Parse `name` and optional `fallback` out of `var(--name, fallback)`. */
function parseVar(value: string): { name: string; fallback?: string } {
  const [name, ...rest] = splitTopLevel(functionArgs(value, 'var('), ',');
  return { name, fallback: rest.length ? rest.join(',').trim() : undefined };
}

/** Evaluate `color-mix(in srgb, A p%, B q%)` with premultiplied-alpha interpolation. */
function mixColors(args: string, tokens: TokenMap, depth: number): RGBA {
  const [space, ...operands] = splitTopLevel(args, ',');
  if (!/^in\s+srgb$/i.test(space)) throw new Error(`Only "in srgb" is supported, got "${space}"`);
  if (operands.length !== 2) throw new Error('color-mix needs exactly two colours');

  const parsed = operands.map((operand) => {
    const match = operand.match(/^([\s\S]*?)\s+(\d+(?:\.\d+)?)%$/);
    return {
      color: resolveColor(match ? match[1] : operand, tokens, depth + 1),
      pct: match ? Number(match[2]) : undefined,
    };
  });
  let [p1, p2] = [parsed[0].pct, parsed[1].pct];
  if (p1 === undefined && p2 === undefined) [p1, p2] = [50, 50];
  else if (p1 === undefined) p1 = 100 - (p2 as number);
  else if (p2 === undefined) p2 = 100 - p1;
  const sum = (p1 as number) + (p2 as number);
  const w1 = (p1 as number) / sum;
  const w2 = (p2 as number) / sum;

  const [a, b] = [parsed[0].color, parsed[1].color];
  const alpha = a[3] * w1 + b[3] * w2;
  const channel = (i: number) =>
    alpha === 0 ? 0 : (a[i] * a[3] * w1 + b[i] * b[3] * w2) / alpha;
  return [channel(0), channel(1), channel(2), alpha];
}

/**
 * Resolve a CSS colour expression to RGBA using `tokens` for `var()` lookups.
 * Throws on anything it cannot resolve: a silent guess would make a contrast
 * test lie.
 */
export function resolveColor(input: string, tokens: TokenMap, depth = 0): RGBA {
  if (depth > MAX_DEPTH) throw new Error(`Variable cycle while resolving "${input}"`);
  const value = input.trim();

  if (value.startsWith('var(')) {
    const { name, fallback } = parseVar(value);
    if (name in tokens) return resolveColor(tokens[name], tokens, depth + 1);
    if (fallback !== undefined) return resolveColor(fallback, tokens, depth + 1);
    throw new Error(`Unresolved CSS variable ${name}`);
  }
  if (value.startsWith('#')) return parseHex(value);
  if (value.startsWith('color-mix(')) {
    return mixColors(functionArgs(value, 'color-mix('), tokens, depth);
  }
  if (value === 'transparent') return [0, 0, 0, 0];
  throw new Error(`Unsupported colour expression: "${input}"`);
}

/**
 * Colour stops of a `linear-gradient(...)` / `radial-gradient(...)`. Angle,
 * direction and position arguments are skipped; every argument that begins
 * with a colour contributes one stop.
 */
export function extractGradientStops(value: string, tokens: TokenMap): RGBA[] {
  const name = value.trim().startsWith('radial') ? 'radial-gradient(' : 'linear-gradient(';
  const stops: RGBA[] = [];
  for (const arg of splitTopLevel(functionArgs(value.trim(), name), ',')) {
    // The colour is the leading hex / function call; the rest are stop positions.
    const lead = arg.match(/^(#[0-9a-fA-F]{3,8}|(?:var|color-mix)\(|transparent\b)/);
    if (!lead) continue;
    const end = lead[0].endsWith('(') ? arg.indexOf('(') + functionArgs(arg, lead[0]).length + 2 : lead[0].length;
    stops.push(resolveColor(arg.slice(0, end), tokens));
  }
  return stops;
}
