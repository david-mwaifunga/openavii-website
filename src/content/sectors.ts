/**
 * Who we serve
 * Company Profile pp. 8-9. Six sectors use the Profile copy verbatim. NGOs appear in
 * the brand guideline's audience but have no Profile copy, so that one line is new
 * copy, registered for approval.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { newCopy } from './copy';
import type { ContentIconName } from './icons';

export interface Sector {
  slug: string;
  title: string;
  description: string;
  icon: ContentIconName;
}

export const sectorsSection = {
  eyebrow: 'WHO WE SERVE',
  heading: 'A Technology Partner for Every Stage.',
  intro:
    'Every organisation has unique challenges, goals and ways of working. Openavii develops tailored digital solutions that improve efficiency, support growth and create lasting business value. We work with organisations of all sizes across multiple industries.',
  closing:
    "Whether you're launching a new solution, modernising existing systems or accelerating digital transformation, Openavii provides the expertise, strategy and long-term support to help your organisation succeed.",
} as const;

export const sectors = [
  {
    slug: 'smes',
    title: 'Small and Medium Enterprises',
    description:
      'We help SMEs replace manual processes with scalable digital solutions that improve productivity, automate operations and support sustainable growth.',
    icon: 'Store',
  },
  {
    slug: 'corporate',
    title: 'Corporate Organisations',
    description:
      'Our enterprise solutions streamline complex operations, integrate business systems and improve organisational performance through secure, scalable technology.',
    icon: 'Building2',
  },
  {
    slug: 'government',
    title: 'Government Institutions',
    description:
      'We develop reliable and functional digital systems that enhance service delivery, improve operational efficiency and support transparent public administration.',
    icon: 'Landmark',
  },
  {
    slug: 'education',
    title: 'Educational Institutions',
    description:
      'Our solutions help schools, colleges and universities improve learning experiences, simplify administration and strengthen communication.',
    icon: 'GraduationCap',
  },
  {
    slug: 'healthcare',
    title: 'Healthcare Providers',
    description:
      'We create secure healthcare systems that improve patient management, streamline operations and support better service delivery.',
    icon: 'HeartPulse',
  },
  {
    slug: 'financial',
    title: 'Financial Service Providers',
    description:
      'We develop secure, high-performance platforms that support digital financial services, automate workflows and enhance customer experiences.',
    icon: 'Wallet',
  },
  {
    slug: 'ngos',
    title: 'NGOs',
    description: newCopy(
      'sectors.ngos',
      'We help NGOs digitise operations and reporting so more of your effort goes into impact.',
    ), // COPY-NEW
    icon: 'HeartHandshake',
  },
] as const satisfies readonly Sector[];
