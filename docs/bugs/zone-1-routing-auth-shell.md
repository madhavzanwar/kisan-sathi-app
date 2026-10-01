# Zone 1 Findings: Routing, Auth, and App Shell

**Owner:** Agent 1
**Scope:** `frontend/src/App.jsx`, `frontend/src/main.jsx`, `frontend/src/pages/Auth.jsx`, `frontend/src/pages/Dashboard.jsx`, `frontend/src/components/AuthDrawer.jsx`, `frontend/src/components/ErrorBoundary.jsx`, `frontend/vercel.json`

---

### Finding Z1-01 (P1): Missing catch-all wildcard route causes blank screen on invalid paths
- **File & Line:** `frontend/src/App.jsx:38-42`
- **Severity:** P1 (Wrong behavior / Broken navigation)
- **Reproduction:** Navigate directly to `http://localhost:4173/unknown-path` or any mistyped URL.
- **Root Cause:** `<Routes>` in `App.jsx` only defines routes for `/` and `/dashboard`. Without a wildcard `<Route path="*" element={<Navigate to="/" replace />} />`, React Router matches null and renders completely blank screen without redirection or fallback.
- **Proposed Fix:** Import `Navigate` from `react-router-dom` and append `<Route path="*" element={<Navigate to="/" replace />} />`.
- **Confidence:** HIGH (100% reproducible).

---

### Finding Z1-02 (P2): Invalid `?tab=` URL parameter desynchronizes active tab state
- **File & Line:** `frontend/src/pages/Dashboard.jsx:69-77`
- **Severity:** P2 (UX / Visual state bug)
- **Reproduction:** Open `http://localhost:4173/dashboard?tab=unknown`.
- **Root Cause:** `useState(urlTab || 'heal')` initializes `activeTab` to `'unknown'`. While `renderTabContent()` falls back to `HealCrop`, none of the 5 cards in the Bento Grid receives the active indicator, resulting in a UI state mismatch.
- **Proposed Fix:** Validate `urlTab` against `tabs.some(t => t.id === urlTab)` when initializing `activeTab`. Default to `'heal'` if not recognized.
- **Confidence:** HIGH.

---

### Finding Z1-03 (P2): Exit Dashboard button does not clear stored auth session token
- **File & Line:** `frontend/src/pages/Dashboard.jsx:266, 658`
- **Severity:** P2 (Auth state consistency)
- **Reproduction:** Sign in via AuthDrawer to set `kisan_token` in `localStorage`. Click "Exit Dashboard" in Header or Drawer. Check `localStorage.getItem('kisan_token')`.
- **Root Cause:** Both exit navigation handlers only call `navigate('/')` without clearing `localStorage.removeItem('kisan_token')`.
- **Proposed Fix:** Create a unified `handleLogout` handler that removes `kisan_token` before calling `navigate('/')`.
- **Confidence:** HIGH.

---

### Finding Z1-04 (P3): Unused `Tooltip` import in Dashboard.jsx
- **File & Line:** `frontend/src/pages/Dashboard.jsx:3`
- **Severity:** P3 (Minor / Lint cleanup)
- **Reproduction:** Run `npm run lint`.
- **Root Cause:** `Tooltip` is imported from `antd` but never referenced in JSX.
- **Proposed Fix:** Remove unused `Tooltip` from import statement.
- **Confidence:** HIGH.
