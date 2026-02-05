# 🧬 Science Learning Hub - Developer Handbook
**The Single Source of Truth for All Developers**

**Project Owner:** Kyle (Science Teacher, Sydney NSW)  
**Current Phase:** 00 - Foundation  
**Last Updated:** 2026-02-05  
**Version:** 1.0.0

---

## ⚠️ CRITICAL: Read This First

**Before you write a single line of code:**
1. Check "Current Status" section below - know what exists
2. Read "Quality Standards" - know what's expected
3. Review "Common Mistakes" - don't repeat history
4. Check your Phase boundaries - don't build Phase 02 features in Phase 00

**When in doubt:** Ask clarifying questions. Never assume.

---

## 🎯 Project Overview

**What We're Building:**
An interactive HTML-based lesson platform for Years 7-12 Science & HSC Biology/Chemistry that evolves from a simple static site (Phase 00) into a gamified, addictive learning app (Phase 04).

**Why It Matters:**
Students need engaging, mobile-friendly science content that works offline and tracks progress. Teachers need content that's easy to update and deploy.

**Success Vision:**
Students voluntarily open this app daily to "complete their streak" and learn science through mini-games, not just reading.

---

## 📋 Current Status

### ✅ What's Complete
- [x] Master Roadmap (all phases defined)
- [x] Design System: "Soft Ocean Breeze" finalized
- [x] Existing Lesson 1 HTML (reference implementation)
- [ ] Phase 00 Foundation (IN PROGRESS - this is you)

### 🚧 What's In Progress (Your Job)
- [ ] Global CSS with design tokens
- [ ] PWA service worker (lazy loading)
- [ ] Lesson template with interactive components
- [ ] 3 Sample lessons (Module 1: Cells)
- [ ] Progress tracking system
- [ ] Mobile-responsive navigation

### ⏳ What's Coming Later
- Phase 01: 30 full lessons + search
- Phase 02: Gamification (streaks, badges, mini-games)
- Phase 03: Backend, user accounts, sync
- Phase 04: AI tutor, adaptive learning

**DO NOT BUILD FUTURE PHASES NOW.**

---

## 🎨 Design System Reference

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
- **Library:** Lucide Icons (CDN)
- **Sizing:** sm(16px), md(20px), lg(24px), xl(32px)
- **Usage:** `<i data-lucide="icon-name"></i>` + `lucide.createIcons()`

---

## 🏗️ Technical Architecture

### File Structure (Flat - Simplest Approach)
```
science-hub/
├── index.html                      # Homepage
├── assets/
│   ├── css/global.css             # ALL styles
│   ├── js/main.js                 # Core functionality
│   └── js/service-worker.js       # PWA support
├── hsc-biology/
│   ├── index.html                 # Module overview
│   └── module-1-cells/
│       ├── lesson-1.html
│       ├── lesson-2.html
│       └── lesson-3.html
└── _project-management/           # Planning docs
    ├── 00-DEVELOPER-HANDBOOK.md   # This file
    ├── 01-MASTER-ROADMAP.md
    ├── 02-PHASE-00-SPEC.md
    ├── 03-STEP-BY-STEP.md
    └── 04-COMPONENT-LIBRARY.md
```

### Key Technical Decisions
1. **Single CSS File:** All styles in `global.css`
2. **Single JS File:** Core functions in `main.js`
3. **No Build Step:** Direct HTML/CSS/JS
4. **Relative Paths:** Use `./` not `/`
5. **Lazy Loading:** Cache pages as visited

---

## ✅ Quality Standards (Non-Negotiable)

### Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Lighthouse Performance > 90
- [ ] Total page size < 500KB

### Accessibility (WCAG AA)
- [ ] All images have alt text
- [ ] Color contrast ≥ 4.5:1
- [ ] Keyboard navigable
- [ ] Focus indicators visible
- [ ] Semantic HTML

### Mobile-First
- [ ] Works at 320px width
- [ ] Touch targets ≥ 44x44px
- [ ] No horizontal scroll
- [ ] Readable without zoom

---

## 🚨 Common Mistakes (Don't Repeat)

### Mistake 1: Framework Creep
**What:** Developer added React
**Impact:** Broke deployment, added 200KB
**Rule:** Vanilla only until Phase 03

### Mistake 2: Wrong File Paths
**What:** Used `/assets/css/` (root path)
**Impact:** CSS didn't load locally
**Rule:** Use `../../assets/css/`

### Mistake 3: Phase Boundary Violation
**What:** Built login system in Phase 00
**Impact:** No backend to support it
**Rule:** Check phase spec first

### Mistake 4: Desktop First
**What:** Built desktop, "fixed" mobile later
**Impact:** Complete rebuild needed
**Rule:** Mobile-first CSS always

---

## 🎯 Your Current Task (Phase 00)

### Priority Order:

**Step 1: Foundation CSS** (Day 1)
- [ ] All CSS custom properties
- [ ] Reset and base styles
- [ ] Component classes
- [ ] Responsive breakpoints

**Step 2: Core JavaScript** (Day 1-2)
- [ ] StorageManager class
- [ ] Progress tracking
- [ ] Mobile sidebar toggle

**Step 3: Service Worker** (Day 2)
- [ ] Lazy caching
- [ ] Offline fallback

**Step 4: Lesson Template** (Day 2-3)
- [ ] Hero section
- [ ] Learning intentions grid
- [ ] Content accordions
- [ ] Activity cards
- [ ] Assessment questions
- [ ] Mark complete button

**Step 5: 3 Sample Lessons** (Day 3-4)
- [ ] Lesson 1: Full content
- [ ] Lesson 2: Template
- [ ] Lesson 3: Template

**Step 6: Testing** (Day 4-5)
- [ ] Mobile testing
- [ ] Offline testing
- [ ] Lighthouse audit

**Est. Time:** 5 days (40 hours)

---

## 🔄 Workflow

### Before Starting
1. Read this handbook
2. Check `active-status.md`
3. Review Phase spec

### While Working
1. Follow Step-by-Step guide
2. Test mobile every 30 min
3. Check console after every change

### Before Submitting
1. Run Quality Standards checklist
2. Test offline mode
3. Test keyboard navigation
4. Check all links

---

## 🏁 Definition of Done

- [ ] Student can complete Lesson 1
- [ ] Progress persists after refresh
- [ ] Works offline
- [ ] Mobile layout works
- [ ] No console errors
- [ ] Lighthouse >90
- [ ] Kyle approved

---

## 📞 Questions?

**When stuck:**
1. Check Component Library spec
2. Look at existing examples
3. Ask Kyle (don't guess)

**Next Document:** Read `03-STEP-BY-STEP.md`
