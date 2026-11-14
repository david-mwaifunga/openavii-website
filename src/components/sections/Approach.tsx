/**
 * How We Work
 * "Understand First. Build Second. Improve Continuously." - three lines that
 * reveal in turn - then the process timeline: five phases on a line, the
 * Company Profile's seven stages hung beneath their phase. The line fills with
 * light and each node lights in sequence as the section scrolls into view (the
 * "illumination" motion; CSS plus one IntersectionObserver). Horizontal from
 * lg, vertical below. Without JavaScript (or with reduced motion) the timeline
 * is simply shown fully lit.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import type { CSSProperties } from 'react';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { approach, phases, processClosing, processHeading, processSection, stages } from '@/content/process';
import { useInquiry } from '@/context/InquiryContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/cn';

export function Approach() {
  const { openInquiry } = useInquiry();
  // Lit once the timeline's top edge has risen into the viewport, never "when a fifth of it is visible":
  // the vertical timeline is 1,500 px or more tall, and a short viewport (a landscape phone, 400 % zoom)
  // can never show a fifth of it, so it would stay dim for ever.
  const [timelineRef, lit] = useScrollAnimation<HTMLDivElement>({ threshold: 0, rootMargin: '0px 0px -20% 0px' });

  return (
    <Section id="approach" surface="page" numeral="03" labelledBy="approach-heading">
      <div className="wrap">
        <SectionHeader
          id="approach-heading"
          eyebrow={processSection.eyebrow}
          heading={{ lines: approach.lines }}
          lead={approach.paragraph}
        />

        <div ref={timelineRef} className={cn('timeline-wrap mt-24', lit && 'is-visible')}>
          <h3 className="text-balance text-h3">{processHeading}</h3>

          <div className="relative mt-14">
            {/* Track and light: the line is a vertical rail below lg, a horizontal rule from lg. */}
            <div
              aria-hidden="true"
              className="absolute left-[21px] top-0 h-full w-0.5 bg-line lg:left-0 lg:top-[21px] lg:h-0.5 lg:w-full"
            />
            <div
              aria-hidden="true"
              className="timeline-line absolute left-[21px] top-0 h-full w-0.5 bg-accent-fill lg:left-0 lg:top-[21px] lg:h-0.5 lg:w-full"
            />

            <ol className="relative grid gap-12 lg:grid-cols-5 lg:gap-6">
              {phases.map((phase, index) => (
                <li key={phase.id} data-phase={phase.id} className="relative pl-16 lg:pl-0 lg:pt-16">
                  <span
                    aria-hidden="true"
                    className="timeline-node absolute left-0 top-0 grid size-11 place-items-center rounded-pill border-2 border-accent-fill bg-accent-fill text-small font-extrabold text-on-accent"
                    style={{ '--i': index } as CSSProperties}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-h4">{phase.label}</h4>
                  <ul className="mt-5 space-y-4">
                    {stages
                      .filter((stage) => stage.phase === phase.id)
                      .map((stage) => (
                        <li key={stage.id} className="rounded-tile border border-line bg-alt p-5">
                          <h5 className="font-bold text-heading">{stage.title}</h5>
                          <p className="mt-2 text-small text-muted">{stage.description}</p>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-24 grid items-center gap-8 border-t border-line pt-12 lg:grid-cols-12">
          <p className="text-lead font-light text-heading lg:col-span-8">{processClosing.statement}</p>
          <div className="lg:col-span-4 lg:text-right">
            <Button size="lg" iconAfter="ArrowRight" onClick={() => openInquiry({ type: 'custom' })}>
              {processClosing.cta}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Approach;
