# Quality Assurance Checklist
**Verify Everything Before Declaring Work Complete**

**Last Updated:** 2026-02-06
**Phase 00 Status:** COMPLETE — all critical items passed
**Current Use:** Apply to each new lesson or feature added in Phase 01+

---

## How to Use This Checklist

1. Go through each section systematically for new content/features
2. Check items as you verify them
3. If an item fails, fix it before continuing
4. Ask for help if stuck >30 minutes on any item
5. Only submit when 100% of Critical items pass

---

## CRITICAL (Must Pass 100%)

### C1. Functionality
- [x] Student can open Lesson 1 and see all content
- [x] All lesson text is readable (not cut off, not overlapping)
- [x] Navigation links work (no 404 errors)
- [x] "Mark Complete" button works and saves progress
- [x] Refreshing page shows completed status
- [x] All 7 lessons are accessible and navigable (exceeded 3-lesson target)
- [x] Mobile sidebar toggle opens/closes correctly

### C2. Offline Capability
- [x] App works after turning off internet (once loaded)
- [x] Service Worker is registered (DevTools > Application)
- [x] No "offline dinosaur" error when refreshing
- [x] Previously visited pages load without internet

### C3. Data Persistence
- [x] Progress saves to LocalStorage
- [x] Progress persists after browser restart
- [x] Multiple lessons can be marked complete
- [x] Progress bar updates accurately

### C4. Mobile Functionality
- [x] Works on 375px width (iPhone SE)
- [x] No horizontal scroll at any width
- [x] Sidebar accessible via hamburger menu
- [x] Touch targets easy to hit (44px minimum)
- [x] Text readable without zoom (16px base)

### C5. No Errors
- [x] Zero console errors on page load
- [x] Zero console errors during navigation
- [x] Zero console errors when interacting
- [x] No 404 errors in Network tab

---

## HIGH PRIORITY (Must Pass 90%)

### H1. Visual Design
- [x] Colors match "Soft Ocean Breeze" palette exactly
- [x] Typography uses Inter font family
- [x] Spacing uses 4px grid system
- [x] Shadows consistent (use CSS variables)
- [x] Border radius consistent (6px, 12px, 16px)
- [x] Cards have hover effects (lift + shadow)
- [x] Progress bar animates smoothly

### H2. Components
- [x] Hero section displays correctly
- [x] Learning intentions grid shows 3 cards
- [x] All accordions expand/collapse
- [x] Quiz options selectable and show state
- [x] Activity inputs accept text
- [x] "Check Answers" buttons work
- [x] Form inputs focus with ring effect
- [x] Buttons have hover states

### H3. Accessibility
- [x] Skip to content link works (press Tab on load)
- [ ] All images have alt text — **verify on new content**
- [ ] Color contrast >= 4.5:1 — **verify on new content**
- [x] Keyboard navigation works (Tab through page)
- [x] Focus indicators visible (outline on interactive elements)
- [x] Semantic HTML used (nav, main, article, button)

### H4. Performance
- [x] First Contentful Paint < 1.5s
- [x] Lighthouse Performance score >90
- [x] Total page size < 500KB
- [x] No render-blocking resources
- [x] Images optimized (if any)

### H5. Content
- [x] Lesson 1 has real content (not lorem ipsum)
- [x] Learning intentions are clear
- [x] Success criteria are measurable
- [x] Activities have instructions
- [x] Assessment questions have answers
- [ ] Scientifically accurate information — **verify with Kyle for new lessons**

### H6. Gamification (Phase 02 — Added)
- [x] XP awards correctly on lesson completion
- [x] Streak tracks consecutive days
- [x] Achievements unlock when criteria met
- [x] Dashboard displays accurate stats
- [x] Mini-games function (drag-drop, flashcard, matching, sequence)
- [x] Interactive diagrams display hotspots and info panels

---

## STANDARD (Should Pass 80%)

### S1. Cross-Browser
- [x] Chrome (latest) - no issues
- [ ] Safari (latest) - verify on new features
- [ ] Firefox (latest) - verify on new features
- [ ] Edge (latest) - verify on new features

### S2. Responsive
- [x] iPhone SE (375px) - works
- [x] iPhone 12 (390px) - works
- [x] iPad (768px) - works
- [x] Desktop (1024px+) - works
- [x] Large desktop (1440px+) - works

### S3. Polish
- [x] Loading states smooth (no flash of unstyled content)
- [x] Animations performant (60fps)
- [x] No layout shift during load
- [x] Consistent spacing throughout
- [x] Consistent alignment
- [x] Professional appearance

### S4. Code Quality
- [x] CSS uses custom properties (no hardcoded values)
- [x] JavaScript modular (separate files per feature)
- [x] File naming consistent (kebab-case)
- [x] Indentation consistent

### S5. User Experience
- [x] Student understands what to do
- [x] Navigation is intuitive
- [x] Feedback is clear (completed, correct, incorrect)
- [x] No confusing UI elements
- [x] App feels fast and responsive

---

## Device Testing Matrix

Test on these specific sizes:

| Device | Width | Critical Items | Notes |
|--------|-------|----------------|-------|
| iPhone SE | 375px | C1-C5, H1-H3 | Must be perfect |
| iPhone 12 | 390px | C1, C4, H1 | Should be perfect |
| iPad Mini | 768px | C1, H1, H2 | No issues |
| Laptop | 1024px | All | Perfect |
| Desktop | 1440px | All | Perfect |

**How to test:** Chrome DevTools > Device Mode > Responsive

---

## Testing Procedures

### Procedure 1: Student Journey Test
**Time:** 10 minutes
**Steps:**
1. Clear browser cache (or use incognito)
2. Open Lesson 1 on mobile viewport
3. Read through content, expand accordions
4. Answer quiz questions
5. Click "Mark Complete"
6. Close browser
7. Reopen Lesson 1
8. Verify: Shows "Completed" status
9. Check sidebar: Lesson 1 has checkmark

**Pass Criteria:** All steps work smoothly

---

### Procedure 2: Offline Test
**Time:** 5 minutes
**Steps:**
1. Open Lesson 1 while online
2. Navigate to Lessons 2-5
3. Open DevTools > Network
4. Check "Offline" checkbox
5. Refresh Lesson 1
6. Navigate to other lessons (offline)

**Pass Criteria:** All previously-visited content visible without internet

---

### Procedure 3: Accessibility Audit
**Time:** 15 minutes
**Tools:** Chrome DevTools Lighthouse

**Steps:**
1. Open any lesson
2. DevTools > Lighthouse
3. Check: Accessibility
4. Click "Generate Report"
5. Review all warnings

**Pass Criteria:**
- Score >= 90
- No Critical errors
- No Serious errors

**Manual Checks:**
1. Press Tab - does skip link appear?
2. Tab through entire page - can you reach everything?
3. Check contrast - use WebAIM tool on text elements

---

### Procedure 4: Performance Audit
**Time:** 10 minutes
**Tools:** Chrome DevTools Lighthouse

**Steps:**
1. Open any lesson
2. DevTools > Lighthouse
3. Check: Performance, Accessibility, Best Practices, PWA
4. Device: Mobile
5. Click "Generate Report"

**Pass Criteria:**
- Performance >= 90
- Accessibility >= 90
- Best Practices >= 90
- PWA >= 90

**If Performance < 90:**
- Check image sizes (compress if >100KB)
- Check unused CSS
- Check render-blocking resources

---

### Procedure 5: Gamification Test (NEW)
**Time:** 15 minutes

**Steps:**
1. Complete a lesson (Mark Complete)
2. Verify XP was awarded (check XP widget)
3. Check dashboard shows updated stats
4. Try a mini-game (drag-drop or flashcard)
5. Verify achievement unlocks when criteria met
6. Check streak updates on daily visit

**Pass Criteria:** All gamification systems respond correctly

---

### Procedure 6: New Lesson Verification
**Time:** 10 minutes per lesson
**Use this for every new lesson added in Phase 01+**

**Steps:**
1. Open the new lesson on mobile viewport (375px)
2. Verify hero section (title, badges, description)
3. Check all content sections render correctly
4. Test all interactive elements (activities, quizzes)
5. Click "Mark Complete" — verify it saves
6. Check sidebar shows completion
7. Test previous/next navigation links
8. Verify no console errors
9. Check gamification triggers (XP, achievements)

**Pass Criteria:** All steps work without errors

---

## Common Failures & Fixes

### Failure 1: CSS Not Loading
**Symptom:** Page looks unstyled (black text, no layout)
**Cause:** Wrong file path (used `/assets/` instead of `../../assets/`)
**Fix:** Change to relative paths based on nesting depth

### Failure 2: JavaScript Not Working
**Symptom:** Buttons don't work, progress doesn't save
**Cause:** File path wrong or JS error
**Fix:** Check console for errors, verify path

### Failure 3: Mobile Layout Broken
**Symptom:** Horizontal scroll, overlapping elements
**Cause:** Built desktop-first or used fixed widths
**Fix:** Rebuild mobile-first, use max-width: 100%

### Failure 4: Progress Not Saving
**Symptom:** "Mark Complete" doesn't persist
**Cause:** LocalStorage key mismatch or quota exceeded
**Fix:** Check keys match in `storage.js`, check console for errors

### Failure 5: Offline Not Working
**Symptom:** "No internet" error when offline
**Cause:** Service Worker not registered or wrong strategy
**Fix:** Verify SW code, check DevTools > Application

### Failure 6: Gamification Not Triggering
**Symptom:** No XP awarded, achievements don't unlock
**Cause:** Missing JS file import or `lessonCompleted` event not dispatched
**Fix:** Ensure all gamification JS files are loaded, check event listeners

---

## Per-Lesson Submission Checklist

Before submitting any new lesson:

- [ ] All content sections filled with accurate science content
- [ ] Learning intentions and success criteria defined
- [ ] At least 1 activity card with interactive elements
- [ ] At least 5 MC questions with answer key
- [ ] Mark Complete button works and saves progress
- [ ] Sidebar progress updates correctly
- [ ] Mobile layout works at 375px
- [ ] No console errors
- [ ] Navigation links work (prev/next)
- [ ] Gamification integrates correctly (XP, achievements)

---

## Success Metrics

Phase 00 is successful when (ALL ACHIEVED):
1. **Student Test:** Random student can complete Lesson 1 without instructions
2. **Teacher Test:** Kyle can add new lesson by copying template
3. **Technical Test:** Passes all QA criteria above
4. **User Test:** Student wants to continue to Lesson 2

Phase 01 success criteria:
1. All 30 Module 1 lessons written and passing QA
2. Module index pages complete with accurate lesson counts
3. Search returns relevant results
4. Navigation works across all lessons

---

**END OF QA CHECKLIST**

**Reminders:**
- Quality over speed
- Test on mobile first
- When in doubt, ask Kyle
- Run this checklist for every new lesson
