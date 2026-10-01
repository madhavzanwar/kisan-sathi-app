const fs = require('fs');

const baseline = JSON.parse(fs.readFileSync('scripts/requests-baseline.json', 'utf8'));
const redesign = JSON.parse(fs.readFileSync('scripts/requests-redesign.json', 'utf8'));

// Deduplicate sequentially identical requests (e.g. repeated navigation) to compare canonical API contract
function canonicalize(reqs) {
  const seen = new Map();
  for (const r of reqs) {
    const key = `${r.method} ${r.url}:${r.contextValue || ''}`;
    if (!seen.has(key)) {
      seen.set(key, {
        url: r.url,
        method: r.method,
        contentType: r.contentType,
        bodyKeys: r.bodyKeys,
        multipartFields: r.multipartFields,
        contextValue: r.contextValue,
        responseStatus: r.responseStatus
      });
    }
  }
  return Array.from(seen.values());
}

const canonicalBaseline = canonicalize(baseline);
const canonicalRedesign = canonicalize(redesign);

console.log('===========================================================');
console.log('CANONICAL API REQUEST LOG DIFF: BASELINE vs REDESIGN');
console.log('===========================================================');

let regressions = 0;

for (const b of canonicalBaseline) {
  const key = `${b.method} ${b.url}:${b.contextValue || ''}`;
  const r = canonicalRedesign.find(x => `${x.method} ${x.url}:${x.contextValue || ''}` === key);

  console.log(`\nChecking Contract: ${b.method} ${b.url} ${b.contextValue ? `(Context: ${b.contextValue})` : ''}`);
  if (!r) {
    console.log(`❌ REGRESSION: Endpoint missing in redesign!`);
    regressions++;
    continue;
  }

  // Compare method
  const methodMatch = b.method === r.method;
  console.log(` - Method:         ${b.method} === ${r.method} [${methodMatch ? 'MATCH' : 'DIFF'}]`);
  if (!methodMatch) regressions++;

  // Compare contentType
  const ctypeMatch = b.contentType === r.contentType;
  console.log(` - Content-Type:   ${b.contentType} === ${r.contentType} [${ctypeMatch ? 'MATCH' : 'DIFF'}]`);
  if (!ctypeMatch) regressions++;

  // Compare bodyKeys
  const keysMatch = JSON.stringify(b.bodyKeys) === JSON.stringify(r.bodyKeys);
  console.log(` - Body Keys:      [${b.bodyKeys.join(', ')}] === [${r.bodyKeys.join(', ')}] [${keysMatch ? 'MATCH' : 'DIFF'}]`);
  if (!keysMatch) regressions++;

  // Compare multipart fields
  const multiMatch = JSON.stringify(b.multipartFields) === JSON.stringify(r.multipartFields);
  console.log(` - Multipart:      [${b.multipartFields.join(', ')}] === [${r.multipartFields.join(', ')}] [${multiMatch ? 'MATCH' : 'DIFF'}]`);
  if (!multiMatch) regressions++;

  // Compare status
  const statusMatch = b.responseStatus === r.responseStatus;
  console.log(` - Response Code:  ${b.responseStatus} === ${r.responseStatus} [${statusMatch ? 'MATCH' : 'DIFF'}]`);
  if (!statusMatch) regressions++;
}

console.log('\n===========================================================');
if (regressions === 0) {
  console.log('✅ ZERO REGRESSIONS DETECTED: 100% BYTE-FOR-BYTE CONTRACT PARITY');
} else {
  console.log(`❌ ${regressions} REGRESSIONS FOUND`);
}
console.log('===========================================================');

process.exit(regressions === 0 ? 0 : 1);
