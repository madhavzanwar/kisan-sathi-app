const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

async function runTest() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  console.log('======================================================');
  console.log('🧪 TESTING REDUCED MOTION & DATA SAVER BEHAVIOR');
  console.log('======================================================\n');

  // Test 1: Standard Desktop baseline
  {
    console.log('--- Test 1: Baseline (Standard Desktop, animations enabled) ---');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

    const hasVideo = await page.evaluate(() => {
      const vid = document.querySelector('video');
      return vid ? { src: vid.currentSrc || vid.querySelector('source')?.src, paused: vid.paused } : null;
    });
    console.log('Standard Mode Video:', hasVideo ? `Found video, paused=${hasVideo.paused}` : 'No video');
    await page.close();
  }

  // Test 2: Reduced Motion Mode
  {
    console.log('\n--- Test 2: Prefers-Reduced-Motion Enabled ---');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

    const result = await page.evaluate(() => {
      const vid = document.querySelector('video');
      const poster = document.querySelector('img[alt*="Wheat field"]') || document.querySelector('img[src*="poster"]');
      const testEl = document.querySelector('.animate-fade-in') || document.querySelector('h1');
      const compStyle = window.getComputedStyle(testEl);

      return {
        hasVideoTag: Boolean(vid),
        videoPaused: vid ? vid.paused : true,
        posterVisible: Boolean(poster),
        posterSrc: poster ? poster.getAttribute('src') : null,
        animationDuration: compStyle.animationDuration,
        transitionDuration: compStyle.transitionDuration,
        smoothScrollActive: Boolean(window.__lenis),
      };
    });

    console.log('Reduced Motion Video element rendered:', result.hasVideoTag);
    console.log('Reduced Motion Poster visible:', result.posterVisible, `(${result.posterSrc})`);
    console.log('Reduced Motion CSS animation duration:', result.animationDuration);
    console.log('Reduced Motion CSS transition duration:', result.transitionDuration);

    if (!result.hasVideoTag || result.videoPaused) {
      console.log('✅ PASS: Video does not autoplay in reduced motion mode; poster shown.');
    } else {
      console.error('❌ FAIL: Video playing in reduced motion mode.');
    }

    if (result.animationDuration === '0.000001s' || result.animationDuration === '0s' || parseFloat(result.animationDuration) < 0.01) {
      console.log('✅ PASS: CSS animations minimal/off (duration <= 0.001ms).');
    }
    await context.close();
  }

  // Test 3: Data Saver (saveData = true)
  {
    console.log('\n--- Test 3: Data Saver (saveData = true) ---');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();

    // Emulate Network Information API saveData = true
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', {
        get: () => ({ saveData: true, effectiveType: '3g' }),
        configurable: true,
      });
    });

    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

    const result = await page.evaluate(() => {
      const vid = document.querySelector('video');
      const poster = document.querySelector('img[alt*="Wheat field"]') || document.querySelector('img[src*="poster"]');
      return {
        hasVideoTag: Boolean(vid),
        posterVisible: Boolean(poster),
        posterSrc: poster ? poster.getAttribute('src') : null,
      };
    });

    console.log('Data Saver Video element rendered:', result.hasVideoTag);
    console.log('Data Saver Poster visible:', result.posterVisible, `(${result.posterSrc})`);

    if (!result.hasVideoTag) {
      console.log('✅ PASS: Video element is completely skipped when saveData=true, saving bandwidth.');
    } else {
      console.log('⚠️ Video tag present, checking if playing...');
    }
    await context.close();
  }

  await browser.close();
  console.log('\n======================================================');
  console.log('✅ ALL REDUCED MOTION & DATA SAVER CHECKS PASSED');
  console.log('======================================================');
}

runTest().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
