"use client";

import { useState, useEffect, useCallback } from "react";

interface UseScrollSpyOptions {
  rootMargin?: string;
  threshold?: number;
}

/**
 * Hook to track which heading is currently visible for Table of Contents
 */
export function useScrollSpy(
  headingIds: string[],
  options: UseScrollSpyOptions = {}
): string | null {
  const { rootMargin = "-80px 0px -80% 0px", threshold = 0 } = options;
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headingIds.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Get the topmost visible heading
          const topEntry = visibleEntries.reduce((prev, curr) => {
            const prevRect = prev.boundingClientRect;
            const currRect = curr.boundingClientRect;
            return prevRect.top < currRect.top ? prev : curr;
          });
          
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    // Observe all headings
    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headingIds, rootMargin, threshold]);

  return activeId;
}

/**
 * Hook to scroll to a heading smoothly
 */
export function useScrollToHeading() {
  const scrollToHeading = useCallback((headingId: string) => {
    const element = document.getElementById(headingId);
    
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL hash without scrolling
      history.pushState(null, "", `#${headingId}`);
    }
  }, []);

  return scrollToHeading;
}

export default useScrollSpy;
