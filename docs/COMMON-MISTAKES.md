# Common Mistakes & Solutions

**Last Updated:** 2026-02-10 (v2 — added V2.0 renderer bugs #19-22)
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

## V2.0 RENDERER MISTAKES (New Format)

### 19. V2 Lesson Crashes Renderer — Missing Format Detection

**Bug:** Lesson shows "Failed to load lesson: TypeError: Cannot read properties of undefined (reading 'title')" — page is completely blank

**Cause:**
```javascript
// WRONG - render() always calls V1 methods, even for V2 lessons
render() {
  const html = `
    ${this.renderEngagementHook()}  // V2 lessons have NO engagementHook!
  `;
}

renderEngagementHook() {
  const hook = this.lesson.engagementHook; // undefined for V2
  return `<h3>${hook.title}</h3>`;  // CRASH: cannot read 'title' of undefined
}
```

**Solution:**
```javascript
// RIGHT - detect V2 format and route to V2 renderer
render() {
  if (this.isV2Format()) {
    this.loadV2Styles();
    this.renderV2();  // Uses V2 methods that understand contentHTML, hero, intentions
    return;
  }
  // ... V1 rendering below
}

isV2Format() {
  return this.lesson && (this.lesson.v2 === true || this.lesson.contentHTML);
}

// Also guard V1 methods against missing fields
renderEngagementHook() {
  const hook = this.lesson.engagementHook;
  if (!hook) return '';  // Guard!
  // ...
}
```

**How to avoid:**
- V2 lessons have `"v2": true` and `contentHTML` fields — no `engagementHook`
- When adding V2 format support to ANY renderer method, always add null guards
- Always add `isV2Format()` detection BEFORE accessing V1-specific fields
- Test with BOTH V1 and V2 lessons after any renderer changes

---

### 20. V2 Answer Formats Are Not Always Arrays

**Bug:** "TypeError: act.answers.map is not a function" — Answer Key section crashes

**Cause:**
V2 lessons have 3 different answer formats in `answers.activities`:
```javascript
// Format 1: Array (labeling, matching) — works with .map()
{ "answers": [{ "label": "Nucleoid", "description": "..." }] }

// Format 2: Object with category keys (classification) — .map() CRASHES!
{ "answers": { "prokaryotic": ["item1", "item2"], "eukaryotic": ["item3"] } }

// Format 3: No answers property (ordering) — .map() CRASHES!
{ "correctOrder": ["step1", "step2"], "explanation": "..." }
```

```javascript
// WRONG - assumes all answers are arrays
act.answers.map(a => `<li>${a.label}: ${a.description}</li>`)  // CRASH on format 2 & 3!
```

**Solution:**
```javascript
// RIGHT - handle all 3 formats
renderV2ActivityAnswer(act) {
  if (Array.isArray(act.answers)) {
    return act.answers.map(a => `<li>${a.label}: ${a.description}</li>`).join('');
  }
  if (act.answers && typeof act.answers === 'object') {
    return Object.entries(act.answers).map(([category, items]) =>
      `<strong>${category}:</strong><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`
    ).join('');
  }
  if (act.correctOrder) {
    return `<ol>${act.correctOrder.map(i => `<li>${i}</li>`).join('')}</ol>`;
  }
  return '<p>See activity for answer.</p>';
}
```

**How to avoid:**
- NEVER assume `act.answers` is an array — always check with `Array.isArray()`
- Different activity types (labeling, classification, ordering) have different answer structures
- When rendering answers, handle: array, object, and missing/undefined cases
- Test the answer key section with ALL activity types in the lesson

---

### 21. Missing Script References in lesson.html

**Bug:** HTML validation fails; features like gamification don't work on lesson pages

**Cause:**
```html
<!-- WRONG - missing main.js (contains gamification engine, utilities) -->
<script src="../assets/js/lucide.min.js"></script>
<script src="../assets/js/lesson-renderer.js"></script>
<!-- No main.js! -->
```

**Solution:**
```html
<!-- RIGHT - include all required scripts -->
<script src="../assets/js/lucide.min.js"></script>
<script src="../assets/js/lesson-renderer.js"></script>
<script src="../assets/js/main.js"></script>
```

**How to avoid:**
- Check `index.html` and `hsc-biology/index.html` for the full script list
- Run: `node scripts/validate-pages.js` — catches missing required scripts
- When creating new HTML pages, copy script tags from an existing working page

---

### 22. Forgetting to Bump Versions After Code Changes

**Bug:** Code changes pushed to GitHub but browser still shows old behaviour. Console shows old version number (e.g. `?v=1770751117`) instead of new one.

**Cause:**
```bash
# WRONG - commit JS changes without bumping versions
git add assets/js/lesson-renderer.js
git commit -m "fix renderer"
git push
# Browser STILL serves cached old file because ?v= hasn't changed!
```

**Solution:**
```bash
# RIGHT - bump versions AFTER code changes, BEFORE commit
node scripts/bump-versions.js   # Updates all ?v= params
git add -A                       # Stage BOTH code AND version bumps
git commit -m "fix renderer"
git push
```

**How to avoid:**
- **ALWAYS** run `node scripts/bump-versions.js` after changing ANY CSS or JS file
- Commit the version bumps together with the code change
- Verify the new version number appears in the HTML files before pushing
- If user reports "fix didn't work", first check if versions were bumped

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
- [ ] If editing renderer: test with BOTH V1 and V2 lesson formats
- [ ] If editing V2 answers: handle array, object, AND missing formats

Before committing:
- [ ] Run `node scripts/run-all-checks.js`
- [ ] Fix all errors (don't skip!)
- [ ] Run `node scripts/bump-versions.js` (if CSS/JS changed)
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
