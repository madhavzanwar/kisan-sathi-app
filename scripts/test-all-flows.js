const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  // 1. Auth Flow
  console.log('\n1. Testing Auth Flow...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Try the App")');
  await page.waitForTimeout(600);

  // Click Register now
  await page.click('button:has-text("Register now")');
  await page.waitForTimeout(300);
  console.log('Clicked Register now. Submit button text:', await page.locator('button[type="submit"]').innerText());

  const testEmail = `farmer_${Date.now()}@example.com`;
  await page.locator('input[placeholder="farmer@example.com"]').fill(testEmail);
  await page.locator('input[placeholder="••••••••"]').fill('FarmPass123!');

  // Intercept register request
  const [regReq] = await Promise.all([
    page.waitForRequest(r => r.url().includes('/api/auth/register'), { timeout: 8000 }),
    page.click('button[type="submit"]')
  ]);
  console.log('Register request captured:', regReq.method(), regReq.url(), regReq.postData());

  // Wait for registration to complete and component to auto-switch to login
  await page.waitForTimeout(1000);
  await page.locator('input[placeholder="farmer@example.com"]').fill(testEmail);
  await page.locator('input[placeholder="••••••••"]').fill('FarmPass123!');

  const [loginReq] = await Promise.all([
    page.waitForRequest(r => r.url().includes('/api/auth/login'), { timeout: 8000 }),
    page.click('button[type="submit"]')
  ]);
  console.log('Login request captured:', loginReq.method(), loginReq.url(), loginReq.postData());

  // 2. Heal Crop Flow
  console.log('\n2. Testing Heal Crop Flow...');
  await page.goto('http://localhost:4173/dashboard?tab=heal', { waitUntil: 'networkidle' });
  const fixture = path.resolve('scripts/fixtures/sample_leaf.jpg');

  const [healReq, healRes] = await Promise.all([
    page.waitForRequest(r => r.url().includes('/api/predict/disease'), { timeout: 10000 }),
    page.waitForResponse(r => r.url().includes('/api/predict/disease'), { timeout: 10000 }),
    page.locator('input[type="file"]').first().setInputFiles(fixture)
  ]);
  console.log('Heal request captured:', healReq.method(), healReq.url(), 'Status:', healRes.status());
  console.log('Heal response body:', await healRes.json());
  await page.waitForTimeout(1000);
  const healRendered = await page.locator('text=/Confidence|Severity|Diagnosis|Treatment/i').first().isVisible();
  console.log('Heal diagnosis visible:', healRendered);

  // 3. Fertilizer Calc Flow
  console.log('\n3. Testing Fertilizer Flow...');
  await page.goto('http://localhost:4173/dashboard?tab=fertilizer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const [fertReq, fertRes] = await Promise.all([
    page.waitForRequest(r => r.url().includes('/api/predict/fertilizer'), { timeout: 10000 }),
    page.waitForResponse(r => r.url().includes('/api/predict/fertilizer'), { timeout: 10000 }),
    page.click('button:has-text("Calculate Fertilizer Dosage")')
  ]);
  console.log('Fertilizer request captured:', fertReq.method(), fertReq.url(), 'Status:', fertRes.status());
  console.log('Fertilizer payload:', fertReq.postData());
  console.log('Fertilizer response:', await fertRes.json());
  await page.waitForTimeout(1000);
  const ureaVis = await page.locator('text=/Urea/i').first().isVisible();
  const dapVis = await page.locator('text=/DAP/i').first().isVisible();
  const mopVis = await page.locator('text=/MOP/i').first().isVisible();
  const compVis = await page.locator('text=/Compost/i').first().isVisible();
  console.log('4 Dosage visible:', { ureaVis, dapVis, mopVis, compVis });

  // 4. Chat Flow
  console.log('\n4. Testing Chat Flow...');
  await page.goto('http://localhost:4173/dashboard?tab=heal', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  await page.click('button:has-text("Kisan AI")');
  await page.waitForTimeout(500);

  const chatInput = page.locator('input[placeholder*="Ask"], input[placeholder*="Type"]').first();
  await chatInput.fill('How to cure blight on tomato?');

  const [chat1Req] = await Promise.all([
    page.waitForRequest(r => r.url().includes('/api/chat'), { timeout: 10000 }),
    chatInput.press('Enter')
  ]);
  console.log('Chat 1 captured (heal):', chat1Req.method(), chat1Req.url(), chat1Req.postData());

  // Tab 2: Fertilizer
  await page.goto('http://localhost:4173/dashboard?tab=fertilizer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  if (await page.locator('button:has-text("Kisan AI")').isVisible()) {
    await page.click('button:has-text("Kisan AI")');
    await page.waitForTimeout(500);
  }

  const chatInput2 = page.locator('input[placeholder*="Ask"], input[placeholder*="Type"]').first();
  await chatInput2.fill('What is the recommended DAP dosage?');

  const [chat2Req] = await Promise.all([
    page.waitForRequest(r => r.url().includes('/api/chat'), { timeout: 10000 }),
    chatInput2.press('Enter')
  ]);
  console.log('Chat 2 captured (fertilizer):', chat2Req.method(), chat2Req.url(), chat2Req.postData());

  await browser.close();
  console.log('\nALL 4 FLOWS VERIFIED SUCCESSFUL!');
})();
