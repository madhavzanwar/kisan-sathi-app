import fs from 'node:fs';

const json = JSON.parse(fs.readFileSync('docs/lighthouse-results/landing-mobile-current.json', 'utf8'));

console.log('=== OVERALL SCORES ===');
console.log('Score:', json.categories?.performance?.score * 100);
console.log('LCP:', json.audits['largest-contentful-paint']?.displayValue, json.audits['largest-contentful-paint']?.numericValue);
console.log('FCP:', json.audits['first-contentful-paint']?.displayValue, json.audits['first-contentful-paint']?.numericValue);
console.log('TBT:', json.audits['total-blocking-time']?.displayValue, json.audits['total-blocking-time']?.numericValue);
console.log('CLS:', json.audits['cumulative-layout-shift']?.displayValue, json.audits['cumulative-layout-shift']?.numericValue);

console.log('\n=== THROTTLING SETTINGS ===');
console.log('Throttling:', JSON.stringify(json.configSettings?.throttling, null, 2));
console.log('Throttling Method:', json.configSettings?.throttlingMethod);
console.log('Form Factor:', json.configSettings?.formFactor);
console.log('Screen Emulation:', JSON.configSettings?.screenEmulation);

console.log('\n=== LCP ELEMENT & DETAILS ===');
const lcpElemAudit = json.audits['largest-contentful-paint-element'];
console.log('LCP Element items:', JSON.stringify(lcpElemAudit?.details?.items, null, 2));

console.log('\n=== LCP AUDITS & INSIGHTS ===');
for (const [key, value] of Object.entries(json.audits)) {
  if (key.includes('lcp')) {
    console.log(`Audit [${key}]: ${value.title} | ${value.displayValue || ''}`);
    if (value.details) {
      console.log('  Details:', JSON.stringify(value.details, null, 2));
    }
  }
}

console.log('\n=== TOP OPPORTUNITIES & DIAGNOSTICS ===');
for (const [key, value] of Object.entries(json.audits)) {
  if (value.details && (value.details.type === 'opportunity' || (value.details.overallSavingsMs > 0) || (value.score !== null && value.score < 0.9))) {
    console.log(`\nAudit [${key}]: Score: ${value.score}, Display: ${value.displayValue || ''}, SavingsMs: ${value.details?.overallSavingsMs || ''}`);
    console.log('  Title:', value.title);
    if (value.details?.items?.length) {
      console.log('  Items count:', value.details.items.length);
      console.log('  First item:', JSON.stringify(value.details.items[0], null, 2));
    }
  }
}
