/**
 * Hero
 * Opens on the brand's campaign line over the dark "wave" artwork: oversized,
 * tightly tracked ExtraBold type across the full width (second line in bright
 * cyan), a faint oversized ring watermark, a problem-first promise, two clear
 * actions and the four pillars. The photograph is shaped by one of the approved
 * brand shapes and bleeds off the right edge of the screen on large displays
 * (below the text on mobile). It is the page's LCP element: the only image
 * preloaded, with a correct `sizes` hint.
 *
 * Motion (transform and opacity only, all CSS): the nav fades in, the headline
 * rises line by line through a mask, the rest fades up, the photograph wipes in,
 * and the wave drifts very slowly. Reduced-motion visitors see the final state.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { Fragment, type CSSProperties } from 'react';
import { Button } from '@/components/ui/Button';
import { RingMark } from '@/components/ui/RingMark';
import { Section } from '@/components/ui/Section';
import { ShapedPhoto } from '@/components/ui/ShapedPhoto';
import { hero } from '@/content/hero';
import { useInquiry } from '@/context/InquiryContext';

/** Stagger index for the load sequence. */
const step = (i: number) => ({ '--i': i }) as CSSProperties;

export function Hero() {
  const { openInquiry } = useInquiry();

  return (
    <Section
      id="home"
      surface="dark"
      labelledBy="home-heading"
      padded={false}
      bottomCurve={{ tone: 'page', variant: 'concave' }}
    >
      {/* Wave artwork: decorative, drifting slowly (transform only), darkened on the text side. */}
      <div
        data-wave=""
        aria-hidden="true"
        className="wave-drift absolute -inset-[4%] -z-20 bg-cover bg-center"
        style={{ backgroundImage: 'url(/brand/bg/wave-dark.webp)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-depth via-depth/80 to-depth/10 lg:via-depth/60"
      />
      <RingMark className="-left-[16%] -top-[8%] -z-10 w-[min(72vw,780px)] opacity-[0.06]" />

      <div className="relative pb-36 pt-[calc(var(--header-h)+3rem)] lg:pb-44 lg:pt-[calc(var(--header-h)+4.5rem)]">
        {/* Headline: the full width of the page, two lines on desktop. */}
        <div className="wrap">
          <p className="hero-fade flex items-center gap-3 text-overline uppercase text-accent-text" style={step(0)}>
            <span aria-hidden="true" className="h-px w-8 bg-accent-fill" />
            {hero.eyebrow}
          </p>
          <h1 id="home-heading" className="mt-6 text-heading">
            {hero.headline.map((line, i) => (
              <Fragment key={line}>
                <span className="hero-line" style={step(i)}>
                  <span className={i === 1 ? 'text-accent-text' : undefined}>{line}</span>
                </span>
                {i < hero.headline.length - 1 && ' '}
              </Fragment>
            ))}
          </h1>
        </div>

        {/* Promise and actions on the left; the photograph on the right runs to the screen edge.
            The left padding reproduces the page gutter, so the text lines up with the headline. */}
        <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-14 lg:pl-[max(2.5rem,calc((100%-80rem)/2+2.5rem))]">
          <div className="px-4 sm:px-6 lg:px-0">
            <p
              className="hero-fade text-[clamp(1.375rem,1rem+1.4vw,2rem)] font-light leading-snug text-heading"
              style={step(2)}
            >
              {hero.sub}
            </p>
            <p className="hero-fade mt-6 max-w-xl text-muted" style={step(3)}>
              {hero.body}
            </p>
            <div className="hero-fade mt-9 flex flex-wrap gap-4" style={step(4)}>
              <Button size="lg" className="w-full sm:w-auto" onClick={() => openInquiry({ type: 'custom' })}>
                {hero.primaryCta}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                href={hero.secondaryCta.href}
                iconAfter="ArrowRight"
              >
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>

          <div className="hero-photo px-4 sm:px-6 lg:px-0">
            <ShapedPhoto
              photo={hero.photo}
              shape="shape-3"
              sizes="(min-width: 1024px) 54vw, 100vw"
              objectPosition="28% 50%"
              preload
            />
          </div>
        </div>

        <div className="wrap">
          <ul
            aria-label="Our approach"
            className="hero-fade mt-16 grid gap-x-8 gap-y-7 border-t border-line pt-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
            style={step(5)}
          >
            {hero.pillars.map((pillar) => (
              <li key={pillar.title}>
                <span aria-hidden="true" className="mb-3 block h-0.5 w-8 bg-accent-fill" />
                <p className="text-body font-bold text-heading">{pillar.title}</p>
                <p className="mt-1 text-small text-muted">{pillar.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export default Hero;
