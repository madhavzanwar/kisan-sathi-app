const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.resolve(__dirname, '../frontend/src/i18n/locales');
const LANGUAGES = ['en', 'hi', 'mr'];
const NAMESPACES = ['common', 'landing', 'dashboard', 'heal', 'fertilizer', 'guides', 'chat', 'errors'];

// Allowed identical English words/acronyms across locales
const ALLOWED_IDENTICAL = new Set([
  'NPK', 'Urea', 'DAP', 'MOP', 'pH', 'kg', 'ha', 'acre', 'acres', 'tons',
  'PyTorch', 'ResNet18', 'FastAPI', 'Scikit-Learn', 'Copernicus', 'Sentinel-2',
  'Google Gemini', 'KisanSathi', 'AI', 'NDVI', 'GPS', 'LED', 'CSV', 'PDF',
  'WhatsApp', 'SMS', '100%', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '24°C', '68%', '20%', '12 km/h'
]);

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(getKeys(v, fullKey));
    } else {
      keys.push({ key: fullKey, value: v });
    }
  }
  return keys;
}

function extractPlaceholders(str) {
  if (typeof str !== 'string') return [];
  const matches = str.match(/\{\{([^}]+)\}\}/g) || [];
  return matches.sort();
}

function runCheck() {
  console.log('========================================================');
  console.log('       KISANSATHI i18n INTEGRITY & PARITY CHECK        ');
  console.log('========================================================\n');

  let totalErrors = 0;
  let totalWarnings = 0;
  let totalKeysChecked = 0;

  for (const ns of NAMESPACES) {
    const enFile = path.join(LOCALES_DIR, 'en', `${ns}.json`);
    const hiFile = path.join(LOCALES_DIR, 'hi', `${ns}.json`);
    const mrFile = path.join(LOCALES_DIR, 'mr', `${ns}.json`);

    if (!fs.existsSync(enFile)) {
      console.error(`❌ MISSING FILE: en/${ns}.json`);
      totalErrors++;
      continue;
    }

    const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
    const hiData = fs.existsSync(hiFile) ? JSON.parse(fs.readFileSync(hiFile, 'utf8')) : {};
    const mrData = fs.existsSync(mrFile) ? JSON.parse(fs.readFileSync(mrFile, 'utf8')) : {};

    const enEntries = getKeys(enData);
    const hiEntries = getKeys(hiData);
    const mrEntries = getKeys(mrData);

    const enKeyMap = new Map(enEntries.map(e => [e.key, e.value]));
    const hiKeyMap = new Map(hiEntries.map(e => [e.key, e.value]));
    const mrKeyMap = new Map(mrEntries.map(e => [e.key, e.value]));

    console.log(`▶ Namespace [${ns}]: ${enEntries.length} English keys`);

    // 1. Check for missing keys in hi & mr
    for (const [key, enVal] of enKeyMap.entries()) {
      totalKeysChecked++;

      // Check empty English value
      if (typeof enVal === 'string' && enVal.trim() === '') {
        console.error(`  ❌ [${ns}] en.${key} has an empty value!`);
        totalErrors++;
      }

      const enPlaceholders = extractPlaceholders(enVal);

      // Check Hindi
      if (!hiKeyMap.has(key)) {
        console.error(`  ❌ [${ns}] MISSING in Hindi (hi): ${key}`);
        totalErrors++;
      } else {
        const hiVal = hiKeyMap.get(key);
        if (typeof hiVal === 'string' && hiVal.trim() === '') {
          console.error(`  ❌ [${ns}] hi.${key} has an empty value!`);
          totalErrors++;
        }
        const hiPlaceholders = extractPlaceholders(hiVal);
        if (JSON.stringify(enPlaceholders) !== JSON.stringify(hiPlaceholders)) {
          console.error(`  ❌ [${ns}] Placeholder mismatch in hi.${key}: expected [${enPlaceholders}] but got [${hiPlaceholders}]`);
          totalErrors++;
        }

        // Check untouched English
        if (typeof hiVal === 'string' && typeof enVal === 'string' && hiVal === enVal && hiVal.length > 10 && !ALLOWED_IDENTICAL.has(hiVal.trim())) {
          console.warn(`  ⚠️ [${ns}] Untouched English warning in hi.${key}: "${hiVal.substring(0, 40)}..."`);
          totalWarnings++;
        }
      }

      // Check Marathi
      if (!mrKeyMap.has(key)) {
        console.error(`  ❌ [${ns}] MISSING in Marathi (mr): ${key}`);
        totalErrors++;
      } else {
        const mrVal = mrKeyMap.get(key);
        if (typeof mrVal === 'string' && mrVal.trim() === '') {
          console.error(`  ❌ [${ns}] mr.${key} has an empty value!`);
          totalErrors++;
        }
        const mrPlaceholders = extractPlaceholders(mrVal);
        if (JSON.stringify(enPlaceholders) !== JSON.stringify(mrPlaceholders)) {
          console.error(`  ❌ [${ns}] Placeholder mismatch in mr.${key}: expected [${enPlaceholders}] but got [${mrPlaceholders}]`);
          totalErrors++;
        }

        // Check untouched English
        if (typeof mrVal === 'string' && typeof enVal === 'string' && mrVal === enVal && mrVal.length > 10 && !ALLOWED_IDENTICAL.has(mrVal.trim())) {
          console.warn(`  ⚠️ [${ns}] Untouched English warning in mr.${key}: "${mrVal.substring(0, 40)}..."`);
          totalWarnings++;
        }
      }
    }

    // 2. Check for extra keys in hi & mr
    for (const key of hiKeyMap.keys()) {
      if (!enKeyMap.has(key)) {
        console.error(`  ❌ [${ns}] EXTRA KEY in Hindi (hi) not in en: ${key}`);
        totalErrors++;
      }
    }
    for (const key of mrKeyMap.keys()) {
      if (!enKeyMap.has(key)) {
        console.error(`  ❌ [${ns}] EXTRA KEY in Marathi (mr) not in en: ${key}`);
        totalErrors++;
      }
    }
  }

  console.log('\n--------------------------------------------------------');
  console.log(`Total Keys Verified: ${totalKeysChecked}`);
  console.log(`Parity Errors: ${totalErrors}`);
  console.log(`Untranslated Warnings: ${totalWarnings}`);
  console.log('--------------------------------------------------------\n');

  if (totalErrors > 0) {
    console.error(`FAILED: ${totalErrors} parity errors detected in i18n catalog.`);
    process.exit(1);
  } else {
    console.log('✅ ALL LOCALES VERIFIED WITH 100% KEY & PLACEHOLDER PARITY.');
    process.exit(0);
  }
}

runCheck();
