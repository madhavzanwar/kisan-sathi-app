# Design Tokens — KisanSathi Redesign
> Source: pixel-sampled from 864×612 reference frames. Confidence: HIGH / medium / low per value.
> Scale factor to 1440px: ×1.667

---

## 1. Color Tokens (Pixel-Sampled)

### Color Samples Table

| Token Name | Hex Value | Confidence | Sampled From (file, x, y) | Usage |
|---|---|---|---|---|
| `color-bg-page` | `#F5F5F5` | HIGH | img09 x=432 y=300 (FAQ frame bg) | Page background for white sections |
| `color-bg-white` | `#FFFFFF` | HIGH | img09 x=432 y=300 (pure white areas) | Testimonial bg, white section bg |
| `color-bg-faq-row` | `#F5F5F5` | HIGH | img09 x=432 y=228 (FAQ row scan) | FAQ accordion rows (closed) |
| `color-bg-acc-open` | `#F3F3F3` | HIGH | img02 x=220 y=378 (open accordion row) | Open accordion row bg |
| `color-bg-acc-closed` | `#FFFFFF` | HIGH | img02 x=220 y=244 | Closed accordion row bg |
| `color-accent-lime` | `#C6FA44` | HIGH | img02 most_saturated y=363-395 x=52-90 | Accordion icon tile fill |
| `color-accent-lime-hero` | `#CAF744` | medium | img00 most_saturated hero scan | Hero CTA button bg (video overlay distorts) |
| `color-green-dark` | `#1A6628` | HIGH | img11 most_saturated CTA pill | CTA button bg, FAQ minus button bg |
| `color-green-minus-btn` | `#116522` | HIGH | img10 darkest pixel y=282-314 x=668-700 | Open FAQ minus button |
| `color-green-eyebrow` | `#07801A` | HIGH | img09 darkest pixel y=48-58 x=410-430 | Eyebrow dot color |
| `color-green-eyebrow-dark` | `#294E36` | HIGH | img02 darkest pixel y=15-25 x=52-62 | Alternative darker eyebrow dot |
| `color-ink-primary` | `#000000` | HIGH | img02 darkest in text region, img09 FAQ text | Headings, FAQ questions |
| `color-ink-heading` | `#000300` | HIGH | img11 CTA heading scan | Dark near-black ink for H2s |
| `color-ink-muted` | `#454744` | HIGH | img06 carousel desc text region | Body copy muted |
| `color-ink-muted-light` | `#9CA3AF` | medium | visual estimate from statement para | Muted text in scroll reveal |
| `color-bg-testimonial-card` | `#EDF2F1` | medium | visual estimate img07 | Testimonial card background |
| `color-bg-carousel` | `#F4F4F4` | HIGH | img06 x=400 y=2 | Carousel/solutions section bg |
| `color-star-amber` | `#F59E0B` | medium | visual estimate | Star rating |
| `color-white` | `#FFFFFF` | HIGH | Multiple sources | Pure white |

### Dashboard / App Colors (from existing codebase — DO NOT CHANGE)
These are used in PROTECTED files and must carry over:

| Token | Hex | Usage |
|---|---|---|
| `color-emerald-primary` | `#059669` | Existing app primary (FloatingAssistant FAB, send button) |
| `color-red-danger` | `#ef4444` | Error states, mic active |
| `color-slate-dark` | `#0f172a` | Dashboard overlay text |

---

## 2. Typography Tokens

| Token | Value | Confidence | Notes |
|---|---|---|---|
| `font-display` | `'Cormorant Garamond', Georgia, serif` | HIGH | Used for italic words (Generations, That Deliver Real Results, etc.) — already in codebase |
| `font-sans` | `'Inter', system-ui, sans-serif` | HIGH | All body, UI, sans headings — already in codebase |
| `font-size-hero-h1` | `~96px` (1440) / `~58px` (864) | medium | Hero main heading |
| `font-size-h2-section` | `~53px` (1440) / `~32px` (864) | medium | Section headings |
| `font-size-body-lg` | `~22px` (1440) / `~13px` (864) | medium | Section body/description copy |
| `font-size-body-sm` | `~18px` (1440) / `~11px` (864) | medium | Eyebrow tags, captions |
| `font-size-tab-title` | `~20px` (1440) / `~12px` (864) | low | Tab card titles |
| `font-size-faq-question` | `~23px` (1440) / `~14px` (864) | medium | FAQ row question text |
| `font-size-faq-answer` | `~18px` (1440) / `~11px` (864) | medium | FAQ answer body |
| `font-weight-heading` | `700` | HIGH | All sans-serif headings |
| `font-weight-body` | `400` | HIGH | Body copy |
| `font-weight-name` | `600` | medium | Testimonial names |
| `letter-spacing-heading` | `~-0.02em` | medium | Tight tracking on headings |

---

## 3. Spacing Scale

| Token | px (1440px layout) | Source px (864) | Notes |
|---|---|---|---|
| `space-section-y` | `~80px` | `~48px` | Top/bottom padding per section |
| `space-section-gap` | `~64px` | `~38px` | Gap between heading and content |
| `space-faq-row-gap` | `~8px` | `~5px` | Gap between closed FAQ rows |
| `space-faq-row-height` | `~87px` | `~52px` | Each FAQ row height (closed) |
| `space-acc-row-height` | `~73px` | `~44px` | Accordion row height (closed) |
| `space-acc-icon-tile` | `~53px` | `~32px` | Icon tile width/height |
| `space-card-gap` | `~24px` | `~14px` | Gap between cards |
| `space-carousel-card-w` | `~380px` | `~228px` | Carousel card width |
| `space-carousel-card-h` | `~567px` | `~340px` | Carousel card height |
| `space-testimonial-card-w` | `~933px` | `~560px` | Testimonial card width |
| `space-container-max` | `1200px` | — | Max content width |
| `space-container-px` | `48px` | — | Container horizontal padding |
| `space-navbar-h` | `~60px` | `~36px` | Navbar height |

---

## 4. Border Radius Scale

| Token | Value | Confidence | Usage |
|---|---|---|---|
| `radius-pill` | `100px` | HIGH | CTA buttons, navbar pill, hero CTAs |
| `radius-card-lg` | `~16px` | medium | Carousel image cards, feature image, field image panel |
| `radius-card-md` | `~12px` | medium | Testimonial cards, weather glass card |
| `radius-faq-row` | `~10px` | medium | FAQ rows, accordion rows |
| `radius-icon-tile` | `~8px` | medium | Accordion icon tiles |
| `radius-minus-btn` | `~6px` | medium | FAQ open minus button square |
| `radius-inline-pill` | `~24px` | medium | Inline video pill in statement |
| `radius-tab-card` | `~10px` | medium | How-it-works tab cards |
| `radius-glass-chip` | `~100px` | medium | Location chip at image bottom |

---

## 5. Shadow Tokens

| Token | Value | Confidence | Usage |
|---|---|---|---|
| `shadow-card` | `0 4px 16px rgba(0,0,0,0.08)` | medium | FAQ rows, accordion rows |
| `shadow-glass-card` | `0 8px 32px rgba(0,0,0,0.12)` | medium | Weather card, AI card |
| `shadow-navbar` | `0 2px 12px rgba(0,0,0,0.06)` | medium | Floating navbar |
| `shadow-cta-btn` | `0 4px 20px rgba(26,102,40,0.25)` | medium | Dark green CTA button |

---

## 6. Ant Design Theme Token Object (ready to paste)

```js
// frontend/src/theme/antdTheme.js
import { theme } from 'antd';

export const kisanSathiTheme = {
  algorithm: theme.defaultAlgorithm, // light mode
  token: {
    // Brand Colors
    colorPrimary: '#1A6628',          // dark green — CTA buttons, primary actions
    colorSuccess: '#07801A',          // eyebrow dots, positive states
    colorWarning: '#F59E0B',          // star ratings, amber warnings
    colorError: '#ef4444',            // error states (existing app)
    colorInfo: '#059669',             // existing app emerald (chat, FAB)

    // Background
    colorBgBase: '#FFFFFF',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#F5F5F5',
    colorBgSpotlight: '#F3F3F3',

    // Text
    colorText: '#000000',
    colorTextSecondary: '#454744',
    colorTextTertiary: '#9CA3AF',
    colorTextQuaternary: '#BCBCBC',

    // Border
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#F0F0F0',

    // Typography
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontSize: 16,
    fontSizeHeading1: 56,
    fontSizeHeading2: 40,
    fontSizeHeading3: 28,
    fontSizeHeading4: 20,
    fontSizeLG: 18,
    fontSizeSM: 14,
    fontSizeXL: 22,

    // Radius
    borderRadius: 10,
    borderRadiusLG: 16,
    borderRadiusSM: 6,
    borderRadiusXS: 4,

    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingXL: 32,
    margin: 16,
    marginLG: 24,
    marginXL: 32,

    // Shadows
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    boxShadowSecondary: '0 2px 8px rgba(0,0,0,0.06)',

    // Motion
    motionDurationMid: '0.3s',
    motionDurationSlow: '0.5s',
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  components: {
    // Override individual component tokens
    Button: {
      colorPrimary: '#1A6628',
      borderRadiusLG: 100, // pill shape
      fontWeight: 600,
      controlHeight: 44,
      controlHeightLG: 52,
    },
    Collapse: {
      colorBgContainer: '#FFFFFF',
      headerBg: '#FFFFFF',
      contentBg: '#F3F3F3',
      borderRadiusLG: 10,
    },
    Tabs: {
      itemColor: '#454744',
      itemSelectedColor: '#000000',
      inkBarColor: '#1A6628',
    },
    FloatButton: {
      colorPrimary: '#059669',  // keep existing emerald for FAB
    },
  },
};
```

---

## 7. CSS Custom Properties Block (ready to paste into index.css)

```css
/* ============================================
   KisanSathi Design Tokens
   Extracted from Agrovia reference frames
   ============================================ */
:root {
  /* === Brand Colors === */
  --color-green-dark:        #1A6628;   /* CTA buttons */
  --color-green-minus:       #116522;   /* FAQ open minus button */
  --color-green-eyebrow:     #07801A;   /* Eyebrow dot */
  --color-lime-accent:       #C6FA44;   /* Accordion icon tile, hero CTA */
  --color-lime-hero:         #CAF744;   /* Hero pill CTA */

  /* === Existing App Brand (keep for dashboard) === */
  --color-emerald:           #059669;   /* FloatingAssistant, FAB */
  --color-emerald-dark:      #047857;
  --color-red-danger:        #ef4444;

  /* === Page Backgrounds === */
  --bg-page:                 #F5F5F5;   /* Light sections bg */
  --bg-white:                #FFFFFF;
  --bg-faq-row:              #F5F5F5;   /* FAQ/Accordion closed rows */
  --bg-acc-open:             #F3F3F3;   /* Accordion open row */
  --bg-carousel:             #F4F4F4;
  --bg-testimonial-card:     #EDF2F1;

  /* === Text === */
  --text-ink:                #000000;   /* Headings, FAQ questions */
  --text-muted:              #454744;   /* Body descriptions */
  --text-muted-light:        #9CA3AF;   /* Statement scroll-reveal muted words */
  --text-placeholder:        #BCBCBC;

  /* === Typography === */
  --font-sans:               'Inter', system-ui, -apple-system, sans-serif;
  --font-display:            'Cormorant Garamond', Georgia, serif;

  /* --- Font Sizes (desktop 1440px) --- */
  --fs-hero-h1:              clamp(48px, 6vw, 96px);
  --fs-section-h2:           clamp(32px, 3.5vw, 53px);
  --fs-body-lg:              clamp(16px, 1.5vw, 22px);
  --fs-body-sm:              clamp(13px, 1vw, 18px);
  --fs-eyebrow:              14px;
  --fs-faq-question:         clamp(15px, 1.2vw, 18px);
  --fs-tab-title:            15px;

  /* === Border Radius === */
  --radius-pill:             100px;
  --radius-card-lg:          16px;
  --radius-card-md:          12px;
  --radius-faq-row:          10px;
  --radius-icon-tile:        8px;
  --radius-minus-btn:        6px;
  --radius-glass-chip:       100px;

  /* === Spacing === */
  --section-py:              80px;
  --section-gap:             64px;
  --container-max:           1200px;
  --container-px:            48px;
  --faq-row-gap:             8px;
  --card-gap:                24px;

  /* === Shadows === */
  --shadow-card:             0 4px 16px rgba(0,0,0,0.08);
  --shadow-glass:            0 8px 32px rgba(0,0,0,0.12);
  --shadow-navbar:           0 2px 12px rgba(0,0,0,0.06);
  --shadow-btn-green:        0 4px 20px rgba(26,102,40,0.25);

  /* === Motion === */
  --ease-out-expo:           cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:             cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast:           0.2s;
  --duration-mid:            0.4s;
  --duration-slow:           0.6s;
  --duration-reveal:         0.8s;
}
```

---

## 8. Confidence Summary

| Category | Confidence | Notes |
|---|---|---|
| FAQ section colors | HIGH | Clean white frames, pixel-sampled directly |
| FAQ minus button color | HIGH | #116522 from darkest pixel in region |
| CTA button color | HIGH | #1A6628 from most_saturated pixel |
| Accordion lime tile | HIGH | #C6FA44 from most_saturated pixel |
| Eyebrow dot colors | HIGH | #07801A from FAQ frame darkest pixel |
| Page bg colors | HIGH | Multiple frame confirmation |
| Hero H1 white color | medium | Video overlay introduces color cast |
| Lime hero CTA exact hex | medium | Video frame compression affects hue |
| Font family names | HIGH | Cormorant Garamond confirmed in codebase; Inter used throughout |
| Font sizes (px) | medium | Measured from compressed 864px source |
| Border radii | medium | Estimated from visual corner analysis |
| Testimonial card bg | medium | Estimated from visual |
| Spacing values | medium | Measured from pixel positions, not design file |
