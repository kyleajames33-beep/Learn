# Science Hub - Current Status

**Last Updated:** 2026-02-09
**Active Phase:** Phase 1 - Content Sprint (Module 1)
**Active Milestone:** M1.1 (Lessons 1-5) + M1.2 (Lessons 6-10)

---

## NEXT TASK

**⚠️ IMPORTANT: If you're a new AI starting a cycle, read `docs/AI-START-HERE.md` first!**

**Do this first. This is the single most important thing to work on right now.**

### Task: Fix Unsupported Activity Types (Blockers)

**Current state:** Smoke test shows 6 lessons have unsupported activity types:
- mod1-lesson06: `comparison-table`, `problemSolving`
- mod1-lesson07: `problemSolving`
- mod1-lesson08: `interactive-slider`
- mod1-lesson09: `problemSolving`
- mod1-lesson10: `problemSolving`, `tonicity-simulator`
- mod1-lesson14: `content`

**Your task:**
1. For each failing lesson, open the JSON file
2. Find activities with unsupported types
3. Change to a supported type: `matching`, `fill-blank`, `classification`, `ordering`, `labeling`, `fillBlank`, or `calculation`
4. Preserve the learning objective, just change the activity mechanism
5. Run `node scripts/smoke-test.js` after each fix
6. Continue until all lessons pass

**Supported activity types ONLY:**
- `matching` — Match pairs
- `fill-blank` — Fill in blanks in text
- `classification` — Sort items into categories
- `ordering` — Put items in correct sequence
- `labeling` — Label diagram parts
- `fillBlank` — Same as fill-blank (legacy)
- `calculation` — Math/science calculations

**When all smoke tests pass:**
1. Run full test suite: `node scripts/run-all-checks.js`
2. Update `docs/trackers/MODULE-1-LESSONS.md` with new statuses
3. Update this file's LAST SESSION LOG
4. Commit and report completion

**Pipeline target:** Move lessons from `JSON` stage to `RENDER` stage.
**Key files:** `hsc-biology/data/lessons/mod1-lesson*.json`
**Constraints:** Zero console errors. Only supported activity types. Australian English.

---

## LAST SESSION LOG

**Date:** 2026-02-10
**AI:** Claude Sonnet 4.5
**Session:** Autonomous workflow + self-improving mistake documentation

**What was done:**
1. ✅ Built complete testing system:
   - `scripts/score-lessons.js` — Quality scoring (0-100) with regression detection
   - `scripts/smoke-test.js` — Fast 2-3 second "does it work?" verification
   - `assets/js/error-tracker.js` — Client-side error logging to localStorage
   - `scripts/read-errors.js` — Production error analysis
   - `scripts/system-check.js` — System readiness verification
   - Updated `scripts/run-all-checks.js` to include smoke test + quality scorer

2. ✅ Built autonomous AI workflow system:
   - `PROMPT.md` — Single prompt to send to any AI to start a cycle
   - `docs/AI-START-HERE.md` — Complete workflow orchestration (6-step cycle)
   - `docs/COMMON-MISTAKES.md` — Known bugs and solutions (18 documented mistakes)
   - Updated `docs/WORKFLOW.md` with error tracking and debugging workflow
   - Updated `docs/STATUS.md` with clearer NEXT TASK directives

3. ✅ Added self-improving documentation system:
   - Updated `docs/AI-START-HERE.md` STEP 4 with instructions to add new bugs to COMMON-MISTAKES.md
   - Updated `docs/WORKFLOW.md` Session End Checklist to mandate documenting new bugs
   - Updated `docs/STATUS.md` HANDOFF PROTOCOL to include mistake documentation requirement
   - Updated `PROMPT.md` to mention adding new bugs to the knowledge base
   - Added detailed "HOW TO ADD NEW MISTAKES" section to COMMON-MISTAKES.md with format template
   - System now automatically grows smarter as AIs encounter and solve new issues

4. ✅ Integrated all 16 module lesson sequences:
   - Bio modules 2-8: 175 lessons planned (docs/trackers/MODULE-*.md)
   - Chem modules 1-8: 200 lessons planned (docs/trackers/CHEM-MODULE-*.md)
   - Total: 400 lessons across HSC Biology & Chemistry

5. ✅ Fixed caching issues completely:
   - Created `scripts/bump-versions.js` — Automated cache-busting
   - Fixed service worker to use network-first for CSS/JS (not stale-while-revalidate)
   - Added cache-control meta tags to index.html, hsc-biology/index.html, lesson.html
   - Bumped 212 CSS/JS references across 27 HTML files

**Test Results:**
- ✅ System check passed: All 8 scripts, 6 docs, 3 trackers verified
- ⚠️  Smoke test: 39/45 lessons pass (6 have unsupported activity types — see NEXT TASK)
- ⚠️  Quality score: 84.0/100 average (baseline: 91.6/100) — 7.6 point regression detected
- ⚠️  Assessment quality: 67.3% (lowest category, needs improvement)

**Issues Found:**
- 6 lessons use unsupported activity types (comparison-table, problemSolving, interactive-slider, tonicity-simulator, content)
- Quality regression: lessons 6+ score lower than baseline (lessons 1-5)
- Many lessons only have 2 activities (recommend 4)
- Some MCQs have incorrect answer keys (correctAnswer not in options)

**What was NOT done:**
- Unsupported activity types not yet fixed (blocking smoke test)
- Quality regression not yet addressed
- Lessons 21-25 JSON does not exist yet
- Browser testing of deployed lessons pending

**New Content Stored:**
- ✅ HSC Biology Module 2 (25 lessons) — Organisation of Living Things
- ✅ HSC Biology Module 3 (25 lessons) — Biological Diversity  
- ✅ HSC Biology Module 4 (25 lessons) — Ecosystem Dynamics
- ✅ HSC Biology Module 5 (25 lessons) — Heredity (Year 12)
- ✅ HSC Biology Module 6 (25 lessons) — Genetic Change
- ✅ HSC Biology Module 7 (25 lessons) — Infectious Disease
- ✅ HSC Biology Module 8 (25 lessons) — Non-Infectious Disease
- ✅ HSC Chemistry Module 1 (25 lessons) — Properties & Structure of Matter
- ✅ HSC Chemistry Module 2 (25 lessons) — Quantitative Chemistry
- ✅ HSC Chemistry Module 3 (25 lessons) — Reactive Chemistry
- ✅ HSC Chemistry Module 4 (25 lessons) — Drivers of Reactions
- ✅ HSC Chemistry Module 5 (25 lessons) — Equilibrium & Acid Reactions
- ✅ HSC Chemistry Module 6 (25 lessons) — Acid-Base Reactions
- ✅ HSC Chemistry Module 7 (25 lessons) — Organic Chemistry
- ✅ HSC Chemistry Module 8 (25 lessons) — Applying Chemical Ideas

**Total Scope: 400 lessons across HSC Biology & Chemistry (16 modules)

**Open issues:** See `docs/trackers/BUG-LOG.md` — 0 critical, 1 minor (duplicate render), 1 info

---

## WHERE WE ARE

```
Phase 1 Progress: ████████░░░░░░░░░░░░ 40%

Lessons with JSON:     20/25
Lessons at RENDER+:     0/25
Lessons at LIVE:        0/25
Critical bugs:          0
```

---

## PRIORITY QUEUE

If the NEXT TASK is done or blocked, work down this list:

1. ~~Test & fix Lessons 1-5 rendering~~ (NEXT TASK)
2. Test & fix Lessons 6-10 rendering (new activity types)
3. Mobile QA all working lessons at 375px
4. Create JSON for Lessons 21-25
5. Copy mod1-lesson20.json to hsc-biology/data/lessons/

---

## BLOCKERS

None currently.

---

## REFERENCE LINKS

| Resource | File |
|----------|------|
| Active phase goals & milestones | `docs/goals/PHASE-1-CONTENT.md` |
| Per-lesson status tracker | `docs/trackers/MODULE-1-LESSONS.md` |
| Bug log | `docs/trackers/BUG-LOG.md` |
| Feature matrix | `docs/trackers/FEATURE-MATRIX.md` |
| Technical specs | `docs/SPECS.md` |
| Quality checklist | `docs/QUALITY-GATES.md` |
| Full workflow process | `docs/WORKFLOW.md` |
| Project constraints | `docs/MASTER-PLAN.md` |

---

## HANDOFF PROTOCOL

**Before ending your session, you MUST do these things:**

1. **Run verification:** `node scripts/run-all-checks.js` — Fix any errors it reports. Warnings are OK to leave but log them.
2. **Update NEXT TASK above** — Change it to whatever should happen next. Be specific: which lesson, which action, which file.
3. **Update LAST SESSION LOG above** — Replace with what YOU did this session, what you didn't do, and any open issues. Include the verification result (pass/fail + error count).
4. **Update `docs/trackers/MODULE-1-LESSONS.md`** — Change pipeline status for any lessons you worked on.
5. **Update `docs/trackers/BUG-LOG.md`** — Log any new bugs found, move fixed bugs to the Fixed table.
6. **Update `docs/COMMON-MISTAKES.md`** — If you discovered and fixed a NEW bug (not already documented), add it with symptom, cause, solution, and how to avoid. This prevents future AIs from repeating the same mistake.
7. **Update `docs/goals/PHASE-1-CONTENT.md`** — Check off any completed tasks in the active milestone.
8. **Commit all changes** with a descriptive message.
9. **Tell the user** what you did and what the next AI should pick up.

---

**Update Frequency:** Every session (mandatory)
**Owner:** Whichever AI is currently working
