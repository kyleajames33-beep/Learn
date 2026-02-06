# Science Learning Hub - Developer Handbook
**The Single Source of Truth for All Developers**

**Project Owner:** Kyle (Science Teacher, Sydney NSW)
**Current Phase:** 01 - Content Core (Phase 00 Complete, Phase 02 Gamification Largely Built)
**Last Updated:** 2026-02-06
**Version:** 2.0.0

---

## CRITICAL: Read This First

**Before you write a single line of code:**
1. Check "Current Status" section below - know what exists
2. Read "Quality Standards" - know what's expected
3. Review "Common Mistakes" - don't repeat history
4. Check your Phase boundaries - the primary need now is **content**, not new features

**When in doubt:** Ask clarifying questions. Never assume.

---

## Project Overview

**What We're Building:**
An interactive HTML-based lesson platform for Years 7-12 Science & HSC Biology/Chemistry that evolves from a simple static site (Phase 00) into a gamified, addictive learning app (Phase 04).

**Why It Matters:**
Students need engaging, mobile-friendly science content that works offline and tracks progress. Teachers need content that's easy to update and deploy.

**Success Vision:**
Students voluntarily open this app daily to "complete their streak" and learn science through mini-games, not just reading.

---

## Current Status

### What's Complete

**Phase 00 - Foundation (DONE)**
- [x] Design system: "Soft Ocean Breeze" — 9 CSS files, 7000+ lines
- [x] PWA shell — service worker + manifest.json
- [x] Lesson template with all interactive components
- [x] 5 sample lessons (exceeded target of 3)
- [x] Progress tracking via LocalStorage (`storage.js` + `progress.js`)
- [x] Mobile-responsive navigation (hamburger, sidebar, breadcrumbs)
- [x] Offline functionality via service worker caching

**Phase 02 - Gamification (LARGELY DONE — built ahead of schedule)**
- [x] XP/Level system — 50 levels, 6 reward types, rank titles (`xp.js`)
- [x] Achievement badges — 20+ badges, 4 rarity tiers (`achievements.js`)
- [x] Daily streak counter — 7-day calendar, milestones, celebrations (`streak.js`)
- [x] Mini-games — drag-drop, flashcards, matching, sequence ordering (`minigames.js`)
- [x] Progress dashboard — analytics, charts, recommendations (`dashboard.js`)
- [x] Interactive diagrams — hotspots, lightbox, zoom, animated particles (`diagrams.js`)
- [x] Achievements showcase page (`hsc-biology/achievements.html`)

### What's In Progress (Your Job)

**Phase 01 - Content Core (CURRENT FOCUS)**
- [x] Module overview/index pages — all 8 created
- [x] Year level homepage — built
- [x] Search functionality — `search.js` implemented
- [x] Breadcrumb navigation — all pages
- [x] "Continue where you left off" — implemented
- [x] Print-friendly styles — implemented
- [ ] **Module 1 lessons: 5 of 30 written** (primary gap)
- [ ] Modules 2-8: mostly stubs (index pages only, minimal lessons)

### What's Still Needed

**Immediate Priority — Content:**
- 25 more Module 1 lessons
- Full content for Modules 2-8
- Year 7-10 science lesson content

**Remaining Feature:**
- [ ] Study reminders / push notifications (last Phase 02 item)

### What's Coming Later
- Phase 03: Firebase backend, user accounts, cross-device sync
- Phase 04: AI tutor, adaptive learning, dark mode

---

## Design System Reference

### Color Palette: "Soft Ocean Breeze"
```css
/* PRIMARY - Whitewashed Ocean Blue */
--primary: #93e4f9;
--primary-light: #caf0f8;
--primary-dark: #67d5ed;

/* SECONDARY - Pale Seafoam (Biology) */
--secondary: #a7f3e0;
--secondary-light: #d0fae8;
--secondary-dark: #7ee8cc;

/* ACCENT - Faded Sunset Peach (Chemistry) */
--accent: #ffc996;
--accent-light: #ffe4cc;
--accent-dark: #ffb366;

/* CRITICAL - Soft Lavender Sky (HSC/Advanced) */
--critical: #d4c5ff;
--critical-light: #e9ddff;
--critical-dark: #b8a3ff;

/* SEMANTIC */
--success: #a7f3d0;
--danger: #ffb3c1;
--warning: #ffd699;
--info: #b3d9f0;

/* BACKGROUNDS */
--bg-main: #f0f9ff;
--bg-surface: #ffffff;
--bg-elevated: #e0f2fe;
--bg-sidebar: #f5fbff;

/* TEXT */
--text-primary: #1e3a5f;
--text-secondary: #4a5f7a;
--text-muted: #6b7fa3;
```

### Typography
- **Font:** Inter (Google Fonts)
- **Base Size:** 16px (15px mobile)
- **Scale:** xs(12), sm(14), base(16), lg(18), xl(20), 2xl(24), 3xl(32)

### Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48px
- **Rule:** All spacing must be multiples of 4px

### Icons
- **Library:** Lucide Icons (local `lucide.min.js` + CDN fallback)
- **Sizing:** sm(16px), md(20px), lg(24px), xl(32px)
- **Usage:** `<i data-lucide="icon-name"></i>` + `lucide.createIcons()`

---

## Technical Architecture (Actual)

### File Structure
```
/Learn/
├── index.html                          # Homepage
├── assets/
│   ├── css/                            # 9 CSS files (7000+ lines total)
│   │   ├── global.css                  # Design tokens & base styles
│   │   ├── components.css              # Reusable UI components
│   │   ├── layout.css                  # Grid & layout systems
│   │   ├── dashboard.css               # Dashboard analytics UI
│   │   ├── xp.css                      # XP/Level system UI
│   │   ├── streak.css                  # Streak tracking UI
│   │   ├── achievements.css            # Badge system UI
│   │   ├── minigames.css              # Mini-game UI
│   │   └── diagrams.css               # Interactive diagrams UI
│   ├── js/                             # 13 JS files
│   │   ├── main.js                     # Page initialization
│   │   ├── storage.js                  # LocalStorage management
│   │   ├── progress.js                 # Progress tracking
│   │   ├── navigation.js              # Mobile nav & sidebar
│   │   ├── search.js                   # Client-side search
│   │   ├── xp.js                       # XP/Level logic
│   │   ├── streak.js                   # Streak management
│   │   ├── achievements.js            # Badge system
│   │   ├── dashboard.js              # Dashboard aggregation
│   │   ├── minigames.js              # 4 game types
│   │   ├── diagrams.js               # Interactive diagrams
│   │   ├── service-worker.js          # PWA offline support
│   │   └── lucide.min.js             # Icon library
│   ├── manifest.json                  # PWA manifest
│   └── images/                         # Icons & illustrations
├── hsc-biology/                        # HSC Biology content
│   ├── index.html                      # 8 module landing page
│   ├── dashboard.html                 # Learning analytics
│   ├── achievements.html              # Badge showcase
│   └── module-1-cells/ ... module-8/  # 8 modules (varying content)
├── year-7/ through year-9/            # Year level stubs
└── Developers Handbook/               # Planning docs
```

### Key Technical Decisions
1. **Multiple CSS Files:** Organized by feature (global, components, layout, gamification)
2. **Modular JS:** Separate files per feature (storage, progress, xp, streaks, etc.)
3. **No Build Step:** Direct HTML/CSS/JS
4. **Relative Paths:** Use `../../` for nested pages
5. **Lazy Caching:** Service worker caches pages as visited
6. **Custom Events:** `lessonCompleted` event dispatched for cross-module communication

---

## Quality Standards (Non-Negotiable)

### Performance
- [x] First Contentful Paint < 1.5s
- [x] Lighthouse Performance > 90
- [x] Total page size < 500KB (per page)

### Accessibility (WCAG AA)
- [x] Skip-to-content links on all pages
- [x] Semantic HTML (nav, main, article, button)
- [x] Keyboard navigable
- [x] Focus indicators visible
- [ ] All images have alt text (verify on new content)
- [ ] Color contrast >= 4.5:1 (verify on new content)

### Mobile-First
- [x] Works at 320px width
- [x] Touch targets >= 44x44px
- [x] No horizontal scroll
- [x] Readable without zoom

---

## Common Mistakes (Don't Repeat)

### Mistake 1: Framework Creep
**What:** Developer added React
**Impact:** Broke deployment, added 200KB
**Rule:** Vanilla only until Phase 03

### Mistake 2: Wrong File Paths
**What:** Used `/assets/css/` (root path)
**Impact:** CSS didn't load locally
**Rule:** Use `../../assets/css/` for nested pages

### Mistake 3: Phase Boundary Violation
**What:** Built login system in Phase 00
**Impact:** No backend to support it
**Rule:** Check phase spec first

### Mistake 4: Desktop First
**What:** Built desktop, "fixed" mobile later
**Impact:** Complete rebuild needed
**Rule:** Mobile-first CSS always

### Mistake 5: Duplicating Existing Features
**What:** Rebuilt gamification that already exists
**Impact:** Wasted time, inconsistent code
**Rule:** Read this handbook FIRST — check what's already built

---

## Your Current Task (Phase 01 - Content Expansion)

### Priority Order:

**Step 1: Write Module 1 Lessons** (Primary Focus)
- [ ] Lessons 6-30 for Module 1: Cells
- Use existing lessons 1-5 as templates
- Follow the 5E-CLT pedagogical framework (see Phase-01-Research/)
- Include: hook, core content, activities, quizzes, worked examples

**Step 2: Expand Other Modules**
- [ ] Module 2: Organisation of Organisms — expand beyond lesson 5
- [ ] Module 5: Heredity — expand beyond lesson 1
- [ ] Modules 3, 4, 6, 7, 8 — first lessons

**Step 3: Year Level Content**
- [ ] Year 7-10 science lessons (currently stubs only)

**Step 4: Study Reminders** (Last Phase 02 item)
- [ ] Push notification system for study reminders

---

## Workflow

### Before Starting
1. Read this handbook
2. Review existing lessons (especially Module 1, Lessons 1-5) for patterns
3. Check the 5E-CLT framework doc in Phase-01-Research/

### While Working
1. Copy an existing lesson as your template
2. Test mobile every 30 min
3. Check console after every change
4. Ensure all interactive components work (quizzes, activities, mark complete)

### Before Submitting
1. Run Quality Standards checklist
2. Test offline mode
3. Test keyboard navigation
4. Check all links

---

## Definition of Done (Per Lesson)

- [ ] All content sections filled with accurate science content
- [ ] Learning intentions and success criteria defined
- [ ] At least 1 activity card with interactive elements
- [ ] At least 5 MC questions with answer key
- [ ] Mark Complete button works and saves progress
- [ ] Sidebar progress updates correctly
- [ ] Mobile layout works at 375px
- [ ] No console errors
- [ ] Navigation links work (prev/next)

---

## Questions?

**When stuck:**
1. Check Component Library spec
2. Look at existing lessons (Module 1, Lessons 1-5)
3. Check the 5E-CLT Pedagogical Framework
4. Ask Kyle (don't guess)

**Next Document:** Read `Step-by-Step .md` for build order, or `Phase-01-Research/5E-CLT-Pedagogical-Framework.md` for lesson design
