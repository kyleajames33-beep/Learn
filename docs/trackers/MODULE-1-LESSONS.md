# Module 1: Lessons Tracker

**Module:** Cells as the Basis of Life  
**Total Lessons:** 25 (targeting) / 25 (JSON exists) / 25 (V2.0 pending)  
**Last Updated:** 2026-02-10  
**Current Focus:** V2.0 Enhancement (see PHASE-1-CONTENT.md E1.1-E1.6)

---

## Pipeline Legend

| Code | Stage | Meaning |
|------|-------|---------|
| `-` | 0 | Not started |
| `OUTLINE` | 1 | Content outlined |
| `JSON` | 2 | JSON created, passes schema validation |
| `RENDER` | 3 | Renders correctly in lesson.html |
| `WIRED` | 4 | All activities functional |
| `QA` | 5 | Mobile quality gates passed |
| `LIVE` | 6 | Deployed and verified on GitHub Pages |
| `V2.0` | 7 | Enhanced to V2.0 Quality Standard |

---

## V2.0 Quality Standard Elements

Each lesson must have these elements to reach V2.0:

| Element | Required | Description |
|---------|----------|-------------|
| **Hero** | ✅ | Gradient title, badges, icon, description |
| **Intentions Grid** | ✅ | 3 columns: Learning, Connections, Success Criteria |
| **Rich Content** | ✅ | Info/warning/highlight boxes, tables |
| **Visual Hierarchy** | Where relevant | Flow diagrams, process charts |
| **Worked Examples** | Calculation lessons | Step-by-step problem solving |
| **Copy Sections** | ✅ | Student note-taking areas |
| **Enhanced Activities** | ✅ | Numbered badges, clear context |
| **Assessment** | ✅ | MCQ with hover states, SAQ with areas |
| **Answer Key** | ✅ | Comprehensive with explanations |

**Reference:** `docs/LESSON-DESIGN-SPEC.md`

---

## Lesson Status Table

| # | Lesson ID | Title | Pipeline | V2.0 Status | V2.0 Elements | Issues |
|---|-----------|-------|----------|-------------|---------------|--------|
| 1 | module-1-cells-lesson-1 | Prokaryotic Cell Structure | `LIVE` | `PENDING` | - | - |
| 2 | module-1-cells-lesson-2 | Eukaryotic Cell Compartmentalisation | `LIVE` | `PENDING` | - | - |
| 3 | module-1-cells-lesson-3 | Microscopy and Cell Size | `LIVE` | `PENDING` | - | - |
| 4 | module-1-cells-lesson-4 | Cell Membrane Structure | `LIVE` | `PENDING` | - | - |
| 5 | module-1-cells-lesson-5 | Passive Transport | `LIVE` | `PENDING` | - | - |
| 6 | mod1-lesson06 | Plant Cells & Water Potential | `LIVE` | `PENDING` | - | - |
| 7 | mod1-lesson07 | Technologies in Cytology | `LIVE` | `PENDING` | - | - |
| 8 | mod1-lesson08 | The Fluid Mosaic Model | `LIVE` | `PENDING` | - | - |
| 9 | mod1-lesson09 | Diffusion & Concentration Gradients | `LIVE` | `PENDING` | - | - |
| 10 | mod1-lesson10 | Osmosis & Water Potential | `LIVE` | `PENDING` | - | - |
| 11 | mod1-lesson11 | Cell Theory & History | `LIVE` | `PENDING` | - | - |
| 12 | mod1-lesson12 | Cell Division Overview | `LIVE` | `PENDING` | - | - |
| 13 | mod1-lesson13 | Cytokinesis | `LIVE` | `PENDING` | - | - |
| 14 | mod1-lesson14 | Stem Cells & Differentiation | `LIVE` | `PENDING` | - | - |
| 15 | mod1-lesson15 | Cell Culture | `LIVE` | `PENDING` | - | - |
| 16 | mod1-lesson16 | Staining Techniques | `LIVE` | `PENDING` | - | - |
| 17 | mod1-lesson17 | Cell Disease & Disorder | `LIVE` | `PENDING` | - | - |
| 18 | mod1-lesson18 | Specialised Cells | `LIVE` | `PENDING` | - | - |
| 19 | mod1-lesson19 | Working Scientifically | `LIVE` | `PENDING` | - | - |
| 20 | mod1-lesson20 | Module Synthesis | `LIVE` | `PENDING` | - | - |
| 21 | mod1-lesson21 | Cell Signalling and Communication | `LIVE` | `PENDING` | - | - |
| 22 | mod1-lesson22 | Enzyme Function and Catalysis | `LIVE` | `PENDING` | - | - |
| 23 | mod1-lesson23 | Cell Metabolism and Energy | `LIVE` | `PENDING` | - | - |
| 24 | mod1-lesson24 | Biotechnology Applications | `LIVE` | `PENDING` | - | - |
| 25 | mod1-lesson25 | Exam Preparation and Practice | `LIVE` | `PENDING` | - | - |

**V2.0 Status Legend:**
- `PENDING` - Not yet enhanced
- `IN PROGRESS` - Currently being worked on
- `RENDERER UPDATES` - Waiting for renderer.js changes
- `QA` - Enhanced, undergoing QA
- `COMPLETE` - Meets V2.0 standard

---

## Per-Lesson V2.0 Checklist

Use this when enhancing a lesson to V2.0:

### Structure & Layout
- [ ] Hero section with gradient title
- [ ] Subject and level badges
- [ ] Emoji icon
- [ ] Description text
- [ ] 3-column intentions grid (Learning, Connections, Success)

### Content Sections
- [ ] At least one styled box (info, warning, highlight, formula)
- [ ] Tables for comparison/reference data
- [ ] Visual hierarchy diagram where relevant (flow chart, process)
- [ ] Key terms highlighted with `.key-term` class

### Worked Examples (calculation lessons only)
- [ ] `.formula-box` with equation
- [ ] `.worked-example` container
- [ ] Step boxes (`.step-box`) for each step
- [ ] Final answer clearly marked

### Copy Section
- [ ] `.copy-section` with red/orange border
- [ ] Section title with icon
- [ ] Grid layout for copy items
- [ ] Bullet points for key takeaways

### Activities
- [ ] `.activity` card with shadow
- [ ] Activity number badge (`.activity-number`)
- [ ] Clear title and description
- [ ] `.answer-area` for student responses
- [ ] Proper spacing and typography

### Assessment
- [ ] `.marks` badge showing point value
- [ ] MCQ options with hover states
- [ ] Letter badges (A, B, C, D) in boxes
- [ ] SAQ with textarea or answer area

### Answer Key
- [ ] `.answers` section with green border
- [ ] Answer items with left border accent
- [ ] Comprehensive explanations
- [ ] Step-by-step reasoning where applicable

### Technical
- [ ] All activities still functional
- [ ] Navigation links work
- [ ] Zero console errors
- [ ] Mobile responsive at 375px
- [ ] No horizontal scroll
- [ ] Touch targets 44px+

---

## Per-Lesson Quality Checklist (Original)

Use this when moving a lesson from `RENDER` to `QA`:

- [ ] Hero section displays (title, badges, description, metadata)
- [ ] All content sections render (no empty sections)
- [ ] Activities are interactive (buttons respond, inputs accept text)
- [ ] Assessment MCQ works (select, check, feedback)
- [ ] Short answer textarea present
- [ ] Copy to Book section displays
- [ ] Navigation links work (previous/next)
- [ ] Zero console errors
- [ ] No horizontal scroll at 375px
- [ ] Touch targets 44px minimum
- [ ] Images load (or graceful fallback if none)
- [ ] Australian spelling correct

---

## JSON File Locations

Lesson JSONs exist in:
- `/data/lessons/` — source of truth

The lesson renderer fetches from `data/lessons/{id}.json` relative to `hsc-biology/`.

---

## Summary Stats

| Metric | Count |
|--------|-------|
| Lessons with JSON | 25 |
| Lessons at RENDER+ | 25 |
| Lessons at LIVE | 25 |
| Lessons at V2.0 | 0 |
| Lessons not yet created | 0 |
| Total target | 25 |

---

## V2.0 Enhancement Progress

```
E1.1 (Lessons 1-5):  [░░░░░░░░░░░░░░░░░░░░] 0%  NOT STARTED
E1.2 (Lessons 6-10): [░░░░░░░░░░░░░░░░░░░░] 0%  NOT STARTED
E1.3 (Lessons 11-15):[░░░░░░░░░░░░░░░░░░░░] 0%  NOT STARTED
E1.4 (Lessons 16-20):[░░░░░░░░░░░░░░░░░░░░] 0%  NOT STARTED
E1.5 (Lessons 21-25):[░░░░░░░░░░░░░░░░░░░░] 0%  NOT STARTED
E1.6 (Full QA):      [░░░░░░░░░░░░░░░░░░░░] 0%  NOT STARTED
```

---

**Location:** `/docs/trackers/MODULE-1-LESSONS.md`
**Update Frequency:** Every time a lesson changes pipeline stage or V2.0 status
**Owner:** AI (Project Manager)
