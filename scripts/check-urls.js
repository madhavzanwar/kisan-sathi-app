const fs = require('fs');
const content = fs.readFileSync('frontend/src/content/landing.js', 'utf8');
const urls = [...content.matchAll(/https?:\/\/[^'\"\s]+/g)].map(m => m[0]);
console.log('Total URLs found in landing.js:', urls.length);

async function run() {
  for (const u of urls) {
    try {
      const res = await fetch(u);
      console.log(res.status === 200 ? '✅ 200' : '❌ ' + res.status, u);
    } catch (e) {
      console.log('❌ ERR: ' + e.message, u);
    }
  }
}
run();
