# Common Mistakes & Solutions

**Last Updated:** 2026-02-12 (v5 — added V2 hero fields, deprecated pairs/mcq/saq, copyToBook format #29-32)
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

## CRITICAL: QUALITY OVER SPEED PRINCIPLE

### The #1 Mistake: Rushing to Complete Multiple Lessons

**Bug:** Lessons are "functional" but don't match the design spec. Activities are broken or missing. Content is sparse. Layout doesn't match templates.

**Root Cause:** Trying to enhance all 25 lessons quickly instead of making ONE lesson perfect first.

**The Pattern That Fails:**
```
❌ LESSON 1 ( rushed ) → LESSON 2 ( rushed ) → LESSON 3 ( rushed )
   Activities broken      Diagrams missing      Content sparse
   Styling off            No answer keys        Tables ugly
```

**The Pattern That Works:**
```
✅ LESSON 1 ( perfect ) → Copy as template → LESSON 2 ( perfect ) → etc.
   All activities work      Reuse patterns      All activities work
   Matches design spec      Refine process      Matches design spec
   Comprehensive          Document lessons    Comprehensive
```

**Solution:**
1. Pick ONE lesson (Lesson 1)
2. Make it MATCH THE TEMPLATE exactly (pixel-perfect, fully interactive)
3. Get Kyle sign-off: "This is the quality bar"
4. Document the exact structure, CSS classes, activity patterns
5. THEN replicate for other lessons

**How to avoid:**
- **NEVER** start Lesson 2 until Lesson 1 is approved as "the gold standard"
- **ALWAYS** compare side-by-side with the HTML template
- **TEST every activity** before declaring a lesson "done"
- **ACCEPT** that using more HTML (even if tedious) produces better results

---

## V2.0 LESSON QUALITY GAPS (Feb 2026)

### 23. Activities Render as Stubs Instead of Interactive Components

**Bug:** Activities show title and description but the interactive elements (drag-drop, labels, matching) don't work. Just shows "Write your answer here..." placeholder.

**Cause:**
```javascript
// WRONG - Generic activity renderer
renderV2Activity(activity) {
  return `
    <div class="activity">
      <h3>${activity.title}</h3>
      <p>${activity.description}</p>
      <div class="answer-area">Write your answer here...</div>
    </div>
  `;
}
```

**Solution:**
```javascript
// RIGHT - Type-specific rendering
renderV2Activity(activity) {
  switch(activity.type) {
    case 'labeling':
      return this.renderLabelingActivity(activity);
    case 'matching':
      return this.renderMatchingActivity(activity);
    case 'classification':
      return this.renderClassificationActivity(activity);
    // ... etc
  }
}
```

**How to avoid:**
- Always check the activity `type` field
- Route to the specific renderer for that type
- Test EVERY activity type in the lesson
- Look at the old V1 renderer for reference implementations

---

### 24. Drag-and-Drop Missing Event Handlers

**Bug:** Classification items have `draggable="true"` but dragging does nothing. Items don't move between zones.

**Cause:**
```javascript
// WRONG - Only render HTML, no event binding
renderClassificationActivity(activity) {
  return `<div draggable="true">...</div>`;
}
// ... missing bindActivityHandlers code
```

**Solution:**
```javascript
// RIGHT - Bind drag events in bindActivityHandlers
bindActivityHandlers() {
  // Drag start
  document.querySelectorAll('.classification-item[draggable="true"]').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.dataset.itemId);
    });
  });
  
  // Drop zones
  document.querySelectorAll('.classification-zone').forEach(zone => {
    zone.addEventListener('dragover', (e) => e.preventDefault());
    zone.addEventListener('drop', (e) => {
      const itemId = e.dataTransfer.getData('text/plain');
      const item = document.querySelector(`[data-item-id="${itemId}"]`);
      zone.querySelector('.classification-items').appendChild(item);
    });
  });
}
```

**How to avoid:**
- When adding `draggable="true"`, ALWAYS add the 4 drag events (dragstart, dragover, dragleave, drop)
- Test drag-and-drop immediately after implementing
- Add touch event handlers for mobile support

---

### 25. Not Enough Assessment Questions

**Bug:** Lessons only have 2-3 MCQ and 1-2 SAQ when the standard requires 5 MCQ and 3 SAQ.

**Cause:** Creating minimum content to "check the box" instead of comprehensive assessment.

**Solution:**
```json
// RIGHT - Full assessment
"assessment": {
  "multipleChoice": [
    { "id": "mcq-1", ... },  // Question 1
    { "id": "mcq-2", ... },  // Question 2
    { "id": "mcq-3", ... },  // Question 3
    { "id": "mcq-4", ... },  // Question 4
    { "id": "mcq-5", ... }   // Question 5 (don't stop at 3!)
  ],
  "shortAnswer": [
    { "id": "sa-1", ... },   // Question 1
    { "id": "sa-2", ... },   // Question 2
    { "id": "sa-3", ... }    // Question 3 (don't stop at 2!)
  ]
}
```

**How to avoid:**
- Count questions BEFORE declaring lesson complete
- Target: 5 MCQ, 3 SAQ minimum
- Each question should test different understanding level
- Include answer keys for ALL questions

---

### 26. V2 CSS Not Loading / Styling Looks "Old"

**Bug:** Lesson renders with wrong styling. Buttons look plain. Boxes don't have gradients. Looks like V1 styling.

**Cause:**
```javascript
// WRONG - Not loading V2 CSS
renderV2Content(lesson) {
  // Just renders HTML, no CSS loaded
}
```

**Solution:**
```javascript
// RIGHT - Dynamically load V2 CSS
loadV2Styles() {
  if (document.getElementById('lesson-v2-styles')) return;
  
  const link = document.createElement('link');
  link.id = 'lesson-v2-styles';
  link.rel = 'stylesheet';
  link.href = '../assets/css/lesson-v2.css';
  document.head.appendChild(link);
}
```

**How to avoid:**
- Always call `loadV2Styles()` when rendering V2 content
- Check that CSS file exists at the path
- Verify styles are applied in browser DevTools
- Compare rendered output side-by-side with template

---

## ORIGINAL MISTAKES (Pre-V2.0)

### 1. Wrong Icon Names (Lucide)

**Bug:** Console error: `Error: Icon 'protein' not found` or `Icon 'cell' not found`

**Cause:**
```json
// WRONG - Using icon names that don't exist in Lucide
"icon": "protein"
"icon": "cell"
"icon": "bacteria"
```

**Solution:**
```json
// RIGHT - Use valid Lucide icon names only
"icon": "activity"      // For proteins/enzymes
"icon": "microscope"    // For cells
"icon": "bug"           // For bacteria
```

**How to avoid:**
- Check `docs/VALID_ICONS.md` for allowed icon names
- If icon doesn't exist, use a metaphor (e.g., "activity" for protein, "bug" for bacteria)
- Run validation: `node scripts/validate-lessons.js` catches icon errors
- Full Lucide list: https://lucide.dev/icons/

---

### 2. Using American English Spelling

**Bug:** Validation fails with: `Found "color" — should be "colour"`

**Cause:**
```json
// WRONG - American spellings
"color": "#ff0000"
"specialized": true
"behavior": "adaptive"
```

**Solution:**
```json
// RIGHT - Australian/British spellings
"colour": "#ff0000"
"specialised": true
"behaviour": "adaptive"
```

**How to avoid:**
- Run `node scripts/validate-spelling.js` before committing
- Common swaps: color→colour, center→centre, fiber→fibre, hemoglobin→haemoglobin
- Set spell checker to Australian English if using VS Code

---

### 3. Absolute Paths Break GitHub Pages

**Bug:** Images don't load on GitHub Pages. Console shows 404 errors for `/assets/...`

**Cause:**
```html
<!-- WRONG - Absolute path (breaks on GitHub Pages) -->
<img src="/assets/images/diagram.webp">
<link rel="stylesheet" href="/assets/css/style.css">
```

**Solution:**
```html
<!-- RIGHT - Relative path (works everywhere) -->
<img src="../assets/images/diagram.webp">
<link rel="stylesheet" href="../assets/css/style.css">
```

**How to avoid:**
- **NEVER** use paths starting with `/`
- Always use `../` or `./` relative paths
- Validator catches this: `node scripts/validate-pages.js`
- Test on GitHub Pages URL, not just locally

---

### 4. Unsupported Activity Types

**Bug:** Console error: `Unknown activity type: comparison-table` or activities don't render

**Cause:**
```json
// WRONG - Activity types the renderer doesn't support
"type": "comparison-table"
"type": "interactive-slider"
"type": "tonicity-simulator"
"type": "problemSolving"
```

**Solution:**
```json
// RIGHT - Only use supported activity types
"type": "labeling"         // ✓ Supported
"type": "matching"         // ✓ Supported
"type": "ordering"         // ✓ Supported
"type": "classification"   // ✓ Supported
"type": "multiple-choice"  // ✓ Supported (in assessment)
"type": "short-answer"     // ✓ Supported (in assessment)
"type": "fillBlank"        // ✓ Supported
"type": "calculation"      // ✓ Supported
```

**How to avoid:**
- Check `docs/SUPPORTED_ACTIVITIES.md` for current list
- Run validation: `node scripts/validate-lessons.js` catches unsupported types
- If you need a new type, build the renderer FIRST, then use it

---

### 5. Incorrect MCQ Answer Format

**Bug:** MCQ validation fails: `correctAnswer "Is not surrounded by a membrane" is not in options list`

**Cause:**
```json
// WRONG - correctAnswer doesn't match option format
"options": [
  "Is not surrounded by a membrane",  // Text only
  "Contains RNA instead of DNA"
],
"correctAnswer": "B"  // Using letter when options are text
```

**Solution:**
```json
// RIGHT - correctAnswer must match option format
"options": [
  "Is not surrounded by a membrane",
  "Contains RNA instead of DNA"
],
"correctAnswer": "Is not surrounded by a membrane"  // Match the text
```

**How to avoid:**
- If options are strings, correctAnswer must be the string
- If options are objects with {value, text}, correctAnswer must match value
- Validator catches mismatches

---

### 6. Missing Required JSON Fields

**Bug:** Validation error: `Schema: Missing required field: learningIntentions`

**Cause:** V2 lessons use `intentions` object but still need V1 fields for backward compatibility.

**Solution:**
```json
// RIGHT - Include BOTH V1 and V2 fields
{
  "learningIntentions": [...],  // V1 field
  "successCriteria": [...],     // V1 field
  "intentions": {               // V2 field
    "learning": [...],
    "connections": [...],
    "success": [...]
  }
}
```

**How to avoid:**
- Check schema requirements in validation output
- Keep V1 fields for backward compatibility until full migration
- Test lesson renders in BOTH old and new renderer

---

### 7. Broken Navigation Chains

**Bug:** "Next Lesson" button goes to 404 page. Previous button missing on Lesson 2.

**Cause:**
```json
// WRONG - Points to non-existent lesson
"navigation": {
  "next": "module-1-cells-lesson-99"  // This lesson doesn't exist!
}
```

**Solution:**
```json
// RIGHT - Only link to lessons that exist
"navigation": {
  "previous": "module-1-cells-lesson-1",  // Real lesson
  "next": "module-1-cells-lesson-3"       // Real lesson
}
// OR null for first/last lesson:
"navigation": {
  "previous": null,  // First lesson
  "next": "module-1-cells-lesson-2"
}
```

**How to avoid:**
- Always verify the lesson ID exists in `data/lessons/`
- Check navigation on first and last lessons in a module
- Run validation: catches broken navigation chains

---

### 8. Activities Missing XP Rewards

**Bug:** Activities don't award XP when completed. Gamification breaks.

**Cause:**
```json
// WRONG - No xpReward field
{
  "id": "activity-1",
  "type": "matching",
  "title": "Match the terms"
  // Missing xpReward!
}
```

**Solution:**
```json
// RIGHT - Include xpReward
{
  "id": "activity-1",
  "type": "matching",
  "title": "Match the terms",
  "xpReward": 50
}
```

**How to avoid:**
- Every activity should have `xpReward` (typically 25-100)
- Assessment questions don't need XP (they're separate)
- Run validation: warns about missing XP

---

### 9. Forgetting to Update Tracker Files

**Bug:** `docs/trackers/MODULE-1-LESSONS.md` shows lesson as "JSON" stage but it's actually "LIVE".

**Cause:** Focusing only on code, forgetting documentation.

**Solution:** Update tracker immediately when lesson stage changes:
```markdown
| 5 | module-1-cells-lesson-5 | Passive Transport | data/ | `LIVE` | Labeling, Classification | Deployed |
```

**How to avoid:**
- After completing work: update tracker BEFORE committing
- Include in commit: "Updated MODULE-1-LESSONS.md"
- STATUS.md handoff protocol requires tracker updates

---

### 10. Not Bumping Versions After CSS/JS Changes

**Bug:** User reports "changes not showing" even after deployment. Browser cached old files.

**Cause:** CSS/JS files have same `?v=` parameter, browser uses cache.

**Solution:**
```bash
# After any CSS/JS change:
node scripts/bump-versions.js  # Updates ?v= timestamp
git add -A
git commit -m "fix: updated styles"
```

**How to avoid:**
- ALWAYS run `bump-versions.js` after editing CSS/JS
- Check that HTML files have new version numbers
- Tell users to hard refresh (Ctrl+Shift+R)

---

### 11. Missing Answer Keys

**Bug:** Assessment section shows questions but no answers. Students can't check work.

**Cause:**
```json
// WRONG - No answerKey or answers section
{
  "assessment": { "multipleChoice": [...], "shortAnswer": [...] }
  // Missing answers!
}
```

**Solution:**
```json
// RIGHT - Include comprehensive answers
{
  "assessment": { "multipleChoice": [...], "shortAnswer": [...] },
  "answers": {
    "activities": [...],
    "assessment": [
      { "questionId": "mcq-1", "correctAnswer": "B", "explanation": "..." },
      { "questionId": "sa-1", "correctAnswer": "...", "markingCriteria": [...] }
    ]
  }
}
```

**How to avoid:**
- Every question MUST have an answer
- Include explanations, not just correct choices
- Add marking criteria for SAQ questions

---

### 12. Using Placeholder Content

**Bug:** Lesson has "Lorem ipsum" or "TODO: add content here" in production.

**Cause:** Rushing to complete lessons without real content.

**Solution:** Write actual educational content:
```json
// WRONG
"content": "TODO: explain cell structure here"

// RIGHT
"content": "Prokaryotic cells lack a membrane-bound nucleus. Instead, their DNA is concentrated in a region called the nucleoid..."
```

**How to avoid:**
- Never commit placeholder text
- If content isn't ready, don't mark lesson as complete
- Use syllabus dot points as content guide

---

### 13. Images Missing or Wrong Paths

**Bug:** Broken image icons in lesson. Console shows 404 for `.webp` files.

**Cause:**
```json
// WRONG - Image doesn't exist or wrong path
"image": "assets/images/mod1/nonexistent.webp"
```

**Solution:**
```json
// RIGHT - Verify image exists
"image": "assets/images/mod1/lesson01/prokaryote-diagram.webp"
// Check: Does this file actually exist in the repo?
```

**How to avoid:**
- Only reference images that exist in `assets/images/`
- Use WebP format (<100KB per image)
- Include alt text for accessibility
- Have fallback if image is missing

---

### 14. Not Testing Activities Actually Work

**Bug:** Activity renders but clicking "Check Answers" does nothing. Or feedback is wrong.

**Cause:** Only checking that activity appears, not that it functions.

**Solution:** Test every activity:
1. Render the lesson
2. Complete the activity (enter answers)
3. Click "Check Answers"
4. Verify feedback is correct
5. Check XP is awarded

**How to avoid:**
- Manual test every activity type in the lesson
- Try wrong answers to verify feedback
- Check console for JS errors
- Test on mobile (touch) AND desktop (mouse)

---

### 15. Confusing Lesson IDs

**Bug:** Multiple lessons with similar IDs: `mod1-lesson01`, `module-1-cells-lesson-1`, `lesson-1`

**Cause:** Inconsistent naming convention across files.

**Solution:** Use consistent format:
```
module-[number]-[topic]-lesson-[number]
Examples:
- module-1-cells-lesson-1
- module-1-cells-lesson-2
- module-5-heredity-lesson-1
```

**How to avoid:**
- Check existing lessons for the pattern
- Use hyphens, not underscores
- Include full module name, not just "mod1"
- Always 2-digit lesson numbers (01, 02, etc.)

---

### 16. Duplicating Content Between V1 and V2 Fields

**Bug:** Same content in `contentSections` (V1) and `contentHTML` (V2), making files huge.

**Cause:** Not understanding the migration strategy.

**Solution:**
```json
// During transition: Keep V1 minimal, V2 comprehensive
{
  "contentSections": [
    { "type": "content", "title": "Summary", "content": "See detailed content below" }
  ],
  "contentHTML": "<div class='card'>...</div>"  // Full V2 content
}
```

**How to avoid:**
- V1 contentSections can be minimal/summary
- V2 contentHTML should be comprehensive
- Eventually remove V1 fields when fully migrated

---

### 17. Forgetting to Run All Checks Before Committing

**Bug:** Committed code with validation errors. Broke the build.

**Cause:**
```bash
# WRONG - Committing without validation
git add .
git commit -m "new lesson"
git push
# Oops! Validation would have caught errors
```

**Solution:**
```bash
# RIGHT - Validate first
node scripts/run-all-checks.js  # MUST PASS
git add -A
git commit -m "new lesson"
git push
```

**How to avoid:**
- **MANDATORY:** Run `run-all-checks.js` before EVERY commit
- Fix ALL errors (don't ignore warnings)
- If checks fail, fix before committing

---

### 18. Not Using Error Tracker

**Bug:** Production errors go unnoticed. Users report "lesson broken" but no details.

**Cause:** Not checking error logs or not having tracking enabled.

**Solution:** Use the error tracker:
```javascript
// In code:
ErrorTracker.log('Activity failed', { activityId: 'xyz', error: e.message });

// To check errors:
node scripts/read-errors.js
```

**How to avoid:**
- Wrap risky code in try-catch
- Log errors with context
- Check error logs regularly

---

### 19. V2 Lesson Crashes Renderer — Missing Format Detection

**Bug:** Lesson with `v2: true` crashes with `Cannot read properties of undefined (reading 'title')` at `renderEngagementHook`.

**Cause:** Renderer tries to access V1 fields (`engagementHook`) on V2 lesson before detecting it's V2 format.

**Solution:**
```javascript
// Add guard in renderEngagementHook
renderEngagementHook(hook) {
  if (!hook || typeof hook !== 'object') return '';  // Guard clause
  return `...`;
}

// And ensure V2 detection happens early
isV2Format(lesson) {
  return lesson.hero && lesson.intentions && (lesson.contentHTML || lesson.v2 === true);
}
```

**How to avoid:**
- Add null checks in all render methods
- Detect V2 format BEFORE accessing any fields
- Test V2 lesson immediately after creating

---

### 20. V2 Answer Formats Are Not Always Arrays

**Bug:** Answer key crashes when trying to `.map()` over answers that are objects or strings.

**Cause:** Assuming all answers are arrays:
```javascript
// WRONG
answers.activities.map(...)  // Crashes if activities is undefined
```

**Solution:**
```javascript
// RIGHT - Check format before mapping
const activities = answers.activities || [];
if (Array.isArray(activities)) {
  activities.map(...)
}
```

**How to avoid:**
- Always check if field exists before accessing
- Handle multiple formats (array, object, string)
- Use defensive coding: `field || []`, `field || {}`

---

### 21. Missing Script References in lesson.html

**Bug:** Activities don't work because `TouchUtils` or other libraries not loaded.

**Cause:** lesson.html missing script tags that exist in other pages.

**Solution:** Copy working structure:
```html
<!-- Check a working lesson page -->
<script src="../assets/js/touch-utils.js"></script>
<script src="../assets/js/error-tracker.js"></script>
<script src="../assets/js/lesson-renderer.js"></script>
```

**How to avoid:**
- When creating new HTML pages, copy script tags from an existing working page
- Check browser console for "X is not defined" errors

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
- [ ] **QUALITY OVER SPEED:** Make one lesson perfect before moving to next
- [ ] **TEST EVERY ACTIVITY:** Don't assume it works—verify it
- [ ] **COMPARE TO TEMPLATE:** Side-by-side with HTML example

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

### 22. Activities Not Working - Missing touch-utils.js

**Bug:** Activities don't respond to clicks, drag-and-drop doesn't work, Check Answer buttons do nothing.

**Cause:** `lesson.html` is missing the `touch-utils.js` script that provides `TouchUtils.bindTap()` for activity handlers.

**Error in console:**
```
TypeError: Cannot read properties of undefined (reading 'bindTap')
```

**Solution:** Add touch-utils.js BEFORE lesson-renderer.js:
```html
<script src="../assets/js/touch-utils.js?v=1770755753"></script>
<script src="../assets/js/lesson-renderer.js?v=1770755753"></script>
```

**Location:** `hsc-biology/lesson.html`

---

### 23. Check Answer Buttons Look Bad

**Bug:** Activity "Check Answer" buttons have poor styling - wrong colors, no hover effects, misaligned text.

**Cause:** V2 lessons use button classes (`.btn`, `.btn-primary`) that aren't styled in `lesson-v2.css`.

**Solution:** Add button styles to `assets/css/lesson-v2.css`:
```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--gradient-1);
  color: white;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
```

---

### 24. renderFillBlankActivity Crashes

**Bug:** Lesson fails to load with error: `Cannot read properties of undefined (reading 'map')`

**Cause:** `renderFillBlankActivity` expects `activity.items` array but some activities don't have items.

**Solution:** Add null check at start of method:
```javascript
renderFillBlankActivity(activity, theme) {
  const items = activity.items || [];
  
  if (items.length === 0) {
    // Return generic activity fallback
    return renderGenericActivity(activity, theme);
  }
  // ... rest of method
}
```


---

### 25. V2 Lesson Field Name Inconsistencies

**Bug:** Activities don't render, assessment shows "undefined", matching/classification broken despite valid JSON.

**Cause:** V2 lessons evolved with two different field name conventions. Renderer supports both via fallbacks, but new lessons should use standardized names.

**Wrong field names (deprecated):**
```json
{
  "activities": [
    {
      "type": "matching",
      "pairs": [                    // ❌ WRONG - Use "items"
        {
          "left": "Term",           // ❌ WRONG - Use "text"
          "right": "Definition"     // ❌ WRONG - Use "match"
        }
      ]
    },
    {
      "type": "classification",
      "categories": [
        { "name": "Cat 1" }         // ❌ WRONG - Use "label"
      ],
      "items": [
        { "correctCategory": "cat1" } // ❌ WRONG - Use "category"
      ]
    },
    {
      "type": "ordering",
      "items": [
        { "correctOrder": 1 }       // ❌ WRONG - Use "order" or "position"
      ]
    }
  ],
  "assessment": {
    "mcq": [                        // ❌ WRONG - Use "multipleChoice"
      {
        "correct": 1,               // ❌ WRONG - Use "correctAnswer" with text
        "explanation": "..."        // ❌ WRONG - Use "rationale"
      }
    ],
    "saq": [...]                    // ❌ WRONG - Use "shortAnswer"
  },
  "copyToBook": {
    "sections": [
      { "content": [...] }          // ❌ WRONG - Use "items"
    ]
  }
}
```

**Correct field names (standardized):**
```json
{
  "activities": [
    {
      "type": "matching",
      "items": [                    // ✅ RIGHT
        {
          "text": "Term",           // ✅ RIGHT
          "match": "Definition"     // ✅ RIGHT
        }
      ]
    },
    {
      "type": "classification",
      "categories": [
        { "label": "Cat 1" }        // ✅ RIGHT
      ],
      "items": [
        { "category": "cat1" }      // ✅ RIGHT
      ]
    },
    {
      "type": "ordering",
      "items": [
        { "order": 1 }              // ✅ RIGHT (or "position")
      ]
    }
  ],
  "assessment": {
    "multipleChoice": [             // ✅ RIGHT
      {
        "correctAnswer": "Option B", // ✅ RIGHT (text-based)
        "rationale": "..."          // ✅ RIGHT
      }
    ],
    "shortAnswer": [...]            // ✅ RIGHT
  },
  "copyToBook": {
    "sections": [
      { "items": [...] }            // ✅ RIGHT
    ]
  }
}
```

**How to avoid:**
1. **Use the template:** Copy `data/lessons/TEMPLATE-V2.json` when creating new lessons
2. **Read the standards:** `docs/V2-LESSON-STANDARDS.md` defines all correct field names
3. **Run validation:** `node scripts/validate-lessons.js` warns about deprecated field names
4. **Check PASS status:** Lesson 2 uses correct names → no warnings. Use it as reference.

**Example validation output:**
```
PASS  data/lessons/module-1-cells-lesson-2.json  ← Correct field names
WARN  data/lessons/module-1-cells-lesson-1.json  ← Deprecated field names
  WARN: Activity "tenet-matching": Uses deprecated "pairs" field
  WARN: Assessment: Uses deprecated "mcq" field
```

**Why it matters:**
- Renderer has fallback logic (`items || pairs`, `label || name`) so both work
- But consistency makes code maintainable and prevents confusion
- Future versions may remove fallback support
- Validation catches mistakes before they reach production

**Status:** All 7 existing lessons work (renderer supports both formats). New lessons should use standardized names.

---

### 26. Manual Cache Busting Instead of Using Automation

**Bug:** Manually updating `?v=TIMESTAMP` across 20+ HTML files, wasting time and risking typos.

**Cause:** Not using the existing `bump-versions.js` script that automates this.

**Wrong approach:**
```bash
# ❌ WRONG - Manual find/replace across files
# Editing 22 files one by one
# Prone to missing files or typos
```

**Correct approach:**
```bash
# ✅ RIGHT - Use the automation script
node scripts/bump-versions.js

# Output:
#   UPDATED  index.html (9 references)
#   UPDATED  hsc-biology/lesson.html (12 references)
#   ...
#   Version: v=1770791403
#   Files modified: 22
#   References: 167
```

**How to avoid:**
1. **ALWAYS run** `node scripts/bump-versions.js` after changing CSS/JS files
2. Commit the HTML changes along with the CSS/JS changes
3. AI-START-HERE.md mentions this but it's easy to miss — now it's in COMMON-MISTAKES

**When to run:**
- After editing any `.css` file
- After editing any `.js` file  
- Before committing
- Part of pre-commit checklist

**Why it matters:**
- Browser caching means users won't see your changes without cache busting
- Manual updates are error-prone and time-consuming
- Automated approach is faster and catches all files

---

### 27. Reactive Bug Fixing Without Proactive Testing

**Bug:** User reports issues one at a time. Multiple back-and-forth cycles to fix bugs that could have been caught earlier.

**Cause:** No proactive browser testing before committing. Only testing with validators/scripts, not actual browser rendering.

**Wrong approach:**
```
1. Make changes to CSS/renderer
2. Run validators (they pass)
3. Commit and push
4. User reports: "Activities don't render"
5. Fix issue #1, commit, push
6. User reports: "Assessment shows undefined"
7. Fix issue #2, commit, push
8. User reports: "Matching broken"
9. Fix issue #3, commit, push
```

**Correct approach:**
```
1. Make changes to CSS/renderer
2. Run validators
3. OPEN PAGES IN BROWSER ← This step was missing
   - Load home page → Check console for errors
   - Load module index → Verify lesson cards
   - Load 2-3 lessons → Test activities work
   - Check responsive (mobile/tablet/desktop)
4. Fix any issues found
5. Commit once with all fixes together
```

**How to avoid:**
1. **Browser Testing Checklist** (add to QUALITY-GATES.md):
   - [ ] Open index.html — home page renders correctly
   - [ ] Open module index — lesson cards show correct data
   - [ ] Open 2-3 lessons — activities render and function
   - [ ] Check console — no errors
   - [ ] Check mobile view — responsive layout works
2. **Test before commit**, not after user reports
3. **Group related fixes** — don't commit piecemeal

**Why it matters:**
- Validators check structure, not visual rendering
- Console errors only show in browser
- User frustration from broken features
- Multiple commits for related issues pollute git history

---

### 28. Fixing Systemic Issues One File at a Time

**Bug:** Fix field name mismatch in lesson 1, discover lessons 3-7 have the same issue, fix them later one by one.

**Cause:** Not checking scope of systemic issues before fixing.

**Wrong approach:**
```
1. Find field name bug in lesson 1
2. Fix lesson 1
3. Commit fix for lesson 1
4. Later discover lesson 3 has same bug
5. Fix lesson 3
6. Later discover lessons 4-7 have same bug
7. Fix them one by one...
```

**Correct approach:**
```
1. Find field name bug in lesson 1
2. STOP — Don't fix yet
3. Check scope: grep/search all lessons for same pattern
4. Find: Lessons 1, 3-7 all have the issue
5. Understand the pattern
6. Fix renderer to handle all variations
7. Test all affected lessons
8. Commit once with complete fix
```

**How to avoid:**
1. **When you find a pattern bug:**
   - Pause before fixing
   - Search ALL files for the same pattern
   - Document the scope
   - Fix systematically, not incrementally

2. **Commands to check scope:**
   ```bash
   # Find all matching activities
   grep -r '"type": "matching"' data/lessons/
   
   # Find all using "pairs" field
   grep -r '"pairs":' data/lessons/
   
   # Check all assessment formats
   grep -r '"mcq":' data/lessons/
   ```

3. **Fix pattern:**
   - Identify all affected files
   - Fix root cause (renderer logic)
   - Test all affected cases
   - Commit atomic fix

**Why it matters:**
- Multiple commits for same issue → messy git history
- Risk missing files → incomplete fix
- Wastes time discovering same bug repeatedly
- Better to solve systemically than incrementally

**Example from this session:**
- Found field name mismatches: `pairs` vs `items`, `mcq` vs `multipleChoice`, etc.
- Instead of fixing lessons 1-7 individually, we:
  1. Audited all 7 lessons systematically
  2. Updated renderer to handle both formats
  3. Created validation to prevent future issues
  4. One comprehensive fix instead of 7 separate ones

---

### 29. V2 Lessons Missing Required Hero Fields

**Bug:** Validation warnings "hero missing moduleBadge" and "hero missing duration"

**Cause:**
```json
// WRONG - Incomplete hero object
{
  "hero": {
    "subjectBadge": "HSC Biology",
    "levelBadge": "Foundational",
    "icon": "🔬",
    "gradient": "blue-to-purple"
  }
}
```

**Solution:**
```json
// RIGHT - Complete hero object with all required fields
{
  "hero": {
    "subjectBadge": "HSC Biology",
    "moduleBadge": "Module 1: Cells",
    "levelBadge": "Foundational",
    "icon": "🔬",
    "duration": "60 minutes",
    "gradient": "blue-to-purple"
  }
}
```

**How to avoid:**
1. Use template: `data/lessons/TEMPLATE-V2.json` (has all required fields)
2. Run validation: `node scripts/validate-lessons.js` (now blocks with ERRORS, not warnings)
3. Check V2 standards: `docs/V2-LESSON-STANDARDS.md`

**Why it matters:**
- Hero section displays badge info to students
- moduleBadge shows which module (e.g., "Module 1: Cells")
- duration shows time estimate for lesson planning

**Fixed in:** Lessons 1-5 (2026-02-11)

---

### 30. Using Deprecated "pairs" Field in Matching Activities

**Bug:** Validation errors: Activity uses deprecated "pairs" field

**Cause:**
```json
// WRONG - Old V1 format with pairs/left/right
{
  "type": "matching",
  "pairs": [
    {
      "id": "pair1",
      "left": "Mitochondria",
      "right": "Produces ATP"
    }
  ]
}
```

**Solution:**
```json
// RIGHT - V2 format with items/text/match
{
  "type": "matching",
  "items": [
    {
      "id": "item1",
      "text": "Mitochondria",
      "match": "Produces ATP"
    }
  ]
}
```

**How to avoid:**
1. Use template: `data/lessons/TEMPLATE-V2.json`
2. Read standards: `docs/V2-LESSON-STANDARDS.md`
3. Run validation: `node scripts/validate-lessons.js` (now blocks with ERROR)

**Automated conversion:**
```python
# Convert pairs to items
for activity in lesson['activities']:
    if 'pairs' in activity:
        activity['items'] = [
            {'id': p['id'], 'text': p['left'], 'match': p['right']}
            for p in activity['pairs']
        ]
        del activity['pairs']
```

**Why it matters:**
- Renderer supports both but V2 standard is items/text/match
- Consistency across all lessons
- Validation now enforces this (ERRORS, not warnings)

**Fixed in:** Lessons 1, 3, 4, 5 (2026-02-11)

---

### 31. Using Deprecated "mcq"/"saq" Fields in Assessment

**Bug:** Validation errors: Assessment uses deprecated "mcq" field

**Cause:**
```json
// WRONG - Old V1 format
{
  "assessment": {
    "mcq": [...],
    "saq": [...]
  }
}
```

**Solution:**
```json
// RIGHT - V2 format
{
  "assessment": {
    "multipleChoice": [...],
    "shortAnswer": [...]
  }
}
```

**How to avoid:**
1. Use template: `data/lessons/TEMPLATE-V2.json`
2. Read standards: `docs/V2-LESSON-STANDARDS.md`
3. Run validation: `node scripts/validate-lessons.js` (now blocks with ERROR)

**Automated conversion:**
```python
# Convert mcq/saq to multipleChoice/shortAnswer
if 'mcq' in lesson['assessment']:
    lesson['assessment']['multipleChoice'] = lesson['assessment'].pop('mcq')
if 'saq' in lesson['assessment']:
    lesson['assessment']['shortAnswer'] = lesson['assessment'].pop('saq')
```

**Why it matters:**
- Field names must match V2 standards
- multipleChoice and shortAnswer are more descriptive than abbreviations
- Consistency across all V2 lessons
- Validation now enforces this (ERRORS, not warnings)

**Fixed in:** Lesson 1 (2026-02-11)

---

### 32. V2 Lessons Using V1 copyToBook Format

**Bug:** Validation errors: copyToBook missing "sections" array

**Cause:**
```json
// WRONG - V1 format with definitions/keyPoints/diagrams
{
  "copyToBook": {
    "definitions": [...],
    "keyPoints": [...],
    "diagrams": [...]
  }
}
```

**Solution:**
```json
// RIGHT - V2 format with sections array
{
  "copyToBook": {
    "sections": [
      {
        "title": "Key Definitions",
        "items": [...]
      },
      {
        "title": "Key Points",
        "items": [...]
      }
    ]
  }
}
```

**How to avoid:**
1. Use template: `data/lessons/TEMPLATE-V2.json`
2. Read standards: `docs/V2-LESSON-STANDARDS.md`
3. Run validation: `node scripts/validate-lessons.js` (now blocks with ERROR)

**Why it matters:**
- V2 uses structured sections for better organisation
- Renderer expects sections array
- Allows multiple categorised copy-to-book sections
- Validation now enforces this (ERROR for missing sections)

**Fixed in:** Lesson 2 (2026-02-11)

---
