# Zone 3 Findings: Fertilizer Calculator, Cultivation Guides & Telemetry

**Owner:** Agent 3
**Scope:** `frontend/src/tabs/FertilizerCalc.jsx`, `frontend/src/tabs/CultivationGuide.jsx`, `frontend/src/tabs/YieldPestForecaster.jsx`, `frontend/src/tabs/WeatherIrrigation.jsx`

---

### Finding Z3-01 (P1): Unbounded or NaN inputs in Fertilizer Calculator trigger API 422 error
- **File & Line:** `frontend/src/tabs/FertilizerCalc.jsx:29-44`
- **Severity:** P1 (Form validation / API payload contract)
- **Reproduction:** Clear the Farm Size or pH input completely, or enter `<= 0`, and click "Calculate Balanced Fertilizer".
- **Root Cause:** `parseFloat("")` results in `NaN`, which serializes to `null` in JSON (`JSON.stringify({ farm_size: NaN })` -> `{"farm_size": null}`). FastAPI's Pydantic `FertilizerRequest` expects `float` and returns HTTP 422 Unprocessable Entity.
- **Proposed Fix:** Add client-side validation guard in `handleCalculate`: ensure `farm_size > 0` and `ph >= 3.0 && ph <= 10.0`. If invalid, display clear error alert and halt submission.
- **Confidence:** HIGH.

---

### Finding Z3-02 (P2): Native `alert()` calls in Weather & Irrigation instead of UI Alert
- **File & Line:** `frontend/src/tabs/WeatherIrrigation.jsx:18, 54, 59`
- **Severity:** P2 (UX / Error handling)
- **Reproduction:** Click "Detect Location" on a browser with location permissions disabled.
- **Root Cause:** Uses blocking browser `alert()` modal dialog while declaring an unused `[error, setError]` state.
- **Proposed Fix:** Use `setError` to render a non-blocking in-page Ant Design `<Alert>` component.
- **Confidence:** HIGH.

---

### Finding Z3-03 (P3): Unused imports in FertilizerCalc, YieldPestForecaster, and WeatherIrrigation
- **File & Line:** `frontend/src/tabs/FertilizerCalc.jsx:2-4`, `frontend/src/tabs/YieldPestForecaster.jsx:2-14`
- **Severity:** P3 (Minor / Lint warnings)
- **Reproduction:** Run `npm run lint`.
- **Root Cause:**
  - `FertilizerCalc.jsx`: Unused imports `Form`, `CheckCircleOutlined`, `ThunderboltOutlined`, `Sprout`, `Scale`, `Sparkles`, `RefreshCw`.
  - `YieldPestForecaster.jsx`: Unused imports `Tooltip`, `Calendar`, `CheckCircle2`, `AlertTriangle`.
- **Proposed Fix:** Clean up unused identifiers from import statements.
- **Confidence:** HIGH.
