/**
 * Icon
 * The single thin-line icon set (Lucide: stroke 1.5, round caps and joins,
 * current text colour). Decorative by default - hidden from assistive
 * technology - and exposed as an image only when given a label. Names are
 * mapped explicitly so only the icons in use reach the browser.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  Building2,
  Check,
  Clock,
  Cloud,
  Code,
  Compass,
  Database,
  FilePlus,
  GitPullRequest,
  Globe,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  KeyRound,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  LifeBuoy,
  type LucideIcon,
  MapPin,
  Mail,
  Menu,
  MessageCircle,
  MousePointerClick,
  Moon,
  Newspaper,
  Palette,
  PenLine,
  Phone,
  Plug,
  RefreshCw,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Store,
  Sun,
  Target,
  Wallet,
  Workflow,
  Wrench,
  X,
} from 'lucide-react';
import type { IconName } from '@/content/icons';

const ICONS: Record<IconName, LucideIcon> = {
  ArrowRight,
  ArrowUpRight,
  Atom,
  Building2,
  Check,
  Clock,
  Cloud,
  Code,
  Compass,
  Database,
  FilePlus,
  GitPullRequest,
  Globe,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  KeyRound,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  LifeBuoy,
  MapPin,
  Mail,
  Menu,
  MessageCircle,
  MousePointerClick,
  Moon,
  Newspaper,
  Palette,
  PenLine,
  Phone,
  Plug,
  RefreshCw,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Store,
  Sun,
  Target,
  Wallet,
  Workflow,
  Wrench,
  X,
};

interface IconProps {
  name: IconName;
  /** Width and height in px. */
  size?: number;
  /** Accessible name. Omit for a purely decorative icon. */
  label?: string;
  className?: string;
}

export function Icon({ name, size = 24, label, className }: IconProps) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      size={size}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': true, focusable: false })}
    />
  );
}
