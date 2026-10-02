import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, setLanguage as coreSetLanguage } from './index.js';

let globalAnnouncementCallback = null;

/**
 * Register global screen-reader announcement callback.
 */
export const registerAnnouncementCallback = (cb) => {
  globalAnnouncementCallback = cb;
};

/**
 * Custom React hook for language state, switching, and accessibility.
 */
export const useLang = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const currentLang = i18n.language || 'en';

  const changeLang = useCallback(
    async (targetLang) => {
      if (targetLang === currentLang || loading) return;

      setLoading(true);
      try {
        const success = await coreSetLanguage(targetLang);

        if (success && globalAnnouncementCallback) {
          const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);
          const langName = langMeta ? langMeta.nativeName : targetLang;

          const announcements = {
            en: `Language changed to ${langName}`,
            hi: `भाषा बदलकर ${langName} कर दी गई`,
            mr: `भाषा बदलून ${langName} केली गेली`,
          };

          globalAnnouncementCallback(announcements[targetLang] || announcements.en);
        }
      } finally {
        setLoading(false);
      }
    },
    [currentLang, loading]
  );

  return {
    lang: currentLang,
    currentLang,
    setLang: changeLang,
    loading,
    isLoading: loading,
    isDevanagari: currentLang === 'hi' || currentLang === 'mr',
    isRTL: false,
    languages: SUPPORTED_LANGUAGES,
    t,
  };
};

export default useLang;
