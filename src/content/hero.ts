/**
 * Hero
 * The H1 and sub-line are the brand's campaign line, verbatim (Digest §1). The
 * four pillars are the messaging framework's own names (Digest §3); their
 * one-liners paraphrase the positioning and are registered as new copy.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { newCopy } from './copy';
import type { PhotoId } from './photos';

export const hero = {
  eyebrow: 'OPENAVII TECHNOLOGIES · LUSAKA, ZAMBIA',
  /** Two lines: the second is set in bright cyan. */
  headline: ['The Right Technology', 'Changes Everything.'],
  sub: 'Better customer experiences. Faster operations.',
  body: newCopy(
    'hero.body',
    'Openavii Technologies is a Lusaka-based technology partner. We turn complex business challenges into practical, secure and scalable digital solutions — websites, custom software, automation and the strategy behind them.',
  ), // COPY-NEW
  primaryCta: 'Get a Quote',
  secondaryCta: { label: 'See What We Do', href: '#services' },
  photo: 'commuter-laptop' satisfies PhotoId,
  pillars: [
    {
      title: 'We Understand',
      text: newCopy('hero.pillar.understand', 'We start with your business problem, not the software.'), // COPY-NEW
    },
    {
      title: 'We Simplify',
      text: newCopy('hero.pillar.simplify', 'We remove complexity instead of adding to it.'), // COPY-NEW
    },
    {
      title: 'We Build',
      text: newCopy('hero.pillar.build', 'Secure, scalable solutions built around your workflows.'), // COPY-NEW
    },
    {
      title: 'We Partner',
      text: newCopy('hero.pillar.partner', 'We work alongside you — and stay after launch.'), // COPY-NEW
    },
  ],
} as const;
