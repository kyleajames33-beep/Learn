# Closed-Loop System Audit
**Date:** 2026-02-11
**Purpose:** Identify high-impact improvements for quality, consistency, and organic self-improvement

---

## Executive Summary

The closed-loop system is **fundamentally sound** with strong validation infrastructure, documentation, and workflow processes. This audit identifies **8 high-impact improvements** to enhance:

1. **Quality** - Better activities, richer content, fewer mistakes
2. **Consistency** - Uniform design across all V2 lessons
3. **Self-Improvement** - System learns from errors organically

**Current Strengths:**
- ✅ 6 validation scripts with unified runner
- ✅ Comprehensive documentation (28 mistakes documented)
- ✅ Template + standards for V2 lessons
- ✅ Error tracking client-side
- ✅ Quality scoring with rubric
- ✅ Browser testing checklist

**Identified Gaps:**
- ❌ CSS validation not integrated into run-all-checks.js
- ❌ No V2 structure validation (hero, intentions, contentHTML format)
- ❌ No activity quality standards documentation
- ❌ No error feedback loop (errors logged but not reviewed)
- ❌ No validation metrics tracking
- ❌ No design consistency enforcement for V2 lessons

---

## CATEGORY 1: QUICK WINS (Implement Immediately)

### 1.1 Integrate CSS Validation into Master Runner

**Problem:** `validate-css.js` exists but isn't called by `run-all-checks.js`

**Impact:** HIGH - Prevents undefined CSS variable bugs
**Effort:** LOW - 5 minute fix

**Fix:**
```javascript
// In scripts/run-all-checks.js, add to CHECKS array:
{
  name: 'CSS Variable Validation',
  script: 'validate-css.js',
  description: 'Validates all CSS custom properties are defined in global.css :root'
}
```

**Deliverable:** Edit `scripts/run-all-checks.js`

---

### 1.2 Add V2 Structure Validation

**Problem:** V2 lessons can be created without hero, intentions, or contentHTML - no validation catches this

**Impact:** HIGH - Ensures consistent V2 lesson structure
**Effort:** MEDIUM - 30-60 minutes

**Required V2 Sections:**
- `v2: true` flag
- `hero` object (subjectBadge, moduleBadge, icon, duration)
- `learningIntentions` array (min 2 items)
- `contentHTML` string (min 500 characters for meaningful content)
- `copyToBook` object with sections array

**Fix:** Add to `scripts/validate-lessons.js`:

```javascript
// V2 Structure Validation
if (data.v2 === true || data.version === 2) {
  // Check hero
  if (!data.hero) {
    errors.push(`${fileName}: V2 lesson missing "hero" object`);
  } else {
    if (!data.hero.subjectBadge) errors.push(`${fileName}: hero missing subjectBadge`);
    if (!data.hero.moduleBadge) errors.push(`${fileName}: hero missing moduleBadge`);
    if (!data.hero.icon) errors.push(`${fileName}: hero missing icon`);
  }

  // Check learning intentions
  if (!data.learningIntentions || data.learningIntentions.length < 2) {
    errors.push(`${fileName}: V2 lesson must have ≥2 learningIntentions`);
  }

  // Check contentHTML
  if (!data.contentHTML) {
    errors.push(`${fileName}: V2 lesson missing "contentHTML" field`);
  } else if (data.contentHTML.length < 500) {
    warnings.push(`${fileName}: contentHTML seems short (${data.contentHTML.length} chars)`);
  }

  // Check copyToBook structure
  if (!data.copyToBook) {
    warnings.push(`${fileName}: V2 lesson missing copyToBook section`);
  } else if (!data.copyToBook.sections || data.copyToBook.sections.length === 0) {
    warnings.push(`${fileName}: copyToBook has no sections`);
  }
}
```

**Deliverable:** Edit `scripts/validate-lessons.js`

---

### 1.3 Create Activity Quality Standards Documentation

**Problem:** No guidance on what makes a "good" activity vs just any activity

**Impact:** HIGH - Improves educational value of all lessons
**Effort:** LOW - 1 hour to document existing patterns

**Create:** `docs/ACTIVITY-QUALITY-STANDARDS.md`

**Contents:**
1. **General Principles**
   - Clear, concise instructions (1-2 sentences max)
   - Meaningful feedback (not just "Correct!" but WHY it's correct)
   - Tests understanding, not just recall
   - Appropriate difficulty for level
   - Real-world context when possible

2. **Activity-Specific Standards**
   - **Matching:** 5-8 pairs (not too few/many), distinct items
   - **Classification:** 3-4 categories, 10-15 items, clear definitions
   - **Ordering:** 4-6 steps, logical sequence, explanation provided
   - **Fill-Blank:** Key terms only (not trivial words), context given
   - **Calculation:** Tolerance defined, worked example shown first

3. **Examples: Excellent vs Poor**
   - Show side-by-side comparisons
   - Explain what makes one better

4. **Feedback Quality Rubric**
   - ❌ Poor: "Correct!"
   - ⚠️ OK: "Correct! Mitochondria produce ATP."
   - ✅ Excellent: "Correct! Mitochondria are the powerhouse of the cell because they produce ATP through cellular respiration."

**Deliverable:** New file `docs/ACTIVITY-QUALITY-STANDARDS.md`

---

## CATEGORY 2: QUALITY ENHANCEMENTS (High Value)

### 2.1 Gold Standard Lesson Registry

**Problem:** No clear examples of "perfect" lessons to emulate

**Impact:** MEDIUM - Sets quality bar visually
**Effort:** LOW - Just document existing good lessons

**Create:** Section in `docs/WORKFLOW.md`

```markdown
## Gold Standard Lessons (Reference Examples)

These lessons represent the **minimum quality bar** for all V2 lessons:

### Biology V2 Examples
1. **module-1-cells-lesson-2** (Cells, Tissues, Organs)
   - ✅ Excellent: Flow diagram, rich content cards, visual hierarchy
   - ✅ Excellent: Worked examples, styled boxes, clear explanations
   - ✅ Excellent: 4 diverse activities with good feedback

### What Makes These "Gold Standard"
- Comprehensive content (not just definitions)
- Visual learning aids (diagrams, tables, boxes)
- Clear progression (simple → complex)
- Real-world examples throughout
- Complete answer keys
- Mobile-optimised design

### Anti-Patterns (Do NOT Emulate)
- Walls of text without visual breaks
- Sparse content (just definitions)
- No worked examples
- Missing answer keys
- Activities without meaningful feedback
```

**Deliverable:** Add section to `docs/WORKFLOW.md`

---

### 2.2 Design Consistency Checklist (V2 Lessons)

**Problem:** No enforcement of visual consistency across V2 lessons

**Impact:** MEDIUM - Ensures professional, cohesive look
**Effort:** LOW - Add to existing QUALITY-GATES.md

**Add to QUALITY-GATES.md:**

```markdown
### V2 Design Consistency Checklist

All V2 lessons (v2: true) must have:

**Visual Structure:**
- [ ] Hero header with badges (subject, module/level)
- [ ] Learning intentions grid (3 columns: Learning, Connections, Success)
- [ ] At least 1 flow diagram with arrows and icons
- [ ] 3-4 styled content cards using .card class
- [ ] 2-3 data tables with .table-wrap
- [ ] Copy to Books summary grid

**Styled Boxes (min 3 per lesson):**
- [ ] Formula boxes for equations
- [ ] Info boxes for key concepts
- [ ] Highlight boxes for important points
- [ ] Worked example boxes (if applicable)

**Content Quality:**
- [ ] 2-3 worked examples with step-by-step solutions
- [ ] Key terms bolded on first use
- [ ] Real-world examples (not just theory)
- [ ] Australian English throughout

**Activities:**
- [ ] All activities have answer areas with .answer-area class
- [ ] Feedback is educational (explains WHY, not just "Correct")
- [ ] Visual consistency (same button styles, colors, spacing)

**Assessment:**
- [ ] All questions have complete, detailed answers
- [ ] Model answers show full-mark responses
- [ ] Marking criteria broken down by point
```

**Deliverable:** Add to `docs/QUALITY-GATES.md`

---

## CATEGORY 3: ORGANIC SELF-IMPROVEMENT (Long-Term Value)

### 3.1 Error Feedback Loop (Weekly Retrospective)

**Problem:** Errors are logged but never reviewed - no learning happens

**Impact:** HIGH - System improves itself automatically
**Effort:** MEDIUM - Set up process, then 15 min/week

**Process:** Add to `docs/WORKFLOW.md`

```markdown
## Weekly Error Review (Every Friday)

### Process
1. Run error analysis: `node scripts/analyze-errors.js` (to be created)
2. Review top 5 most common errors
3. For each error:
   - Is it already in COMMON-MISTAKES.md? → Skip
   - Is it a new pattern? → Add to COMMON-MISTAKES.md
   - Is it a validation gap? → Add check to relevant script
   - Is it a documentation gap? → Update relevant docs

### Metrics to Track
- Error frequency by type
- Error frequency by lesson
- Validation catches (which scripts fail most often)
- Quality score trends over time

### Example Entry
```markdown
Week of 2026-02-10:
- 12 errors logged
- Top errors: "Cannot read property 'map' of undefined" (5x in lesson 3)
- Root cause: Missing null check in renderer
- Fix: Added null check, updated COMMON-MISTAKES.md #29
- Validation gap: None (smoke test would have caught with browser testing)
```

### Automation Script (To Be Created)
`scripts/analyze-errors.js` - Reads localStorage errors, groups by pattern, suggests COMMON-MISTAKES entries
```

**Deliverable:**
1. Add weekly review process to `docs/WORKFLOW.md`
2. Create `scripts/analyze-errors.js` (reads error-tracker.js logs)

---

### 3.2 Validation Metrics Dashboard

**Problem:** No visibility into which checks fail most often or quality trends

**Impact:** MEDIUM - Identifies systematic problems
**Effort:** MEDIUM - Create tracking script

**Create:** `scripts/track-validation-metrics.js`

**Functionality:**
- Runs after each `run-all-checks.js` execution
- Logs results to `docs/validation-metrics.json`
- Tracks:
  - Pass/fail rate per validation script
  - Quality score average over time
  - Most common warnings/errors
  - Lesson count passing all checks

**Output Format:**
```json
{
  "runs": [
    {
      "timestamp": "2026-02-11T10:30:00Z",
      "results": {
        "smoke-test": "pass",
        "validate-lessons": "fail",
        "validate-pages": "pass",
        "validate-spelling": "pass",
        "validate-css": "pass",
        "score-lessons": "pass"
      },
      "avgQualityScore": 87.3,
      "lessonsPassing": 6,
      "lessonsTotal": 7,
      "topWarnings": [
        "Only 2 activities (recommend 4)",
        "Only 2 SAQs (recommend 3)"
      ]
    }
  ]
}
```

**Usage:**
```bash
# Run after validation
node scripts/run-all-checks.js && node scripts/track-validation-metrics.js

# View trends
node scripts/show-validation-trends.js
```

**Deliverable:**
1. Create `scripts/track-validation-metrics.js`
2. Create `scripts/show-validation-trends.js` (displays trends)

---

### 3.3 Automated COMMON-MISTAKES.md Suggestions

**Problem:** Developers must manually recognize patterns and add to COMMON-MISTAKES

**Impact:** MEDIUM - Speeds up documentation of new bugs
**Effort:** MEDIUM - Create analysis script

**Create:** `scripts/suggest-common-mistakes.js`

**Functionality:**
- Reads `localStorage` error logs (via read-errors.js output)
- Groups errors by pattern (same message, same stack trace)
- Identifies new patterns (not in COMMON-MISTAKES.md)
- Suggests template entry for COMMON-MISTAKES.md

**Example Output:**
```
SUGGESTED COMMON MISTAKE ENTRY:

Pattern Found: "Cannot read property 'map' of undefined"
Occurred: 5 times across lessons 2, 3, 5
Not documented in COMMON-MISTAKES.md

Suggested Entry:
---
### XX. Cannot Read Property 'map' of Undefined

**Bug:** Activities section blank, console error

**Cause:**
```javascript
// WRONG - items might be undefined
data.copyToBook.sections.map(section => {
  section.items.map(item => ...)
})
```

**Solution:**
```javascript
// RIGHT - add null checks
const sections = data.copyToBook?.sections || [];
sections.map(section => {
  const items = section.items || section.content || [];
  items.map(item => ...)
})
```

**How to avoid:**
- Always use optional chaining (?.) or fallback (|| [])
- Run: node scripts/smoke-test.js
- Check: Browser console (F12) for runtime errors
---

Add to COMMON-MISTAKES.md? [Y/n]
```

**Deliverable:** Create `scripts/suggest-common-mistakes.js`

---

## CATEGORY 4: NICE-TO-HAVE (Lower Priority)

### 4.1 Activity Feedback Quality Checker

**Problem:** Activities might have generic feedback ("Correct!") instead of educational feedback

**Impact:** LOW - Nice but not critical
**Effort:** HIGH - Requires parsing all activity types

**Could add to quality scorer:**
```javascript
// Check feedback quality
const feedbackPatterns = [
  /^Correct!?$/i,  // Too generic
  /^Wrong!?$/i,
  /^Try again/i
];
let genericFeedback = 0;
for (const activity of activities) {
  if (activity.feedback && feedbackPatterns.some(p => p.test(activity.feedback))) {
    genericFeedback++;
  }
}
if (genericFeedback > 0) {
  warnings.push(`${genericFeedback} activities have generic feedback`);
}
```

**Status:** DEFER until Phase 3 content review

---

### 4.2 Visual Regression Testing

**Problem:** CSS changes might break layout unexpectedly

**Impact:** LOW - Manual browser testing catches most issues
**Effort:** HIGH - Screenshot automation, comparison logic

**Status:** NOT RECOMMENDED - Overkill for current scale

---

## IMPLEMENTATION PRIORITY

### Phase 1: Immediate (This Session)
1. ✅ Integrate CSS validation into run-all-checks.js
2. ✅ Add V2 structure validation to validate-lessons.js
3. ✅ Create ACTIVITY-QUALITY-STANDARDS.md

### Phase 2: This Week
4. Add Gold Standard lesson registry to WORKFLOW.md
5. Add V2 Design Consistency Checklist to QUALITY-GATES.md
6. Add weekly error review process to WORKFLOW.md

### Phase 3: Next Sprint
7. Create scripts/analyze-errors.js
8. Create scripts/track-validation-metrics.js
9. Create scripts/suggest-common-mistakes.js

---

## EXPECTED OUTCOMES

**After Phase 1:**
- ✅ All V2 lessons validated for structure
- ✅ CSS bugs caught automatically
- ✅ Clear standards for activity quality

**After Phase 2:**
- ✅ Consistent design across all V2 lessons
- ✅ Clear quality targets (gold standard examples)
- ✅ Regular error review cadence established

**After Phase 3:**
- ✅ System learns from errors automatically
- ✅ Validation trends visible (improving over time)
- ✅ COMMON-MISTAKES.md grows organically

**Quality Metrics (3 months):**
- Quality score average: 85+ → 92+
- Validation failures: 30% → <5%
- New bugs entering COMMON-MISTAKES.md: 2-3/week → <1/month
- V2 lessons passing all checks: 70% → 95%

---

## NOTES

**Not Recommended:**
- Visual regression testing (overkill for scale)
- AI-powered content quality analysis (too complex)
- Multi-browser testing (GitHub Pages is reliable)
- Automated accessibility testing beyond Lighthouse (diminishing returns)

**User Feedback Integration:**
- Consider adding user feedback form to each lesson
- Track which lessons get the most "this was helpful" ratings
- Use data to identify lessons that need improvement

**Documentation Maintenance:**
- Review COMMON-MISTAKES.md quarterly, remove obsolete entries
- Update gold standard examples as better lessons are created
- Archive old validation metrics (keep 6 months max)

---

**End of Audit Report**
