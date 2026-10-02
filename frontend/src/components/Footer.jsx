import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { LANDING_CONTENT } from '../content/landing.js';
import LanguageSwitcher from './LanguageSwitcher.jsx';

/**
 * Footer — Editorial dark green footer with frosted glass container
 * and real application route navigation.
 */
export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-forest-ink, #0E2A12)',
        color: '#FFFFFF',
        padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 48px) 36px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative subtle agricultural glow */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          right: '-100px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(213, 241, 69, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        {/* Frosted Glass Content Panel */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-card, 24px)',
            padding: 'clamp(28px, 4vw, 56px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Top Grid: Brand & Links */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '40px 48px',
              marginBottom: '40px',
            }}
          >
            {/* Brand Column */}
            <div style={{ maxWidth: '340px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-lime-accent, #D5F145)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Leaf size={16} color="#0E2A12" strokeWidth={2.5} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '20px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {LANDING_CONTENT.brand.name}
                </span>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-serif-accent)',
                  fontStyle: 'italic',
                  fontSize: '18px',
                  color: 'var(--color-lime-accent, #D5F145)',
                  margin: '0 0 10px 0',
                }}
              >
                {LANDING_CONTENT.brand.tagline}
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                }}
              >
                {LANDING_CONTENT.brand.subtagline}
              </p>
            </div>

            {/* Link Columns */}
            {LANDING_CONTENT.footer.columns.map((col) => (
              <div key={col.title}>
                <h4
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14.5px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                    margin: '0 0 16px 0',
                    textTransform: 'uppercase',
                    opacity: 0.9,
                  }}
                >
                  {col.title}
                </h4>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'rgba(255, 255, 255, 0.65)',
                            textDecoration: 'none',
                            fontSize: '13.5px',
                            fontFamily: 'var(--font-sans)',
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')
                          }
                        >
                          {link.label} ↗
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          style={{
                            color: 'rgba(255, 255, 255, 0.65)',
                            textDecoration: 'none',
                            fontSize: '13.5px',
                            fontFamily: 'var(--font-sans)',
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')
                          }
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Hairline & Legal Bar */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              fontSize: '12.5px',
              color: 'rgba(255, 255, 255, 0.55)',
            }}
          >
            <span>{LANDING_CONTENT.footer.copyright}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <LanguageSwitcher mode="footer" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                  }}
                />
                <span>FastAPI Backend • PyTorch ResNet18 Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
