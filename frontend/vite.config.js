import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const preloadLcpFontPlugin = () => ({
  name: 'preload-lcp-font',
  transformIndexHtml(html, ctx) {
    if (!ctx || !ctx.bundle) return html;
    let modified = html;

    const fontsToPreload = Object.keys(ctx.bundle).filter(
      k => (k.includes('inter-latin-700') || k.includes('instrument-serif-latin-400-italic')) && k.endsWith('.woff2')
    );
    if (fontsToPreload.length > 0) {
      const links = fontsToPreload
        .map(f => `    <link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin>`)
        .join('\n');
      modified = modified.replace(
        '<!-- Preload right-sized mobile hero poster',
        `${links}\n    <!-- Preload right-sized mobile hero poster`
      );
    }

    // Step (e): Remove render-blocking CSS by inlining the 6 KB critical CSS bundle
    const cssChunkKey = Object.keys(ctx.bundle).find(k => k.endsWith('.css'));
    if (cssChunkKey && ctx.bundle[cssChunkKey]) {
      const cssCode = ctx.bundle[cssChunkKey].source;
      modified = modified.replace(
        `<link rel="stylesheet" crossorigin href="/${cssChunkKey}">`,
        `<style>${cssCode}</style>`
      );
    }

    return modified;
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), preloadLcpFontPlugin()],
  build: {
    chunkSizeWarningLimit: 800,
  },
});
