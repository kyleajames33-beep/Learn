# Science Hub - Quality Gates
**Last Updated:** 2026-02-09  
**Purpose:** Definition of Done for all deliverables  

> **Use this checklist before declaring ANY work complete**

---

## PER LESSON CHECKLIST

### Content Requirements

- [ ] **JSON validates against schema** (use `lesson-data-schema.js`)
- [ ] **≥2 distinct activity types** implemented (no lesson has only matching)
- [ ] **≥1 interactive diagram** with hotspots OR comparison table
- [ ] **3 MC questions** with 4 options each
- [ ] **2 Short Answer questions** with marking criteria
- [ ] **Copy-to-book section** with 5 definitions
- [ ] **Engagement hook** present and compelling
- [ ] **Prerequisites** properly linked (if applicable)

### Technical Requirements

- [ ] **Calculation tolerance working** (±5% standard, ±2% precision)
- [ ] **Check Answer buttons** provide immediate visual feedback
- [ ] **Mobile responsive** (375px width, no horizontal scroll)
- [ ] **Touch targets** minimum 44×44px
- [ ] **Australian spelling** verified (specialised, behaviour, etc.)
- [ ] **localStorage** saves progress correctly
- [ ] **EventBus** triggers on completion (`lessonCompleted` event)
- [ ] **Navigation** links work (Previous/Next/Module Overview)

### Visual Requirements

- [ ] **Soft Ocean Breeze** colors used correctly
- [ ] **Inter font** throughout
- [ ] **4px grid** spacing maintained
- [ ] **WebP images** <100KB each
- [ ] **Alt text** for all images
- [ ] **No console errors** on load or interaction

---

## PER BATCH CHECKLIST (5 Lessons)

### Integration Testing

- [ ] **All 5 lessons load** without console errors
- [ ] **Navigation between lessons** works (Previous/Next)
- [ ] **Prerequisite chain** blocks appropriately
- [ ] **Mobile testing** completed on actual device
- [ ] **Images optimized** and loading (<100KB each)
- [ ] **Progress persists** across all 5 lessons

### Performance Testing

- [ ] **Lighthouse Performance** >90
- [ ] **Lighthouse Accessibility** >90
- [ ] **Total page weight** <400KB per lesson
- [ ] **First Contentful Paint** <1.5s
- [ ] **Offline functionality** works (Service Worker)

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] All lessons in batch pass Per Lesson checklist
- [ ] Batch passes Per Batch checklist
- [ ] GitHub Pages builds successfully
- [ ] No broken links (run `scripts/validate-pages.js`)

### Post-Deployment

- [ ] Test on production URL (GitHub Pages)
- [ ] Test on mobile device (not just emulator)
- [ ] Verify progress saves on production
- [ ] Check all images load correctly

---

## PHASE EXIT CHECKLIST

### Phase 1 Exit (Module 1 Complete)

- [ ] **25 lessons** built and validated
- [ ] **All quality gates** passed for each lesson
- [ ] **Mobile QA** completed on Lessons 1-25
- [ ] **Kyle sign-off** on scientific accuracy
- [ ] **Zero critical bugs** open
- [ ] **Performance budget** maintained (<400KB/lesson)
- [ ] **Documentation** updated

### Documentation Updates Required

- [ ] `/docs/MASTER-PLAN.md` - Update Phase status
- [ ] `/docs/STATUS.md` - Mark all lessons complete
- [ ] `/docs/CONTENT_WORKFLOW.md` - Update lesson statuses
- [ ] README.md - Update completion percentage

---

## TESTING PROCEDURES

### Student Journey Test

1. Open Lesson 1 on mobile viewport (375px)
2. Read through content, expand accordions
3. Complete all activities
4. Answer assessment questions
5. Click "Mark Complete"
6. Close browser
7. Reopen Lesson 1
8. **Verify:** Shows "Completed" status
9. Check sidebar: Lesson 1 has checkmark
10. Navigate to Lesson 2

**Pass Criteria:** All steps work smoothly, no errors

### Offline Test

1. Open Lesson while online
2. Navigate through content
3. Open DevTools > Network > Offline
4. Refresh page
5. **Verify:** Content still visible
6. Navigate to previously visited lessons

**Pass Criteria:** All previously visited content loads without internet

### Mobile Touch Test

1. Open on iPhone SE (375px) or emulator
2. Test all buttons (44px targets)
3. Test drag-and-drop activities
4. Test accordion expand/collapse
5. Test quiz radio buttons
6. **Verify:** All interactions <100ms feedback

**Pass Criteria:** All touch targets easy to hit, responsive feedback

### Accessibility Test

1. Press Tab on page load
2. **Verify:** Skip-to-content link appears
3. Tab through entire page
4. **Verify:** Can reach all interactive elements
5. Run Lighthouse Accessibility audit
6. **Verify:** Score >= 90

**Pass Criteria:** Keyboard navigation works, WCAG 2.1 AA compliance

---

## VALIDATION COMMANDS

### Run ALL Checks (Recommended)

```bash
# Master runner — runs every check below and gives unified pass/fail
node scripts/run-all-checks.js

# Exit code 0 = all passed, exit code 1 = failures exist
```

### Individual Checks

```bash
# 1. Validate all lesson JSON files (schema, content quality, activity types, navigation)
node scripts/validate-lessons.js

# 2. Check HTML page structure (required CSS/JS, meta tags, absolute paths)
node scripts/validate-pages.js

# 3. Check for American English spellings in lesson content
node scripts/validate-spelling.js
```

### What Each Script Catches

| Script | Catches |
|--------|---------|
| `validate-lessons.js` | Missing required fields, unsupported activity types, MCQ answer mismatches, broken navigation, content quality (activity count, assessment count, definitions) |
| `validate-pages.js` | Missing CSS/JS includes, absolute paths, missing viewport/charset meta tags |
| `validate-spelling.js` | American spellings (-ize, -or, -er, hemoglobin, etc.) with exact field location |

---

## COMMON FAILURES & FIXES

### Failure: JSON Not Loading

**Symptom:** Blank page, "Unable to load lesson" error  
**Cause:** Wrong file path or CORS issue  
**Fix:** Use relative paths, verify file exists at `data/lessons/[id].json`

### Failure: Activity Not Rendering

**Symptom:** Activity section empty or error  
**Cause:** Unknown activity type or missing renderer  
**Fix:** Check activity.type matches available renderers in `lesson-renderer.js`

**Supported Types:**
- labeling, matching, ordering, classification
- problemSolving, comparison-table
- interactive-slider, tonicity-simulator

### Failure: Progress Not Saving

**Symptom:** "Mark Complete" doesn't persist  
**Cause:** localStorage key mismatch or quota exceeded  
**Fix:** Check key format: `lesson-progress-[lesson-id]`, check console for errors

### Failure: Mobile Layout Broken

**Symptom:** Horizontal scroll, overlapping elements  
**Cause:** Fixed widths, desktop-first CSS  
**Fix:** Use `max-width: 100%`, rebuild mobile-first

### Failure: Touch Events Not Working

**Symptom:** Buttons require double-tap, 300ms delay  
**Cause:** Only bound 'click' event  
**Fix:** Bind both 'click' AND 'touchstart' events

### Failure: Australian Spelling Errors

**Symptom:** "behavior" instead of "behaviour"  
**Cause:** Copy-paste from American sources  
**Fix:** Run grep check, fix all occurrences

---

## SIGN-OFF TEMPLATE

When a lesson/batch/phase is complete, document it:

```markdown
## Sign-Off: [Lesson/Batch/Phase Name]
**Date:** YYYY-MM-DD
**Developer:** [Name]
**Reviewer:** [Name]

### Checklist Results
- [x] Per Lesson: 25/25 passed
- [x] Per Batch: 5/5 passed
- [x] Deployment: Production verified

### Test Results
- Student Journey: PASS
- Offline Test: PASS
- Mobile Touch: PASS
- Accessibility: 95/100

### Known Issues
- None / [List minor issues]

### Approved For
- [x] Staging
- [x] Production

**Signature:** _______________
```

---

**Document Location:** `/docs/QUALITY-GATES.md`  
**Update Frequency:** When quality criteria change  
**Mandatory Use:** Before every commit to production
