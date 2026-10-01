/**
 * scripts/e2e.js
 * End-to-End Real API Verification Suite for KisanSathi
 * 
 * Drives the built frontend in headless Chrome via Playwright:
 * 1. Sign up & Log in flow (Auth Drawer -> /api/auth/register, /api/auth/login)
 * 2. Heal Your Crop (File upload -> multipart /api/predict/disease)
 * 3. Smart Fertilizer Calculator (Form submit -> JSON /api/predict/fertilizer)
 * 4. Floating AI Assistant (Context-aware chat across 2 tabs -> /api/chat)
 * 
 * Intercepts, asserts, and logs all network requests.
 */

const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runE2E({ baseUrl = 'http://localhost:4173', outputFile = 'scripts/requests-current.json' } = {}) {
  console.log(`\n======================================================`);
  console.log(`[E2E] Running Real API Tests against: ${baseUrl}`);
  console.log(`[E2E] Output Log Target: ${outputFile}`);
  console.log(`======================================================\n`);

  const interceptedRequests = [];
  const testResults = {
    auth: { ran: false, passed: false, details: null },
    healCrop: { ran: false, passed: false, details: null },
    fertilizer: { ran: false, passed: false, details: null },
    chat: { ran: false, passed: false, details: null },
  };

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  // In-browser fetch interceptor to inspect FormData fields (since CDP streams binary blobs)
  await page.addInitScript(() => {
    const origFetch = window.fetch;
    window.fetch = async function(...args) {
      const [resource, config] = args;
      if (typeof resource === 'string' && resource.includes('/api/predict/disease') && config && config.body instanceof FormData) {
        window.__capturedDiseaseFormData = {
          hasFile: config.body.has('file'),
          fileFieldType: config.body.get('file')?.constructor?.name,
          fileName: config.body.get('file')?.name,
          fileSize: config.body.get('file')?.size,
        };
      }
      return origFetch.apply(this, args);
    };
  });

  // Intercept and record all API network requests
  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('/api/')) {
      const entry = {
        url: url.replace(/https?:\/\/[^/]+/, ''), // relative path for deterministic diffing
        fullUrl: url,
        method: request.method(),
        headers: {
          'content-type': request.headers()['content-type'] || null,
          'accept': request.headers()['accept'] || null,
        },
        body: null,
        bodyKeys: [],
        multipartFields: [],
        timestamp: Date.now(),
      };

      const buffer = request.postDataBuffer();
      if (buffer) {
        const ctype = request.headers()['content-type'] || '';
        if (ctype.includes('multipart/form-data')) {
          entry.body = '[Multipart Form Data]';
          const str = buffer.toString('latin1');
          const fieldMatches = [...str.matchAll(/name="([^"]+)"/g)].map(m => m[1]);
          entry.multipartFields = [...new Set(fieldMatches)].sort();
        } else if (ctype.includes('application/json')) {
          const postData = buffer.toString('utf8');
          try {
            const parsed = JSON.parse(postData);
            entry.body = parsed;
            entry.bodyKeys = Object.keys(parsed).sort();
          } catch (e) {
            entry.body = postData;
          }
        } else if (ctype.includes('application/x-www-form-urlencoded')) {
          const postData = buffer.toString('utf8');
          const params = new URLSearchParams(postData);
          const obj = {};
          for (const [k, v] of params.entries()) obj[k] = v;
          entry.body = obj;
          entry.bodyKeys = Object.keys(obj).sort();
        }
      }

      interceptedRequests.push(entry);
      console.log(`[NET REQ] ${entry.method} ${entry.url} (Type: ${entry.headers['content-type']})`);
    }
  });

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/')) {
      const match = interceptedRequests.find(r => r.fullUrl === url && !r.responseStatus);
      if (match) {
        match.responseStatus = response.status();
        try {
          match.responseData = await response.json();
        } catch (e) {
          match.responseData = '[Non-JSON response]';
        }
      }
    }
  });

  try {
    // -------------------------------------------------------------------------
    // TEST 1: AUTH FLOW (SIGN UP & LOGIN)
    // -------------------------------------------------------------------------
    console.log(`\n--- TEST 1: Sign up & Log in Flow ---`);
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });

    // Open Auth Drawer or Panel
    const tryAppBtn = page.locator('button:has-text("Try the App"), button:has-text("Explore AI Tools")').first();
    const getStartedBtn = page.locator('button:has-text("Get Started")').first();

    if (await tryAppBtn.isVisible()) {
      await tryAppBtn.click();
      await page.waitForTimeout(600);
    } else if (await getStartedBtn.isVisible()) {
      await getStartedBtn.click();
      await page.waitForTimeout(600);
    }

    // Switch to Register mode
    const registerToggle = page.locator('button:has-text("Register now"), button:has-text("Create one")').first();
    if (await registerToggle.isVisible()) {
      await registerToggle.click();
      await page.waitForTimeout(400);
    }

    const testEmail = `farmer_${Date.now()}@example.com`;
    const testPassword = 'FarmSecurePass123!';

    const emailInput = page.locator('input[type="email"], input[placeholder*="farmer@example.com"], input[placeholder*="Email address"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);

    const [regReq, regRes] = await Promise.all([
      page.waitForRequest(r => r.url().includes('/api/auth/register'), { timeout: 10000 }),
      page.waitForResponse(r => r.url().includes('/api/auth/register'), { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);
    console.log(`✓ Registration captured: ${regReq.method()} ${regReq.url()} Status: ${regRes.status()}`);

    // Wait to see if login request was automatically triggered (baseline flow)
    await page.waitForTimeout(1000);
    let loginReqLog = interceptedRequests.find(r => r.url.includes('/api/auth/login'));
    let loginStatus = loginReqLog ? loginReqLog.responseStatus : null;

    if (!loginReqLog) {
      // In redesign: drawer switches to login mode, enter credentials and submit
      const loginEmail = page.locator('input[type="email"], input[placeholder*="farmer@example.com"], input[placeholder*="Email address"]').first();
      const loginPass = page.locator('input[type="password"]').first();
      if (await loginEmail.isVisible() && (await loginEmail.inputValue()) === '') {
        await loginEmail.fill(testEmail);
      }
      if (await loginPass.isVisible() && (await loginPass.inputValue()) === '') {
        await loginPass.fill(testPassword);
      }

      const [loginReq, loginRes] = await Promise.all([
        page.waitForRequest(r => r.url().includes('/api/auth/login'), { timeout: 10000 }),
        page.waitForResponse(r => r.url().includes('/api/auth/login'), { timeout: 10000 }),
        page.click('button[type="submit"]')
      ]);
      loginStatus = loginRes.status();
      console.log(`✓ Login captured: ${loginReq.method()} ${loginReq.url()} Status: ${loginStatus}`);
    } else {
      console.log(`✓ Baseline auto-login captured Status: ${loginStatus}`);
    }

    testResults.auth = {
      ran: true,
      passed: regRes.status() === 200 && loginStatus === 200,
      details: {
        registrationStatus: regRes.status(),
        loginStatus,
      }
    };

    // -------------------------------------------------------------------------
    // TEST 2: HEAL YOUR CROP (DISEASE DETECTION VIA FILE UPLOAD)
    // -------------------------------------------------------------------------
    console.log(`\n--- TEST 2: Heal Your Crop (Leaf Image Diagnosis) ---`);
    await page.goto(`${baseUrl}/dashboard?tab=heal`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const fixturePath = path.resolve('scripts/fixtures/sample_leaf.jpg');
    if (!fs.existsSync(fixturePath)) {
      throw new Error(`Fixture file not found at: ${fixturePath}`);
    }

    const [diseaseReq, diseaseRes] = await Promise.all([
      page.waitForRequest(r => r.url().includes('/api/predict/disease'), { timeout: 10000 }),
      page.waitForResponse(r => r.url().includes('/api/predict/disease'), { timeout: 10000 }),
      page.locator('input[type="file"]').first().setInputFiles(fixturePath)
    ]);

    console.log(`✓ Disease prediction request sent: ${diseaseReq.url()} Status: ${diseaseRes.status()}`);
    const diseaseCtype = diseaseReq.headers()['content-type'] || '';
    const isMultipart = diseaseCtype.includes('multipart/form-data');
    console.log(`✓ Content-Type is multipart/form-data: ${isMultipart}`);

    const capturedFormData = await page.evaluate(() => window.__capturedDiseaseFormData);
    const hasFileField = Boolean(capturedFormData?.hasFile);
    console.log(`✓ Multipart form field 'file' present: ${hasFileField} (Name: ${capturedFormData?.fileName}, Type: ${capturedFormData?.fileFieldType})`);

    const diseaseReqLog = interceptedRequests.find(r => r.url.includes('/api/predict/disease'));
    if (diseaseReqLog && hasFileField) {
      diseaseReqLog.multipartFields = ['file'];
    }

    // Wait for diagnosis card to render in the UI
    await page.waitForSelector('text=/Confidence|Severity|Diagnosis|Treatment/i', { timeout: 6000 });
    const diagnosisRendered = await page.locator('text=/Confidence|Severity|Diagnosis|Treatment/i').first().isVisible();
    console.log(`✓ Diagnosis result card rendered in UI: ${diagnosisRendered}`);

    testResults.healCrop = {
      ran: true,
      passed: isMultipart && hasFileField && diseaseRes.status() === 200 && diagnosisRendered,
      details: {
        status: diseaseRes.status(),
        isMultipart,
        hasFileField,
        diagnosisRendered,
      }
    };

    // -------------------------------------------------------------------------
    // TEST 3: SMART FERTILIZER CALCULATOR
    // -------------------------------------------------------------------------
    console.log(`\n--- TEST 3: Smart Fertilizer Calculator ---`);
    await page.goto(`${baseUrl}/dashboard?tab=fertilizer`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const fertTabBtn = page.locator('button:has-text("Fertilizer Calc"), button:has-text("Fertilizer")').first();
    if (await fertTabBtn.isVisible()) {
      await fertTabBtn.click();
      await page.waitForTimeout(400);
    }

    const calcBtn = page.locator('button:has-text("Calculate Fertilizer Dosage"), button:has-text("Calculate Dosage")').first();
    const [fertReq, fertRes] = await Promise.all([
      page.waitForRequest(r => r.url().includes('/api/predict/fertilizer'), { timeout: 10000 }),
      page.waitForResponse(r => r.url().includes('/api/predict/fertilizer'), { timeout: 10000 }),
      calcBtn.click()
    ]);

    console.log(`✓ Fertilizer request sent: ${fertReq.url()} Status: ${fertRes.status()}`);
    const fertLog = interceptedRequests.find(r => r.url.includes('/api/predict/fertilizer'));
    const expectedKeys = ['crop_type', 'farm_size', 'k', 'n', 'p', 'ph', 'soil_type'].sort();
    const actualKeys = fertLog ? fertLog.bodyKeys.sort() : [];
    const keysMatch = JSON.stringify(expectedKeys) === JSON.stringify(actualKeys);
    console.log(`✓ Expected JSON keys: [${expectedKeys.join(', ')}]`);
    console.log(`✓ Actual JSON keys:   [${actualKeys.join(', ')}]`);
    console.log(`✓ Keys match byte-for-byte: ${keysMatch}`);

    // Verify 4 dosage values rendered in the UI (Urea, DAP, MOP, Compost)
    await page.waitForSelector('text=/Urea/i', { timeout: 5000 });
    const hasUrea = await page.locator('text=/Urea/i').first().isVisible();
    const hasDap = await page.locator('text=/DAP/i').first().isVisible();
    const hasMop = await page.locator('text=/MOP/i').first().isVisible();
    const hasCompost = await page.locator('text=/Compost|Organic/i').first().isVisible();
    const fourDosageRendered = hasUrea && hasDap && hasMop && hasCompost;
    console.log(`✓ 4 dosage metrics rendered (Urea: ${hasUrea}, DAP: ${hasDap}, MOP: ${hasMop}, Compost: ${hasCompost}): ${fourDosageRendered}`);

    testResults.fertilizer = {
      ran: true,
      passed: keysMatch && fertRes.status() === 200 && fourDosageRendered,
      details: {
        status: fertRes.status(),
        keysMatch,
        actualKeys,
        fourDosageRendered,
      }
    };

    // -------------------------------------------------------------------------
    // TEST 4: FLOATING ASSISTANT CHAT ACROSS TWO TABS
    // -------------------------------------------------------------------------
    console.log(`\n--- TEST 4: Floating AI Assistant Chat Across Two Tabs ---`);
    
    // Tab A: Heal Your Crop (context = 'heal')
    await page.goto(`${baseUrl}/dashboard?tab=heal`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const healTabBtn = page.locator('button:has-text("Heal Your Crop")').first();
    if (await healTabBtn.isVisible()) {
      await healTabBtn.click();
      await page.waitForTimeout(400);
    }

    const chatTrigger1 = page.locator('button:has-text("Kisan AI"), button:has(svg.lucide-bot)').first();
    await chatTrigger1.click();
    await page.waitForTimeout(500);

    const chatInput1 = page.locator('input[placeholder*="Ask"], input[placeholder*="Type"]').first();
    await chatInput1.fill('How to cure blight on tomato?');

    const [chat1Req, chat1Res] = await Promise.all([
      page.waitForRequest(r => r.url().includes('/api/chat'), { timeout: 10000 }),
      page.waitForResponse(r => r.url().includes('/api/chat'), { timeout: 10000 }),
      chatInput1.press('Enter')
    ]);
    console.log(`✓ Tab 1 Chat request sent: ${chat1Req.url()} Status: ${chat1Res.status()}`);
    const chatLog1 = interceptedRequests.filter(r => r.url.includes('/api/chat')).at(-1);

    // Tab B: Fertilizer Calculator (context = 'fertilizer')
    await page.goto(`${baseUrl}/dashboard?tab=fertilizer`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const fertTabBtn2 = page.locator('button:has-text("Fertilizer Calc"), button:has-text("Fertilizer")').first();
    if (await fertTabBtn2.isVisible()) {
      await fertTabBtn2.click();
      await page.waitForTimeout(400);
    }

    const chatTrigger2 = page.locator('button:has-text("Kisan AI"), button:has(svg.lucide-bot)').first();
    if (await chatTrigger2.isVisible()) {
      await chatTrigger2.click();
      await page.waitForTimeout(500);
    }

    const chatInput2 = page.locator('input[placeholder*="Ask"], input[placeholder*="Type"]').first();
    await chatInput2.fill('What is the recommended DAP dosage?');

    const [chat2Req, chat2Res] = await Promise.all([
      page.waitForRequest(r => r.url().includes('/api/chat'), { timeout: 10000 }),
      page.waitForResponse(r => r.url().includes('/api/chat'), { timeout: 10000 }),
      chatInput2.press('Enter')
    ]);
    console.log(`✓ Tab 2 Chat request sent: ${chat2Req.url()} Status: ${chat2Res.status()}`);
    const chatLog2 = interceptedRequests.filter(r => r.url.includes('/api/chat')).at(-1);

    const expectedChatKeys = ['context', 'language', 'message'].sort();
    const chat1Keys = chatLog1 ? chatLog1.bodyKeys.sort() : [];
    const chat2Keys = chatLog2 ? chatLog2.bodyKeys.sort() : [];

    const keys1Match = JSON.stringify(expectedChatKeys) === JSON.stringify(chat1Keys);
    const keys2Match = JSON.stringify(expectedChatKeys) === JSON.stringify(chat2Keys);

    const context1 = chatLog1?.body?.context;
    const context2 = chatLog2?.body?.context;
    const contextDiffers = context1 && context2 && context1 !== context2;

    console.log(`✓ Tab 1 context: "${context1}", Tab 2 context: "${context2}" (Context Differs: ${contextDiffers})`);
    console.log(`✓ Chat body keys match [message, language, context]: ${keys1Match && keys2Match}`);

    testResults.chat = {
      ran: true,
      passed: keys1Match && keys2Match && contextDiffers,
      details: {
        context1,
        context2,
        contextDiffers,
        chat1Keys,
        chat2Keys,
      }
    };

  } catch (error) {
    console.error(`[E2E ERROR] Unhandled test error: ${error.message}`);
  } finally {
    await browser.close();
  }

  // Normalize logs for clean deterministic diffing
  const normalizedLog = interceptedRequests.map(r => ({
    url: r.url,
    method: r.method,
    contentType: r.headers['content-type'] ? r.headers['content-type'].split(';')[0].trim() : null,
    bodyKeys: r.bodyKeys || [],
    multipartFields: r.multipartFields || [],
    contextValue: r.body?.context || undefined,
    responseStatus: r.responseStatus,
  }));

  fs.writeFileSync(outputFile, JSON.stringify(normalizedLog, null, 2));
  console.log(`\n[E2E] Saved ${normalizedLog.length} intercepted requests to: ${outputFile}`);

  console.log(`\n======================================================`);
  console.log(`[E2E] FINAL SUMMARY:`);
  console.log(` - Auth Flow:              ${testResults.auth.passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(` - Heal Your Crop:         ${testResults.healCrop.passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(` - Fertilizer Calculator:  ${testResults.fertilizer.passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(` - Assistant Chat Context: ${testResults.chat.passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`======================================================\n`);

  return { testResults, normalizedLog };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const urlArg = args.find(a => a.startsWith('--url='))?.split('=')[1] || 'http://localhost:4173';
  const outArg = args.find(a => a.startsWith('--output='))?.split('=')[1] || 'scripts/requests-current.json';

  runE2E({ baseUrl: urlArg, outputFile: outArg })
    .then(({ testResults }) => {
      const allPassed = Object.values(testResults).every(t => t.passed);
      process.exit(allPassed ? 0 : 1);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { runE2E };
