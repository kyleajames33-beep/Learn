# Science Hub - AI Agent Guide

**Purpose:** Quick-start guide for AI coding agents. Read this first in every new session.

---

## START HERE

**Every new chat session, read these files in order:**

1. `docs/STATUS.md` — Where are we? What's the current task?
2. `docs/AI-START-HERE.md` — Full workflow cycle (read this next!)
3. `docs/goals/PHASE-1-CONTENT.md` — What milestone are we working on?
4. `docs/trackers/MODULE-1-LESSONS.md` — What's the status of each lesson?

**Then proceed with the highest-priority task from STATUS.md.**

---

## Project Identity

| Attribute | Value |
|-----------|-------|
| **Name** | Science Hub |
| **Type** | Interactive HSC Biology Learning Platform |
| **Stack** | Vanilla JS, LocalStorage, GitHub Pages |
| **Phase** | Phase 1 Enhancement - Module 1 V2.0 (Gold Standard lessons) |
| **URL** | `https://kyleajames33-beep.github.io/Learn/` |

---

## IMMUTABLE CONSTRAINTS (Never Violate)

1. **NO FRAMEWORKS** — Vanilla JS only until Phase 5 (no React, Vue, jQuery)
2. **Mobile-First** — 375px minimum, 44px touch targets
3. **Australian English** — specialised, behaviour, haemoglobin, fibre, centre
4. **WebP Images** — <100KB each
5. **Zero Console Errors** — every page loads clean
6. **Relative Paths Only** — no absolute paths (breaks GitHub Pages)

---

## Documentation System

| Question | File |
|----------|------|
| Where are we right now? | `docs/STATUS.md` |
| How does work get done? | `docs/WORKFLOW.md` |
| What are the current goals? | `docs/goals/PHASE-1-CONTENT.md` |
| What's each lesson's status? | `docs/trackers/MODULE-1-LESSONS.md` |
| Are there open bugs? | `docs/trackers/BUG-LOG.md` |
| What features are done? | `docs/trackers/FEATURE-MATRIX.md` |
| What are the technical specs? | `docs/SPECS.md` |
| What's the quality bar? | `docs/QUALITY-GATES.md` |
| How are files organised? | `docs/ARCHITECTURE.md` |
| What's the project vision? | `docs/MASTER-PLAN.md` |
| How does the goal system work? | `docs/goals/OVERVIEW.md` |

---

## Key Code Files

```
/hsc-biology/lesson.html              # Dynamic lesson page
/hsc-biology/js/lesson-renderer.js    # Core rendering engine
/hsc-biology/js/lesson-data-schema.js # JSON validation
/assets/js/main.js                    # Service worker, nav, init
/hsc-biology/data/lessons/*.json      # Lesson data (served to browser)
/data/lessons/*.json                  # Lesson data (source of truth)
```

---

## Lesson Pipeline Stages

Every lesson goes through these stages (see `docs/WORKFLOW.md`):

```
OUTLINE → JSON → RENDER → WIRED → QA → LIVE → V2.0
```

Update `docs/trackers/MODULE-1-LESSONS.md` when a lesson changes stage.

---

## Session End Checklist

Before ending every session:
- [ ] **Run `node scripts/run-all-checks.js`** — fix any errors
- [ ] All changed files committed
- [ ] `docs/STATUS.md` updated (include verification result)
- [ ] Relevant tracker files updated
- [ ] No unlogged critical bugs

---

## Automated Verification (MANDATORY)

Run before every commit: `node scripts/run-all-checks.js`

Individual scripts:
```bash
node scripts/validate-pages.js      # HTML structure checks
node scripts/validate-lessons.js     # JSON schema + content quality
node scripts/validate-spelling.js    # Australian English check
```

Exit code 0 = passed. Exit code 1 = fix errors before committing.

---

## Quality Checklist (Before Committing)

- [ ] `node scripts/run-all-checks.js` passes (exit code 0)
- [ ] **If CSS/JS changed:** `node scripts/bump-versions.js` (updates all ?v= params)
- [ ] Zero console errors
- [ ] Works on 375px width
- [ ] Australian spelling
- [ ] Touch targets 44px+
- [ ] Relative paths (no `/assets/...`)

Full checklist: `docs/QUALITY-GATES.md`

---

**Quick Loop:** Read STATUS → Do work → Update trackers → Commit → Repeat
