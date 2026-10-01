const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const axeSourcePath = path.resolve(__dirname, '../frontend/node_modules/axe-core/axe.min.js');
const axeSource = fs.readFileSync(axeSourcePath, 'utf8');

const PAGES = [
  { name: 'Landing Page', url: 'http://localhost:4173/' },
  { name: 'Dashboard — Heal Your Crop', url: 'http://localhost:4173/dashboard?tab=heal' },
  { name: 'Dashboard — Fertilizer Calculator', url: 'http://localhost:4173/dashboard?tab=fertilizer' },
  { name: 'Dashboard — Cultivation Guides', url: 'http://localhost:4173/dashboard?tab=guide' },
  { name: 'Dashboard — Weather & Irrigation', url: 'http://localhost:4173/dashboard?tab=weather' },
  { name: 'Dashboard — Yield & Pest Forecaster', url: 'http://localhost:4173/dashboard?tab=yield-pest' }
];

async function runA11yAudit() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('======================================================');
  console.log('🔍 ACCESSIBILITY AUDIT (axe-core) Across All Routes');
  console.log('======================================================\n');

  const allResults = [];

  for (const item of PAGES) {
    console.log(`Auditing: ${item.name} (${item.url})`);
    await page.goto(item.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Inject axe-core
    await page.evaluate(axeSource);

    // Run axe
    const results = await page.evaluate(async () => {
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
        }
      });
    });

    console.log(` - Violations: ${results.violations.length}`);
    for (const v of results.violations) {
      console.log(`   ❌ [${v.impact ? v.impact.toUpperCase() : 'UNKNOWN'}] ${v.id}: ${v.help}`);
      for (const node of v.nodes.slice(0, 3)) {
        console.log(`      Target: ${node.target.join(' ')}`);
        console.log(`      Failure summary: ${node.failureSummary}`);
      }
    }
    console.log('');

    allResults.push({
      page: item.name,
      url: item.url,
      passes: results.passes.length,
      violationsCount: results.violations.length,
      violations: results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        nodeCount: v.nodes.length,
        targets: v.nodes.map(n => n.target.join(' '))
      }))
    });
  }

  await browser.close();

  fs.writeFileSync('docs/a11y-audit-report.json', JSON.stringify(allResults, null, 2));
  console.log('Audit complete. Saved to docs/a11y-audit-report.json');
}

runA11yAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
