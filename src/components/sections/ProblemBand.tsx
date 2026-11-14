/**
 * Find the Fix
 * Problem-first, in the voice of the brand's own social creatives: six solid
 * tiles, each naming a problem, saying what changes and linking to the service
 * that fixes it. The tile's `data-targets` lists every related service, so
 * hovering or focusing a card lights all of them (CSS :has, see globals.css);
 * the card's link lights its first target through :target. Closes with the
 * "Explore Solutions" pull-quote.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tile } from '@/components/ui/Tile';
import { explore, problems, problemsSection } from '@/content/problems';

export function ProblemBand() {
  return (
    <Section id="problems" surface="page" labelledBy="problems-heading">
      <div className="wrap">
        <SectionHeader
          id="problems-heading"
          eyebrow={problemsSection.eyebrow}
          heading={problemsSection.heading}
          lead={problemsSection.lead}
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {problems.map((problem, index) => (
            <Reveal as="li" key={problem.id} delay={(index % 3) * 70} className="h-full">
              <Tile
                as="article"
                tone={index % 2 === 0 ? 'navy' : 'deep'}
                aria-labelledby={`problem-${problem.id}`}
                data-targets={problem.targets.join(' ')}
                className="problem-card rule-grow flex h-full flex-col p-7 pt-9"
              >
                <h3
                  id={`problem-${problem.id}`}
                  className="text-balance text-[clamp(1.375rem,1.1rem+0.8vw,1.75rem)] font-bold leading-tight tracking-tight"
                >
                  {problem.headline}
                </h3>
                <p className="tile-muted mt-4">{problem.body}</p>
                <a
                  href={`#service-${problem.targets[0]}`}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 font-bold underline-offset-4 hover:underline"
                >
                  {problem.cta}
                  <Icon name="ArrowRight" size={18} />
                </a>
              </Tile>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-20 grid items-end gap-8 border-t border-line pt-12 lg:grid-cols-12">
          <h3 className="text-balance text-h2 lg:col-span-7">{explore.headline}</h3>
          <div className="lg:col-span-5">
            <p className="text-lead font-light text-muted">{explore.body}</p>
            <Button className="mt-7" size="lg" href={explore.href} iconAfter="ArrowRight">
              {explore.cta}
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default ProblemBand;
