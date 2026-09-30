# KisanSathi UI Redesign — Visual Specification Document
> **Target Desktop Canvas:** 1440px width (Source Reference: 864×612 px video frames, Scale Factor: ×1.67)  
> **Design Theme:** Agrovia / Cultiva Legacy Agricultural System  
> **Component Library:** Ant Design (v5+) + Custom CSS Token Overrides  
> **Confidence Notation:** Values marked **[HIGH]** are confirmed via direct Python pixel sampling / OCR scan; values marked **[MEDIUM]** or prefixed with **~** are visually estimated or sampled through translucent overlays.

---

## Table of Contents
1. [Scale Factor & Methodology](#1-scale-factor--methodology)
2. [Master Color Palette & Pixel Sample Register](#2-master-color-palette--pixel-sample-register)
3. [Layout Grid & Text Scan Measurements](#3-layout-grid--text-scan-measurements)
4. [Global Typography Specification](#4-global-typography-specification)
5. [Ant Design Global Token Theme (ConfigProvider)](#5-ant-design-global-token-theme-configprovider)
6. [Section-by-Section Visual Specifications](#6-section-by-section-visual-specifications)
   - [Section 1: Floating Glass Navbar](#section-1-floating-glass-navbar)
   - [Section 2: Hero Section (Video Background)](#section-2-hero-section-video-background)
   - [Section 3: Trusted By Strip](#section-3-trusted-by-strip)
   - [Section 4: Statement Paragraph with Scroll-Reveal & Inline Video Pill](#section-4-statement-paragraph-with-scroll-reveal--inline-video-pill)
   - [Section 5: Features Accordion & Hero Image](#section-5-features-accordion--hero-image)
   - [Section 6: How It Works (Tabs & Floating Glass Cards)](#section-6-how-it-works-tabs--floating-glass-cards)
   - [Section 7: Solutions Carousel (Staggered Portrait Cards)](#section-7-solutions-carousel-staggered-portrait-cards)
   - [Section 8: Testimonials Carousel & Brand Strip](#section-8-testimonials-carousel--brand-strip)
   - [Section 9: FAQ Accordion](#section-9-faq-accordion)
   - [Section 10: Final CTA Field Section](#section-10-final-cta-field-section)
   - [Section 11: Footer](#section-11-footer)
7. [Comprehensive Ant Design Component Mapping Matrix](#7-comprehensive-ant-design-component-mapping-matrix)

---

## 1. Scale Factor & Methodology

All measurements in this specification originate from the 14 reference screen-recording frames captured at **864 × 612 px**.

$$\text{Scale Factor} = \frac{1440\text{ px}}{864\text{ px}} \approx 1.6667\text{ (reported as }\times1.67\text{)}$$

- **Dimensions:** Displayed as `source px` $\rightarrow$ `~scaled 1440px desktop`.
- **Measurements:** All measurements include the `~` prefix to signify scaled/interpolated dimensions.
- **Evidence Base:** Grounded in keyframes `00` through `13` and 1fps motion sequences `s_01.png`–`s_33.png`.

---

## 2. Master Color Palette & Pixel Sample Register

The palette below combines pixel-exact samples from Python image analysis with semantic role assignments:

| Token / Role | Hex Code | Confidence | Source Location & Notes | Frame Evidence |
|---|---|---|---|---|
| **Page Neutral Bg** | `#F5F5F5` / `#F4F4F4` | **[HIGH]** | Carousel, statement, and FAQ background | Frames 01, 05, 06, 09 |
| **Pure White** | `#FFFFFF` | **[HIGH]** | Testimonials section bg, accordion closed rows, active tab | Frames 00, 02, 03, 07 |
| **Accordion Active Row Bg** | `#F3F3F3` | **[HIGH]** | Expanded accordion row container background | Frame 02 |
| **Accordion Active Lime Tile** | `#C6FA44` | **[HIGH]** | Primary active lime icon tile (`most_saturated`) | Frame 02 |
| **FAQ Eyebrow Green Dot** | `#07801A` | **[HIGH]** | Darkest pixel in eyebrow bullet dot | Frame 09 |
| **FAQ Closed Row Bg** | `#F5F5F5` | **[HIGH]** | Closed accordion card background | Frame 09 |
| **FAQ Plus Icon** | `#000000` | **[HIGH]** | Darkest pixel on collapsed plus glyph | Frame 09 |
| **FAQ Open Minus Button** | `#116522` | **[HIGH]** | Dark green square action button (`darkest_pixel`) | Frame 10 |
| **Primary CTA Button Pill** | `#1A6628` | **[HIGH]** | Final CTA "Contact Us" pill button (`most_saturated`) | Frame 11 |
| **Dark Ink Text / Headings** | `#000000` / `#000300` | **[HIGH]** | H2 headlines, accordion titles, FAQ titles | Frames 02, 06, 09, 11 |
| **Muted Text / Descriptions** | `#454744` | **[HIGH]** | Carousel descriptions, unrevealed statement text | Frames 01, 06 |
| **Statement Eyebrow Dot** | `#294E36` | **[HIGH]** | Cultiva legacy dark green bullet | Frame 00, 01 |
| **Hero H1 Text Overlay** | `#0C3606` | **[MEDIUM]** | Dark green tint over video backdrop | Frame 00 |
| **Navbar Active Pill** | `#CAF744` | **[MEDIUM]** | Semi-translucent lime pill over hero video | Frame 00 |
| **Testimonial Card Bg** | `#EDF2F1` | **[MEDIUM]** | Pale sage-tinted card background | Frame 07 |
| **Statement Bg Transition** | `#F4F4F4`–`#F6F6F6` | **[HIGH]** | Statement container gradient canvas | Frame 00, 01 |
| **Rating Star Amber** | `#F59E0B` | **[MEDIUM]** | Hero rating star glyph | Frame 00 |
| **Glass Card Border** | `rgba(255,255,255,0.4)` | **[MEDIUM]** | Floating weather & Dhaka location chips | Frame 04 |

---

## 3. Layout Grid & Text Scan Measurements

Precise Y-coordinate scanning on source frames confirms the vertical pacing and rhythm:

### FAQ Row Text Vertical Scan (Frame 09)
- **Scanned Y-Positions:**
  - Row 1: $y = 224\text{ px}$
  - Row 2: $y = 288\text{ px}$ ($\Delta y = 64\text{ px}$)
  - Row 3: $y = 358\text{ px}$ ($\Delta y = 70\text{ px}$)
  - Row 4: $y = 421\text{ px}$ ($\Delta y = 63\text{ px}$)
  - Row 5: $y = 483\text{ px}$ ($\Delta y = 62\text{ px}$)
- **Row Spacing Metric:** $\sim 64\text{–}70\text{ px}$ at 864px source $\longrightarrow$ **$\sim 107\text{–}117\text{ px}$ at 1440px desktop** (inclusive of $\sim 8\text{ px}$ source / $\sim 13\text{ px}$ scaled gap).

### Solutions Carousel Text Scan (Frame 06)
- **Title baseline:** $y \approx 474\text{ px}$
- **Description baseline:** $y \approx 495\text{ px}$
- **Title-to-Description Vertical Gap:** $\sim 21\text{ px}$ source $\longrightarrow$ **$\sim 35\text{ px}$ at 1440px desktop**.

---

## 4. Global Typography Specification

The design utilizes a sophisticated pairing of a modern geometric/humanist sans-serif for UI elements and a high-contrast editorial serif with italic display accents for emotive headlines:

- **Primary UI Sans Font Stack:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Editorial Serif Font Stack:** `Cormorant Garamond, "Playfair Display", Georgia, serif`

### Typographic Scale
| Role | Source Size (864px) | Target Desktop (1440px) | Weight / Style | Line Height |
|---|---|---|---|---|
| **Hero H1 (Line 1 Sans)** | $\sim 58\text{ px}$ | **$\sim 96\text{ px}$** | 700 Bold Sans | $\sim 1.05$ |
| **Hero H1 (Line 2 Serif Italic)** | $\sim 58\text{ px}$ | **$\sim 96\text{ px}$** | 400 Italic Serif | $\sim 1.05$ |
| **Section H2 (Line 1 Sans)** | $\sim 32\text{ px}$ | **$\sim 53\text{ px}$** | 700 Bold Sans | $\sim 1.15$ |
| **Section H2 (Line 2 Serif Italic)**| $\sim 32\text{ px}$ | **$\sim 53\text{ px}$** | 400 Italic Serif | $\sim 1.15$ |
| **Statement Paragraph** | $\sim 28\text{ px}$ | **$\sim 46\text{ px}$** | 400 Regular Sans | $\sim 1.35$ |
| **Section Right Body Lead** | $\sim 13\text{ px}$ | **$\sim 22\text{ px}$** | 400 Regular Sans | $\sim 1.50$ |
| **Card Title (Carousel/Tabs)** | $\sim 14\text{ px}$ | **$\sim 24\text{ px}$** | 600 SemiBold Sans | $\sim 1.30$ |
| **Card Body / Description** | $\sim 12\text{ px}$ | **$\sim 20\text{ px}$** | 400 Regular Sans | $\sim 1.45$ |
| **Eyebrow Tag** | $\sim 11\text{ px}$ | **$\sim 18\text{ px}$** | 500 Medium Sans | $\sim 1.20$ |
| **FAQ Question Text** | $\sim 14\text{ px}$ | **$\sim 24\text{ px}$** | 500 Med / 700 Bold Open | $\sim 1.30$ |
| **Button / Nav Label** | $\sim 13\text{ px}$ | **$\sim 22\text{ px}$** | 500 Medium Sans | $\sim 1.00$ |

---

## 5. Ant Design Global Token Theme (ConfigProvider)

To support this aesthetic within Ant Design v5+, configure the following `theme` tokens in `ConfigProvider`:

```jsx
import { ConfigProvider, theme } from 'antd';

export const agroviaTheme = {
  token: {
    colorPrimary: '#1A6628',        // Confirmed primary CTA dark green
    colorSuccess: '#C6FA44',        // Confirmed active lime green
    colorInfo: '#07801A',           // Confirmed eyebrow green dot
    colorTextBase: '#000000',       // Confirmed dark ink
    colorBgBase: '#FFFFFF',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderRadius: 12,               // Default UI element radius
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 100,            // Full pill buttons
      controlHeight: 48,
      fontWeight: 500,
      defaultBorderColor: 'rgba(0,0,0,0.15)',
    },
    Collapse: {
      contentBg: '#F3F3F3',
      headerBg: '#FFFFFF',
      borderRadiusLG: 10,
    },
    Tabs: {
      cardBg: '#F4F4F4',
      itemSelectedColor: '#000000',
      itemColor: '#454744',
    },
    Card: {
      borderRadiusLG: 16,
    },
  },
};
```

---

## 6. Section-by-Section Visual Specifications

### Section 1: Floating Glass Navbar
- **Frames Used as Evidence:** Frame 00
- **Visual Description:** A floating, full-width glass pill navbar anchored at the top of the hero viewport. Centers navigation links with an active white pill highlight; left holds brand logo with green leaf; right holds action button.
- **Layout & Dimensions:**
  - Container width: $\sim 92\%\text{–}95\%$ viewport width (max $\sim 1360\text{ px}$ at 1440px)
  - Height: $\sim 36\text{ px}$ source $\longrightarrow$ **$\sim 60\text{ px}$ at 1440px**
  - Margin top: $\sim 16\text{ px}$ source $\longrightarrow$ **$\sim 26\text{ px}$ at 1440px**
  - Border radius: **$\sim 100\text{ px}$ (Pill shape)**
- **Background & Styling:**
  - Background: `rgba(255, 255, 255, 0.25)` frosted glass with `backdrop-filter: blur(16px)`
  - Border: $1\text{ px}$ solid `rgba(255, 255, 255, 0.4)`
- **Elements:**
  - **Logo (Left):** Green leaf icon (`#4CAF50` / `#07801A`) + bold wordmark "Agrovia" in dark ink.
  - **Nav Links (Center):** "Home", "About Us", "Solutions", "Investors", "Success Story".
  - **Active State:** "Home" encapsulated in solid white `#FFFFFF` pill with dark ink `#000000` text, box shadow `0 2px 8px rgba(0,0,0,0.08)`.
  - **Inactive Items:** Semi-transparent dark/white text ($\sim 80\%$ opacity), hover transition to $100\%$.
  - **CTA Button (Right):** "Contact Us" white solid pill button with subtle $1\text{ px}$ border `rgba(0,0,0,0.1)`.
  - **Mobile Breakpoint:** Collapses center links; displays Leaf Logo + "Contact Us" pill + Hamburger icon (`MenuOutlined`).
- **Ant Design Mapping:**
  - Outer: Custom `<div>` wrapper with CSS backdrop filter.
  - Links: Ant Design `<Menu mode="horizontal" selectable selectedKeys={['home']} />` with transparent background.
  - CTA: Ant Design `<Button type="default" shape="round">Contact Us</Button>`.

---

### Section 2: Hero Section (Video Background)
- **Frames Used as Evidence:** Frames 00, 13
- **Visual Description:** Full-bleed, $100\text{vh}$ cinematic hero section showcasing a looping wheat field video. Rich blue sky at top transitioning to vibrant green stalks. A localized dark-green translucent gradient overlay at the lower-left ensures crisp contrast for display typography.
- **Layout & Dimensions:**
  - Width: $100\text{vw}$ full-bleed
  - Height: $100\text{vh}$ ($\sim 612\text{ px}$ source $\longrightarrow$ **$\sim 900\text{–}1020\text{ px}$ desktop**)
  - Content block: Lower-left pinned, width $\sim 45\%\text{–}50\%$ ($\sim 390\text{ px}$ source $\longrightarrow$ **$\sim 650\text{ px}$ at 1440px**)
  - Offset: Content top margin $\sim 55\%$ of viewport height
- **Background & Overlay:**
  - Background: Full-width looping HTML5 `<video autoPlay loop muted playsInline>` (confirmed in Frame 13).
  - Overlay: Radial/linear gradient `linear-gradient(135deg, rgba(12, 54, 6, 0.65) 0%, rgba(0, 0, 0, 0.35) 60%, transparent 100%)` **[MEDIUM]**.
- **Typography & Elements:**
  - **H1 Heading:**
    - Line 1: "Smart Farming for" — 700 Bold Sans-Serif, `#FFFFFF` **[HIGH]**, $\sim 58\text{ px}$ source $\longrightarrow$ **$\sim 96\text{ px}$ at 1440px**.
    - Line 2: "Future " + *Generations* — "Generations" in 400 Italic Display Serif (Cormorant Garamond), `#FFFFFF`.
  - **Body Copy:** $\sim 13\text{ px}$ source $\longrightarrow$ **$\sim 22\text{ px}$ at 1440px**, `#FFFFFF` at $\sim 65\%$ opacity.
  - **Action Pill Buttons (Two Inline):**
    - Button 1 (Primary): "Start Investing ↗" — Background: Lime Green `#C6FA44` / `#CAF744` **[HIGH]**, Text: Dark Ink `#000000`, Height: $\sim 38\text{ px}$ source $\longrightarrow$ **$\sim 52\text{ px}$ at 1440px**, Border-radius: $100\text{ px}$.
    - Button 2 (Secondary): "Meet the Farmers" — Ghost pill with $1.5\text{ px}$ white border `rgba(255,255,255,0.85)`, Text: `#FFFFFF`, Border-radius: $100\text{ px}$.
  - **Bottom Bar (Anchored at Viewport Base):**
    - Separator: $1\text{ px}$ thin line `rgba(255, 255, 255, 0.25)`.
    - Left: "SCROLL ↓" — small-caps sans-serif, letter-spacing $2\text{ px}$, `#FFFFFF`.
    - Right: Rating Pill — `★ 4.9` (Amber `#F59E0B`), overlapping avatar group (3 avatars, $28\text{ px}$ dia), "10k+ Farmers" bold text.
- **Ant Design Mapping:**
  - Avatars: `<Avatar.Group maxCount={3} size="small"><Avatar src="..." />...</Avatar.Group>`.
  - Buttons: `<Button type="primary" shape="round" style={{ background: '#C6FA44', color: '#000' }}>Start Investing ↗</Button>` and `<Button ghost shape="round">Meet the Farmers</Button>`.

---

### Section 3: Trusted By Strip
- **Frames Used as Evidence:** Frame 00
- **Visual Description:** Clean, understated social proof strip sitting directly below the hero fold. Features an institutional header on the left and monochrome corporate logos on the right.
- **Layout & Dimensions:**
  - Width: $100\%$ full-width
  - Height: $\sim 60\text{ px}$ source $\longrightarrow$ **$\sim 100\text{ px}$ at 1440px**
  - Padding: Horizontal $\sim 50\text{ px}$ source $\longrightarrow$ **$\sim 80\text{ px}$ at 1440px**
  - Background: Off-white `#F8F8F8` to pure `#FFFFFF` **[HIGH]**
- **Elements:**
  - **Left Header:** "Trusted by **thousand** companies in the world" — dark gray-green ink `#294E36`, $\sim 11\text{ px}$ source $\longrightarrow$ **$\sim 18\text{ px}$ at 1440px**, "thousand" in 700 bold weight.
  - **Brand Logos (Right Flex Row):** CHASE ◎, JOHN DEERE, ≋ Leader', Kubota, GLEANER.
  - Logo Styling: Dark gray fill (`#454744` / `#6B7280`), $\sim 28\text{ px}$ height, evenly distributed with $\sim 36\text{ px}$ gap.
- **Ant Design Mapping:**
  - Layout: `<Row justify="space-between" align="middle">`.
  - Typography: `<Typography.Text>`.

---

### Section 4: Statement Paragraph with Scroll-Reveal & Inline Video Pill
- **Frames Used as Evidence:** Frames 00, 01
- **Visual Description:** Minimalist, editorial statement section. As the user scrolls, each word of the expansive paragraph transitions dynamically from muted low-opacity gray to high-contrast dark ink. Embedded seamlessly between words is a miniature pill-shaped looping video of a farmer.
- **Layout & Dimensions:**
  - Width: Max container $\sim 800\text{ px}$ source $\longrightarrow$ **$\sim 1140\text{ px}$ at 1440px**, centered.
  - Vertical Padding: $\sim 60\text{ px}$ source $\longrightarrow$ **$\sim 100\text{ px}$ top/bottom at 1440px**.
  - Background: `#F4F4F4`–`#F6F6F6` neutral canvas **[HIGH]**.
- **Elements:**
  - **Eyebrow Tag:** "• Cultiva Legacy" — Green dot bullet `#294E36` **[HIGH]**, font size $\sim 11\text{ px}$ source $\longrightarrow$ **$\sim 18\text{ px}$ at 1440px**, uppercase tracking.
  - **Statement Paragraph:**
    - Font size: $\sim 28\text{ px}$ source $\longrightarrow$ **$\sim 46\text{ px}$ at 1440px**, weight 450, line-height 1.35.
    - Reveal state (Frame 01): Active words in `#1A1A1A` / `#000000` **[HIGH]**; unrevealed pending words in muted gray `#9CA3AF` / `#A1A8A3`.
    - Text Copy: *"Our platform is built to support farmers, agribusinesses, and agricultural innovators by delivering [inline video pill] practical tools that respect the land while improving productivity."*
  - **Inline Video Pill:**
    - Embedded directly between "by delivering" and "practical".
    - Dimensions: $\sim 48 \times 28\text{ px}$ source $\longrightarrow$ **$\sim 80 \times 46\text{ px}$ at 1440px**.
    - Border radius: $100\text{ px}$ (Pill shape), `overflow: hidden`, `display: inline-block`, `vertical-align: middle`.
    - Content: Looping HTML5 video snippet of a farmer inspecting soil/crops.
- **Ant Design Mapping:**
  - Typography: `<Typography.Paragraph>` wrapping animated `<span>` elements driven by scroll position (Framer Motion / CSS scroll-timeline).
  - Video Pill: Custom `<video>` inside rounded inline container.

---

### Section 5: Features Accordion & Hero Image
- **Frames Used as Evidence:** Frames 02, 05 (s_05)
- **Visual Description:** Two-column split layout. Left side features an eyebrow, a mixed sans/serif italic H2 headline, and a 4-row interactive accordion. Right side features a tall, rounded portrait photograph of an agriculturalist in the field.
- **Layout & Dimensions:**
  - Width: $100\%$ container with $\sim 1200\text{ px}$ max-width at 1440px.
  - Grid Split: Left column $\sim 48\%$, right column $\sim 46\%$, column gap $\sim 6\%$.
  - Background: Pure White `#FFFFFF` **[HIGH]**.
- **Left Column Elements:**
  - **Eyebrow:** Green dot (`#07801A`) + "• Cultiva Legacy" or "• About Agrovia".
  - **H2 Headline:**
    - Line 1: "Smart Farming Solutions" (Bold Sans-Serif, `#000000` **[HIGH]**, $\sim 32\text{ px}$ source $\longrightarrow$ **$\sim 53\text{ px}$ at 1440px**).
    - Line 2: *"That Deliver Real Results"* (Italic Serif Cormorant Garamond, `#000000`).
  - **Lead Body Copy:** Muted gray `#454744`, $\sim 13\text{ px}$ source $\longrightarrow$ **$\sim 22\text{ px}$ at 1440px**.
  - **4-Row Accordion:**
    - Row Height: Closed $\sim 44\text{ px}$ source $\longrightarrow$ **$\sim 74\text{ px}$ at 1440px**; Open expands to $\sim 140\text{ px}$.
    - Row Gap: $\sim 8\text{ px}$ source $\longrightarrow$ **$\sim 13\text{ px}$ at 1440px**.
    - Corner Radius: **$\sim 10\text{ px}$** rounded corners.
    - **Closed Row State:** Background `#FFFFFF` **[HIGH]**, $1\text{ px}$ subtle border `#E5E7EB`, title in medium dark ink, right icon is a thin gray `+` plus.
    - **Active Row State (Row 1):** Background `#F3F3F3` **[HIGH]**, icon tile is $\sim 32 \times 32\text{ px}$ with border-radius $\sim 8\text{ px}$ filled with **Lime Green `#C6FA44`** **[HIGH]**, right icon is a thin gray `—` minus dash.
    - **Row Titles:**
      1. *Proven Farm Productivity* (Active)
      2. *Intelligent Crop Optimization* (Closed)
      3. *Seamless Farm System Integration* (Closed)
      4. *Smart Water & Resource Management* (Closed)
- **Right Column Elements:**
  - Portrait field image: Aspect ratio $\sim 3:4$, border-radius **$\sim 16\text{ px}$**, subtle box shadow `0 20px 40px rgba(0,0,0,0.06)`.
- **Ant Design Mapping:**
  - Accordion: Ant Design `<Collapse accordion defaultActiveKey={['1']} ghost={false} expandIconPosition="end">`.
  - Icon Tile: Custom `<div className="icon-tile" style={{ background: isActive ? '#C6FA44' : '#E0E0E0' }}>`.
  - Grid: `<Row gutter={[48, 24]}> <Col span={12}>...</Col> <Col span={12}>...</Col> </Row>`.

---

### Section 6: How It Works (Tabs & Floating Glass Cards)
- **Frames Used as Evidence:** Frames 03, 04, s_10
- **Visual Description:** Step-by-step product walkthrough. Top contains the standard 2-column header followed by a horizontal row of 4 segmented tab cards. Below sits a full-width hero image of the platform in action, overlaid with glassmorphic floating telemetry cards (Dhaka location chip, real-time weather stats, and an AI crop prediction model card).
- **Layout & Dimensions:**
  - Background: Light gray `#F4F4F4` to white `#FFFFFF` gradient.
  - Tab Bar: 4 equal cards in a flex row, gap $\sim 8\text{ px}$ source $\longrightarrow$ **$\sim 14\text{ px}$ at 1440px**.
  - Image Panel: Full-width container, height $\sim 560\text{ px}$ source $\longrightarrow$ **$\sim 850\text{ px}$ at 1440px**, border-radius **$\sim 16\text{ px}$**.
- **Elements:**
  - **Eyebrow & H2:** "• How It Works" / "Smart Farming Made" / *"Simple and Efficient"*.
  - **4 Tab Cards:**
    - Width: $\sim 192\text{ px}$ source $\longrightarrow$ **$\sim 310\text{ px}$ at 1440px** each.
    - Card 1: *Overview* / *Real-Time Insights* (Active: White `#FFFFFF` bg, dark text, drop shadow).
    - Card 2: *Smart Planning* / *Precision Planning* (Inactive: `#F4F4F4` bg, muted text).
    - Card 3: *Farm Control* / *Total Management* (Inactive).
    - Card 4: *Field Monitor* / *Growth Tracker* (Inactive).
  - **Overlay Floating Glass Cards (Bottom Area of Image Panel):**
    1. **Location Chip (Bottom-Left):**
       - White glass pill `rgba(255,255,255,0.9)`, border-radius $100\text{ px}$.
       - Content: Red location pin `📍` + "Dhaka, Bangladesh".
    2. **Weather Card (Bottom-Right):**
       - Background: Solid white `#FFFFFF` or `rgba(255,255,255,0.92)` glass, border-radius **$\sim 12\text{ px}$**, shadow `0 12px 24px rgba(0,0,0,0.12)`.
       - Content: "24°C" large headline, subtitle "Today's Avg Temperature", 3-column sub-metrics: `68% Humidity` | `20% Precipitation` | `12 km/h Wind Speed`.
    3. **AI Crop Prediction Card (Stacked with Weather Card):**
       - Title: "Area Prediction AI Model".
       - Status Badge: Green pill badge "Good for planting" (`#07801A` text, `#E8F5E9` bg).
       - Gradient Visualizer: Horizontal meter bar transitioning from Red $\rightarrow$ Yellow $\rightarrow$ Green.
       - Footer Callout: "Farm AI helps optimize crops, fields. →".
  - **Stats Counter Strip (Below Image Panel, s_10):**
    - 3 rounded white stat cards: `1.5M+ Acres Monitored` | `200+ Farmers Empowered` | `2M+ Farm Decisions Optimized`.
- **Ant Design Mapping:**
  - Tabs: Ant Design `<Segmented>` or custom interactive `<Card>` group.
  - Weather Card: Ant Design `<Card><Statistic title="Today's Avg Temperature" value={24} suffix="°C" />...</Card>`.
  - Badge: Ant Design `<Badge status="success" text="Good for planting" />`.
  - Gradient Bar: Ant Design `<Progress percent={85} strokeColor={{ '0%': '#EF4444', '50%': '#F59E0B', '100%': '#10B981' }} showInfo={false} />`.

---

### Section 7: Solutions Carousel (Staggered Portrait Cards)
- **Frames Used as Evidence:** Frames 05, 06, 12
- **Visual Description:** Horizontal showcase featuring tall, portrait-oriented photographic cards. The cards feature a staggered vertical alignment (center card sits $\sim 30\text{–}40\text{ px}$ higher than adjacent cards), with smooth blur-in entry transitions and edge bleed.
- **Layout & Dimensions:**
  - Section Background: Light neutral gray **`#F4F4F4`** **[HIGH]**.
  - Card Dimensions: $\sim 228 \times 340\text{ px}$ source $\longrightarrow$ **$\sim 380 \times 568\text{ px}$ at 1440px**.
  - Border Radius: **$\sim 16\text{ px}$** with `overflow: hidden`.
  - Card Gap: $\sim 24\text{ px}$ source $\longrightarrow$ **$\sim 40\text{ px}$ at 1440px**.
  - Stagger Offset: Card 2 (Center) elevated by **$\sim 35\text{ px}$** relative to Cards 1 and 3.
- **Card Content & Typography:**
  - **Card 1:**
    - Full-bleed image: Precision farming machinery / drone.
    - Title: "Sustainable Agriculture" (Dark Ink `#000A00` **[HIGH]**, $\sim 14\text{ px}$ source $\longrightarrow$ **$\sim 24\text{ px}$ at 1440px**).
    - Description: "Conserve resources, and grow healthier crops with precision analytics." (Muted gray `#454744` **[HIGH]**, 2 lines).
  - **Card 2 (Hero/Elevated):**
    - Full-bleed image: Farmer inspecting digital tablet with crop overlays.
    - Title: "AI Crop Health Monitoring".
    - Description: "Use AI-powered insights to detect crop diseases early, monitor plant health, and improve harvest quality."
  - **Card 3:**
    - Full-bleed image: Weather monitoring station in sunset field.
    - Title: "Climate & Weather Intelligence".
    - Description: "Access real-time weather forecasts and environmental analytics to plan farming activities."
- **Ant Design Mapping:**
  - Carousel: Ant Design `<Carousel autoplay={false} dots={false} slidesToShow={3} slidesToScroll={1}>`.
  - Cards: Custom `<Card hoverable cover={<img ... />} style={{ borderRadius: 16 }}>`.

---

### Section 8: Testimonials Carousel & Brand Strip
- **Frames Used as Evidence:** Frames 07, 08, 12, 15 (s_15)
- **Visual Description:** Wide, horizontal-scrolling testimonial review cards paired with a partner brand logo strip and circular navigation arrows.
- **Layout & Dimensions:**
  - Section Background: Pure White **`#FFFFFF`** **[HIGH]**.
  - Card Dimensions: $\sim 560 \times 210\text{ px}$ source $\longrightarrow$ **$\sim 935 \times 350\text{ px}$ at 1440px**.
  - Card Background: Pale sage/neutral **`#EDF2F1`** **[MEDIUM]**.
  - Border Radius: **$\sim 12\text{ px}$**.
  - Card Internal Split: Left $70\%$ typography & quotes, Right $30\%$ rounded farmer portrait.
- **Elements:**
  - **Header:** Eyebrow "• Testimonials" + H2 "Real Stories Shared / *by Our Farmers*".
  - **Card Content:**
    - Quote Glyph: Large gray decorative quotation mark `❝` top-left.
    - Quote Text: $\sim 13\text{ px}$ source $\longrightarrow$ **$\sim 22\text{ px}$ at 1440px**, dark ink, 3–4 lines.
    - Author: Bold title "Sarah Williams" / "Daniel Carter".
    - Role & Location: Muted subtext "CropSense, California" / "GreenRoot Farms, Texas".
    - Action: Text link "Read more ›" with subtle chevron.
    - Portrait Photo: $\sim 100 \times 190\text{ px}$ source $\longrightarrow$ **$\sim 165 \times 315\text{ px}$ at 1440px**, border-radius **$\sim 8\text{ px}$**.
  - **Brand Text Strip & Controls (Below Cards):**
    - Left: Partner brand names in spaced muted gray: `AgroField   CropSense   TeraGrow   FedLogic   FarmSync`.
    - Right: Navigation Controls: Two $48 \times 48\text{ px}$ circular buttons with white background and $1\text{ px}$ dark border (`←` and `→`).
- **Ant Design Mapping:**
  - Card: `<Card style={{ backgroundColor: '#EDF2F1', borderRadius: 12 }}>`.
  - Controls: `<Button shape="circle" icon={<ArrowLeftOutlined />} size="large" />` and `<Button shape="circle" icon={<ArrowRightOutlined />} size="large" />`.

---

### Section 9: FAQ Accordion
- **Frames Used as Evidence:** Frames 09, 10
- **Visual Description:** Centered single-column accordion section. Features 5 wide rounded rows with smooth expansion physics. Row 2 demonstrates the active state with dark green square minus toggle and dark-to-muted gradient answer text.
- **Layout & Dimensions:**
  - Width: Centered column, max width $\sim 700\text{ px}$ source $\longrightarrow$ **$\sim 1167\text{ px}$ at 1440px**.
  - Section Background: Pure White **`#FFFFFF`** **[HIGH]**.
  - Row Spacing: Scanned Y-intervals of $\sim 64\text{–}70\text{ px}$ source $\longrightarrow$ **$\sim 107\text{–}117\text{ px}$ row pitch at 1440px**.
  - Row Margin Bottom: **$\sim 8\text{ px}$ source $\longrightarrow$ $\sim 13\text{ px}$ at 1440px**.
  - Row Border Radius: **$\sim 10\text{ px}$**.
- **Header:**
  - Centered Eyebrow: Dark green dot **`#07801A`** **[HIGH]** + "FAQ".
  - Centered H2: "Common Farmer" (Bold Sans) + *"Questions"* (Italic Display Serif).
  - Centered Subtitle: *"Got questions? We've got answers to help you get the most out of Agrovia."*
- **FAQ Rows & Accordion State:**
  - **5 Confirmed Questions:**
    1. *Does Agrovia support sustainable farming?* `[+]`
    2. *Can I monitor multiple fields at once?* `[—]` (Expanded in Frame 10)
    3. *How do I get started with Agrovia?* `[+]`
    4. *Is Agrovia easy to use for non-technical farmers?* `[+]`
    5. *Can Agrovia help reduce farming costs?* `[+]`
  - **Closed Row Styling (Rows 1, 3, 4, 5):**
    - Background: Light neutral **`#F5F5F5`** **[HIGH]**.
    - Question Text: Medium weight 500, Dark Ink `#000000`.
    - Plus Glyph: Crisp black **`#000000`** **[HIGH]** thin `+` icon on right.
  - **Open Row Styling (Row 2 in Frame 10):**
    - Background: Light neutral **`#F5F5F5`** **[HIGH]**.
    - Question Text: 700 Bold, Dark Ink `#000000`.
    - Minus Button: Distinct **Dark Green Square Button `#116522`** **[HIGH]**, dimensions $\sim 28 \times 28\text{ px}$, border-radius **$\sim 6\text{ px}$**, with white centered `−` minus dash.
    - Answer Text: Revealed below question; line 1 dark ink `#1A1A1A`, fading to muted `#6B7280` on line 2.
    - Copy: *"Absolutely. Agrovia allows you to manage and track multiple fields from a single dashboard for better control and visibility."*
- **Ant Design Mapping:**
  - Component: Ant Design `<Collapse accordion defaultActiveKey={['2']} bordered={false}>`.
  - Custom Panel:
    ```jsx
    <Collapse.Panel
      key="2"
      header={<span style={{ fontWeight: 700 }}>Can I monitor multiple fields at once?</span>}
      extra={<div className="faq-toggle-btn active-green" />}
    >
      <p className="faq-answer">Absolutely. Agrovia allows you to manage...</p>
    </Collapse.Panel>
    ```

---

### Section 10: Final CTA Field Section
- **Frames Used as Evidence:** Frame 11
- **Visual Description:** Dramatic closing conversion section. White canvas seamlessly blends into a full-bleed panoramic field photograph with rolling green mountain terrain. Pinned at center is a bold dual-font H2, descriptive lead text, and a rich dark-green pill button.
- **Layout & Dimensions:**
  - Width: $100\%$ full-bleed.
  - Height: $\sim 480\text{ px}$ source $\longrightarrow$ **$\sim 720\text{ px}$ at 1440px**.
  - Content Alignment: Centered vertical flex stack.
  - Image Transition: Top white `#FFFFFF` / `#FDFDFD` fading into the field photo via `linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0.7) 35%, transparent 100%)`.
- **Elements:**
  - **H2 Headline:**
    - Line 1: "Make farming smarter," (700 Bold Sans, `#000300` **[HIGH]**, $\sim 32\text{ px}$ source $\longrightarrow$ **$\sim 53\text{ px}$ at 1440px**).
    - Line 2: *"stronger, and simpler"* (400 Italic Serif Cormorant Garamond, `#000300`).
  - **Body Copy:** Centered muted copy: *"Straightforward answers to help you make informed decisions across every hectare."*
  - **Action Button:**
    - Text: "Contact Us".
    - Background: **Rich Forest Green `#1A6628`** **[HIGH]** (`most_saturated` sample).
    - Text Color: `#FFFFFF`.
    - Shape: Full pill ($100\text{ px}$ radius).
    - Height: $\sim 38\text{ px}$ source $\longrightarrow$ **$\sim 56\text{ px}$ at 1440px**.
    - Padding: $\sim 36\text{ px}$ horizontal.
    - Hover State: Elevates with `box-shadow: 0 8px 20px rgba(26, 102, 40, 0.35)`.
- **Ant Design Mapping:**
  - Button: `<Button type="primary" shape="round" size="large" style={{ background: '#1A6628', height: 56, padding: '0 36px', fontSize: 18 }}>Contact Us</Button>`.

---

### Section 11: Footer
- **Status:** **Not in reference** (Zero reference frames or 1fps recording captures contain a footer).
- **Design Guidance for KisanSathi Implementation:**
  - Extend the established visual grammar: Minimalist 4-column layout on dark forest green `#0C3606` or soft neutral `#F4F4F4`.
  - Column 1: Agrovia / KisanSathi leaf logo + mission statement.
  - Column 2: Navigation solutions (Crop Diagnosis, Fertilizer Optimizer, Yield Forecasting).
  - Column 3: Regional resources (Kisan Call Center 1800-180-1551, IMD Agro-Meteorology).
  - Column 4: Language selector + copyright notice.

---

## 7. Comprehensive Ant Design Component Mapping Matrix

This matrix provides the complete bridge between the Agrovia reference design sections and the corresponding Ant Design component implementations:

| Section # | Page Section | Ant Design (v5) Component Stack | Key Token / Style Overrides |
|---|---|---|---|
| **01** | **Floating Navbar** | `Layout.Header`, `Menu`, `Button` | `background: rgba(255,255,255,0.25)`, `backdropFilter: 'blur(16px)'`, `borderRadius: 100` |
| **02** | **Hero Section** | `Row`, `Col`, `Button`, `Avatar.Group`, `Divider` | Full-bleed HTML5 `<video>`, Lime primary `<Button>` `#C6FA44`, ghost secondary pill |
| **03** | **Trusted Strip** | `Row`, `Col`, `Typography.Text` | Monochrome logo SVG strip, `#F8F8F8` background, flex wrap |
| **04** | **Statement Reveal** | `Typography.Paragraph`, Custom Inline Pill | Scroll-linked opacity spans, `display: 'inline-block'` video pill |
| **05** | **Features Accordion** | `Row`, `Col`, `Collapse`, `Image` | `Collapse` with `ghost={false}`, `headerBg: '#FFFFFF'`, active lime tile `#C6FA44` |
| **06** | **How It Works** | `Segmented` (or `Tabs`), `Card`, `Statistic`, `Badge`, `Progress` | Glass card overlay `rgba(255,255,255,0.92)`, gradient progress bar |
| **07** | **Solutions Carousel**| `Carousel`, `Card`, `Typography.Title` | Staggered margin top (`~35px`), `borderRadius: 16`, dark title `#000A00` |
| **08** | **Testimonials** | `Carousel`, `Card`, `Avatar`, `Button` | `#EDF2F1` card container, circular arrow navigation buttons |
| **09** | **FAQ Section** | `Collapse`, `Typography.Title` | `#F5F5F5` card rows, `#116522` square minus button with white glyph |
| **10** | **Final CTA** | `Button`, `Typography.Title`, `Space` | `#1A6628` large pill button, background gradient mask to field image |
| **11** | **Footer** | `Layout.Footer`, `Row`, `Col`, `Divider` | *Not in reference*; follow `#F4F4F4` or `#0C3606` architectural style |

---
*End of Visual Specification. Prepared for KisanSathi UI Engineering & Implementation.*
