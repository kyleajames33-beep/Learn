# Science Hub - Master Plan

**Purpose:** The project's constitution. Contains ONLY the things that define the project's identity, constraints, and high-level roadmap. Detailed goals live in `docs/goals/`.
**Last Updated:** 2026-02-09
**Owner:** Kyle (Product) + AI (Technical)

---

## 1. PROJECT IDENTITY

| Attribute | Value |
|-----------|-------|
| **Name** | Science Hub |
| **Type** | Interactive HSC Biology Learning Platform |
| **Stack** | Vanilla JS, LocalStorage, GitHub Pages (Phase 1-4) |
| **Target** | NSW HSC Biology Students (Australian English) |
| **Design** | "Soft Ocean Breeze" - Mobile First |
| **URL** | `https://kyleajames33-beep.github.io/Learn/` |

### Core Philosophy
1. **Mastery over coverage:** 25 deep lessons > 50 shallow lessons
2. **Learn by doing:** Every concept has an interactive activity
3. **Australian context:** NSW HSC syllabus, Australian English, local examples
4. **Accessibility first:** Works on $100 Android with spotty internet
5. **Quality over speed:** Never ship broken content

---

## 2. IMMUTABLE CONSTRAINTS

These rules are NEVER violated. No exceptions. No "just this once."

| # | Constraint | Rationale |
|---|-----------|-----------|
| 1 | **NO FRAMEWORKS until Phase 5** | Vanilla JS only. No React, Vue, jQuery. Performance and simplicity. |
| 2 | **Mobile-First** | 375px minimum viewport. 44px touch targets. No horizontal scroll. |
| 3 | **Progressive Enhancement** | Core content works without JS. |
| 4 | **Storage: LocalStorage** | IndexedDB Phase 2, Firebase Phase 5. |
| 5 | **Australian English** | specialised, behaviour, haemoglobin, fibre, centre, analyse. |
| 6 | **Data Integrity** | Never lose student progress. |
| 7 | **Images: WebP only** | <100KB each, thumbnails 200x150px. |
| 8 | **Design Lock** | "Soft Ocean Breeze" colours sacred without Kyle approval. |
| 9 | **Zero Console Errors** | Every page loads clean. |
| 10 | **Relative Paths Only** | No absolute paths (breaks on GitHub Pages subdirectory). |

---

## 3. DESIGN SYSTEM ("Soft Ocean Breeze")

### Colours
| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#93e4f9` | Whitewashed Ocean Blue - buttons, highlights |
| Secondary | `#a7f3e0` | Pale Seafoam - biology content |
| Accent | `#ffc996` | Faded Sunset Peach - chemistry content |
| Success | `#a7f3d0` | Correct answers, completion |
| Danger | `#ffb3c1` | Errors, incorrect answers |
| Warning | `#ffd699` | Caution, hints |
| Background | `#f0f9ff` | Page background |
| Text | `#1e3a5f` | Primary text colour |

### Typography
- **Font:** Inter (Google Fonts) - no exceptions
- **Base:** 16px, 4px grid system
- **Mobile-first type scale**

### Technical Constraints
- Design at 375px, scale up
- Touch targets: 44x44px minimum
- No horizontal scroll ever
- WebP images only (<100KB)

---

## 4. PHASE ROADMAP

Detailed goals for each phase live in `docs/goals/PHASE-X-*.md`.

| Phase | Name | Goal | Status | Goal File |
|-------|------|------|--------|-----------|
| 0 | Foundation | Architecture, schemas, build pipeline | COMPLETE | `PHASE-0-FOUNDATION.md` |
| 1 | Content Sprint | 25 lessons: Cells as Basis of Life | **ACTIVE** | `PHASE-1-CONTENT.md` |
| 2 | Learning Experience | Navigation, UX polish, onboarding | PLANNED | `PHASE-2-UX.md` |
| 3 | Gamification Expansion | Study plans, weak area detection | PLANNED | `PHASE-3-GAMIFICATION.md` |
| 4 | Mini-Games | 8+ game types for difficult concepts | PLANNED | `PHASE-4-GAMES.md` |
| 5 | Backend & Sync | Firebase, user accounts, cross-device | PLANNED | `PHASE-5-BACKEND.md` |
| 6 | Advanced Features | AI tutor hints, adaptive difficulty | PLANNED | — |
| 7 | Scale & Content | Complete HSC Biology (Modules 1-8) | PLANNED | — |
| 8 | Monetisation | Premium tiers, school licences | PLANNED | — |
| 9 | Platform Expansion | Chemistry, Physics, junior years | PLANNED | — |
| 10 | Innovation | AR/VR, AI tutor | PLANNED | — |

---

## 5. CONTENT ARCHITECTURE

### HSC Biology Module Structure

| Module | Name | Lessons | Phase | Tracker File |
|--------|------|---------|-------|--------------|
| 1 | Cells as the Basis of Life | 25 | Phase 1 (ACTIVE) | `MODULE-1-LESSONS.md` |
| 2 | Organisation of Living Things | 25 | Phase 7 | `MODULE-2-LESSONS.md` |
| 3 | Biological Diversity | 25 | Phase 7 | `MODULE-3-LESSONS.md` |
| 4 | Ecosystem Dynamics | 25 | Phase 7 | `MODULE-4-LESSONS.md` |
| 5 | Heredity | 25 | Phase 7 | `MODULE-5-LESSONS.md` |
| 6 | Genetic Change | 25 | Phase 7 | `MODULE-6-LESSONS.md` |
| 7 | Infectious Disease | 25 | Phase 7 | `MODULE-7-LESSONS.md` |
| 8 | Non-Infectious Disease | 25 | Phase 7 | `MODULE-8-LESSONS.md` |

**Total HSC Biology Lessons: 200**

### HSC Chemistry Module Structure

| Module | Name | Lessons | Phase | Tracker File |
|--------|------|---------|-------|--------------|
| 1 | Properties and Structure of Matter | 25 | Phase 9 | `CHEM-MODULE-1-LESSONS.md` |
| 2 | Introduction to Quantitative Chemistry | 25 | Phase 9 | `CHEM-MODULE-2-LESSONS.md` |
| 3 | Reactive Chemistry | 25 | Phase 9 | `CHEM-MODULE-3-LESSONS.md` |
| 4 | Drivers of Reactions | 25 | Phase 9 | `CHEM-MODULE-4-LESSONS.md` |
| 5 | Equilibrium and Acid Reactions | 25 | Phase 9 | `CHEM-MODULE-5-LESSONS.md` |
| 6 | Acid-Base Reactions | 25 | Phase 9 | `CHEM-MODULE-6-LESSONS.md` |
| 7 | Organic Chemistry | 25 | Phase 9 | `CHEM-MODULE-7-LESSONS.md` |
| 8 | Applying Chemical Ideas | 25 | Phase 9 | `CHEM-MODULE-8-LESSONS.md` |

**Total HSC Chemistry Lessons: 200**

### Junior Science (Future)

| Subject | Phase | Status |
|---------|-------|--------|
| Year 7 Science | Phase 9 | Placeholder pages only |
| Year 8 Science | Phase 9 | Placeholder pages only |
| Year 9 Science | Phase 9 | Placeholder pages only |
| Year 10 Science | Phase 9 | Placeholder pages only |
| HSC Physics | Phase 9 | No pages yet |

---

## 6. ROLES & RESPONSIBILITIES

| Role | Owner | Responsibilities |
|------|-------|------------------|
| **Product Owner** | Kyle | Content accuracy, scientific review, approvals |
| **Project Manager** | AI | Planning, coordination, continuity, documentation |
| **Developer** | AI | Implementation, testing, deployment |
| **Quality Tester** | AI + Kyle | Validation, mobile QA, user testing |

---

## 7. DECISION LOG

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-08 | Expand Module 1: 20 to 25 lessons | Include enzymes properly, add cell theory |
| 2026-02-08 | Remove Staining Techniques | Irrelevant to HSC core |
| 2026-02-08 | Move Disease to Modules 7-8 | Better syllabus alignment |
| 2026-02-08 | Vanilla JS until Phase 5 | Performance, simplicity |
| 2026-02-09 | Lessons 6-10 content complete | Full biology content with new activity types |
| 2026-02-09 | Created lesson-renderer.js | Supports 8 activity types including interactive sims |
| 2026-02-09 | Dual lesson ID format | `module-1-cells-lesson-X` (old) + `mod1-lessonXX` (new) both valid |
| 2026-02-09 | All lessons unlocked | Prerequisite locking disabled during development |
| 2026-02-09 | Module 2 lesson sequence finalized | 25 lessons defined for Organisation of Living Things |
| 2026-02-09 | All 8 modules lesson sequences stored | Complete HSC Biology syllabus: 200 lessons across Modules 1-8 |
| 2026-02-09 | HSC Chemistry syllabus stored | Complete HSC Chemistry syllabus: 200 lessons across Modules 1-8 |

---

## 8. RISK MITIGATION

| Risk | Mitigation |
|------|------------|
| **Context Window Exhaustion** | Multi-file doc system; each file is focused and concise |
| **Scope Creep** | Phase gates rigid; new features go to backlog |
| **Technical Debt** | Fix before building; no building on broken foundations |
| **Content/Tech Misalignment** | Kyle owns content; AI owns implementation |
| **Mobile Performance** | Mobile-first design; test on 375px first |
| **Cache Issues** | Cache-busting version params on all assets |

---

## DOCUMENT NAVIGATION

| Question | Read This |
|----------|-----------|
| Where are we right now? | `docs/STATUS.md` |
| How does work get done? | `docs/WORKFLOW.md` |
| What are we building this phase? | `docs/goals/PHASE-1-CONTENT.md` |
| What's the status of each lesson? | `docs/trackers/MODULE-1-LESSONS.md` |
| What features are done? | `docs/trackers/FEATURE-MATRIX.md` |
| Are there open bugs? | `docs/trackers/BUG-LOG.md` |
| What are the technical specs? | `docs/SPECS.md` |
| What's the quality bar? | `docs/QUALITY-GATES.md` |
| How are files organised? | `docs/ARCHITECTURE.md` |
| What milestones are completed? | `docs/goals/MILESTONE-LOG.md` |

---

**Location:** `/docs/MASTER-PLAN.md`
**Update Frequency:** When project identity, constraints, or phase roadmap changes
**Owner:** Kyle + AI
