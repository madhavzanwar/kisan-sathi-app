import React, { useRef, useEffect } from 'react';
import { BlurIn } from '../design-system/components/BlurIn.jsx';
import { ScrollRevealText } from '../design-system/components/ScrollRevealText.jsx';
import { LANDING_CONTENT } from '../content/landing.js';

/**
 * StatementSection — Scroll-driven word reveal with embedded looping video pill.
 * Transitions words from muted sage to dark forest ink on scroll.
 * Uses IntersectionObserver so video starts only near viewport and pauses off-screen.
 */
export const StatementSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect reduced motion
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const inlinePill = (
    <span
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        width: '92px',
        height: '42px',
        borderRadius: '999px',
        overflow: 'hidden',
        margin: '0 8px 4px',
        border: '1.5px solid rgba(14, 42, 18, 0.18)',
        boxShadow: '0 6px 16px rgba(14, 42, 18, 0.12)',
        position: 'relative',
        backgroundColor: '#0E2A12',
      }}
    >
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="none"
        poster={LANDING_CONTENT.statement.videoThumbnail}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
    </span>
  );

  const fullText = `${LANDING_CONTENT.statement.beforePill} instant diagnosis, exact dosage, and answers in seconds.`;

  return (
    <section
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 'clamp(64px, 8vw, 108px) clamp(20px, 4vw, 48px)',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <BlurIn>
          <div style={{ marginBottom: '28px' }}>
            <span className="eyebrow-tag">{LANDING_CONTENT.statement.eyebrow}</span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(28px, 3.8vw, 42px)',
              fontWeight: 600,
              lineHeight: 1.4,
              letterSpacing: '-0.025em',
            }}
          >
            <ScrollRevealText
              text={fullText}
              inlineElement={inlinePill}
              inlineInsertIndex={10}
            />
          </div>
        </BlurIn>
      </div>
    </section>
  );
};

export default StatementSection;
