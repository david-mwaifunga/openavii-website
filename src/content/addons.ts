/**
 * Optional add-ons
 * Same offers as before, with tightened copy. The owner removed prices from
 * this section, so none may reappear here: pricing is confirmed in the written
 * proposal.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { newCopy } from './copy';
import type { ContentIconName } from './icons';

export interface Addon {
  slug: string;
  name: string;
  description: string;
  icon: ContentIconName;
}

export const addonsSection = {
  /** Kept from the previous site: in-page links and the footer rely on it. */
  anchorId: 'addons',
  eyebrow: 'ADD-ONS',
  heading: 'Optional Add-Ons.',
  lead: newCopy(
    'addons.lead',
    'Extend any package with what your business needs. Each add-on is scoped with you and confirmed in your written proposal.',
  ), // COPY-NEW
} as const;

export const addons = [
  {
    slug: 'additional-page',
    name: 'Additional Page',
    description: newCopy('addons.page', 'Extra pages built around your content.'), // COPY-NEW
    icon: 'FilePlus',
  },
  {
    slug: 'blog-cms',
    name: 'Blog / CMS Setup',
    description: newCopy('addons.blog', 'A blog or news section you can update yourself.'), // COPY-NEW
    icon: 'Newspaper',
  },
  {
    slug: 'content-writing',
    name: 'Content Writing',
    description: newCopy('addons.writing', 'Clear, professional copy written for your pages.'), // COPY-NEW
    icon: 'PenLine',
  },
  {
    slug: 'logo-branding',
    name: 'Logo and Branding',
    description: newCopy('addons.branding', 'A logo refresh or a basic branding package.'), // COPY-NEW
    icon: 'Palette',
  },
] as const satisfies readonly Addon[];

export const featuredAddon = {
  slug: 'maintenance-support',
  name: 'Monthly Maintenance and Support',
  label: 'Recurring service',
  description: newCopy(
    'addons.maintenance',
    'Ongoing maintenance, security updates, content changes and priority support, so your website or application keeps performing.',
  ), // COPY-NEW
  icon: 'RefreshCw',
  cta: 'Ask About Support',
} as const satisfies Addon & { label: string; cta: string };
