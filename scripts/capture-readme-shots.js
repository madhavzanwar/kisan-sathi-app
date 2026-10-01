const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TMP_DIR = path.resolve(__dirname, '../docs/screenshots/readme/tmp');
const FIXTURE_LEAF = path.resolve(__dirname, 'fixtures/sample_leaf.jpg');

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

async function capture() {
  console.log('[CAPTURE] Launching Chromium with deviceScaleFactor: 2...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const settleStyles = async (p) => {
    await p.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.001s !important;
          animation-delay: 0s !important;
          transition-duration: 0.001s !important;
        }
      `
    });
  };

  // --- DESKTOP CAPTURES (1440 x 900) ---
  console.log('\n--- Capturing Desktop Screenshots (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    deviceScaleFactor: 2,
  });
  const page = await desktopContext.newPage();

  // 1. Landing Hero (01-landing-hero)
  console.log('Capturing 01-landing-hero...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await settleStyles(page);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(TMP_DIR, '01-landing-hero.png'), fullPage: false });

  // 2. Landing Features Accordion (02-landing-features)
  console.log('Capturing 02-landing-features...');
  const featuresAnchor = page.locator('div#features');
  await featuresAnchor.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  const featuresSection = page.locator('section#features');
  await featuresSection.waitFor({ state: 'visible', timeout: 5000 });
  await page.evaluate(() => {
    const nav = document.querySelector('header');
    if (nav) nav.style.display = 'none';
  });
  await settleStyles(page);
  await featuresSection.screenshot({ path: path.join(TMP_DIR, '02-landing-features.png') });
  await page.evaluate(() => {
    const nav = document.querySelector('header');
    if (nav) nav.style.display = '';
  });

  // 3. Landing How It Works (03-landing-how-it-works)
  console.log('Capturing 03-landing-how-it-works...');
  const howAnchor = page.locator('div#how-it-works');
  await howAnchor.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  const howSection = page.locator('section').filter({ hasText: 'From Field to Forecast' }).first();
  await howSection.waitFor({ state: 'visible', timeout: 5000 });
  // Temporarily hide fixed header so it doesn't overlap the eyebrow pill
  await page.evaluate(() => {
    const nav = document.querySelector('header');
    if (nav) nav.style.display = 'none';
  });
  await settleStyles(page);
  await howSection.screenshot({ path: path.join(TMP_DIR, '03-landing-how-it-works.png') });
  await page.evaluate(() => {
    const nav = document.querySelector('header');
    if (nav) nav.style.display = '';
  });

  // 4. Dashboard Heal Your Crop Upload State (04-dashboard-heal-your-crop)
  console.log('Capturing 04-dashboard-heal-your-crop...');
  await page.goto('http://localhost:4173/dashboard?tab=heal', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 180));
  await settleStyles(page);
  await page.screenshot({ path: path.join(TMP_DIR, '04-dashboard-heal-your-crop.png'), fullPage: false });

  // 5. Dashboard Heal Your Crop Real Diagnosis Result (05-dashboard-heal-result)
  console.log('Capturing 05-dashboard-heal-result...');
  if (fs.existsSync(FIXTURE_LEAF)) {
    await page.setInputFiles('input[type="file"]', FIXTURE_LEAF);
    await page.waitForSelector('text=Optimal Treatment Protocols', { timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 320));
    await settleStyles(page);
    await page.screenshot({ path: path.join(TMP_DIR, '05-dashboard-heal-result.png'), fullPage: false });
  }

  // 6. Dashboard Fertilizer Calculator with Real Results (06-dashboard-fertilizer)
  console.log('Capturing 06-dashboard-fertilizer...');
  await page.goto('http://localhost:4173/dashboard?tab=fertilizer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const calcBtn = page.locator('button:has-text("Calculate Fertilizer Dosage")');
  await calcBtn.click();
  await page.waitForSelector('text=Formulation Match', { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 200));
  await settleStyles(page);
  await page.screenshot({ path: path.join(TMP_DIR, '06-dashboard-fertilizer.png'), fullPage: false });

  // 7. Dashboard Cultivation Guide (07-dashboard-cultivation-guide)
  console.log('Capturing 07-dashboard-cultivation-guide...');
  await page.goto('http://localhost:4173/dashboard?tab=guide', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const cropBtn = page.locator('button:has-text("Cotton")');
  if (await cropBtn.count() > 0) {
    await cropBtn.click();
    await page.waitForTimeout(600);
  }
  await page.evaluate(() => window.scrollTo(0, 200));
  await settleStyles(page);
  await page.screenshot({ path: path.join(TMP_DIR, '07-dashboard-cultivation-guide.png'), fullPage: false });

  // 8. AI Assistant Open with Real Chat (08-ai-assistant-open)
  console.log('Capturing 08-ai-assistant-open...');
  await page.goto('http://localhost:4173/dashboard?tab=fertilizer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const assistantBtn = page.locator('button[aria-label="Open AI Assistant"]');
  await assistantBtn.click();
  await page.waitForTimeout(800);
  
  // Send message
  const chatInput = page.locator('input[placeholder*="Ask about"]');
  await chatInput.fill('What is the best NPK ratio for wheat during sowing?');
  const sendBtn = page.locator('button[aria-label="Send message"]');
  await sendBtn.click();
  
  // Wait for Gemini answer to arrive and replace "Consulting agronomy models..."
  await page.waitForFunction(() => {
    return !document.body.innerText.includes('Consulting agronomy models') && 
           document.body.innerText.includes('wheat');
  }, { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(1000);
  await settleStyles(page);
  await page.screenshot({ path: path.join(TMP_DIR, '08-ai-assistant-open.png'), fullPage: false });

  await desktopContext.close();

  // --- MOBILE CAPTURES (390 x 844) ---
  console.log('\n--- Capturing Mobile Screenshots (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();

  // 9. Mobile Landing (09-mobile-landing)
  console.log('Capturing 09-mobile-landing...');
  await mobilePage.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await settleStyles(mobilePage);
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(TMP_DIR, '09-mobile-landing.png'), fullPage: false });

  // 10. Mobile Dashboard (10-mobile-dashboard)
  console.log('Capturing 10-mobile-dashboard...');
  await mobilePage.goto('http://localhost:4173/dashboard?tab=heal', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await settleStyles(mobilePage);
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(TMP_DIR, '10-mobile-dashboard.png'), fullPage: false });

  await mobileContext.close();
  await browser.close();
  console.log('\n[CAPTURE] All raw PNG screenshots successfully captured!');
}

capture().catch(err => {
  console.error('[CAPTURE ERROR]:', err);
  process.exit(1);
});
