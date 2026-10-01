# Zone 2 Findings: Heal Your Crop

**Owner:** Agent 2
**Scope:** `frontend/src/tabs/HealCrop.jsx`

---

### Finding Z2-01 (P1): Missing file size boundary validation before multipart upload
- **File & Line:** `frontend/src/tabs/HealCrop.jsx:30-40`
- **Severity:** P1 (Payload handling / Network failure)
- **Reproduction:** Upload a large photo (> 15 MB) on a slow mobile connection.
- **Root Cause:** `executeUpload` checks MIME type (`file.type.startsWith('image/')`), but performs no check on `file.size`. Large multi-megapixel raw mobile photos (> 15 MB) cause network timeouts or HTTP 413 Payload Too Large from server/proxy limits.
- **Proposed Fix:** Add check `if (file.size > 15 * 1024 * 1024)` and show user-friendly alert: `"Image file exceeds 15 MB limit. Please upload a standard photo."` before initiating API request.
- **Confidence:** HIGH.

---

### Finding Z2-02 (P1): Race condition on rapid repeated file drops/uploads
- **File & Line:** `frontend/src/tabs/HealCrop.jsx:30-48, 150-160`
- **Severity:** P1 (Race condition / State corruption)
- **Reproduction:** Drop an image onto the dragger, then immediately drop another image while Step 2 (`AiLoadingState`) is actively scanning.
- **Root Cause:** Neither `executeUpload` nor `<Dragger>` gates concurrent execution during Step 2. Two simultaneous async `fetch` requests race to `setDiagnosis` and `setStep(3)`, causing UI flickering or showing stale results.
- **Proposed Fix:** Add `disabled={step === 2}` to `<Dragger>` and native file input, plus guard `if (step === 2) return;` at top of `executeUpload`.
- **Confidence:** HIGH.

---

### Finding Z2-03 (P3): Unused Ant Design icon imports in HealCrop.jsx
- **File & Line:** `frontend/src/tabs/HealCrop.jsx:3`
- **Severity:** P3 (Minor / Lint warning)
- **Reproduction:** Run `npm run lint`.
- **Root Cause:** `CheckCircleOutlined`, `SyncOutlined`, and `ExperimentOutlined` are imported from `@ant-design/icons` but never referenced in JSX.
- **Proposed Fix:** Remove unused imports from line 3.
- **Confidence:** HIGH.
