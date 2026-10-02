import React from 'react';
import { useLang } from '../i18n/index.js';

/**
 * PoweredByStrip — Credibility strip below hero.
 * Showcases real agricultural AI technologies (PyTorch, Gemini, FastAPI, Scikit-Learn).
 */
export const PoweredByStrip = () => {
  const { t } = useLang();

  const techItems = [
    { name: 'PyTorch', desc: t('landing:poweredBy.pytorch') },
    { name: 'Gemini 1.5 Pro', desc: t('landing:poweredBy.gemini') },
    { name: 'FastAPI', desc: t('landing:poweredBy.fastapi') },
    { name: 'Scikit-Learn', desc: t('landing:poweredBy.scikit') },
    { name: 'Copernicus', desc: t('landing:poweredBy.copernicus') },
  ];

  return (
    <section
      id="powered-by-strip"
      style={{
        width: '100%',
        backgroundColor: '#F0F2EE',
        borderTop: '1px solid rgba(14, 42, 18, 0.06)',
        borderBottom: '1px solid rgba(14, 42, 18, 0.08)',
        padding: '24px 0',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 48px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px 36px',
        }}
      >
        {/* Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '12.5px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-forest-ink, #0E2A12)',
              opacity: 0.8,
            }}
          >
            {t('landing:poweredBy.label')}
          </span>
        </div>

        {/* Tech Stack Wordmarks */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'clamp(20px, 3vw, 40px)',
          }}
        >
          {techItems.map((tech) => (
            <div
              key={tech.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#2A3F2E',
                transition: 'opacity 0.2s ease',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-forest-ink, #0E2A12)',
                }}
              >
                {tech.name}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-sans)',
                  color: '#1E4823',
                  backgroundColor: 'rgba(46, 107, 52, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontWeight: 600,
                }}
              >
                {tech.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PoweredByStrip;
