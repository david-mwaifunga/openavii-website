/**
 * New-copy registry
 * Copy that comes verbatim from the brand documents (the Digest) is written
 * inline. Everything else - any sentence the brand documents do not contain -
 * is wrapped in `newCopy()` and tagged `// COPY-NEW` at the call site, so the
 * owner can review and approve it. copy-rules.test.ts keeps the two in step:
 * every marker must be registered and every registration must be marked.
 *
 * Short interface labels (navigation, button and form-field labels, section
 * eyebrows) are chrome, not copy, and are not registered.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

/** One piece of new copy awaiting approval. */
export interface CopyNewEntry {
  /** Where it lives, e.g. `hero.body`. */
  id: string;
  /** The text exactly as shown on the site. */
  text: string;
}

/** Every registered piece of new copy, in load order. Used by the final report. */
export const copyNew: CopyNewEntry[] = [];

/**
 * Register and return a piece of new copy.
 * @param id stable location id (`module.field`)
 * @param text the copy
 */
export function newCopy(id: string, text: string): string {
  copyNew.push({ id, text });
  return text;
}
