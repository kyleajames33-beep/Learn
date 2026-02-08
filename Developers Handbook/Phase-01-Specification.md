# Phase 1: Content Sprint (Revised for AI Coder)

## Objective
Scale from 8 lessons to 18 lessons across 3 modules

## Status
Ready for Assignment (Pending Phase 0.5 Testing Approval)

## Dependencies
Phase 0.5 complete

---

## 🎯 The Goal

**Current:** 8 lessons  
**Target:** 18 lessons (10 new)

| Module | Current | Target | Needed |
|--------|---------|--------|--------|
| Module 1: Cells | 6 | 8 | 2 |
| Module 2: Organisation | 1 | 5 | 4 |
| Module 5: Heredity | 1 | 5 | 4 |

---

## 🏗️ Work Units (Not Time-Based)

### Unit A: Module Infrastructure (Coder Task)
Build systems to support 18 lessons. One deliverable.

### Unit B: Validation Pipeline (Coder Task)
Automated checking + staging workflow. One deliverable.

### Unit C: Content Integration (Kyle + Coder Collaboration)
Kyle creates lessons in Builder → Coder validates → Deploys. Repeat 10×.

---

## 📐 Technical Specification

### Unit A: Module Infrastructure

**Deliverable:** Dynamic module system that handles any lesson count

#### Requirements:
- Module manifest JSON (`/assets/data/modules/module-*.json`)
- Module router (`/assets/js/module-router.js`)
- Index pages show actual lesson availability
- Coming soon state for empty modules
- Progress calculation across variable lesson counts

#### Acceptance:
- [ ] Adding a lesson to manifest automatically updates UI
- [ ] No hardcoded lesson counts anywhere
- [ ] Works with 1 lesson or 50 lessons

---

### Unit B: Validation Pipeline

**Deliverable:** Automated content validation + staging deployment

#### Requirements:
- `/assets/js/content-validator.js` - Schema + pedagogical checks
- `/staging/` environment - Preview before production
- Deployment script - Move validated JSON to production

#### Acceptance:
- [ ] Invalid JSON blocked from production
- [ ] Warnings shown but don't block
- [ ] Kyle can view staging without coder help

---

### Unit C: Content Integration Process

**Per Lesson Workflow:**

1. Kyle exports JSON from Builder
2. Coder runs validation
3. If pass: deploy to staging
4. Kyle reviews staging
5. If approve: deploy to production
6. Update module manifest

**Coder builds the pipeline. Kyle operates it.**

---

## 📊 Success Criteria

- [ ] 18 lessons deployed and functional
- [ ] Module router handles all states (complete/partial/coming-soon)
- [ ] Validation pipeline catches errors before production
- [ ] Kyle can create and deploy lessons without coder assistance (after pipeline built)

---

## 📁 Deliverables

- `/assets/js/module-router.js`
- `/assets/js/content-validator.js`
- `/assets/data/modules/module-*.json` (manifests for all 8 modules)
- Updated module index pages (dynamic)
- Coming soon pages
- Staging environment
- Deployment documentation

---

## 🚦 Assignment

**Unit A:** Build module infrastructure  
**Unit B:** Build validation pipeline  
**Then:** Support Kyle's 10 lesson integrations

**No timeline. Deliver when tested and working.**
