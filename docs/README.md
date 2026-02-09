# Science Hub - Documentation Hub

This folder is the project's brain. Every question about the project maps to a specific file.

---

## Quick Start (New Chat Session)

```
1. Read docs/STATUS.md                → Where are we right now?
2. Read docs/goals/PHASE-1-CONTENT.md → What milestone are we on?
3. Read docs/trackers/MODULE-1-LESSONS.md → What specific task is next?
4. Do the work.
5. Update STATUS.md + relevant tracker.
```

---

## File Map

### "Where / What / How" Files

| Question | File | Updated |
|----------|------|---------|
| Where are we right now? | `STATUS.md` | Daily |
| What's the project vision? | `MASTER-PLAN.md` | Rarely |
| How does work get done? | `WORKFLOW.md` | Rarely |

### Goal Files (`goals/`)

| Question | File | Updated |
|----------|------|---------|
| How does the goal system work? | `goals/OVERVIEW.md` | Rarely |
| What did Phase 0 achieve? | `goals/PHASE-0-FOUNDATION.md` | Never (archived) |
| What are we building right now? | `goals/PHASE-1-CONTENT.md` | Weekly |
| What's planned for UX phase? | `goals/PHASE-2-UX.md` | When approached |
| What's planned for gamification? | `goals/PHASE-3-GAMIFICATION.md` | When approached |
| What's planned for mini-games? | `goals/PHASE-4-GAMES.md` | When approached |
| What's planned for backend? | `goals/PHASE-5-BACKEND.md` | When approached |
| What milestones are completed? | `goals/MILESTONE-LOG.md` | On completion |

### Tracker Files (`trackers/`)

| Question | File | Updated |
|----------|------|---------|
| What's the status of each lesson? | `trackers/MODULE-1-LESSONS.md` | Daily |
| What features are done? | `trackers/FEATURE-MATRIX.md` | Weekly |
| Are there open bugs? | `trackers/BUG-LOG.md` | As found/fixed |

### Reference Files

| Question | File | Updated |
|----------|------|---------|
| What are the technical specs? | `SPECS.md` | When specs change |
| What's the quality bar? | `QUALITY-GATES.md` | When criteria change |
| How are files organised? | `ARCHITECTURE.md` | When structure changes |
| How does Kyle create content? | `CONTENT_WORKFLOW.md` | Rarely |
| What's the HTML template? | `PAGE_TEMPLATE.html` | Rarely |

---

## Current Project Status

```
Phase 0: Foundation         COMPLETE
Phase 1: Content Sprint     40% ACTIVE
Phase 2: UX & Navigation    PLANNED
Phase 3: Gamification       PLANNED
Phase 4: Mini-Games         PLANNED
Phase 5: Backend & Sync     PLANNED
```

**Active Milestone:** M1.1 (Lessons 1-5 production-ready) + M1.2 (Lessons 6-10 integrated)

---

## File Structure

```
docs/
├── README.md                  # This file - documentation hub
├── MASTER-PLAN.md             # Project constitution
├── WORKFLOW.md                # How work gets done
├── STATUS.md                  # Current state (update daily)
├── SPECS.md                   # Technical specifications
├── QUALITY-GATES.md           # Definition of done
├── ARCHITECTURE.md            # CSS/JS file organisation
├── CONTENT_WORKFLOW.md        # Kyle's content process
├── PAGE_TEMPLATE.html         # Master HTML template
│
├── goals/                     # Goal tracking system
│   ├── OVERVIEW.md           # How goals work
│   ├── PHASE-0-FOUNDATION.md # Archived (complete)
│   ├── PHASE-1-CONTENT.md   # ACTIVE - Module 1 goals
│   ├── PHASE-2-UX.md        # Planned
│   ├── PHASE-3-GAMIFICATION.md # Planned
│   ├── PHASE-4-GAMES.md     # Planned
│   ├── PHASE-5-BACKEND.md   # Planned
│   └── MILESTONE-LOG.md     # Completed milestones
│
└── trackers/                  # Granular progress tracking
    ├── MODULE-1-LESSONS.md   # Per-lesson status
    ├── FEATURE-MATRIX.md     # Feature completion
    └── BUG-LOG.md            # Known issues
```

---

**Last Updated:** 2026-02-09
