/**
 * Why choose Openavii
 * Company Profile p. 19: six reasons, verbatim.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { ContentIconName } from './icons';

export interface Reason {
  slug: string;
  title: string;
  description: string;
  icon: ContentIconName;
}

export const whySection = {
  eyebrow: 'WHY OPENAVII',
  heading: { plain: 'Why Choose', accent: 'Openavii?' },
  /** A sentence from reason six, set large beneath the grid. */
  pullStatement: "Our relationship doesn't end at launch.",
} as const;

export const reasons = [
  {
    slug: 'business-first',
    title: 'Business-First Approach',
    description:
      'We look beyond the software to understand your operational challenges, goals and opportunities. This enables us to develop solutions that solve the right problems from the start.',
    icon: 'Target',
  },
  {
    slug: 'tailored',
    title: 'Tailored Digital Solutions',
    description:
      "Every organisation is different. That's why we design and develop customised websites, applications and enterprise systems that align with your unique processes and objectives.",
    icon: 'SlidersHorizontal',
  },
  {
    slug: 'secure-scalable',
    title: 'Secure and Scalable Technology',
    description:
      'Our solutions are built with security, performance and scalability at their core, ensuring they remain reliable as your organisation grows.',
    icon: 'ShieldCheck',
  },
  {
    slug: 'end-to-end',
    title: 'End-to-End Expertise',
    description:
      'From discovery and strategy to design, development, deployment and ongoing support, we provide complete technology solutions under one trusted partner.',
    icon: 'Route',
  },
  {
    slug: 'innovation-practicality',
    title: 'Innovation with Practicality',
    description:
      'We combine creative thinking with technical expertise to deliver solutions that are innovative, practical and easy to maintain. Our focus is on technology that creates measurable business outcomes.',
    icon: 'Lightbulb',
  },
  {
    slug: 'long-term-support',
    title: 'Long-Term Support',
    description:
      "Our relationship doesn't end at launch. We provide ongoing maintenance, enhancements and technical support to ensure your solutions continue to perform at their best.",
    icon: 'LifeBuoy',
  },
] as const satisfies readonly Reason[];
