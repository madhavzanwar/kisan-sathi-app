import React, { useState } from 'react';
import { Progress } from 'antd';
import { ShieldCheck, Activity, Sprout, BookOpen, Bot } from 'lucide-react';
import { SectionHeading } from '../design-system/components/SectionHeading.jsx';
import { BlurIn } from '../design-system/components/BlurIn.jsx';
import { useLang } from '../i18n/index.js';

const tabIcons = {
  heal: <Activity size={18} color="#2E6B34" />,
  fertilizer: <Sprout size={18} color="#2E6B34" />,
  guide: <BookOpen size={18} color="#2E6B34" />,
  assistant: <Bot size={18} color="#2E6B34" />,
};

const tabConfig = [
  { id: 'heal', image: '/images/features/heal-crop.jpg' },
  { id: 'fertilizer', image: '/images/features/fertilizer.jpg' },
  { id: 'guide', image: '/images/features/guides.jpg' },
  { id: 'assistant', image: '/images/features/yield-pest.jpg' },
];

/**
 * HowItWorks — 4-card interactive workflow panel with large visual canvas,
 * bottom-left location pill, and floating glass diagnosis & fertilizer cards.
 */
export const HowItWorks = () => {
  const { t } = useLang();
  const [activeTabId, setActiveTabId] = useState('heal');

  const tabs = tabConfig.map((item) => ({
    id: item.id,
    label: t(`landing:howItWorks.tabs.${item.id}.label`),
    subtitle: t(`landing:howItWorks.tabs.${item.id}.subtitle`),
    location: t(`landing:howItWorks.tabs.${item.id}.location`),
    image: item.image,
  }));

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

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
          <SectionHeading
            eyebrow={t('landing:howItWorks.eyebrow')}
            title={t('landing:howItWorks.headingTitle')}
            accent={t('landing:howItWorks.headingAccent')}
            description={t('landing:howItWorks.description')}
          />

          {/* 4 Tab Selector Cards in a Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  style={{
                    backgroundColor: isActive ? '#FFFFFF' : '#ECEEE9',
                    border: isActive ? '1.5px solid #2E6B34' : '1px solid transparent',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 8px 24px rgba(14, 42, 18, 0.08)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        backgroundColor: isActive ? 'rgba(46, 107, 52, 0.12)' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {tabIcons[tab.id]}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: isActive ? '#0E2A12' : '#5C6E5F',
                      }}
                    >
                      {tab.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12.5px',
                      color: '#5C6E5F',
                      paddingLeft: '38px',
                    }}
                  >
                    {tab.subtitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Large Visual Display Panel */}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              minHeight: 'clamp(460px, 50vw, 560px)',
              boxShadow: '0 20px 50px rgba(14, 42, 18, 0.12)',
              backgroundColor: '#0E2A12',
            }}
          >
            {/* Background Image Layer */}
            <img
              src={activeTab.image}
              alt={activeTab.label}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/features/heal-crop.jpg';
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.92)',
                transition: 'opacity 0.4s ease',
              }}
            />

            {/* Subtle Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(14, 42, 18, 0.75) 0%, transparent 60%)',
                pointerEvents: 'none',
              }}
            />

            {/* Bottom-Left: Glass Location Chip */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                background: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                borderRadius: '999px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0E2A12',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 10,
              }}
            >
              <span>{activeTab.location}</span>
            </div>

            {/* Bottom-Right: Floating Sample Glass Cards */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                right: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '380px',
                width: 'calc(100% - 48px)',
                zIndex: 10,
              }}
            >
              {/* Card 1: Sample Leaf Diagnosis Result */}
              <div
                className="glass-light"
                style={{
                  padding: '16px 20px',
                  borderRadius: '18px',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} color="#2E6B34" />
                    <div>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2E6B34', fontWeight: 700, display: 'block' }}>{t('landing:howItWorks.sampleOutput')}</span>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0E2A12' }}>
                        {t('landing:howItWorks.sampleDiagnosis.disease')}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      color: '#DC2626',
                      padding: '2px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    {t('landing:howItWorks.sampleDiagnosis.severity')}
                  </span>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#5C6E5F', marginBottom: '3px' }}>
                    <span>{t('landing:howItWorks.modelConfidence')}</span>
                    <span style={{ fontWeight: 600, color: '#0E2A12' }}>94%</span>
                  </div>
                  <Progress
                    percent={94}
                    showInfo={false}
                    strokeColor="#2E6B34"
                    size="small"
                  />
                </div>

                <p style={{ margin: 0, fontSize: '11.5px', color: '#5C6E5F', lineHeight: 1.4 }}>
                  <strong>{t('landing:howItWorks.recommendation')}</strong> {t('landing:howItWorks.sampleDiagnosis.treatment')}
                </p>
              </div>

              {/* Card 2: Sample Fertilizer Result */}
              <div
                className="glass-light"
                style={{
                  padding: '14px 20px',
                  borderRadius: '18px',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2E6B34', fontWeight: 700, display: 'block' }}>{t('landing:howItWorks.sampleOutput')}</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0E2A12' }}>
                      {t('landing:howItWorks.scientificBalance')}
                    </span>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#5C6E5F' }}>
                    {t('landing:howItWorks.sampleFertilizer.area')}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ background: '#FFFFFF', padding: '6px 4px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#2E6B34' }}>125 kg</div>
                    <div style={{ fontSize: '10px', color: '#5C6E5F' }}>{t('landing:howItWorks.ureaLabel')}</div>
                  </div>
                  <div style={{ background: '#FFFFFF', padding: '6px 4px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#2E6B34' }}>60 kg</div>
                    <div style={{ fontSize: '10px', color: '#5C6E5F' }}>{t('landing:howItWorks.dapLabel')}</div>
                  </div>
                  <div style={{ background: '#FFFFFF', padding: '6px 4px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#2E6B34' }}>35 kg</div>
                    <div style={{ fontSize: '10px', color: '#5C6E5F' }}>{t('landing:howItWorks.mopLabel')}</div>
                  </div>
                  <div style={{ background: '#FFFFFF', padding: '6px 4px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#2E6B34' }}>2.5 t</div>
                    <div style={{ fontSize: '10px', color: '#5C6E5F' }}>{t('landing:howItWorks.compostLabel')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BlurIn>
      </div>
    </section>
  );
};

export default HowItWorks;
