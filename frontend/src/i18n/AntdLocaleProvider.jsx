import React, { useState, useEffect } from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import { kisanSathiTheme } from '../design-system/theme.js';
import enUS from 'antd/locale/en_US';
import { useLang, registerAnnouncementCallback } from './useLang.js';

// Cached map of loaded Ant Design locales
const antdLocaleMap = {
  en: enUS,
};

/**
 * AntdLocaleProvider — Wraps children with dynamic Ant Design ConfigProvider
 * matching the active language ('en', 'hi', 'mr'), with fallback to en_US.
 * Includes an accessible aria-live polite region for screen-reader announcements.
 */
export const AntdLocaleProvider = ({ children }) => {
  const { currentLang } = useLang();
  const [activeLocale, setActiveLocale] = useState(enUS);
  const [announcement, setAnnouncement] = useState('');

  // Register screen-reader announcement listener
  useEffect(() => {
    registerAnnouncementCallback((msg) => {
      setAnnouncement(msg);
    });
  }, []);

  // Dynamically load the matching Ant Design locale chunk on language change
  useEffect(() => {
    let isCancelled = false;

    const loadAntdLocale = async () => {
      if (currentLang === 'en') {
        setActiveLocale(enUS);
        return;
      }

      if (antdLocaleMap[currentLang]) {
        setActiveLocale(antdLocaleMap[currentLang]);
        return;
      }

      try {
        if (currentLang === 'hi') {
          const mod = await import('antd/locale/hi_IN');
          antdLocaleMap.hi = mod.default || mod;
          if (!isCancelled) setActiveLocale(antdLocaleMap.hi);
        } else if (currentLang === 'mr') {
          const mod = await import('antd/locale/mr_IN');
          antdLocaleMap.mr = mod.default || mod;
          if (!isCancelled) setActiveLocale(antdLocaleMap.mr);
        }
      } catch (err) {
        console.warn(`Ant Design locale for "${currentLang}" failed to load, falling back to en_US:`, err);
        if (!isCancelled) setActiveLocale(enUS);
      }
    };

    loadAntdLocale();

    return () => {
      isCancelled = true;
    };
  }, [currentLang]);

  return (
    <ConfigProvider theme={kisanSathiTheme} locale={activeLocale}>
      <AntdApp className="ant-app">
        {children}
        {/* Invisible live region for screen-reader language change announcements */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {announcement}
        </div>
      </AntdApp>
    </ConfigProvider>
  );
};

export default AntdLocaleProvider;
