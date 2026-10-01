const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

async function testSeoAndHardRefresh() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  console.log('======================================================');
  console.log('🌐 TESTING SEO, META TAGS, AND SPA HARD REFRESH (ITEM 7)');
  console.log('======================================================\n');

  const page = await browser.newPage();

  // 1. Landing Page Meta & SEO Check
  console.log('--- Step 1: Checking Landing Page SEO & Meta Tags ---');
  const landingResp = await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  console.log('Landing HTTP Status:', landingResp.status());

  const seoData = await page.evaluate(() => {
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
      favicon: document.querySelector('link[rel="icon"]')?.getAttribute('href'),
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
    };
  });

  console.log('Page Title:', seoData.title);
  console.log('Meta Description:', seoData.description);
  console.log('Theme Color:', seoData.themeColor);
  console.log('Favicon:', seoData.favicon);
  console.log('OG Title:', seoData.ogTitle);
  console.log('OG Image:', seoData.ogImage);
  console.log('Twitter Card:', seoData.twitterCard);

  const seoPass =
    Boolean(seoData.description) &&
    Boolean(seoData.themeColor) &&
    Boolean(seoData.favicon) &&
    Boolean(seoData.ogTitle) &&
    Boolean(seoData.ogImage);

  if (seoPass) {
    console.log('✅ PASS: All required SEO, Open Graph, Favicon, and theme-color tags present.');
  } else {
    console.error('❌ FAIL: Missing one or more required SEO tags.');
  }

  // 2. Hard Refresh Test on Dashboard Direct Route
  console.log('\n--- Step 2: Testing Direct Route Hard Refresh ---');
  const dashResp = await page.goto('http://localhost:4173/dashboard?tab=fertilizer', { waitUntil: 'networkidle' });
  console.log('Direct Dashboard Route HTTP Status:', dashResp.status());

  const dashTitle = await page.title();
  const hasFertilizerHeading = await page.$eval('h2', (el) => el.innerText).catch(() => '');
  console.log('Dashboard Route Title:', dashTitle);
  console.log('Rendered Heading:', hasFertilizerHeading);

  const hardRefreshPass =
    dashResp.status() === 200 &&
    dashTitle.includes('Fertilizer Calculator') &&
    hasFertilizerHeading.includes('Agronomy');

  if (hardRefreshPass) {
    console.log('✅ PASS: Direct URL hard refresh works seamlessly without 404 or white-screen.');
  } else {
    console.error('❌ FAIL: Hard refresh on dashboard route failed.');
  }

  // 3. Tab switching dynamic title check
  console.log('\n--- Step 3: Checking Dynamic Title on Tab Switching ---');
  await page.goto('http://localhost:4173/dashboard?tab=heal', { waitUntil: 'networkidle' });
  const healTitle = await page.title();
  console.log('Heal Tab Title:', healTitle);

  if (healTitle.includes('Heal Your Crop')) {
    console.log('✅ PASS: Dynamic document title updates correctly per tab.');
  } else {
    console.error('❌ FAIL: Title did not update for heal tab.');
  }

  await browser.close();
  console.log('\n======================================================');
  console.log('✅ ALL SEO & HARD REFRESH CHECKS COMPLETED');
  console.log('======================================================');
}

testSeoAndHardRefresh().catch((err) => {
  console.error('SEO Test error:', err);
  process.exit(1);
});
