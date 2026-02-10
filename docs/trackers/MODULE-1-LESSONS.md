# Module 1: Lessons Tracker

**Module:** Cells as the Basis of Life
**Total Lessons:** 25 (targeting) / 25 (JSON exists)
**Last Updated:** 2026-02-10

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

---

## Lesson Status Table

| # | Lesson ID | Title | JSON | Pipeline | Activities | Issues |
|---|-----------|-------|------|----------|------------|--------|
| 1 | module-1-cells-lesson-1 | Prokaryotic Cell Structure | data/ | `LIVE` | Labelling, Matching | Deployed |
| 2 | module-1-cells-lesson-2 | Eukaryotic Cell Compartmentalisation | data/ | `LIVE` | Labelling, Ordering, Matching | Deployed |
| 3 | module-1-cells-lesson-3 | Microscopy and Cell Size | data/ | `LIVE` | Matching (2) | Deployed |
| 4 | module-1-cells-lesson-4 | Cell Membrane Structure | data/ | `LIVE` | Labelling, Classification | Deployed |
| 5 | module-1-cells-lesson-5 | Passive Transport | data/ | `LIVE` | Ordering, Classification | Deployed |
| 6 | mod1-lesson06 | Plant Cells & Water Potential | data/ | `LIVE` | Labelling, Classification, Calculation | Deployed |
| 7 | mod1-lesson07 | Technologies in Cytology | data/ | `LIVE` | Classification, Calculation, Matching | Deployed |
| 8 | mod1-lesson08 | The Fluid Mosaic Model | data/ | `LIVE` | Labelling, Classification, Matching | Deployed |
| 9 | mod1-lesson09 | Diffusion & Concentration Gradients | data/ | `LIVE` | Ordering, Calculation, Classification | Deployed |
| 10 | mod1-lesson10 | Osmosis & Water Potential | data/ | `LIVE` | Calculation, Classification, Matching | Deployed |
| 11 | mod1-lesson11 | Cell Theory & History | data/ | `LIVE` | Matching, Fill-blank | Deployed |
| 12 | mod1-lesson12 | Cell Division Overview | data/ | `LIVE` | Matching, Ordering | Deployed |
| 13 | mod1-lesson13 | Cytokinesis | data/ | `LIVE` | Matching, Fill-blank | Deployed |
| 14 | mod1-lesson14 | Stem Cells & Differentiation | data/ | `LIVE` | Matching, Classification | Deployed |
| 15 | mod1-lesson15 | Cell Culture | data/ | `LIVE` | Matching, Classification | Deployed |
| 16 | mod1-lesson16 | Staining Techniques | data/ | `LIVE` | Matching, Classification | Deployed |
| 17 | mod1-lesson17 | Cell Disease & Disorder | data/ | `LIVE` | Matching, Fill-blank | Deployed |
| 18 | mod1-lesson18 | Specialised Cells | data/ | `LIVE` | Matching (2) | Deployed |
| 19 | mod1-lesson19 | Working Scientifically | data/ | `LIVE` | Matching, Fill-blank | Deployed |
| 20 | mod1-lesson20 | Module Synthesis | data/ | `LIVE` | Classification, Matching | Deployed |
| 21 | mod1-lesson21 | Cell Signalling and Communication | data/ | `LIVE` | Ordering, Matching, Classification | Deployed |
| 22 | mod1-lesson22 | Enzyme Function and Catalysis | data/ | `LIVE` | Labelling, Matching, Classification | Deployed |
| 23 | mod1-lesson23 | Cell Metabolism and Energy | data/ | `LIVE` | Ordering, Matching, Classification | Deployed |
| 24 | mod1-lesson24 | Biotechnology Applications | data/ | `LIVE` | Ordering, Matching, Classification | Deployed |
| 25 | mod1-lesson25 | Exam Preparation and Practice | data/ | `LIVE` | Classification, Matching, Fill-blank | Deployed |

---

## Per-Lesson Quality Checklist

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

Lesson JSONs exist in TWO directories:
- `/data/lessons/` — source of truth
- `/hsc-biology/data/lessons/` — served to the browser

The lesson renderer fetches from `data/lessons/{id}.json` relative to `hsc-biology/`.

**Note:** Lesson 20 (`mod1-lesson20`) only exists in `/data/lessons/`, not yet copied to `/hsc-biology/data/lessons/`.

---

## Summary Stats

| Metric | Count |
|--------|-------|
| Lessons with JSON | 25 |
| Lessons at RENDER+ | 20 |
| Lessons at LIVE | 0 |
| Lessons not yet created | 5 (21-25) |
| Total target | 25 |

---

**Location:** `/docs/trackers/MODULE-1-LESSONS.md`
**Update Frequency:** Every time a lesson changes pipeline stage
