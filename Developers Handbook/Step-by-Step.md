# Phase 00: Step-by-Step Build Guide
**Status: COMPLETE** — All Phase 00 steps have been implemented.
**Last Updated:** 2026-02-06

---

> **Note:** This guide documented the Phase 00 build process. All steps below are now complete.
> For current work, see the **Phase 01 Content Guide** at the bottom of this document.

---

## Pre-Flight Checklist

Before starting Step 1, ensure you have:
- [x] Modern code editor (VS Code recommended)
- [x] Chrome/Edge browser with DevTools
- [x] Live Server extension (or equivalent)
- [x] This document and Handbook open side-by-side

**Golden Rule:** Test on mobile viewport (375px) after EVERY component you build.

---

## STEP 1: Create Global CSS (COMPLETE)
**Output:** `assets/css/global.css` + 8 additional CSS files

### What Was Built:
- `global.css` (1595 lines) — Design tokens, base styles, reset, animations
- `components.css` (1388 lines) — All UI components (cards, buttons, badges, etc.)
- `layout.css` (1847 lines) — Grid systems, page layouts, responsive breakpoints
- `dashboard.css` (1024 lines) — Learning analytics dashboard
- `xp.css` (315 lines) — XP/Level system UI
- `streak.css` (307 lines) — Streak tracking UI
- `achievements.css` (543 lines) — Badge system UI
- `minigames.css` (804 lines) — Mini-game UI
- `diagrams.css` (629 lines) — Interactive diagrams UI

### Implementation Notes:
- CSS split into multiple files for maintainability (exceeded original single-file spec)
- All design tokens in `:root` variables (colors, spacing, typography, shadows, radius)
- Mobile-first responsive design with breakpoints at 480px, 768px, 1024px
- Print styles included

### Step 1 Checklist:
- [x] All CSS variables defined
- [x] Mobile-first responsive
- [x] Components render correctly at 375px
- [x] No console errors
- [x] Lighthouse CSS score >90

---

## STEP 2: Core JavaScript (COMPLETE)
**Output:** `assets/js/` — 13 JavaScript files

### What Was Built:

**Storage & Progress:**
- `storage.js` — LocalStorage management with `markLessonComplete()`, `isLessonComplete()`, `getModuleProgress()`, `saveLastVisited()`, `getLastVisited()`
- `progress.js` — Progress bar updates, sidebar completion indicators

**UI Functions:**
- `navigation.js` — Mobile sidebar toggle, close on outside click
- `main.js` — Page initialization, DOMContentLoaded setup, service worker registration
- `search.js` — Client-side lesson search

**Gamification (Phase 02 — built ahead of schedule):**
- `xp.js` — 50-level XP system, 6 reward types, rank titles, level-up animations
- `streak.js` — Daily streak tracking, 7-day calendar, milestones, celebrations
- `achievements.js` — 20+ badges, 4 rarity tiers, auto-unlock checks
- `dashboard.js` — Analytics aggregation, charts, recommendations
- `minigames.js` — 4 game types (drag-drop, flashcard, matching, sequence)
- `diagrams.js` — Hotspot interactions, lightbox, zoom, glossary tooltips

**Other:**
- `service-worker.js` — PWA offline caching
- `lucide.min.js` — Icon library (local copy)

### Step 2 Checklist:
- [x] All functions work in console
- [x] Progress saves to LocalStorage
- [x] Progress persists after refresh
- [x] No JS errors on page load

---

## STEP 3: Service Worker (COMPLETE)
**Output:** `assets/js/service-worker.js` + `assets/manifest.json`

### What Was Built:
- Service worker with install/activate/fetch event handlers
- Cache-as-you-go strategy
- PWA manifest for installability
- Registration in `main.js`

### Step 3 Checklist:
- [x] Service Worker registered
- [x] Works offline after first visit
- [x] Cache updates when content changes

---

## STEP 4: Build Lesson Template (COMPLETE)
**Output:** Working lesson template used across all lessons

### All Sections Implemented:
- [x] **Section A: Head** — Meta tags, Google Fonts, CSS links, Lucide Icons
- [x] **Section B: Top Navigation** — Skip link, logo, mobile toggle, search, breadcrumb
- [x] **Section C: Sidebar** — Module title, progress bar, lesson list, active/completed states
- [x] **Section D: Hero Section** — Badges, title, description, meta info
- [x] **Section E: Learning Intentions Grid** — 3-card grid (intentions, syllabus, criteria)
- [x] **Section F: Engagement Hook** — Lightbulb icon, "Think About This" box
- [x] **Section G: Content Sections** — Section titles, paragraphs, definition boxes, grids
- [x] **Section H: Accordion** — Details/summary with smooth animation
- [x] **Section I: Worked Example** — Step-by-step problems with highlighting
- [x] **Section J: Activity Card** — Teal/purple/orange variants with inputs & validation
- [x] **Section K: Copy Into Books** — Accordion with key definitions
- [x] **Section L: Assessment Questions** — MC with styled radio buttons + short answer
- [x] **Section M: Answer Key** — Collapsed accordion with marking guidelines
- [x] **Section N: Mark Complete** — Button with completed state + visual feedback
- [x] **Section O: Lesson Navigation** — Previous/Next/Module Overview buttons
- [x] **Section P: Footer** — Logo, links, copyright

### Additional Components Built (beyond original spec):
- [x] Mini-game embedding (drag-drop, flashcards, matching, sequence)
- [x] Interactive diagram hotspots
- [x] Image lightbox with zoom
- [x] Glossary term tooltips
- [x] XP notification widget
- [x] Streak display widget
- [x] Achievement notification popup

### Step 4 Checklist:
- [x] All sections render correctly
- [x] Mobile layout works (sidebar becomes drawer)
- [x] All accordions expand/collapse
- [x] Navigation links work
- [x] Lighthouse accessibility score >90

---

## STEP 5: Create Sample Lessons (COMPLETE — exceeded target)
**Output:** 5 lessons in Module 1 (target was 3), plus lessons in Modules 2 and 5

### Lessons Built:

**Module 1: Cells (5 lessons)**
| Lesson | Title | Status |
|--------|-------|--------|
| lesson-1.html | Introduction to Cells | Complete |
| lesson-2.html | Prokaryotic Cells | Complete |
| lesson-3.html | Eukaryotic Cell Structure | Complete |
| lesson-4.html | (Additional lesson) | Complete |
| lesson-5.html | (Additional lesson) | Complete |

**Module 2: Organisation (1 lesson)**
| Lesson | Title | Status |
|--------|-------|--------|
| lesson-5.html | (Continuation lesson) | Complete |

**Module 5: Heredity (1 lesson)**
| Lesson | Title | Status |
|--------|-------|--------|
| lesson-1.html | (Introduction lesson) | Complete |

**Module Index Pages (8 total)**
All 8 HSC Biology module index pages created with descriptions, lesson counts, and navigation.

**Additional Pages Built:**
- `hsc-biology/dashboard.html` — Learning analytics dashboard
- `hsc-biology/achievements.html` — Achievement badge showcase
- `year-7/index.html`, `year-8/index.html`, `year-9/index.html` — Year level stubs

### Step 5 Checklist:
- [x] All lessons have unique content (exceeded 3-lesson target with 7 total)
- [x] Navigation between lessons works
- [x] Each lesson can be marked complete
- [x] Progress shows correctly in sidebar

---

## STEP 6: Testing & Polish (COMPLETE)
**Output:** Production-ready Phase 00

### 6.1 Mobile Testing
- [x] No horizontal scroll at any width
- [x] Sidebar toggle works (hamburger menu)
- [x] Text readable without zoom
- [x] Touch targets easy to hit
- [x] Layout doesn't break
- [x] Images fit screen

### 6.2 Offline Testing
- [x] Service worker registered
- [x] Cached pages load offline
- [x] Previously visited pages available without internet

### 6.3 Accessibility
- [x] Skip-to-content link on all pages
- [x] Semantic HTML throughout (nav, main, article, button)
- [x] Keyboard navigation works
- [x] Focus indicators visible
- [x] ARIA labels where needed

### 6.4 Performance
- [x] PWA manifest + service worker in place
- [x] No render-blocking issues
- [x] Lightweight vanilla JS (no framework overhead)

### Step 6 Checklist:
- [x] All tests pass
- [x] No console errors
- [x] Ready for GitHub Pages deployment

---

## Final Verification (Phase 00)

**Student Journey Test:**
- [x] Open Lesson 1 on phone — works
- [x] Read content, expand accordions — works
- [x] Complete activities — works
- [x] Answer quiz questions — works
- [x] Mark lesson complete — works
- [x] Close and reopen — progress persists

**Offline Test:**
- [x] Visit lessons while online — cached
- [x] Turn off internet, refresh — content visible

**Navigation Test:**
- [x] Lesson 1 → Next → Lesson 2 — works
- [x] Lesson 2 → Next → Lesson 3 — works
- [x] Previous navigation — works
- [x] Module Overview link — works

---

## Emergency Troubleshooting

**Problem:** CSS not loading
**Solution:** Check file paths - use relative paths (`../../assets/css/` for nested pages)

**Problem:** JavaScript not working
**Solution:** Check console for errors. Likely typo or wrong element selector

**Problem:** Mobile layout broken
**Solution:** Ensure mobile-first CSS. Check breakpoints at 480px, 768px, 1024px

**Problem:** Progress not saving
**Solution:** Check LocalStorage in DevTools > Application. Check `storage.js` key names

**Problem:** Offline not working
**Solution:** Verify Service Worker registered in DevTools > Application > Service Workers

**Problem:** Gamification not triggering
**Solution:** Ensure `xp.js`, `streak.js`, `achievements.js` are loaded. Check for `lessonCompleted` event dispatch

---

## Phase 01: Content Expansion Guide (CURRENT)

Now that Phase 00 is complete, the focus shifts to **writing lesson content**.

### How to Create a New Lesson

1. **Copy an existing lesson** (e.g., `module-1-cells/lesson-1.html`)
2. **Update the content:**
   - Change hero section (title, description, badges, lesson number)
   - Write new learning intentions and success criteria
   - Write content sections following 5E-CLT framework
   - Create new activities and quizzes
   - Update answer key
3. **Update navigation:**
   - Set correct previous/next lesson links
   - Update sidebar lesson list
4. **Update module index:**
   - Add the new lesson to the module index page
   - Update lesson count
5. **Test:**
   - Mobile layout at 375px
   - All interactive components work
   - Mark complete saves progress
   - Navigation links work
   - No console errors

### 5E-CLT Lesson Structure
See `Phase-01-Research/5E-CLT-Pedagogical-Framework.md` for the pedagogical design:
1. **Hook** — Curiosity gap + visual
2. **Core Units** — Max 4 chunks per section, visual-first
3. **Deep Dive** — Accordion (student-controlled depth)
4. **Retrieval Arena** — 3 activities (cued recall → recognition → elaboration)
5. **Meta-Cognitive Close** — Copy into books + self-check

### Content Priority
1. Module 1: Cells (Lessons 6-30)
2. Module 2: Organisation (expand from 1 lesson)
3. Module 5: Heredity (expand from 1 lesson)
4. Modules 3, 4, 6, 7, 8 (start from scratch)
5. Year 7-10 science content

---

**END OF STEP-BY-STEP GUIDE**

**Next:** See `Component-Library .md` for component specs, or `Phase-01-Research/5E-CLT-Pedagogical-Framework.md` for lesson design framework
