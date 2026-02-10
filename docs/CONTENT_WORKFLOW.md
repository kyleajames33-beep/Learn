# Content Creation & Review Workflow

**Version:** 2.0 (V2 Dual-Approach)
**Last Updated:** 2026-02-10
**Status:** ACTIVE

---

## Overview

Lessons are created using a **dual-approach workflow**:

1. **External AI (or human)** generates the rich HTML content using CSS classes from `docs/CONTENT-AUTHOR-GUIDE.md`
2. **Project AI (Claude Code)** wraps that HTML into a V2 JSON file with metadata, interactive activities, assessment, and answers

This scales to hundreds of lessons because all styling and behaviour live in CSS and the renderer — content is just HTML.

---

## The Workflow

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: PREPARE                                          │
│                                                          │
│ Kyle provides:                                           │
│   - Lesson topic and syllabus dot points                 │
│   - Level (Foundational / Advanced)                      │
│   - Subject (HSC Biology, HSC Chemistry, etc.)           │
│   - Any specific requirements (worked examples, etc.)    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 2: GENERATE HTML                                    │
│                                                          │
│ External AI generates lesson HTML using:                 │
│   - docs/CONTENT-AUTHOR-GUIDE.md (CSS classes + rules)   │
│   - The prompt template at the bottom of that guide      │
│                                                          │
│ Output: Raw HTML string using Science Hub CSS classes     │
│ Quality: Must pass the checklist in the guide            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 3: WRAP IN V2 JSON                                  │
│                                                          │
│ Project AI (Claude Code) takes the HTML and creates:     │
│   - V2 JSON file with "v2": true flag                    │
│   - Metadata: id, title, module, navigation, hero        │
│   - contentHTML: the provided HTML                        │
│   - activities: interactive JSON (classification,         │
│     matching, ordering, labeling, fill-blank)             │
│   - assessment: MCQ + short answer with correct answers   │
│   - answers: comprehensive answer keys                    │
│   - copyToBook: structured note-taking data               │
│                                                          │
│ Reference: docs/TEMPLATE-v2.json                         │
│ Output: data/lessons/{lesson-id}.json                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 4: VALIDATE & TEST                                  │
│                                                          │
│   - Run: node scripts/run-all-checks.js                  │
│   - Open lesson in browser, verify rendering              │
│   - Check all interactive activities work                 │
│   - Test mobile at 375px                                  │
│   - Verify Australian English throughout                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 5: DEPLOY                                           │
│                                                          │
│   - Commit and push to main                              │
│   - GitHub Pages auto-deploys                            │
│   - Verify on live URL                                   │
│   - Update tracker: lesson status → V2.0                 │
└─────────────────────────────────────────────────────────┘
```

---

## Key Documents

| Document | Purpose | Who Uses It |
|----------|---------|-------------|
| `docs/CONTENT-AUTHOR-GUIDE.md` | CSS class reference, HTML structure rules, quality checklist | External AI / human writing HTML |
| `docs/LESSON-DESIGN-SPEC.md` | Visual design specification, minimum content requirements | Everyone |
| `docs/TEMPLATE-v2.json` | Complete V2 JSON structure template | Project AI wrapping HTML |
| `assets/css/lesson-v2.css` | All V2 CSS classes (source of truth for styling) | Reference only |

---

## How to Generate HTML (for Kyle)

### Option A: Use Another AI

1. Copy the entire `docs/CONTENT-AUTHOR-GUIDE.md` file
2. Paste it to any AI (ChatGPT, Gemini, Claude, etc.)
3. Use the prompt template at the bottom of the guide:

> Generate the HTML content for a Science Hub lesson on **[TOPIC]** for **HSC Biology** at **Foundational** level.
>
> Follow the structure and CSS classes defined in the Content Author Guide exactly.
>
> [Paste the guide]
>
> The lesson should cover:
> - [Syllabus dot point 1]
> - [Syllabus dot point 2]
>
> Output ONLY the HTML. No JSON wrapper, no explanation.

4. Copy the HTML output
5. Paste it to Claude Code with: "Here's the HTML for lesson X, please wrap it in V2 JSON"

### Option B: Write HTML Manually

Use the CSS classes from `docs/CONTENT-AUTHOR-GUIDE.md` and follow the structure. This gives maximum control but takes longer.

### Option C: Use the Lesson Builder (Legacy)

The Lesson Builder at `/lesson-builder.html` still works for creating V1-style lessons, but does NOT produce V2 quality. Use Options A or B for V2 lessons.

---

## V2 JSON Structure (Quick Reference)

```json
{
  "id": "mod1-lesson01",
  "title": "Lesson Title",
  "module": "module-1-cells",
  "moduleTitle": "Cells as the Basis of Life",
  "moduleNumber": 1,
  "lessonNumber": 1,
  "description": "Brief description",
  "duration": "50 minutes",
  "difficulty": "Foundation Level",
  "worksOffline": true,
  "v2": true,

  "hero": { "subjectBadge", "levelBadge", "icon", "gradient" },
  "intentions": { "learning": [], "connections": [], "success": [] },
  "learningIntentions": [],
  "successCriteria": [],

  "contentHTML": "<!-- HTML from external AI goes here -->",

  "activities": [
    { "id", "type", "title", "description", "theme", "xpReward", ... }
  ],

  "assessment": {
    "multipleChoice": [{ "id", "question", "options", "correctAnswer", "marks" }],
    "shortAnswer": [{ "id", "question", "marks", "markingCriteria" }]
  },

  "answers": {
    "activities": [{ "activityId", "title", "answers" }],
    "assessment": [{ "questionId", "correctAnswer", "explanation" }]
  },

  "copyToBook": { "title", "sections": [{ "title", "items": [] }] },
  "navigation": { "previous", "previousTitle", "next", "nextTitle" },
  "meta": { "author", "createdAt", "lastModified", "version", "tags" }
}
```

Full template: `docs/TEMPLATE-v2.json`

---

## Why This Approach Scales

| Scenario | JSON + Renderer | Pure HTML (25 files) | Pure HTML (500 files) |
|----------|----------------|---------------------|----------------------|
| Change button colour | Edit 1 CSS file | Edit 25 files | Edit 500 files |
| Fix a bug | Edit 1 JS file | Edit 25 files | Edit 500 files |
| Add bookmarks feature | Edit renderer once | Edit 25 files | Edit 500 files |
| Add a new lesson | Create 1 JSON file | Create 1 HTML file | Create 1 HTML file |

With hundreds of lessons planned, the JSON + renderer approach is the only viable path.

---

## Legacy Tools (Still Available)

### Lesson Builder
**URL:** `/lesson-builder.html`
Creates V1-style JSON. Useful for quick prototyping but does not produce V2 quality.

### Content Review
**URL:** `/content-review.html`
Reviews lesson structure and validates JSON.

---

## Support

- **HTML content questions:** Refer to `docs/CONTENT-AUTHOR-GUIDE.md`
- **JSON structure questions:** Refer to `docs/TEMPLATE-v2.json`
- **Design/styling questions:** Refer to `docs/LESSON-DESIGN-SPEC.md`
- **Technical issues:** Developer (Claude Code)
- **Content accuracy:** Kyle
