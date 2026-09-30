import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Drawer, Button } from 'antd';
import { MenuOutlined, CloseOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Leaf } from 'lucide-react';
import { LANDING_CONTENT } from '../content/landing.js';

/**
 * Navbar — Floating translucent glass pill navigation.
 * Fixed over hero on desktop; collapses to responsive drawer on mobile.
 */
export const Navbar = ({ onOpenAuth }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
        {/* Left: Brand Logo & Wordmark */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          {/* Lime rounded-square leaf badge */}
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              backgroundColor: 'var(--color-lime-accent, #D5F145)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(213, 241, 69, 0.35)',
            }}
          >
            <Leaf size={18} color="#0E2A12" strokeWidth={2.5} />
          </div>

          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '19px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            {LANDING_CONTENT.brand.name}
          </span>
        </Link>

        {/* Center: Frosted Glass Pill Links (Desktop) */}
        <div
          className="desktop-nav-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '999px',
            padding: '4px 6px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.14)',
          }}
        >
          {LANDING_CONTENT.nav.map((item) => {
            const active = isLinkActive(item);
            return (
              <Link
                key={item.label}
                to={item.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: active ? '6px 16px' : '6px 14px',
                  borderRadius: '999px',
                  backgroundColor: active ? '#FFFFFF' : 'transparent',
                  color: active ? '#0E2A12' : 'rgba(255, 255, 255, 0.85)',
                  fontSize: '13.5px',
                  fontWeight: active ? 600 : 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: active ? '0 2px 8px rgba(0, 0, 0, 0.12)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  }
                }}
              >
                {active && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-cta-green, #2E6B34)',
                    }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Action CTA & Mobile Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
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
            Try the App
          </button>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open mobile menu"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'none', // Controlled via media queries below
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <MenuOutlined style={{ fontSize: '18px' }} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <Drawer
        placement="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        closeIcon={<CloseOutlined style={{ fontSize: '18px', color: '#0E2A12' }} />}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-lime-accent, #D5F145)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Leaf size={15} color="#0E2A12" />
            </div>
            <span style={{ fontWeight: 700, color: '#0E2A12' }}>{LANDING_CONTENT.brand.name}</span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px' }}>
          {LANDING_CONTENT.nav.map((item) => {
            const active = isLinkActive(item);
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  backgroundColor: active ? 'rgba(46, 107, 52, 0.1)' : '#F9FAF8',
                  color: active ? '#2E6B34' : '#0E2A12',
                  fontSize: '15px',
                  fontWeight: active ? 600 : 500,
                  textDecoration: 'none',
                }}
              >
                <span>{item.label}</span>
                <ArrowRightOutlined style={{ fontSize: '12px', opacity: 0.6 }} />
              </Link>
            );
          })}

          <div style={{ marginTop: '24px' }}>
            <Button
              type="primary"
              size="large"
              block
              onClick={() => {
                setMobileOpen(false);
                handleActionClick();
              }}
              style={{
                backgroundColor: 'var(--color-cta-green, #2E6B34)',
                borderRadius: '999px',
                height: '48px',
                fontWeight: 600,
              }}
            >
              Open Farmer Dashboard
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Media query styling for responsive toggling */}
      <style>{`
        @media (max-width: 960px) {
          .desktop-nav-pill {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
