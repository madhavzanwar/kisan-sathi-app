import React, { useEffect, useRef } from 'react';

/**
 * SmoothScroll — Dynamically loads Lenis on desktop pointer devices only.
 * Completely bypassed on touch / mobile devices (< 768px) and when prefers-reduced-motion is requested.
 */
export const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Accessibility check: Reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile / Touch device check
    const isTouchOrMobile =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);

    if (prefersReducedMotion || isTouchOrMobile) {
      return;
    }

    let active = true;
    let animationFrameId;

    // Dynamic import to avoid loading Lenis bundle on mobile
    import('lenis')
      .then(({ default: Lenis }) => {
        if (!active) return;
        const lenis = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.5,
        });

        lenisRef.current = lenis;

        function raf(time) {
          lenis.raf(time);
          if (active) {
            animationFrameId = requestAnimationFrame(raf);
          }
        }

        animationFrameId = requestAnimationFrame(raf);
      })
      .catch((err) => {
        console.warn('Failed to load Lenis smooth scroll:', err);
      });

    return () => {
      active = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
