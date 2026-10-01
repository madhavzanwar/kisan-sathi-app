const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

async function testHealCropFileSizeLimit() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();
  let apiCalled = false;
  page.on('request', (req) => {
    if (req.url().includes('/api/predict/disease')) {
      apiCalled = true;
    }
  });

  await page.goto('http://localhost:4173/dashboard?tab=heal', { waitUntil: 'networkidle' });

  // Create a 16MB oversized dummy image file
  const oversizedFile = path.resolve(__dirname, 'temp_oversized_leaf.jpg');
  const buffer16MB = Buffer.alloc(16 * 1024 * 1024);
  fs.writeFileSync(oversizedFile, buffer16MB);

  console.log('Uploading 16 MB oversized file...');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles(oversizedFile);

  await page.waitForTimeout(600);

  const errorAlert = await page.$('.ant-alert-error');
  const alertText = errorAlert ? await errorAlert.innerText() : '';

  console.log('API called after 16MB file upload:', apiCalled);
  console.log('Alert shown:', Boolean(errorAlert));
  console.log('Alert text:', alertText.replace(/\n/g, ' '));

  if (fs.existsSync(oversizedFile)) fs.unlinkSync(oversizedFile);
  await browser.close();

  const isRejected = !apiCalled && errorAlert && alertText.includes('exceeds the 15 MB limit');

  if (isRejected) {
    console.log('✅ PASS: Oversized file rejected before API call with user-friendly alert.');
    process.exit(0);
  } else {
    console.error('❌ FAIL: File size validation failed.');
    process.exit(1);
  }
}

testHealCropFileSizeLimit().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
