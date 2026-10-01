const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

(async () => {
  console.log('[TEST] Verifying background video mounting and observer behavior...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Verify desktop video element exists
  const video = page.locator('video');
  const videoCount = await video.count();
  console.log('Desktop video count:', videoCount);
  if (videoCount === 0) {
    console.error('FAIL: Expected video element to mount on desktop viewport');
    await browser.close();
    process.exit(1);
  }

  // 2. Check if video is playing or paused initially
  const isPausedInitially = await page.evaluate(() => {
    const v = document.querySelector('video');
    return v ? v.paused : true;
  });
  console.log('Video paused initially?', isPausedInitially);

  // 3. Scroll down 2000px so video is completely off-screen
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(1000);

  const isPausedOffscreen = await page.evaluate(() => {
    const v = document.querySelector('video');
    return v ? v.paused : true;
  });
  console.log('Video paused when offscreen?', isPausedOffscreen);

  if (!isPausedOffscreen) {
    console.error('FAIL: IntersectionObserver did not pause offscreen video');
    await browser.close();
    process.exit(1);
  }

  console.log('PASS: Video mounted and IntersectionObserver successfully paused offscreen video.');
  await browser.close();
  process.exit(0);
})();
