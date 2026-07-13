/**
 * Package Card Component
 * A detailed, animated card component for displaying pricing packages.
 * Features gradient borders, hover effects, and organized feature lists.
 * Theme-responsive with mobile-first design.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { Card, CardHeader, CardContent, CardFooter, Button, Badge } from '@/components/ui';

/** Package data structure */
export interface PackageData {
  /** Package identifier */
  id: string;
  /** Display name */
  name: string;
  /** Brief description */
  tagline: string;
  /** Target audience description */
  suitableFor: string;
  /** List of included features */
  features: string[];
  /** Delivery timeframe */
  deliveryTime: string;
  /** Price range in ZMW (omit for custom-quote services) */
  priceRange?: {
    min: number;
    max: number;
  };
  /** Price label shown when there is no numeric range (e.g. "Custom quote") */
  priceLabel?: string;
  /** Whether this is the recommended/popular option */
  isPopular?: boolean;
  /** Render with the elevated "featured" treatment (e.g. main services) */
  featured?: boolean;
  /** Visual accent color theme */
  accentColor: 'violet' | 'indigo' | 'purple';
}

interface PackageCardProps {
  /** Package data to display */
  package: PackageData;
  /** Callback when Request Quote is clicked */
  onRequestQuote: (pkg: PackageData) => void;
}

/**
 * Formats a number as ZMW currency
 */
function formatPrice(amount: number): string {
  return `ZMW ${amount.toLocaleString()}`;
}

/**
 * Detailed package card with animated hover effects and feature checklist.
 * Supports a "popular" badge for recommended packages.
 * Adapts to both light and dark themes.
 */
export function PackageCard({ package: pkg, onRequestQuote }: PackageCardProps) {
  // Per-tier accents mapped onto the approved Openavii palette.
  // Data keys are preserved (violet/indigo/purple) but resolve to
  // navy → electric-blue → cyan for cohesive brand tiering.
  const colorThemes = {
    // Tier 1 - Navy (constant fills keep white content AA-legible in both themes)
    violet: {
      gradient: 'from-navy-dark to-navy',
      glow: 'shadow-navy/25',
      badge: 'from-navy-tint to-navy-tint border-line text-fg-muted',
      icon: 'text-heading',
      border: '',
    },
    // Tier 2 - Electric blue
    indigo: {
      gradient: 'from-accent-solid to-accent-solid-hover',
      glow: 'shadow-accent/25',
      badge: 'from-navy-tint to-navy-tint border-line text-fg-muted',
      icon: 'text-accent',
      border: '',
    },
    // Tier 3 - Cyan / teal (tech accent)
    purple: {
      gradient: 'from-[#0e7490] to-[#155e75]',
      glow: 'shadow-cyan/25',
      badge: 'from-navy-tint to-navy-tint border-line text-fg-muted',
      icon: 'text-cyan-strong',
      border: '',
    },
  };

  const theme = colorThemes[pkg.accentColor];
  const isElevated = pkg.isPopular || pkg.featured;

  return (
    <Card
      variant={isElevated ? 'featured' : 'gradient'}
      glowBorder={pkg.isPopular}
      className={`
        h-full flex flex-col
        ${pkg.isPopular ? 'ring-1 ring-accent/40' : ''}
        ${theme.border}
        group
      `}
    >
      {/* Popular Badge */}
      {pkg.isPopular && (
        <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 z-10">
          <Badge variant="popular">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="pt-6 md:pt-8">
        {/* Package Name & Badge */}
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-heading group-hover:text-accent transition-colors duration-300">
              {pkg.name}
            </h3>
            <p className="text-fg-subtle text-sm">{pkg.tagline}</p>
          </div>
          <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center ${theme.glow} shadow-lg`}>
            <span className="text-white font-bold text-xs md:text-sm">{pkg.id}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3 md:mb-4">
          {pkg.priceRange ? (
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-2xl md:text-3xl font-bold text-heading">
                {formatPrice(pkg.priceRange.min)}
              </span>
              <span className="text-fg-subtle">-</span>
              <span className="text-lg md:text-xl font-semibold text-fg-muted">
                {formatPrice(pkg.priceRange.max)}
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl md:text-3xl font-bold text-heading">
                {pkg.priceLabel ?? 'Custom quote'}
              </span>
              <span className="text-sm text-fg-subtle">tailored to scope</span>
            </div>
          )}
        </div>

        {/* Suitable For */}
        <div className={`text-xs md:text-sm px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg bg-gradient-to-r ${theme.badge} border inline-block`}>
          {pkg.suitableFor}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Features List */}
        <div className="mb-4 md:mb-6">
          <h4 className="text-xs md:text-sm font-semibold text-fg-muted uppercase tracking-wider mb-3 md:mb-4">
            What&apos;s Included
          </h4>
          <ul className="space-y-2 md:space-y-3">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 md:gap-3">
                <div className={`flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center mt-0.5`}>
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-fg-muted text-xs md:text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery Time */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-fg-muted bg-surface-tint rounded-lg px-3 md:px-4 py-2 md:py-3">
          <svg className={`w-4 h-4 md:w-5 md:h-5 ${theme.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Delivery: <strong className="text-heading">{pkg.deliveryTime}</strong></span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          fullWidth
          variant={isElevated ? 'primary' : 'outline'}
          className="group/btn"
          onClick={() => onRequestQuote(pkg)}
        >
          {pkg.priceRange ? 'Request Quote' : "Let's Talk"}
          <svg
            className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PackageCard;
