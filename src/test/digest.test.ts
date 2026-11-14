// @vitest-environment node
/**
 * Digest reader guard tests
 * The content tests lean on the Digest reader, so these make sure it cannot
 * silently return nothing (which would make every content comparison vacuous).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { describe, expect, it } from 'vitest';
import {
  bulletItems,
  capitalise,
  digestLine,
  digestSection,
  firstSentence,
  numberedItems,
  plain,
  tableRows,
} from './digest';

describe('Digest reader', () => {
  it('finds the 15 services, 7 process stages, 7 sectors and 6 reasons', () => {
    expect(numberedItems(digestSection('7.2')).length).toBe(15);
    expect(bulletItems(digestSection('7.3')).length).toBe(7);
    expect(bulletItems(digestSection('7.5')).length).toBe(7);
    expect(numberedItems(digestSection('7.6')).length).toBe(6);
  });

  it('finds the 12 campaign rows with headline, body and call to action', () => {
    const rows = tableRows(digestSection('7.1'));
    expect(rows.length).toBe(12);
    expect(rows[1]).toEqual([
      '2',
      'Your Business Has a Technology Problem',
      'Slow systems, outdated tools and manual processes quietly cost your business time and money.',
      "Let's Find the Fix.",
    ]);
  });

  it('reads single lines and strips emphasis markers', () => {
    expect(plain(digestLine('**Vision [DOC]** — '))).toMatch(/^To become Africa's most trusted/);
    expect(plain('**bold** and *italic*')).toBe('bold and italic');
  });

  it('extracts the first sentence and capitalises list fragments', () => {
    expect(firstSentence('One sentence here. Another one.')).toBe('One sentence here.');
    expect(capitalise('every solution')).toBe('Every solution');
  });

  it('throws on a missing section instead of returning nothing', () => {
    expect(() => digestSection('9.9 Not a section')).toThrow(/not found/);
  });
});
