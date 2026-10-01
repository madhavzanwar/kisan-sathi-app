const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

(async () => {
  console.log('[TEST] Verifying AI Assistant chat and context passing...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const page = await browser.newPage();
  
  const chatCalls = [];
  page.on('request', req => {
    if (req.url().includes('/api/chat')) {
      try {
        chatCalls.push(JSON.parse(req.postData()));
      } catch (e) {}
    }
  });

  // Navigate to dashboard on 'fertilizer' tab
  await page.goto('http://localhost:4173/dashboard?tab=fertilizer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click floating assistant launcher button
  const launcher = page.locator('button[aria-label="Open AI Assistant"]');
  await launcher.click();
  await page.waitForTimeout(500);

  // Assert chat drawer / container is open
  const chatInput = page.locator('input[placeholder*="Ask about"]');
  await chatInput.fill('What is optimal urea for wheat?');

  const sendBtn = page.locator('button[aria-label="Send message"]');
  await sendBtn.click();
  
  // Try sending immediately again to test thinking guard
  await chatInput.fill('Duplicate message attempt');
  await sendBtn.click();
  await page.waitForTimeout(2000);

  console.log('Total chat calls intercepted:', chatCalls.length);
  if (chatCalls.length !== 1) {
    console.error('FAIL: Expected exactly 1 call (duplicate send was not guarded). Actual:', chatCalls.length);
    await browser.close();
    process.exit(1);
  }

  const firstCall = chatCalls[0];
  console.log('Intercepted chat request:', JSON.stringify(firstCall));
  if (firstCall.context !== 'fertilizer' || firstCall.language !== 'en' || !firstCall.message) {
    console.error('FAIL: Chat payload contract mismatch!', firstCall);
    await browser.close();
    process.exit(1);
  }

  console.log('PASS: Chat context passed correctly and duplicate sends guarded.');
  await browser.close();
  process.exit(0);
})();
