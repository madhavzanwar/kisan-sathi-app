# Backend Findings & Multilingual Audit

> **Notice:** Under project rules, the only allowed backend modification is the backward-compatible multilingual extension to `POST /api/chat`. All other findings and proposals below are documented for future enhancement.

---

### Finding B-05: Multilingual Chat Handler Implementation (`/api/chat`)
- **File & Line:** `backend/main.py:240-289`
- **Status:** **Implemented** (Additive & Backward-Compatible)
- **Summary of Changes:**
  1. `ChatRequest` schema defaults `language: str = "en"` and `context: str = "general"`.
  2. The handler normalizes the `language` parameter to `"en" | "hi" | "mr"` (falling back to `"en"` if missing or unrecognized).
  3. Tailored agronomist prompt instructions added to the Gemini system prompt:
     - **Marathi (`mr`)**: Instructs Gemini to respond strictly in Marathi in Devanagari script (मराठी) using simple spoken words suitable for Indian farmers, keeping crop/fertilizer names, units (kg, acres, litres), and numbers readable, and maintaining precise pesticide/chemical dosage accuracy.
     - **Hindi (`hi`)**: Instructs Gemini to respond strictly in Hindi in Devanagari script (हिंदी) using simple spoken words suitable for Indian farmers, readable agricultural terminology, and accurate safety dosage guidelines.
     - **English (`en`)**: Instructs Gemini to respond in simple spoken English with accurate dosage safety.
  4. Localized error and fallback messages returned when API keys are unconfigured or when upstream services encounter rate limits.
  5. The API endpoint (`POST /api/chat`), request shape (`{ message, language, context }`), and response shape (`{"response": "..."}`) remain 100% identical.

---

### Finding B-06: Gemini Model Name Status & Deprecation Review
- **File & Line:** `backend/main.py:30`
- **Configured Model:** `GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")`
- **Audit Assessment:**
  - `gemini-1.5-pro` is functional and supported in `google-generativeai`.
  - For voice chat interactions where latency is critical, `gemini-1.5-flash` or `gemini-2.0-flash` provides substantially lower latency (under 800ms vs ~2-3s for 1.5 Pro).
  - The model name is configurable via environment variable `GEMINI_MODEL`.

---

### Finding B-07: Human-Readable Free-Text Endpoints (Multilingual Proposal)
The following backend endpoints currently return hardcoded English free text or unlocalized strings:

1. **AI Disease Diagnosis (`/api/predict/disease`)**
   - **File & Line:** `backend/main.py:114-115`
   - **Current Output:**
     - `chemical_treatment`: `"Consult local agricultural extension for optimal chemical dosage."`
     - `organic_treatment`: `"Ensure proper spacing and use neem-based bio-pesticides if necessary."`
   - **Multilingual Proposal:** Accept optional query param `?language=en|hi|mr`. Return localized advisory text for disease treatments in Hindi and Marathi.

2. **Live Weather Telemetry (`/api/weather`)**
   - **File & Line:** `backend/main.py:189-213`
   - **Current Output:**
     - `advisory`: `"High rain probability detected. Pause automated drip lines and postpone chemical spraying."`
     - `advisory`: `"High temperature and low humidity detected. Turn on drip irrigation immediately to prevent heat stress."`
     - `advisory`: `"Weather conditions are optimal for regular farm activities."`
     - `advisory`: `"Could not fetch live weather. Showing standard baseline data."`
   - **Multilingual Proposal:** Accept optional query param `?language=en|hi|mr`. Return localized weather advisories in Hindi and Marathi.

3. **Fertilizer Calculator (`/api/predict/fertilizer`)**
   - **File & Line:** `backend/main.py:132, 166`
   - **Current Output:** `recommended_fertilizer` string name (e.g., `"Standard NPK Blend"`, `"Urea"`, etc.).
   - **Multilingual Proposal:** Map recommended fertilizer names to localized display strings when `language` is passed in `FertilizerRequest`.

4. **Crop Yield & Pest Forecaster (`/api/predict/yield-pest`)**
   - **File & Line:** `backend/services/yield_pest_service.py`
   - **Current Output:** Agronomic notes and pest risk warnings generated in English.
   - **Multilingual Proposal:** Accept `language` in `YieldPestRequest` and provide translated pest prevention notes.

> *Note: These endpoints have NOT been modified, in accordance with the project's strict scope requirements.*

---

### Finding B-01: Inconsistent Error HTTP Status Codes in `/api/predict/disease`
- **File & Line:** `backend/main.py:91-93, 117-118`
- **Severity:** P2 (API contract consistency)
- **Description:**
  - When the PyTorch ResNet18 model fails to load or an image decompression error occurs, the endpoint returns HTTP 200 with `{"error": "Disease model not loaded"}` or `{"error": str(e)}` instead of HTTP 503 or 400.
- **Recommended Backend Fix:** Raise `HTTPException(status_code=503, detail="Disease model not loaded")` and `HTTPException(status_code=400, detail="Invalid leaf image file")`.

---

### Finding B-02: Wildcard CORS with `allow_credentials=True`
- **File & Line:** `backend/main.py:48-54`
- **Severity:** P2 (CORS specification violation)
- **Description:**
  - `CORSMiddleware` specifies both `allow_origins=["*"]` and `allow_credentials=True`.
- **Recommended Backend Fix:** Use explicit origins: `allow_origins=["http://localhost:5173", "http://localhost:4173", "https://*.vercel.app"]` when `allow_credentials=True`.

---

### Finding B-03: `crop_type` mapping mismatch in `/api/predict/fertilizer`
- **File & Line:** `backend/main.py:137, 140`
- **Severity:** P2 (Agronomic inference accuracy)
- **Description:**
  - Backend `crop_map` maps `{'Maize': 0, 'Sugarcane': 1, 'Wheat': 2, 'Cotton': 3, 'Tomato': 4}`.
- **Recommended Backend Fix:** Accept both `crop` and `growth_stage` as separate fields in `FertilizerRequest`.
