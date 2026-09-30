# Build Plan — KisanSathi UI Redesign
> Synthesized from: `ui-audit.md` · `visual-spec.md` · `design-tokens.md` · `motion-spec.md` · `screen-mapping.md`
>
> ⚠️ **Approval required on `docs/screen-mapping.md` before Step 1 begins.**
> Do not touch `backend/`. Do not modify PROTECTED files (API calls, fetch helpers, FormData, speech API, context logic).

---

## Build Order Overview

```
Step 0  Foundation        — Install deps, tokens, reset CSS, theme provider
Step 1  Navbar            — Floating glass pill navbar
Step 2  Hero              — Full-bleed video hero + CTAs + bottom bar
Step 3  Powered-By Strip  — Tech logos row
Step 4  Statement         — Scroll-reveal paragraph
Step 5  Features Accordion — 4 real features + side image
Step 6  How It Works       — 4 tab cards + image panel + glass cards
Step 7  Crops Carousel     — 6 crop cards, staggered
Step 8  Scenarios          — 3 scenario cards (honest, labelled)
Step 9  FAQ               — 5 questions, collapse/expand
Step 10 Final CTA          — Field image + centered CTA
Step 11 Footer            — Minimal footer
Step 12 Dashboard Restyle  — Shell (header, tabs, drawer)
Step 13 Tool Pages Restyle — HealCrop, FertilizerCalc, CultivationGuide, Weather, Yield
Step 14 FloatingAssistant  — FAB + chat window restyle
Step 15 Performance Pass   — Lazy loading, remove dead code, optimize
```

**One git commit per step.** Branch: `ui-redesign` (already created).

---

## Step 0 — Foundation

### Files to CREATE
- `frontend/src/theme/antdTheme.js` — Ant Design token object (from `design-tokens.md`)
- `frontend/src/styles/tokens.css` — CSS custom properties (from `design-tokens.md`)
- `frontend/src/styles/animations.css` — All `@keyframes` extracted from existing files (fadeIn, scan, pulse-ring, pulse-red, spin)
- `frontend/src/styles/reset.css` — Minimal reset that does NOT override Ant Design

### Files to EDIT
- `frontend/package.json` — Add: `antd`, `@ant-design/icons`, `framer-motion`
- `frontend/index.html` — Remove Google Fonts CDN link (switch to `@font-face` local or keep CDN, just add `font-display: swap`)
- `frontend/src/main.jsx` — Wrap app with `<ConfigProvider theme={kisanSathiTheme}>` from Ant Design
- `frontend/src/index.css` — Replace global resets with new token-safe version. Keep `:root` variables. Remove `body { color: #fff }` override. Remove `h1-h6` font-weight override. Remove all inline `@keyframes` (moved to animations.css).
- `frontend/src/App.css` — **DELETE contents** (Vite boilerplate, confirmed unused)

### Files that MUST NOT BE TOUCHED
- `frontend/src/pages/Auth.jsx` — all fetch logic, localStorage, navigate
- `frontend/src/components/FloatingAssistant.jsx` — all speech API, chat fetch
- `frontend/src/tabs/HealCrop.jsx` — FormData, fetch, step state
- `frontend/src/tabs/FertilizerCalc.jsx` — fetch, payload mapping
- `frontend/src/tabs/WeatherIrrigation.jsx` — fetch, GPS
- `frontend/src/tabs/YieldPestForecaster.jsx` — fetch, GPS, fallback generator, useEffect
- `backend/` — ALL backend files, zero exceptions

### Verification Check
```
cd frontend && npm install && npm run build
# Expected: zero errors, bundle < 500kB gzip (antd tree-shaken)
# Open: nothing to open yet — no visual change
```

---

## Step 1 — Navbar

### Files to CREATE
- `frontend/src/components/Navbar.jsx` — Glass pill navbar component

### Files to EDIT
- `frontend/src/pages/Auth.jsx` — Add `<Navbar />` above the existing JSX. **Do not change any logic below it.**
- `frontend/src/App.jsx` — Import and render `<Navbar />` inside `BrowserRouter` but outside routes (renders on both pages)

### Spec (from `visual-spec.md` Section 1)
```
- position: fixed, top: 16px, left: 50%, transform: translateX(-50%)
- Width: ~90vw, max-width: 1200px
- Height: ~56px
- Background: rgba(255,255,255,0.7), backdrop-filter: blur(20px)
- Border: 1px solid rgba(255,255,255,0.3)
- Border-radius: 100px (pill)
- Box-shadow: 0 2px 12px rgba(0,0,0,0.06)
- z-index: 1000
- Content: [leaf icon + KisanSathi] [Features | How It Works | Tools | FAQ] [Get Started]
- Active link: solid white pill bg, dark text
- "Get Started" → opens Auth drawer (or navigates to /)
- Mobile: [logo] [Get Started] [≡ hamburger → Ant Design Drawer]
```

### Files that MUST NOT BE TOUCHED
All PROTECTED files. `Auth.jsx` only gets `<Navbar />` added at TOP of JSX return, nothing else changes.

### Verification Check
```
npm run dev → open http://localhost:5173
✓ Glass pill navbar visible, floating, does not obscure content
✓ On /dashboard: same navbar shows
✓ npm run build → zero errors
✓ No change to auth form behavior
```

---

## Step 2 — Hero Section

### Files to CREATE
- `frontend/src/sections/HeroSection.jsx` — Full hero section component
- `frontend/src/styles/hero.css` — Hero-specific styles

### Files to EDIT
- `frontend/src/pages/Auth.jsx` — Replace the existing hero markup ONLY (logo + "Get Started" div) with `<HeroSection onGetStarted={...} />`. Keep all `handleSubmit`, `fetch`, `useState`, `useNavigate` logic. The `<HeroSection>` component will call `onGetStarted()` prop when the "Get Started" CTA is clicked.
- `frontend/src/App.jsx` — Remove the inline `<VideoBackground />` component entirely (it was a dead duplicate; the real one used to be in App.jsx but now VideoBackground is scoped to HeroSection only).

### Spec (from `visual-spec.md` Section 2)
```
- Full viewport height (100vh)
- Background: <video autoPlay loop muted playsInline> with CloudFront URL (PROTECTED — do not change the URL)
- H1: "AI-Powered Crop Intelligence" / "for Every [Cormorant italic] Farmer"
- Body: "Diagnose diseases, optimize fertilizer, and forecast yields..."
- CTA 1: Ant Design <Button> with custom lime bg (#C6FA44), dark text, shape="round", size="large"
- CTA 2: Ghost pill, white border, white text
- Bottom bar: SCROLL ↓  |  (no fake stats — removed per screen-mapping.md approval)
```

### Files that MUST NOT BE TOUCHED
`Auth.jsx` logic block. The `onGetStarted` prop in HeroSection simply calls the existing `setShowPanel(true)` state setter from Auth.

### Verification Check
```
npm run dev → open http://localhost:5173
✓ Hero video visible full-bleed
✓ H1 serif/italic "Farmer" renders with Cormorant Garamond
✓ Lime CTA button visible
✓ Clicking CTA opens login panel (existing behavior)
✓ /dashboard: video gone, dashboard loads normally
✓ Network: video still fetching from same CloudFront URL
✓ npm run build → zero errors
```

---

## Step 3 — Powered-By Strip

### Files to CREATE
- `frontend/src/sections/PoweredByStrip.jsx`

### Files to EDIT
- `frontend/src/pages/Auth.jsx` — Add `<PoweredByStrip />` after `<HeroSection />`

### Spec
```
- White/off-white bg (#F8F8F8)
- "Powered by:" text left
- Logos/wordmarks right: PyTorch, Google Gemini, Scikit-Learn, Vercel, FastAPI
- Horizontal flex, vertically centered, height ~60px
- No fake brand logos
```

### Verification Check
```
npm run dev → scroll below hero
✓ Strip shows 5 real tech logos/names
✓ No layout shift
```

---

## Step 4 — Statement Paragraph (Scroll Reveal)

### Files to CREATE
- `frontend/src/sections/StatementSection.jsx`
- Uses `framer-motion` for word-by-word scroll reveal

### Files to EDIT
- `frontend/src/pages/Auth.jsx` — Add `<StatementSection />` below strip

### Spec (from `motion-spec.md` Section 1)
```
- Bg: #F5F5F5
- Eyebrow: green dot (#07801A) + "KisanSathi"
- Paragraph split into <motion.span> per word
- framer-motion useScroll + useTransform → color: #9CA3AF → #000000 per word
- Inline video pill: 48×28px, border-radius 24px, video of farming (or static image)
```

### Files that MUST NOT BE TOUCHED
All PROTECTED files.

### Verification Check
```
npm run dev → slow scroll through statement section
✓ Words animate dark as they scroll into view
✓ Inline pill visible
✓ No jank (check DevTools Performance)
```

---

## Step 5 — Features Accordion

### Files to CREATE
- `frontend/src/sections/FeaturesAccordion.jsx`

### Files to EDIT
- `frontend/src/pages/Auth.jsx` — Add `<FeaturesAccordion />`

### Spec (from `visual-spec.md` Section 5, `screen-mapping.md` Section 4.5)
```
- 2-col layout: left 47% accordion, right 47% image
- Eyebrow, H2 "Four Tools, One [italic] Platform."
- Ant Design <Collapse> with custom expandIcon:
  - Active: lime tile (#C6FA44, 32×32px, radius 8px) with feature icon, "—" dash right
  - Inactive: gray tile, "+" right
- 4 rows with REAL KisanSathi feature content (from screen-mapping.md Section 4.5)
- Right image: large portrait, border-radius 16px
- Open row bg: #F3F3F3
- Closed row bg: #FFFFFF
- Blur-in entrance with framer-motion whileInView
```

### Files that MUST NOT BE TOUCHED
All PROTECTED files. This section links to the Dashboard but does not contain any API calls.

### Verification Check
```
npm run dev
✓ All 4 accordion rows open/close correctly
✓ Lime tile appears on active row
✓ Right image swaps (if implementing crossfade) OR stays static
✓ Blur-in entrance fires on scroll
```

---

## Step 6 — How It Works Tabs + Glass Cards

### Files to CREATE
- `frontend/src/sections/HowItWorks.jsx`

### Files to EDIT
- `frontend/src/pages/Auth.jsx` — Add `<HowItWorks />`

### Spec (from `visual-spec.md` Section 6, `screen-mapping.md` Section 4.6)
```
- 4 custom tab cards (NOT Ant Design Tabs bar — custom divs)
- Tab 1: Disease Detection, Tab 2: Fertilizer Calc, Tab 3: Weather & Soil, Tab 4: Yield Forecast
- Large image panel: real dashboard screenshot OR crop field photo
- Bottom-left: glass location chip (white pill, blur)
- Bottom-right: 
  1. Weather card: Ant Design <Card>, 24°C, Humidity/Precip/Wind stats
  2. AI prediction card: gradient progress bar, Ant Design <Progress type="line">
```

### Files that MUST NOT BE TOUCHED
All PROTECTED files. This section is purely presentational — no real API calls.

### Verification Check
```
npm run dev
✓ 4 tab cards switch active state on click
✓ Glass cards visible on image
✓ Blur-in entrance on scroll
```

---

## Step 7 — Crops Carousel

### Files to CREATE
- `frontend/src/sections/CropsCarousel.jsx`

### Files to EDIT
- `frontend/src/pages/Auth.jsx` — Add `<CropsCarousel />`

### Spec (from `visual-spec.md` Section 7, `screen-mapping.md` Section 4.7)
```
- 6 portrait cards: Tomato, Cotton, Wheat, Rice, Sugarcane, Maize
- Staggered vertical offsets: even-index cards higher by 32px
- Each card: CSS background-image (Unsplash or crop photos), border-radius 16px
- Title + description below card
- Click card → navigate to /dashboard and set activeTab='guide'
  (requires passing setActiveTab via URL params or state — PROTECTED file concern)
  ALTERNATIVE: just navigate('/dashboard') without tab selection
- NO Ant Design carousel — pure CSS overflow-x:scroll + scroll-snap
```

### Verification Check
```
npm run dev
✓ 6 crop cards visible, overflow scrollable
✓ Staggered heights visible
✓ Click on card navigates to /dashboard
```

---

## Step 8 — Scenarios Section

### Files to CREATE
- `frontend/src/sections/ScenariosSection.jsx`

### Files to EDIT
- `frontend/src/pages/Auth.jsx` — Add `<ScenariosSection />`

### Spec (from `screen-mapping.md` Section 4.8)
```
- Eyebrow: "• How Farmers Use It"
- H2: "Real Workflows, [italic] Real Results."
- Label: "Sample Scenario" chip on each card — clearly NOT a real testimonial
- 3 cards matching testimonial card layout from visual-spec.md Section 8
- Quote icon, scenario text, name, location, "→ Used: [Feature Name]"
- Brand strip below: "Heal Your Crop · Fertilizer Calc · Yield Forecaster · Cultivation Guides"
- Prev/next arrows navigate between scenarios (same Ant Design <Button shape="circle">)
```

### Verification Check
```
npm run dev
✓ "Sample Scenario" label visible on all cards
✓ No real testimonials or fake statistics
✓ Arrow navigation works
```

---

## Step 9 — FAQ

### Files to CREATE
- `frontend/src/sections/FAQSection.jsx`

### Files to EDIT
- `frontend/src/pages/Auth.jsx` — Add `<FAQSection />`

### Spec (from `visual-spec.md` Section 9, `screen-mapping.md` Section 4.9)
```
- Centered layout, max-width 700px
- Eyebrow centered, H2 centered: "Common Farmer [Cormorant italic] Questions"
- Ant Design <Collapse> — one item open at a time
- Custom expandIcon:
  - Closed: thin '+' (Ant Design <PlusOutlined /> darkened)
  - Open: dark green square (#116522, 24×24px, radius 6px, white <MinusOutlined />)
- Row bg: #F5F5F5, border-radius 10px
- Open row: same bg, question bold, answer text normal → muted
- 5 Q&As from screen-mapping.md Section 4.9
- Blur-in entrance on scroll
```

### Verification Check
```
npm run dev
✓ FAQ rows open/close correctly
✓ Green square minus button appears on open row
✓ Centered layout on all screen sizes
✓ Blur-in on scroll
```

---

## Step 10 — Final CTA

### Files to CREATE
- `frontend/src/sections/FinalCTA.jsx`

### Files to EDIT
- `frontend/src/pages/Auth.jsx` — Add `<FinalCTA />`

### Spec (from `visual-spec.md` Section 10, `screen-mapping.md` Section 4.10)
```
- White fading to field image (CSS gradient overlay on background-image)
- Centered H2: "Start farming smarter," / italic "one crop at a time."
- Body copy centered
- Single Ant Design <Button type="primary" shape="round" size="large"> 
  "Open the Dashboard →" → navigate('/dashboard')
- Pill bg: #1A6628
```

### Verification Check
```
npm run dev
✓ White fade visible above field photo
✓ Button navigates to /dashboard
```

---

## Step 11 — Footer

### Files to CREATE
- `frontend/src/components/Footer.jsx`

### Files to EDIT
- `frontend/src/pages/Auth.jsx` — Add `<Footer />` at bottom

### Spec
```
- Dark bg (#0f172a) or same white as CTA
- "© 2026 KisanSathi — Built with PyTorch · Gemini · FastAPI"
- GitHub icon link
- Backend status chip (green "Backend Online" if possible, else remove)
```

---

## Step 12 — Dashboard Shell Restyle

### Files to EDIT
- `frontend/src/pages/Dashboard.jsx` — **RESTYLE ONLY.** Keep all `useState`, `renderTabContent()` switch, `tabs` array, `activeTab` prop passed to FloatingAssistant.
  - Replace header `<div>` with Ant Design `<Layout.Header>`
  - Replace hamburger + drawer with Ant Design `<Drawer>`
  - Replace hand-coded tab bar with Ant Design `<Segmented>` or custom card tabs matching the "How It Works" style

### Files that MUST NOT BE TOUCHED
`FloatingAssistant.jsx` (ALL logic). `HealCrop.jsx`, `FertilizerCalc.jsx`, `WeatherIrrigation.jsx`, `YieldPestForecaster.jsx`, `CultivationGuide.jsx` — all unchanged in this step.

### Verification Check
```
npm run dev → navigate to /dashboard
✓ Dashboard renders with 5 tabs
✓ Tab switching still works (activeTab state)
✓ FloatingAssistant still appears and is clickable
✓ Logout button still works (window.location.href = '/')
✓ Test real API: POST /api/predict/disease — confirm FormData still works
```

---

## Step 13 — Tool Pages Restyle

Do ONE tool at a time, each as a sub-commit:

### 13a — HealCrop.jsx
- KEEP: `handleImageUpload`, `fetch`, FormData (key `file`), `step` state
- RESTYLE: Upload zone → `<Upload.Dragger>`. Step indicator → `<Steps>`. Results → `<Card>` with severity `<Tag>`. Scanning → `<Spin>` + animated border.
- EXTRACT: `@keyframes scan` → `animations.css`
- FIX: `URL.revokeObjectURL` cleanup in `useEffect`
- FIX: Remove unused `Upload` import (lint warning)

### 13b — FertilizerCalc.jsx
- KEEP: `handleCalculate`, fetch, all payload mapping
- RESTYLE: Form → `<Form>` + `<Slider>` + `<Select>`. Results → `<Statistic>` cards.
- FIX: Remove unused `error`/`setError` (lint warning)

### 13c — CultivationGuide.jsx
- KEEP: `CROP_GUIDE_DATA`, `crops`, `selectedCrop`, `expandedStage`, `getIcon()`
- RESTYLE: Crop selector → `<Segmented>`. Accordion → `<Collapse>`.
- DO NOT touch the 400-line data object

### 13d — WeatherIrrigation.jsx
- KEEP: `handleDetectLocation`, fetch, GPS logic, fallback data
- RESTYLE: Button → `<Button icon={<EnvironmentOutlined />}>`. Metrics → `<Row>/<Col>` with `<Statistic>`. Alert → `<Alert type="warning" | "success">`.
- FIX: Remove unused `error`/`setError` (lint warning)

### 13e — YieldPestForecaster.jsx
- KEEP: Everything in the logic layer (`fetchForecast`, `generateFallbackForecast`, GPS, `useEffect` auto-fetch)
- RESTYLE ONLY: Config panel → `<Form>`. Metric cards → `<Card>` + `<Statistic>`. Progress → `<Progress>`.

### Verification Check for Each Tool
```
Open tool tab in dashboard
✓ Tool renders without errors
✓ Make a real API call:
  - HealCrop: upload a leaf image → POST /api/predict/disease → result shows
  - FertilizerCalc: fill form → POST /api/predict/fertilizer → result shows  
  - Weather: click detect → GET /api/weather → weather shows (or fallback)
  - Yield: auto-fetches on open → result shows (or fallback)
  - Guide: select crop → accordion opens → HTML renders
✓ Network tab: same request format as baseline (FormData file field, JSON payloads identical)
```

---

## Step 14 — FloatingAssistant Restyle

### Files to EDIT
- `frontend/src/components/FloatingAssistant.jsx`

### What to Change (VISUAL ONLY)
- KEEP: ALL logic — `handleSendMessage`, `speakText`, `toggleListen`, `clearHistory`, `SpeechRecognition` useEffect, `messagesEndRef`, all fetch calls
- RESTYLE: FAB button → Ant Design `<FloatButton>` with custom `icon` and CSS pulse ring
- RESTYLE: Chat window → styled `<Card>` or custom panel positioned bottom-right, Ant Design `<List>` for message bubbles
- EXTRACT: `@keyframes pulse-ring`, `@keyframes pulse-red`, `@keyframes spin` → `animations.css`
- FIX: Align `role: 'assistant'` inconsistency in initial message → change to `sender: 'bot'` (visual fix only, does not change API behavior)

### Files that MUST NOT BE TOUCHED
ALL logic in `FloatingAssistant.jsx`. Only markup and className props change.

### Verification Check
```
Click FAB → chat window opens
✓ Send a message → POST /api/chat with {message, language, context}
✓ Response renders in chat bubble
✓ Voice button works (if browser supports SpeechRecognition)
✓ Context chips change per active tab
```

---

## Step 15 — Performance Pass

### Changes
- Add `React.lazy` + `<Suspense>` for all 5 tab components in `Dashboard.jsx`
- Add `loading="lazy"` to all `<img>` tags added in steps 3-11
- Move `<VideoBackground>` from global `App.jsx` to scoped inside `HeroSection.jsx` (already done in Step 2, confirm)
- Verify no global `backdrop-filter` layers stack (max 2 simultaneous in new design)
- Run `npm run build` and compare bundle sizes
- Run `npm run lint` and fix all remaining oxlint warnings

### Verification Check
```
npm run build
✓ Bundle size ≤ 450kB gzip (target with antd tree-shaken)
npm run lint
✓ Zero warnings
Lighthouse (Chrome DevTools)
✓ Performance score ≥ 70
✓ LCP < 4s on 4G throttle
```

---

## Fidelity Checklist (30 Items)

> Use this to grade the finished result. Pass/fail each item.

| # | Item | Section | Source Frame |
|---|---|---|---|
| 1 | Navbar is a floating pill shape with `border-radius: 100px` | Navbar | 00 |
| 2 | Navbar has frosted glass background (blur + translucent) | Navbar | 00 |
| 3 | Active nav link has a solid white pill background inside the navbar | Navbar | 00 |
| 4 | "Get Started" CTA in navbar is a white pill button | Navbar | 00 |
| 5 | Hero H1 line 2 ends with italic Cormorant Garamond word "Farmer" | Hero | 00 |
| 6 | Hero has at least one lime-green pill CTA button | Hero | 00 |
| 7 | Hero has one ghost/outline pill CTA button | Hero | 00 |
| 8 | "SCROLL ↓" label appears at bottom-left of hero section | Hero | 00 |
| 9 | Tech strip shows real logos: PyTorch, Gemini, Scikit-Learn, Vercel, FastAPI | Strip | — |
| 10 | Statement paragraph has `background: #F5F5F5` or similar off-white | Statement | 01 |
| 11 | Statement paragraph words animate from muted gray to dark ink on scroll | Statement | 01 |
| 12 | Eyebrow tags use green dot + small caps text (e.g. "• Our Features") | Multiple | 00, 02, 09 |
| 13 | Features accordion section H2 has italic Cormorant Garamond second line | Accordion | 02 |
| 14 | Active accordion row has lime (#C6FA44) icon tile with plant/feature icon | Accordion | 02 |
| 15 | Open accordion row has `background: #F3F3F3` (light gray) | Accordion | 02 |
| 16 | Inactive accordion rows show `+` icon, active row shows `—` dash | Accordion | 02 |
| 17 | How It Works section has 4 tab cards in a horizontal row | Tabs | 03, 04 |
| 18 | Active tab card has white background, others have light gray (#F4F4F4) | Tabs | 04 |
| 19 | Large field image below tabs has at least one floating glass card | Tabs | 04 |
| 20 | Crops carousel has portrait-orientation cards with border-radius ~16px | Carousel | 06 |
| 21 | Carousel cards have staggered vertical offsets (alternating high/low) | Carousel | 06 |
| 22 | Scenarios section cards are clearly labelled "Sample Scenario" | Scenarios | — |
| 23 | FAQ section is center-aligned, max-width container | FAQ | 09 |
| 24 | FAQ H2 last word is italic Cormorant Garamond "Questions" | FAQ | 09 |
| 25 | Closed FAQ rows: light gray bg (#F5F5F5), thin `+` icon right | FAQ | 09 |
| 26 | Open FAQ row: dark green square button (#116522) with white `−` | FAQ | 10 |
| 27 | CTA section has dark green pill button (#1A6628) with white text | CTA | 11 |
| 28 | CTA section fades from white into a full-width field photograph | CTA | 11 |
| 29 | FloatingAssistant FAB remains functional (sends real API request) | FAB | — |
| 30 | Disease detection upload still uses `FormData` with field name `file` | HealCrop | — |

---

## Risk List & Mitigations

| Risk | Severity | Files Affected | Mitigation |
|---|---|---|---|
| **Ant Design global CSS overrides existing `body { color: #fff }`** | 🔴 Critical | `index.css` | In Step 0: remove `body { color }` from `index.css`. Use Ant Design `ConfigProvider` to set `colorText`. White text only in scoped hero/dashboard classes. |
| **`* { margin: 0; padding: 0 }` breaks Ant Design spacing** | 🔴 Critical | `index.css` | Replace with `*, *::before, *::after { box-sizing: border-box }` only. Let Ant Design set its own margin/padding. |
| **`h1-h6 { font-weight: 600 }` overrides Ant Design Typography** | 🟡 High | `index.css` | Remove global `h1-h6` rule. Apply font-weight only via scoped `.section-heading` class. |
| **Ant Design bundle size explosion (unoptimized)** | 🟡 High | `package.json`, `vite.config.js` | Enable Vite tree-shaking (default). Import components individually: `import { Button } from 'antd'` not `import antd from 'antd'`. |
| **React 19 compatibility with Ant Design** | 🟡 High | `package.json` | Use `antd@5.x` (compatible with React 18+). If issues arise, install `antd@latest --legacy-peer-deps`. |
| **FloatingAssistant inline `@keyframes` injection order conflict** | 🟡 High | `FloatingAssistant.jsx` | In Step 14: extract all 4 `@keyframes` to `animations.css`. Remove all `<style>` tags from JSX. Ant Design StyleProvider will no longer conflict. |
| **ChatBot `role` vs `sender` key mismatch** | 🟠 Medium | `FloatingAssistant.jsx` | Fix in Step 14 (visual only): change initial message from `role: 'assistant'` to `sender: 'bot'`. No API change. |
| **FormData field name `file` must not change** | 🔴 Critical | `HealCrop.jsx`, `/api/predict/disease` | Step 13a: verify `formData.append('file', ...)` is untouched. Add to verification check. |
| **YieldPestForecaster auto-fetches on mount** | 🟠 Medium | `YieldPestForecaster.jsx` | Do not change the `useEffect([], [])` — intentional behavior. Just restyle the output JSX. |
| **`URL.createObjectURL` memory leak** | 🟢 Low | `HealCrop.jsx` | Fix in Step 13a: add `useEffect(() => () => URL.revokeObjectURL(selectedImage), [selectedImage])`. |
| **Undefined CSS variables (`--primary-dark`, `--primary-light`, `--accent`)** | 🟠 Medium | `FertilizerCalc.jsx`, `WeatherIrrigation.jsx`, `CultivationGuide.jsx`, `Auth.jsx` | In Step 0: define these in `tokens.css` as: `--primary-dark: #145220`, `--primary-light: #4CAF50`, `--accent: #C6FA44`. |
| **Google Fonts CDN blocking render** | 🟢 Low | `index.html` | Add `&display=swap` to both font URLs. |
| **Dashboard hover bug (`!activeTab === tab.id` always false)** | 🟢 Low | `Dashboard.jsx` | Fix in Step 12: change to `activeTab !== tab.id` as intended. |
| **Auth token never sent in API calls** | 🟢 Low | All tab files | Out of scope for visual redesign. Document as known gap. |
| **CultivationGuide `!selectedCrop === crop` hover bug** | 🟢 Low | `CultivationGuide.jsx` | Fix in Step 13c: `selectedCrop !== crop`. |
| **Video background iOS Safari** | 🟠 Medium | `HeroSection.jsx` | Add `playsinline webkit-playsinline` attrs. Add a `poster` static image fallback. |
| **Multiple simultaneous `backdrop-filter` layers (perf)** | 🟠 Medium | New components | In new design: max 2 blur layers visible simultaneously (navbar + one glass card). No full-page blur layers in dashboard. |

---

## Git Commit Message Template

```
git commit -m "step-N: [Section Name] — [one-line description]

- Files created: [list]
- Files edited: [list]  
- PROTECTED files touched: NONE
- API payload verified: [endpoint + key field confirmed]
- Build: clean ✓ | Lint: 0 warnings ✓
- Fidelity items tested: [e.g. #1, #2, #3]"
```

---

## Pre-Build Approval Checklist

- [ ] `docs/screen-mapping.md` — all copy approved
- [ ] Navbar links and "Get Started" action approved
- [ ] Scenarios section copy approved (clearly labelled, honest)
- [ ] FAQ answers approved (accurate?)
- [ ] CTA action "Open the Dashboard →" approved (or change to login modal?)
- [ ] Crops carousel: clicking a crop card → navigate('/dashboard') (no specific tab preselection) — approved?
- [ ] Ant Design confirmed (not another component library)
- [ ] `framer-motion` confirmed for scroll animations

**⬆ Awaiting your approval before Step 1 begins.**
