const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve(__dirname, '../docs/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verifyVisuals() {
  console.log('[VISUAL QA] Starting visual verification on http://localhost:4173 ...');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  // Track any failed image network requests
  const failedImages = [];
  page.on('response', (response) => {
    const url = response.url();
    if (/\.(png|jpg|jpeg|webp|svg)/i.test(url) && response.status() >= 400) {
      failedImages.push({ url, status: response.status() });
    }
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Screenshot Desktop Hero with Navbar
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_hero_navbar.png') });
  console.log('✓ Captured 01_desktop_hero_navbar.png');

  // 2. Scroll to Statement & Accordion section (where user experienced white-on-white and broken images)
  const featuresEl = await page.$('#features');
  if (featuresEl) {
    await featuresEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  } else {
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(800);
  }

  // Capture Accordion with Item 0 (Heal Your Crop)
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_desktop_accordion_heal.png') });
  console.log('✓ Captured 02_desktop_accordion_heal.png');

  // Click row 2 (Smart Fertilizer Calculator)
  const fertilizerRow = page.locator('text=Smart Fertilizer Calculator').first();
  if (await fertilizerRow.isVisible()) {
    await fertilizerRow.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_desktop_accordion_fertilizer.png') });
    console.log('✓ Captured 03_desktop_accordion_fertilizer.png');
  }

  // Scroll to How It Works
  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_desktop_how_it_works.png') });
  console.log('✓ Captured 04_desktop_how_it_works.png');

  // Scroll to Solutions Carousel
  await page.evaluate(() => window.scrollTo(0, 3400));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_desktop_solutions_carousel.png') });
  console.log('✓ Captured 05_desktop_solutions_carousel.png');

  // Check all images in DOM
  const imageAudit = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map((img) => ({
      src: img.src,
      alt: img.alt,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      isBroken: img.complete && img.naturalWidth === 0,
    }));
  });

  console.log('\n--- DOM Image Audit ---');
  let brokenCount = 0;
  for (const img of imageAudit) {
    if (img.isBroken) {
      console.log(`❌ BROKEN IMAGE: ${img.src} (alt: "${img.alt}")`);
      brokenCount++;
    } else {
      console.log(`✅ Loaded: ${img.src.substring(0, 60)} (${img.naturalWidth}x${img.naturalHeight})`);
    }
  }

  // Check logo contrast & visibility
  const logoInfo = await page.evaluate(() => {
    const logoSpan = document.querySelector('nav a[href="/"] span');
    if (!logoSpan) return null;
    const computed = window.getComputedStyle(logoSpan);
    const rect = logoSpan.getBoundingClientRect();
    const parent = logoSpan.parentElement;
    const parentComputed = window.getComputedStyle(parent);
    return {
      text: logoSpan.textContent.trim(),
      color: computed.color,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      parentBg: parentComputed.backgroundColor,
      parentBorder: parentComputed.border,
      width: rect.width,
      height: rect.height,
    };
  });

  console.log('\n--- Brand Logo Audit ---');
  console.log('Logo Info:', JSON.stringify(logoInfo, null, 2));

  // 3. Mobile Viewport Test (390px iPhone width)
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await mobilePage.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, '06_mobile_hero.png') });
  console.log('✓ Captured 06_mobile_hero.png');

  await mobilePage.evaluate(() => window.scrollTo(0, 1100));
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, '07_mobile_accordion.png') });
  console.log('✓ Captured 07_mobile_accordion.png');

  await browser.close();

  console.log('\n=============================================');
  console.log(`[VISUAL QA] Finished. Broken images in DOM: ${brokenCount}`);
  console.log(`[VISUAL QA] Failed network image requests: ${failedImages.length}`);
  console.log(`[VISUAL QA] Brand name is: "${logoInfo?.text}"`);
  console.log(`[VISUAL QA] Brand font color is: "${logoInfo?.color}" on "${logoInfo?.parentBg}"`);
  console.log('=============================================\n');

  return { brokenCount, failedImages, logoInfo };
}

verifyVisuals().then(({ brokenCount, failedImages, logoInfo }) => {
  if (brokenCount === 0 && failedImages.length === 0 && logoInfo?.text === 'KisanSathi') {
    console.log('🎉 ALL VISUAL CHECKS PASSED!');
    process.exit(0);
  } else {
    console.error('⚠️ Visual checks had issues.');
    process.exit(1);
  }
}).catch(err => {
  console.error(err);
  process.exit(1);
});
