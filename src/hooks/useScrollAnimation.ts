/**
 * Scroll Animation Hook
 * A custom hook for detecting when elements enter the viewport.
 * Enables smooth scroll-triggered animations throughout the site.
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
  /** Only trigger once (default: true) */
  triggerOnce?: boolean;
}

/**
 * Hook that returns whether an element is visible in viewport
 * @param options Configuration options for the intersection observer
 * @returns [ref to attach to element, boolean indicating if visible]
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

export default useScrollAnimation;
