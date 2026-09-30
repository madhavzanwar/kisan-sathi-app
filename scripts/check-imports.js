import fs from 'node:fs';

const files = fs.readdirSync('frontend/dist/assets');
const indexFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
if (indexFile) {
  const content = fs.readFileSync(`frontend/dist/assets/${indexFile}`, 'utf8');
  console.log(`Analyzing ${indexFile}:`);
  const lines = content.split('\n');
  lines.forEach((line) => {
    const antdImport = line.match(/import\s*\{[^}]+\}\s*from\s*["'][^"']*vendor-antd[^"']*["']/);
    if (antdImport) {
      console.log('Antd import statement:', antdImport[0]);
    }
  });
}
