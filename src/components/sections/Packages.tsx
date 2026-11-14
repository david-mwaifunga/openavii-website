/**
 * Packages
 * The three website packages (the owner's data and ZMW ranges, unchanged) as
 * flat cards, a "Beyond Websites" card that routes bigger work to a custom
 * quote, four checkable facts instead of vague trust claims, and the pricing
 * terms. The optional add-ons follow under the in-page anchor `#addons`.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ShapedPhoto } from '@/components/ui/ShapedPhoto';
import { beyondWebsites, finePrint, packages, packagesSection, trustFacts } from '@/content/packages';
import { useInquiry } from '@/context/InquiryContext';
import { Addons } from './Addons';
import { PackageCard } from './PackageCard';

export function Packages() {
  const { openInquiry } = useInquiry();

  return (
    <Section id="packages" surface="alt" numeral="07" numeralAlign="left" labelledBy="packages-heading">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              id="packages-heading"
              eyebrow={packagesSection.eyebrow}
              heading={packagesSection.heading}
              lead={packagesSection.sub}
            />
          </div>
          <Reveal variant="right" className="lg:col-span-5">
            <ShapedPhoto photo="delighted-phone" shape="chamfer" sizes="(min-width: 1024px) 40vw, 100vw" />
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-6 lg:grid-cols-3">
          {packages.map((pkg, index) => (
            <Reveal as="li" key={pkg.id} delay={index * 80} className="h-full">
              <PackageCard pkg={pkg} />
            </Reveal>
          ))}
        </ul>

        <Reveal
          role="group"
          aria-labelledby="beyond-title"
          data-surface="brand"
          className="mt-6 grid items-center gap-6 rounded-tile p-8 lg:grid-cols-12 lg:p-10"
        >
          <div className="lg:col-span-9">
            <h3 id="beyond-title" className="text-h3">
              {beyondWebsites.title}
            </h3>
            <p className="mt-3 max-w-2xl text-lead font-light text-muted">{beyondWebsites.text}</p>
          </div>
          <div className="lg:col-span-3 lg:text-right">
            <Button iconAfter="ArrowRight" onClick={() => openInquiry({ type: 'custom' })}>
              {beyondWebsites.cta}
            </Button>
          </div>
        </Reveal>

        <ul
          aria-label="What every package includes"
          className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-small font-bold text-heading"
        >
          {trustFacts.map((fact) => (
            <li key={fact} className="flex items-center gap-2.5">
              <Icon name="Check" size={20} className="shrink-0 text-accent-text" />
              {fact}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-small text-muted">{finePrint}</p>

        <Addons />
      </div>
    </Section>
  );
}

export default Packages;
