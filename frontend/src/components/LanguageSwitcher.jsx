import React, { useState, useRef } from 'react';
import { Dropdown, Segmented } from 'antd';
import { GlobalOutlined, LoadingOutlined, CheckOutlined } from '@ant-design/icons';
import { useLang } from '../i18n/useLang.js';

/**
 * LanguageSwitcher Component
 * 
 * Supports variants:
 * - variant="onVideo" (Glass translucent over hero video, AA contrast)
 * - variant="onLight" (Clean white/gray pill with dark text on light backgrounds)
 * 
 * Supports modes:
 * - mode="dropdown" (Default pill with Ant Design Dropdown)
 * - mode="segmented" (Full-width 3-way Segmented control for drawers)
 * - mode="footer" (Compact inline text row for footer)
 */
export const LanguageSwitcher = ({
  variant = 'onLight',
  mode = 'dropdown',
  className = '',
  style = {},
}) => {
  const { currentLang, setLang, isLoading, languages, t } = useLang();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const triggerRef = useRef(null);

  const currentMeta = languages.find((l) => l.code === currentLang) || languages[0];

  // 1. Drawer Mode: Segmented 3-button control
  if (mode === 'segmented') {
    return (
      <div style={{ width: '100%', marginBottom: '16px', ...style }} className={className}>
        <Segmented
          block
          size="large"
          value={currentLang}
          onChange={(val) => setLang(val)}
          options={languages.map((l) => ({
            value: l.code,
            label: (
              <span
                lang={l.code}
                style={{
                  fontWeight: currentLang === l.code ? 700 : 500,
                  fontSize: '13.5px',
                  fontFamily: l.code === 'en' ? 'var(--font-sans)' : "'Noto Sans Devanagari', sans-serif",
                }}
              >
                {l.nativeName}
              </span>
            ),
          }))}
          style={{
            backgroundColor: '#ECEEE9',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid rgba(14, 42, 18, 0.08)',
          }}
        />
      </div>
    );
  }

  // 2. Footer Mode: Compact text row
  if (mode === 'footer') {
    return (
      <div
        className={`language-switcher-footer ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          ...style,
        }}
      >
        <span style={{ color: 'rgba(255, 255, 255, 0.65)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <GlobalOutlined />
          <span>Language:</span>
        </span>
        {languages.map((l, index) => (
          <React.Fragment key={l.code}>
            <button
              type="button"
              onClick={() => setLang(l.code)}
              lang={l.code}
              aria-current={currentLang === l.code ? 'true' : undefined}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: currentLang === l.code ? 700 : 500,
                color: currentLang === l.code ? 'var(--color-lime-accent, #D5F145)' : 'rgba(255, 255, 255, 0.75)',
                textDecoration: currentLang === l.code ? 'underline' : 'none',
                fontFamily: l.code === 'en' ? 'var(--font-sans)' : "'Noto Sans Devanagari', sans-serif",
                fontSize: '13px',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (currentLang !== l.code) e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                if (currentLang !== l.code) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
              }}
            >
              {l.nativeName}
            </button>
            {index < languages.length - 1 && (
              <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // 3. Dropdown Menu Items
  const menuItems = languages.map((lang) => {
    const isSelected = lang.code === currentLang;
    return {
      key: lang.code,
      label: (
        <div
          lang={lang.code}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px',
            padding: '6px 4px',
            minWidth: '160px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                fontWeight: isSelected ? 700 : 600,
                fontSize: '14.5px',
                color: '#0E2A12',
                fontFamily:
                  lang.code === 'en' ? 'var(--font-sans)' : "'Noto Sans Devanagari', sans-serif",
              }}
            >
              {lang.nativeName}
            </span>
            <span
              style={{
                fontSize: '12px',
                color: '#5C6E5F',
              }}
            >
              ({lang.englishName})
            </span>
          </div>
          {isSelected && (
            <CheckOutlined style={{ color: '#2E6B34', fontSize: '13px', fontWeight: 700 }} />
          )}
        </div>
      ),
    };
  });

  const handleMenuClick = ({ key }) => {
    setLang(key);
    setDropdownOpen(false);
    triggerRef.current?.focus();
  };

  const isOnVideo = variant === 'onVideo';

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: handleMenuClick,
        selectable: true,
        selectedKeys: [currentLang],
      }}
      trigger={['click']}
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      placement="bottomRight"
    >
      <button
        ref={triggerRef}
        type="button"
        className={`language-switcher-pill ${className}`}
        aria-haspopup="menu"
        aria-expanded={dropdownOpen}
        aria-label={t('common:switcher.label', 'Change language')}
        style={{
          minHeight: '44px',
          height: '44px',
          minWidth: '84px', // Reserve width to eliminate layout shift across EN/हिं/मरा
          padding: '0 14px',
          borderRadius: '999px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontFamily: 'var(--font-sans)',
          fontSize: '13.5px',
          fontWeight: 600,
          transition: 'all 0.15s ease',
          backgroundColor: isOnVideo
            ? 'rgba(255, 255, 255, 0.16)'
            : '#FFFFFF',
          backdropFilter: isOnVideo ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isOnVideo ? 'blur(16px)' : 'none',
          border: isOnVideo
            ? '1px solid rgba(255, 255, 255, 0.35)'
            : '1px solid rgba(14, 42, 18, 0.12)',
          color: isOnVideo ? '#FFFFFF' : '#0E2A12',
          boxShadow: isOnVideo
            ? '0 4px 14px rgba(0, 0, 0, 0.2)'
            : '0 2px 8px rgba(14, 42, 18, 0.06)',
          ...style,
        }}
        onMouseEnter={(e) => {
          if (isOnVideo) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.28)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.55)';
          } else {
            e.currentTarget.style.backgroundColor = '#F4F5F3';
            e.currentTarget.style.borderColor = 'rgba(14, 42, 18, 0.22)';
          }
        }}
        onMouseLeave={(e) => {
          if (isOnVideo) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
          } else {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = 'rgba(14, 42, 18, 0.12)';
          }
        }}
      >
        {isLoading ? (
          <LoadingOutlined
            spin
            style={{ fontSize: '15px', color: isOnVideo ? '#FFFFFF' : '#2E6B34' }}
          />
        ) : (
          <GlobalOutlined
            style={{ fontSize: '15px', color: isOnVideo ? '#FFFFFF' : '#2E6B34' }}
          />
        )}
        <span
          style={{
            fontFamily:
              currentMeta.code === 'en'
                ? 'var(--font-sans)'
                : "'Noto Sans Devanagari', sans-serif",
            letterSpacing: '-0.01em',
            display: 'inline-block',
            width: '26px',
            textAlign: 'center',
          }}
        >
          {currentMeta.shortLabel}
        </span>
      </button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
