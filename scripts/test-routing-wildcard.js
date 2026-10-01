const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

async function testWildcardRoute() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();
  console.log('Navigating to invalid path: http://localhost:4173/nonexistent-route-xyz');
  await page.goto('http://localhost:4173/nonexistent-route-xyz', { waitUntil: 'networkidle' });

  const finalUrl = page.url();
  console.log('Final URL after navigation:', finalUrl);

  const isRedirectedToHome = finalUrl === 'http://localhost:4173/' || finalUrl.endsWith(':4173/');
  const rootContentLength = await page.evaluate(() => document.getElementById('root')?.innerText.length || 0);
  console.log('Root content length:', rootContentLength);

  await browser.close();

  if (isRedirectedToHome && rootContentLength > 0) {
    console.log('✅ PASS: Invalid route redirected successfully to home landing page.');
    process.exit(0);
  } else {
    console.error('❌ FAIL: Invalid route rendered blank page or failed to redirect.');
    process.exit(1);
  }
}

testWildcardRoute().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
