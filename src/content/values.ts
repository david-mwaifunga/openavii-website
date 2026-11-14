/**
 * Strategy: vision, mission, purpose, promise, values, principles
 * From the brand guideline (Digest §2). The vision is an aspiration and must be
 * read as one: it begins "To become" and is never to be rewritten as a present-tense
 * claim. Values are names only; the documents define none and none may be invented.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { ContentIconName } from './icons';

export interface Statement {
  label: string;
  text: string;
  icon: ContentIconName;
}

export const strategy = {
  vision: {
    label: 'Our vision',
    text:
      "To become Africa's most trusted technology partner, empowering organisations with innovative digital solutions that drive progress, transform industries and shape a smarter future.",
    icon: 'Atom',
  },
  mission: {
    label: 'Our mission',
    text:
      'To understand the challenges faced by organisations and transform them into practical, secure and scalable digital solutions that improve efficiency, enhance customer service and support sustainable growth.',
    icon: 'Target',
  },
  purpose: {
    label: 'Our purpose',
    text:
      'To empower organisations and communities by creating digital solutions that simplify complexity, improve efficiency, and unlock new opportunities for growth. We believe technology should be accessible, practical, and impactful.',
    icon: 'ShieldCheck',
  },
  promise:
    "We are committed to creating dependable digital solutions that solve genuine business challenges, improve efficiency and support sustainable growth. Every interaction, product and partnership reflects our dedication to quality, innovation and long-term value. Our clients can trust us to provide solutions that are secure, scalable and thoughtfully designed to meet today's needs while preparing them for tomorrow's opportunities.",
  differentiator:
    'Unlike many other technology providers that simply deliver software, Openavii begins by understanding the underlying business problem.',
} as const;

export const valuesSection = {
  promiseLabel: 'Our promise',
  valuesLabel: 'Our values',
  principlesLabel: 'Our principles',
} as const;

/** Names only: the brand documents give no definitions. */
export const values = [
  { name: 'Innovation' },
  { name: 'Integrity' },
  { name: 'Excellence' },
  { name: 'Simplicity' },
  { name: 'Collaboration' },
  { name: 'Impact' },
] as const;

export const principles = [
  {
    title: 'Technology with Purpose',
    text: 'Every solution addresses a real operational challenge.',
  },
  {
    title: 'Innovation through Simplicity',
    text: 'We remove complexity rather than add to it.',
  },
  {
    title: 'Partnership for Growth',
    text: 'We work alongside our clients to create long-term value.',
  },
] as const;
