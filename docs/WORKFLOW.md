# Science Hub - App Completion Workflow

**Purpose:** The single source of truth for HOW this app gets built, from today through to full completion.
**Last Updated:** 2026-02-09 (v2 — added verification gates)
**Owner:** Project Manager (AI)

---

## 1. SESSION WORKFLOW (Every Chat Session)

Every AI coding session follows this exact loop:

```
START SESSION
  |
  v
[1] Read docs/STATUS.md          <-- Where are we?
[2] Read active phase goal file   <-- What are we trying to achieve?
[3] Check docs/trackers/BUG-LOG.md <-- Any blockers?
  |
  v
[4] Pick the highest-priority task
  |
  v
[5] EXECUTE (code, test, fix)
  |
  v
[6] RUN VERIFICATION              <-- node scripts/run-all-checks.js
  |
  v
[7] FIX any failures from step 6  <-- Loop back to [5] if needed
  |
  v
[8] Update tracker files          <-- Mark progress
[9] Update docs/STATUS.md         <-- Log what was done
[10] Commit with descriptive message
  |
  v
END SESSION
```

### Session Start Checklist
- [ ] Read `docs/STATUS.md` for current sprint goal
- [ ] Read active phase file (currently `docs/goals/PHASE-1-CONTENT.md`)
- [ ] Read `docs/trackers/MODULE-1-LESSONS.md` for lesson-level status
- [ ] Check `docs/trackers/BUG-LOG.md` for critical issues

### Session End Checklist
- [ ] **Verification suite passed** — `node scripts/run-all-checks.js` exits 0
- [ ] All changed files committed
- [ ] `docs/STATUS.md` updated with today's progress
- [ ] Relevant tracker files updated
- [ ] No unresolved critical bugs left unlogged

---

## 2. LESSON CREATION PIPELINE

Every lesson goes through these 6 stages. A lesson CANNOT skip stages.

```
STAGE 1: OUTLINE
  Content outline created, learning intentions defined
  Owner: Kyle (content) or AI (structure)
  Output: Lesson outline in MODULE-1-LESSONS tracker
  |
  v
STAGE 2: JSON AUTHORING
  Full lesson JSON created with all required fields
  Owner: AI or Kyle (via Lesson Builder)
  Output: /data/lessons/{lesson-id}.json
  Validation: node scripts/validate-lessons.js — MUST PASS for this lesson
  Verification: node scripts/validate-spelling.js — no American spellings
  |
  v
STAGE 3: RENDER INTEGRATION
  JSON loads and renders correctly in lesson.html
  Owner: AI
  Output: Lesson displays hero, content sections, activities, assessment
  Validation: Zero console errors, all sections visible
  Verification: node scripts/validate-pages.js — HTML structure valid
  |
  v
STAGE 4: ACTIVITY WIRING
  All interactive activities functional (drag, click, submit, score)
  Owner: AI
  Output: Activities give feedback, award XP, track completion
  Validation: Every activity type in the lesson works on desktop
  |
  v
STAGE 5: MOBILE QA
  Tested on 375px viewport, touch events work, no overflow
  Owner: AI + Kyle
  Output: All touch targets 44px, no horizontal scroll
  Validation: Quality Gates per-lesson checklist passes
  |
  v
STAGE 6: PRODUCTION
  Deployed to GitHub Pages, verified on live URL
  Owner: AI
  Output: Live at kyleajames33-beep.github.io/Learn/...
  Validation: Loads without errors on mobile browser
```

### Stage Status Codes (used in trackers)
| Code | Meaning |
|------|---------|
| `-` | Not started |
| `OUTLINE` | Stage 1 complete |
| `JSON` | Stage 2 complete |
| `RENDER` | Stage 3 complete |
| `WIRED` | Stage 4 complete |
| `QA` | Stage 5 complete |
| `LIVE` | Stage 6 complete - in production |
| `BLOCKED` | Cannot proceed - see BUG-LOG |

---

## 3. SPRINT CYCLE

Work is organised into 1-week sprints. Each sprint has a clear goal.

### Sprint Structure
```
DAY 1: PLAN
  - Review previous sprint results
  - Pick sprint goal from active phase milestones
  - Break goal into daily tasks
  - Update STATUS.md with sprint plan

DAYS 2-5: BUILD
  - Execute tasks from sprint plan
  - Follow lesson pipeline (stages 1-6)
  - Log bugs as discovered
  - Update trackers daily

DAY 6: TEST & SHIP
  - Run quality gates on all sprint work
  - Fix any failures
  - Deploy to GitHub Pages
  - Update milestone status

DAY 7: RETROSPECTIVE
  - What worked?
  - What didn't?
  - Update MILESTONE-LOG.md
  - Plan next sprint
```

### Sprint Goal Template
```markdown
**Sprint [N] Goal:** [One sentence describing the deliverable]
**Dates:** YYYY-MM-DD to YYYY-MM-DD
**Phase:** [Active phase]
**Milestone:** [Active milestone]
**Tasks:**
1. [ ] Task 1
2. [ ] Task 2
3. [ ] Task 3
**Exit Criteria:** [What must be true for sprint to be "done"]
```

---

## 4. PHASE TRANSITION GATES

A phase CANNOT begin until the previous phase's exit criteria are ALL met. No exceptions.

### Phase 0 -> Phase 1 (PASSED)
- [x] Lesson renderer works
- [x] JSON schema validated
- [x] At least 1 lesson renders correctly
- [x] GitHub Pages deployment works
- [x] Gamification engine loads without errors

### Phase 1 -> Phase 2
- [ ] All 25 Module 1 lessons at LIVE stage
- [ ] Every lesson has 2+ activity types working
- [ ] Every lesson passes mobile QA (375px)
- [ ] Zero critical bugs open
- [ ] Kyle sign-off on scientific accuracy
- [ ] Performance budget met (<400KB per lesson)

### Phase 2 -> Phase 3
- [ ] Smart "continue where you left off" working
- [ ] Module overview pages show real progress
- [ ] Onboarding flow complete
- [ ] Navigation between lessons seamless
- [ ] Sidebar accurately reflects completion

### Phase 3 -> Phase 4
- [ ] Study plan generator working
- [ ] Weak area detection functional
- [ ] Spaced repetition scheduling active
- [ ] Achievement system fully wired to content

### Phase 4 -> Phase 5
- [ ] 8+ game types implemented
- [ ] Games integrated into lessons
- [ ] Mobile-optimised game UI
- [ ] Game scores feed into progress tracking

---

## 5. DECISION FRAMEWORK

When faced with a choice, use this priority order:

### Priority 1: Fix Broken Things
If something that worked before is now broken, fix it first. Check BUG-LOG.md.

### Priority 2: Complete Current Milestone
Don't start new milestones until the current one is done. Check the active phase goal file.

### Priority 3: Unblock the Next Milestone
If current milestone is waiting on something, build that thing.

### Priority 4: Create New Content
Only after priorities 1-3 are clear, create new lesson content.

### Priority 5: Enhance Existing Content
Polish, optimise, add nice-to-haves only when everything above is done.

### When to DEFER (add to backlog, don't build now)
- Feature requests that belong to a future phase
- Optimisations that don't affect current users
- "Nice to have" that isn't in the current milestone
- Refactoring that doesn't fix a bug or unblock progress

### When to SKIP (don't build at all)
- Features that duplicate existing functionality
- Complexity that serves no learning outcome
- Premature abstractions ("we might need this later")

---

## 6. FILE UPDATE PROTOCOL

### After EVERY coding change:
| File | Update |
|------|--------|
| `docs/STATUS.md` | Current task status |
| Relevant tracker | Mark lesson/feature progress |

### After completing a MILESTONE:
| File | Update |
|------|--------|
| `docs/goals/PHASE-X-*.md` | Mark milestone complete |
| `docs/goals/MILESTONE-LOG.md` | Add milestone entry |
| `docs/STATUS.md` | Update sprint goal |

### After completing a PHASE:
| File | Update |
|------|--------|
| `docs/goals/PHASE-X-*.md` | Mark phase complete |
| `docs/MASTER-PLAN.md` | Update phase status in roadmap |
| `docs/goals/MILESTONE-LOG.md` | Add phase completion entry |
| `docs/STATUS.md` | Point to next phase |
| `AGENTS.md` | Update current priorities |

---

## 7. CONTENT STANDARDS

### Every Lesson JSON MUST Include
| Section | Requirement |
|---------|------------|
| Hero | Title, description, duration, difficulty |
| Learning Intentions | 3-4 measurable goals |
| Success Criteria | 3-4 student-friendly criteria |
| Engagement Hook | Compelling scenario or question |
| Content Sections | 2+ sections (diagram, grid, content, accordion) |
| Activities | 2+ distinct types (labelling, matching, ordering, etc.) |
| Assessment | 3 MCQ + 2 short answer |
| Copy to Book | 5 definitions + 4-5 key points |
| Navigation | Previous/next lesson links |

### Australian English (Mandatory)
| Wrong | Correct |
|-------|---------|
| specialized | specialised |
| behavior | behaviour |
| color | colour |
| center | centre |
| analyze | analyse |
| fiber | fibre |
| hemoglobin | haemoglobin |

### Image Requirements
- Format: WebP only
- Max size: 100KB per image
- Thumbnails: 200x150px, <20KB
- Alt text: Required, <125 characters

---

## 8. AUTOMATED VERIFICATION

### Verification Scripts

All scripts live in `/scripts/` and run via Node.js. **No npm install needed.**

| Script | Command | What It Checks |
|--------|---------|----------------|
| **Master runner** | `node scripts/run-all-checks.js` | Runs ALL checks below, unified pass/fail |
| **Smoke test** | `node scripts/smoke-test.js` | Quick "does it work?" check - verifies lessons load without errors (2-3 sec) |
| **Quality scoring** | `node scripts/score-lessons.js` | Scores lessons 0-100, detects quality regression vs baseline |
| Cache-busting | `node scripts/bump-versions.js` | Updates all ?v= params on CSS/JS (run BEFORE commit if you changed assets) |
| HTML structure | `node scripts/validate-pages.js` | Required CSS/JS, meta tags, absolute paths |
| Lesson JSON | `node scripts/validate-lessons.js` | Schema validation, content quality, activity types, navigation chain |
| Spelling | `node scripts/validate-spelling.js` | American English in lesson content |
| **Error analysis** | `node scripts/read-errors.js` | Reads production errors from browser localStorage (for debugging) |

### When to Run

| Situation | Run This |
|-----------|----------|
| Before ANY commit | `node scripts/run-all-checks.js` |
| After editing lesson JSON | `node scripts/validate-lessons.js` |
| After editing HTML pages | `node scripts/validate-pages.js` |
| After writing new content | `node scripts/validate-spelling.js` |

### Interpreting Results

- **PASS** = File is clean
- **WARN** = Recommendation (not blocking, but should fix)
- **FAIL/ERROR** = Must fix before committing
- Exit code 0 = all passed, exit code 1 = failures exist

### What the Validators Catch

1. **Missing required JSON fields** (id, title, module, contentSections, etc.)
2. **Unsupported activity types** (types not handled by the renderer switch statement)
3. **MCQ answer mismatches** (correctAnswer not in options list)
4. **American English spellings** (specialized, behavior, color, center, hemoglobin, etc.)
5. **Broken navigation chains** (prev/next pointing to non-existent lessons)
6. **Missing HTML infrastructure** (CSS/JS references, meta tags, absolute paths)
7. **Content quality warnings** (too few activities, assessments, definitions)
8. **Quality regression** (lessons scoring below baseline average)
9. **Rendering blockers** (missing images, unsupported activities, schema violations)

### Error Tracking & Debugging

**Client-Side Error Tracking:**
The error tracker (`assets/js/error-tracker.js`) automatically logs all JavaScript errors to browser localStorage.

**When a user reports "lesson X is broken":**

1. Ask them to open DevTools Console
2. Have them run: `copy(JSON.stringify(localStorage.getItem('science-hub-errors')))`
3. Paste the output into `scripts/errors.json`
4. Run: `node scripts/read-errors.js`
5. See exact errors with stack traces, timestamps, and browser info

**Manual error logging:**
```javascript
// In browser console or lesson code:
ErrorTracker.log('Calculation failed', { input: 42, expected: 50 });
```

**Debugging workflow:**
1. User reports issue
2. Get error log → `node scripts/read-errors.js`
3. Reproduce with exact error context
4. Fix code
5. Run smoke test → `node scripts/smoke-test.js`
6. Deploy

**This replaces 8-hour debugging sessions with 30-minute fixes.**

---

## 9. DEPLOYMENT PIPELINE

```
LOCAL DEV (Codespaces)
  |
  v
RUN VERIFICATION (node scripts/run-all-checks.js — MUST PASS)
  |
  v
GIT COMMIT (descriptive message)
  |
  v
GIT PUSH (to main branch)
  |
  v
GITHUB PAGES (auto-deploys in ~2 minutes)
  |
  v
VERIFY (check live URL, no console errors)
  |
  v
UPDATE TRACKERS (mark lesson as LIVE)
```

### Cache-Busting Protocol

**MANDATORY before every commit that changes CSS or JS:**

```bash
node scripts/bump-versions.js
```

This script automatically:
- Scans all HTML files in the project
- Finds all local CSS and JS references
- Adds/updates `?v=TIMESTAMP` on every reference
- Uses a Unix timestamp so every run produces a unique version
- Skips external URLs (https://)

After running, verify the changes with `git diff` and commit them along with your CSS/JS changes.

**Manual alternative** (if script fails):
1. Increment the `?v=` parameter on all `<link>` and `<script>` tags
2. Use a Unix timestamp: `?v=$(date +%s)`
3. Update ALL references across ALL HTML files (not just one file)
4. Test with hard refresh (Ctrl+Shift+R)

### Rollback Protocol
If a deployment breaks something:
1. `git revert HEAD` (reverts last commit)
2. `git push` (deploys the revert)
3. Log the issue in BUG-LOG.md
4. Fix the issue in a new commit

---

## DOCUMENT CONTROL

- **Location:** `/docs/WORKFLOW.md`
- **Update Frequency:** When workflow process changes
- **Owner:** Project Manager
