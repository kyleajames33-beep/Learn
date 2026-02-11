# Technical Debt Tracker

**Created:** 2026-02-11
**Purpose:** Track infrastructure issues that will cause bugs at scale (400 lessons).

---

## CRITICAL — Fixed

| # | Issue | Files | Status | Fixed Date |
|---|-------|-------|--------|------------|
| 1 | Storage prefix mismatch (`scienceHub_` vs `sh_`) — unified to `sh_` with auto-migration of old keys | storage.js | FIXED | 2026-02-11 |
| 2 | lesson.html missing gamification scripts — added storage, event-bus, xp, streak, achievements, gamification-engine | hsc-biology/lesson.html | FIXED | 2026-02-11 |
| 3 | Absolute path `/Learn/hsc-biology/...` in module-router — changed to relative `../hsc-biology/...` | assets/js/module-router.js | FIXED | 2026-02-11 |
| 4 | dashboard.js references `currentXP` (undefined) — changed to `totalXP` matching XPManager.getXPData() | assets/js/dashboard.js | FIXED | 2026-02-11 |
| 5 | Dead legacy gamification handler calling non-existent UI methods — removed entirely | assets/js/main.js | FIXED | 2026-02-11 |

## IMPORTANT — Fixed

| # | Issue | Files | Status | Fixed Date |
|---|-------|-------|--------|------------|
| 8 | CSS variable conflicts (lesson-v2.css `:root` overwrites global.css) — scoped to `.lesson-content` | assets/css/lesson-v2.css | FIXED | 2026-02-11 |
| 9 | lesson.html missing gamification CSS + V2 CSS — added xp.css, streak.css, achievements.css, lesson-v2.css statically | hsc-biology/lesson.html | FIXED | 2026-02-11 |
| 10 | `bindV2ActivityHandlers()` redundant — only handled MCQ, but `attachEventListeners()` already covers all types. Removed entirely | lesson-renderer.js | FIXED | 2026-02-11 |
| 11 | Validation scripts not V2-aware — schema required V1-only `contentSections`, validator warned on V2 lessons. Updated schema + validator to detect V2 format and skip V1-only checks | lesson-data-schema.js, validate-lessons.js | FIXED | 2026-02-11 |
| 15 | V1/V2 detection fragile — added `version: 2` support plus console warning on contentHTML-only fallback | lesson-renderer.js | FIXED | 2026-02-11 |
| 16 | FOUC on V2 CSS (was loaded dynamically) — now included statically in lesson.html `<head>` | hsc-biology/lesson.html | FIXED | 2026-02-11 |
| 17 | ui-controller.js not loaded on lesson.html — students earned XP/achievements/streaks with ZERO visual feedback. Added script tag | hsc-biology/lesson.html | FIXED | 2026-02-11 |
| 18 | `knowledge_seeker` badge unwired — `deep-dive:opened` events were emitted but gamification engine didn't subscribe. Added handler + EventBus subscription | gamification-engine.js | FIXED | 2026-02-11 |
| 19 | `SUPPORTED_ACTIVITY_TYPES` missing V2 types — added `problemSolving`, `comparison-table`, `interactive-slider`, `tonicity-simulator`, `multiple-choice` | validate-lessons.js | FIXED | 2026-02-11 |
| 7 | Two lesson loading patterns — deleted static lesson-1.html through lesson-5.html, now unified on dynamic lesson.html?lesson=X pattern. Updated dashboard.js, content-review.html, module-1-cells/index.html links | hsc-biology/ | FIXED | 2026-02-11 |

## CRITICAL — Backlog

| # | Issue | Files | Notes |
|---|-------|-------|-------|
| 6 | 4 duplicate progress tracking systems | storage.js, main.js, progress.js, gamification-engine.js | Needs careful consolidation — Phase 2 |


## IMPORTANT — Fixed

| # | Issue | Files | Status | Fixed Date |
|---|-------|-------|--------|------------|
| 23 | CSS variables undefined — layout.css & components.css referenced `--wide`, `--weight-bold`, `--leading-relaxed`, `--text-4xl`, `--space-12`+ etc. but global.css never defined them, causing all styles to silently fall back to browser defaults | assets/css/global.css | FIXED | 2026-02-11 |
| 24 | `.module-hero*` CSS classes missing — module-1 index used `.module-hero`, `.module-hero-title`, `.module-hero-meta` etc. with zero CSS rules, so hero section was completely unstyled | assets/css/layout.css | FIXED | 2026-02-11 |
| 25 | Home page hero stats unstyled — `.stat-item` in `.hero-stats` had no visual container, looked like plain text. Added card treatment with background, border, shadow, hover | assets/css/layout.css | FIXED | 2026-02-11 |
| 26 | Stale cache buster — all HTML files used `?v=1770755753` (stale), updated to `?v=1770791403` across 22 files | all HTML files | FIXED | 2026-02-11 |

## IMPORTANT — Backlog

| # | Issue | Files | Notes |
|---|-------|-------|-------|
| 12 | Module router hardcoded to hsc-biology | assets/js/module-router.js | Fix when adding other subjects |
| 13 | No cross-module navigation | module-router.js | Phase 2 |
| 14 | No data migration utility for storage key changes | — | Phase 5 |

## NICE-TO-HAVE — Backlog

| # | Issue | Files | Notes |
|---|-------|-------|-------|
| 20 | `speed_reader` badge: no timing tracked (needs lesson start timestamp) | gamification-engine.js | Track page load → completion time |
| 21 | `completionist` badge: `allSectionsRead` never populated | gamification-engine.js | Needs intersection observer on sections |
| 22 | Confetti animation: CSS exists but no JS trigger | streak.css | Build confetti spawner for milestones/achievements |

---

**Update Frequency:** When fixing or discovering tech debt
**Owner:** AI Developer
