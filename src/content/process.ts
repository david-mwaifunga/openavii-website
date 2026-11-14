/**
 * Approach and process
 * The approach statement (Company Profile p. 7) and the process (p. 17): seven
 * stages grouped under the five-phase headline "Discover. Design. Develop.
 * Deliver. Evolve." The grouping of stages into phases is an editorial mapping
 * from the Digest; titles and descriptions are verbatim.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

export type PhaseId = 'discover' | 'design' | 'develop' | 'deliver' | 'evolve';

export interface Phase {
  id: PhaseId;
  label: string;
}

export interface Stage {
  id: string;
  phase: PhaseId;
  title: string;
  description: string;
}

export const processSection = {
  eyebrow: 'HOW WE WORK',
} as const;

export const approach = {
  /** Three lines, each revealed in turn. */
  lines: ['Understand First.', 'Build Second.', 'Improve Continuously.'],
  paragraph:
    'Every engagement begins with discovery prior to development. By understanding how our clients operate, we uncover hidden inefficiencies, identify opportunities and recommend solutions that create measurable business value. This consultative approach enables us to deliver software that is not only functional but aligned with long-term business objectives.',
} as const;

export const processHeading = 'Discover. Design. Develop. Deliver. Evolve.';

export const phases = [
  { id: 'discover', label: 'Discover' },
  { id: 'design', label: 'Design' },
  { id: 'develop', label: 'Develop' },
  { id: 'deliver', label: 'Deliver' },
  { id: 'evolve', label: 'Evolve' },
] as const satisfies readonly Phase[];

export const stages = [
  {
    id: 'discovery',
    phase: 'discover',
    title: 'Discovery',
    description:
      'We begin by understanding your business, objectives, users and challenges. Through workshops and consultations, we define the project scope, requirements and success metrics.',
  },
  {
    id: 'strategy-planning',
    phase: 'discover',
    title: 'Strategy and Planning',
    description:
      'Our team develops a clear roadmap outlining timelines, technologies, deliverables and milestones. Every decision is aligned with your business goals before development begins.',
  },
  {
    id: 'design-ux',
    phase: 'design',
    title: 'Design and User Experience',
    description:
      'We create intuitive user journeys, wireframes and interface designs that balance functionality with aesthetics, ensuring an exceptional user experience across all devices.',
  },
  {
    id: 'development',
    phase: 'develop',
    title: 'Development',
    description:
      'Using modern technologies and industry best practices, our developers build secure, scalable and high-performance digital solutions while keeping you informed throughout the process.',
  },
  {
    id: 'testing-qa',
    phase: 'develop',
    title: 'Testing and Quality Assurance',
    description:
      'Every feature undergoes rigorous testing for functionality, security, performance and usability to ensure a reliable product that meets the highest standards.',
  },
  {
    id: 'deployment',
    phase: 'deliver',
    title: 'Deployment',
    description:
      'Once approved, we launch your solution into the live environment with minimal disruption, ensuring a smooth transition from development to production.',
  },
  {
    id: 'support-improvement',
    phase: 'evolve',
    title: 'Support and Continuous Improvement',
    description:
      "Our partnership doesn't end at launch. We provide ongoing maintenance, monitoring, updates and enhancements to ensure your solution continues to grow alongside your business.",
  },
] as const satisfies readonly Stage[];

export const processClosing = {
  statement:
    'Every Openavii project is built on transparency, collaboration and innovation, transforming ideas into reliable digital solutions that create lasting business impact.',
  /** Digest §7.1 call to action of the "digital shift" campaign post. */
  cta: 'Start Your Digital Journey',
} as const;
