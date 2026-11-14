/**
 * What We Do
 * The 15 services as the Company Profile's colour-blocked mosaic on a brand
 * band, in four clusters, with photograph tiles between them. Every tile is a
 * real anchor target (`#service-<slug>`, lit by :target), carries a thin-line
 * icon in the notched ring, the Profile title, the first sentence of its
 * description and a Get a Quote action that opens the enquiry dialog with that
 * service. No hover-only content: the tile steps one palette colour lighter on
 * hover or focus, and its text colour steps with it.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { Fragment } from 'react';
import { Icon } from '@/components/ui/Icon';
import { IconRing } from '@/components/ui/IconRing';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ShapedPhoto } from '@/components/ui/ShapedPhoto';
import { Tile } from '@/components/ui/Tile';
import type { PhotoId } from '@/content/photos';
import { serviceClusters, services, servicesSection, type Service } from '@/content/services';
import { useInquiry } from '@/context/InquiryContext';
import { cn } from '@/lib/cn';

/** Photographs that sit between tiles: after `afterIndex` tiles within a cluster. */
const MOSAIC_PHOTOS: Partial<Record<Service['cluster'], { photo: PhotoId; afterIndex: number; wide?: boolean }>> = {
  build: { photo: 'phone-coffee', afterIndex: 2 },
  advise: { photo: 'partnership-handshake', afterIndex: 3, wide: true },
};

function ServiceTile({ service, index, spanLast = false }: { service: Service; index: number; spanLast?: boolean }) {
  const { openInquiry } = useInquiry();
  const titleId = `service-${service.slug}-title`;
  return (
    <Reveal as="li" delay={(index % 3) * 70} className={cn('h-full', spanLast && 'md:col-span-2 xl:col-span-1')}>
      <Tile
        as="article"
        tone={service.tone}
        id={`service-${service.slug}`}
        aria-labelledby={titleId}
        className="rule-grow flex h-full flex-col p-7 pt-9"
      >
        <IconRing icon={service.icon} />
        <h4 id={titleId} className="mt-6 text-balance text-h4">
          {service.title}
        </h4>
        <p className="tile-muted mt-3 text-small">{service.summary}</p>
        {/* Fifteen buttons share one label, so each is described by its own tile heading (WCAG 2.4.6). */}
        <button
          type="button"
          aria-describedby={titleId}
          onClick={() => openInquiry({ type: 'service', name: service.title })}
          className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 font-bold underline-offset-4 hover:underline"
        >
          {servicesSection.quoteLabel}
          <Icon name="ArrowRight" size={18} />
        </button>
      </Tile>
    </Reveal>
  );
}

export function Services() {
  return (
    <Section
      id="services"
      surface="brand"
      numeral="02"
      labelledBy="services-heading"
      topCurve={{ tone: 'alt', variant: 'concave' }}
      bottomCurve={{ tone: 'page', variant: 'concave' }}
    >
      <div className="wrap">
        <SectionHeader
          id="services-heading"
          eyebrow={servicesSection.eyebrow}
          heading={servicesSection.heading}
          lead={servicesSection.lead}
        />

        {serviceClusters.map((cluster) => {
          const tiles = services.filter((service) => service.cluster === cluster.id);
          const mosaic = MOSAIC_PHOTOS[cluster.id];
          // At two columns a photo takes a full row; if the cells then add up to an odd number,
          // the last tile spans both columns so the grid never ends with a hole.
          const oddAtTwoColumns = (tiles.length + (mosaic ? 2 : 0)) % 2 === 1;
          return (
            <div key={cluster.id} className="mt-16">
              <h3 className="mb-6 flex items-center gap-4 text-overline uppercase text-accent-text">
                {cluster.title}
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              </h3>
              <ul className="grid grid-flow-dense gap-4 md:grid-cols-2 xl:grid-cols-3">
                {tiles.map((service, i) => (
                  <Fragment key={service.slug}>
                    {mosaic && i === mosaic.afterIndex && (
                      <li
                        className={`h-full min-h-56 ${mosaic.wide ? 'md:col-span-2 xl:col-span-2' : 'md:col-span-2 xl:col-span-1'}`}
                      >
                        <ShapedPhoto
                          photo={mosaic.photo}
                          shape="chamfer"
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      </li>
                    )}
                    <ServiceTile service={service} index={i} spanLast={oddAtTwoColumns && i === tiles.length - 1} />
                  </Fragment>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export default Services;
