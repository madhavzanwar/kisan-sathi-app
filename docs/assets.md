# Asset Registry, Licensing & Media Optimization Log

> Complete registry of media assets, codecs, bitrates, file sizes, sources, and licenses for KisanSathi.

---

## 1. Video & Poster Assets (`frontend/public/videos/`)

| Asset | Format / Codec | Resolution | File Size | Audio | Source URL | License |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `hero.mp4` | MP4 (H.264 / High 4.0) | 1280×712 | 1.23 MB | Stripped (`-an`) | Pexels Stock Video (ID: 3192003 / Golden Wheat Field) | Free to use (Pexels License / CC0) |
| `hero.webm` | WebM (VP9 / CRF 33) | 1280×712 | 1.10 MB | Stripped (`-an`) | Pexels Stock Video (ID: 3192003 / Golden Wheat Field) | Free to use (Pexels License / CC0) |
| `hero-poster.webp` | WebP (Quality 85) | 1280×712 | 65.2 kB | N/A | Generated from `hero.mp4` at 00:00:01 | Free to use (Pexels License / CC0) |
| `hero-poster-mobile.webp` | WebP (Quality 80) | 640×356 | 32.4 kB | N/A | Optimized downscaled mobile poster | Free to use (Pexels License / CC0) |

- **Compression Rules**: Maximum resolution clamped to 1280×720; audio stripped; `faststart` enabled for progressive playback; target size < 3.0 MB met (1.23 MB).
- **Reduced Motion & Data Saver**: Serves static WebP posters immediately without streaming video when `prefers-reduced-motion` or `Save-Data` is detected.

---

## 2. Feature Visuals (`frontend/public/images/features/`)

All feature photography is locally hosted under `frontend/public/images/features/` with no external CDN dependency:

| Asset | Description | Resolution | Size | Source URL | License |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `heal-crop.jpg` | Close-up leaf pathology diagnosis | 1200×800 | 185 kB | [Unsplash Photo 1530836369250](https://unsplash.com/photos/1530836369250) | Unsplash Free License |
| `fertilizer.jpg` | Agricultural soil test & fertilizer application | 1200×800 | 192 kB | [Unsplash Photo 1464226184884](https://unsplash.com/photos/1464226184884) | Unsplash Free License |
| `yield-pest.jpg` | Drone & satellite crop health inspection | 1200×699 | 164 kB | [Unsplash Photo 1628352081506](https://unsplash.com/photos/1628352081506) | Unsplash Free License |
| `guides.jpg` | Wheat farm lifecycle cultivation | 1200×800 | 178 kB | [Unsplash Photo 1500937386664](https://unsplash.com/photos/1500937386664) | Unsplash Free License |
| `field-overview.jpg` | Wide agricultural field landscape | 1200×800 | 195 kB | [Unsplash Photo 1592982537447](https://unsplash.com/photos/1592982537447) | Unsplash Free License |
| `ai-assistant.jpg` | Agronomist inspecting crop field with telemetry | 1200×800 | 170 kB | [Unsplash Photo 1595974482597](https://unsplash.com/photos/1595974482597) | Unsplash Free License |

---

## 3. Crop Showcase Imagery (`frontend/public/images/crops/`)

| Asset | Crop Variety | Resolution | Size | Source URL | License |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tomato.jpg` | Tomato (*Solanum lycopersicum*) | 800×1200 | 142 kB | [Unsplash Photo 1592841200221](https://unsplash.com/photos/1592841200221) | Unsplash Free License |
| `cotton.jpg` | Cotton (*Gossypium hirsutum*) | 800×1197 | 138 kB | [Unsplash Photo 1606041008023](https://unsplash.com/photos/1606041008023) | Unsplash Free License |
| `wheat.jpg` | Wheat (*Triticum aestivum*) | 800×533 | 110 kB | [Unsplash Photo 1500937386664](https://unsplash.com/photos/1500937386664) | Unsplash Free License |
| `rice.jpg` | Rice Paddy (*Oryza sativa*) | 800×531 | 98 kB | [Unsplash Photo 1536657464919](https://unsplash.com/photos/1536657464919) | Unsplash Free License |
| `sugarcane.jpg` | Sugarcane (*Saccharum officinarum*) | 800×1067 | 155 kB | [Unsplash Photo 1596704017254](https://unsplash.com/photos/1596704017254) | Unsplash Free License |
| `maize.jpg` | Maize Corn (*Zea mays*) | 800×533 | 105 kB | [Unsplash Photo 1551754655](https://unsplash.com/photos/1551754655) | Unsplash Free License |

---

## 4. Farmer Persona Avatars (`frontend/public/images/avatars/`)

| Asset | Persona Description | Resolution | Size | Source URL | License |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `farmer1.jpg` | Tomato Cultivator (Nashik Scenario) | 200×300 | 22 kB | [Unsplash Photo 1507003211169](https://unsplash.com/photos/1507003211169) | Unsplash Free License |
| `farmer2.jpg` | Cotton Grower (Rajkot Scenario) | 200×300 | 24 kB | [Unsplash Photo 1500648767791](https://unsplash.com/photos/1500648767791) | Unsplash Free License |
| `farmer3.jpg` | Wheat Grower (Ludhiana Scenario) | 200×133 | 18 kB | [Unsplash Photo 1472099645785](https://unsplash.com/photos/1472099645785) | Unsplash Free License |

---

## 5. Brand Logos & Trademark Confirmation

- **No Third-Party Commercial Brand Logos**: No unauthorized corporate trademarks (e.g. John Deere, Chase, Kubota, Mahindra) are present on the website or in image assets.
- **Frameworks & Open Standards**: The credibility strip displays truthful open-source/framework labels (PyTorch, Google Gemini, FastAPI, Scikit-Learn, Copernicus) formatted purely as styled typography wordmarks, not proprietary logo graphics.
- **Brand Identity**: The KisanSathi logo (`frontend/public/favicon.svg` and navbar icon) is an original vector leaf glyph released under the project's MIT open-source license.
