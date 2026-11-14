/**
 * Who We Serve
 * Seven sector cards from the Company Profile, with two chamfered photographs
 * as visual anchors, set in a mosaic that mirrors the services grid. The
 * Profile's closing paragraph ends the section.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { Fragment } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ShapedPhoto } from '@/components/ui/ShapedPhoto';
import type { PhotoId } from '@/content/photos';
import { sectors, sectorsSection } from '@/content/sectors';

/** Photographs and the number of sector cards that come before each. */
const PHOTOS: Array<{ photo: PhotoId; before: number }> = [
  { photo: 'field-tablet', before: 2 },
  { photo: 'greenhouse-smile', before: 5 },
];

export function Sectors() {
  return (
    <Section id="sectors" surface="alt" numeral="04" numeralAlign="left" labelledBy="sectors-heading">
      <div className="wrap">
        <SectionHeader
          id="sectors-heading"
          eyebrow={sectorsSection.eyebrow}
          heading={sectorsSection.heading}
          lead={sectorsSection.intro}
        />

        <ul className="mt-14 grid grid-flow-dense gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sectors.map((sector, index) => (
            <Fragment key={sector.slug}>
              {PHOTOS.filter((p) => p.before === index).map((p) => (
                <li key={p.photo} className="h-full min-h-56 md:col-span-2 xl:col-span-1">
                  <ShapedPhoto
                    photo={p.photo}
                    shape="chamfer"
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </li>
              ))}
              <Reveal as="li" delay={(index % 3) * 70} className="h-full md:last:col-span-2 xl:last:col-span-1">
                <article
                  aria-labelledby={`sector-${sector.slug}`}
                  className="group h-full rounded-tile border border-line bg-surface p-7 transition-colors hover:border-accent-fill"
                >
                  <Icon name={sector.icon} size={34} className="text-accent-text" />
                  <h3 id={`sector-${sector.slug}`} className="mt-5 text-balance text-h4">
                    {sector.title}
                  </h3>
                  <p className="mt-3 text-small text-muted">{sector.description}</p>
                </article>
              </Reveal>
            </Fragment>
          ))}
        </ul>

        <Reveal className="mt-16 max-w-3xl border-l-2 border-accent-fill pl-6">
          <p className="text-lead font-light text-heading">{sectorsSection.closing}</p>
        </Reveal>
      </div>
    </Section>
  );
}

export default Sectors;
