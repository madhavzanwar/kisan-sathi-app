const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

(async () => {
  console.log('========================================================');
  console.log('       KISANSATHI i18n & SWITCHER VERIFICATION SUITE    ');
  console.log('========================================================\n');

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // TEST 1: Default load & Initial Detection
    // -------------------------------------------------------------
    console.log('▶ TEST 1: Default English Load & DOM Metadata');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const initialHtmlLang = await page.getAttribute('html', 'lang');
    assert(initialHtmlLang === 'en', `Default <html lang> is "en" (actual: "${initialHtmlLang}")`);

    const initialDir = await page.getAttribute('html', 'dir');
    assert(initialDir === 'ltr', `<html dir> is "ltr" (actual: "${initialDir}")`);

    const title = await page.title();
    assert(title.includes('KisanSathi'), `Document title contains KisanSathi (actual: "${title}")`);

    // -------------------------------------------------------------
    // TEST 2: URL Parameter Detection (?lang=hi)
    // -------------------------------------------------------------
    console.log('\n▶ TEST 2: URL Parameter Detection (?lang=hi)');
    await page.goto('http://localhost:4173/?lang=hi', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const hiHtmlLang = await page.getAttribute('html', 'lang');
    assert(hiHtmlLang === 'hi', `URL param ?lang=hi sets <html lang="hi"> (actual: "${hiHtmlLang}")`);

    const hiSaved = await page.evaluate(() => localStorage.getItem('kisansathi_lang'));
    assert(hiSaved === 'hi', `localStorage "kisansathi_lang" was set to "hi" (actual: "${hiSaved}")`);

    // -------------------------------------------------------------
    // TEST 3: Switcher UI & Interactive Switch to Marathi (mr)
    // -------------------------------------------------------------
    console.log('\n▶ TEST 3: Switcher UI on Landing & Switching to Marathi');
    // Switcher button on video
    const switcherBtn = page.locator('button.language-switcher-pill').first();
    const btnVisible = await switcherBtn.isVisible();
    assert(btnVisible, 'Language switcher pill button is visible in navbar');

    const ariaHasPopup = await switcherBtn.getAttribute('aria-haspopup');
    assert(ariaHasPopup === 'menu', 'Switcher button has aria-haspopup="menu"');

    // Click to open dropdown
    await switcherBtn.click();
    await page.waitForTimeout(400);

    const dropdownOpen = await switcherBtn.getAttribute('aria-expanded');
    assert(dropdownOpen === 'true', 'Switcher button sets aria-expanded="true" when opened');

    // Click Marathi option
    const mrOption = page.locator('.ant-dropdown-menu-item').filter({ hasText: 'मराठी' });
    const mrVisible = await mrOption.isVisible();
    assert(mrVisible, 'Marathi option "मराठी (Marathi)" is present in dropdown menu');
    await mrOption.click();
    await page.waitForTimeout(600);

    const mrHtmlLang = await page.getAttribute('html', 'lang');
    assert(mrHtmlLang === 'mr', `<html lang> updated to "mr" (actual: "${mrHtmlLang}")`);

    const mrSaved = await page.evaluate(() => localStorage.getItem('kisansathi_lang'));
    assert(mrSaved === 'mr', `localStorage updated to "mr" (actual: "${mrSaved}")`);

    const btnText = (await switcherBtn.innerText()).trim();
    assert(btnText.includes('मरा'), `Switcher pill displays short native label "मरा" (actual: "${btnText}")`);

    // Screen reader announcement
    const announcement = await page.locator('[role="status"][aria-live="polite"]').innerText();
    assert(announcement.length > 0, `Screen-reader live region announced: "${announcement}"`);

    // -------------------------------------------------------------
    // TEST 4: Typography & Devanagari Accent Override Check
    // -------------------------------------------------------------
    console.log('\n▶ TEST 4: Devanagari Typography & CSS Rules');
    const headingAccentStyle = await page.evaluate(() => {
      const el = document.querySelector('.heading-accent') || document.querySelector('h1, h2');
      if (!el) return null;
      const computed = window.getComputedStyle(el);
      return {
        lineHeight: computed.lineHeight,
      };
    });
    assert(headingAccentStyle !== null, 'Found typography heading elements for styling check');

    // -------------------------------------------------------------
    // TEST 5: State Preservation in Dashboard
    // -------------------------------------------------------------
    console.log('\n▶ TEST 5: State Preservation on Dashboard during Language Switch');
    await page.goto('http://localhost:4173/dashboard?tab=fertilizer', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Verify initial tab is fertilizer
    let currentUrl = page.url();
    assert(currentUrl.includes('tab=fertilizer'), 'Dashboard loaded on fertilizer tab');

    // Fill an input to test preservation
    const farmInput = page.locator('input[placeholder*="acres"], input[type="number"]').first();
    if (await farmInput.isVisible()) {
      await farmInput.fill('7.25');
    }

    // Switch language to English using header switcher
    const dashSwitcher = page.locator('header button.language-switcher-pill').first();
    await dashSwitcher.click();
    await page.waitForTimeout(300);

    const enOption = page.locator('.ant-dropdown-menu-item').filter({ hasText: 'English' });
    await enOption.click();
    await page.waitForTimeout(600);

    // Assert tab hasn't reset
    currentUrl = page.url();
    assert(currentUrl.includes('tab=fertilizer'), 'Dashboard active tab preserved after language change');

    if (await farmInput.isVisible()) {
      const val = await farmInput.inputValue();
      assert(val === '7.25', `Input form state preserved without reset (actual: "${val}")`);
    }

    // -------------------------------------------------------------
    // TEST 6: Mobile Drawer Switcher (Segmented Control)
    // -------------------------------------------------------------
    console.log('\n▶ TEST 6: Mobile Drawer Switcher at 390px Viewport');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(500);

    // Open mobile hamburger drawer
    const hamburger = mobilePage.locator('button.mobile-hamburger-btn');
    await hamburger.click();
    await mobilePage.waitForTimeout(400);

    // Check segmented control
    const segmented = mobilePage.locator('.ant-segmented');
    const segmentedVisible = await segmented.isVisible();
    assert(segmentedVisible, 'Segmented language control is visible inside mobile Drawer');

    // Click Hindi in segmented control
    const hiSegment = mobilePage.locator('.ant-segmented-item').filter({ hasText: 'हिन्दी' });
    await hiSegment.click();
    await mobilePage.waitForTimeout(500);

    const mobileHtmlLang = await mobilePage.getAttribute('html', 'lang');
    assert(mobileHtmlLang === 'hi', `Mobile drawer segmented control switched <html lang> to "hi" (actual: "${mobileHtmlLang}")`);

    await mobileContext.close();

    // -------------------------------------------------------------
    // TEST 7: Footer Language Switcher
    // -------------------------------------------------------------
    console.log('\n▶ TEST 7: Footer Language Switcher');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);

    const footerSwitcher = page.locator('.language-switcher-footer');
    await footerSwitcher.waitFor({ state: 'visible', timeout: 5000 });
    const footerVisible = await footerSwitcher.isVisible();
    assert(footerVisible, 'Footer language switcher is visible');

    const footerMrBtn = footerSwitcher.locator('button').filter({ hasText: 'मराठी' });
    await footerMrBtn.click();
    await page.waitForTimeout(500);

    const finalHtmlLang = await page.getAttribute('html', 'lang');
    assert(finalHtmlLang === 'mr', `Footer switcher switched <html lang> to "mr" (actual: "${finalHtmlLang}")`);

  } catch (err) {
    console.error('Unhandled test failure:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n========================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
