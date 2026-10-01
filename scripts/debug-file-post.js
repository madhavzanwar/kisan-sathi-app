const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.addInitScript(() => {
    const origFetch = window.fetch;
    window.fetch = async function(...args) {
      const [resource, config] = args;
      if (typeof resource === 'string' && resource.includes('/api/predict/disease') && config && config.body instanceof FormData) {
        window.__capturedDiseaseFormData = {
          hasFile: config.body.has('file'),
          fileFieldType: config.body.get('file')?.constructor?.name,
          fileName: config.body.get('file')?.name,
          fileSize: config.body.get('file')?.size,
        };
      }
      return origFetch.apply(this, args);
    };
  });

  await page.goto('http://localhost:4173/dashboard?tab=heal');

  const fixture = path.resolve('scripts/fixtures/sample_leaf.jpg');
  await page.locator('input[type="file"]').first().setInputFiles(fixture);
  await page.waitForTimeout(2000);

  const captured = await page.evaluate(() => window.__capturedDiseaseFormData);
  console.log('Browser-intercepted FormData:', captured);
  await browser.close();
})();
