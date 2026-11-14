/**
 * PackageCard
 * One website package as a flat, crisp card: a colour-blocked head in the
 * package's brand tone (navy, teal or cyan - cyan always carries near-black
 * text), the indicative ZMW range in large Bold type, who it suits, what is
 * included, the delivery time and a Get a Quote action that opens the shared
 * enquiry dialog with this package and its price range.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { packagesSection, type WebsitePackage } from '@/content/packages';
import { useInquiry } from '@/context/InquiryContext';
import { formatZmwRange } from '@/lib/format';
import { cn } from '@/lib/cn';

/** Head colours. Fixed brand pairs, so the text colour is always a passing one. */
const HEAD: Record<WebsitePackage['tone'], string> = {
  navy: 'bg-navy text-brand-white',
  teal: 'bg-teal text-brand-white',
  cyan: 'bg-cyan text-depth',
};

export function PackageCard({ pkg }: { pkg: WebsitePackage }) {
  const { openInquiry } = useInquiry();
  const range = formatZmwRange(pkg.priceRange);
  const titleId = `package-${pkg.id}`;

  return (
    <article
      data-package={pkg.id}
      data-tone={pkg.tone}
      aria-labelledby={titleId}
      className="flex h-full flex-col overflow-hidden rounded-tile border border-line bg-surface"
    >
      <div className={cn('px-7 py-6', HEAD[pkg.tone])}>
        <p aria-hidden="true" className="text-overline uppercase opacity-80">
          {pkg.id}
        </p>
        <h3 id={titleId} className="mt-2 text-balance text-h3 text-inherit">
          {pkg.name}
        </h3>
        <p className="mt-1 font-bold">{pkg.tagline}</p>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="text-balance text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] font-extrabold leading-tight tracking-tight text-heading">
          {range}
        </p>
        <p className="mt-2 text-small text-muted">{pkg.suitableFor}</p>

        <h4 className="mt-7 text-overline uppercase text-accent-text">{packagesSection.includedLabel}</h4>
        <ul className="mt-4 space-y-3">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-small">
              <Icon name="Check" size={20} className="mt-0.5 shrink-0 text-accent-text" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Pinned to the bottom of the card so delivery and the action line up across cards. */}
        <div className="mt-auto pt-7">
          <p className="flex items-center gap-2 border-t border-line pt-5 text-small text-muted">
            <Icon name="Clock" size={18} className="shrink-0 text-accent-text" />
            <span>
              {packagesSection.deliveryLabel}: <strong className="text-heading">{pkg.deliveryTime}</strong>
            </span>
          </p>
          <Button
            className="mt-6 w-full"
            iconAfter="ArrowRight"
            onClick={() => openInquiry({ type: 'package', name: pkg.name, priceRange: range })}
          >
            {packagesSection.cta}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default PackageCard;
