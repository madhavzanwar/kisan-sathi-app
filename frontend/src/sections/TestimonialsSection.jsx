import React, { useRef } from 'react';
import { Avatar } from 'antd';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { SectionHeading } from '../design-system/components/SectionHeading.jsx';
import { BlurIn } from '../design-system/components/BlurIn.jsx';
import { LANDING_CONTENT } from '../content/landing.js';

/**
 * TestimonialsSection — Real-world agricultural scenario cards
 * with clearly labelled sample workflows and circular nav arrows.
 */
export const TestimonialsSection = () => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 440;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      style={{
        width: '100%',
        backgroundColor: '#F7F8F6',
        padding: 'clamp(64px, 8vw, 100px) clamp(20px, 4vw, 48px)',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        <BlurIn>
          {/* Header Row with Title and Circular Prev/Next Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            <div style={{ flex: 1, minWidth: '280px' }}>
              <SectionHeading
                eyebrow={LANDING_CONTENT.testimonials.eyebrow}
                title={LANDING_CONTENT.testimonials.headingTitle}
                accent={LANDING_CONTENT.testimonials.headingAccent}
                description={LANDING_CONTENT.testimonials.description}
                style={{ marginBottom: 0 }}
              />
            </div>

            {/* Circular Prev/Next Arrow Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => handleScroll('left')}
                aria-label="Previous scenario"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(14, 42, 18, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0E2A12',
                  boxShadow: '0 4px 12px rgba(14, 42, 18, 0.06)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0E2A12';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#0E2A12';
                }}
              >
                <ArrowLeft size={18} />
              </button>

              <button
                onClick={() => handleScroll('right')}
                aria-label="Next scenario"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(14, 42, 18, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0E2A12',
                  boxShadow: '0 4px 12px rgba(14, 42, 18, 0.06)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0E2A12';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#0E2A12';
                }}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Scenarios Track */}
          <div
            ref={scrollRef}
            className="scenarios-carousel-track"
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '12px 4px 24px 4px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {LANDING_CONTENT.testimonials.scenarios.map((sc) => (
              <div
                key={sc.id}
                style={{
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                  width: 'clamp(320px, 42vw, 480px)',
                  backgroundColor: '#EDF2F1',
                  borderRadius: '20px',
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(14, 42, 18, 0.06)',
                  border: '1px solid rgba(14, 42, 18, 0.08)',
                }}
              >
                <div>
                  {/* Top Badge: Labelled clearly as sample workflow */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        backgroundColor: '#FFFFFF',
                        color: 'var(--color-cta-green, #2E6B34)',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        border: '1px solid rgba(46, 107, 52, 0.2)',
                      }}
                    >
                      {sc.label}
                    </span>
                    <Quote size={24} color="#5C6E5F" style={{ opacity: 0.6 }} />
                  </div>

                  {/* Scenario Narrative */}
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(14px, 1.1vw, 15.5px)',
                      lineHeight: 1.65,
                      color: 'var(--color-forest-ink, #0E2A12)',
                      margin: '0 0 24px 0',
                    }}
                  >
                    "{sc.quote}"
                  </p>
                </div>

                {/* Persona Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(14, 42, 18, 0.1)',
                    paddingTop: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar src={sc.avatar} size={42} style={{ border: '2px solid #FFFFFF' }} />
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '14.5px',
                          fontWeight: 700,
                          color: 'var(--color-forest-ink, #0E2A12)',
                        }}
                      >
                        {sc.farmer}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '12px',
                          color: '#5C6E5F',
                        }}
                      >
                        {sc.crop} • {sc.location}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#2E6B34',
                      backgroundColor: 'rgba(46, 107, 52, 0.1)',
                      padding: '3px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    {sc.featureUsed}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </BlurIn>
      </div>

      <style>{`
        .scenarios-carousel-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
