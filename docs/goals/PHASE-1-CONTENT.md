# Phase 1: Content Sprint — Module 1 (ENHANCED)

**Status:** 🔄 ENHANCEMENT IN PROGRESS  
**Original Completion:** 2026-02-10  
**Enhancement Started:** 2026-02-10  
**Goal:** Upgrade all 25 Module 1 lessons to Lesson V2.0 quality standard (rich content, styled boxes, flow diagrams, worked examples).

**Entry Criteria (Met):** All 25 lessons at LIVE stage with basic functionality.  
**Exit Criteria:** All 25 lessons meet Lesson V2.0 Quality Standard (see LESSON-DESIGN-SPEC.md).

---

## What is Lesson V2.0?

Based on the two example lessons provided (Chemistry Calculations Workshop & Cells/Tissues/Organs), we're implementing **Option C: Hybrid Approach**:

- **JSON** for metadata (title, navigation, assessment, IDs)
- **HTML content blocks** for rich formatting (styled boxes, flow diagrams, worked examples)

### New Quality Requirements

Every lesson must include:

| Element | Description |
|---------|-------------|
| **Hero Header** | Gradient title, subject/level badges, emoji icon |
| **Intentions Grid** | 3-column layout (Learning, Connections, Success Criteria) |
| **Rich Content** | Info boxes, warning boxes, highlight boxes, formula boxes |
| **Visual Hierarchy** | Flow diagrams, tables, styled cards |
| **Worked Examples** | Step-by-step problem solving with clear formatting |
| **Copy Sections** | Student note-taking areas with proper structure |
| **Enhanced Activities** | Numbered badges, clear context, proper spacing |
| **Assessment** | MCQ with hover states, SAQ with answer areas |
| **Answer Key** | Comprehensive answers with explanations |

**Reference:** `docs/LESSON-DESIGN-SPEC.md` for complete specification  
**Template:** `docs/TEMPLATE-v2.json` for structure reference  
**Styles:** `assets/css/lesson-v2.css` for all new CSS classes

---

## Exit Criteria (Must ALL be met to complete Phase 1 Enhancement)

- [ ] All 25 lessons upgraded to V2.0 format
- [ ] Every lesson has styled hero header
- [ ] Every lesson has 3-column intentions grid
- [ ] Rich content sections (boxes, diagrams, tables)
- [ ] At least one worked example per calculation lesson
- [ ] Flow diagrams where hierarchy is relevant
- [ ] Copy sections for student notes
- [ ] Enhanced activities with number badges
- [ ] Comprehensive answer keys
- [ ] All lessons pass validation
- [ ] Mobile QA at 375px (no regression)
- [ ] Kyle sign-off on scientific accuracy
- [ ] Lighthouse >90 on 3 sample lessons

**Live Deployment:** https://kyleajames33-beep.github.io/Learn/

---

## Enhancement Milestones

### E1.1: Lessons 1-5 Enhanced to V2.0
**Status:** NOT STARTED  
**Depends On:** V2.0 specification complete (met)

**Lessons:**
| # | Current ID | Title | Priority |
|---|------------|-------|----------|
| 1 | module-1-cells-lesson-1 | Cell Structure & Prokaryotic vs Eukaryotic | High |
| 2 | module-1-cells-lesson-2 | Cell Organelles & Functions | High |
| 3 | module-1-cells-lesson-3 | Technologies in Cytology | Medium |
| 4 | module-1-cells-lesson-4 | Cell Membrane Structure | High |
| 5 | module-1-cells-lesson-5 | Membrane Transport Overview | High |

**Acceptance Criteria:**
- [ ] Hero header with gradient title and badges
- [ ] 3-column intentions grid
- [ ] Rich content with at least 2 styled box types
- [ ] Visual hierarchy diagram (flow chart or table)
- [ ] Enhanced activities with badges
- [ ] Copy section for notes
- [ ] Comprehensive answer key
- [ ] Passes validation
- [ ] Mobile QA at 375px

**Tasks:**
- [ ] Enhance lesson 1 to V2.0 format
- [ ] Enhance lesson 2 to V2.0 format
- [ ] Enhance lesson 3 to V2.0 format
- [ ] Enhance lesson 4 to V2.0 format
- [ ] Enhance lesson 5 to V2.0 format
- [ ] Run validation on all 5
- [ ] Mobile QA all 5
- [ ] Kyle review

---

### E1.2: Lessons 6-10 Enhanced to V2.0
**Status:** NOT STARTED  
**Depends On:** E1.1 (lessons 1-5)

**Lessons:**
| # | Current ID | Title | Priority |
|---|------------|-------|----------|
| 6 | mod1-lesson06 | Lysosomes & Cellular Digestion | Medium |
| 7 | mod1-lesson07 | Technologies in Cytology (Advanced) | Medium |
| 8 | mod1-lesson08 | Fluid Mosaic Model Deep Dive | High |
| 9 | mod1-lesson09 | Diffusion & Concentration Gradients | High |
| 10 | mod1-lesson10 | Osmosis & Water Potential | High |

**Acceptance Criteria:**
- [ ] All 5 lessons have hero headers and intentions grids
- [ ] Calculation lessons (9, 10) have worked examples with step boxes
- [ ] Flow diagrams for concentration gradients and osmosis
- [ ] Enhanced activities
- [ ] Passes validation
- [ ] Mobile QA

**Tasks:**
- [ ] Enhance lesson 6
- [ ] Enhance lesson 7
- [ ] Enhance lesson 8
- [ ] Enhance lesson 9 (include worked examples)
- [ ] Enhance lesson 10 (include worked examples)
- [ ] Validation and QA

---

### E1.3: Lessons 11-15 Enhanced to V2.0
**Status:** NOT STARTED  
**Depends On:** E1.2

**Lessons:**
| # | Current ID | Title | Priority |
|---|------------|-------|----------|
| 11 | mod1-lesson11 | Cell Theory & History | Medium |
| 12 | mod1-lesson12 | Light vs Electron Microscopy | Medium |
| 13 | mod1-lesson13 | Membrane Proteins & Transport | High |
| 14 | mod1-lesson14 | Fick's Law & Diffusion Rate | High |
| 15 | mod1-lesson15 | Tonicity & Water Potential Calculations | High |

**Acceptance Criteria:**
- [ ] All 5 lessons upgraded
- [ ] Worked examples for calculation lessons (14, 15)
- [ ] Visual diagrams for membrane structures
- [ ] Passes validation
- [ ] Mobile QA

**Tasks:**
- [ ] Enhance lessons 11-15
- [ ] Validation and QA

---

### E1.4: Lessons 16-20 Enhanced to V2.0
**Status:** NOT STARTED  
**Depends On:** E1.3

**Lessons:**
| # | Current ID | Title | Priority |
|---|------------|-------|----------|
| 16 | mod1-lesson16 | Active Transport | High |
| 17 | mod1-lesson17 | Endocytosis & Exocytosis | Medium |
| 18 | mod1-lesson18 | Surface Area to Volume Ratio | High |
| 19 | mod1-lesson19 | Enzymes 1: Structure & Function | High |
| 20 | mod1-lesson20 | Enzymes 2: Factors Affecting Activity | High |

**Acceptance Criteria:**
- [ ] All 5 lessons upgraded
- [ ] Worked examples for SA:V calculations (18)
- [ ] Enzyme diagrams with clear labeling
- [ ] Passes validation
- [ ] Mobile QA

**Tasks:**
- [ ] Enhance lessons 16-20
- [ ] Validation and QA

---

### E1.5: Lessons 21-25 Enhanced to V2.0
**Status:** NOT STARTED  
**Depends On:** E1.4

**Lessons:**
| # | Current ID | Title | Priority |
|---|------------|-------|----------|
| 21 | mod1-lesson21 | Cell Signalling | Medium |
| 22 | mod1-lesson22 | Enzyme Function & Catalysis | High |
| 23 | mod1-lesson23 | Cell Metabolism & Energy | Medium |
| 24 | mod1-lesson24 | Biotechnology Applications | Medium |
| 25 | mod1-lesson25 | Exam Preparation & Practice | Medium |

**Acceptance Criteria:**
- [ ] All 5 lessons upgraded
- [ ] Summary/copy sections for exam prep lesson
- [ ] Passes validation
- [ ] Mobile QA

**Tasks:**
- [ ] Enhance lessons 21-25
- [ ] Validation and QA

---

### E1.6: Full Module V2.0 QA & Sign-Off
**Status:** NOT STARTED  
**Depends On:** E1.5 (all 25 enhanced)

**Acceptance Criteria:**
- [ ] All 25 lessons meet V2.0 standard
- [ ] Navigate through all 25 — consistent styling
- [ ] No visual regressions on mobile
- [ ] All activities still functional
- [ ] Kyle reviews and approves content
- [ ] Lighthouse >90 on 3 sample lessons
- [ ] Zero validation errors

**Tasks:**
- [ ] Deploy enhanced lessons
- [ ] Full navigation test
- [ ] Mobile device test
- [ ] Kyle content review
- [ ] Lighthouse audits
- [ ] Final sign-off

---

## Progress Summary

| Milestone | Status | Lessons | V2.0 Elements |
|-----------|--------|---------|---------------|
| E1.1 | NOT STARTED | 1-5 | Hero, Grid, Boxes, Diagrams |
| E1.2 | NOT STARTED | 6-10 | + Worked Examples |
| E1.3 | NOT STARTED | 11-15 | + Visual Hierarchy |
| E1.4 | NOT STARTED | 16-20 | + SA:V Calculations |
| E1.5 | NOT STARTED | 21-25 | + Summary Sections |
| E1.6 | NOT STARTED | All | QA + Sign-off |

**Total Lessons to Enhance:** 25  
**Completed:** 0  
**Remaining:** 25

---

## Technical Requirements

### For Each Lesson Enhancement:

1. **Update JSON structure** to include:
   - `hero` object (badges, icon, gradient)
   - `intentions` object (learning, connections, success)
   - HTML content blocks in `contentSections`

2. **Add HTML content blocks:**
   - `<div class="hero">` with gradient title
   - `<div class="intentions-grid">` with 3 cards
   - `<div class="card">` for content sections
   - `<div class="flow-diagram">` for hierarchy
   - `<div class="formula-box">`, `<div class="worked-example">`
   - `<div class="copy-section">` for notes
   - Enhanced `<div class="activity">` with badges

3. **Link new CSS:**
   - Add `lesson-v2.css` to lesson.html template
   - Ensure no conflicts with existing styles

4. **Validate:**
   - Run `node scripts/run-all-checks.js`
   - Check mobile at 375px
   - Verify all activities still work

---

## Quick Reference

| Resource | Location |
|----------|----------|
| Design Specification | `docs/LESSON-DESIGN-SPEC.md` |
| Template | `docs/TEMPLATE-v2.json` |
| CSS Styles | `assets/css/lesson-v2.css` |
| Quality Standard | `docs/LESSON_QUALITY_STANDARD.md` |
| Workflow | `docs/WORKFLOW.md` (Stage 2.5) |

---

**Next Action:** Start E1.1 — Enhance Lessons 1-5 to V2.0 format  
**Location:** `/docs/goals/PHASE-1-CONTENT.md`  
**Update Frequency:** After each milestone  
**Owner:** AI (Project Manager)
