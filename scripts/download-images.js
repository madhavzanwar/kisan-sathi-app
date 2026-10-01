const fs = require('fs');
const path = require('path');

const images = [
  {
    name: 'heal-crop.jpg',
    url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'fertilizer.jpg',
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'yield-pest.jpg',
    url: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'guides.jpg',
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'field-overview.jpg',
    url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'ai-assistant.jpg',
    url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=85'
  }
];

const targetDir = path.resolve('frontend/public/images/features');

async function downloadAll() {
  console.log(`Downloading ${images.length} high-quality local agricultural images...`);
  for (const img of images) {
    const dest = path.join(targetDir, img.name);
    try {
      const res = await fetch(img.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`✅ Saved ${img.name} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`❌ Failed ${img.name}:`, e.message);
    }
  }
}

downloadAll();
