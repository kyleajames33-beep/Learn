# ✅ Phase 00 Quality Assurance Checklist
**Verify Everything Before Declaring Complete**

**Usage:** Developer checks off each item before submitting work.  
**When:** After Step 6 (Testing & Polish) in Step-by-Step guide.  
**Standard:** 100% of Critical items must pass, 90% of all items.

---

## How to Use This Checklist

1. Go through each section systematically
2. Check items as you verify them
3. If an item fails, fix it before continuing
4. Ask for help if stuck >30 minutes on any item
5. Only submit when 100% of Critical items pass

---

## 🔴 CRITICAL (Must Pass 100%)

### C1. Functionality
- [ ] Student can open Lesson 1 and see all content
- [ ] All lesson text is readable (not cut off, not overlapping)
- [ ] Navigation links work (no 404 errors)
- [ ] "Mark Complete" button works and saves progress
- [ ] Refreshing page shows completed status
- [ ] All 3 lessons are accessible and navigable
- [ ] Mobile sidebar toggle opens/closes correctly

### C2. Offline Capability
- [ ] App works after turning off internet (once loaded)
- [ ] Service Worker is registered (DevTools > Application)
- [ ] No "offline dinosaur" error when refreshing
- [ ] Previously visited pages load without internet

### C3. Data Persistence
- [ ] Progress saves to LocalStorage
- [ ] Progress persists after browser restart
- [ ] Multiple lessons can be marked complete
- [ ] Progress bar updates accurately (e.g., 2/30 = 7%)

### C4. Mobile Functionality
- [ ] Works on 375px width (iPhone SE)
- [ ] No horizontal scroll at any width
- [ ] Sidebar accessible via hamburger menu
- [ ] Touch targets easy to hit (44px minimum)
- [ ] Text readable without zoom (16px base)

### C5. No Errors
- [ ] Zero console errors on page load
- [ ] Zero console errors during navigation
- [ ] Zero console errors when interacting
- [ ] No 404 errors in Network tab

---

## 🟡 HIGH PRIORITY (Must Pass 90%)

### H1. Visual Design
- [ ] Colors match "Soft Ocean Breeze" palette exactly
- [ ] Typography uses Inter font family
- [ ] Spacing uses 4px grid system
- [ ] Shadows consistent (use CSS variables)
- [ ] Border radius consistent (6px, 12px, 16px)
- [ ] Cards have hover effects (lift + shadow)
- [ ] Progress bar animates smoothly

### H2. Components
- [ ] Hero section displays correctly
- [ ] Learning intentions grid shows 3 cards
- [ ] All accordions expand/collapse
- [ ] Quiz options selectable and show state
- [ ] Activity inputs accept text
- [ ] "Check Answers" buttons work
- [ ] Form inputs focus with ring effect
- [ ] Buttons have hover states

### H3. Accessibility
- [ ] Skip to content link works (press Tab on load)
- [ ] All images have alt text (if any)
- [ ] Color contrast ≥ 4.5:1 (use WebAIM checker)
- [ ] Keyboard navigation works (Tab through page)
- [ ] Focus indicators visible (outline on interactive elements)
- [ ] Semantic HTML used (nav, main, article, button)

### H4. Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Lighthouse Performance score >90
- [ ] Total page size < 500KB
- [ ] No render-blocking resources
- [ ] Images optimized (if any)

### H5. Content
- [ ] Lesson 1 has real content (not lorem ipsum)
- [ ] Learning intentions are clear
- [ ] Success criteria are measurable
- [ ] Activities have instructions
- [ ] Assessment questions have answers
- [ ] Scientifically accurate information

---

## 🟢 STANDARD (Should Pass 80%)

### S1. Cross-Browser
- [ ] Chrome (latest) - no issues
- [ ] Safari (latest) - no major issues
- [ ] Firefox (latest) - no major issues
- [ ] Edge (latest) - no major issues

### S2. Responsive
- [ ] iPhone SE (375px) - perfect
- [ ] iPhone 12 (390px) - perfect
- [ ] iPad (768px) - no issues
- [ ] Desktop (1024px+) - perfect
- [ ] Large desktop (1440px+) - no issues

### S3. Polish
- [ ] Loading states smooth (no flash of unstyled content)
- [ ] Animations performant (60fps)
- [ ] No layout shift during load
- [ ] Consistent spacing throughout
- [ ] Consistent alignment
- [ ] Professional appearance

### S4. Code Quality
- [ ] CSS uses custom properties (no hardcoded values)
- [ ] JavaScript commented
- [ ] No unused CSS rules
- [ ] No unused JavaScript
- [ ] File naming consistent (kebab-case)
- [ ] Indentation consistent (2 spaces)

### S5. User Experience
- [ ] Student understands what to do
- [ ] Navigation is intuitive
- [ ] Feedback is clear (completed, correct, incorrect)
- [ ] No confusing UI elements
- [ ] App feels fast and responsive

---

## 📱 Device Testing Matrix

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

## 🔍 Testing Procedures

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
2. Navigate to Lesson 2
3. Navigate to Lesson 3
4. Open DevTools > Network
5. Check "Offline" checkbox
6. Refresh Lesson 1
7. Navigate to Lesson 2 (offline)
8. Navigate to Lesson 3 (offline)

**Pass Criteria:** All content visible without internet

---

### Procedure 3: Accessibility Audit
**Time:** 15 minutes
**Tools:** Chrome DevTools Lighthouse

**Steps:**
1. Open Lesson 1
2. DevTools > Lighthouse
3. Check: Accessibility
4. Click "Generate Report"
5. Review all warnings

**Pass Criteria:**
- Score ≥ 90
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
1. Open Lesson 1
2. DevTools > Lighthouse
3. Check: Performance, Accessibility, Best Practices, PWA
4. Device: Mobile
5. Click "Generate Report"

**Pass Criteria:**
- Performance ≥ 90
- Accessibility ≥ 90
- Best Practices ≥ 90
- PWA ≥ 90

**If Performance < 90:**
- Check image sizes (compress if >100KB)
- Check unused CSS
- Check render-blocking resources

---

### Procedure 5: Cross-Browser Test
**Time:** 20 minutes

**Chrome:**
1. Open Lesson 1
2. Verify layout, functionality, console

**Safari (if Mac available):**
1. Open Lesson 1
2. Verify basic functionality

**Firefox:**
1. Open Lesson 1
2. Verify basic functionality

**Pass Criteria:** No major issues in any browser

---

## 🚨 Common Failures & Fixes

### Failure 1: CSS Not Loading
**Symptom:** Page looks unstyled (black text, no layout)
**Cause:** Wrong file path (used `/assets/` instead of `../../assets/`)
**Fix:** Change to relative paths

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
**Fix:** Check keys match, check console for errors

### Failure 5: Offline Not Working
**Symptom:** "No internet" error when offline
**Cause:** Service Worker not registered or wrong strategy
**Fix:** Verify SW code, check DevTools > Application

### Failure 6: Poor Performance
**Symptom:** Slow load, janky animations
**Cause:** Images too large, too much CSS/JS
**Fix:** Compress images, remove unused code

---

## 📋 Final Submission Checklist

Before telling Kyle "Phase 00 is done":

- [ ] This QA checklist is 100% complete
- [ ] All Critical items pass
- [ ] 90%+ of High Priority items pass
- [ ] 80%+ of Standard items pass
- [ ] Tested on real mobile device (if possible)
- [ ] Kyle has tested and approved
- [ ] All files committed to repository
- [ ] GitHub Pages deployed (if applicable)

---

## 🎯 Success Metrics

Phase 00 is successful when:

1. **Student Test:** Random student can complete Lesson 1 without instructions
2. **Teacher Test:** Kyle can add new lesson by copying template
3. **Technical Test:** Passes all QA criteria above
4. **User Test:** Student wants to continue to Lesson 2

---

**END OF QA CHECKLIST**

**Reminders:**
- Quality over speed
- Test on mobile first
- When in doubt, ask
- Don't submit until ready
