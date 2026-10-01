import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../design-system/components/SectionHeading.jsx';
import { BlurIn } from '../design-system/components/BlurIn.jsx';
import { LANDING_CONTENT } from '../content/landing.js';

/**
 * SolutionsCarousel — Horizontally scrollable portrait crop cards
 * with staggered vertical offsets and smooth CSS scroll-snap.
 */
export const SolutionsCarousel = () => {
  const scrollRef = useRef(null);

  return (
    <section
      id="solutions"
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 'clamp(64px, 8vw, 100px) clamp(20px, 4vw, 48px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <BlurIn>
          <SectionHeading
            eyebrow={LANDING_CONTENT.solutionsCarousel.eyebrow}
            title={LANDING_CONTENT.solutionsCarousel.headingTitle}
            accent={LANDING_CONTENT.solutionsCarousel.headingAccent}
            description={LANDING_CONTENT.solutionsCarousel.description}
          />

          {/* Staggered Scroll-Snap Horizontal Container */}
          <div
            ref={scrollRef}
            className="solutions-carousel-track"
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '16px 4px 36px 4px',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {LANDING_CONTENT.solutionsCarousel.crops.map((crop, index) => {
              const isStaggered = index % 2 === 1;

              return (
                <div
                  key={crop.name}
                  style={{
                    scrollSnapAlign: 'start',
                    flexShrink: 0,
                    width: 'clamp(260px, 25vw, 310px)',
                    height: '430px',
                    marginTop: isStaggered ? '36px' : '0px',
                    position: 'relative',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    boxShadow: '0 14px 36px rgba(14, 42, 18, 0.12)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 48px rgba(14, 42, 18, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 14px 36px rgba(14, 42, 18, 0.12)';
                  }}
                >
                  <Link
                    to={crop.path}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      textDecoration: 'none',
                    }}
                  >
                    {/* Crop Image */}
                    <img
                      src={crop.image}
                      alt={crop.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/features/guides.jpg';
                      }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to top, rgba(14, 42, 18, 0.95) 0%, rgba(14, 42, 18, 0.45) 50%, transparent 100%)',
                      }}
                    />

                    {/* Top Pill Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '18px',
                        left: '18px',
                        background: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: 'var(--color-forest-ink, #0E2A12)',
                      }}
                    >
                      {crop.stages}
                    </div>

                    {/* Bottom Content Block */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '24px 20px',
                        color: '#FFFFFF',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <h3
                          style={{
                            margin: 0,
                            fontFamily: 'var(--font-sans)',
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                          }}
                        >
                          {crop.name}
                        </h3>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-lime-accent, #D5F145)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ArrowUpRight size={16} color="#0E2A12" strokeWidth={2.5} />
                        </div>
                      </div>

                      <p
                        style={{
                          margin: '0 0 8px 0',
                          fontFamily: 'var(--font-serif-accent)',
                          fontStyle: 'italic',
                          fontSize: '14px',
                          color: 'var(--color-lime-accent, #D5F145)',
                        }}
                      >
                        {crop.scientific}
                      </p>

                      <p
                        style={{
                          margin: 0,
                          fontFamily: 'var(--font-sans)',
                          fontSize: '12.5px',
                          lineHeight: 1.5,
                          color: 'rgba(255, 255, 255, 0.82)',
                        }}
                      >
                        {crop.description}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </BlurIn>
      </div>

      <style>{`
        .solutions-carousel-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default SolutionsCarousel;
