# Phase 2: Learning Experience & UX

**Status:** PLANNED
**Goal:** Make the learning experience seamless — smart navigation, "continue where you left off," onboarding, and UX polish.

**Entry Criteria:** Phase 1 complete (all 25 Module 1 lessons LIVE).

---

## Exit Criteria

- [ ] "Continue where you left off" feature works (auto-redirects to last lesson)
- [ ] Module overview pages show real progress (X/25 complete, progress bar)
- [ ] Onboarding flow for first-time users
- [ ] Lesson navigation seamless (sidebar, breadcrumbs, previous/next all work)
- [ ] Sidebar accurately reflects completion status (checkmarks on completed lessons)
- [ ] Homepage shows personalised progress
- [ ] Search functionality works (search lessons by keyword)
- [ ] Zero UX-related bugs open

---

## Planned Milestones

### M2.1: Smart Navigation
- [ ] "Continue Learning" button on homepage → goes to next incomplete lesson
- [ ] Breadcrumb navigation always accurate
- [ ] Sidebar highlights current lesson and shows completion
- [ ] Previous/Next navigation never leads to dead ends

### M2.2: Progress Visualisation
- [ ] Module overview pages show real completion percentage
- [ ] Lesson cards show completed/in-progress/locked status
- [ ] Dashboard page shows overall progress across modules
- [ ] XP and streak data visible on dashboard

### M2.3: Onboarding
- [ ] First-time user gets welcome modal
- [ ] Brief tour of features (progress tracking, activities, assessments)
- [ ] Suggested starting lesson

### M2.4: Search & Discovery
- [ ] Search bar indexes lesson titles and descriptions
- [ ] Search results link directly to lessons
- [ ] Filter by module, difficulty, topic

### M2.5: UX Polish
- [ ] Page transitions smooth
- [ ] Loading states for all async operations
- [ ] Error states user-friendly
- [ ] Accessibility audit passes (WCAG 2.1 AA)

---

## Key Technical Decisions (To Be Made)
- Search implementation: client-side (JSON index) vs simple filter
- Progress storage: enhance localStorage schema or migrate to IndexedDB
- Onboarding: modal-based vs inline tutorial

---

**Location:** `/docs/goals/PHASE-2-UX.md`
**Update Frequency:** When Phase 2 approaches or scope changes
