const { execSync } = require('child_process');
const path = require('path');

const tests = [
  'test-routing-wildcard.js',
  'test-dashboard-tab-sanitization.js',
  'test-heal-crop-file-size.js',
  'test-fertilizer-boundary.js',
  'test-assistant-chat.js',
  'test-video-observer.js',
];

console.log('========================================================');
console.log('       KISANSATHI FULL BUG SWEEP TEST SUITE             ');
console.log('========================================================');

let failed = 0;
for (const test of tests) {
  const fullPath = path.resolve(__dirname, test);
  console.log(`\n▶ RUNNING: ${test}`);
  try {
    const out = execSync(`node "${fullPath}"`, { stdio: 'inherit' });
    console.log(`✔ PASSED: ${test}`);
  } catch (err) {
    console.error(`✖ FAILED: ${test}`);
    failed++;
  }
}

console.log('\n========================================================');
if (failed === 0) {
  console.log(`ALL ${tests.length} SWEEP TESTS PASSED SUCCESSFULLY!`);
  console.log('========================================================');
  process.exit(0);
} else {
  console.error(`${failed} OF ${tests.length} TESTS FAILED.`);
  console.log('========================================================');
  process.exit(1);
}
