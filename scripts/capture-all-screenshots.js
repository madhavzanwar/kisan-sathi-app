const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve(__dirname, '../docs/bugs/screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '390', width: 390, height: 844 },
];

(async () => {
  console.log('[SCREENSHOTS] Launching headless Chrome...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  for (const vp of VIEWPORTS) {
    console.log(`\nCapturing screenshots at viewport width ${vp.name}...`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    // 1. Landing Page
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, `landing-${vp.name}.png`), fullPage: false });
    console.log(`Saved: landing-${vp.name}.png`);

    // 2. Dashboard - Heal Your Crop
    await page.goto('http://localhost:4173/dashboard?tab=heal', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, `dashboard-heal-${vp.name}.png`), fullPage: false });
    console.log(`Saved: dashboard-heal-${vp.name}.png`);

    // 3. Error state - Heal Your Crop (oversized file)
    const buffer16MB = Buffer.alloc(16 * 1024 * 1024);
    await page.setInputFiles('input[type="file"]', {
      name: 'large_crop_photo.jpg',
      mimeType: 'image/jpeg',
      buffer: buffer16MB,
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT_DIR, `error-heal-crop-oversized-${vp.name}.png`), fullPage: false });
    console.log(`Saved: error-heal-crop-oversized-${vp.name}.png`);

    // 4. Dashboard - Fertilizer Calculator
    await page.goto('http://localhost:4173/dashboard?tab=fertilizer', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, `dashboard-fertilizer-${vp.name}.png`), fullPage: false });
    console.log(`Saved: dashboard-fertilizer-${vp.name}.png`);

    // 5. Empty input state - Fertilizer Calculator
    const farmInput = page.locator('#farm-size-input');
    await farmInput.click();
    await farmInput.press('Control+a');
    await farmInput.press('Backspace');
    await farmInput.press('Tab');
    const calcBtn = page.locator('button:has-text("Calculate Fertilizer Dosage")');
    await calcBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT_DIR, `error-fertilizer-empty-${vp.name}.png`), fullPage: false });
    console.log(`Saved: error-fertilizer-empty-${vp.name}.png`);

    // 6. Dashboard - Cultivation Guides
    await page.goto('http://localhost:4173/dashboard?tab=guide', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, `dashboard-guide-${vp.name}.png`), fullPage: false });
    console.log(`Saved: dashboard-guide-${vp.name}.png`);

    // 7. Dashboard - Yield & Pest
    await page.goto('http://localhost:4173/dashboard?tab=yield-pest', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, `dashboard-yield-${vp.name}.png`), fullPage: false });
    console.log(`Saved: dashboard-yield-${vp.name}.png`);

    // 8. Dashboard - Weather & Irrigation
    await page.goto('http://localhost:4173/dashboard?tab=weather', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, `dashboard-weather-${vp.name}.png`), fullPage: false });
    console.log(`Saved: dashboard-weather-${vp.name}.png`);

    await page.close();
  }

  await browser.close();
  console.log('\n[SCREENSHOTS] All 16 screenshots successfully captured and saved in docs/bugs/screenshots/!');
  process.exit(0);
})();
