import React from 'react';
import { BlurIn } from '../design-system/components/BlurIn.jsx';
import { ScrollRevealText } from '../design-system/components/ScrollRevealText.jsx';
import { useLang } from '../i18n/index.js';

/**
 * StatementSection — Scroll-driven word reveal text.
 * Transitions words from muted sage to dark forest ink on scroll.
 */
export const StatementSection = () => {
  const { t } = useLang();

  const beforePill = t('landing:statement.beforePill');
  const afterPill = t('landing:statement.afterPill');
  const fullText = `${beforePill} ${afterPill}`;

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
            <span className="eyebrow-tag">{t('landing:statement.eyebrow')}</span>
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
            <ScrollRevealText text={fullText} />
          </div>
        </BlurIn>
      </div>
    </section>
  );
};

export default StatementSection;
