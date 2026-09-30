import React from 'react';

/**
 * SectionHeading — Editorial agricultural section header.
 * - Eyebrow pill tag with dark green dot
 * - Sans-serif bold primary title with an italic serif accent phrase
 * - Right-aligned description column on desktop (or centered variant for FAQ/CTA)
 */
export const SectionHeading = ({
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  className = '',
  style = {},
  titleAs: TitleTag = 'h2',
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`section-heading-container ${className}`}
      style={{
        width: '100%',
        marginBottom: 'clamp(32px, 5vw, 56px)',
        ...style,
      }}
    >
      {isCenter ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          {eyebrow && <div className="eyebrow-tag" style={{ marginBottom: '16px' }}>{eyebrow}</div>}
          <TitleTag
            className="heading-editorial"
            style={{
              fontSize: 'clamp(30px, 4.5vw, 48px)',
              margin: '0 0 16px 0',
              color: 'var(--color-forest-ink)',
            }}
          >
            {title}
            {accent && <span className="heading-accent"> {accent}</span>}
          </TitleTag>
          {description && (
            <p
              style={{
                fontSize: 'clamp(15px, 1.2vw, 17px)',
                lineHeight: 1.6,
                color: 'var(--color-text-muted)',
                margin: 0,
              }}
            >
              {description}
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            alignItems: 'flex-end',
            gap: '24px 48px',
          }}
        >
          <div style={{ maxWidth: '620px' }}>
            {eyebrow && (
              <div className="eyebrow-tag" style={{ marginBottom: '16px' }}>
                {eyebrow}
              </div>
            )}
            <TitleTag
              className="heading-editorial"
              style={{
                fontSize: 'clamp(32px, 4.2vw, 50px)',
                margin: 0,
                color: 'var(--color-forest-ink)',
              }}
            >
              {title}
              {accent && (
                <>
                  <br />
                  <span className="heading-accent">{accent}</span>
                </>
              )}
            </TitleTag>
          </div>

          {description && (
            <div style={{ maxWidth: '440px', justifySelf: 'end' }}>
              <p
                style={{
                  fontSize: 'clamp(14px, 1.1vw, 16px)',
                  lineHeight: 1.6,
                  color: 'var(--color-text-muted)',
                  margin: 0,
                }}
              >
                {description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionHeading;
