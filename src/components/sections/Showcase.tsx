/**
 * Showcase Section Component
 * A visually stunning section demonstrating design capability with an animated slideshow.
 * Features modern glassmorphism, gradient effects, and scroll-triggered animations.
 * Theme-responsive with mobile-first design.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import Image from 'next/image';
import { ImageSlideshow } from '@/components/ui';
import { useScrollAnimation } from '@/hooks';

/** Showcase slide images */
const showcaseSlides = [
  { src: '/slide-images/1.jpg', alt: 'Design showcase 1' },
  { src: '/slide-images/2.jpg', alt: 'Design showcase 2' },
  { src: '/slide-images/3.jpg', alt: 'Design showcase 3' },
  { src: '/slide-images/4.jpg', alt: 'Design showcase 4' },
  { src: '/slide-images/5.jpg', alt: 'Design showcase 5' },
  { src: '/slide-images/6.jpg', alt: 'Design showcase 6' },
  { src: '/slide-images/7.jpg', alt: 'Design showcase 7' },
  { src: '/slide-images/8.jpg', alt: 'Design showcase 8' },
];

/** Feature highlights */
const features = [
  {
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Responsive Design',
    description: 'Every website looks perfect on all devices',
  },
  {
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lightning Fast',
    description: 'Optimized for speed and performance',
  },
  {
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure & Reliable',
    description: 'Built with security best practices',
  },
];

/**
 * Showcase section with animated image slideshow and feature highlights.
 * Designed to demonstrate design capability and attention to visual detail.
 */
export function Showcase() {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>();
  const [slideshowRef, slideshowVisible] = useScrollAnimation<HTMLDivElement>();
  const [featuresRef, featuresVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/slide-images/5.jpg"
          alt="Modern workspace"
          fill
          className="object-cover object-center"
          quality={85}
        />
      </div>

      {/* Theme-Responsive Overlays */}
      {/* Light Mode Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-white/93 via-surface-muted/90 to-navy-tint/92 dark:from-transparent dark:via-transparent dark:to-transparent" />

      {/* Dark Mode Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-transparent via-transparent to-transparent dark:from-navy-dark/94 dark:via-navy-dark/92 dark:to-navy/90" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-accent/10 dark:bg-accent/15 rounded-full blur-3xl animate-float z-[2]" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 md:w-80 md:h-80 bg-cyan/10 dark:bg-cyan/15 rounded-full blur-3xl animate-float-delayed z-[2]" />

      {/* Section borders */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent z-[3]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-10 md:mb-16 scroll-animate reveal-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest mb-4 block">
            Our Craft
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-heading mb-4 md:mb-6">
            Design That Brings{' '}
            <span className="text-gradient-accent">
              Ideas to Light
            </span>
          </h2>
          <p className="text-fg-muted text-base md:text-lg px-4 py-3 rounded-2xl bg-surface/60 backdrop-blur-sm border border-line">
            We blend striking visuals with clean, purposeful design - weaving
            photography and rich media into interfaces that captivate your
            audience and feel effortless to use.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Slideshow - Takes up more space */}
          <div
            ref={slideshowRef}
            className={`lg:col-span-7 xl:col-span-8 scroll-animate reveal-left ${slideshowVisible ? 'is-visible' : ''}`}
          >
            <div className="group relative">
              {/* Decorative frame */}
              <div className="absolute -inset-1 md:-inset-2 bg-gradient-to-r from-accent via-accent to-cyan rounded-2xl md:rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

              {/* Slideshow container with glass effect border */}
              <div className="relative bg-gradient-to-r from-accent/20 to-cyan/20 p-1 md:p-1.5 rounded-2xl md:rounded-3xl">
                <ImageSlideshow
                  slides={showcaseSlides}
                  interval={5000}
                  showDots={true}
                  showArrows={true}
                  aspectRatio="aspect-[16/10]"
                  className="shadow-2xl shadow-accent/10"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 z-40">
                <div className="bg-surface/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl shadow-xl border border-line">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-brand-gradient flex items-center justify-center">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-heading">Pixel-Perfect</p>
                      <p className="text-xs text-fg-subtle">Every detail matters</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features sidebar */}
          <div
            ref={featuresRef}
            className={`lg:col-span-5 xl:col-span-4 space-y-4 md:space-y-6 scroll-animate reveal-right ${featuresVisible ? 'is-visible' : ''}`}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="group/feature relative p-4 md:p-6 rounded-xl md:rounded-2xl
                  bg-surface/70
                  backdrop-blur-md
                  border border-line
                  hover:border-accent/50
                  hover:shadow-lg hover:shadow-accent/10
                  transition-all duration-300
                  hover:-translate-y-1"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Icon */}
                <div className="
                  w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl mb-3 md:mb-4
                  bg-navy-tint
                  border border-line
                  flex items-center justify-center
                  text-accent
                  group-hover/feature:scale-110 transition-transform duration-300
                ">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-base md:text-lg font-semibold text-heading mb-1 md:mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-fg-muted">
                  {feature.description}
                </p>

                {/* Decorative arrow on hover */}
                <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}

            {/* CTA card */}
            <div className="
              p-5 md:p-6 rounded-xl md:rounded-2xl
              bg-brand-gradient
              text-white
              shadow-xl shadow-navy/25
            ">
              <p className="text-base md:text-lg font-semibold mb-1">Have an idea in mind?</p>
              <p className="text-sm text-white/80 mb-4">
                Let&apos;s turn it into something people love to use.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Start a conversation
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Showcase;
