/**
 * Why Choose Openavii
 * Six reasons from the Company Profile on a brand band, in a two-by-three grid
 * with thin-line icons, beside a shaped photograph and the pull-statement
 * "Our relationship doesn't end at launch."
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ShapedPhoto } from '@/components/ui/ShapedPhoto';
import { reasons, whySection } from '@/content/why';

export function Why() {
  return (
    <Section
      id="why"
      surface="brand"
      numeral="05"
      labelledBy="why-heading"
      topCurve={{ tone: 'alt', variant: 'swoosh' }}
      bottomCurve={{ tone: 'page', variant: 'concave' }}
    >
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader id="why-heading" eyebrow={whySection.eyebrow} heading={whySection.heading} />
            <Reveal className="mt-10">
              <ShapedPhoto photo="office-win" shape="shape-6" sizes="(min-width: 1024px) 40vw, 100vw" />
            </Reveal>
            <Reveal className="mt-8">
              <p className="text-balance text-h3 text-heading">{whySection.pullStatement}</p>
            </Reveal>
          </div>

          <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-7">
            {reasons.map((reason, index) => (
              <Reveal as="li" key={reason.slug} delay={(index % 2) * 70} className="border-t border-line pt-7">
                <Icon name={reason.icon} size={34} className="text-accent-text" />
                <h3 className="mt-5 text-balance text-h4">{reason.title}</h3>
                <p className="mt-3 text-small text-muted">{reason.description}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export default Why;
