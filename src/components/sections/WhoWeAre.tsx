/**
 * Who We Are
 * The Company Profile's story, then the brand explained: the name (Open + avi
 * + i) around the approved ring mark, vision / mission / purpose with thin
 * cyan rules and thin-line icons, the six core values (names only), the brand
 * promise and the three principles. Everything comes from content/; the only
 * new sentences are the headline and the name captions (registered COPY-NEW).
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ShapedPhoto } from '@/components/ui/ShapedPhoto';
import { about } from '@/content/about';
import { principles, strategy, values, valuesSection } from '@/content/values';

const STATEMENTS = ['vision', 'mission', 'purpose'] as const;

export function WhoWeAre() {
  return (
    <Section id="who-we-are" surface="alt" numeral="01" labelledBy="who-we-are-heading">
      <div className="wrap">
        {/* Story + photograph */}
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <SectionHeader id="who-we-are-heading" eyebrow={about.eyebrow} heading={about.heading} />
            <Reveal className="mt-9 space-y-5 text-muted">
              <p>{about.paragraphs[0]}</p>
              <p>{about.paragraphs[1]}</p>
              <p className="font-bold text-heading">{strategy.differentiator}</p>
            </Reveal>
            <Reveal className="mt-9 max-w-2xl border-l-2 border-accent-fill pl-6">
              <h3 className="text-h4">{about.callout.title}</h3>
              <p className="mt-2 text-muted">{about.callout.text}</p>
            </Reveal>
          </div>
          <Reveal variant="right" className="lg:col-span-5">
            <ShapedPhoto photo="home-laptop" shape="shape-2" sizes="(min-width: 1024px) 40vw, 100vw" />
          </Reveal>
        </div>

        {/* The name, around the approved mark */}
        <Reveal
          role="group"
          aria-labelledby="name-heading"
          className="mt-20 grid items-center gap-10 rounded-tile border border-line bg-surface p-8 lg:grid-cols-12 lg:p-12"
        >
          <div className="lg:col-span-3">
            <Logo variant="mark" decorative width={168} />
          </div>
          <div className="lg:col-span-9">
            <h3 id="name-heading" className="text-overline uppercase text-accent-text">
              {about.nameHeading}
            </h3>
            <dl className="mt-6 grid gap-8 sm:grid-cols-3">
              {about.nameMeaning.map((part) => (
                <div key={part.term}>
                  <dt className="text-[clamp(2.25rem,1.6rem+2.4vw,3.75rem)] font-extrabold leading-none tracking-[-0.04em] text-heading">
                    {part.term}
                  </dt>
                  <dd className="mt-3 text-muted">{part.gloss}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 border-t border-line pt-5 text-small font-bold text-heading">{about.ringFootnote}</p>
          </div>
        </Reveal>

        {/* Vision, mission, purpose */}
        <div className="mt-20 grid gap-12 md:grid-cols-3">
          {STATEMENTS.map((key, index) => (
            <Reveal key={key} delay={index * 80} className="border-l-2 border-accent-fill pl-6">
              <Icon name={strategy[key].icon} size={32} className="text-accent-text" />
              <p className="mt-5 text-overline uppercase text-accent-text">{strategy[key].label}</p>
              <p className="mt-3 text-heading">{strategy[key].text}</p>
            </Reveal>
          ))}
        </div>

        {/* Values and promise */}
        <div className="mt-20 grid items-start gap-10 border-t border-line pt-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-overline uppercase text-accent-text">{valuesSection.valuesLabel}</p>
            <ul aria-label={valuesSection.valuesLabel} className="mt-5 flex flex-wrap gap-3">
              {values.map((value) => (
                <li key={value.name}>
                  <Chip>{value.name}</Chip>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <p className="text-overline uppercase text-accent-text">{valuesSection.promiseLabel}</p>
            <p className="mt-5 max-w-3xl text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] font-light leading-relaxed text-heading">
              {strategy.promise}
            </p>
          </div>
        </div>

        {/* Principles */}
        <div className="mt-16 grid gap-10 border-t border-line pt-14 md:grid-cols-3">
          {principles.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 80}>
              <span aria-hidden="true" className="text-overline text-accent-text">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-h4">{principle.title}</h3>
              <p className="mt-2 text-muted">{principle.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default WhoWeAre;
