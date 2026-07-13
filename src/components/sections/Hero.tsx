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

import Image from 'next/image';
import { Button, Badge } from '@/components/ui';

/**
 * Main hero section with eye-catching background and modern overlay effects.
 * Showcases the brand identity and primary value proposition.
 * Adapts beautifully to both light and dark themes.
 */
export function Hero() {
  // Smooth scroll to a target section
  const scrollTo = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-svh flex items-center justify-center overflow-hidden"
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
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-white/85 via-white/75 to-navy-tint/80 dark:from-transparent dark:via-transparent dark:to-transparent" />

      {/* Dark Mode: Rich, deep navy overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-transparent via-transparent to-transparent dark:from-navy-dark/92 dark:via-navy-dark/88 dark:to-navy/82" />

      {/* Bottom gradient for depth in both themes */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-navy-dark/70 dark:via-transparent dark:to-transparent" />

      {/* Subtle top vignette */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-navy-dark/10 via-transparent to-transparent dark:from-navy-dark/50 dark:via-transparent dark:to-transparent" />

      {/* Animated Accent Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl animate-float z-[3]" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-80 md:h-80 bg-cyan/10 dark:bg-cyan/15 rounded-full blur-3xl animate-float-delayed z-[3]" />

      {/* Subtle Grid Pattern - adds texture */}
      <div
        className="absolute inset-0 z-[3] opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(82 103 132 / 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(82 103 132 / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating Particles - desktop only */}
      <div className="hidden md:block absolute top-20 left-10 w-2 h-2 bg-accent rounded-full animate-pulse-slow z-[4]" />
      <div className="hidden md:block absolute top-40 right-20 w-3 h-3 bg-cyan rounded-full animate-pulse-slow delay-300 z-[4]" />
      <div className="hidden md:block absolute bottom-40 left-20 w-2 h-2 bg-accent rounded-full animate-pulse-slow delay-700 z-[4]" />
      <div className="hidden md:block absolute bottom-32 right-32 w-4 h-4 bg-cyan/50 rounded-full animate-pulse-slow delay-500 z-[4]" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex mb-6 md:mb-8 animate-fade-in-up">
            <Badge variant="primary" className="backdrop-blur-sm bg-surface/85 border-line">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              Available for New Projects
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.12] tracking-tight mb-5 md:mb-6 animate-fade-in-up animation-delay-100">
            <span className="text-heading drop-shadow-sm">Turning </span>
            <span className="relative inline-block">
              <span className="text-gradient-accent">
                Bright Ideas
              </span>
              {/* Decorative underline */}
              <svg
                className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-accent/40 dark:text-accent/30"
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
            <span className="text-heading drop-shadow-sm">into Digital Reality</span>
          </h1>

          {/* Subtitle with glass card effect */}
          <div className="animate-fade-in-up animation-delay-200">
            <p className="text-base sm:text-lg md:text-xl text-fg mb-8 md:mb-10 max-w-2xl mx-auto px-4 py-3 rounded-2xl bg-surface/50 backdrop-blur-sm border border-line">
              Bright ideas deserve to be seen. We design and build modern,
              responsive websites and applications that captivate your audience
              and drive real results.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center animate-fade-in-up animation-delay-300 px-4">
            <Button size="lg" onClick={() => scrollTo('#packages')} fullWidth className="sm:w-auto shadow-lg shadow-accent-solid/25">
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
              className="sm:w-auto bg-surface/70 backdrop-blur-sm hover:bg-surface"
              onClick={() => scrollTo('#contact')}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Get in Touch
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-surface-muted dark:from-navy-dark to-transparent z-[5]" />

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-fg-muted uppercase tracking-widest font-medium">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-navy-light/50 bg-surface/50 backdrop-blur-sm flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-scroll-down" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
