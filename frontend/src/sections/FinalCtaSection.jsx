import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BlurIn } from '../design-system/components/BlurIn.jsx';
import { LANDING_CONTENT } from '../content/landing.js';

/**
 * FinalCtaSection — White fading smoothly into field photography
 * with centered headline and dark-green pill button leading to the main flow.
 */
export const FinalCtaSection = ({ onActionClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onActionClick) {
      onActionClick();
    } else {
      navigate(LANDING_CONTENT.finalCta.path);
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '580px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(80px, 10vw, 130px) clamp(20px, 4vw, 48px) clamp(100px, 12vw, 160px)',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Background Field Image */}
      <img
        src="/videos/hero-poster.webp"
        alt="Agricultural crop field"
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '75%',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          zIndex: 0,
        }}
      />

      {/* Smooth White-to-Field Fade Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(
              to bottom,
              #FFFFFF 0%,
              #FFFFFF 35%,
              rgba(255, 255, 255, 0.9) 55%,
              rgba(255, 255, 255, 0.4) 80%,
              rgba(14, 42, 18, 0.4) 100%
            )
          `,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '720px',
          margin: '0 auto',
        }}
      >
        <BlurIn>
          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(36px, 4.8vw, 56px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--color-forest-ink, #0E2A12)',
              margin: '0 0 16px 0',
              lineHeight: 1.15,
            }}
          >
            {LANDING_CONTENT.finalCta.headingLine1}
            <br />
            <span
              className="heading-accent"
              style={{
                color: 'var(--color-cta-green, #2E6B34)',
                display: 'inline-block',
                marginTop: '4px',
              }}
            >
              {LANDING_CONTENT.finalCta.headingAccent}
            </span>
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(15px, 1.2vw, 17px)',
              lineHeight: 1.6,
              color: 'var(--color-text-muted, #5C6E5F)',
              maxWidth: '560px',
              margin: '0 auto 36px auto',
            }}
          >
            {LANDING_CONTENT.finalCta.subtext}
          </p>

          <button
            onClick={handleClick}
            style={{
              backgroundColor: 'var(--color-cta-green, #2E6B34)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '15.5px',
              fontWeight: 600,
              padding: '16px 38px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px rgba(46, 107, 52, 0.35)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(46, 107, 52, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(46, 107, 52, 0.35)';
            }}
          >
            <span>{LANDING_CONTENT.finalCta.buttonText}</span>
            <ArrowRight size={18} />
          </button>
        </BlurIn>
      </div>
    </section>
  );
};

export default FinalCtaSection;
