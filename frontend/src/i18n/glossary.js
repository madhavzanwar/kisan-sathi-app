/**
 * KisanSathi Agronomic Glossary & Brand Name Configuration.
 * 
 * Maps domain-specific agricultural terminology accurately across English, Hindi, and Marathi.
 * Allows toggling brand transliteration via a central configuration flag.
 */

export const GLOSSARY_CONFIG = {
  // Brand name policy: Keep brand name as "KisanSathi" in Latin characters by default.
  // Set to true to switch to Devanagari transliteration ("किसान साथी") in Hindi & Marathi.
  useDevanagariBrandTransliteration: false,

  // Digit formatting policy: Keep Western digits (0-9) by default across all locales.
  // Set to true to render Devanagari numerals (०-९) for Hindi and Marathi.
  useDevanagariNumerals: false,
};

/**
 * Returns the brand name according to the active language and glossary configuration.
 */
export const getBrandName = (lang = 'en') => {
  if (GLOSSARY_CONFIG.useDevanagariBrandTransliteration && (lang === 'hi' || lang === 'mr')) {
    return 'किसान साथी';
  }
  return 'KisanSathi';
};

/**
 * Standard agronomic terminology dictionary.
 */
export const AGRONOMIC_GLOSSARY = {
  npk: {
    en: 'Nitrogen, Phosphorus, Potassium (NPK)',
    hi: 'नाइट्रोजन, फास्फोरस, पोटाश (एनपीके)',
    mr: 'नत्र, स्फुरद, पालाश (एन.पी.के.)',
  },
  urea: {
    en: 'Urea (46-0-0)',
    hi: 'यूरिया (46-0-0)',
    mr: 'युरिया (46-0-0)',
  },
  dap: {
    en: 'DAP (18-46-0)',
    hi: 'डीएपी (18-46-0)',
    mr: 'डीएपी (18-46-0)',
  },
  mop: {
    en: 'MOP / Potash (0-0-60)',
    hi: 'एमओपी / पोटाश (0-0-60)',
    mr: 'एमओपी / पोटॅश (0-0-60)',
  },
  fym: {
    en: 'Farmyard Manure (FYM)',
    hi: 'गोबर की खाद (एफवायएम)',
    mr: 'शेणखत / कंपोस्ट खत',
  },
  earlyBlight: {
    en: 'Tomato Early Blight',
    hi: 'टमाटर का अगेती झुलसा रोग',
    mr: 'टोमॅटोवरील लवकर येणारा करपा रोग',
  },
  rust: {
    en: 'Wheat Rust',
    hi: 'गेहूं का रतुआ रोग',
    mr: 'गव्हावरील तांबेरा रोग',
  },
  aphids: {
    en: 'Cotton Aphids',
    hi: 'कपास का माहू/चेपा',
    mr: 'कापसावरील मावा कीड',
  },
  blackSoil: {
    en: 'Black Soil (Regur)',
    hi: 'काली मिट्टी (रेगुर)',
    mr: 'काळी कसदार माती (रेगूर)',
  },
  loamySoil: {
    en: 'Loamy Soil',
    hi: 'दोमट मिट्टी',
    mr: 'पोयटा / गाळाची माती',
  },
  dripIrrigation: {
    en: 'Drip Irrigation',
    hi: 'टपक सिंचाई',
    mr: 'ठिबक सिंचन',
  },
};

export default AGRONOMIC_GLOSSARY;
