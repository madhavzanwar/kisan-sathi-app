const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

(async () => {
  console.log('Capturing Landing Page Screenshots across en, hi, mr, pseudo...');
  const outDir = path.resolve(__dirname, '../docs/screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const targets = [
    { lang: 'en', width: 1440, height: 900, filename: 'landing-en-1440.png' },
    { lang: 'hi', width: 1440, height: 900, filename: 'landing-hi-1440.png' },
    { lang: 'mr', width: 1440, height: 900, filename: 'landing-mr-1440.png' },
    { lang: 'pseudo', width: 1440, height: 900, filename: 'landing-pseudo-1440.png' },
    { lang: 'en', width: 390, height: 844, isMobile: true, filename: 'landing-en-390.png' },
    { lang: 'hi', width: 390, height: 844, isMobile: true, filename: 'landing-hi-390.png' },
    { lang: 'mr', width: 390, height: 844, isMobile: true, filename: 'landing-mr-390.png' },
  ];

  for (const t of targets) {
    const context = await browser.newContext({
      viewport: { width: t.width, height: t.height },
      deviceScaleFactor: 2,
      isMobile: t.isMobile || false,
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:4173/?lang=${t.lang}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const outPath = path.join(outDir, t.filename);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot: ${t.filename} (${t.width}px, ${t.lang})`);
    await context.close();
  }

  await browser.close();
  console.log('All landing screenshots captured successfully.');
})();
