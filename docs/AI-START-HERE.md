# AI Development Cycle - Control Center

**Welcome to Science Hub.** You are about to complete one development cycle.

This document orchestrates your entire workflow from start to finish.

---

## STEP 1: UNDERSTAND THE SYSTEM

Read these files **in this exact order:**

1. **[STATUS.md](STATUS.md)** — Where are we? What's next?
   - Read the NEXT TASK section
   - Read the LAST SESSION LOG to understand recent work
   - Note the current phase and sprint goal

2. **[WORKFLOW.md](WORKFLOW.md)** — How do we build?
   - Read Section 1 (Session Workflow)
   - Read Section 2 (Lesson Creation Pipeline)
   - Read Section 8 (Automated Verification)

3. **[COMMON-MISTAKES.md](COMMON-MISTAKES.md)** — What not to do
   - Read all mistakes and their solutions
   - These are bugs that have already happened
   - Do NOT repeat them

4. **[QUALITY-GATES.md](QUALITY-GATES.md)** — What defines "done"?
   - Understand the quality standards
   - Know the validation commands

5. **[CONTENT-AUTHOR-GUIDE.md](CONTENT-AUTHOR-GUIDE.md)** — HTML content authoring reference
   - **Read this if your task involves creating or enhancing V2.0 lessons**
   - Lists every CSS class available for lesson HTML content
   - Defines the required lesson structure (hero, intentions, cards, activities, assessment, answers)
   - Used by external AIs generating lesson HTML — you wrap that HTML into V2 JSON

---

## STEP 2: DO THE WORK

**From STATUS.md, you now know the NEXT TASK.**

Execute that task following these rules:

### File Operations

- **Read before write:** Always read a file before editing it
- **Edit, don't rewrite:** Use Edit tool for changes, not Write
- **Australian English:** Use "specialised", "behaviour", "colour", "centre"
- **Cache-busting:** If you change CSS/JS, run `node scripts/bump-versions.js`

### Existing Gamification Systems (DO NOT REBUILD)

The following systems are **already fully implemented** (~6000 lines of code). Do NOT create duplicate systems:

| System | File | Lines |
|--------|------|-------|
| XP & Levels | `assets/js/xp.js` | 513 |
| Streaks | `assets/js/streak.js` | 479 |
| 22 Achievements | `assets/js/achievements.js` | 723 |
| Gamification Engine | `assets/js/gamification-engine.js` | 999 |
| Dashboard Analytics | `assets/js/dashboard.js` | 607 |
| Mini-Games | `assets/js/minigames.js` | 600+ |
| Progress Tracking | `assets/js/progress.js` | 223 |
| Event Bus | `assets/js/event-bus.js` | 120+ |
| UI Controller | `assets/js/ui-controller.js` | 200+ |

**See `docs/goals/PHASE-3-GAMIFICATION.md`** for the full inventory, known wiring gaps, and what still needs building.

### Code Standards

- **No absolute paths:** Use relative paths only (e.g., `../assets/css/` not `/assets/css/`)
- **Mobile-first:** All layouts must work at 375px width
- **Touch targets:** Minimum 44×44px for buttons
- **Activity types:** Only use: matching, fill-blank, classification, ordering, labeling, fillBlank, calculation

### Content Standards

- **Lesson IDs:** Format `mod1-lesson01` or `module-1-cells-lesson-1` (both valid)
- **Activity count:** Minimum 2 per lesson, recommend 4
- **Assessment:** Minimum 3 MCQs + 2 SAQs
- **Copy-to-Book:** Minimum 5 definitions
- **Engagement hook:** Required, compelling question or scenario

---

## STEP 3: TEST YOUR WORK

**MANDATORY before any commit:**

```bash
node scripts/run-all-checks.js
```

This runs 5 checks:
1. Smoke Test (lessons load without errors)
2. HTML Validation (structure correct)
3. JSON Validation (schema + content quality)
4. Spelling Check (Australian English)
5. Quality Scoring (no regression)

### If Tests PASS ✅

**Proceed to Step 4.**

### If Tests FAIL ❌

**DO NOT COMMIT. Fix the issues:**

1. Read the error output carefully
2. Check `docs/COMMON-MISTAKES.md` for known solutions
3. Fix the code
4. Re-run `node scripts/run-all-checks.js`
5. Repeat until all tests pass

**Common failures:**

- **Unsupported activity type** → Change to a supported type (see list above)
- **American spelling** → Change to Australian (specialized → specialised)
- **MCQ answer mismatch** → Ensure correctAnswer is in options array
- **Missing required field** → Add the field to lesson JSON
- **Quality regression** → Add more activities, better assessments

---

## STEP 4: UPDATE DOCUMENTATION

**Once tests pass, update these files:**

### A. Update Lesson Tracker

Find the relevant tracker file:
- Biology: `docs/trackers/MODULE-X-LESSONS.md`
- Chemistry: `docs/trackers/CHEM-MODULE-X-LESSONS.md`

Update the lesson's pipeline status:
- `-` → Not started
- `OUTLINE` → Outline complete
- `JSON` → JSON created
- `RENDER` → Renders correctly
- `WIRED` → Activities functional
- `QA` → Quality gates passed
- `LIVE` → Deployed to production

### B. Update STATUS.md

**LAST SESSION LOG section:**

```markdown
## LAST SESSION LOG

**Date:** YYYY-MM-DD
**Developer:** [Your Name/AI Name]
**Task:** [What you did]

### Completed:
- [List what was finished]
- [Include test results: "All tests passed" or "39/45 lessons passed smoke test"]

### Issues Fixed:
- [Bugs that were fixed in this session]

### Bugs Found (out of scope):
| # | Bug | Location | Severity | Notes |
|---|-----|----------|----------|-------|
| 1 | [Brief description] | [File/location] | [CRITICAL/MAJOR/MINOR/INFO] | [Any details] |

### Not Completed:
- [Anything left unfinished]

### Next Steps:
- [What should happen next]

### Verification:
- [x] Tests passed: `node scripts/run-all-checks.js` exit code 0
- [x] Quality score: [X/100] average (baseline: [Y/100])
- [x] Smoke test: [X/Y] lessons passing
```

**NEXT TASK section:**

Update to describe the next logical task.

### C. Update BUG-LOG.md (if bugs found)

If you discovered bugs, log them in `docs/trackers/BUG-LOG.md`:

```markdown
| # | Severity | Description | Lesson | Found | Status |
|---|----------|-------------|--------|-------|--------|
| X | MINOR | [Description] | mod1-lessonXX | YYYY-MM-DD | OPEN |
```

### D. Update COMMON-MISTAKES.md (if new bugs discovered)

**CRITICAL:** If you discovered a NEW bug (not already documented in COMMON-MISTAKES.md), you MUST add it to prevent future AIs from repeating the same mistake.

**Process:**
1. Read `docs/COMMON-MISTAKES.md` to confirm this is a NEW bug
2. Determine the severity category:
   - **CRITICAL MISTAKES** — Breaks lessons completely
   - **QUALITY MISTAKES** — Tests will fail
   - **PERFORMANCE MISTAKES** — Causes slowdowns or caching issues
   - **CONTENT QUALITY MISTAKES** — Degrades lesson quality
   - **WORKFLOW MISTAKES** — Process failures
   - **DEBUGGING MISTAKES** — Makes debugging harder

3. Add entry using this format:

```markdown
### X. [Short Title of the Bug]

**Bug:** [One sentence describing the symptom users see]

**Cause:**
```language
// WRONG - Show the code that causes the problem
example code that's wrong
```

**Solution:**
```language
// RIGHT - Show the correct code
example code that's right
```

**How to avoid:**
- Specific rule to prevent this bug
- Command to run or check to perform
- Test that catches this problem
```

4. Update the mistake number (increment from the last one)
5. Add to the appropriate category section
6. Include real code examples from the bug you just fixed

**Example of a good mistake entry:**

```markdown
### 19. Missing Activity Type Validation

**Bug:** Lesson renders blank activity section, no error shown

**Cause:**
```json
{
  "type": "problem-solving"  // NOT SUPPORTED - renderer has no case for this
}
```

**Solution:**
```json
{
  "type": "classification"  // SUPPORTED - renderer handles this
}
```

**How to avoid:**
- Only use supported types: matching, fill-blank, classification, ordering, labeling, fillBlank, calculation
- Run: `node scripts/smoke-test.js` — catches unsupported types
- Check: `scripts/validate-lessons.js` SUPPORTED_ACTIVITY_TYPES array
```

**Why this matters:** Every bug you document saves the next AI 2-8 hours of debugging time. The COMMON-MISTAKES.md file is the knowledge base that makes this system smarter over time.

### E. Update Phase Progress (if milestone complete)

If you completed a milestone, update `docs/goals/PHASE-X-XXX.md`:
- Check off completed tasks
- Update milestone status

---

## STEP 5: COMMIT

**Only commit after:**
- ✅ All tests pass
- ✅ Docs updated (STATUS.md, trackers, etc.)
- ✅ No unlogged bugs

**Commit message format:**

```
[Short summary of what was done]

[Detailed description of changes]
- List key changes
- Include test results
- Note any issues fixed

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Then push:**

```bash
git add -A
git commit -m "[your message]"
git push
```

---

## STEP 6: REPORT COMPLETION

**Tell the user you're done with:**

1. **Summary:** What you completed in 1-2 sentences
2. **Test Results:**
   - `node scripts/run-all-checks.js`: PASS/FAIL
   - Quality score: X/100 (baseline: Y/100)
   - Smoke test: X/Y lessons passing
3. **Changes Made:** List files created/edited
4. **Next Task:** What should happen next (same as STATUS.md NEXT TASK)
5. **Issues:** Any blockers or problems discovered

**Example:**

> ✅ **Cycle Complete**
>
> **Completed:** Created lesson JSON for mod1-lesson06 (Eukaryotic Cell Structure)
>
> **Test Results:**
> - All checks passed ✅
> - Quality score: 87/100 (baseline: 92/100) - slight dip due to only 2 activities
> - Smoke test: 20/20 lessons passing
>
> **Changes:**
> - Created `data/lessons/mod1-lesson06.json`
> - Updated `docs/trackers/MODULE-1-LESSONS.md` (lesson 6 → JSON stage)
> - Updated `docs/STATUS.md` with session log
>
> **Next Task:** Create lesson JSON for mod1-lesson07 (Prokaryotic Cell Structure)
>
> **Issues:** None
>
> System ready for next cycle. Send the prompt from PROMPT.md to continue.

---

## WORKFLOW DIAGRAM

```
┌─────────────────────────────────────────────────────┐
│ 1. READ DOCS                                        │
│    - STATUS.md (what to do)                         │
│    - WORKFLOW.md (how to do it)                     │
│    - COMMON-MISTAKES.md (what not to do)            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ 2. DO THE WORK                                      │
│    - Follow guidelines                              │
│    - Follow standards                               │
│    - Avoid common mistakes                          │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ 3. TEST                                             │
│    node scripts/run-all-checks.js                   │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
      PASS ✅             FAIL ❌
         │                   │
         │                   ▼
         │            ┌──────────────┐
         │            │ FIX & RETEST │
         │            └──────┬───────┘
         │                   │
         │                   │
         └───────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ 4. UPDATE DOCS                                      │
│    - STATUS.md                                      │
│    - Tracker files                                  │
│    - BUG-LOG.md (if needed)                         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ 5. COMMIT & PUSH                                    │
│    git add -A && git commit && git push             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ 6. REPORT TO USER                                   │
│    - Summary                                        │
│    - Test results                                   │
│    - Next task                                      │
└─────────────────────────────────────────────────────┘
                   │
                   ▼
              CYCLE COMPLETE
           Ready for next lap 🔄
```

---

## EMERGENCY PROCEDURES

### If You Get Stuck

1. Check `docs/COMMON-MISTAKES.md` for known solutions
2. Check `docs/trackers/BUG-LOG.md` for similar past issues
3. Run `node scripts/read-errors.js` if there are browser errors
4. Ask the user for clarification

### If Tests Keep Failing

1. Run individual test scripts to isolate the problem:
   - `node scripts/smoke-test.js`
   - `node scripts/validate-lessons.js`
   - `node scripts/validate-spelling.js`
2. Fix one category of errors at a time
3. Don't commit partial fixes

### If Unsure What to Do Next

1. Re-read `docs/STATUS.md` NEXT TASK section
2. If still unclear, check the active phase goals in `docs/goals/PHASE-X-*.md`
3. Ask the user

---

## IMPORTANT REMINDERS

- **One task per cycle:** Don't try to do everything at once
- **Test before commit:** NEVER commit without passing tests
- **Update docs:** Always update STATUS.md and trackers
- **Report clearly:** User needs to know what happened and what's next
- **Avoid known bugs:** Read COMMON-MISTAKES.md every time

---

**You are now ready to execute the development cycle.**

**Start with Step 1: Read STATUS.md to understand what needs to be done.**

**Good luck! 🚀**
