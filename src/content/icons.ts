/**
 * Icon vocabulary
 * One thin-line icon set (Lucide, stroke 1.5, round caps). Content refers to
 * icons by name so content modules stay plain data; the `Icon` component maps
 * each name to its component. Names are explicit (not `import *`) so only the
 * icons actually used ship to the browser.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

/** Icons that content modules (services, sectors, reasons, add-ons) may use. */
export const CONTENT_ICONS = [
  'Globe',
  'Cloud',
  'Code',
  'Smartphone',
  'Newspaper',
  'Workflow',
  'Plug',
  'LayoutDashboard',
  'Compass',
  'GitPullRequest',
  'MousePointerClick',
  'Database',
  'KeyRound',
  'ShieldCheck',
  'Wrench',
  'Store',
  'Building2',
  'Landmark',
  'GraduationCap',
  'HeartPulse',
  'Wallet',
  'HeartHandshake',
  'Target',
  'SlidersHorizontal',
  'Route',
  'Lightbulb',
  'LifeBuoy',
  'Atom',
  'FilePlus',
  'PenLine',
  'Palette',
  'RefreshCw',
] as const;

/** Icons used by the interface itself (buttons, menu, contact actions). */
export const UI_ICONS = [
  'ArrowRight',
  'ArrowUpRight',
  'Menu',
  'X',
  'Sun',
  'Moon',
  'Phone',
  'Mail',
  'MessageCircle',
  'MapPin',
  'Check',
  'Clock',
] as const;

export type ContentIconName = (typeof CONTENT_ICONS)[number];
export type UiIconName = (typeof UI_ICONS)[number];
export type IconName = ContentIconName | UiIconName;
