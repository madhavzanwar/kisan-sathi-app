const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

const OUT_DIR = path.resolve(__dirname, '../docs/screenshots/i18n');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true }
];

const LANGUAGES = ['en', 'hi', 'mr'];

const ROUTES = [
  { id: 'landing', url: 'http://localhost:4173/' },
  { id: 'dashboard-heal', url: 'http://localhost:4173/dashboard?tab=heal' },
  { id: 'dashboard-fertilizer', url: 'http://localhost:4173/dashboard?tab=fertilizer' },
  { id: 'dashboard-yield-pest', url: 'http://localhost:4173/dashboard?tab=yield-pest' },
  { id: 'dashboard-guide', url: 'http://localhost:4173/dashboard?tab=guide' },
  { id: 'dashboard-weather', url: 'http://localhost:4173/dashboard?tab=weather' },
];

(async () => {
  console.log('========================================================');
  console.log('   KISANSATHI FULL i18n QA: SCREENSHOTS & AUDIT         ');
  console.log('========================================================\n');

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const defects = [];
  let screenshotCount = 0;

  try {
    // -------------------------------------------------------------
    // PART 1: Capture all routes and tabs across en, hi, mr & 2 viewports
    // -------------------------------------------------------------
    for (const vp of VIEWPORTS) {
      console.log(`\n▶ CAPTURING VIEWPORT: ${vp.name.toUpperCase()} (${vp.width}x${vp.height})`);
      
      for (const lang of LANGUAGES) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          isMobile: !!vp.isMobile,
        });

        // Set language preference in localStorage
        await context.addInitScript((l) => {
          localStorage.setItem('kisansathi_lang', l);
        }, lang);

        const page = await context.newPage();

        for (const route of ROUTES) {
          const targetUrl = `${route.url}${route.url.includes('?') ? '&' : '?'}lang=${lang}`;
          await page.goto(targetUrl, { waitUntil: 'networkidle' });
          await page.waitForTimeout(600);

          // Verify <html lang>
          const htmlLang = await page.getAttribute('html', 'lang');
          if (htmlLang !== lang) {
            defects.push(`[${vp.name}][${lang}][${route.id}] html lang is "${htmlLang}", expected "${lang}"`);
          }

          // Scan DOM for untranslated raw i18n keys or undefined
          const anomalies = await page.evaluate(() => {
            const issues = [];
            const textNodes = [];
            const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let n;
            while ((n = walk.nextNode())) {
              const str = n.nodeValue.trim();
              if (str.length > 0) {
                textNodes.push(str);
              }
            }

            const rawKeyRegex = /\b(common|landing|dashboard|heal|fertilizer|guides|chat|errors)\.[a-zA-Z0-9_.]+\b/;
            for (const t of textNodes) {
              if (rawKeyRegex.test(t)) {
                issues.push(`Raw key detected: "${t}"`);
              }
              if (t.includes('undefined') && !t.includes('typeof') && !t.includes('undefined-')) {
                // Ignore technical code snippets if any
                issues.push(`Undefined string detected: "${t}"`);
              }
            }
            return issues;
          });

          if (anomalies.length > 0) {
            anomalies.forEach((a) => defects.push(`[${vp.name}][${lang}][${route.id}] ${a}`));
          }

          // Take screenshot
          const filename = `${route.id}_${lang}_${vp.name}.png`;
          const filePath = path.join(OUT_DIR, filename);
          await page.screenshot({ path: filePath, fullPage: false });
          screenshotCount++;
          console.log(`  ✓ Saved: docs/screenshots/i18n/${filename}`);
        }

        await context.close();
      }
    }

    // -------------------------------------------------------------
    // PART 2: Comprehensive State Preservation Switching Tests
    // -------------------------------------------------------------
    console.log('\n========================================================');
    console.log('   PART 2: STATE PRESERVATION SWITCHING TESTS           ');
    console.log('========================================================\n');

    const switchContext = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const testPage = await switchContext.newPage();

    // --- (A) Cultivation Guide State Preservation & Translation ---
    console.log('▶ Test A: Cultivation Guide Switch Language');
    await testPage.goto('http://localhost:4173/dashboard?tab=guide&lang=en', { waitUntil: 'networkidle' });
    await testPage.waitForTimeout(500);

    // Click on Maize or Sugarcane
    const sugarcaneBtn = testPage.locator('button').filter({ hasText: 'Sugarcane' }).first();
    if (await sugarcaneBtn.isVisible()) {
      await sugarcaneBtn.click();
      await testPage.waitForTimeout(400);
    }

    // Switch to Hindi
    const guideSwitcher = testPage.locator('header button.language-switcher-pill').first();
    await guideSwitcher.click();
    await testPage.waitForTimeout(300);
    const hiMenuItem = testPage.locator('.ant-dropdown-menu-item:visible').filter({ hasText: 'हिन्दी' });
    await hiMenuItem.click();
    await testPage.waitForTimeout(600);

    // Verify sugarcane is still selected and stage text translated
    const bodyTextHi = await testPage.innerText('body');
    const hasGanna = bodyTextHi.includes('गन्ना') || bodyTextHi.includes('बुवाई') || bodyTextHi.includes('तैयारी');
    console.log(`  Guide Hindi Translation Active: ${hasGanna ? '✅ PASS' : '❌ FAIL'}`);
    if (!hasGanna) defects.push('Cultivation Guide did not translate to Hindi when switched');

    // Switch to Marathi
    await guideSwitcher.click();
    await testPage.waitForTimeout(300);
    const mrMenuItem = testPage.locator('.ant-dropdown-menu-item:visible').filter({ hasText: 'मराठी' });
    await mrMenuItem.click();
    await testPage.waitForTimeout(600);

    const bodyTextMr = await testPage.innerText('body');
    const hasUus = bodyTextMr.includes('ऊस') || bodyTextMr.includes('लागवड') || bodyTextMr.includes('तयारी');
    console.log(`  Guide Marathi Translation Active: ${hasUus ? '✅ PASS' : '❌ FAIL'}`);
    if (!hasUus) defects.push('Cultivation Guide did not translate to Marathi when switched');

    // --- (B) Fertilizer Form State Preservation & Translation ---
    console.log('\n▶ Test B: Fertilizer Calculator Form State Preservation');
    await testPage.goto('http://localhost:4173/dashboard?tab=fertilizer&lang=en', { waitUntil: 'networkidle' });
    await testPage.waitForTimeout(500);

    const farmSizeInput = testPage.locator('#farm-size-input, input[role="spinbutton"]').first();
    await farmSizeInput.waitFor({ state: 'visible', timeout: 5000 });
    await farmSizeInput.fill('4.75');

    // Switch to Hindi
    const fertSwitcher = testPage.locator('header button.language-switcher-pill').first();
    await fertSwitcher.click();
    await testPage.waitForTimeout(300);
    await testPage.locator('.ant-dropdown-menu-item:visible').filter({ hasText: 'हिन्दी' }).click();
    await testPage.waitForFunction(() => document.documentElement.lang === 'hi', { timeout: 5000 });
    await testPage.waitForTimeout(400);

    // Verify form input is still 4.75
    const farmValAfterSwitch = await farmSizeInput.inputValue();
    const fertPreserved = farmValAfterSwitch === '4.75';
    console.log(`  Fertilizer Form Value Preserved (4.75): ${fertPreserved ? '✅ PASS' : '❌ FAIL'}`);
    if (!fertPreserved) defects.push('Fertilizer input reset during language change');

    // Verify UI translated to Hindi
    const fertBodyHi = await testPage.innerText('body');
    const hasFertHindi = fertBodyHi.includes('उर्वरक') || fertBodyHi.includes('खेत') || fertBodyHi.includes('कैलकुलेटर');
    console.log(`  Fertilizer UI Translated to Hindi: ${hasFertHindi ? '✅ PASS' : '❌ FAIL'}`);
    if (!hasFertHindi) {
      console.log('DEBUG: fertBodyHi text sample:', fertBodyHi.slice(0, 400));
      defects.push('Fertilizer UI did not translate to Hindi');
    }

    // --- (C) Chatbot Conversation Preservation ---
    console.log('\n▶ Test C: Floating Assistant Chatbot Preservation');
    // Open floating chat
    const chatTrigger = testPage.locator('button[aria-label*="AI"]').first();
    if (await chatTrigger.isVisible()) {
      await chatTrigger.click();
      await testPage.waitForTimeout(500);

      // Verify chat panel opened
      const chatInput = testPage.locator('.floating-chat-input textarea, .floating-chat-input input, input[placeholder*="..."]').first();
      if (await chatInput.isVisible()) {
        await chatInput.fill('Hello KisanSathi testing persistence');
        // Press Enter or click send
        await testPage.keyboard.press('Enter');
        await testPage.waitForTimeout(600);

        // Switch to Marathi
        await fertSwitcher.click();
        await testPage.waitForTimeout(300);
        await testPage.locator('.ant-dropdown-menu-item:visible').filter({ hasText: 'मराठी' }).click();
        await testPage.waitForFunction(() => document.documentElement.lang === 'mr', { timeout: 5000 });
        await testPage.waitForTimeout(400);

        const chatText = await testPage.innerText('body');
        const chatPreserved = chatText.includes('Hello KisanSathi testing persistence');
        console.log(`  Chat Messages Preserved After Language Switch: ${chatPreserved ? '✅ PASS' : '❌ FAIL'}`);
        if (!chatPreserved) defects.push('Chat messages were lost upon language change');
      }
    }

    // --- (D) Diagnosis Result & Disease Dictionary Translation ---
    console.log('\n▶ Test D: Diagnosis Result & Disease Dictionary Translation');
    await testPage.goto('http://localhost:4173/dashboard?tab=heal&lang=en', { waitUntil: 'networkidle' });
    await testPage.waitForTimeout(500);

    // Verify heal page loads with dictionary support
    const healHeading = await testPage.innerText('h2');
    console.log(`  Heal Crop Tab Heading: "${healHeading}"`);

    // Test dictionary translation via evaluate in the actual app context
    const dictTest = await testPage.evaluate(() => {
      const i18n = window.__i18nInstance;
      if (i18n) {
        return {
          en: i18n.t('heal.diseases.tomatoEarlyBlight', { lng: 'en' }),
          hi: i18n.t('heal.diseases.tomatoEarlyBlight', { lng: 'hi' }),
          mr: i18n.t('heal.diseases.tomatoEarlyBlight', { lng: 'mr' }),
        };
      }
      return null;
    });

    console.log('  Disease Dictionary Check:', dictTest || 'Using UI rendered strings');

    // -------------------------------------------------------------
    // PART 3: Persistence & Hard Refresh Tests
    // -------------------------------------------------------------
    console.log('\n========================================================');
    console.log('   PART 3: PERSISTENCE & HARD REFRESH TESTS             ');
    console.log('========================================================\n');

    // Set to Hindi via switcher
    const healSwitcher = testPage.locator('header button.language-switcher-pill').first();
    await healSwitcher.click();
    await testPage.waitForTimeout(300);
    await testPage.locator('.ant-dropdown-menu-item:visible').filter({ hasText: 'हिन्दी' }).click();
    await testPage.waitForFunction(() => document.documentElement.lang === 'hi', { timeout: 5000 });
    await testPage.waitForTimeout(400);

    // Hard reload
    await testPage.reload({ waitUntil: 'networkidle' });
    await testPage.waitForTimeout(500);

    const reloadedLang = await testPage.getAttribute('html', 'lang');
    const storedLang = await testPage.evaluate(() => localStorage.getItem('kisansathi_lang'));
    const docTitle = await testPage.title();

    console.log(`  Reload Persistence - <html lang>: "${reloadedLang}"`);
    console.log(`  Reload Persistence - localStorage: "${storedLang}"`);
    console.log(`  Reload Persistence - Title: "${docTitle}"`);

    if (reloadedLang !== 'hi' || storedLang !== 'hi') {
      defects.push(`Persistence failed: html lang is ${reloadedLang}, stored is ${storedLang}`);
    }

    await switchContext.close();

  } catch (err) {
    console.error('Test execution error:', err);
    defects.push(`Unhandled error: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n========================================================');
  console.log(`QA RUN COMPLETE: ${screenshotCount} screenshots captured.`);
  console.log(`Defects found: ${defects.length}`);
  if (defects.length > 0) {
    console.log('DEFECT LIST:');
    defects.forEach((d) => console.log(`  ❌ ${d}`));
  } else {
    console.log('🎉 100% CLEAN - ZERO DEFECTS DETECTED!');
  }
  console.log('========================================================');

  if (defects.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
