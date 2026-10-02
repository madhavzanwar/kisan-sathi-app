import { GLOSSARY_CONFIG } from './glossary.js';

const LOCALE_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

/**
 * Format a number using Intl.NumberFormat according to the target locale and Indian numbering system.
 * By default, uses Western digits (0-9) via -u-nu-latn unless GLOSSARY_CONFIG.useDevanagariNumerals is set to true.
 *
 * @param {number|string} value - Number to format
 * @param {string} [lang='en'] - 'en', 'hi', or 'mr'
 * @param {Intl.NumberFormatOptions} [options={}] - Standard Intl formatting options
 * @returns {string} Formatted number
 */
export const formatNumber = (value, lang = 'en', options = {}) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '';
  }

  const baseLocale = LOCALE_MAP[lang] || 'en-IN';
  const numberingSystem =
    GLOSSARY_CONFIG.useDevanagariNumerals && (lang === 'hi' || lang === 'mr')
      ? '-u-nu-deva'
      : '-u-nu-latn';

  const fullLocale = `${baseLocale}${numberingSystem}`;

  try {
    return new Intl.NumberFormat(fullLocale, options).format(Number(value));
  } catch (err) {
    console.warn('formatNumber error:', err);
    return Number(value).toLocaleString();
  }
};

export default formatNumber;
