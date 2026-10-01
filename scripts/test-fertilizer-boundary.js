const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

(async () => {
  console.log('[TEST] Verifying Fertilizer Calculator boundary validation...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const page = await browser.newPage();
  
  let fertilizerApiCalled = 0;
  let interceptedPayload = null;

  page.on('request', req => {
    if (req.url().includes('/api/predict/fertilizer')) {
      fertilizerApiCalled++;
      try {
        interceptedPayload = JSON.parse(req.postData());
      } catch (e) {}
    }
  });

  await page.goto('http://localhost:4173/dashboard?tab=fertilizer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Clear farm size completely (NaN / empty)
  console.log('Testing invalid farm size: cleared');
  const farmInput = page.locator('#farm-size-input');
  await farmInput.click();
  await farmInput.press('Control+a');
  await farmInput.press('Backspace');
  await farmInput.press('Tab'); // Trigger blur so InputNumber emits onChange
  await page.waitForTimeout(300);

  const calcBtn = page.locator('button:has-text("Calculate Fertilizer Dosage")');
  await calcBtn.click();
  await page.waitForTimeout(500);

  // Assert error message appears and NO api call was made
  const alertText = await page.locator('.ant-alert').textContent().catch(() => '');
  console.log('Alert text observed:', alertText);
  if (!alertText.includes('farm size greater than 0')) {
    console.error('FAIL: Expected farm size validation error alert');
    await browser.close();
    process.exit(1);
  }
  if (fertilizerApiCalled !== 0) {
    console.error('FAIL: API was called despite invalid farm size!');
    await browser.close();
    process.exit(1);
  }
  console.log('PASS: Invalid farm size halted submission with UI alert.');

  // 2. Enter valid farm size and calculate
  console.log('Testing valid farm size: 2.5');
  await farmInput.fill('2.5');
  await farmInput.press('Tab');
  await calcBtn.click();
  await page.waitForTimeout(2000);

  if (fertilizerApiCalled === 0) {
    console.error('FAIL: Fertilizer API was not called for valid inputs');
    await browser.close();
    process.exit(1);
  }

  console.log('Intercepted Payload:', JSON.stringify(interceptedPayload));
  const expectedKeys = ['n', 'p', 'k', 'ph', 'soil_type', 'crop_type', 'farm_size'];
  const actualKeys = Object.keys(interceptedPayload);
  const keysMatch = expectedKeys.every(k => actualKeys.includes(k)) && actualKeys.length === expectedKeys.length;
  if (!keysMatch) {
    console.error('FAIL: Payload keys mismatch! Expected:', expectedKeys, 'Actual:', actualKeys);
    await browser.close();
    process.exit(1);
  }

  console.log('PASS: Payload keys match exact contract. All checks passed.');
  await browser.close();
  process.exit(0);
})();
