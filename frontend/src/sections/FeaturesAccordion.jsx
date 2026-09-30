import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'antd';
import { Leaf, FlaskConical, Satellite, BookOpen, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../design-system/components/SectionHeading.jsx';
import { BlurIn } from '../design-system/components/BlurIn.jsx';
import { LANDING_CONTENT } from '../content/landing.js';

const featureIcons = [
  <Leaf size={18} color="#0E2A12" strokeWidth={2.2} key="leaf" />,
  <FlaskConical size={18} color="#0E2A12" strokeWidth={2.2} key="flask" />,
  <Satellite size={18} color="#0E2A12" strokeWidth={2.2} key="satellite" />,
  <BookOpen size={18} color="#0E2A12" strokeWidth={2.2} key="book" />,
];

/**
 * FeaturesAccordion — 4-row real features accordion with lime active tile,
 * dark-green square minus button, and responsive side image crossfade.
 */
export const FeaturesAccordion = () => {
  const [activeKey, setActiveKey] = useState('0');
  const items = LANDING_CONTENT.featuresAccordion.items;
  const activeIndex = parseInt(activeKey || '0', 10) || 0;
  const activeItem = items[activeIndex] || items[0];

  const collapseItems = items.map((item, index) => {
    const isActive = String(index) === String(activeKey);

    return {
      key: String(index),
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Icon Tile */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: isActive ? 'var(--color-lime-accent, #D5F145)' : '#ECEEE9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.25s ease',
                boxShadow: isActive ? '0 4px 12px rgba(213, 241, 69, 0.4)' : 'none',
                flexShrink: 0,
              }}
            >
              {featureIcons[index]}
            </div>

            {/* Title */}
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(15.5px, 1.3vw, 18px)',
                fontWeight: 600,
                color: 'var(--color-forest-ink, #0E2A12)',
              }}
            >
              {item.title}
            </span>
          </div>

          {/* Right Action Button (+ or dark-green square -) */}
          <div style={{ flexShrink: 0, marginLeft: '12px' }}>
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
        <div style={{ padding: '0 0 16px 52px' }}>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14.5px',
              lineHeight: 1.65,
              color: 'var(--color-text-muted, #5C6E5F)',
              margin: '0 0 14px 0',
            }}
          >
            {item.description}
          </p>
          <Link
            to={item.path}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '13.5px',
              fontWeight: 600,
              color: 'var(--color-cta-green, #2E6B34)',
              textDecoration: 'none',
            }}
          >
            <span>{item.ctaText}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ),
    };
  });

  return (
    <section
      id="features"
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
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
          <SectionHeading
            eyebrow={LANDING_CONTENT.featuresAccordion.eyebrow}
            title={LANDING_CONTENT.featuresAccordion.headingTitle}
            accent={LANDING_CONTENT.featuresAccordion.headingAccent}
            description={LANDING_CONTENT.featuresAccordion.description}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 5vw, 64px)',
              alignItems: 'center',
            }}
          >
            {/* Left: Accordion Column */}
            <div>
              <Collapse
                accordion
                activeKey={activeKey}
                onChange={(key) => setActiveKey(Array.isArray(key) ? key[0] : key)}
                ghost
                items={collapseItems}
                style={{
                  border: 'none',
                }}
              />
            </div>

            {/* Right: Crossfading Image Column */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                height: 'clamp(360px, 45vw, 480px)',
                boxShadow: '0 16px 40px rgba(14, 42, 18, 0.1)',
                backgroundColor: '#F4F5F3',
              }}
            >
              {items.map((item, idx) => (
                <img
                  key={item.id}
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'opacity 0.5s ease-in-out',
                    opacity: idx === activeIndex ? 1 : 0,
                    pointerEvents: idx === activeIndex ? 'auto' : 'none',
                  }}
                />
              ))}

              {/* Floating Tag Chip */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-forest-ink, #0E2A12)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                }}
              >
                {activeItem.tag}
              </div>
            </div>
          </div>
        </BlurIn>
      </div>
    </section>
  );
};

export default FeaturesAccordion;
