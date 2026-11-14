/**
 * Brand Digest reader (test support)
 * The content tests compare the site's copy against
 * docs/brand-2026/brand-source-of-truth.md itself, so "use Digest copy
 * verbatim" is enforced against the document, not against a second typed-in
 * copy of it. Only the markdown shapes the Digest actually uses are parsed.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const digestPath = fileURLToPath(
  new URL('../../docs/brand-2026/brand-source-of-truth.md', import.meta.url),
);
const lines = fs.readFileSync(digestPath, 'utf8').split(/\r?\n/);

/** Remove markdown emphasis markers (**bold**, *italic*). */
export const plain = (text: string): string =>
  text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/(^|[^*])\*([^*]+?)\*(?!\*)/g, '$1$2').trim();

/** Everything under the first heading that contains `heading`, up to the next heading of the same or higher level. */
export function digestSection(heading: string): string {
  const start = lines.findIndex((l) => /^#{1,4}\s/.test(l) && l.includes(heading));
  if (start < 0) throw new Error(`Digest section not found: ${heading}`);
  const level = (lines[start].match(/^#+/) as RegExpMatchArray)[0].length;
  const body: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const next = lines[i].match(/^(#+)\s/);
    if (next && next[1].length <= level) break;
    body.push(lines[i]);
  }
  return body.join('\n');
}

/** The rest of the first line that starts with `prefix` (e.g. "**Vision [DOC]** — "). */
export function digestLine(prefix: string): string {
  const line = lines.find((l) => l.startsWith(prefix));
  if (!line) throw new Error(`Digest line not found: ${prefix}`);
  return line.slice(prefix.length).trim();
}

export interface DigestItem {
  title: string;
  text: string;
}

/** Lines shaped `1. **Title** — text`. */
export function numberedItems(section: string): DigestItem[] {
  return [...section.matchAll(/^\d+\.\s+\*\*(.+?)\*\*\s+—\s+(.+)$/gm)].map((m) => ({
    title: m[1].trim(),
    text: m[2].trim(),
  }));
}

/** Lines shaped `- **Title** — text`. */
export function bulletItems(section: string): DigestItem[] {
  return [...section.matchAll(/^-\s+\*\*(.+?)\*\*\s+—\s+(.+)$/gm)].map((m) => ({
    title: m[1].trim(),
    text: m[2].trim(),
  }));
}

/** Body rows of the first markdown table in `section`, split into trimmed cells. */
export function tableRows(section: string): string[][] {
  return section
    .split('\n')
    .filter((l) => l.startsWith('|') && !/^\|\s*[-:]+/.test(l) && !/^\|\s*#\s*\|/.test(l))
    .map((l) =>
      l
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((cell) => cell.trim()),
    );
}

/** First sentence of a description (the tile summary rule). */
export function firstSentence(text: string): string {
  const match = text.match(/^.+?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

/** Upper-case the first letter: Digest list fragments are lower-case after the dash. */
export const capitalise = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);
