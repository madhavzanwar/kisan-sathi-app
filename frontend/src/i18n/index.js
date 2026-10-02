import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Statically import English as the default source of truth
import enCommon from './locales/en/common.json';
import enLanding from './locales/en/landing.json';
import enDashboard from './locales/en/dashboard.json';
import enHeal from './locales/en/heal.json';
import enFertilizer from './locales/en/fertilizer.json';
import enGuides from './locales/en/guides.json';
import enChat from './locales/en/chat.json';
import enErrors from './locales/en/errors.json';
import { transformObjectToPseudo } from './pseudo.js';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', nativeName: 'English', englishName: 'English', shortLabel: 'EN' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', shortLabel: 'हिं' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', shortLabel: 'मरा' },
];

export const STORAGE_KEY = 'kisansathi_lang';

/**
 * Determine initial language following the strict precedence:
 * 1. ?lang= URL search parameter
 * 2. localStorage key "kisansathi_lang"
 * 3. Browser navigator language (mr -> mr, hi -> hi)
 * 4. Fallback: 'en'
 */
export const detectInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';

  // 1. ?lang= URL param (supports ?lang=pseudo in dev/testing)
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang) {
      const normalized = urlLang.toLowerCase().trim();
      if (['en', 'hi', 'mr', 'pseudo', 'en-xa'].includes(normalized)) {
        return normalized === 'en-xa' ? 'pseudo' : normalized;
      }
    }
  } catch (e) {
    // Ignore URL parsing errors
  }

  // 2. localStorage key "kisansathi_lang"
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ['en', 'hi', 'mr'].includes(saved)) {
      return saved;
    }
  } catch (e) {
    // Ignore storage errors
  }

  // 3. Browser language
  try {
    const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (navLang.startsWith('mr')) return 'mr';
    if (navLang.startsWith('hi')) return 'hi';
  } catch (e) {
    // Ignore navigator errors
  }

  // 4. Default fallback
  return 'en';
};

const initialLang = detectInitialLanguage();

// Initialize i18next with English resources bundled
i18n.use(initReactI18next).init({
  lng: 'en', // Always start with English loaded synchronously for zero render delay
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'landing', 'dashboard', 'heal', 'fertilizer', 'guides', 'chat', 'errors'],
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  resources: {
    en: {
      common: enCommon,
      landing: enLanding,
      dashboard: enDashboard,
      heal: enHeal,
      fertilizer: enFertilizer,
      guides: enGuides,
      chat: enChat,
      errors: enErrors,
    },
  },
  react: {
    useSuspense: false, // Avoid suspense flickers during language switches
  },
});

const loadedBundles = new Set(['en']);

/**
 * Lazy-load language resource bundles (hi, mr) dynamically on-demand.
 * Vite automatically code-splits these into separate async chunks.
 */
export const loadLanguageResources = async (lang) => {
  if (!['en', 'hi', 'mr', 'pseudo'].includes(lang)) return;
  if (loadedBundles.has(lang)) return;

  try {
    if (lang === 'pseudo') {
      i18n.addResourceBundle('pseudo', 'common', transformObjectToPseudo(enCommon), true, true);
      i18n.addResourceBundle('pseudo', 'landing', transformObjectToPseudo(enLanding), true, true);
      i18n.addResourceBundle('pseudo', 'dashboard', transformObjectToPseudo(enDashboard), true, true);
      i18n.addResourceBundle('pseudo', 'heal', transformObjectToPseudo(enHeal), true, true);
      i18n.addResourceBundle('pseudo', 'fertilizer', transformObjectToPseudo(enFertilizer), true, true);
      i18n.addResourceBundle('pseudo', 'guides', transformObjectToPseudo(enGuides), true, true);
      i18n.addResourceBundle('pseudo', 'chat', transformObjectToPseudo(enChat), true, true);
      i18n.addResourceBundle('pseudo', 'errors', transformObjectToPseudo(enErrors), true, true);
      loadedBundles.add('pseudo');
      return;
    }

    if (lang === 'hi') {
      const [common, landing, dashboard, heal, fertilizer, guides, chat, errors] =
        await Promise.all([
          import('./locales/hi/common.json'),
          import('./locales/hi/landing.json'),
          import('./locales/hi/dashboard.json'),
          import('./locales/hi/heal.json'),
          import('./locales/hi/fertilizer.json'),
          import('./locales/hi/guides.json'),
          import('./locales/hi/chat.json'),
          import('./locales/hi/errors.json'),
        ]);

      i18n.addResourceBundle('hi', 'common', common.default, true, true);
      i18n.addResourceBundle('hi', 'landing', landing.default, true, true);
      i18n.addResourceBundle('hi', 'dashboard', dashboard.default, true, true);
      i18n.addResourceBundle('hi', 'heal', heal.default, true, true);
      i18n.addResourceBundle('hi', 'fertilizer', fertilizer.default, true, true);
      i18n.addResourceBundle('hi', 'guides', guides.default, true, true);
      i18n.addResourceBundle('hi', 'chat', chat.default, true, true);
      i18n.addResourceBundle('hi', 'errors', errors.default, true, true);
      loadedBundles.add('hi');
    } else if (lang === 'mr') {
      const [common, landing, dashboard, heal, fertilizer, guides, chat, errors] =
        await Promise.all([
          import('./locales/mr/common.json'),
          import('./locales/mr/landing.json'),
          import('./locales/mr/dashboard.json'),
          import('./locales/mr/heal.json'),
          import('./locales/mr/fertilizer.json'),
          import('./locales/mr/guides.json'),
          import('./locales/mr/chat.json'),
          import('./locales/mr/errors.json'),
        ]);

      i18n.addResourceBundle('mr', 'common', common.default, true, true);
      i18n.addResourceBundle('mr', 'landing', landing.default, true, true);
      i18n.addResourceBundle('mr', 'dashboard', dashboard.default, true, true);
      i18n.addResourceBundle('mr', 'heal', heal.default, true, true);
      i18n.addResourceBundle('mr', 'fertilizer', fertilizer.default, true, true);
      i18n.addResourceBundle('mr', 'guides', guides.default, true, true);
      i18n.addResourceBundle('mr', 'chat', chat.default, true, true);
      i18n.addResourceBundle('mr', 'errors', errors.default, true, true);
      loadedBundles.add('mr');
    }
  } catch (err) {
    console.error(`Failed to load language resources for "${lang}":`, err);
    throw err;
  }
};

/**
 * Synchronize document DOM attributes (lang, title, meta description, dir).
 */
export const updateDocumentMetadata = (lang) => {
  if (typeof document === 'undefined') return;

  // 1. Set <html lang="..."> and keep dir="ltr"
  document.documentElement.lang = lang === 'pseudo' ? 'en-XA' : lang;
  document.documentElement.dir = 'ltr';

  // 2. Set document.title & meta description per language
  const titles = {
    en: 'KisanSathi — Har kisan ka saccha sathi | AI Smart Farming',
    hi: 'किसान साथी — हर किसान का सच्चा साथी | एआई स्मार्ट फार्मिंग',
    mr: 'किसान साथी — हर किसान का सच्चा साथी | एआय स्मार्ट फार्मिंग',
    pseudo: '[!! ЌíííšááñŚááŧĥíí — Ĥáář ќíííšááñ ќáá šááččĥáá šááŧĥíí !!]',
  };

  const descriptions = {
    en: 'KisanSathi — AI-powered precision agritech platform for instant crop diagnosis, scientific fertilizer balancing, and agronomic guidance.',
    hi: 'किसान साथी — तत्काल फसल रोग निदान, सटीक उर्वरक संतुलन और कृषि मार्गदर्शन के लिए एआई-संचालित कृषि तकनीकी मंच।',
    mr: 'किसान साथी — त्वरित पीक रोग निदान, अचूक खत प्रमाण संतुलन आणि शेती मार्गदर्शनासाठी एआय-सक्षम कृषी तंत्रज्ञान मंच.',
    pseudo: '[!! ЌíííšááñŚááŧĥíí — ÁÁÍ-þóówééřééđ þřééčííšííóóñ áágřííŧééčĥ þłááŧƒóóřɱ ƒóóř ííñšŧááñŧ čřóóþ đííáágñóóšííš !!]',
  };

  // Only update landing title if on landing page or default title
  if (!document.title.includes('Dashboard') && !document.title.includes('Agronomy Suite')) {
    document.title = titles[lang] || titles.en;
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', descriptions[lang] || descriptions.en);
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute('content', descriptions[lang] || descriptions.en);
  }
};

/**
 * Switch language cleanly without page reload or component remount.
 */
export const setLanguage = async (newLang) => {
  if (!['en', 'hi', 'mr', 'pseudo'].includes(newLang)) return;

  try {
    // 1. Ensure resources for target language are loaded
    await loadLanguageResources(newLang);

    // 2. Switch i18next language
    await i18n.changeLanguage(newLang);

    // 3. Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {
      // Ignore storage errors
    }

    // 4. Update document metadata
    updateDocumentMetadata(newLang);

    return true;
  } catch (err) {
    console.error(`Error switching to language "${newLang}", falling back to English:`, err);
    await i18n.changeLanguage('en');
    updateDocumentMetadata('en');
    return false;
  }
};

// If initial detected language is not 'en', load and activate it asynchronously
if (initialLang !== 'en') {
  setLanguage(initialLang).catch((e) => {
    console.warn('Initial language load failed, remaining in English:', e);
  });
} else {
  updateDocumentMetadata('en');
}

export { useLang } from './useLang.js';
export default i18n;
