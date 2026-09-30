import React from 'react';

/**
 * GlassCard — Polished frosted glass container.
 * Supports light and dark translucent glass variants with backdrop-blur.
 */
export const GlassCard = ({
  children,
  variant = 'light', // 'light' | 'dark' | 'subtle'
  padding = 'md',    // 'none' | 'sm' | 'md' | 'lg'
  hoverable = false,
  className = '',
  style = {},
  ...props
}) => {
  const paddingMap = {
    none: '0',
    sm: '16px',
    md: '24px',
    lg: '36px',
  };

  const resolvedPadding = paddingMap[padding] || (typeof padding === 'number' ? `${padding}px` : padding);
  const variantClass = variant === 'dark' ? 'glass' : variant === 'subtle' ? 'glass-subtle' : 'glass-light';

  return (
    <div
      className={`glass-card ${variantClass} ${hoverable ? 'glass-card-hoverable' : ''} ${className}`}
      style={{
        padding: resolvedPadding,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
