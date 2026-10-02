import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { BgVideo } from '../design-system/components/BgVideo.jsx';
import { useLang } from '../i18n/index.js';

/**
 * HeroSection — 100vh Full-Bleed Wheat Video Hero
 * Matches the reference design with editorial serif accent, lime CTA pill,
 * hairline bottom divider, SCROLL indicator, and truthful stats badge.
 */
export const HeroSection = ({ onPrimaryAction, onSecondaryAction }) => {
  const navigate = useNavigate();
  const { t, currentLang } = useLang();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(max-width: 768px)').matches));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrimary = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      navigate('/dashboard?tab=heal');
    }
  };

  const handleSecondary = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      const target = document.getElementById('powered-by-strip') || document.getElementById('features');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        color: '#FFFFFF',
      }}
    >
      {/* 1. Background Video Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <BgVideo
          src="/videos/hero.mp4"
          webmSrc="/videos/hero.webm"
          poster="/videos/hero-poster.webp"
          forcePoster={isMobile}
        />
      </div>

      {/* 2. Legibility Gradient Overlay (darkening bottom-left for crisp text) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: `
            linear-gradient(
              to top,
              rgba(14, 42, 18, 0.88) 0%,
              rgba(14, 42, 18, 0.6) 28%,
              rgba(0, 0, 0, 0.25) 55%,
              transparent 100%
            ),
            linear-gradient(
              to right,
              rgba(14, 42, 18, 0.72) 0%,
              rgba(14, 42, 18, 0.35) 45%,
              transparent 80%
            )
          `,
          pointerEvents: 'none',
        }}
      />

      {/* 3. Hero Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 48px) clamp(24px, 3vh, 36px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Main Headline & Subtext Column */}
        <div style={{ maxWidth: '640px' }}>
          <h1
            style={{
              margin: 0,
              lineHeight: currentLang === 'en' ? 1.08 : 1.25,
              letterSpacing: currentLang === 'en' ? '-0.03em' : 'normal',
              fontWeight: 700,
              fontSize: 'clamp(38px, 5.2vw, 68px)',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-sans)', display: 'block' }}>
              {t('landing:hero.headlineLine1')}
            </span>
            <span
              style={{
                fontFamily: currentLang === 'en' ? 'var(--font-serif-accent)' : 'var(--font-sans)',
                fontStyle: currentLang === 'en' ? 'italic' : 'normal',
                fontWeight: currentLang === 'en' ? 400 : 700,
                color: currentLang === 'en' ? '#FFFFFF' : 'var(--color-lime-accent, #D5F145)',
              }}
            >
              {t('landing:hero.headlineAccent')}
            </span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(14px, 1.15vw, 16px)',
              lineHeight: currentLang === 'en' ? 1.6 : 1.65,
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '18px 0 28px 0',
              maxWidth: '520px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            {t('landing:hero.subtext')}
          </p>

          {/* CTAs Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              alignItems: 'center',
            }}
          >
            {/* Primary Lime Pill Button */}
            <button
              onClick={handlePrimary}
              style={{
                backgroundColor: 'var(--color-lime-accent, #D5F145)',
                color: '#0E2A12',
                fontFamily: 'var(--font-sans)',
                fontSize: '14.5px',
                fontWeight: 600,
                padding: '13px 28px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(213, 241, 69, 0.32)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(213, 241, 69, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(213, 241, 69, 0.32)';
              }}
            >
              <span>{t('landing:hero.primaryCta')}</span>
              <ArrowUpRight size={17} strokeWidth={2.5} />
            </button>

            {/* Secondary Glass Outline Pill */}
            <button
              onClick={handleSecondary}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-sans)',
                fontSize: '14.5px',
                fontWeight: 600,
                padding: '13px 26px',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              }}
            >
              {t('landing:hero.secondaryCta')}
            </button>
          </div>
        </div>

        {/* 4. Bottom Divider & Social Proof Bar */}
        <div
          style={{
            marginTop: 'clamp(28px, 4vh, 48px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.22)',
            paddingTop: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Left: Scroll indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            <span>{t('landing:hero.scroll')}</span>
            <span style={{ fontSize: '13px' }}>↓</span>
          </div>

          {/* Right: Truthful Stats Glass Pill */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              borderRadius: '999px',
              padding: '6px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Model & System Avatars */}
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#2E6B34',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid rgba(255, 255, 255, 0.9)',
                }}
              >
                AI
              </div>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#047857',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid rgba(255, 255, 255, 0.9)',
                  marginLeft: '-6px',
                }}
              >
                CV
              </div>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#92400E',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid rgba(255, 255, 255, 0.9)',
                  marginLeft: '-6px',
                }}
              >
                ML
              </div>
            </div>

            <span
              style={{
                fontSize: '12.5px',
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: 600,
              }}
            >
              {t('landing:hero.classesCount', { count: 38 })} • {t('landing:hero.statsBadge')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
