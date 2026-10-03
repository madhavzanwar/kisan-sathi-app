import React, { useState, Suspense, lazy } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { LANDING_CONTENT } from '../content/landing.js';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useLang } from '../i18n/useLang.js';
import { getBrandName } from '../i18n/glossary.js';

const MobileNavDrawer = lazy(() => import('./MobileNavDrawer'));

/**
 * Navbar — Floating translucent glass pill navigation.
 * Fixed over hero on desktop; collapses to responsive drawer on mobile.
 */
export const Navbar = ({ onOpenAuth }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, currentLang } = useLang();

  const navItems = [
    { label: t('common:nav.home', 'Home'), path: '/', isHome: true },
    { label: t('common:nav.heal', 'Heal Your Crop'), path: '/dashboard?tab=heal' },
    { label: t('common:nav.fertilizer', 'Fertilizer Calc'), path: '/dashboard?tab=fertilizer' },
    { label: t('common:nav.guide', 'Cultivation Guides'), path: '/dashboard?tab=guide' },
    { label: t('common:nav.yieldPest', 'Yield & Pest'), path: '/dashboard?tab=yield-pest' },
    { label: t('common:nav.assistant', 'AI Assistant'), path: '/dashboard?tab=assistant' },
  ];

  const handleActionClick = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      navigate('/dashboard');
    }
  };

  const isLinkActive = (item) => {
    if (item.isHome) {
      return location.pathname === '/' && !location.search;
    }
    return location.pathname + location.search === item.path;
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: '20px',
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 20px',
        pointerEvents: 'none', // Allow clicks through empty margins
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'auto',
        }}
      >
        {/* Left: Brand Logo & Wordmark in High-Contrast Glass Pill */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(14, 42, 18, 0.12)',
            borderRadius: '999px',
            padding: '5px 16px 5px 6px',
            boxShadow: '0 8px 30px rgba(14, 42, 18, 0.14)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(14, 42, 18, 0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(14, 42, 18, 0.14)';
          }}
        >
          {/* Lime rounded-square leaf badge */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '999px',
              backgroundColor: 'var(--color-lime-accent, #D5F145)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(213, 241, 69, 0.4)',
              flexShrink: 0,
            }}
          >
            <Leaf size={16} color="#0E2A12" strokeWidth={2.5} />
          </div>

          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16.5px',
              fontWeight: 700,
              color: '#0E2A12',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {getBrandName(currentLang)}
          </span>
        </Link>

        {/* Center: High-Contrast Opaque Glass Pill Links (Desktop) */}
        <div
          className="desktop-nav-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(14, 42, 18, 0.12)',
            borderRadius: '999px',
            padding: '5px 7px',
            boxShadow: '0 8px 30px rgba(14, 42, 18, 0.14)',
          }}
        >
          {navItems.map((item) => {
            const active = isLinkActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: active ? '6px 16px' : '6px 14px',
                  borderRadius: '999px',
                  backgroundColor: active ? '#2E6B34' : 'transparent',
                  color: active ? '#FFFFFF' : '#0E2A12',
                  fontSize: '13.5px',
                  fontWeight: active ? 700 : 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: active ? '0 2px 8px rgba(46, 107, 52, 0.25)' : 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'rgba(46, 107, 52, 0.08)';
                    e.currentTarget.style.color = '#2E6B34';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#0E2A12';
                  }
                }}
              >
                {active && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#D5F145',
                    }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Action CTA, Language Switcher & Mobile Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LanguageSwitcher variant="onLight" />

          <button
            className="nav-cta-btn"
            onClick={handleActionClick}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0E2A12',
              fontFamily: 'var(--font-sans)',
              fontSize: '13.5px',
              fontWeight: 600,
              padding: '9px 22px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.18)';
            }}
          >
            {t('common:nav.tryApp', 'Try the App')}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileOpen(true)}
            aria-label={t('common:nav.openMenu', 'Open mobile menu')}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(14, 42, 18, 0.12)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'none', // Controlled via media queries below
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(14, 42, 18, 0.12)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0E2A12"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lazy Mobile Drawer Navigation (loads only when opened) */}
      {mobileOpen && (
        <Suspense fallback={null}>
          <MobileNavDrawer
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            isLinkActive={isLinkActive}
            onActionClick={handleActionClick}
          />
        </Suspense>
      )}

      {/* Media query styling for responsive toggling */}
      <style>{`
        @media (max-width: 1080px) {
          .desktop-nav-pill {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .nav-cta-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
