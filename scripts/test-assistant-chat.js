const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

(async () => {
  console.log('========================================================');
  console.log('   PLAYWRIGHT E2E: MULTILINGUAL AI ASSISTANT & VOICE   ');
  console.log('========================================================');

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const page = await browser.newPage();
  
  const interceptedRequests = [];

  // Setup network mocking for /api/chat to isolate and test UI request shape & rendering
  await page.route('**/api/chat', async (route) => {
    const req = route.request();
    const postData = JSON.parse(req.postData());
    interceptedRequests.push(postData);

    const lang = postData.language || 'en';
    let reply = `[Mock Response EN] Fertilizer plan for ${postData.message}`;
    if (lang === 'mr') {
      reply = `[Mock Response MR] ${postData.message} साठी खताचे अचूक प्रमाण.`;
    } else if (lang === 'hi') {
      reply = `[Mock Response HI] ${postData.message} के लिए उर्वरक की अनुशंसित मात्रा।`;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ response: reply }),
    });
  });

  // -------------------------------------------------------------
  // TEST 1: Multilingual message sending (EN, HI, MR)
  // -------------------------------------------------------------
  console.log('\n▶ TEST 1: Sending message in English (EN)...');
  await page.goto('http://localhost:4173/dashboard?tab=fertilizer&lang=en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const launcher = page.locator('button[aria-label="Open AI Assistant"]');
  await launcher.click();
  await page.waitForTimeout(400);

  const chatInput = page.locator('input[aria-label*="Ask about"]');
  await chatInput.fill('How much DAP for 2 acres wheat?');
  const sendBtn = page.locator('button[aria-label="Send message"]');
  await sendBtn.click();
  await page.waitForTimeout(600);

  const lastEnReq = interceptedRequests[interceptedRequests.length - 1];
  console.log('Intercepted EN Request Body:', JSON.stringify(lastEnReq));
  if (!lastEnReq || lastEnReq.language !== 'en' || lastEnReq.context !== 'fertilizer' || !lastEnReq.message) {
    console.error('FAIL: EN request payload contract mismatch!', lastEnReq);
    await browser.close();
    process.exit(1);
  }

  // Verify reply rendered in UI
  const enReplyVisible = await page.locator('text=[Mock Response EN]').isVisible();
  if (!enReplyVisible) {
    console.error('FAIL: English mock response not rendered in UI!');
    await browser.close();
    process.exit(1);
  }
  console.log('✔ PASS: English request shape & UI reply verified.');

  // -------------------------------------------------------------
  // TEST 2: Mid-chat Language Switch (EN -> MR) & System Notice
  // -------------------------------------------------------------
  console.log('\n▶ TEST 2: Switching language mid-chat (EN -> MR)...');
  
  // Trigger language change to Marathi using the Language Switcher
  const langSwitcher = page.locator('button.language-switcher-pill').first();
  await langSwitcher.click();
  await page.waitForTimeout(400);

  // Click Marathi in dropdown
  const mrMenuItem = page.locator('.ant-dropdown-menu-item').filter({ hasText: 'मराठी' });
  await mrMenuItem.click();
  await page.waitForTimeout(800);

  const currentHtmlLang = await page.getAttribute('html', 'lang');
  console.log('Current HTML lang after switch click:', currentHtmlLang);

  // Verify system line appeared
  const systemNoticeVisible = await page.getByText('भाषा बदलून मराठी केली', { exact: true }).isVisible();
  console.log('Neutral system line visible:', systemNoticeVisible);
  if (!systemNoticeVisible) {
    const chatTexts = await page.evaluate(() => Array.from(document.querySelectorAll('.animate-fade-in div')).map(e => e.innerText));
    console.log('Rendered chat text elements:', JSON.stringify(chatTexts));
    console.error('FAIL: Language changed system notice not displayed!');
    await browser.close();
    process.exit(1);
  }

  // Verify previous English message is still present (not wiped)
  const prevEnMsgVisible = await page.getByText('How much DAP for 2 acres wheat?', { exact: true }).isVisible();
  if (!prevEnMsgVisible) {
    console.error('FAIL: Previous message history was unexpectedly cleared!');
    await browser.close();
    process.exit(1);
  }
  console.log('✔ PASS: Historical messages preserved and translated system line shown.');

  // Send next message in Marathi
  console.log('\n▶ TEST 3: Sending next message in Marathi (MR)...');
  const chatInputMr = page.locator('.assistant-chat-input');
  await chatInputMr.fill('कापसासाठी कोणते खत वापरावे?');
  await page.locator('button[aria-label="संदेश पाठवा"]').click();
  await page.waitForTimeout(600);

  const lastMrReq = interceptedRequests[interceptedRequests.length - 1];
  console.log('Intercepted MR Request Body:', JSON.stringify(lastMrReq));
  if (!lastMrReq || lastMrReq.language !== 'mr' || !lastMrReq.message) {
    console.error('FAIL: MR request payload contract mismatch!', lastMrReq);
    await browser.close();
    process.exit(1);
  }
  const mrReplyVisible = await page.locator('text=[Mock Response MR]').isVisible();
  if (!mrReplyVisible) {
    console.error('FAIL: Marathi mock response not rendered in UI!');
    await browser.close();
    process.exit(1);
  }
  console.log('✔ PASS: Marathi request shape and reply verified.');

  // -------------------------------------------------------------
  // TEST 4: Sending message in Hindi (HI)
  // -------------------------------------------------------------
  console.log('\n▶ TEST 4: Switching to Hindi (HI) and sending message...');
  await langSwitcher.click();
  await page.waitForTimeout(300);
  const hiMenuItem = page.locator('.ant-dropdown-menu-item').filter({ hasText: 'हिन्दी' });
  await hiMenuItem.click();
  await page.waitForTimeout(600);

  const chatInputHi = page.locator('.assistant-chat-input');
  await chatInputHi.fill('2 एकड़ खेत में कितनी खाद लगेगी?');
  await page.locator('button[aria-label="संदेश भेजें"]').click();
  await page.waitForTimeout(600);

  const lastHiReq = interceptedRequests[interceptedRequests.length - 1];
  console.log('Intercepted HI Request Body:', JSON.stringify(lastHiReq));
  if (!lastHiReq || lastHiReq.language !== 'hi' || !lastHiReq.message) {
    console.error('FAIL: HI request payload contract mismatch!', lastHiReq);
    await browser.close();
    process.exit(1);
  }
  const hiReplyVisible = await page.locator('text=[Mock Response HI]').isVisible();
  if (!hiReplyVisible) {
    console.error('FAIL: Hindi mock response not rendered in UI!');
    await browser.close();
    process.exit(1);
  }
  console.log('✔ PASS: Hindi request shape and reply verified.');

  // -------------------------------------------------------------
  // TEST 5: SpeechRecognition unavailable (Safari/Firefox simulation)
  // -------------------------------------------------------------
  console.log('\n▶ TEST 5: Testing mic unavailable (Web Speech API disabled)...');
  const pageNoSpeech = await browser.newPage();
  await pageNoSpeech.addInitScript(() => {
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;
  });

  await pageNoSpeech.goto('http://localhost:4173/dashboard?tab=guide&lang=en', { waitUntil: 'networkidle' });
  const launcher2 = pageNoSpeech.locator('button[aria-label*="Assistant"], button[aria-label*="assistant"]').first();
  await launcher2.click();
  await pageNoSpeech.waitForTimeout(400);

  // Assert mic button is NOT rendered
  const micButton = pageNoSpeech.locator('button[aria-label*="voice input"], button[aria-label*="माइक"], button[aria-label*="माईक"]');
  const isMicPresent = await micButton.isVisible();
  if (isMicPresent) {
    console.error('FAIL: Mic button should be hidden when Web Speech API is unavailable!');
    await browser.close();
    process.exit(1);
  }
  console.log('✔ PASS: Mic gracefully hidden when SpeechRecognition is unsupported.');
  await pageNoSpeech.close();

  // -------------------------------------------------------------
  // TEST 6: Marathi voice unavailable fallback
  // -------------------------------------------------------------
  console.log('\n▶ TEST 6: Testing Marathi speech synthesis fallback (no mr voice)...');
  const pageNoMrVoice = await browser.newPage();
  await pageNoMrVoice.addInitScript(() => {
    try {
      const mockVoices = [
        { name: 'Google Hindi', lang: 'hi-IN', default: true },
        { name: 'Google US English', lang: 'en-US', default: false }
      ];
      const mockSpeech = {
        getVoices: () => mockVoices,
        speak: () => {},
        cancel: () => {},
        pause: () => {},
        resume: () => {},
        onvoiceschanged: null,
        speaking: false,
        paused: false,
        pending: false
      };
      Object.defineProperty(window, 'speechSynthesis', {
        value: mockSpeech,
        configurable: true,
        writable: true
      });
      window.SpeechSynthesisUtterance = function(text) {
        this.text = text;
        this.lang = 'en-US';
        this.voice = null;
        this.rate = 1;
        this.pitch = 1;
      };
    } catch (e) {}
  });

  await pageNoMrVoice.route('**/api/chat', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ response: 'मराठी चाचणी उत्तर' }),
    });
  });

  pageNoMrVoice.on('console', msg => console.log('[PAGE CONSOLE]', msg.text()));
  pageNoMrVoice.on('pageerror', err => console.log('[PAGE ERROR]', err));
  await pageNoMrVoice.goto('http://localhost:4173/dashboard?tab=fertilizer&lang=mr', { waitUntil: 'networkidle' });
  const launcher3 = pageNoMrVoice.locator('button[aria-label*="सहाय्यक"], button[aria-label*="Assistant"]').first();
  await launcher3.click();
  await pageNoMrVoice.waitForTimeout(400);

  const inputMrVoice = pageNoMrVoice.locator('.assistant-chat-input');
  await inputMrVoice.fill('चाचणी प्रश्न');
  await pageNoMrVoice.locator('button[aria-label="संदेश पाठवा"]').click();
  await pageNoMrVoice.waitForTimeout(600);

  // Click Listen button to trigger voice playback
  const listenBtn = pageNoMrVoice.locator('button[aria-label="मजकूर मोठ्याने ऐका"], button:has-text("ऐका")').first();
  await listenBtn.click();
  await pageNoMrVoice.waitForTimeout(600);

  const fallbackNoticeVisible = await pageNoMrVoice.locator('text=या डिव्हाइसवर मराठी आवाज उपलब्ध नाही').isVisible();
  console.log('Marathi fallback notice visible:', fallbackNoticeVisible);
  if (!fallbackNoticeVisible) {
    const bodyText = await pageNoMrVoice.evaluate(() => document.body.innerText);
    console.log('Page body text in Test 6:', bodyText);
    console.error('FAIL: Marathi voice missing fallback notice was not displayed!');
    await browser.close();
    process.exit(1);
  }
  console.log('✔ PASS: Marathi voice missing falls back to Hindi with translated notice.');
  await pageNoMrVoice.close();

  // -------------------------------------------------------------
  // TEST 7: Backend offline (translated error message & retry)
  // -------------------------------------------------------------
  console.log('\n▶ TEST 7: Testing backend offline error state...');
  const pageOffline = await browser.newPage();
  await pageOffline.route('**/api/chat', async (route) => {
    await route.abort('failed');
  });

  await pageOffline.goto('http://localhost:4173/dashboard?tab=weather&lang=hi', { waitUntil: 'networkidle' });
  const launcher4 = pageOffline.locator('button[aria-label*="सहायक"], button[aria-label*="Assistant"]').first();
  await launcher4.click();
  await pageOffline.waitForTimeout(400);

  const inputOfflineHi = pageOffline.locator('.assistant-chat-input');
  await inputOfflineHi.fill('मौसम कैसा रहेगा?');
  await pageOffline.locator('button[aria-label="संदेश भेजें"]').click();
  await pageOffline.waitForTimeout(600);

  const hiErrorVisible = await pageOffline.locator('text=सहायक सर्वर से संपर्क नहीं हो पा रहा है').isVisible();
  const retryBtnVisible = await pageOffline.locator('button:has-text("पुनः प्रयास करें")').isVisible();
  if (!hiErrorVisible || !retryBtnVisible) {
    console.error('FAIL: Translated error message or retry button not visible on offline error!');
    await browser.close();
    process.exit(1);
  }
  console.log('✔ PASS: Offline state properly renders translated error with retry button.');
  await pageOffline.close();

  console.log('\n========================================================');
  console.log('✅ ALL MULTILINGUAL & VOICE E2E TESTS PASSED SUCCESSFULLY!');
  console.log('========================================================\n');

  await browser.close();
  process.exit(0);
})();
