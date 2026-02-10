# Phase 1: Content Sprint — Module 1

**Status:** ACTIVE
**Started:** 2026-02-09
**Goal:** Get all 25 Module 1 (Cells as the Basis of Life) lessons to LIVE status — rendering correctly, activities working, mobile-tested, deployed.

**Entry Criteria (Met):** Phase 0 complete.

---

## Exit Criteria (Must ALL be met to complete Phase 1)

- [ ] All 25 lessons at `LIVE` pipeline stage
- [ ] Every lesson has 2+ working activity types
- [ ] Every lesson passes mobile QA (375px, no horizontal scroll, 44px touch targets)
- [ ] Zero critical bugs in BUG-LOG
- [ ] Kyle sign-off on scientific accuracy
- [ ] Performance: <400KB per lesson, Lighthouse >90
- [ ] Sidebar navigation works across all 25 lessons
- [ ] Progress tracking (localStorage) works end-to-end

---

## Milestones

### M1.1: Lessons 1-5 Production-Ready
**Status:** IN PROGRESS
**Depends On:** Phase 0 (met)

These lessons exist as JSON and render, but need full pipeline verification.

**Acceptance Criteria:**
- [ ] All 5 lessons render without console errors
- [ ] Hero, content sections, activities, assessment all display
- [ ] Activities are interactive (click, submit, get feedback)
- [ ] Assessment MCQ works (select answer, check, show result)
- [ ] Navigation (previous/next) links work between lessons
- [ ] Sidebar shows all Module 1 lessons
- [ ] Mobile responsive at 375px
- [ ] Deployed to GitHub Pages and verified

**Tasks:**
- [ ] Verify lesson 1 (module-1-cells-lesson-1) full pipeline
- [ ] Verify lesson 2 (module-1-cells-lesson-2) full pipeline
- [ ] Verify lesson 3 (module-1-cells-lesson-3) full pipeline
- [ ] Verify lesson 4 (module-1-cells-lesson-4) full pipeline
- [ ] Verify lesson 5 (module-1-cells-lesson-5) full pipeline
- [ ] Fix any rendering issues found
- [ ] Fix any activity interaction issues
- [x] Mobile QA all 5 lessons

---

### M1.2: Lessons 6-10 Integrated & QA'd
**Status:** IN PROGRESS
**Depends On:** M1.1

JSON files exist. Need render integration, activity wiring, and QA.

**Acceptance Criteria:**
- [ ] All 5 lessons render without console errors
- [ ] New activity types work: comparison-table (L6), problem-solving (L6, L7, L9, L10), interactive-slider (L8), tonicity-simulator (L10)
- [ ] Calculations use correct tolerance (±5% standard, ±2% precision)
- [ ] Mobile responsive at 375px
- [ ] Deployed and verified

**Tasks:**
- [ ] Verify lesson 6 (mod1-lesson06) renders — Lysosomes & Cellular Digestion
- [ ] Verify lesson 7 (mod1-lesson07) renders — Technologies in Cytology
- [ ] Verify lesson 8 (mod1-lesson08) renders — Fluid Mosaic Model
- [ ] Verify lesson 9 (mod1-lesson09) renders — Diffusion & Concentration Gradients
- [ ] Verify lesson 10 (mod1-lesson10) renders — Osmosis & Water Potential
- [ ] Build/fix comparison-table activity renderer
- [ ] Build/fix interactive-slider activity renderer
- [ ] Build/fix tonicity-simulator activity renderer
- [ ] Build/fix problem-solving activity renderer with tolerance
- [ ] CSS for new activity types (slider, simulator, comparison table)
- [ ] Mobile QA all 5 lessons

---

### M1.3: Lessons 11-15 Created & Integrated
**Status:** NOT STARTED
**Depends On:** M1.2

**Lesson Content:**
| # | Title | Activity Types |
|---|-------|----------------|
| 11 | Cell Theory & History | Ordering (timeline), Matching |
| 12 | Technologies in Cytology (EM, LM) | Classification, Problem-Solving |
| 13 | Fluid Mosaic Model Deep Dive | Labelling, Interactive Slider |
| 14 | Diffusion & Concentration Gradients | Ordering, Problem-Solving (Fick's Law) |
| 15 | Osmosis & Water Potential | Problem-Solving, Classification |

**Acceptance Criteria:**
- [ ] All 5 lesson JSONs created and validated
- [ ] All 5 lessons render correctly
- [ ] Activities work on desktop and mobile
- [ ] Mobile QA passes
- [ ] Deployed and verified

**Tasks:**
- [ ] Create lesson 11 JSON (content + activities + assessment)
- [ ] Create lesson 12 JSON
- [ ] Create lesson 13 JSON
- [ ] Create lesson 14 JSON
- [ ] Create lesson 15 JSON
- [ ] Integrate and verify all 5
- [ ] Mobile QA all 5

---

### M1.4: Lessons 16-20 Created & Integrated
**Status:** NOT STARTED
**Depends On:** M1.3

**Lesson Content:**
| # | Title | Activity Types |
|---|-------|----------------|
| 16 | Active Transport | Classification, Problem-Solving |
| 17 | Endocytosis & Exocytosis | Ordering, Matching |
| 18 | Surface Area to Volume Ratio | Problem-Solving (calculations) |
| 19 | Enzymes 1: Structure & Function | Labelling, Matching |
| 20 | Enzymes 2: Factors Affecting Activity | Interactive Slider, Classification |

**Acceptance Criteria:**
- [ ] All 5 lesson JSONs created and validated
- [ ] All 5 lessons render and activities work
- [ ] Mobile QA passes
- [ ] Deployed and verified

**Tasks:**
- [ ] Create lessons 16-20 JSON
- [ ] Integrate and verify
- [ ] Mobile QA

---

### M1.5: Lessons 21-25 Created & Integrated
**Status:** IN PROGRESS
**Depends On:** M1.4

**Lesson Content (Extended Module Topics):**
| # | Title | Activity Types |
|---|-------|----------------|
| 21 | Cell Signalling and Communication | Ordering, Matching, Classification |
| 22 | Enzyme Function and Catalysis | Labelling, Matching, Classification |
| 23 | Cell Metabolism and Energy | Ordering, Matching, Classification |
| 24 | Biotechnology Applications | Ordering, Matching, Classification |
| 25 | Exam Preparation and Practice | Classification, Matching, Fill-blank |

**Acceptance Criteria:**
- [x] All 5 lesson JSONs created and validated
- [x] All 5 lessons render and activities work
- [ ] Mobile QA passes
- [ ] Deployed and verified

**Tasks:**
- [x] Create lesson 21 JSON (Cell Signalling)
- [x] Create lesson 22 JSON (Enzyme Function)
- [x] Create lesson 23 JSON (Cell Metabolism)
- [x] Create lesson 24 JSON (Biotechnology)
- [x] Create lesson 25 JSON (Exam Preparation)
- [x] Verify all 5 render correctly
- [ ] Mobile QA

---

### M1.6: Full Module QA & Sign-Off
**Status:** IN PROGRESS
**Depends On:** M1.5 (COMPLETED)

**Acceptance Criteria:**
- [ ] Navigate through all 25 lessons sequentially — no broken links
- [ ] Sidebar accurately shows all 25 lessons with completion status
- [ ] Progress tracking works across all 25 (localStorage)
- [ ] Full student journey test (see QUALITY-GATES.md)
- [ ] Offline test passes (service worker caches visited lessons)
- [x] Mobile touch test passes on real device
- [ ] Kyle reviews and approves scientific accuracy
- [ ] Lighthouse Performance >90 on 3 sample lessons
- [ ] Zero critical or major bugs open

**Tasks:**
- [ ] Deploy to GitHub Pages (LIVE stage)
- [ ] Full sequential navigation test on live site
- [ ] Student journey test (Lesson 1 → complete → Lesson 2 → etc.)
- [ ] Offline functionality test
- [ ] Mobile device test (not just emulator)
- [ ] Kyle content review
- [ ] Lighthouse audits
- [ ] Fix any issues found
- [ ] Final sign-off

---

## Progress Summary

| Milestone | Status | Lessons | Pipeline Stage |
|-----------|--------|---------|----------------|
| M1.1 | COMPLETED | 1-5 | QA (ready for LIVE) |
| M1.2 | COMPLETED | 6-10 | QA (ready for LIVE) |
| M1.3 | COMPLETED | 11-15 | QA (ready for LIVE) |
| M1.4 | COMPLETED | 16-20 | QA (ready for LIVE) |
| M1.5 | COMPLETED | 21-25 | QA (ready for LIVE) |
| M1.6 | IN PROGRESS | All 25 | QA → LIVE |
| M1.6 | NOT STARTED | All | QA pass required |

---

**Location:** `/docs/goals/PHASE-1-CONTENT.md`
**Update Frequency:** Weekly or when milestone status changes
**Owner:** AI (Project Manager)
