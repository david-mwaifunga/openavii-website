/**
 * Copy rules (Digest §3 "Writing rules for the site")
 * One definition of what the site's words must not contain, shared by the
 * content-layer test and the rendered-page test, so a rule can never be
 * enforced in one place and forgotten in the other.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

/** Generic, unprovable or off-voice filler the brand bans. */
export const BANNED_FILLER: ReadonlyArray<readonly [label: string, pattern: RegExp]> = [
  ['cutting-edge', /cutting[- ]edge/i],
  ['world-class', /world[- ]class/i],
  ['best-in-class', /best[- ]in[- ]class/i],
  ['revolutionary', /revolutionary/i],
  ['game-changing', /game[- ]chang(ing|er)/i],
  ['next-gen', /next[- ]gen(eration)?/i],
  ['synergy', /synerg/i],
  ['captivate', /captivat/i],
  ['"drive real results"', /drive real results/i],
  ['stunning', /stunning/i],
  ['pixel-perfect', /pixel[- ]perfect/i],
  ['lightning fast', /lightning[- ]fast/i],
  ['leading provider', /leading provider/i],
  ['"#1"', /#1\b/],
  ['trusted by thousands', /trusted by thousands/i],
];

/** American spellings: the brand writes British English. */
export const AMERICAN_SPELLING =
  /organiz|optimiz|customiz|digitiz|modernize|personaliz|prioritiz|standardiz|utiliz|analyz|minimiz|maximiz|visualiz|synchroniz|centraliz|finaliz|realiz|recogniz|summariz|specializ|\bcolor|\bcenter|behavior|\bfavor|neighbor|\bcatalog\b|defense|\binquir/i;

/** Claims the brand must never make unless a source document supports them. */
export const INVENTED_CLAIMS: ReadonlyArray<RegExp> = [
  /\bsince\s+(19|20)\d{2}\b/i,
  /\b\d+\+?\s+(years?|projects?|clients?|customers?|countries|users)\b/i,
  /\b(award[- ]winning|awarded|certified|accredited|iso\s?\d{4,5}|testimonial)\b/i,
  /\btrusted by\b/i,
];

/** Registrations still "Awaiting Approval" and the tax identifier: never shown. */
export const UNAPPROVED_REGISTRATIONS = /awaiting approval|\bTPIN\b|\bZRA\b|ICTAZ|ZPPA|NAPSA|ZICTA/i;
