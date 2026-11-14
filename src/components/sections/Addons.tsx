/**
 * Add-ons
 * Optional extras that sit under the packages (the in-page anchor `#addons` is
 * kept from the previous site). Four add-ons plus the featured Monthly
 * Maintenance and Support service. There are no prices here by the owner's
 * decision: pricing is confirmed in the written proposal.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { addons, addonsSection, featuredAddon } from '@/content/addons';
import { useInquiry } from '@/context/InquiryContext';

export function Addons() {
  const { openInquiry } = useInquiry();

  return (
    <div id={addonsSection.anchorId} className="mt-24 border-t border-line pt-16">
      <p className="flex items-center gap-3 text-overline uppercase text-accent-text">
        <span aria-hidden="true" className="h-px w-8 bg-accent-fill" />
        {addonsSection.eyebrow}
      </p>
      <h3 className="mt-5 text-balance text-h2">{addonsSection.heading}</h3>
      <p className="mt-5 max-w-2xl text-lead font-light text-muted">{addonsSection.lead}</p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {addons.map((addon, index) => (
          <Reveal as="li" key={addon.slug} delay={index * 70} className="h-full">
            <div className="h-full rounded-tile border border-line bg-surface p-6">
              <Icon name={addon.icon} size={30} className="text-accent-text" />
              <h4 className="mt-5 text-h4">{addon.name}</h4>
              <p className="mt-2 text-small text-muted">{addon.description}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal
        data-surface="brand"
        className="mt-6 grid items-center gap-6 rounded-tile p-8 lg:grid-cols-12 lg:p-10"
      >
        <div className="flex items-start gap-5 lg:col-span-9">
          <Icon name={featuredAddon.icon} size={40} className="shrink-0 text-accent-text" />
          <div>
            <p className="text-overline uppercase text-accent-text">{featuredAddon.label}</p>
            <h4 className="mt-2 text-h3">{featuredAddon.name}</h4>
            <p className="mt-3 max-w-2xl text-muted">{featuredAddon.description}</p>
          </div>
        </div>
        <div className="lg:col-span-3 lg:text-right">
          <Button
            iconAfter="ArrowRight"
            onClick={() => openInquiry({ type: 'service', name: featuredAddon.name })}
          >
            {featuredAddon.cta}
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

export default Addons;
