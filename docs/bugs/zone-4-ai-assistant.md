# Zone 4 Findings: AI Assistant (Chat + Voice)

**Owner:** Agent 4
**Scope:** `frontend/src/components/FloatingAssistant.jsx`

---

### Finding Z4-01 (P1): Stale closure in SpeechRecognition callback and non-functional state updates
- **File & Line:** `frontend/src/components/FloatingAssistant.jsx:87-90, 118-121, 135`
- **Severity:** P1 (State loss / Stale closure)
- **Reproduction:** Have a conversation with the chatbot via text. Then use voice input via the microphone button.
- **Root Cause:**
  1. `useEffect` sets up `recognition.onresult` once on mount (`[]`), capturing the initial reference to `handleSendMessage`.
  2. `handleSendMessage` uses `[...messages, { sender: 'user', text }]` instead of functional updates `setMessages(prev => [...prev, ...])`.
  3. Consequently, voice input can overwrite subsequent chat history with stale mount state.
- **Proposed Fix:**
  1. Convert `setMessages` calls in `handleSendMessage` to functional state updates (`setMessages(prev => [...prev, ...])`).
  2. Maintain a `latestSendMessageRef` updated every render so `recognition.onresult` always invokes the current function with current `activeTab` context.
- **Confidence:** HIGH.

---

### Finding Z4-02 (P1): Duplicate API requests permitted while `isThinking` is true
- **File & Line:** `frontend/src/components/FloatingAssistant.jsx:114-123`
- **Severity:** P1 (Duplicate sends / Resource waste)
- **Reproduction:** Type a message and spam the Send button or Enter key rapidly.
- **Root Cause:** `handleSendMessage` only checks `if (!text.trim()) return;` without verifying `if (isThinking) return;`. Multiple concurrent POST requests are sent to `/api/chat`.
- **Proposed Fix:** Add `if (isThinking) return;` guard at the top of `handleSendMessage`.
- **Confidence:** HIGH.

---

### Finding Z4-03 (P2): Speech synthesis not cancelled on component unmount
- **File & Line:** `frontend/src/components/FloatingAssistant.jsx:103-112`
- **Severity:** P2 (Memory leak / Audio overlap)
- **Reproduction:** Ask a long question, receive audio response, then navigate away from the dashboard or close the page.
- **Root Cause:** `window.speechSynthesis` continues speaking audio in the background after the assistant or page is unmounted.
- **Proposed Fix:** Add a cleanup effect on unmount: `return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };`.
- **Confidence:** HIGH.

---

### Finding Z4-04 (P3): Unused `Sparkles` icon import in FloatingAssistant.jsx
- **File & Line:** `frontend/src/components/FloatingAssistant.jsx:2`
- **Severity:** P3 (Minor / Lint warning)
- **Reproduction:** Run `npm run lint`.
- **Root Cause:** `Sparkles` is imported from `lucide-react` but never rendered in the component.
- **Proposed Fix:** Remove `Sparkles` from `lucide-react` import.
- **Confidence:** HIGH.
