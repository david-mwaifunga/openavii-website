/**
 * About Section Component
 * Showcases Openavii Technologies' identity and core values.
 * Features animated cards, brand story, and background image with overlays.
 * Theme-responsive with mobile-first design and scroll animations.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui';
import { useScrollAnimation } from '@/hooks';

/** Core values/features data */
const features = [
  {
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Fast Delivery',
    description: 'We deliver quality websites within tight deadlines, ensuring your business goes live quickly.',
  },
  {
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Mobile First',
    description: 'Every design is optimized for mobile devices, ensuring a seamless experience across all screens.',
  },
  {
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Secure & Reliable',
    description: 'Built with best practices in security and performance for a trustworthy online presence.',
  },
  {
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Client-Centered',
    description: 'Your vision drives our work. We collaborate closely to bring your unique ideas to life.',
  },
];

/** Name meaning breakdown */
const nameMeaning = [
  { part: 'Open', meaning: 'Open', description: 'Transparent, accessible solutions' },
  { part: 'avi', meaning: 'Light', description: 'Illuminating digital pathways' },
  { part: 'i', meaning: 'International', description: 'Global reach and standards' },
];

/**
 * About section showcasing company identity, values, and expertise.
 * Features background image with theme-responsive overlays.
 */
export function About() {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>();
  const [meaningRef, meaningVisible] = useScrollAnimation<HTMLDivElement>();
  const [featuresRef, featuresVisible] = useScrollAnimation<HTMLDivElement>();
  const [processRef, processVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="about" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/slide-images/3.jpg"
          alt="Creative workspace"
          fill
          className="object-cover object-center"
          quality={85}
        />
      </div>

      {/* Theme-Responsive Overlays */}
      {/* Light Mode Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/92 via-slate-50/90 to-white/95 dark:from-transparent dark:via-transparent dark:to-transparent" />

      {/* Dark Mode Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-transparent dark:from-slate-900/95 dark:via-slate-950/92 dark:to-slate-900/95" />

      {/* Decorative gradient accent */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 dark:from-violet-600/10 dark:via-transparent dark:to-indigo-600/10" />

      {/* Section borders */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent z-[3]" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-[3]" />

      {/* Animated Accent Orbs */}
      <div className="absolute top-1/4 right-0 w-48 h-48 md:w-72 md:h-72 bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-3xl animate-float z-[2]" />
      <div className="absolute bottom-1/4 left-0 w-40 h-40 md:w-64 md:h-64 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl animate-float-delayed z-[2]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`max-w-3xl mx-auto text-center mb-12 md:mb-16 scroll-animate reveal-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <span className="text-violet-600 dark:text-violet-400 font-semibold text-sm uppercase tracking-widest mb-4 block">
            About Us
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
            Illuminating Your{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Digital Journey
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg px-4 py-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/30">
            At Openavii Technologies, we believe every business deserves a powerful online presence.
            We combine creativity with technical excellence to build websites that truly represent your brand.
          </p>
        </div>

        {/* Name Meaning Section */}
        <div
          ref={meaningRef}
          className={`max-w-4xl mx-auto mb-12 md:mb-20 scroll-animate reveal-scale ${meaningVisible ? 'is-visible' : ''}`}
        >
          <Card variant="gradient" className="p-6 md:p-8 lg:p-12 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-white/50 dark:border-slate-700/30">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                The Meaning Behind{' '}
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Openavii
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {nameMeaning.map((item, index) => (
                <div
                  key={index}
                  className="text-center p-4 md:p-6 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                    {item.part}
                  </div>
                  <div className="text-slate-900 dark:text-white font-semibold mb-1">
                    &ldquo;{item.meaning}&rdquo;
                  </div>
                  <div className="text-slate-500 dark:text-slate-500 text-sm">{item.description}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6 md:mt-8">
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
                Together:{' '}
                <span className="text-slate-900 dark:text-white font-semibold">
                  Openavii Technologies
                </span>{' '}
                — Bringing open, illuminating solutions to businesses worldwide.
              </p>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div
          ref={featuresRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 scroll-animate reveal-up ${featuresVisible ? 'is-visible' : ''}`}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="glass"
              className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-white/50 dark:border-slate-700/30 h-full"
            >
              <CardContent className="p-4 md:p-6">
                {/* Icon */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-600/20 dark:to-indigo-600/20 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-3 md:mb-4 group-hover:scale-110 group-hover:border-violet-500/40 transition-all duration-300">
                  {feature.icon}
                </div>
                {/* Title */}
                <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Preview */}
        <div
          ref={processRef}
          className={`mt-12 md:mt-20 scroll-animate reveal-up ${processVisible ? 'is-visible' : ''}`}
        >
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-4">Our Simple Process</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">From concept to launch in four streamlined steps</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
            {[
              { step: '01', title: 'Discover', description: 'Understanding your vision' },
              { step: '02', title: 'Design', description: 'Crafting the blueprint' },
              { step: '03', title: 'Develop', description: 'Building with precision' },
              { step: '04', title: 'Deploy', description: 'Going live seamlessly' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="flex flex-col items-center text-center"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base md:text-lg mb-2 md:mb-3 shadow-lg shadow-violet-500/25 hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-semibold mb-1 text-sm md:text-base">{item.title}</h4>
                  <p className="text-slate-500 dark:text-slate-500 text-xs md:text-sm">{item.description}</p>
                </div>
                {/* Connector line - hidden on mobile, shown on md+ */}
                {index < 3 && (
                  <div className="hidden md:block w-12 lg:w-16 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
