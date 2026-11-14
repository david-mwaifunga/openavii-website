/**
 * Our Team
 * The three leaders named in the Company Profile, as transparent cut-outs on
 * cyan tiles (exactly as the Profile sets them): name in Bold, title in the
 * accent colour. No bios, no surnames - none exist in the brand documents.
 * Followed by the client strip.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tile } from '@/components/ui/Tile';
import { team, teamSection } from '@/content/team';
import { Clients } from './Clients';

export function Team() {
  return (
    <Section id="team" surface="page" numeral="06" labelledBy="team-heading">
      <div className="wrap">
        <SectionHeader id="team-heading" eyebrow={teamSection.eyebrow} heading={teamSection.heading} />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person, index) => (
            <Reveal as="li" key={person.slug} delay={index * 80}>
              <article aria-labelledby={`team-${person.slug}`}>
                <Tile tone="cyan" className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={person.photo}
                    alt={person.alt}
                    width={person.width}
                    height={person.height}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="absolute inset-0 size-full object-contain object-bottom"
                  />
                </Tile>
                <h3 id={`team-${person.slug}`} className="mt-5 text-h3">
                  {person.name}
                </h3>
                <p className="mt-1 font-bold text-accent-text">{person.title}</p>
              </article>
            </Reveal>
          ))}
        </ul>

        <Clients />
      </div>
    </Section>
  );
}

export default Team;
