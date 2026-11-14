// @vitest-environment node
/**
 * Repository hygiene contract (Prompt §1: non-negotiables 2, 3, 4, 9)
 * Guards the rules that are easy to break by accident while editing:
 * no stray personal e-mail address, tokens only (no hex literals or old-look
 * classes in components), repo conventions (JSDoc tags, barrel exports) and the
 * short list of allowed runtime dependencies.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SRC = path.join(ROOT, 'src');

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const rel = (file: string) => path.relative(ROOT, file).replaceAll('\\', '/');
const isTest = (file: string) => /\.test\.(ts|tsx)$/.test(file) || file.includes(`${path.sep}test${path.sep}`);
const all = walk(SRC);
/** Production TypeScript/TSX (no tests, no test support). */
const source = all.filter((f) => /\.(ts|tsx)$/.test(f) && !isTest(f));
const components = source.filter((f) => f.includes(`${path.sep}components${path.sep}`) && f.endsWith('.tsx'));
const read = (file: string) => fs.readFileSync(file, 'utf8');

/** Report offending files with the matching text. */
function scan(files: string[], pattern: RegExp): string[] {
  return files.flatMap((file) =>
    [...read(file).matchAll(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`))].map(
      (m) => `${rel(file)}: ${m[0]}`,
    ),
  );
}

describe('facts', () => {
  it('has no personal e-mail address anywhere in the source', () => {
    expect(scan(source.concat(all.filter((f) => f.endsWith('.css'))), /gmail\.com|bmanagerapplication/i)).toEqual([]);
  });
});

describe('tokens only', () => {
  it('has no hex colour literals in components or the app shell', () => {
    const files = [...components, ...source.filter((f) => f.includes(`${path.sep}app${path.sep}`) && f.endsWith('.tsx'))];
    // `#home`-style anchors and `url(#shape-1)` references are not colours.
    expect(scan(files, /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![-\w])/)).toEqual([]);
  });

  it('has none of the retired look: glass, blur orbs, floating/pulsing decoration, gradient text', () => {
    expect(
      scan(
        components,
        /glass|backdrop-blur|backdrop-filter|animate-float|animate-pulse|animate-bounce|text-gradient|blur-(2xl|3xl)|bg-gradient-to-|violet|indigo|purple|ImageSlideshow|ComingSoon/,
      ),
    ).toEqual([]);
  });

  it('uses no off-palette Tailwind colour names (the default palette is reset, so these would be silent no-ops)', () => {
    expect(
      scan(
        components,
        /\b(?:bg|text|border|from|to|via|ring|fill|stroke)-(?:red|orange|amber|yellow|lime|green|emerald|teal-\d|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|white|black)(?:-\d{2,3})?\b/,
      ),
    ).toEqual([]);
  });

  it('never uses the brand green for UI', () => {
    expect(scan(source.concat(all.filter((f) => f.endsWith('.css'))), /brand-green/).filter((l) => !l.includes('globals.css'))).toEqual([]);
  });
});

describe('tooling stays inside the project', () => {
  // Claude Code keeps its git worktrees INSIDE the project folder (.claude/worktrees/*), each with its own
  // node_modules and .next. Without these exclusions `npm run lint` in the main folder reported 8,995
  // problems from another copy of the site, and tsc walked into it as well.
  it('lints nothing inside .claude: a worktree there is another copy of the site', () => {
    expect(read(path.join(ROOT, 'eslint.config.mjs'))).toMatch(/["']\.claude\/\*\*["']/);
  });

  it('type-checks nothing inside .claude', () => {
    const tsconfig = JSON.parse(read(path.join(ROOT, 'tsconfig.json'))) as { exclude?: string[] };
    expect(tsconfig.exclude).toContain('.claude');
  });

  it('gives the page-wide axe tests time on a slow machine: they took 5.3 s against the 5 s default in a OneDrive folder', () => {
    const configured = read(path.join(ROOT, 'vitest.config.mts')).match(/testTimeout:\s*([\d_]+)/);
    expect(configured, 'vitest.config.mts must set testTimeout').not.toBeNull();
    expect(Number((configured as RegExpMatchArray)[1].replaceAll('_', ''))).toBeGreaterThanOrEqual(15000);
  });
});

describe('repo conventions', () => {
  it('documents every component, hook, context, lib and content module with @author and @company', () => {
    const documented = source.filter((f) =>
      /[\\/](components|hooks|context|lib|content)[\\/]/.test(f),
    );
    const missing = documented
      .filter((f) => {
        const text = read(f);
        return !text.includes('@author David Mwaifunga') || !text.includes('@company Openavii Technologies');
      })
      .map(rel);
    expect(missing).toEqual([]);
  });

  it('has a barrel index.ts in every component folder', () => {
    for (const dir of ['ui', 'layout']) {
      expect(fs.existsSync(path.join(SRC, 'components', dir, 'index.ts')), `components/${dir}/index.ts`).toBe(true);
    }
  });

  it('adds no runtime dependency beyond next, react, react-dom and lucide-react', () => {
    const pkg = JSON.parse(read(path.join(ROOT, 'package.json'))) as { dependencies: Record<string, string> };
    expect(Object.keys(pkg.dependencies).sort()).toEqual(['lucide-react', 'next', 'react', 'react-dom']);
  });

  it('keeps no analytics, trackers or cookie handling in the source', () => {
    expect(scan(source, /gtag|google-analytics|googletagmanager|fbq\(|document\.cookie|hotjar|segment\.com|plausible|mixpanel|posthog/i)).toEqual([]);
  });
});
