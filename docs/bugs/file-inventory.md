# File Inventory and Ownership Zones

## Zone 1: Routing, Auth, App Shell
**Owner:** Agent 1
- `frontend/src/App.jsx`
- `frontend/src/main.jsx`
- `frontend/src/pages/Auth.jsx`
- `frontend/src/pages/Dashboard.jsx` (Shell layout, header, drawer, tab routing)
- `frontend/src/components/AuthDrawer.jsx`
- `frontend/src/components/ErrorBoundary.jsx`
- `frontend/vercel.json`

## Zone 2: Heal Your Crop
**Owner:** Agent 2
- `frontend/src/tabs/HealCrop.jsx`

## Zone 3: Fertilizer Calculator, Cultivation Guides & Telemetry Tools
**Owner:** Agent 3
- `frontend/src/tabs/FertilizerCalc.jsx`
- `frontend/src/tabs/CultivationGuide.jsx`
- `frontend/src/tabs/YieldPestForecaster.jsx`
- `frontend/src/tabs/WeatherIrrigation.jsx`

## Zone 4: AI Assistant (Chat + Voice)
**Owner:** Agent 4
- `frontend/src/components/FloatingAssistant.jsx`

## Zone 5: Design System, Landing Sections & Media
**Owner:** Agent 5
- `frontend/src/content/landing.js`
- `frontend/src/design-system/theme.js`
- `frontend/src/design-system/tokens.css`
- `frontend/src/design-system/fonts.css`
- `frontend/src/index.css`
- `frontend/src/design-system/components/BgVideo.jsx`
- `frontend/src/design-system/components/BlurIn.jsx`
- `frontend/src/design-system/components/ScrollRevealText.jsx`
- `frontend/src/design-system/components/SectionHeading.jsx`
- `frontend/src/design-system/components/SmoothScroll.jsx`
- `frontend/src/design-system/components/AiLoadingState.jsx`
- `frontend/src/sections/HeroSection.jsx`
- `frontend/src/sections/Navbar.jsx`
- `frontend/src/sections/PoweredByStrip.jsx`
- `frontend/src/sections/StatementSection.jsx`
- `frontend/src/sections/FeaturesAccordion.jsx`
- `frontend/src/sections/HowItWorks.jsx`
- `frontend/src/sections/SolutionsCarousel.jsx`
- `frontend/src/sections/TestimonialsSection.jsx`
- `frontend/src/sections/FAQSection.jsx`
- `frontend/src/sections/FinalCtaSection.jsx`
- `frontend/src/sections/Footer.jsx`
- `frontend/src/sections/MobileNavDrawer.jsx`

## Zone 6: Build, Dependencies, Performance & Security
**Owner:** Agent 6
- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/vite.config.js`
- `frontend/index.html`
- `frontend/.env.example`
- `.gitignore`
- Security audits, dependencies, bundle sizes

## Zone 7: Backend Reviewer (READ-ONLY)
**Owner:** Agent 7
- `backend/main.py`
- `backend/auth.py`
- `backend/models.py`
- `backend/database.py`
- `backend/requirements.txt`
- `backend/services/*`
- `backend/ml/*`
- Output: `docs/backend-findings.md`
