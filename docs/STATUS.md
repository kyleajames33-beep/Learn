# Science Hub - Current Status

**Last Updated:** 2026-02-09
**Active Phase:** Phase 1 - Content Sprint (Module 1)
**Active Milestone:** M1.1 (Lessons 1-5) + M1.2 (Lessons 6-10)
**Sprint Goal:** Get Lessons 1-10 rendering correctly with all activities working

> **New chat?** Read this file, then `docs/goals/PHASE-1-CONTENT.md` for detailed goals.

---

## Where We Are

```
Phase 1 Progress: ████████░░░░░░░░░░░░ 40%

Lessons with JSON:     20/25
Lessons at RENDER+:     0/25
Lessons at LIVE:        0/25
Critical bugs:          0
```

**Current focus:** Verify that existing lessons actually render and work in the browser. JSON exists for lessons 1-20 but the render pipeline (stages 3-6) hasn't been verified for most of them.

---

## Today's Priorities

1. **Test lessons 1-5 in browser** — verify hero, content, activities, assessment all display
2. **Test lessons 6-10 in browser** — verify new activity types (comparison table, slider, simulator)
3. **Fix any rendering issues found**
4. **Mobile QA on 375px viewport**

---

## Active Files

| File | What's Happening |
|------|-----------------|
| `hsc-biology/lesson.html` | Lesson renderer page (recently fixed cache-busting) |
| `hsc-biology/js/lesson-renderer.js` | Core rendering engine |
| `hsc-biology/js/lesson-data-schema.js` | Validation (updated to accept both ID formats) |
| `assets/js/main.js` | Service worker fix deployed |

---

## Blockers

None currently.

---

## Recent Fixes (2026-02-09)

- Fixed service worker 404 (wrong path resolution)
- Fixed content invisible below hero (CSS `.reveal` opacity bug)
- Fixed schema validation rejecting `mod1-lessonXX` IDs
- Added auto-unregister for stale service workers
- Bumped all cache-busting versions
- Unlocked all lessons (prerequisite check disabled)

---

## Links

| Resource | Location |
|----------|----------|
| Active phase goals | `docs/goals/PHASE-1-CONTENT.md` |
| Lesson tracker | `docs/trackers/MODULE-1-LESSONS.md` |
| Bug log | `docs/trackers/BUG-LOG.md` |
| Feature matrix | `docs/trackers/FEATURE-MATRIX.md` |
| Workflow | `docs/WORKFLOW.md` |
| Master plan | `docs/MASTER-PLAN.md` |

---

**Update Frequency:** Daily (minimum)
**Owner:** AI (Project Manager)
