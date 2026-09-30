import React, { useState } from 'react';
import { Collapse } from 'antd';
import { SectionHeading } from '../design-system/components/SectionHeading.jsx';
import { BlurIn } from '../design-system/components/BlurIn.jsx';
import { LANDING_CONTENT } from '../content/landing.js';

/**
 * FAQSection — Centered agricultural FAQ with stacked light-gray rounded cards,
 * dark-green square minus buttons on active rows, and thin plus icons on closed rows.
 */
export const FAQSection = () => {
  const [activeKey, setActiveKey] = useState('0');
  const items = LANDING_CONTENT.faq.items;

  const collapseItems = items.map((faq, index) => {
    const isActive = String(index) === String(activeKey);

    return {
      key: String(index),
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '4px 0',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(15px, 1.25vw, 17px)',
              fontWeight: isActive ? 700 : 600,
              color: 'var(--color-forest-ink, #0E2A12)',
              paddingRight: '16px',
            }}
          >
            {faq.question}
          </span>

          <div style={{ flexShrink: 0 }}>
            {isActive ? (
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  backgroundColor: '#116522',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: 1,
                  boxShadow: '0 2px 8px rgba(17, 101, 34, 0.3)',
                }}
              >
                —
              </div>
            ) : (
              <span
                style={{
                  fontSize: '22px',
                  lineHeight: 1,
                  color: 'var(--color-text-muted, #7C8B7E)',
                  fontWeight: 300,
                }}
              >
                +
              </span>
            )}
          </div>
        </div>
      ),
      children: (
        <p
          style={{
            margin: '6px 0 8px 0',
            fontFamily: 'var(--font-sans)',
            fontSize: '14.5px',
            lineHeight: 1.65,
            color: 'var(--color-text-muted, #5C6E5F)',
          }}
        >
          {faq.answer}
        </p>
      ),
      style: {
        backgroundColor: '#F4F5F3',
        borderRadius: '14px',
        marginBottom: '12px',
        padding: '12px 20px',
        border: 'none',
      },
    };
  });

  return (
    <section
      id="faq"
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 'clamp(64px, 8vw, 100px) clamp(20px, 4vw, 48px)',
      }}
    >
      <div
        style={{
          maxWidth: '820px',
          margin: '0 auto',
        }}
      >
        <BlurIn>
          <SectionHeading
            align="center"
            eyebrow={LANDING_CONTENT.faq.eyebrow}
            title={LANDING_CONTENT.faq.headingTitle}
            accent={LANDING_CONTENT.faq.headingAccent}
            description={LANDING_CONTENT.faq.description}
          />

          <Collapse
            accordion
            activeKey={activeKey}
            onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)}
            ghost
            items={collapseItems}
          />
        </BlurIn>
      </div>
    </section>
  );
};

export default FAQSection;
