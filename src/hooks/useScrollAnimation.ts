/**
 * Scroll Animation Hook
 * A custom hook for detecting when elements enter the viewport.
 * Enables smooth scroll-triggered animations throughout the site.
 * Animations replay each time elements scroll in/out of view.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

interface UseScrollAnimationOptions {
  /** Threshold for intersection (0-1), default 0.1 */
  threshold?: number;
  /** Root margin for earlier/later triggering */
  rootMargin?: string;
  /** Only trigger once per mount (default: false for continuous animations) */
  triggerOnce?: boolean;
  /** Delay before animation starts (ms) */
  delay?: number;
}

/**
 * Hook that returns whether an element is visible in viewport
 * Animations replay each time elements enter the viewport
 * @param options Configuration options for the intersection observer
 * @returns [ref to attach to element, boolean indicating if visible]
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
): [RefObject<T | null>, boolean] {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = false, // Changed to false for continuous animations
    delay = 0
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (entry.isIntersecting) {
          // Element is entering viewport
          if (delay > 0) {
            timeoutRef.current = setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) {
                observer.unobserve(element);
              }
            }, delay);
          } else {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(element);
            }
          }
        } else if (!triggerOnce) {
          // Element is leaving viewport - reset for next scroll
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return [ref, isVisible];
}

export default useScrollAnimation;
