# Asset Registry & Video Optimization Log
> Documenting media assets, codecs, bitrates, file sizes, and licensing for Vercel deployment.

---

## 1. Video Assets (`frontend/public/videos/`)

| Asset | Format / Codec | Resolution | File Size | Audio | Bitrate | Source / License | Notes |
|---|---|---|---|---|---|---|---|
| `hero.mp4` | MP4 (H.264 / High 4.0) | 1280×712 | ~1.23 MB | Stripped (`-an`) | ~725 kb/s | CloudFront CDN / Agro production stock | Optimized with `-movflags +faststart` for progressive streaming. Target < 3 MB achieved. |
| `hero.webm` | WebM (VP9 / CRF 33) | 1280×712 | ~1.1 MB | Stripped (`-an`) | ~650 kb/s | CloudFront CDN / Agro production stock | Open standard for Chromium and Firefox. Target < 3 MB achieved. |
| `hero-poster.webp` | WebP (Quality 85) | 1280×712 | ~65 kB | N/A | Still frame | Sampled at 00:00:01 | Instant poster fallback for `prefers-reduced-motion` and `saveData` |

---

## 2. Video Compression Rules & Script

The compression automation script is located at:
[`scripts/compress-video.sh`](../scripts/compress-video.sh)

### Target Guidelines:
- **Hero Video:** under **3.0 MB** (combined total under 5 MB for MP4 + WebM).
- **Secondary Video Clips / Inline Pills:** under **1.5 MB** each.
- **Audio:** Always stripped (`-an`) as background videos are muted.
- **Resolution:** Clamped to max `1280×720` (keeps high visual density while eliminating 4K/1080p bloat).
- **Poster Frames:** High-quality `.webp` still frame generated at 0.5s–1s for instant placeholder display and reduced motion compliance.

---

## 3. Font Assets (`@fontsource`)

| Family | Weights / Styles | Format | Loading Strategy | Purpose |
|---|---|---|---|---|
| **Inter** | 400, 500, 600, 700 | WOFF2, WOFF | Self-hosted (`font-display: swap`) | Clean modern sans-serif body, UI, buttons, and section titles |
| **Instrument Serif** | 400 Italic | WOFF2, WOFF | Self-hosted (`font-display: swap`) | Editorial serif italic accents ("Generations", "That Deliver Real Results", "Questions") |
| **Cormorant Garamond** | 400 Italic, 600 Italic | WOFF2, WOFF | Self-hosted (`font-display: swap`) | Secondary display serif italic option |

---

## 4. Vercel Bandwidth & Performance Compliance

- ✅ Total production JavaScript bundle (gzipped): ~188 kB (including React 19, Ant Design v6, Framer Motion, and Lenis).
- ✅ Total production CSS bundle (gzipped): ~3.5 kB.
- ✅ Video assets serve as static assets from Vite `public/videos/`.
- ✅ IntersectionObserver pauses playback whenever videos scroll outside the viewport.
- ✅ Autoplay is strictly limited to 1 primary video at any time.

---

## 5. Truthful Stats & Pre-Launch Review Checklist

- ⚠️ **Hero Bottom Bar Stat (`src/content/landing.js`)**:
  - The hero social proof pill uses verified machine learning data (`38 Disease Classes` and `6 Guided Crops`).
  - Any user count metric is clearly flagged: `isPlaceholder: true` with notice **"replace before launch"** once live analytics are aggregated. No fake "10k+ farmers" or fabricated reviews are rendered.

