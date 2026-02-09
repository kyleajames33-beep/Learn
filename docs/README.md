# Science Hub - Project Documentation

## FOR AI AGENTS: START HERE

You are working on **Science Hub**, an interactive HSC Biology learning platform. This folder contains everything you need to know.

**Step 1:** Read `STATUS.md` in this folder. It has:
- **NEXT TASK** — the exact thing to work on right now
- **LAST SESSION LOG** — what the previous AI did, so you have context
- **HANDOFF PROTOCOL** — what you MUST update before ending your session

**Step 2:** If you need more context on the current milestone, read `goals/PHASE-1-CONTENT.md`.

**Step 3:** If you need per-lesson status, read `trackers/MODULE-1-LESSONS.md`.

**Step 4:** Do the work described in NEXT TASK.

**Step 5:** Before ending, follow the HANDOFF PROTOCOL in STATUS.md. This is critical — the next AI depends on it.

---

## Key Constraints (Never Violate)

1. **Vanilla JS only** — no React, Vue, jQuery, or any framework
2. **Mobile-first** — 375px minimum viewport, 44px touch targets
3. **Australian English** — specialised, behaviour, haemoglobin, fibre, centre
4. **Relative paths only** — no absolute paths (site is hosted at GitHub Pages subdirectory)
5. **Zero console errors** — every page must load clean

Full constraints: `MASTER-PLAN.md` Section 2.

---

## File Map

| I need to know... | Read this |
|--------------------|-----------|
| What to do RIGHT NOW | `STATUS.md` → NEXT TASK section |
| What the last AI did | `STATUS.md` → LAST SESSION LOG |
| Current milestone details | `goals/PHASE-1-CONTENT.md` |
| Status of each lesson | `trackers/MODULE-1-LESSONS.md` |
| Open bugs | `trackers/BUG-LOG.md` |
| Feature completion | `trackers/FEATURE-MATRIX.md` |
| How the workflow works | `WORKFLOW.md` |
| Project vision & constraints | `MASTER-PLAN.md` |
| Technical specs | `SPECS.md` |
| Quality checklist | `QUALITY-GATES.md` |
| CSS/JS file organisation | `ARCHITECTURE.md` |
| How Kyle creates content | `CONTENT_WORKFLOW.md` |

---

## Lesson Pipeline

Every lesson goes through 6 stages:

```
OUTLINE → JSON → RENDER → WIRED → QA → LIVE
```

Track progress in `trackers/MODULE-1-LESSONS.md`. Full pipeline details in `WORKFLOW.md`.

---

## Project Status

```
Phase 0: Foundation         COMPLETE
Phase 1: Content Sprint     40% ACTIVE ← we are here
Phase 2: UX & Navigation    PLANNED
Phase 3: Gamification       PLANNED
Phase 4: Mini-Games         PLANNED
Phase 5: Backend & Sync     PLANNED
```

---

## File Structure

```
docs/
├── README.md                  # THIS FILE — start here
├── STATUS.md                  # Current state + NEXT TASK + handoff
├── WORKFLOW.md                # How work gets done
├── MASTER-PLAN.md             # Project constitution
├── SPECS.md                   # Technical specifications
├── QUALITY-GATES.md           # Definition of done
├── ARCHITECTURE.md            # CSS/JS file organisation
├── CONTENT_WORKFLOW.md        # Kyle's content process
├── PAGE_TEMPLATE.html         # Master HTML template
│
├── goals/                     # Goal tracking system
│   ├── OVERVIEW.md           # How goals work
│   ├── PHASE-0-FOUNDATION.md # Archived (complete)
│   ├── PHASE-1-CONTENT.md   # ACTIVE — current milestone details
│   ├── PHASE-2-UX.md        # Planned
│   ├── PHASE-3-GAMIFICATION.md
│   ├── PHASE-4-GAMES.md
│   ├── PHASE-5-BACKEND.md
│   └── MILESTONE-LOG.md     # Completed milestones
│
└── trackers/                  # Granular progress tracking
    ├── MODULE-1-LESSONS.md   # Per-lesson pipeline status
    ├── FEATURE-MATRIX.md     # Feature completion matrix
    └── BUG-LOG.md            # Issues and fixes
```

---

**Last Updated:** 2026-02-09
