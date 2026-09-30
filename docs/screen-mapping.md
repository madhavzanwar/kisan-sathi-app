# Screen Mapping — Reference Design → KisanSathi

> Cross-reference of [`docs/ui-audit.md`](./ui-audit.md) (code audit) and [`docs/visual-spec.md`](./visual-spec.md) (reference design).
> **Wait for approval before building.**

---

## 1. Section-to-Feature Mapping Table

| # | Reference Section | Reference Content | KisanSathi Real Content | Mapping Type |
|---|---|---|---|---|
| 1 | **Navbar** | Logo "Agrovia", Home/About Us/Solutions/Investors/Success Story, "Contact Us" | Logo "KisanSathi" + leaf icon, nav: Features / How It Works / Tools / FAQ, "Get Started" CTA → opens login drawer | **Direct replacement** |
| 2 | **Hero** | Wheat field video, "Smart Farming for Future *Generations*", placeholder fintech body copy, 2 CTAs, scroll indicator, 4.9★ 10k+ Farmers, wheat video loop | Wheat field video (same CloudFront URL), "AI-Powered Crop Intelligence for *Every Farmer*", real KisanSathi body copy, 2 CTAs: "Diagnose Your Crop ↗" + "Explore Tools", scroll indicator. **No fake stats** | **Replace copy** |
| 3 | **Trusted Strip** | CHASE, JOHN DEERE, Kubota, Leader, GLEANER logos | **"Powered By" tech strip** — PyTorch, Google Gemini, Scikit-Learn, Vercel, FastAPI logos/wordmarks | **Honest replacement** |
| 4 | **Statement Paragraph** | "Our platform is built to support farmers, agribusinesses, and agricultural innovators by delivering practical tools..." | "KisanSathi is built for Indian farmers — combining computer vision, satellite intelligence, and generative AI into a single tool that fits in your pocket." | **Replace copy + keep scroll reveal** |
| 5 | **Features Accordion** | Proven Farm Productivity / Intelligent Crop Optimization / Seamless Farm System Integration / Smart Water & Resource Management | **KisanSathi's 4 real features:** 🩺 Heal Your Crop / 🧪 Smart Fertilizer Calculator / 🛰️ Yield & Pest Forecaster / 🌾 Cultivation Guides | **Direct feature mapping** |
| 6 | **How It Works Tabs** | Overview/Smart Planning/Farm Control/Field Monitor — with generic farming data | **4 KisanSathi tools:** Disease Detection / Fertilizer Calc / Weather & Irrigation / Yield Forecaster — with real data previews | **Direct feature mapping** |
| 7 | **Solutions Carousel** | Sustainable Agriculture / AI Crop Health Monitoring / Climate & Weather Intelligence (generic) | **6 supported crops:** Tomato / Cotton / Wheat / Rice / Sugarcane / Maize — each linking to Cultivation Guides dashboard tab | **Crop-gallery repurpose** |
| 8 | **Testimonials** | Sarah Williams (CropSense, California) / Daniel Carter (GreenRoot Farms, Texas) / Emma Rodriguez (HarvestLine, California) | **"Sample farmer scenarios"** — clearly labelled as illustrative. Ramesh from Punjab, Sunita from Maharashtra, Arjun from Karnataka. Alternative: replace with "How farmers use it" scenario cards | **Honest alternative** |
| 9 | **FAQ** | Agrovia-branded questions | **KisanSathi real FAQs** (see Section 4 copy list below) | **Replace copy** |
| 10 | **Final CTA** | "Make farming smarter, stronger, and simpler" + "Contact Us" pill | "Start farming smarter today" + "Open the Dashboard →" pill → navigates to `/dashboard` | **Replace copy + action** |
| 11 | **Footer** | Not visible in reference | **Not in reference** — add minimal footer: © KisanSathi 2026, GitHub link, backend status | **New addition** |

---

## 2. Honest Alternatives for Missing Content

| Reference Item | Problem | Honest Alternative |
|---|---|---|
| "4.9★ 10k+ Farmers" | No real user count | Remove entirely OR show "Built with PyTorch + Gemini" tech badge |
| Trusted-by brand logos | No real partners | "Powered by" tech stack logos — these are REAL |
| Farmer testimonials | No real testimonials | "Sample farmer scenarios" with disclaimer, OR replace section entirely with a feature comparison table |
| Brand strip (AgroField, CropSense, TeraGrow, FedLogic, FarmSync) | Not real | Replace with real crop categories or the 6 supported crops names |

> **Do not fabricate statistics, reviews, or user counts.** Scenarios are clearly labelled.

---

## 3. Ant Design Component Mapping

| Section / Element | Ant Design Component | Custom CSS Needed? | Notes |
|---|---|---|---|
| **Navbar pill** | Custom `div` with `position: fixed` | YES — glass pill, blur, active pill inside | Ant Design has no floating pill navbar |
| **Hero** | `Layout`, `Row`, `Col` for structure | YES — full-bleed video, absolute text positioning | CTA buttons → Ant Design `Button size="large"` |
| **Hero lime CTA** | `Button type="primary" shape="round"` | YES — override color to `#C6FA44` | |
| **Hero ghost CTA** | `Button type="default" shape="round" ghost` | YES — white border on video | |
| **Avatar group** | `Avatar.Group` | NO — built-in | |
| **Trusted strip** | `Space` + `Image` | YES — custom logo sizing | |
| **Statement scroll reveal** | Custom `div` per word with `motion.span` | YES — entirely custom | framer-motion required |
| **Inline video pill** | `video` or `img` styled as pill | YES — inline styling | |
| **Eyebrow tag** | `Tag` with custom color | YES — dot + text, small custom tag | |
| **Accordion (Features)** | `Collapse` | YES — custom expandIcon, lime tile, image side | expandIcon = lime tile on active |
| **Accordion icon tile** | Custom `div` inside `expandIcon` | YES — 32×32px, radius 8px, lime bg | |
| **How It Works tabs** | Custom tab cards (NOT Ant Design Tabs) | YES — 4 card-style selectors, full image panel below | Ant Design `Tabs` tabBar is too constrained |
| **Glass location chip** | Custom `div` | YES — white pill, blur background | |
| **Weather glass card** | `Card` | YES — custom shadow, rounded, weather icon | |
| **AI prediction gradient card** | `Card` + `Progress` | YES — gradient bar, badge | Ant Design `Progress` for the gradient bar |
| **Carousel (Solutions/Crops)** | Custom CSS carousel | YES — staggered heights, overflow, no Ant Design match | |
| **Testimonial cards** | Custom `Card` | YES — quote icon, portrait image layout | |
| **Testimonial nav arrows** | `Button shape="circle"` | YES — white fill, black border, no shadow | |
| **FAQ accordion** | `Collapse` | YES — custom expandIcon (green square minus), custom row bg | |
| **FAQ minus button** | Custom element in `expandIcon` | YES — #116522 bg, white −, radius 6px | |
| **Final CTA** | `Typography.Title` + `Button` | YES — field image overlay, white fade | |
| **Dashboard tabs** | `Tabs` or `Segmented` | YES — replace existing glass tab bar | |
| **Heal Your Crop upload** | `Upload.Dragger` | minimal — keep existing FormData logic | |
| **Fertilizer form** | `Form` + `Slider` + `Select` | minimal — keep existing payload mapping | |
| **FloatingAssistant FAB** | `FloatButton` | YES — keep emerald color, pulse ring in CSS | |
| **FloatingAssistant chat** | Custom panel | YES — keep entire logic, restyle chat window only | |
| **HealCrop steps** | `Steps` | minimal | |

---

## 4. All Copy — For Review and Approval

> **Do not build until you have approved this copy.**

### 4.1 Navbar
```
Logo: KisanSathi  [leaf icon]
Nav links: Features | How It Works | Tools | FAQ
CTA button: Get Started
Mobile: [logo] [Get Started] [≡]
```

### 4.2 Hero
```
H1 line 1: AI-Powered Crop Intelligence
H1 line 2: for Every [italic serif] Farmer
Body: Diagnose diseases, optimize fertilizer, and forecast yields —
      powered by PyTorch, satellite imagery, and Gemini AI.
CTA 1: Diagnose Your Crop ↗   [lime pill]
CTA 2: Explore Tools           [ghost pill]
Bottom bar: SCROLL ↓
```
> *(No fake star ratings or farmer counts — removed)*

### 4.3 Powered-By Strip
```
Powered by:  PyTorch  •  Google Gemini  •  Scikit-Learn  •  Vercel  •  FastAPI
```

### 4.4 Statement Paragraph
```
Eyebrow: • KisanSathi

Paragraph (scroll reveal):
"KisanSathi is built for Indian farmers — combining computer vision, satellite 
intelligence, and generative AI into a single tool that fits in your pocket and 
speaks your language."
```

### 4.5 Features Accordion
```
Section eyebrow: • Our Features
H2: Four Tools, One [italic] Platform.
Right body: Each tool works independently and together — from the field to the forecast.

Row 1 (default open):  🩺  Heal Your Crop
  Description: Upload a photo of any diseased leaf. Our ResNet18 model identifies
  the exact disease and returns chemical and organic treatment plans instantly.

Row 2:  🧪  Smart Fertilizer Calculator  
  Description: Input your soil's NPK levels, crop type, and farm size. Get exact 
  kilograms of Urea, DAP, MOP, and compost needed — calculated by a trained ML model.

Row 3:  🛰️  Yield & Pest Forecaster
  Description: Correlates Copernicus Sentinel-2 NDVI data, microclimate patterns, 
  and root-zone telemetry to forecast your harvest and flag early pest risks.

Row 4:  🌾  Cultivation Guides
  Description: Step-by-step lifecycle guides for Tomato, Cotton, Wheat, Rice, 
  Sugarcane, and Maize — covering sowing, irrigation, and pest control timelines.
```

### 4.6 How It Works Tabs
```
Section eyebrow: • How It Works
H2: From Field to Forecast —
    [italic] Simple and Intelligent.
Right body: Each tool connects your real crop data to trained AI models 
and returns actionable answers in seconds.

Tab 1: 🩺  Disease Detection  /  Upload & Diagnose
Tab 2: 🧪  Fertilizer Calc   /  Input & Optimize
Tab 3: ☁️  Weather & Soil    /  Detect & Irrigate
Tab 4: 📊  Yield Forecast    /  Predict & Plan

[Below each tab: image of the actual dashboard tool + floating sample result cards]
```

### 4.7 Crops Carousel
```
Section eyebrow: • Supported Crops
H2: Six Crops, Complete
    [italic] Lifecycle Guidance.
Right body: Tap any crop to open its full cultivation guide — covering every growth 
stage from land preparation to harvest.

Cards:
1. Tomato — Full lifecycle guide, 6 stages
2. Cotton — Full lifecycle guide, 6 stages
3. Wheat  — Full lifecycle guide, 6 stages
4. Rice   — Full lifecycle guide, 6 stages
5. Sugarcane — Full lifecycle guide, 6 stages
6. Maize  — Full lifecycle guide, 6 stages
```

### 4.8 Scenarios (replacing Testimonials)
```
Section eyebrow: • How Farmers Use It
H2: Real Workflows,
    [italic] Real Results.
Right body: Here's how KisanSathi's tools fit into a typical farming day.

[Clearly labelled "Sample Scenario" — not real testimonials]

Card 1: Ramesh, wheat farmer, Punjab
"I photographed a yellowing leaf and got the diagnosis in under 10 seconds.
The organic treatment recommendation saved me from overusing chemicals."
→ Used: Heal Your Crop

Card 2: Sunita, cotton farmer, Maharashtra
"The fertilizer calculator told me exactly how much DAP I needed per acre.
No more guessing at the shop."
→ Used: Smart Fertilizer Calculator

Card 3: Arjun, tomato farmer, Karnataka  
"The Yield Forecaster flagged a pest risk 2 weeks before I would have noticed.
I adjusted my IPM schedule and saved most of the harvest."
→ Used: Yield & Pest Forecaster
```

### 4.9 FAQ
```
Section eyebrow: • FAQ
H2: Common Farmer [italic serif] Questions
Subtext: Got questions? Here's what farmers ask us most.

Q1: Does KisanSathi work without internet?
A1: The app requires an internet connection to run the AI models on our backend. 
    However, the Cultivation Guides work fully offline once loaded.

Q2: Which diseases can KisanSathi detect?
A2: Our ResNet18 model is trained on 38 crop disease categories. We support 
    tomato, potato, corn, and other common Indian crops.

Q3: Is my data private?
A3: Photos you upload are sent to our backend for analysis and are not stored. 
    We do not collect or sell your data.

Q4: Is KisanSathi free to use?
A4: Yes — entirely free. No subscription, no hidden fees. Built as an open 
    demonstration of AI-powered agritech.

Q5: Does the AI Assistant speak Hindi?
A5: Not yet. The AI Assistant currently responds in English. Hindi support 
    is planned for a future update.
```

### 4.10 Final CTA
```
H2: Start farming smarter,
    [italic] one crop at a time.
Body: Open the dashboard and try any tool — no sign-up required.
Button: Open the Dashboard →
```

### 4.11 Footer (new, minimal)
```
© 2026 KisanSathi — Built with PyTorch · Gemini · FastAPI
[GitHub icon] Source Code   [Backend: Online/Offline status chip]
```

---

## 5. Approval Checkpoint

Before building begins, confirm:
- [ ] Hero copy approved
- [ ] "Powered by" strip approved (no fake logos)
- [ ] Scenarios section labeled clearly enough (not testimonials)
- [ ] FAQ answers are accurate
- [ ] Final CTA action (→ Dashboard) is correct
- [ ] KisanSathi branding name confirmed (not "Kisan Sakhi" or "Agrovia")
