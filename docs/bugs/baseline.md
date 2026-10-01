# Phase 0 Baseline Audit

**Date:** 2026-10-01
**Branch:** `bugfix/sweep` (branched from `ui-redesign`)

## 1. Package Installation
- Command: `npm install` (in `frontend/`)
- Result: Clean install (`up to date, audited 105 packages in 2s, 0 vulnerabilities`).

## 2. Production Build
- Command: `npm run build`
- Result: **PASS** in 1.32s.
- Assets generated:
  - `dist/index.html`: 8.50 kB (gzip: 3.05 kB)
  - `dist/assets/index-*.js`: 226.25 kB (gzip: 72.96 kB)
  - CSS & Fonts: within expected budget

## 3. Linter Output (`npm run lint` -> `oxlint`)
- Command: `npm run lint`
- Result: **0 errors, 30 warnings**.
- Summary of warnings:
  - Unused imports:
    - `src/tabs/FertilizerCalc.jsx`: `Form`, `CheckCircleOutlined`, `ThunderboltOutlined`, `Sprout`, `Scale`, `Sparkles`, `RefreshCw`
    - `src/pages/Dashboard.jsx`: `Tooltip`
    - `src/tabs/YieldPestForecaster.jsx`: `Tooltip`, `Calendar`, `CheckCircle2`, `AlertTriangle`
    - `src/components/FloatingAssistant.jsx`: `Sparkles`
  - React Hook missing dependencies:
    - `src/tabs/YieldPestForecaster.jsx:45`: `useEffect` has missing dependencies: `farmSize`, `crop`, `sowingDate`, `fetchForecast`, `location.latitude`, and `location.longitude`
    - `src/components/FloatingAssistant.jsx:70`: `useEffect` has missing dependency: `messages.length`
    - `src/components/FloatingAssistant.jsx:101`: `useEffect` has missing dependency: `handleSendMessage` (used inside `recognition.onresult` callback)

## 4. Test Suite
- Test runner: No unit test runner configured in `frontend/package.json` (`test` script absent). Playwright core test scripts exist in `scripts/`.
