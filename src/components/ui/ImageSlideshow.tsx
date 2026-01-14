/**
 * Image Slideshow Component
 * A modern, animated image carousel with Ken Burns effect and smooth transitions.
 * Features auto-play, navigation dots, and elegant overlay text support.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

/** Slide data structure */
interface Slide {
  /** Image source path */
  src: string;
  /** Alt text for accessibility */
  alt: string;
}

interface ImageSlideshowProps {
  /** Array of slides to display */
  slides: Slide[];
  /** Auto-play interval in milliseconds (default: 5000) */
  interval?: number;
  /** Show navigation dots (default: true) */
  showDots?: boolean;
  /** Show navigation arrows (default: true) */
  showArrows?: boolean;
  /** Aspect ratio class (default: 'aspect-[16/9]') */
  aspectRatio?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Modern image slideshow with Ken Burns effect and smooth crossfade transitions.
 * Includes auto-play, navigation controls, and responsive design.
 */
export function ImageSlideshow({
  slides,
  interval = 5000,
  showDots = true,
  showArrows = true,
  aspectRatio = 'aspect-[16/9]',
  className = '',
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  // Navigate to next slide
  const nextSlide = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Navigate to previous slide
  const prevSlide = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Go to specific slide
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [isAutoPlaying, interval, nextSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (slides.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl md:rounded-3xl ${aspectRatio} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Image slideshow"
      aria-roledescription="carousel"
    >
      {/* Slides Container */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={index}
              className={`
                absolute inset-0 transition-all duration-1000 ease-out
                ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                ${isActive && direction === 'next' ? 'animate-slideshow-ken-burns' : ''}
                ${isActive && direction === 'prev' ? 'animate-slideshow-ken-burns-reverse' : ''}
              `}
              aria-hidden={!isActive}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className={`
                  object-cover transition-transform duration-[8000ms] ease-out
                  ${isActive ? 'scale-110' : 'scale-100'}
                `}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          );
        })}
      </div>

      {/* Gradient Overlays for depth */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 via-transparent to-slate-900/20" />
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="
              absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30
              w-10 h-10 md:w-12 md:h-12 rounded-full
              bg-white/10 backdrop-blur-md border border-white/20
              flex items-center justify-center
              text-white/80 hover:text-white hover:bg-white/20
              transition-all duration-300 hover:scale-110
              opacity-0 group-hover:opacity-100
              focus:outline-none focus:ring-2 focus:ring-white/50
            "
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="
              absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30
              w-10 h-10 md:w-12 md:h-12 rounded-full
              bg-white/10 backdrop-blur-md border border-white/20
              flex items-center justify-center
              text-white/80 hover:text-white hover:bg-white/20
              transition-all duration-300 hover:scale-110
              opacity-0 group-hover:opacity-100
              focus:outline-none focus:ring-2 focus:ring-white/50
            "
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                transition-all duration-300
                ${index === currentIndex
                  ? 'w-8 h-2 bg-white rounded-full'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70 rounded-full'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / slides.length) * 100}%`,
          }}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 md:top-6 right-4 md:right-6 z-30">
        <div className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
          <span className="text-white/90 text-sm font-medium">
            {currentIndex + 1} / {slides.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ImageSlideshow;
