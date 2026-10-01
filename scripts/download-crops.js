const fs = require('fs');
const path = require('path');

const crops = [
  { name: 'tomato.jpg', url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80' },
  { name: 'cotton.jpg', url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80' },
  { name: 'wheat.jpg', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80' },
  { name: 'rice.jpg', url: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80' },
  { name: 'sugarcane.jpg', url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80' },
  { name: 'maize.jpg', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80' },
];

const targetDir = path.resolve('frontend/public/images/crops');

async function downloadCrops() {
  for (const c of crops) {
    const dest = path.join(targetDir, c.name);
    try {
      const res = await fetch(c.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`✅ Saved ${c.name} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`❌ Failed ${c.name}:`, e.message);
    }
  }
}

downloadCrops();
