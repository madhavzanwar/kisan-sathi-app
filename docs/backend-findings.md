# Backend Audit Findings (READ-ONLY)

> **Notice:** Under strict project rules, `backend/` is READ-ONLY. Zero backend files were modified. These findings are logged for the repository maintainer to review and decide upon.

---

### Finding B-01: Inconsistent Error HTTP Status Codes in `/api/predict/disease`
- **File & Line:** `backend/main.py:91-93, 117-118`
- **Severity:** P2 (API contract consistency)
- **Description:**
  - When the PyTorch ResNet18 model fails to load or an image decompression error occurs, the endpoint returns HTTP 200 with `{"error": "Disease model not loaded"}` or `{"error": str(e)}` instead of HTTP 503 or 400.
  - **Frontend Impact:** The frontend `HealCrop.jsx` checks `if (data.error) throw new Error(data.error);`, so user-facing alerts work correctly, but standard API status monitoring tools will log these errors as HTTP 200 successes.
- **Recommended Backend Fix:** Raise `HTTPException(status_code=503, detail="Disease model not loaded")` and `HTTPException(status_code=400, detail="Invalid leaf image file")`.

---

### Finding B-02: Wildcard CORS with `allow_credentials=True`
- **File & Line:** `backend/main.py:48-54`
- **Severity:** P2 (CORS specification violation)
- **Description:**
  - `CORSMiddleware` specifies both `allow_origins=["*"]` and `allow_credentials=True`.
  - According to the W3C CORS specification, browsers reject requests containing `credentials: 'include'` when `Access-Control-Allow-Origin` is `*`.
  - **Frontend Impact:** Frontend requests currently use `fetch()` without `credentials: 'include'`, so browser requests succeed; however, if authentication is transitioned to httpOnly cookies in the future, cross-origin requests from Vercel will be blocked by browsers.
- **Recommended Backend Fix:** Use explicit origins: `allow_origins=["http://localhost:5173", "http://localhost:4173", "https://*.vercel.app"]` when `allow_credentials=True`.

---

### Finding B-03: `crop_type` mapping mismatch in `/api/predict/fertilizer`
- **File & Line:** `backend/main.py:137, 140`
- **Severity:** P2 (Agronomic inference accuracy)
- **Description:**
  - Backend `crop_map` maps `{'Maize': 0, 'Sugarcane': 1, 'Wheat': 2, 'Cotton': 3, 'Tomato': 4}`.
  - The frontend sends the growth stage value (`'Vegetative'`, `'Sowing'`, `'Flowering'`, `'Maturity'`) under the contract key `crop_type`.
  - Because `'Vegetative'` is not in `crop_map`, `crop_map.get(req.crop_type, 0)` silently falls back to integer `0` (`Maize`).
- **Recommended Backend Fix:** Accept both `crop` (e.g. Tomato/Cotton) and `growth_stage` as separate fields in `FertilizerRequest` to avoid default integer fallback.

---

### Finding B-04: Default Gemini Model Name Deprecation Risk
- **File & Line:** `backend/main.py:30`
- **Severity:** P2 (External API availability)
- **Description:**
  - Fallback model name is `gemini-1.5-pro`. When Google updates API version endpoints, older model alias endpoints may encounter deprecation.
- **Recommended Backend Fix:** Support dynamic fallback or configurable `gemini-1.5-flash` via `.env` parameter `GEMINI_MODEL=gemini-1.5-flash`.
