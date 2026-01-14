/**
 * Hero Section Component
 * A stunning hero section with background image and theme-responsive overlays.
 * Features modern glassmorphism, animated elements, and smooth transitions.
 * Mobile-first design with beautiful visual effects.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button, Badge, ComingSoonModal } from '@/components/ui';

/**
 * Main hero section with eye-catching background and modern overlay effects.
 * Showcases the brand identity and primary value proposition.
 * Adapts beautifully to both light and dark themes.
 */
export function Hero() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Smooth scroll to packages section
  const scrollToPackages = () => {
    const element = document.querySelector('#packages');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/slide-images/7.jpg"
          alt="Web development workspace"
          fill
          className="object-cover object-center scale-105 animate-hero-zoom"
          priority
          quality={90}
        />
      </div>

      {/* Theme-Responsive Overlay System */}
      {/* Light Mode: Clean, bright overlay with subtle gradient */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-white/85 via-white/75 to-indigo-50/80 dark:from-transparent dark:via-transparent dark:to-transparent" />

      {/* Dark Mode: Rich, deep overlay with brand colors */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-transparent via-transparent to-transparent dark:from-slate-950/90 dark:via-slate-900/85 dark:to-violet-950/80" />

      {/* Bottom gradient for depth in both themes */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-slate-950/70 dark:via-transparent dark:to-transparent" />

      {/* Subtle top vignette */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-slate-900/10 via-transparent to-transparent dark:from-slate-950/50 dark:via-transparent dark:to-transparent" />

      {/* Animated Accent Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-violet-500/10 dark:bg-violet-600/20 rounded-full blur-3xl animate-float z-[3]" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-80 md:h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl animate-float-delayed z-[3]" />

      {/* Subtle Grid Pattern - adds texture */}
      <div
        className="absolute inset-0 z-[3] opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(148 163 184 / 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(148 163 184 / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating Particles - desktop only */}
      <div className="hidden md:block absolute top-20 left-10 w-2 h-2 bg-violet-500 rounded-full animate-pulse-slow z-[4]" />
      <div className="hidden md:block absolute top-40 right-20 w-3 h-3 bg-indigo-500 rounded-full animate-pulse-slow delay-300 z-[4]" />
      <div className="hidden md:block absolute bottom-40 left-20 w-2 h-2 bg-purple-500 rounded-full animate-pulse-slow delay-700 z-[4]" />
      <div className="hidden md:block absolute bottom-32 right-32 w-4 h-4 bg-violet-400/50 rounded-full animate-pulse-slow delay-500 z-[4]" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex mb-6 md:mb-8 animate-fade-in-up">
            <Badge variant="primary" className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-violet-200 dark:border-violet-500/30">
              <span className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse" />
              Available for New Projects
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 animate-fade-in-up animation-delay-100">
            <span className="text-slate-900 dark:text-white drop-shadow-sm">Crafting </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Digital Excellence
              </span>
              {/* Decorative underline */}
              <svg
                className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-violet-500/40 dark:text-violet-500/30"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 7 Q50 0, 100 7 T200 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <br />
            <span className="text-slate-900 dark:text-white drop-shadow-sm">for Your Business</span>
          </h1>

          {/* Subtitle with glass card effect */}
          <div className="animate-fade-in-up animation-delay-200">
            <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-8 md:mb-10 max-w-2xl mx-auto px-4 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-white/50 dark:border-slate-700/30">
              Transform your vision into a stunning online presence. We deliver
              modern, responsive websites that captivate your audience and drive
              real business results.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center animate-fade-in-up animation-delay-300 px-4">
            <Button size="lg" onClick={scrollToPackages} fullWidth className="sm:w-auto shadow-lg shadow-violet-500/25">
              Explore Packages
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              className="sm:w-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800"
              onClick={() => setShowComingSoon(true)}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              See Our Work
            </Button>
          </div>

          {/* Coming Soon Modal */}
          <ComingSoonModal
            isOpen={showComingSoon}
            onClose={() => setShowComingSoon(false)}
            featureName="Portfolio"
          />

          {/* Stats with glass card effect */}
          <div className="mt-12 md:mt-16 animate-fade-in-up animation-delay-400">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/50 dark:border-slate-700/30 shadow-xl shadow-slate-900/5 dark:shadow-violet-500/5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {[
                  { value: '4+', label: 'Projects Delivered' },
                  { value: '4+', label: 'Happy Clients' },
                  { value: '5+', label: 'Years Experience' },
                  { value: '100%', label: 'Client Satisfaction' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent z-[5]" />

      {/* Scroll Indicator - desktop only */}
      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-slate-400/50 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-scroll-down" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
