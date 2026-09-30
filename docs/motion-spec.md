# Motion Spec — KisanSathi Redesign
> Reconstructed from 33 sequential 1fps frames (s_01–s_33) + 14 key frames.
> Every animation inference is marked **[INFERRED]**.

---

## 1. Scroll-Driven Word Reveal (Statement Paragraph)

**Frames showing it:** s_01 (partial), Frame 01 (mid-reveal), Frame 00 (start state)\
**Section:** Statement Paragraph (second section, white bg)

### What Happens
- The large paragraph text is split into individual words
- On scroll, words "activate" sequentially from left to right, wrapping line by line
- **Inactive words:** `color: #9CA3AF` (muted gray-green) — text exists in DOM but appears faded
- **Active words:** `color: #000000` (dark ink) — appears to "ink in" as viewport scrolls over them
- **Transition:** Each word transitions from muted → dark. Frame 01 shows approximately 20 words dark, rest muted.
- **Direction:** Left-to-right, top-to-bottom (natural reading order)

### Trigger & Implementation
- **Trigger:** Scroll position — `IntersectionObserver` per word, or more likely a scroll-progress-based calculation using the paragraph's bounding rect
- **Property animated:** CSS `color` per `<span>` word element
- **Duration [INFERRED]:** ~0.15s per word, staggered by ~0.04s per word index
- **Easing [INFERRED]:** `ease-in` or `linear` for color transition
- **React implementation:** `framer-motion` with `useScroll` + `useTransform` on each word's color, OR a simpler `IntersectionObserver` that adds class `word--active` on entry with CSS transition. Simpler approach preferred.

### Inline Video Pill
- A small `~48×28px` rounded pill (`border-radius: 24px`) containing a video thumbnail is embedded **inline in the paragraph text** between "by delivering" and "practical tools"
- **[INFERRED]:** This is a `<video>` element styled as inline-block with fixed dimensions, or a static image that mimics a video
- Animates in with the word it's attached to

---

## 2. Blur-In Entrance Animations (Headings, Cards, Sections)

**Frames showing it:** Frame 03 (tabs loading), Frame 05 (carousel blur-in), Frame 08 (FAQ blur-in), s_15 (testimonials blur-in)

### What Happens
- Elements enter from slightly below (`translateY: 20-30px`) AND blurred (`filter: blur(8-12px)`)
- They animate to `translateY: 0, blur: 0` when scrolled into view
- Visible in: section headings, tab cards, carousel cards, testimonial cards, FAQ section

### Trigger & Implementation
- **Trigger:** `IntersectionObserver` — fires when element reaches ~20% into viewport
- **Property animated:** `filter: blur(Xpx)` + `transform: translateY(Ypx)` + `opacity: 0→1`
- **Duration [INFERRED]:** ~0.6–0.8s
- **Easing [INFERRED]:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo — spring-like)
- **Stagger [INFERRED]:** Cards in a row stagger by ~0.1s each
- **React implementation:** `framer-motion` `<motion.div>` with `initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}` and `whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}` + `viewport={{ once: true }}`

### Per-Section Blur Details
| Section | Elements that blur in | Stagger? |
|---|---|---|
| Statement | Full paragraph block | No |
| Features Accordion | Heading + each accordion row | Yes, ~0.1s per row |
| How It Works | Tab cards (left→right) | Yes, ~0.1s per tab |
| Solutions Carousel | Each card | Yes, ~0.15s per card |
| Testimonials | Heading + cards | Yes |
| FAQ | Heading block + FAQ rows | Yes, ~0.08s per row |

---

## 3. Accordion Behavior (Features Section)

**Frames showing it:** Frame 02 (row 1 open), s_05 (row 2 open)

### What Changes When a Row Opens
1. **Icon tile:** Background changes from gray (`#E0E0E0` [INFERRED]) → lime green (`#C6FA44` confirmed)
2. **Plus icon → Minus icon:** `+` (gray) changes to `—` (gray dash). NOT a colored button — the minus is just a gray dash character
3. **Row background:** `#FFFFFF` → `#F3F3F3` (light gray) for the open row
4. **Description text:** Reveals below the title (height: 0 → auto with smooth expand)
5. **Image (right column):** [INFERRED] Crossfades to show content relevant to the active accordion item. Each accordion item has a different image.

### Trigger
- **Click** on any accordion row header
- Only one row open at a time (s_05 shows row 2 open, row 1 reverts to closed state)

### Implementation
- **Property animated:** `max-height` or `height` (accordion expand), `background-color`, icon class swap
- **Duration [INFERRED]:** ~0.3s for height expand, ~0.2s for bg + icon
- **Easing [INFERRED]:** `ease-in-out`
- **React implementation:** Ant Design `<Collapse>` component with custom `expandIcon` prop returning lime tile on active + minus, and custom panel styling via `className`

---

## 4. Tab Behavior (How It Works Section)

**Frames showing it:** Frame 03 (loading), Frame 04 (loaded), s_10 (stable)

### What Changes Between Tabs
1. **Active tab card:** Background → white (`#F5F5F2`), text becomes bolder
2. **Inactive tabs:** Background → light gray (`#F4F4F4`), text muted
3. **Image panel below:** [INFERRED] Image crossfades to show content matching the selected tab
4. **Glass cards** (weather card, AI card): [INFERRED] May update to show data relevant to selected tab

### Trigger
- **Click** on any tab card
- Default active: Tab 1 "Overview / Real-Time Insights"

### Implementation
- **React implementation:** Ant Design `<Tabs>` with custom `renderTabBar` showing the 4 icon cards, OR pure custom `div` tabs if Ant Design's tab bar is too restrictive
- **Duration [INFERRED]:** ~0.25s for active state change, image crossfade ~0.4s

---

## 5. Solutions Carousel (Horizontal + Staggered)

**Frames showing it:** Frame 05 (blur-in), Frame 06 (full), Frame 12 (scroll-back)

### Carousel Behavior
- **Layout:** Portrait cards in a horizontal row, overflow visible (cards bleed off edges)
- **Staggered vertical offsets:** Cards are NOT at the same y-position. Center card is ~30-40px higher (lower `margin-top`) than left/right cards. [INFERRED from visual measurement]
- **Scroll behavior:** [INFERRED] Drag-to-scroll or click-to-advance. No visible prev/next arrows in the carousel itself (arrows only on testimonials).

### Entry Animation (Blur-in)
- Frame 05 vs Frame 06: Cards animate from blurred/transparent → sharp/opaque
- [INFERRED] Each card staggers by ~0.15s

### Implementation
- **React implementation:** `overflow-x: auto` or CSS `scroll-snap` container + manual transform. No Ant Design component matches this. Use CSS-only or a lightweight custom carousel.
- **Stagger:** CSS `animation-delay` per card or framer-motion stagger children

---

## 6. Testimonials (Click Navigation)

**Frames showing it:** Frame 07, Frame 08, Frame 12

### Arrow Navigation
- Two circular arrow buttons (`←` `→`) at bottom-right of the brand strip below cards
- **White fill, black border (~1px), ~48px diameter** (confirmed from crop image)
- [INFERRED] Click `→` to scroll to next testimonial, `←` for previous
- No auto-scroll visible from frames

### Card Transition [INFERRED]
- Cards translate horizontally (`translateX: -100%` for outgoing, `0%` for incoming)
- Duration: ~0.4s, easing: `ease-in-out`

### Implementation
- Manual carousel state with `useState(currentIndex)` and CSS `transform: translateX`
- Or CSS `scroll-behavior: smooth` on container

---

## 7. FAQ Open/Close Behavior

**Frames showing it:** Frame 09 (all closed), Frame 10 (row 2 open)

### What Changes on Open
1. Question text becomes **bold** (font-weight: 400 → 700)
2. Plus icon (`+`, thin dark) → changes to dark green square button (`#116522` fill, `~6px` radius, white `−` inside)
3. Answer text reveals below: smooth height expand
4. First line of answer: dark ink `#000000`. Second line: fading to muted `#9CA3AF` [INFERRED from Frame 10 crop]

### Trigger
- Click anywhere on row
- One row open at a time [INFERRED — only one seen open in any frame]

### Implementation
- Ant Design `<Collapse>` component
- Custom `expandIcon`: render green square with `−` when `isActive`, else thin `+`
- CSS `transition: all 0.3s ease` on panel content

---

## 8. Video Usage Map

| Area | Verdict | Evidence |
|---|---|---|
| Hero background | **Likely video** | Frame 13 shows blurred wheat video; FRAMES.md confirms "source: screen recording of website with video background"; autoPlay loop in existing App.jsx |
| Inline statement pill | **Likely video** | ~48×28px pill thumbnail embedded in paragraph text; too small for standalone video — likely `<video>` or `<img>` |
| How-It-Works image panel | **Likely image** (static) | No blur/motion artifacts visible in field image; consistent across frames |
| Carousel cards | **Likely image** | Static photography, no video artifacts |
| CTA section | **Likely image** | Field crop photo, static |
| Weather glass card icon | **Likely image** (animated emoji/icon) | Sun+cloud+rain icon, could be Lottie animation |

---

## 9. Scroll Feel & Parallax

### Smooth Scrolling
- [INFERRED] The site uses smooth scroll behavior — section transitions appear smooth in video
- Implementation: `html { scroll-behavior: smooth; }` or a JS scroll library

### Parallax [INFERRED]
- **Hero video:** Video does NOT appear to parallax — it's fixed-background or section-scoped
- **No strong parallax evidence** in any frame. CTA field image appears to scroll normally.
- The "white fading to field image" in the CTA section could be a `position: sticky` overlay or a CSS `background-attachment: fixed` effect, not true parallax

### Scroll-to-section
- No sticky navbar behavior visible — navbar is part of hero, scrolls away with hero
- [INFERRED] Navbar may become sticky on scroll (common pattern) — NOT confirmed in frames

---

## 10. Motion Implementation Summary Table

| Animation | Trigger | Property | Duration | Easing | React Tool |
|---|---|---|---|---|---|
| Word reveal | Scroll | `color` per `<span>` | 0.15s + stagger | linear | framer-motion `useScroll` |
| Blur-in entrance | Intersection | `filter` + `translateY` + `opacity` | 0.6-0.8s | ease-out-expo | framer-motion `whileInView` |
| Accordion expand | Click | `max-height`, `background` | 0.3s | ease-in-out | Ant Design `Collapse` |
| Accordion icon | Click | `background` (gray→lime) | 0.2s | ease | CSS class swap |
| Tab switch | Click | `background`, image crossfade | 0.25s | ease | custom `useState` |
| Carousel scroll | Drag/click | `translateX` | 0.4s | ease-in-out | CSS scroll-snap |
| Testimonial nav | Click | `translateX` | 0.4s | ease-in-out | `useState` + CSS transform |
| FAQ expand | Click | `max-height`, icon swap | 0.3s | ease-in-out | Ant Design `Collapse` |
| FAQ icon change | Click | DOM swap (+ → green □−) | 0.2s | ease | custom `expandIcon` |
| Inline video pill | On load | fade-in | 0.4s | ease | CSS fade |
| Smooth scroll | Scroll | native | — | native | `scroll-behavior: smooth` |
