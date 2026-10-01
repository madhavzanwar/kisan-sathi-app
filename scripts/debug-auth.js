const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  console.log('Page loaded');
  await page.click('button:has-text("Try the App")');
  console.log('Clicked Try the App');
  await page.waitForTimeout(1000);
  const drawerCount = await page.locator('.ant-drawer').count();
  console.log('Drawer count:', drawerCount);
  const buttons = await page.locator('button').allInnerTexts();
  console.log('Buttons on page:', buttons.slice(0, 15));
  const inputs = await page.locator('input').count();
  console.log('Inputs count:', inputs);
  await browser.close();
})();
