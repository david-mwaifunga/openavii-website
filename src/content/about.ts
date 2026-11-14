/**
 * Who we are
 * The two Company Profile paragraphs and the "Technology That Begins With
 * Understanding" callout are verbatim (Digest §7.4). The headline and the
 * name-meaning captions condense the brand guideline's name rationale (Digest §1)
 * and are registered as new copy for approval.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { newCopy } from './copy';

export const about = {
  eyebrow: 'WHO WE ARE',
  heading: newCopy('about.heading', 'Technology Should Simplify Challenges, Not Create Them.'), // COPY-NEW
  paragraphs: [
    'Technology has the power to transform businesses, but only when it solves the right problems. Openavii Technologies exists to bridge the gap between business challenges and practical digital solutions. We partner with organisations to understand how they operate, identify opportunities for improvement, and develop secure, scalable technologies that create measurable business value.',
    'Rather than simply building software from specifications, we work alongside our clients to uncover the real challenge behind every request. This enables us to recommend solutions that improve efficiency, simplify operations and support sustainable growth.',
  ],
  /** Company Profile callout under the two paragraphs. */
  callout: {
    title: 'Technology That Begins With Understanding',
    text: 'From developing custom software, enterprise systems, cloud platforms or digital products, our objective remains the same: to create technology that makes organisations work smarter.',
  },
  nameHeading: 'Our Name, Our Mark',
  /** The brand name, explained: Open + avi + i (guideline name rationale, condensed). */
  nameMeaning: [
    { term: 'Open', gloss: newCopy('about.name.open', 'Openness, accessibility and trust.') }, // COPY-NEW
    {
      term: 'Avi',
      gloss: newCopy('about.name.avi', 'Light: illuminating complexity, guiding smarter decisions.'), // COPY-NEW
    },
    {
      term: 'i',
      gloss: newCopy('about.name.i', 'Ideas: every meaningful innovation begins with a single insight.'), // COPY-NEW
    },
  ],
  ringFootnote: newCopy('about.ring', 'The open ring: nothing is hidden.'), // COPY-NEW
} as const;
