/**
 * Find the fix: problem band
 * Six problem-to-fix cards. Headlines, bodies and calls to action are the words of
 * the brand's own social creatives (Digest §7.1), each linking to the services
 * that solve the problem. `targets` is typed against the service slugs, so a card
 * can never point at a service that does not exist.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { ServiceSlug } from './services';

export interface Problem {
  id: string;
  headline: string;
  body: string;
  /** Call-to-action label; the card links to the first target. */
  cta: string;
  targets: readonly ServiceSlug[];
}

export const problemsSection = {
  eyebrow: 'FIND THE FIX',
  heading: { plain: 'Your Business Has a', accent: 'Technology Problem.' },
  lead:
    "Slow systems, outdated tools and manual processes quietly cost your business time and money. Let's find the fix.",
} as const;

export const problems = [
  {
    id: 'late-nights',
    headline: 'Late Nights Should Be for Strategy, Not Spreadsheets.',
    body: 'Automate repetitive tasks and give your team their time back.',
    cta: 'Automate Your Workflow',
    targets: ['automation'],
  },
  {
    id: 'outdated-technology',
    headline: 'Outdated Technology Has a Cost',
    body:
      "Missed opportunities, wasted time and frustrated teams can all begin with systems that haven't kept up.",
    cta: 'Upgrade Your Business',
    targets: ['custom-software', 'maintenance-support'],
  },
  {
    id: 'too-many-apps',
    headline: "Your Team Doesn't Need More Apps",
    body:
      'They need the right tools, connected systems and technology that actually supports the way they work.',
    cta: 'Work Smarter',
    targets: ['integration-apis'],
  },
  {
    id: 'better-decisions',
    headline: 'Better Technology. Better Decisions.',
    body:
      'When your systems give you access to the right information, you can make faster, smarter business decisions.',
    cta: 'Make Data Work for You',
    targets: ['dashboards'],
  },
  {
    id: 'scale',
    headline: 'Your Business Is Growing. Is Your Technology Advancing?',
    body:
      'Growth exposes weak systems. Build technology infrastructure that can scale with your ambitions.',
    cta: 'Prepare to Scale',
    targets: ['solution-architecture', 'database-design'],
  },
  {
    id: 'tech-support',
    headline: "Don't Let Tech Problems Become Business Problems",
    body:
      'System failures and software issues can interrupt operations. Get proactive technology support before problems escalate.',
    cta: 'Get Tech Support',
    targets: ['maintenance-support', 'security-performance'],
  },
] as const satisfies readonly Problem[];

/** The closing pull-quote (creative #12), linking on to How We Work. */
export const explore = {
  headline: "Don't Just Buy Software. Explore Solutions.",
  body:
    "The newest software isn't always the right software. Start with the business problem, then choose the technology.",
  cta: 'Find Your Solution',
  href: '#approach',
} as const;
