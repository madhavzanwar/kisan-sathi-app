import fs from 'node:fs';

const files = fs.readdirSync('frontend/dist/assets');
const antdFile = files.find(f => f.startsWith('vendor-antd') && f.endsWith('.js'));
const content = fs.readFileSync('frontend/dist/assets/' + antdFile, 'utf8');

// Find the export statement
const exportMatch = content.match(/export\{([^}]+)\}/);
if (exportMatch) {
  const exports = exportMatch[1].split(',').map(s => s.trim());
  const mExp = exports.find(e => e.endsWith(' as M') || e === 'M');
  const nExp = exports.find(e => e.endsWith(' as N') || e === 'N');
  console.log('M exported as:', mExp);
  console.log('N exported as:', nExp);

  const localM = mExp.split(' as ')[0];
  const localN = nExp.split(' as ')[0];

  // Search where localM and localN are defined
  const defM = content.indexOf(`var ${localM}=`);
  console.log(`Definition of ${localM}:`, content.slice(defM, defM + 120));

  const defN = content.indexOf(`var ${localN}=`);
  console.log(`Definition of ${localN}:`, content.slice(defN, defN + 120));
}
