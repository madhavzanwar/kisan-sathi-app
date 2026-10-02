import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../design-system/components/SectionHeading.jsx';
import { BlurIn } from '../design-system/components/BlurIn.jsx';
import { useLang } from '../i18n/index.js';

const cropConfig = [
  { id: 'tomato', image: '/images/crops/tomato.jpg', path: '/dashboard?tab=guides&crop=tomato' },
  { id: 'cotton', image: '/images/crops/cotton.jpg', path: '/dashboard?tab=guides&crop=cotton' },
  { id: 'wheat', image: '/images/crops/wheat.jpg', path: '/dashboard?tab=guides&crop=wheat' },
  { id: 'rice', image: '/images/crops/rice.jpg', path: '/dashboard?tab=guides&crop=rice' },
  { id: 'sugarcane', image: '/images/crops/sugarcane.jpg', path: '/dashboard?tab=guides&crop=sugarcane' },
  { id: 'maize', image: '/images/crops/maize.jpg', path: '/dashboard?tab=guides&crop=maize' },
];

/**
 * SolutionsCarousel — Horizontally scrollable portrait crop cards
 * with staggered vertical offsets and smooth CSS scroll-snap.
 */
export const SolutionsCarousel = () => {
  const { t, currentLang } = useLang();
  const scrollRef = useRef(null);

  const crops = cropConfig.map((crop) => ({
    id: crop.id,
    name: t(`landing:solutions.${crop.id}.name`),
    scientific: t(`landing:solutions.${crop.id}.scientific`),
    description: t(`landing:solutions.${crop.id}.description`),
    stages: t(`landing:solutions.${crop.id}.stages`, { count: 6 }),
    image: crop.image,
    path: crop.path,
  }));

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
            eyebrow={t('landing:solutions.eyebrow')}
            title={t('landing:solutions.headingTitle')}
            accent={t('landing:solutions.headingAccent')}
            description={t('landing:solutions.description')}
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
            {crops.map((crop, index) => {
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
                          fontFamily: currentLang === 'en' ? 'var(--font-serif-accent)' : 'var(--font-sans)',
                          fontStyle: currentLang === 'en' ? 'italic' : 'normal',
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
