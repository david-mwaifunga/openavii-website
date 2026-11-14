/**
 * Service catalogue
 * The 15 services of the Company Profile (pp. 11-15), in catalogue order. Titles
 * are verbatim; each summary is the first sentence of the Profile description.
 * The four cluster names are an editorial grouping (the Profile lists the
 * services without clusters). Tile tones cycle navy, deep, teal, cyan so that
 * neighbouring tiles differ in every grid width (the Profile's colour-blocked
 * mosaic).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { newCopy } from './copy';
import type { ContentIconName } from './icons';

export type ServiceClusterId = 'build' | 'automate' | 'advise' | 'secure';
export type ServiceTone = 'navy' | 'deep' | 'teal' | 'cyan';

export interface Service {
  /** Anchor id suffix: the tile is `#service-<slug>`. */
  slug: string;
  cluster: ServiceClusterId;
  title: string;
  summary: string;
  icon: ContentIconName;
  tone: ServiceTone;
}

export const serviceClusters = [
  { id: 'build', title: 'Build' },
  { id: 'automate', title: 'Automate and Connect' },
  { id: 'advise', title: 'Architect and Advise' },
  { id: 'secure', title: 'Secure and Sustain' },
] as const satisfies readonly { id: ServiceClusterId; title: string }[];

export const servicesSection = {
  eyebrow: 'WHAT WE DO',
  /** Company Profile section title. */
  heading: 'Built Around Your Business.',
  lead: newCopy(
    'services.lead',
    'From websites and custom software to automation, integration and security — one accountable partner from discovery to long-term support.',
  ), // COPY-NEW
  quoteLabel: 'Get a Quote',
} as const;

export const services = [
  {
    slug: 'websites',
    cluster: 'build',
    title: 'Professional Website Design and Development',
    summary:
      'We design and develop modern, responsive websites that strengthen your brand, engage your audience and support your business objectives.',
    icon: 'Globe',
    tone: 'navy',
  },
  {
    slug: 'saas',
    cluster: 'build',
    title: 'Software-as-a-Service Product Development',
    summary:
      'We develop scalable cloud-based SaaS products that enable businesses to deliver digital services efficiently and grow with confidence.',
    icon: 'Cloud',
    tone: 'deep',
  },
  {
    slug: 'custom-software',
    cluster: 'build',
    title: 'Custom Business and Enterprise Software Development',
    summary:
      'Our bespoke software solutions streamline operations, improve productivity and support the complex needs of growing organisations.',
    icon: 'Code',
    tone: 'teal',
  },
  {
    slug: 'web-mobile-apps',
    cluster: 'build',
    title: 'Custom Web and Mobile Application Development',
    summary:
      'We build tailored web and mobile applications that solve unique business challenges while delivering seamless user experiences across devices.',
    icon: 'Smartphone',
    tone: 'cyan',
  },
  {
    slug: 'cms-content-branding',
    cluster: 'build',
    title: 'CMS Configuration, Content Development and Digital Branding Services',
    summary:
      'We configure and customise content management systems (CMS) that make it easy to manage, update and grow your digital platforms.',
    icon: 'Newspaper',
    tone: 'navy',
  },
  {
    slug: 'automation',
    cluster: 'automate',
    title: 'Business Process Digitisation and Automation',
    summary:
      'Transform manual workflows into intelligent digital processes that reduce errors, save time and improve operational efficiency.',
    icon: 'Workflow',
    tone: 'deep',
  },
  {
    slug: 'integration-apis',
    cluster: 'automate',
    title: 'Systems Integration and API Development',
    summary:
      'Connect your existing software and platforms through secure integrations that enable seamless data sharing and improved workflow.',
    icon: 'Plug',
    tone: 'teal',
  },
  {
    slug: 'dashboards',
    cluster: 'automate',
    title: 'Custom Dashboards and Administrative Platforms',
    summary:
      'Gain real-time visibility into your operations with customised dashboards and management platforms designed around your business.',
    icon: 'LayoutDashboard',
    tone: 'cyan',
  },
  {
    slug: 'solution-architecture',
    cluster: 'advise',
    title: 'Solution Architecture and Technical Consultancy',
    summary:
      'Our consultants help you define the right technology strategy and architecture to ensure your solutions are scalable, secure and future-ready.',
    icon: 'Compass',
    tone: 'navy',
  },
  {
    slug: 'code-reviews',
    cluster: 'advise',
    title: 'Software Architecture and Code Reviews',
    summary:
      'Improve software quality through expert architecture planning and comprehensive code reviews that enhance performance, security and maintainability.',
    icon: 'GitPullRequest',
    tone: 'deep',
  },
  {
    slug: 'ux-assessments',
    cluster: 'advise',
    title: 'UI/UX Assessments and Recommendations',
    summary:
      'We evaluate digital products to identify usability improvements and create intuitive experiences that increase user satisfaction and engagement.',
    icon: 'MousePointerClick',
    tone: 'teal',
  },
  {
    slug: 'database-design',
    cluster: 'advise',
    title: 'Database Design and Architecture Implementation',
    summary:
      'We design robust database solutions that provide secure, reliable and scalable foundations for your business applications.',
    icon: 'Database',
    tone: 'cyan',
  },
  {
    slug: 'auth-rbac',
    cluster: 'secure',
    title: 'Secure Authentication and Role-Based Access Control',
    summary:
      'Protect your systems with secure user authentication and permission controls that ensure the right people access the right information.',
    icon: 'KeyRound',
    tone: 'navy',
  },
  {
    slug: 'security-performance',
    cluster: 'secure',
    title: 'Performance and Overall Security Assessments',
    summary:
      'Identify vulnerabilities, optimise system performance and ensure your applications remain secure, reliable and efficient.',
    icon: 'ShieldCheck',
    tone: 'deep',
  },
  {
    slug: 'maintenance-support',
    cluster: 'secure',
    title: 'Application Maintenance, Enhancement and Technical Support',
    summary:
      'Keep your software performing at its best with ongoing maintenance, feature enhancements, updates and dependable technical support.',
    icon: 'Wrench',
    tone: 'teal',
  },
] as const satisfies readonly Service[];

export type ServiceSlug = (typeof services)[number]['slug'];
