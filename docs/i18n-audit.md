# Internationalization (i18n) Audit & Technical Roadmap
## KisanSathi Agritech Platform: English (en) · Hindi (hi) · Marathi (mr)

> **Document Status:** Complete Read-Only Technical Audit  
> **Target Scope:** Full frontend localization, dynamic backend text handling, bilingual/trilingual chatbot, speech STT/TTS, and typography/layout integrity.  
> **Repository Rules Adhered To:** READ-ONLY. No code modified. Backend API contracts strictly preserved.

---

## 1. Stack & Runtime Verification

| Component | Detected Version | Notes & Compatibility |
|---|---|---|
| **Core Framework** | `react: ^19.2.8`, `react-dom: ^19.2.8` | React 19 concurrent mode. Compatible with `react-i18next: ^15.x` and `i18next: ^24.x`. |
| **Build Tool** | `vite: ^8.2.0`, `@vitejs/plugin-react: ^6.0.4` | Fast ESM bundling. JSON locale files can be imported directly or chunked per language. |
| **Component Library** | `antd: ^6.6.5`, `@ant-design/icons: ^6.3.4` | Ant Design 6. Contains built-in locales: `antd/locale/en_US`, `antd/locale/hi_IN`, and `antd/locale/mr_IN` (verified in `node_modules`). |
| **Routing** | `react-router-dom: ^7.18.2` | Single-page application with routes `/` (Landing/Auth) and `/dashboard` (with search params `?tab=heal|fertilizer|yield-pest|guide|weather`). |
| **Existing i18n Libraries** | **None** | No packages (`i18next`, `react-i18next`, `react-intl`, etc.) are installed. The codebase is currently 100% hardcoded English with partial Hinglish bot greeting. |
| **Styling & Motion** | Custom CSS variables + `framer-motion: ^13.4.6`, `lenis: ^1.3.26` | CSS layout tokens in `tokens.css`. Font definitions in `fonts.css`. |

---

## 2. Comprehensive Text Inventory

A comprehensive scan of `frontend/src` and `frontend/index.html` reveals **660+ distinct user-visible text elements**.

### 2.1 Inventory by Category & Source File

```
┌────────────────────────────────────────────────────────┬─────────────┬────────────────────────────────────────────────────────┐
│ Category / Location                                    │ Est. Count  │ Key Elements & Text Extracted                          │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ HTML Shell (index.html)                                │ 7 strings   │ <title>, meta description, og:title, og:desc, og:site, │
│                                                        │             │ twitter:title, twitter:description                     │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ Landing Page Master Copy (src/content/landing.js)      │ 158 strings │ Brand tagline, 6 nav links, hero headline & CTAs,      │
│                                                        │             │ statement copy, 4 feature accordion rows, 4 how-it-    │
│                                                        │             │ works tabs, 6 crop carousel profiles, 3 scenario       │
│                                                        │             │ testimonials, 5 technical FAQs, 5 powered-by badges,   │
│                                                        │             │ final CTA banner, and 3 footer navigation columns.     │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ Static Agronomic Protocols (src/tabs/CultivationGuide) │ 222 strings │ 6 crops, 36 stages (Land Prep, Sowing, Vegetative,     │
│                                                        │             │ Flowering, Pest Mgmt, Harvest), 36 duration tags, and  │
│                                                        │             │ 144 rich HTML guidance bullet points with dosages.     │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ Soil & Fertilizer Suite (src/tabs/FertilizerCalc)      │ 32 strings  │ 5 soil types, 4 crop stages, 3 NPK slider labels &     │
│                                                        │             │ units, acreage/pH inputs, submit CTA, error alerts,   │
│                                                        │             │ and 4 result stat cards (Urea, DAP, MOP, Compost).     │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ AI Leaf Pathology (src/tabs/HealCrop)                  │ 24 strings  │ 3-step indicator, drag-and-drop dropzone copy, format  │
│                                                        │             │ & size restrictions, browse button, scanning feedback, │
│                                                        │             │ severity tags, diagnosis match %, and treatment cards. │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ Satellite Telemetry & Pest (src/tabs/YieldPestForecaster)│ 65 strings │ 4 agro-climate preset regions, 7 crop selectors, date  │
│                                                        │             │ picker, GPS triggers, yield metric cards, outbreak     │
│                                                        │             │ risk levels, environmental drivers, and IPM advisories.│
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ Microclimate Telemetry (src/tabs/WeatherIrrigation)    │ 30 strings  │ Temperature, humidity, rain probability, wind speed,   │
│                                                        │             │ GPS telemetry states, location labels, and advisories. │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ Dashboard Shell & Navigation (src/pages/Dashboard.jsx) │ 35 strings  │ 5 agronomy tool tabs (name, subtitle, badge), sticky   │
│                                                        │             │ header CTAs, welcome banner, drawer quick tools,       │
│                                                        │             │ model specifications bullet list, and dynamic title.   │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ Auth & Farmer Portal (src/components/AuthDrawer.jsx)   │ 18 strings  │ Welcome headers, subtexts, email/password labels,      │
│                                                        │             │ placeholders, submit buttons, guest bypass, toggles.   │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ Chatbot & Voice Assistant (FloatingAssistant.jsx)      │ 35 strings  │ Tooltips, status badges, initial greeting, 15 context  │
│                                                        │             │ chips across 5 tabs, placeholder, mic/listen states.   │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ Loading, Errors & Fallbacks (AiLoadingState, Errors)   │ 25 strings  │ Render 8s cold start notification, network error       │
│                                                        │             │ alerts, validation warnings, ErrorBoundary recovery.   │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ Navigation Components (Navbar, MobileNavDrawer, Footer)│ 15 strings  │ Brand wordmark, "Try the App", "Open Farmer Dashboard",│
│                                                        │             │ mobile hamburger aria-label, backend status hairline.  │
├────────────────────────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┤
│ **TOTAL USER-VISIBLE STRINGS**                         │ **~666**    │ All identified for namespace extraction                │
└────────────────────────────────────────────────────────┴─────────────┴────────────────────────────────────────────────────────┘
```

### 2.2 Deep Dive into Sensitive Sub-Components

#### A. Static Agronomic Knowledge (`CultivationGuide.jsx`)
- **6 Supported Crops:** `['Tomato', 'Cotton', 'Wheat', 'Rice', 'Sugarcane', 'Maize']`
- **6 Stages per Crop:** `['Land Preparation', 'Sowing & Germination', 'Vegetative Growth', 'Flowering & Fruiting', 'Pest & Disease Management', 'Harvesting']`
- **144 Detailed Protocol Bullet Points:** Embedded with dosage concentrations, e.g.:
  - *"Apply well-decomposed farmyard manure (FYM) at 20-25 tonnes/ha during the last ploughing."*
  - *"Watch out for the Tomato Fruit Borer. Spray Spinosad 45% SC or use Neem Oil (10000 ppm) at first sight."*
  - *"The Pink Bollworm is a major threat. Install pheromone traps (5 per acre) to monitor moth activity."*
  - *"Spray Boron (0.2%) to prevent premature flower drop."*

#### B. Floating Assistant Context Chips (`FloatingAssistant.jsx`)
Currently generates 3 chips per active tab (15 total):
- **`heal` tab:**
  - *"Why are my tomato leaves turning yellow?"*
  - *"How to treat fungal blight?"*
  - *"Organic cure for powdery mildew?"*
- **`fertilizer` tab:**
  - *"What fertilizer for cotton?"*
  - *"How much DAP for 2 acres?"*
  - *"Organic alternatives to urea?"*
- **`yield-pest` tab:**
  - *"How does satellite NDVI predict yield?"*
  - *"What triggers Fall Armyworm outbreaks?"*
  - *"When should I irrigate based on soil moisture?"*
- **`weather` tab:**
  - *"Will it rain today?"*
  - *"Is weather optimal for spraying?"*
  - *"How to prevent heat stress?"*
- **`guide` tab:**
  - *"Best sowing window for wheat?"*
  - *"Pest cycle in sugarcane?"*
  - *"Ideal tomato plant spacing?"*

#### C. System Telemetry & Cold Start Feedback (`AiLoadingState.jsx`)
- Default loading message: *"Processing AI analysis..."*
- Default subtext: *"Connecting with agricultural intelligence models"*
- Cold-start notice threshold: 8000ms
- Cold-start title: *"Waking up the server, this can take up to a minute on first use."*
- Cold-start explanation: *"The backend runs on Render's spin-down tier. Once active, all subsequent requests respond instantly."*

---

## 3. Dynamic Text from the Backend (Read-Only Audit)

The backend (`backend/`) generates dynamic text across 4 core endpoints. We classify each as either a **Finite Set** (translatable via frontend dictionary) or **Free Text** (must be generated by the model in the target language):

| Endpoint | Field | Type | Translation Strategy | Details & Example Values |
|---|---|---|---|---|
| **`/api/predict/disease`** | `disease_name` | **Finite Set** (38 items) | Frontend Dictionary | 38 PlantVillage classes: `"Tomato Early Blight"`, `"Cotton Aphids"`, `"Wheat Rust"`, `"Healthy Crop"`, `"Crop Disease 4"` to `"Crop Disease 37"`. |
| **`/api/predict/disease`** | `severity` | **Finite Set** (3 items) | Frontend Dictionary | `"High"`, `"Moderate"`, `"None"` / `"Low"`. |
| **`/api/predict/disease`** | `chemical_treatment` | **Finite Set** (Fixed template) | Frontend Dictionary | `"Consult local agricultural extension for optimal chemical dosage."` (Can be mapped dynamically per disease class). |
| **`/api/predict/disease`** | `organic_treatment` | **Finite Set** (Fixed template) | Frontend Dictionary | `"Ensure proper spacing and use neem-based bio-pesticides if necessary."` (Can be mapped dynamically per disease class). |
| **`/api/predict/fertilizer`**| `recommended_fertilizer` | **Finite Set** (Discrete names) | Frontend Dictionary | `"Standard NPK Blend"`, `"Urea"`, `"DAP"`, `"10-26-26"`, `"12-32-16"`, `"20-20-0"`, etc. |
| **`/api/weather`** | `advisory` | **Finite Set** (4 templates) | Frontend Dictionary | 1. *"High rain probability detected. Pause automated drip lines and postpone chemical spraying."*<br/>2. *"High temperature and low humidity detected. Turn on drip irrigation immediately to prevent heat stress."*<br/>3. *"Weather conditions are optimal for regular farm activities."*<br/>4. *"Could not fetch live weather. Showing standard baseline data."* |
| **`/api/predict/yield-pest`**| `comparison_summary` | **Finite Format** | Frontend Formatter | Format: `"+12.5% vs. regional average (2.1 T/Acre)"`. Translated via template: `"{pct}% vs. प्रादेशिक सरासरी ({avg} टन/एकर)"`. |
| **`/api/predict/yield-pest`**| `primary_threat` | **Finite Set** (6 items) | Frontend Dictionary | `"Low Risk / Healthy Field"`, `"Fungal Blight"`, `"Aphids / Sucking Pests"`, `"Armyworm Infestation"`, `"Stem Borer Outbreak"`, `"Bollworm Infestation"`. |
| **`/api/predict/yield-pest`**| `risk_level` | **Finite Set** (3 items) | Frontend Dictionary | `"Low"`, `"Moderate"`, `"High"`. |
| **`/api/predict/yield-pest`**| `contributing_triggers` | **Finite Set** (5 items) | Frontend Dictionary | 1. *"Elevated relative humidity favorable for spore incubation"*<br/>2. *"High ambient temperature accelerating insect metabolic rates"*<br/>3. *"Dense canopy cover creating humid microclimate under leaves"*<br/>4. *"High root-zone soil saturation"*<br/>5. *"Climatic factors currently within safe equilibrium threshold"* |
| **`/api/predict/yield-pest`**| `irrigation.urgency` | **Finite Set** (4 items) | Frontend Dictionary | `"Hold / Delay"`, `"Immediate"`, `"Moderate"`, `"Normal"`. |
| **`/api/predict/yield-pest`**| `irrigation.action` | **Finite Set** (4 templates) | Frontend Dictionary | Fixed weather/soil moisture advisory rules in `yield_pest_service.py`. |
| **`/api/predict/yield-pest`**| `pest_prevention.*` | **Finite Set** (6 sets) | Frontend Dictionary | `bio_action`, `chemical_backup`, and `cultural_control` per pest category. |
| **`/api/predict/yield-pest`**| `resource_allocation.*` | **Finite Set** (3 items) | Frontend Dictionary | `nitrogen_timing`, `soil_carbon_boost`, and `water_saving_potential`. |
| **`/api/chat`** | `response` | **Free Text** (LLM Generated) | **LLM Generation (Gemini)** | Arbitrary conversational responses generated directly by Google Gemini 1.5 Pro based on `req.language`. |
| **`/api/chat`** | Fallback on missing key | **Finite Set** (3 languages) | Built-in Backend | Handled in `backend/main.py`: Already contains English, Marathi, and Hindi hardcoded fallback messages for missing API keys. |

> [!NOTE]
> Because backend inference endpoints (`/api/predict/disease`, `/api/predict/fertilizer`, `/api/predict/yield-pest`, `/api/weather`) return predictable, deterministic keys and categorical English strings, **the backend code does NOT need to change to support multi-language displays**. The frontend will apply dictionary lookups `t(`backend.${key}`)` upon receiving the response.

---

## 4. Chat Contract Specification & Audit

### 4.1 Current Frontend Invocation (`FloatingAssistant.jsx`)
```javascript
// Currently hardcoded in FloatingAssistant.jsx:
const langCode = 'en';
const sttLang = 'en-IN';

// Network request:
const res = await fetch(`${API_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: trimmed,
    language: langCode, // Currently hardcoded to 'en'
    context: activeTab, // e.g. 'heal', 'fertilizer', 'yield-pest', 'weather', 'guide'
  }),
});
```

### 4.2 Backend Contract Handling (`backend/main.py`)
```python
class ChatRequest(BaseModel):
    message: str
    language: str
    context: str

@app.post("/api/chat")
async def chat_assistant(req: ChatRequest):
    ...
    # Multilingual missing-key fallback already coded in backend:
    if not API_KEYS:
        fallback_msg = f"API Key not found. I understood: '{req.message}'..."
        if req.language == 'mr':
            fallback_msg = f"API Key सापडली नाही. मला समजले: '{req.message}'..."
        elif req.language == 'hi':
            fallback_msg = f"API Key नहीं मिली। मुझे समझ आया: '{req.message}'..."
        return {"response": fallback_msg}

    # System prompt injected into Gemini:
    system_prompt = f"""
    You are KisanSathi (किसान साथी), an empathetic, deeply knowledgeable, and localized agricultural expert assistant.
    The user is currently looking at the '{req.context}' tab on the application.
    You MUST respond strictly in the following language code: '{req.language}'. 
    If the code is 'en', reply in English. If 'mr', reply in fluent Marathi. If 'hi', reply in fluent Hindi.
    Keep your responses very concise (under 3 sentences) because they will be read aloud via Text-to-Speech to the farmer. Do not use markdown formatting like asterisks.
    Answer their farming queries directly and simply.
    """
    full_prompt = f"{system_prompt}\nUser: {req.message}"
```

### 4.3 Chat Contract Findings
1. **The Backend is Already Prepared:** `backend/main.py` explicitly supports `req.language` equal to `'en'`, `'mr'`, and `'hi'`.
2. **The Bug is in the Frontend:** `FloatingAssistant.jsx` currently hardcodes `const langCode = 'en'`, preventing the backend from ever receiving `'mr'` or `'hi'`.
3. **Resolution:** Simply dynamically bind `langCode = i18n.language` in `FloatingAssistant.jsx`. No backend changes required.

---

## 5. Voice Telemetry: Speech Recognition & Synthesis

### 5.1 Current Configuration (`FloatingAssistant.jsx`)
```javascript
const sttLang = 'en-IN'; // Hardcoded

// Speech Recognition (STT):
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = sttLang; // 'en-IN'

// Speech Synthesis (TTS):
const speakText = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = sttLang; // 'en-IN'
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
};
```

### 5.2 Multi-Language Voice Strategy

| Language | Language Code | STT BCP-47 Code | TTS BCP-47 Code | Voice Availability & Fallback Handling |
|---|---|---|---|---|
| **English** | `en` | `en-IN` | `en-IN` | Widely supported on all Chromium, iOS, and Android devices. |
| **Hindi** | `hi` | `hi-IN` | `hi-IN` | Widely available (e.g., Google हिन्दी, Microsoft Hemant/Kalpana). |
| **Marathi** | `mr` | `mr-IN` | `mr-IN` | **Voice Availability Risk:** While Android Chrome supports `mr-IN` voice synthesis, some desktop Windows/macOS installations lack a native `mr-IN` TTS voice. **Fallback rule:** If `window.speechSynthesis.getVoices()` finds no `mr-IN` voice, fallback to `hi-IN` for phoneme pronunciation rather than failing silently. |

---

## 6. Layout, Component, and Typography Risks

Translating into Devanagari scripts (Hindi and Marathi) introduces distinct visual, typographical, and structural challenges:

### 6.1 Font Stack & Devanagari Script Support
In `frontend/src/design-system/fonts.css`:
```css
@import '@fontsource/inter/latin-400.css';
@import '@fontsource/inter/latin-600.css';
@import '@fontsource/inter/latin-700.css';
@import '@fontsource/instrument-serif/latin-400-italic.css';

:root {
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif-accent: 'Instrument Serif', Georgia, serif;
}
```
- **Major Finding:** Both `@fontsource/inter` and `@fontsource/instrument-serif` are imported as **Latin-only subsets** (`latin-*.css`).
- **The Accent Serif Failure:** `Instrument Serif` has **no Devanagari glyphs**. Any text rendered in `<span className="heading-accent">` (e.g. *Every Kisan*, *That Deliver Real Results*, *Calculator*, *Dashboard*) will fail to render in Instrument Serif. Browsers will fall back to default system serif (e.g. Mangal, Nirmala UI, or Times), resulting in uneven x-heights and jarring aesthetic mismatch.
- **Recommended Remedy:** Add `@fontsource/noto-sans-devanagari` (weights 400, 600, 700) and configure `--font-serif-accent` with a compatible Devanagari display fallback, or style Devanagari accents with italic bold styling in `--font-sans`.

### 6.2 Text Expansion & Container Collisions
Hindi and Marathi words are **20% to 45% longer** in horizontal pixel width compared to English equivalents.

1. **Desktop Navbar Pill (`Navbar.jsx`):**
   - The desktop navbar container (`.desktop-nav-pill`) renders 6 items in a single fixed pill.
   - *English (55 chars total):* `Home` · `Heal Your Crop` · `Fertilizer Calc` · `Cultivation Guides` · `Yield & Pest` · `AI Assistant`
   - *Hindi (84 chars total):* `मुख्य पृष्ठ` · `फसल का उपचार` · `उर्वरक कैलकुलेटर` · `खेती मार्गदर्शिका` · `उपज और कीट` · `एआई सहायक`
   - *Marathi (92 chars total):* `मुख्य पान` · `पीक रोग निदान` · `खत गणक` · `पीक लागवड मार्गदर्शक` · `उत्पादन व कीड` · `एआय सहाय्यक`
   - **Risk:** At viewports between `960px` and `1200px`, the expanded text will wrap onto two lines, breaking the pill radius or colliding with the brand logo.
   - **Fix:** Decrease font-size from `13.5px` to `12.5px` and padding from `6px 14px` to `5px 10px` when active language is `hi` or `mr`, or adjust breakpoint from `960px` to `1080px`.

2. **Statement Section Video Pill (`StatementSection.jsx`):**
   - Currently uses `ScrollRevealText` with `inlineInsertIndex={10}` (inserting video thumbnail after word 10).
   - English syntax (SVO): *"KisanSathi puts crop science in every farmer's hands by delivering [VIDEO] instant leaf disease diagnosis..."*
   - Hindi / Marathi syntax (SOV): Verbs and auxiliaries appear at the very end of sentences. Word 10 splits compound nouns unnaturally (e.g., splitting *"रोग निदान"* or *"खत प्रमाण"*).
   - **Fix:** Allow `inlineInsertIndex` to be configured per locale in `LANDING_CONTENT.statement`.

3. **Dashboard Tool Bento Grid (`Dashboard.jsx`):**
   - 5 cards with `min-height: 150px`, grid `minmax(210px, 1fr)`.
   - Subtitle: *"Lifecycle Agronomic Protocols"* -> Marathi: *"पीक जीवनचक्र कृषी कार्यपद्धती"*.
   - **Risk:** Subtitle wraps to 3 lines, causing uneven card heights across the row.
   - **Fix:** Use CSS `display: flex; flex-direction: column; justify-content: space-between` with flexible card sizing and `min-height: 160px`.

4. **Floating Assistant Suggestion Chips (`FloatingAssistant.jsx`):**
   - `whiteSpace: 'nowrap'`. Devanagari questions are significantly wider.
   - **Fix:** Ensure `overflow-x: auto` has smooth momentum scrolling and proper padding so chips don't get cut off at panel edges.

---

## 7. Proposed Architecture

### 7.1 Selected Libraries
- **`i18next`** (`^24.x`): Battle-tested, extensible, zero dependencies.
- **`react-i18next`** (`^15.x`): React 19 compatible hooks (`useTranslation`), `<Trans />` for formatted text.
- **`i18next-browser-languagedetector`** (`^8.x`): Remembers user's preference in `localStorage` (`kisan_language`), with fallback to `en`.

### 7.2 Ant Design Locale Integration
Ant Design 6 provides built-in locale objects. In `Dashboard.jsx` and `App.jsx`:
```javascript
import enUS from 'antd/locale/en_US';
import hiIN from 'antd/locale/hi_IN';
import mrIN from 'antd/locale/mr_IN';

const antdLocales = {
  en: enUS,
  hi: hiIN,
  mr: mrIN,
};

// In render tree:
<ConfigProvider theme={kisanSathiTheme} locale={antdLocales[currentLanguage] || enUS}>
  <AntdApp>
    ...
  </AntdApp>
</ConfigProvider>
```

### 7.3 Namespace & Key Organization
To prevent bloated bundle size, translations will be split into modular JSON files per namespace:
```
frontend/src/locales/
├── en/
│   ├── common.json        # Shared buttons, brand, units (kg, ha, acre), system alerts
│   ├── nav.json           # Header, desktop pill, mobile drawer, footer
│   ├── landing.json       # Hero, features, how-it-works, carousel, faq, cta
│   ├── heal.json          # Leaf disease diagnosis steps, dropzone, severity, treatments
│   ├── fertilizer.json    # Soil types, crop stages, NPK sliders, formulation cards
│   ├── yieldPest.json     # Satellite NDVI, weather metrics, pest risks, IPM actions
│   ├── guide.json         # Crop lifecycles, 36 stages, 144 agronomic protocols
│   ├── assistant.json     # Greeting, suggested chips, status tags, mic labels
│   └── backend.json       # 38 disease class names, fertilizer blends, weather advisories
├── hi/
│   └── (mirror structure)
└── mr/
    └── (mirror structure)
```

### 7.4 Language Switcher UI
A high-contrast language selector dropdown/pill matching the glassmorphism design system:
- **Desktop Navbar:** Positioned adjacent to "Try the App" button. Displays: `🌐 English ▾` / `🌐 हिन्दी ▾` / `🌐 मराठी ▾`.
- **Mobile Drawer:** Segmented pill toggle at top of menu drawer.
- **Dashboard Header:** Compact dropdown in sticky top header next to "Exit Dashboard".

---

## 8. Agronomic Glossary (EN ↔ HI ↔ MR)

Specialized terminology must be translated accurately according to regional agronomic usage rather than literal Google Translate:

| English Term | Hindi (कृषि शब्दावली) | Marathi (शेती शब्दावली) |
|---|---|---|
| **NPK (Nitrogen, Phosphorus, Potassium)** | नाइट्रोजन, फास्फोरस, पोटाश | नत्र, स्फुरद, पालाश (एन.पी.के.) |
| **Urea** | यूरिया | युरिया |
| **DAP (Diammonium Phosphate)** | डीएपी (डाय-अमोनियम फॉस्फेट) | डीएपी (डाय-अमोनियम फॉस्फेट) |
| **MOP (Muriate of Potash)** | एमओपी / पोटाश | एमओपी / पोटॅश |
| **Farmyard Manure (FYM)** | गोबर की खाद (एफवायएम) | शेणखत / कंपोस्ट खत |
| **Tilth / Ploughing** | जुताई / भुरभुरी मिट्टी | नांगरणी / भुसभुशीत जमीन (मशागत) |
| **Sowing / Seeding** | बुवाई | पेरणी / टोकण |
| **Basal Dose** | आधार खुराक (बुवाई के समय) | बेसल डोस (पेरणीच्या वेळेची खतमात्रा) |
| **Top Dressing** | खड़ी फसल में खाद देना (टॉप ड्रेसिंग) | उभ्या पिकात खत देणे (टॉप ड्रेसिंग) |
| **Tillering Stage** | कल्ले फूटने की अवस्था | फुटवे येण्याची अवस्था |
| **Crown Root Initiation (CRI)** | मुकुट जड़ निकलने की अवस्था | मुकुट मुळे फुटण्याची अवस्था (सीआरआय) |
| **Square Formation (Cotton)** | कलियाँ बनना (चौकोर अवस्था) | पाते धरणे (पात्यांची अवस्था) |
| **Boll Formation (Cotton)** | गूलर / बोंड बनना | बोंडे धरणे / बोंड भरण्याची अवस्था |
| **Early Blight** | अगेती झुलसा रोग | लवकर येणारा करपा रोग |
| **Late Blight** | पछेती झुलसा रोग | उशिरा येणारा करपा रोग |
| **Rust** | रतुआ रोग | तांबेरा रोग |
| **Powdery Mildew** | चूर्णिल आसिता (भभूतिया) | भुरी रोग |
| **Aphids** | माहू / चेपा | मावा कीड |
| **Whitefly** | सफेद मक्खी | पांढरी माशी |
| **Stem Borer** | तना छेदक | खोडकिडा |
| **Pink Bollworm** | गुलाबी सुंडी | गुलाबी बोंडअळी |
| **Fall Armyworm** | लश्करी सुंडी / फॉल आर्मीवर्म | लष्करी अळी |
| **Loamy Soil** | दोमट मिट्टी | गाळाची / पोयटा माती |
| **Black Soil (Regur)** | काली मिट्टी (रेगुर) | काळी कसदार माती (रेगूर जमीन) |
| **Alluvial Soil** | जलोढ़ मिट्टी | गाळाची जमीन |
| **Clayey Soil** | चिकनी मिट्टी | चिकनमातीची जमीन |
| **Sandy Soil** | बलुई मिट्टी | वाळूमिश्रित / हलकी माती |
| **Drip Irrigation** | टपक सिंचाई | ठिबक सिंचन |
| **Canopy Cover** | छत्र आवरण (कैनोपी) | पिकाचे आच्छादन (कॅनोपी कव्हर) |
| **Yield (Tons/Acre)** | उपज (टन प्रति एकड़) | उत्पादन (टन प्रति एकर) |

---

## 9. Numbered Step-by-Step Implementation Plan

```
Phase 1: Dependencies & Core Infrastructure
  1. Install i18next, react-i18next, and i18next-browser-languagedetector in frontend.
  2. Create i18n configuration module (src/i18n.js) with language detection and fallback to 'en'.
  3. Wrap root App in antd ConfigProvider with dynamic locale switching (enUS, hiIN, mrIN).

Phase 2: Typography & Font Stack
  4. Add Devanagari font imports (@fontsource/noto-sans-devanagari) in fonts.css.
  5. Configure font-family fallback rules for --font-sans and --font-serif-accent.

Phase 3: Locale Extraction & JSON Catalogs
  6. Extract common, nav, and landing strings into src/locales/en/ and create hi/ and mr/ equivalents.
  7. Extract static CultivationGuide protocols (36 stages, 144 bullet points) using the Agronomic Glossary.
  8. Extract FertilizerCalc, HealCrop, YieldPestForecaster, and WeatherIrrigation labels and options.
  9. Create backend response mapping dictionaries for disease classes, severity, and advisories.

Phase 4: Component Integration & Language Switcher
  10. Create LanguageSwitcher component and integrate into Navbar (desktop), MobileNavDrawer, and Dashboard.
  11. Replace hardcoded strings in components with useTranslation() hooks and t() lookups.
  12. Adjust StatementSection to handle locale-specific video pill insert indexes.
  13. Update HTML lang attribute and document.title dynamically on language change.

Phase 5: Chatbot & Voice Assistant Localization
  14. Update FloatingAssistant.jsx to pass active i18n.language ('en', 'hi', 'mr') to POST /api/chat.
  15. Localize greeting message, 15 context chips, placeholders, and tooltips per language.
  16. Bind speech recognition (STT) and synthesis (TTS) to active language code (en-IN, hi-IN, mr-IN) with fallback.

Phase 6: Verification & QA
  17. Test RTL/Devanagari layout wrapping on mobile (390px) and tablet (1024px).
  18. Verify zero regression on existing backend contracts and tests.
  19. Run npm run build and Lighthouse to verify bundle size and performance.
```

---

## 10. Open Decisions for User Confirmation

Before beginning Phase 1 implementation, please confirm preferences on the following:

1. **Language Switcher Placement & Design:**
   - *Option A (Recommended):* Glass pill dropdown in Navbar (desktop) + Segmented toggle in mobile drawer + Header dropdown in Dashboard.
   - *Option B:* Persistent floating pill at bottom-left corner of the viewport.
2. **Marathi Speech Synthesis (TTS) Fallback:**
   - *Option A (Recommended):* Try `mr-IN` voice first; if unavailable in client browser, gracefully fallback to `hi-IN` voice so speech still functions.
   - *Option B:* Disable text-to-speech when browser lacks native `mr-IN` voice and show text only.
3. **Devanagari Heading Accent Style:**
   - *Option A (Recommended):* Pair `Noto Sans Devanagari` (SemiBold/Bold) with subtle color accents (`#D5F145` lime / `#2E6B34` forest green) for the accent phrases.
   - *Option B:* Load a stylized Devanagari display font (e.g., `Rozha One` or `Yatra One`) to match the serif flavor of `Instrument Serif`.
4. **Cultivation Guide Protocols Translation Depth:**
   - *Option A (Recommended):* Translate all 6 crops, all 36 stages, and all 144 dosage bullet points into pure regional Marathi and Hindi using the verified Agronomic Glossary.
   - *Option B:* Keep chemical technical names (e.g. *Spinosad 45% SC*, *Chlorantraniliprole 18.5% SC*) in Latin transliteration within Devanagari sentences for farmer familiarity at agro-chemical stores.
