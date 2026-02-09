# Module 1: Lessons Tracker

**Module:** Cells as the Basis of Life
**Total Lessons:** 25 (targeting) / 20 (JSON exists)
**Last Updated:** 2026-02-09

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
| 1 | module-1-cells-lesson-1 | Prokaryotic Cell Structure | data/ + hsc-bio/ | `JSON` | Labelling, Matching | Needs render verification |
| 2 | module-1-cells-lesson-2 | Eukaryotic Cell Compartmentalisation | data/ + hsc-bio/ | `JSON` | Labelling, Ordering, Matching | Needs render verification |
| 3 | module-1-cells-lesson-3 | Microscopy and Cell Size | data/ + hsc-bio/ | `JSON` | Calculation (±5%), Matching | Needs render verification |
| 4 | module-1-cells-lesson-4 | Cell Membrane Structure | data/ + hsc-bio/ | `JSON` | Labelling, Classification | Needs render verification |
| 5 | module-1-cells-lesson-5 | Passive Transport | data/ + hsc-bio/ | `JSON` | Ordering, Classification | Needs render verification |
| 6 | mod1-lesson06 | Lysosomes, Peroxisomes & Cellular Digestion | data/ + hsc-bio/ | `JSON` | Comparison Table, Problem-Solving | Needs render verification |
| 7 | mod1-lesson07 | Technologies in Cytology | data/ + hsc-bio/ | `JSON` | Classification, Problem-Solving, Matching | Needs render verification |
| 8 | mod1-lesson08 | The Fluid Mosaic Model | data/ + hsc-bio/ | `JSON` | Labelling, Classification, Interactive Slider | Slider needs testing |
| 9 | mod1-lesson09 | Diffusion & Concentration Gradients | data/ + hsc-bio/ | `JSON` | Ordering, Problem-Solving, Classification | Fick's Law calc needs testing |
| 10 | mod1-lesson10 | Osmosis & Water Potential | data/ + hsc-bio/ | `JSON` | Problem-Solving, Classification, Tonicity Simulator | Simulator needs testing |
| 11 | mod1-lesson11 | Cell Theory & History | data/ + hsc-bio/ | `JSON` | TBD | Content may need enhancement |
| 12 | mod1-lesson12 | Technologies in Cytology (EM, LM) | data/ + hsc-bio/ | `JSON` | TBD | Content may need enhancement |
| 13 | mod1-lesson13 | Fluid Mosaic Model Deep Dive | data/ + hsc-bio/ | `JSON` | TBD | Content may need enhancement |
| 14 | mod1-lesson14 | Diffusion & Concentration Gradients | data/ + hsc-bio/ | `JSON` | TBD | Content may need enhancement |
| 15 | mod1-lesson15 | Osmosis & Water Potential | data/ + hsc-bio/ | `JSON` | TBD | Content may need enhancement |
| 16 | mod1-lesson16 | Active Transport | data/ + hsc-bio/ | `JSON` | TBD | Content may need enhancement |
| 17 | mod1-lesson17 | Endocytosis & Exocytosis | data/ + hsc-bio/ | `JSON` | TBD | Content may need enhancement |
| 18 | mod1-lesson18 | Surface Area to Volume Ratio | data/ + hsc-bio/ | `JSON` | TBD | Content may need enhancement |
| 19 | mod1-lesson19 | Enzymes 1: Structure & Function | data/ + hsc-bio/ | `JSON` | TBD | Content may need enhancement |
| 20 | mod1-lesson20 | Module Synthesis and Integration | data/ | `JSON` | TBD | Not in hsc-bio/data/lessons/ yet |
| 21 | — | Enzymes 3: Inhibition & Regulation | — | `-` | — | Not created |
| 22 | — | Enzymes 4: Applications & Industry | — | `-` | — | Not created |
| 23 | — | Cell Cycle & Checkpoints | — | `-` | — | Not created |
| 24 | — | Mitosis & Cytokinesis | — | `-` | — | Not created |
| 25 | — | Stem Cells & Cell Culture | — | `-` | — | Not created |

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
| Lessons with JSON | 20 |
| Lessons at RENDER+ | 0 |
| Lessons at LIVE | 0 |
| Lessons not yet created | 5 (21-25) |
| Total target | 25 |

---

**Location:** `/docs/trackers/MODULE-1-LESSONS.md`
**Update Frequency:** Every time a lesson changes pipeline stage
