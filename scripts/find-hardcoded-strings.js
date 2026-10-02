const fs = require('fs');
const path = require('path');

/**
 * find-hardcoded-strings.js
 * Scans targeted React/JSX files to detect user-visible raw English string literals
 * that are not wrapped in t(...) or imported from content constants.
 */

const TARGET_DIRS = [
  path.resolve(__dirname, '../frontend/src/sections'),
  path.resolve(__dirname, '../frontend/src/components'),
  path.resolve(__dirname, '../frontend/src/pages'),
  path.resolve(__dirname, '../frontend/src/tabs'),
];

// Ignored files (non-JSX, tests, or styling)
const IGNORED_FILES = new Set([
  'SmoothScroll.jsx',
  'ErrorBoundary.jsx',
  'LanguageSwitcher.jsx',
  'AntdLocaleProvider.jsx',
]);

// Ignored strings (numbers, units, punctuation, CSS classes, URLs)
const IGNORED_PATTERNS = [
  /^[\d\s.,:;!?%°\/\\_#*+=\-–—()[\]{}'"`$]+$/,
  /^https?:\/\//,
  /^data:/,
  /^\/[a-zA-Z0-9_\-\/]+$/, // paths like /dashboard
  /^[A-Z0-9_-]+$/, // CONSTANT_CASE
  /^var\(--/,
];

function isIgnored(text) {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length <= 1) return true;
  return IGNORED_PATTERNS.some(p => p.test(trimmed));
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, idx) => {
    // Quick regex to match direct text between JSX tags >Some text<
    const matches = line.match(/>([^<>{}\n]+)</g);
    if (matches) {
      matches.forEach(m => {
        const raw = m.slice(1, -1).trim();
        if (!isIgnored(raw) && !raw.startsWith('//') && !raw.startsWith('/*')) {
          issues.push({ line: idx + 1, text: raw });
        }
      });
    }
  });

  return issues;
}

function runScanner() {
  console.log('========================================================');
  console.log('       SCANNING FOR UNTRANSLATED JSX STRING LITERALS    ');
  console.log('========================================================\n');

  let totalFindings = 0;

  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith('.jsx') || IGNORED_FILES.has(file)) continue;
      const fullPath = path.join(dir, file);
      const fileIssues = scanFile(fullPath);
      if (fileIssues.length > 0) {
        console.log(`\n📄 ${path.relative(process.cwd(), fullPath)}:`);
        fileIssues.forEach(issue => {
          console.log(`   Line ${issue.line}: "${issue.text}"`);
          totalFindings++;
        });
      }
    }
  }

  console.log('\n--------------------------------------------------------');
  console.log(`Total Suspicious Literals Found: ${totalFindings}`);
  console.log('--------------------------------------------------------\n');
}

runScanner();
