/**
 * Team
 * The three leaders named in the Company Profile (p. 6), with their documented
 * titles. There are deliberately no bios and no surnames: none exist in the
 * brand documents and none may be invented. Cut-outs are transparent PNG-style
 * WebP files designed to sit on cyan or navy tiles, as the Profile does.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

export const teamSection = {
  eyebrow: 'OUR TEAM',
  heading: { plain: 'A Team Built on', accent: 'Expertise, Integrity and Execution.' },
} as const;

export const team = [
  {
    slug: 'david',
    name: 'David',
    title: 'Chief Visionary Officer',
    photo: '/brand/team/david.webp',
    width: 754,
    height: 1000,
    alt: 'David, Chief Visionary Officer at Openavii Technologies',
  },
  {
    slug: 'chanda',
    name: 'Chanda',
    title: 'Director, Operations',
    photo: '/brand/team/chanda.webp',
    width: 839,
    height: 1000,
    alt: 'Chanda, Director of Operations at Openavii Technologies',
  },
  {
    slug: 'walasi',
    name: 'Walasi',
    title: 'Director, Finance',
    photo: '/brand/team/walasi.webp',
    width: 800,
    height: 1000,
    alt: 'Walasi, Director of Finance at Openavii Technologies',
  },
] as const;

export type TeamMember = (typeof team)[number];
