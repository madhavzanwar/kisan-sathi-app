import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

/**
 * AiLoadingState — Friendly loading feedback for AI calls.
 * Displays a cold-start notice after 8 seconds to manage expectations
 * for Render's free tier spinning up.
 */
export const AiLoadingState = ({
  message = 'Processing AI analysis...',
  subtext = 'Connecting with agricultural intelligence models',
  coldStartThresholdMs = 8000,
  className = '',
  style = {},
}) => {
  const [showColdStartNotice, setShowColdStartNotice] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowColdStartNotice(true);
    }, coldStartThresholdMs);

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [coldStartThresholdMs]);

  return (
    <div
      className={`ai-loading-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 24px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1px solid rgba(14, 42, 18, 0.08)',
        boxShadow: '0 8px 30px rgba(14, 42, 18, 0.06)',
        maxWidth: '460px',
        margin: '0 auto',
        ...style,
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 36,
                color: '#2E6B34',
              }}
              spin
            />
          }
        />
      </div>

      <h4
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '17px',
          fontWeight: 600,
          color: 'var(--color-forest-ink)',
          margin: '0 0 6px 0',
        }}
      >
        {message}
      </h4>

      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          color: 'var(--color-text-muted)',
          margin: '0 0 16px 0',
        }}
      >
        {subtext} ({elapsedSeconds}s)
      </p>

      {/* Render cold start notice after 8 seconds */}
      {showColdStartNotice && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(213, 241, 69, 0.15)',
            border: '1px solid rgba(213, 241, 69, 0.4)',
            textAlign: 'left',
            animation: 'fadeIn 0.4s ease forwards',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>🌱</span>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#0E2A12',
                }}
              >
                Waking up the server, this can take up to a minute on first use.
              </p>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '11.5px',
                  color: '#5C6E5F',
                  lineHeight: 1.4,
                }}
              >
                The backend runs on Render's spin-down tier. Once active, all subsequent requests respond instantly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiLoadingState;
