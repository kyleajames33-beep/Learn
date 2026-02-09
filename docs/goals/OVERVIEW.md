# Goal System - Overview

**Purpose:** This document explains how the Science Hub goal tracking system works. Every piece of work maps to this hierarchy.

---

## Goal Hierarchy

```
PHASE (months)
  Contains multiple MILESTONES
    |
    v
MILESTONE (1-2 weeks)
  Contains multiple SPRINT GOALS
    |
    v
SPRINT GOAL (1 week)
  Contains multiple TASKS
    |
    v
TASK (hours)
  Smallest unit of work
```

### Example
```
Phase 1: Content Sprint
  Milestone M1.2: Lessons 6-10 Integrated
    Sprint Goal: Get Lesson 6 rendering with all activities
      Task: Fix comparison-table activity renderer
      Task: Wire up problem-solving tolerance checks
      Task: Mobile QA lesson 6 on 375px
```

---

## Status Definitions

### Phase Status
| Status | Meaning |
|--------|---------|
| `COMPLETE` | All milestones done, exit criteria met |
| `ACTIVE` | Currently being worked on |
| `PLANNED` | Goals defined but work not started |
| `DEFERRED` | Pushed back, not in current scope |

### Milestone Status
| Status | Meaning |
|--------|---------|
| `DONE` | All acceptance criteria met |
| `IN PROGRESS` | Active work happening |
| `BLOCKED` | Cannot proceed, see blocker notes |
| `NOT STARTED` | Queued, waiting for dependencies |

### Task Status
| Status | Meaning |
|--------|---------|
| `[x]` | Complete |
| `[ ]` | Not started or in progress |
| `BLOCKED` | Cannot proceed |
| `SKIPPED` | Decided not to do |

### Lesson Pipeline Status
| Code | Stage | Meaning |
|------|-------|---------|
| `-` | None | Not started |
| `OUTLINE` | 1 | Content outlined |
| `JSON` | 2 | JSON file created, passes validation |
| `RENDER` | 3 | Renders correctly in lesson.html |
| `WIRED` | 4 | All activities functional |
| `QA` | 5 | Passes mobile quality gates |
| `LIVE` | 6 | Deployed and verified on GitHub Pages |
| `BLOCKED` | - | Cannot proceed, see BUG-LOG |

---

## Rules

### Rule 1: One Active Phase at a Time
Only one phase can be `ACTIVE`. All effort goes to the active phase unless there is a critical bug in production.

### Rule 2: Milestones Complete Sequentially
Within a phase, milestones should be completed in order. Don't jump to M1.4 when M1.2 is incomplete, unless M1.2 is `BLOCKED`.

### Rule 3: Phase Gates Are Mandatory
A phase cannot transition to `COMPLETE` until ALL its exit criteria are met. The next phase cannot become `ACTIVE` until the previous phase is `COMPLETE`. See `docs/WORKFLOW.md` for gate criteria.

### Rule 4: Bugs Take Priority
If a `CRITICAL` bug exists in `docs/trackers/BUG-LOG.md`, it takes priority over all feature work.

### Rule 5: Update On Every Change
When you complete a task, immediately update:
- The relevant goal file (check off the task)
- `docs/trackers/MODULE-1-LESSONS.md` (if lesson-related)
- `docs/STATUS.md` (current status)

### Rule 6: Log Milestones
When a milestone is completed, add an entry to `docs/goals/MILESTONE-LOG.md`.

---

## File Map

| File | Contains | Update Frequency |
|------|----------|-----------------|
| `goals/OVERVIEW.md` | This document - how the system works | Rarely |
| `goals/PHASE-0-FOUNDATION.md` | Phase 0 goals (archived, complete) | Never |
| `goals/PHASE-1-CONTENT.md` | Phase 1 goals (active, detailed) | Weekly |
| `goals/PHASE-2-UX.md` | Phase 2 goals (planned) | When Phase 2 approaches |
| `goals/PHASE-3-GAMIFICATION.md` | Phase 3 goals (planned) | When Phase 3 approaches |
| `goals/PHASE-4-GAMES.md` | Phase 4 goals (planned) | When Phase 4 approaches |
| `goals/PHASE-5-BACKEND.md` | Phase 5 goals (planned) | When Phase 5 approaches |
| `goals/MILESTONE-LOG.md` | Historical record of completions | On every milestone completion |
| `trackers/MODULE-1-LESSONS.md` | Per-lesson detailed tracker | Daily |
| `trackers/FEATURE-MATRIX.md` | Feature completion matrix | Weekly |
| `trackers/BUG-LOG.md` | Issues and fixes | As bugs are found/fixed |

---

## How to Use This System in a New Chat

```
1. Read docs/STATUS.md              → "Where are we?"
2. Read the ACTIVE phase goal file  → "What milestone are we on?"
3. Read the relevant tracker        → "What specific task is next?"
4. Do the work
5. Update the tracker + STATUS.md
```

---

**Location:** `/docs/goals/OVERVIEW.md`
**Update Frequency:** When goal system rules change
