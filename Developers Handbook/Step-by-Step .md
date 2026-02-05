# 🔨 Phase 00: Step-by-Step Build Guide
**Follow These Steps Exactly - Do Not Skip or Reorder**

**Estimated Time:** 5 days (40 hours)  
**Complexity:** Medium  
**Prerequisites:** Read 00-DEVELOPER-HANDBOOK.md

---

## Pre-Flight Checklist

Before starting Step 1, ensure you have:
- [ ] Modern code editor (VS Code recommended)
- [ ] Chrome/Edge browser with DevTools
- [ ] Live Server extension (or equivalent)
- [ ] This document and Handbook open side-by-side
- [ ] No distractions (this requires focus)

**Golden Rule:** Test on mobile viewport (375px) after EVERY component you build.

---

## STEP 1: Create Global CSS (Day 1 - Morning)
**Time:** 4 hours  
**Output:** `assets/css/global.css` (complete)

### 1.1 Setup File Structure
```bash
Create folders:
/science-hub/
├── assets/
│   ├── css/
│   └── js/
└── hsc-biology/
    └── module-1-cells/
```

### 1.2 CSS Custom Properties (Design Tokens)
Create `assets/css/global.css`:

**Section A: Color Palette (15 mins)**
```css
:root {
  /* Copy EXACTLY from Handbook */
  --primary: #93e4f9;
  --primary-light: #caf0f8;
  --primary-dark: #67d5ed;
  /* ... all colors ... */
}
```
**Test:** Create test.html, apply colors to divs, verify they match "Soft Ocean Breeze"

**Section B: Typography (10 mins)**
```css
--font-primary: 'Inter', sans-serif;
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
/* ... continue ... */
```

**Section C: Spacing System (10 mins)**
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
```
**Rule:** Every margin/padding must use these variables. NO hardcoded pixel values.

**Section D: Reset & Base (20 mins)**
- Box-sizing border-box
- Remove default margins
- Set base font styles
- Image max-width 100%

**Section E: Utility Classes (30 mins)**
Create classes for:
- `.text-secondary`, `.text-muted`
- `.container` (max-width, margins)
- `.visually-hidden` (accessibility)

**Section F: Layout System (45 mins)**
```css
/* Mobile-first layout */
.lesson-layout {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .lesson-layout {
    grid-template-columns: 280px 1fr;
  }
}
```

**Section G: Components (90 mins)**
Build in this order:
1. **Top Navigation** (fixed, hamburger menu, breadcrumb)
2. **Sidebar** (lesson list, progress bar)
3. **Cards** (header, content, hover effects)
4. **Buttons** (primary, secondary, complete)
5. **Form elements** (inputs, textareas)
6. **Badges** (module, critical, lesson number)
7. **Accordion** (details/summary styling)
8. **Quiz options** (radio button styling)

**Section H: Animations (30 mins)**
- Fade in on scroll
- Hover transitions
- Progress bar animation

**Section I: Print Styles (20 mins)**
- Hide navigation
- Ensure text is black
- Page breaks for cards

### End of Step 1 Checklist:
- [ ] All CSS variables defined
- [ ] Mobile-first responsive
- [ ] Components render correctly at 375px
- [ ] No console errors
- [ ] Lighthouse CSS score >90

---

## STEP 2: Core JavaScript (Day 1 - Afternoon / Day 2 Morning)
**Time:** 6 hours  
**Output:** `assets/js/main.js` (complete)

### 2.1 Storage Manager (90 mins)
Create `assets/js/main.js`:

```javascript
const StorageManager = {
  STORAGE_PREFIX: 'sh_',

  isAvailable() { /* check localStorage */ },
  get(key) { /* get + JSON.parse */ },
  set(key, value) { /* JSON.stringify + set */ },

  // Progress tracking
  markLessonComplete(yearLevel, moduleId, lessonId) { },
  isLessonComplete(yearLevel, moduleId, lessonId) { },
  getModuleProgress(yearLevel, moduleId) { },
  saveLastVisited(yearLevel, moduleId, lessonId) { }
};
```

**Test:** Open browser console, test each method

### 2.2 UI Functions (90 mins)

**Function 1: Mobile Sidebar Toggle**
```javascript
function setupMobileSidebar() {
  // Toggle .open class on sidebar
  // Close when clicking outside
}
```

**Function 2: Progress Bar Update**
```javascript
function updateSidebarProgress(yearLevel, moduleId, totalLessons) {
  // Calculate percentage
  // Update width of progress fill
  // Update text (e.g., "2/30 lessons (7%)")
}
```

**Function 3: Mark Complete Button**
```javascript
function setupMarkComplete(yearLevel, moduleId, lessonId) {
  // Check if already complete
  // On click: mark complete, update UI, update sidebar
}
```

**Function 4: Quiz Validation**
```javascript
function checkAnswers() {
  // Compare selected radio buttons to correct answers
  // Add .correct/.incorrect classes to options
  // Show score
}
```

**Function 5: Activity Validation**
```javascript
function checkActivity1() {
  // Check input values against answers
  // Visual feedback (green/red borders)
}
```

### 2.3 Scroll Animations (45 mins)
```javascript
function setupScrollAnimations() {
  // IntersectionObserver
  // Add .visible class when elements enter viewport
}
```

### 2.4 Initialize Everything (30 mins)
```javascript
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  setupMobileSidebar();
  setupScrollAnimations();
  // Lesson-specific setup happens in each HTML file
});
```

### End of Step 2 Checklist:
- [ ] All functions work in console
- [ ] Progress saves to LocalStorage
- [ ] Progress persists after refresh
- [ ] No JS errors on page load

---

## STEP 3: Service Worker (Day 2 - Afternoon)
**Time:** 2 hours  
**Output:** `assets/js/service-worker.js`

### 3.1 Basic Service Worker
```javascript
const CACHE_NAME = 'science-hub-v1';

// Install: Skip waiting
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', event => {
  // Delete old cache versions
});

// Fetch: Cache as you go
self.addEventListener('fetch', event => {
  // Return cached version OR fetch and cache
});
```

### 3.2 Registration
Add to main.js:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/assets/js/service-worker.js');
}
```

### 3.3 Testing
- Open Chrome DevTools > Application > Service Workers
- Verify it's registered
- Go Offline (Network tab)
- Refresh page - should still work

### End of Step 3 Checklist:
- [ ] Service Worker registered
- [ ] Works offline after first visit
- [ ] Cache updates when content changes

---

## STEP 4: Build Lesson Template (Day 2-3)
**Time:** 8 hours  
**Output:** Working lesson template with all components

### 4.1 HTML Structure
Create `template.html` (will become Lesson 1):

**Section A: Head (15 mins)**
- Meta charset, viewport
- Description meta
- Google Fonts (Inter)
- Link to global.css
- Lucide Icons CDN

**Section B: Top Navigation (30 mins)**
- Skip to content link (accessibility)
- Logo (atom icon + "Science Hub")
- Mobile menu toggle button
- Search input (hidden on mobile)
- Breadcrumb navigation

**Section C: Sidebar (45 mins)**
- Module title ("Module 1: Cells")
- Progress bar (0% initially)
- Lesson list (links to lessons 1-3)
- Active state styling
- Completed checkmarks

**Section D: Hero Section (30 mins)**
- Badges (HSC Biology, Module 1, Lesson 1)
- Title ("Introduction to Cells")
- Description (1-2 sentences)
- Meta info (45 min, Foundation Level, Works Offline)

**Section E: Learning Intentions Grid (30 mins)**
- 3 cards in grid:
  1. Learning Intentions (target icon)
  2. Syllabus Links (link icon)
  3. Success Criteria (check-circle icon)

**Section F: Engagement Hook (20 mins)**
- Eye-catching box with lightbulb icon
- "Think About This..." headline
- Interesting fact/statistic

**Section G: Content Sections (60 mins)**
- Section title with icon
- Paragraphs of text
- Key definition box
- Two-column grid (All Cells Have / All Cells Can)

**Section H: Accordion (30 mins)**
- "Deep Dive: The Math Behind Cell Size"
- Expandable content
- Smooth animation

**Section I: Worked Example (45 mins)**
- Distinctive styling (border, background)
- Step-by-step problem
- Calculations clearly shown
- Final answer highlighted

**Section J: Activity Card (60 mins)**
- Teal color scheme
- Activity number badge
- Instructions
- Interactive elements (inputs, matching)
- Check Answers button
- Result display area

**Section K: Copy Into Books (30 mins)**
- Accordion (starts open)
- Key definitions and points
- Well-formatted for copying

**Section L: Assessment Questions (90 mins)**
- Multiple Choice section:
  - Question text with number
  - 4 options (A, B, C, D)
  - Radio buttons styled
  - Check Answers button
- Short Answer section:
  - 2-3 questions
  - Marks indicated
  - Textareas for answers

**Section M: Answer Key (20 mins)**
- Accordion (starts closed)
- Correct answers for all questions
- Marking guidelines

**Section N: Mark Complete (15 mins)**
- Prominent button
- "Mark as Complete" → changes to "Completed!"
- Visual feedback

**Section O: Lesson Navigation (20 mins)**
- Previous lesson button (or placeholder)
- Module overview button
- Next lesson button

**Section P: Footer (20 mins)**
- Logo and tagline
- Quick links
- Copyright

### End of Step 4 Checklist:
- [ ] All sections render correctly
- [ ] Mobile layout works (sidebar becomes drawer)
- [ ] All accordions expand/collapse
- [ ] Navigation links work
- [ ] Lighthouse accessibility score >90

---

## STEP 5: Create 3 Sample Lessons (Day 3-4)
**Time:** 8 hours  
**Output:** Lessons 1, 2, 3 complete

### 5.1 Lesson 1: Introduction to Cells
**Content to Include:**
- What is a cell? (definition)
- Cell theory basics
- Why cells are small (SA:V ratio)
- Worked example: Calculating SA:V ratio
- Activity: Cell size matching
- Activity: Unicellular vs multicellular classification
- 5 MC questions
- 2 Short answer questions

**Time:** 4 hours (includes writing content)

### 5.2 Lesson 2: Prokaryotic Cells
**Structure:** Copy Lesson 1 template
**Content:**
- What are prokaryotes?
- Bacterial cell structure
- Nucleoid region
- Plasmids
- Binary fission
- Comparison to eukaryotes
- Activities and assessments

**Time:** 2 hours (mostly template, less content)

### 5.3 Lesson 3: Eukaryotic Cell Structure
**Structure:** Copy Lesson 1 template
**Content:**
- What are eukaryotes?
- Nucleus structure
- Membrane-bound organelles overview
- Animal vs plant cells
- Endosymbiotic theory mention
- Activities and assessments

**Time:** 2 hours

### End of Step 5 Checklist:
- [ ] All 3 lessons have unique content
- [ ] Navigation between lessons works
- [ ] Each lesson can be marked complete
- [ ] Progress shows correctly in sidebar

---

## STEP 6: Testing & Polish (Day 4-5)
**Time:** 8 hours  
**Output:** Production-ready Phase 00

### 6.1 Mobile Testing (2 hours)
**Devices to Test:**
- iPhone SE (375px)
- iPhone 12 (390px)
- iPad (768px)

**Checklist for each:**
- [ ] No horizontal scroll
- [ ] Sidebar works (toggle button)
- [ ] Text readable without zoom
- [ ] Touch targets easy to hit
- [ ] Layout doesn't break
- [ ] Images fit screen

**How:** Chrome DevTools Device Mode

### 6.2 Offline Testing (1 hour)
**Steps:**
1. Open Lesson 1
2. Go to Chrome DevTools > Network
3. Set to "Offline"
4. Refresh page
5. Navigate to Lesson 2
6. Verify content loads

**Expected:** Everything works except new content you haven't visited yet

### 6.3 Accessibility Audit (2 hours)
**Tools:**
- Chrome DevTools Lighthouse (Accessibility)
- WebAIM Contrast Checker
- Keyboard navigation test

**Checks:**
- [ ] Tab through entire page (can you reach everything?)
- [ ] Skip to content link works
- [ ] Alt text on all images
- [ ] Color contrast ratios
- [ ] Focus indicators visible
- [ ] Semantic HTML validation

### 6.4 Performance Audit (2 hours)
**Lighthouse Checks:**
- [ ] Performance >90
- [ ] Accessibility >90
- [ ] Best Practices >90
- [ ] PWA >90

**Optimizations if needed:**
- Compress images
- Minimize CSS (if needed)
- Lazy load below-fold content

### 6.5 Cross-Browser Testing (1 hour)
**Browsers:**
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

**Check:** Layout, functionality, console errors

### End of Step 6 Checklist:
- [ ] All tests pass
- [ ] No console errors
- [ ] Kyle approves
- [ ] Ready for GitHub Pages deployment

---

## 🎯 Final Verification

Before declaring Phase 00 complete, verify:

**Student Journey Test:**
1. Open Lesson 1 on phone
2. Read through content
3. Expand accordions
4. Complete activities
5. Answer quiz questions
6. Mark lesson complete
7. Close browser
8. Reopen Lesson 1
9. **Verify:** Shows as completed

**Offline Test:**
1. Visit all 3 lessons while online
2. Turn off internet
3. Refresh each lesson
4. **Verify:** All content visible

**Navigation Test:**
1. Start at Lesson 1
2. Click Next → Lesson 2
3. Click Next → Lesson 3
4. Click Previous → back to Lesson 2
5. Click Module Overview
6. **Verify:** All navigation works

---

## 🚨 Emergency Troubleshooting

**Problem:** CSS not loading
**Solution:** Check file paths - use relative paths (`../assets/` not `/assets/`)

**Problem:** JavaScript not working
**Solution:** Check console for errors. Likely typo or wrong element selector

**Problem:** Mobile layout broken
**Solution:** You built desktop-first. Rebuild mobile-first (start at 375px)

**Problem:** Progress not saving
**Solution:** Check LocalStorage in DevTools > Application. Likely key mismatch

**Problem:** Offline not working
**Solution:** Verify Service Worker registered. Check Cache Storage in DevTools

---

## 📋 Daily Standup Questions

Ask yourself each morning:
1. What did I complete yesterday?
2. What am I working on today?
3. Are there any blockers?

If blocked >2 hours, ask for help immediately.

---

**END OF STEP-BY-STEP GUIDE**

**Next:** See COMPONENT-LIBRARY.md for detailed component specs
