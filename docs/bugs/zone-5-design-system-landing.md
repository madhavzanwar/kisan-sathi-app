# Zone 5 Findings: Design System, Landing Sections & Media

**Owner:** Agent 5
**Scope:** `frontend/src/content/landing.js`, `frontend/src/design-system/*`, `frontend/src/sections/*`, `frontend/src/index.css`

---

### Finding Z5-01 (P1): `IntersectionObserver` in `BgVideo.jsx` fails to bind when video element renders
- **File & Line:** `frontend/src/design-system/components/BgVideo.jsx:48-73`
- **Severity:** P1 (Lifecycle / Observers not connected)
- **Reproduction:** Load desktop view with initial `shouldPlayVideo = false` or when conditions evaluate. Observe if off-screen scrolling triggers pause.
- **Root Cause:**
  1. `useEffect` calls `setShouldPlayVideo(true)`.
  2. Because React state updates are asynchronous, `<video ref={videoRef}>` has not yet mounted in the DOM.
  3. `const videoEl = videoRef.current; if (!videoEl) return;` evaluates to `null` and aborts observer attachment.
  4. The effect's dependency array is only `[forcePoster]`, so the effect does not re-run after the `<video>` is mounted into the DOM.
- **Proposed Fix:** Re-run observer binding when `shouldPlayVideo` state changes or bind observer via a callback ref / separate effect with `[shouldPlayVideo]`.
- **Confidence:** HIGH.

---

### Finding Z5-02 (P2): Stale window resize event listener in `BgVideo.jsx`
- **File & Line:** `frontend/src/design-system/components/BgVideo.jsx:22-45`
- **Severity:** P2 (Responsive breakpoint sync)
- **Reproduction:** Resize the browser window across the 768px breakpoint on desktop without reloading the page.
- **Root Cause:** `isMobileScreen` is initialized in state, but there is no `window.addEventListener('resize')` inside `BgVideo.jsx` (unlike `HeroSection.jsx`). As a result, dynamically resizing the desktop browser window below or above 768px does not re-evaluate `isMobileScreen`.
- **Proposed Fix:** Add a resize event listener inside `useEffect` with debounce/throttling to update `isMobileScreen` dynamically.
- **Confidence:** HIGH.
