# Milestone Log

**Purpose:** Historical record of every completed milestone. Updated whenever a milestone transitions to `DONE`.

---

## Completed Milestones

### Phase 0: Foundation

| Milestone | Completed | Notes |
|-----------|-----------|-------|
| M0.1: Schema & Validation | 2026-02-08 | `lesson-data-schema.js` validates all required fields |
| M0.2: Lesson Renderer | 2026-02-09 | `lesson-renderer.js` v1.1.0, 8 activity types |
| M0.3: Gamification Engine | 2026-02-08 | XP, streaks, achievements all loading |
| M0.4: CSS Architecture | 2026-02-08 | 9 CSS files, mobile-first |
| M0.5: Infrastructure | 2026-02-09 | Service worker, PWA manifest, cache-busting |
| M0.6: Initial Content | 2026-02-09 | Lessons 1-20 JSON created |

**Phase 0 completed:** 2026-02-09

---

### Phase 1: Content Sprint (In Progress)

| Milestone | Completed | Notes |
|-----------|-----------|-------|
| M1.1: Lessons 1-5 Production-Ready | — | In progress |
| M1.2: Lessons 6-10 Integrated | — | In progress |
| M1.3: Lessons 11-15 Created | — | Not started |
| M1.4: Lessons 16-20 Created | — | Not started |
| M1.5: Lessons 21-25 Created | — | Not started |
| M1.6: Full Module QA | — | Not started |

---

## Key Decisions Made During Milestones

| Date | Milestone | Decision |
|------|-----------|----------|
| 2026-02-08 | M0.1 | Dual lesson ID format accepted (old + new) |
| 2026-02-09 | M0.2 | 8 activity types built into renderer |
| 2026-02-09 | M0.5 | Service worker uses `document.currentScript` capture pattern |
| 2026-02-09 | M0.5 | Auto-unregister stale service workers on load |
| 2026-02-09 | M1.1 | Prerequisite locking disabled during development |

---

## Bugs Fixed During Milestones

| Date | Milestone | Bug | Fix |
|------|-----------|-----|-----|
| 2026-02-09 | M0.5 | Service worker 404 (wrong path) | Capture `document.currentScript.src` synchronously |
| 2026-02-09 | M0.5 | Stale SW couldn't be unregistered | Auto-unregister all SWs before re-registering |
| 2026-02-09 | M0.4 | `.reveal` CSS hid content (opacity: 0) | Changed to `opacity: 1` default, cache-busted CSS |
| 2026-02-09 | M0.1 | `mod1-lessonXX` IDs rejected by validator | Updated regex pattern to accept both formats |

---

**Location:** `/docs/goals/MILESTONE-LOG.md`
**Update Frequency:** On every milestone completion
