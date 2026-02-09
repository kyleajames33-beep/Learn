# Feature Matrix

**Purpose:** Track completion status of all platform features.
**Last Updated:** 2026-02-09

---

## Legend

| Status | Meaning |
|--------|---------|
| SHIPPED | Live on GitHub Pages, working |
| BUILT | Code exists, not fully tested |
| PARTIAL | Partially implemented |
| PLANNED | Designed but not built |
| — | Not applicable to current phase |

---

## Core Platform

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage | SHIPPED | Hero, feature cards, year level cards |
| HSC Biology landing | SHIPPED | 8 module cards, 2 available |
| Module 1 overview | SHIPPED | 20 lesson cards + 10 coming soon |
| Dynamic lesson renderer | BUILT | Renders JSON → full lesson page |
| Lesson sidebar navigation | BUILT | Auto-populated from lesson JSON |
| Breadcrumb navigation | BUILT | Home > HSC Biology > Module > Lesson |
| Search | PARTIAL | UI exists, functionality not wired |
| Mobile responsive layout | SHIPPED | 375px minimum, sidebar collapses |

---

## Lesson Content Rendering

| Feature | Status | Notes |
|---------|--------|-------|
| Hero section | BUILT | Title, badges, description, metadata |
| Content sections (text) | BUILT | Standard content with icons |
| Content sections (grid) | BUILT | Multi-column comparison grids |
| Content sections (diagram) | BUILT | Diagram with description |
| Content sections (accordion) | BUILT | Expandable/collapsible sections |
| Content sections (definition) | BUILT | Definition box styling |
| Content sections (worked-example) | BUILT | Step-by-step examples |
| Info cards (learning intentions, syllabus, success criteria) | BUILT | 3-column card layout |
| Engagement hook | BUILT | Callout box with scenario |
| Copy to Book section | BUILT | Definitions, key points, diagrams |
| Answer key | BUILT | Hidden answers with reveal |
| Mark Complete button | BUILT | Saves to localStorage |
| Previous/Next navigation | BUILT | Links to adjacent lessons |

---

## Activity Types

| Activity Type | Renderer | CSS | Tested | Lessons Using |
|---------------|----------|-----|--------|---------------|
| Matching | BUILT | BUILT | PARTIAL | 1-10 |
| Labelling | BUILT | BUILT | PARTIAL | 1, 2, 4, 6, 7, 8 |
| Ordering | BUILT | BUILT | PARTIAL | 2, 5, 9 |
| Classification | BUILT | BUILT | PARTIAL | 4, 7, 8, 9, 10 |
| Fill-in-the-Blank | BUILT | BUILT | PARTIAL | Various |
| Problem Solving | BUILT | BUILT | NOT TESTED | 3, 6, 7, 9, 10 |
| Comparison Table | BUILT | BUILT | NOT TESTED | 6 |
| Interactive Slider | BUILT | BUILT | NOT TESTED | 8 |
| Tonicity Simulator | BUILT | BUILT | NOT TESTED | 10 |

---

## Assessment

| Feature | Status | Notes |
|---------|--------|-------|
| Multiple choice questions | BUILT | Radio buttons, check answer, feedback |
| Short answer questions | BUILT | Textarea with marking criteria |
| Score tracking | PARTIAL | MCQ scored, SA self-assessed |
| Answer rationale display | BUILT | Shows why correct/incorrect |

---

## Gamification

| Feature | Status | Notes |
|---------|--------|-------|
| XP system | SHIPPED | Tracks experience points per action |
| Streak tracking | SHIPPED | Daily login streaks |
| Achievement system | SHIPPED | Unlockable badges |
| EventBus communication | SHIPPED | Decoupled system communication |
| XP notifications | BUILT | Toast-style popups |
| Achievement gallery | PARTIAL | Page exists, not fully wired |
| Leaderboard | PLANNED | Phase 3 |
| Study plans | PLANNED | Phase 3 |
| Spaced repetition | PLANNED | Phase 3 |

---

## Infrastructure

| Feature | Status | Notes |
|---------|--------|-------|
| Service worker | SHIPPED | Auto-unregisters stale, cache-as-you-go |
| PWA manifest | SHIPPED | Standalone display, icons |
| Cache-busting | SHIPPED | `?v=` params on all assets |
| localStorage persistence | SHIPPED | Progress, XP, streaks, achievements |
| Relative path architecture | SHIPPED | Works on GitHub Pages subdirectory |
| Offline fallback | BUILT | SW returns styled 503 page |
| Validation scripts | PARTIAL | `validate-pages.js` exists |

---

## Pages

| Page | Status | Path |
|------|--------|------|
| Homepage | SHIPPED | `/index.html` |
| HSC Biology landing | SHIPPED | `/hsc-biology/index.html` |
| Module 1 overview | SHIPPED | `/hsc-biology/module-1-cells/index.html` |
| Dynamic lesson page | SHIPPED | `/hsc-biology/lesson.html?lesson=...` |
| Dashboard | PARTIAL | `/hsc-biology/dashboard.html` |
| Achievements | PARTIAL | `/hsc-biology/achievements.html` |
| Lesson Builder | SHIPPED | `/lesson-builder.html` |
| Content Review | SHIPPED | `/content-review.html` |
| Year 7 | PLACEHOLDER | `/year-7/index.html` |
| Year 8 | PLACEHOLDER | `/year-8/index.html` |
| Year 9 | PLACEHOLDER | `/year-9/index.html` |
| Year 10 | PLACEHOLDER | `/year-10/index.html` |
| Modules 2-4, 6-8 | PLACEHOLDER | Coming soon pages |

---

**Location:** `/docs/trackers/FEATURE-MATRIX.md`
**Update Frequency:** Weekly or when features ship
