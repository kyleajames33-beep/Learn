# Common Mistakes & Solutions

**Last Updated:** 2026-02-10
**Purpose:** Known bugs, pitfalls, and how to avoid them

Read this file BEFORE starting any work to avoid repeating past mistakes.

---

## FOR AI DEVELOPERS: GROWING THIS FILE

**This file is a living knowledge base.** Every time you discover and fix a NEW bug (not already documented here), you MUST add it to this file.

**Why?** Each bug documented saves the next AI 2-8 hours of debugging time. This file makes the autonomous system progressively smarter.

**When to add a new mistake:**
1. You encounter a bug that isn't already listed in this file
2. You spend more than 30 minutes debugging it
3. The bug could reasonably happen again
4. You fixed it and understand the root cause

**Format for new entries:**
```markdown
### X. [Short Title]

**Bug:** [One sentence describing the symptom]

**Cause:**
```language
// WRONG - Show the problematic code
```

**Solution:**
```language
// RIGHT - Show the correct code
```

**How to avoid:**
- Specific rule to prevent this
- Command to run that catches it
- Test that validates it
```

**After adding a new mistake:**
- Update the mistake number (increment from the last one)
- Update "Last Updated" date at the top of this file
- Mention it in your LAST SESSION LOG in STATUS.md
- This is mandatory, not optional

---

## CRITICAL MISTAKES (Will Break Lessons)

### 1. Using `document.currentScript` in Async Callbacks

**Bug:** Service worker registration failed with 404 error

**Cause:**
```javascript
// WRONG - document.currentScript is null inside async callbacks
window.addEventListener('load', () => {
  const scriptUrl = document.currentScript.src; // NULL!
  navigator.serviceWorker.register(new URL('service-worker.js', scriptUrl));
});
```

**Solution:**
```javascript
// RIGHT - Capture document.currentScript synchronously at module level
const _scriptUrl = document.currentScript && document.currentScript.src;

window.addEventListener('load', () => {
  if (!_scriptUrl) return;
  const swPath = new URL('service-worker.js', _scriptUrl).href;
  navigator.serviceWorker.register(swPath);
});
```

**How to avoid:**
- NEVER access `document.currentScript` inside event callbacks
- Always capture it at the top level of your script file

---

### 2. CSS `.reveal` Hiding All Content

**Bug:** Lesson content invisible below hero section

**Cause:**
```css
/* WRONG - Content starts hidden and never shows */
.reveal {
  opacity: 0;
  transform: translateY(20px);
}
```

And IntersectionObserver adds `.revealed` but CSS expects `.visible`:
```javascript
// WRONG class name
entry.target.classList.add('revealed');
```

**Solution:**
```css
/* RIGHT - Content starts visible */
.reveal {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
```

```javascript
// RIGHT class name
entry.target.classList.add('visible');
```

**How to avoid:**
- Never set `opacity: 0` as default for content elements
- Always check that CSS class names match JavaScript class names
- Test on actual deployed page, not just local

---

### 3. Browser Caching Stale Files

**Bug:** Code changes not appearing after deployment

**Cause:**
- HTML file cached by browser
- HTML references old `?v=` params
- Browser serves old CSS/JS even after code push

**Solution:**

**Before every commit that changes CSS/JS:**
```bash
node scripts/bump-versions.js
```

This updates ALL `?v=` params across ALL HTML files to current timestamp.

**How to avoid:**
- Run `bump-versions.js` BEFORE committing CSS/JS changes
- Add cache-control meta tags to critical HTML pages
- Hard refresh (Ctrl+Shift+R) when testing

---

### 4. Unsupported Activity Types

**Bug:** Activity section renders blank or shows error

**Cause:**
```json
{
  "type": "multiple-choice"  // NOT SUPPORTED
}
```

**Supported types ONLY:**
- `matching`
- `fill-blank`
- `classification`
- `ordering`
- `labeling`
- `fillBlank`
- `calculation`

**Solution:**
Change to a supported type:
```json
{
  "type": "classification"  // SUPPORTED
}
```

**How to avoid:**
- Check `scripts/validate-lessons.js` SUPPORTED_ACTIVITY_TYPES array
- Run smoke test: `node scripts/smoke-test.js`
- Don't invent new activity types without building renderer first

---

### 5. MCQ Answer Not in Options List

**Bug:** Quiz marking fails, shows "incorrect" for right answer

**Cause:**
```json
{
  "question": "What is X?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "Option B"  // WRONG - not in options array!
}
```

**Solution:**
```json
{
  "question": "What is X?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "B"  // RIGHT - matches options exactly
}
```

**How to avoid:**
- `correctAnswer` must be EXACTLY one of the strings in `options` array
- Copy-paste from options array, don't retype
- Run validation: `node scripts/validate-lessons.js`

---

## QUALITY MISTAKES (Tests Will Fail)

### 6. American English Spelling

**Bug:** Validation fails with spelling errors

**Examples:**
- ❌ specialized → ✅ specialised
- ❌ behavior → ✅ behaviour
- ❌ color → ✅ colour
- ❌ center → ✅ centre
- ❌ analyze → ✅ analyse
- ❌ fiber → ✅ fibre
- ❌ hemoglobin → ✅ haemoglobin
- ❌ labeled → ✅ labelled
- ❌ tumor → ✅ tumour

**How to avoid:**
- Use Australian English from the start
- Run: `node scripts/validate-spelling.js`
- Set your editor spell-check to "English (Australia)"

---

### 7. Absolute Paths in HTML

**Bug:** CSS/JS/images don't load on GitHub Pages

**Cause:**
```html
<!-- WRONG - absolute path breaks on /Learn/ subdirectory -->
<link rel="stylesheet" href="/assets/css/global.css">
```

**Solution:**
```html
<!-- RIGHT - relative path works everywhere -->
<link rel="stylesheet" href="../assets/css/global.css">
```

**How to avoid:**
- NEVER use paths starting with `/`
- Always use `../` or `./` relative paths
- Run: `node scripts/validate-pages.js`

---

### 8. Missing Required JSON Fields

**Bug:** Lesson fails to load, shows "Invalid lesson data"

**Required fields:**
```json
{
  "id": "mod1-lesson01",
  "title": "...",
  "module": "module-1-cells",
  "moduleTitle": "...",
  "lessonNumber": 1,
  "duration": "45 minutes",
  "difficulty": "Foundation Level",
  "learningIntentions": [...],
  "successCriteria": [...],
  "contentSections": [...]
}
```

**How to avoid:**
- Copy from TEMPLATE.json
- Run: `node scripts/validate-lessons.js`

---

### 9. Lesson ID Format Mismatch

**Bug:** Schema validation rejects lesson ID

**Valid formats:**
```json
"id": "mod1-lesson01"           // ✅ VALID
"id": "module-1-cells-lesson-1"  // ✅ VALID
```

**Invalid formats:**
```json
"id": "lesson-1"                 // ❌ INVALID
"id": "mod-1-lesson-1"           // ❌ INVALID
"id": "module1lesson1"           // ❌ INVALID
```

**Pattern:**
- `mod[NUMBER]-lesson[NUMBER]` OR
- `module-[NUMBER]-[NAME]-lesson-[NUMBER]`

**How to avoid:**
- Follow the pattern exactly
- Run: `node scripts/validate-lessons.js`

---

## PERFORMANCE MISTAKES

### 10. Service Worker Stale-While-Revalidate for CSS/JS

**Bug:** Users always see old cached code first

**Cause:**
```javascript
// WRONG strategy for CSS/JS
if (isAsset(request)) {
  return staleWhileRevalidate(request); // Serves old code!
}
```

**Solution:**
```javascript
// RIGHT strategy - network-first for CSS/JS
if (isCriticalAsset(request)) { // CSS/JS only
  return networkFirst(request); // Fetch fresh code
}
if (isAsset(request)) { // Images/fonts
  return staleWhileRevalidate(request); // Cache OK for images
}
```

**How to avoid:**
- Use network-first for CSS/JS
- Use stale-while-revalidate for images/fonts only
- Bump service worker cache version when changing strategy

---

### 11. Missing Cache-Control Meta Tags

**Bug:** Browser caches HTML files aggressively

**Solution:**
Add to `<head>` of all critical pages:
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

**How to avoid:**
- Add to: `index.html`, `hsc-biology/index.html`, `lesson.html`
- Don't add to static content pages (they can cache)

---

## CONTENT QUALITY MISTAKES

### 12. Too Few Activities

**Bug:** Quality score drops below baseline

**Minimum:**
- 2 activities per lesson (but warns)

**Recommended:**
- 4 activities per lesson
- At least 2 different activity types

**How to avoid:**
- Run: `node scripts/score-lessons.js`
- Check quality score vs baseline (first 5 lessons)

---

### 13. Missing Engagement Hook

**Bug:** Lesson feels dry, quality score penalized

**Solution:**
```json
{
  "engagementHook": {
    "title": "The Invisible Kingdom",
    "content": "Compelling question or scenario that hooks student interest. Minimum 20 characters."
  }
}
```

**How to avoid:**
- Every lesson needs an engagement hook
- Make it interesting, not generic
- Minimum 20 characters

---

### 14. Weak Assessment Questions

**Bug:** Quality score drops, insufficient assessment

**Minimum:**
- 3 MCQs with 4 options each
- 2 Short Answer Questions

**Each MCQ must have:**
```json
{
  "id": "mcq-1",
  "question": "...",
  "options": ["A", "B", "C", "D"],  // Exactly 4
  "correctAnswer": "B"               // One of the options
}
```

**How to avoid:**
- Run: `node scripts/validate-lessons.js`
- Check: "Assessment: Only X MCQs (recommend 3)"

---

## WORKFLOW MISTAKES

### 15. Committing Without Testing

**Bug:** Breaks deployment, wastes time

**WRONG workflow:**
```bash
git add -A
git commit -m "add lesson"
git push
# OOPS - tests fail in production
```

**RIGHT workflow:**
```bash
node scripts/run-all-checks.js  # Test first!
# Fix any failures
git add -A
git commit -m "add lesson"
git push
```

**How to avoid:**
- ALWAYS run tests before commit
- Never skip validation
- Add to muscle memory: test → commit → push

---

### 16. Not Updating STATUS.md

**Bug:** Next AI doesn't know what was done or what to do next

**ALWAYS update:**
1. LAST SESSION LOG (what you did)
2. NEXT TASK (what should happen next)

**How to avoid:**
- Read `docs/AI-START-HERE.md` Step 4
- Update before committing
- Include test results in session log

---

### 17. Duplicate Renders

**Bug:** Lesson renders twice, duplicate console logs

**Cause:**
- lesson-renderer.js auto-initializes on DOMContentLoaded
- lesson.html ALSO manually calls init()

**Solution:**
```javascript
// Remove auto-init from lesson-renderer.js
// ONLY initialize from lesson.html manually
```

**How to avoid:**
- Don't add auto-init to modules
- Let the HTML page control initialization

---

## DEBUGGING MISTAKES

### 18. Not Using Error Tracker

**Bug:** Spend 8 hours debugging 1 issue

**Solution:**
1. Add error tracker to lesson.html:
   ```html
   <script src="../assets/js/error-tracker.js"></script>
   ```

2. When user reports bug, get errors:
   ```javascript
   // In browser console
   copy(JSON.stringify(localStorage.getItem('science-hub-errors')))
   ```

3. Analyze:
   ```bash
   # Paste into scripts/errors.json
   node scripts/read-errors.js
   ```

**How to avoid:**
- Always use error tracker
- Get production errors instead of guessing
- Reduces debug time from hours to minutes

---

## SUMMARY: PRE-FLIGHT CHECKLIST

Before starting ANY work:
- [ ] Read this file (COMMON-MISTAKES.md)
- [ ] Read docs/STATUS.md (what to do)
- [ ] Read docs/WORKFLOW.md (how to do it)
- [ ] Understand the task completely

While working:
- [ ] Use Australian English
- [ ] Use relative paths only
- [ ] Only use supported activity types
- [ ] Follow the lesson pipeline stages

Before committing:
- [ ] Run `node scripts/run-all-checks.js`
- [ ] Fix all errors (don't skip!)
- [ ] Update docs/STATUS.md
- [ ] Update tracker files

---

**If you encounter a NEW bug not listed here:**
1. Fix it
2. Document it in this file
3. Add to docs/trackers/BUG-LOG.md
4. Update LAST SESSION LOG in STATUS.md

**This file prevents you from spending hours fixing bugs that were already solved.**

**Read it every time. Save yourself 8 hours.**
