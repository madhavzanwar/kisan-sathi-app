const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

async function testDashboardTabAndLogout() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();

  // Test 1: Invalid ?tab= parameter sanitization
  console.log('Testing invalid tab parameter: http://localhost:4173/dashboard?tab=invalid_tab_xyz');
  await page.goto('http://localhost:4173/dashboard?tab=invalid_tab_xyz', { waitUntil: 'networkidle' });

  const activeCardText = await page.evaluate(() => {
    // Find the card that has the active indicator or border
    const cards = Array.from(document.querySelectorAll('div[role="button"]'));
    const active = cards.find(c => c.style.border.includes('rgb(46, 107, 52)') || c.style.border.includes('#2E6B34'));
    return active ? active.innerText : null;
  });

  console.log('Active card text found on invalid tab:', activeCardText ? activeCardText.replace(/\n/g, ' ') : 'None');

  const tabSanitized = activeCardText && activeCardText.includes('Heal Your Crop');

  // Test 2: Logout clears kisan_token
  console.log('\nTesting session token cleanup on Exit Dashboard...');
  await page.evaluate(() => localStorage.setItem('kisan_token', 'sample_test_jwt_token'));
  const tokenBefore = await page.evaluate(() => localStorage.getItem('kisan_token'));
  console.log('Token before exit:', tokenBefore);

  const exitBtn = await page.$('.hide-on-mobile');
  if (exitBtn) {
    await exitBtn.click();
    await page.waitForTimeout(500);
  }

  const tokenAfter = await page.evaluate(() => localStorage.getItem('kisan_token'));
  const currentUrl = page.url();
  console.log('Token after exit:', tokenAfter);
  console.log('URL after exit:', currentUrl);

  await browser.close();

  const logoutCleared = tokenAfter === null;

  if (tabSanitized && logoutCleared) {
    console.log('✅ PASS: Invalid tab sanitized to default and session token cleared on exit.');
    process.exit(0);
  } else {
    console.error('❌ FAIL: Tab sanitization or logout cleanup failed.');
    process.exit(1);
  }
}

testDashboardTabAndLogout().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
