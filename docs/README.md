# Science Hub - Project Documentation

## FOR AI AGENTS: AUTONOMOUS DEVELOPMENT CYCLE

**You are working on Science Hub**, an interactive HSC Biology & Chemistry learning platform (400 lessons across 16 modules).

### 🔄 **AUTONOMOUS WORKFLOW SYSTEM**

This project has a **fully autonomous closed-loop development system**:

1. **Read one file:** `AI-START-HERE.md` (in this folder)
2. **Follow the 6-step cycle:** It orchestrates everything automatically
3. **Tests auto-validate:** Code won't commit until it passes
4. **Self-correcting:** If tests fail, you fix and re-test
5. **Self-documenting:** You update STATUS.md before finishing
6. **Report completion:** Tell user what was done and what's next

**Start here:** Read **[AI-START-HERE.md](AI-START-HERE.md)** now.

---

### 📋 **QUICK START (If You Want Manual Control)**

**Step 1:** Read `STATUS.md` → **NEXT TASK** section (what to do right now)

**Step 2:** Read `COMMON-MISTAKES.md` (known bugs to avoid — saves 8 hours of debugging)

**Step 3:** Read `WORKFLOW.md` Section 1 (session workflow) and Section 8 (testing system)

**Step 4:** Do the work described in NEXT TASK

**Step 5:** Run tests: `node scripts/run-all-checks.js` (fix until it passes)

**Step 6:** Update STATUS.md LAST SESSION LOG and commit

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
| Status of Module 1 lessons | `trackers/MODULE-1-LESSONS.md` |
| Module 2-8 lesson sequences | `trackers/MODULE-2-LESSONS.md` through `MODULE-8-LESSONS.md` |
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
Phase 1: Content Sprint     40% ACTIVE ← we are here (Bio Module 1: 25 lessons)
Phase 2: UX & Navigation    PLANNED
Phase 3: Gamification       PLANNED
Phase 4: Mini-Games         PLANNED
Phase 5: Backend & Sync     PLANNED
Phase 7: Content Scale      PLANNED (375 lessons mapped, ready to build)
Phase 9: Subject Expansion  PLANNED (HSC Chemistry: 200 lessons mapped)
```

**Total Scope:** 
- 200 HSC Biology lessons (Modules 1-8) ✅ MAPPED
- 200 HSC Chemistry lessons (Modules 1-8) ✅ MAPPED
- **400 Total Lessons** across both subjects

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
    # HSC Biology (200 lessons)
    ├── MODULE-1-LESSONS.md   # Module 1: Cells (ACTIVE)
    ├── MODULE-2-LESSONS.md   # Module 2: Organisation
    ├── MODULE-3-LESSONS.md   # Module 3: Biological Diversity
    ├── MODULE-4-LESSONS.md   # Module 4: Ecosystem Dynamics
    ├── MODULE-5-LESSONS.md   # Module 5: Heredity (Year 12)
    ├── MODULE-6-LESSONS.md   # Module 6: Genetic Change
    ├── MODULE-7-LESSONS.md   # Module 7: Infectious Disease
    ├── MODULE-8-LESSONS.md   # Module 8: Non-Infectious Disease
    # HSC Chemistry (200 lessons)
    ├── CHEM-MODULE-1-LESSONS.md   # Module 1: Properties & Structure
    ├── CHEM-MODULE-2-LESSONS.md   # Module 2: Quantitative Chemistry
    ├── CHEM-MODULE-3-LESSONS.md   # Module 3: Reactive Chemistry
    ├── CHEM-MODULE-4-LESSONS.md   # Module 4: Drivers of Reactions
    ├── CHEM-MODULE-5-LESSONS.md   # Module 5: Equilibrium & Acids
    ├── CHEM-MODULE-6-LESSONS.md   # Module 6: Acid-Base Reactions
    ├── CHEM-MODULE-7-LESSONS.md   # Module 7: Organic Chemistry
    ├── CHEM-MODULE-8-LESSONS.md   # Module 8: Applying Chemical Ideas
    ├── FEATURE-MATRIX.md     # Feature completion matrix
    └── BUG-LOG.md            # Issues and fixes
```

---

**Last Updated:** 2026-02-09
