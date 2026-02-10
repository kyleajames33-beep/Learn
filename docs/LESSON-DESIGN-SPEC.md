# Science Hub - Lesson Design Specification

**Version:** 2.0  
**Date:** 2026-02-10  
**Status:** ACTIVE

---

## Overview

This document defines the **minimum quality standard** for all Science Hub lessons, based on the provided example lessons. All lessons must meet or exceed this specification.

---

## Design Philosophy

Lessons should be:
- **Visually engaging** - Modern, clean design with clear hierarchy
- **Pedagogically sound** - Learning intentions → Content → Activities → Assessment
- **Comprehensive** - Rich content with examples, not just definitions
- **Interactive** - Activities that engage students, not just passive reading
- **Assessment-ready** - Include complete answers for all questions

---

## Required Lesson Structure

### 1. Hero Header
```
┌─────────────────────────────────────────┐
│ [Gradient Border Top]                   │
│                                         │
│  [Badge: Subject] [Badge: Level]        │
│  Main Title (Large, Bold)               │
│  Subtitle/Description                    │
│                                         │
│                         [Emoji Icon]    │
└─────────────────────────────────────────┘
```

**Required Elements:**
- Subject badge (e.g., "Biology", "Chemistry")
- Level badge (e.g., "Foundational", "Advanced")
- Compelling title
- Brief description (1-2 sentences)
- Large emoji/icon representing the topic

### 2. Three-Column Intentions Grid
```
┌──────────────┬──────────────┬──────────────┐
│ 🎯 LEARNING  │ 🔗 KEY       │ ✅ SUCCESS   │
│ INTENTIONS   │ CONNECTIONS  │ CRITERIA     │
│              │              │              │
│ • Bullet     │ • Links to   │ • What       │
│ • Points     │   other      │   students   │
│              │   topics     │   can do     │
└──────────────┴──────────────┴──────────────┘
```

**Required Elements:**
- **Learning Intentions:** 4-5 specific, measurable objectives
- **Key Connections:** Links to prior knowledge and future topics
- **Success Criteria:** Observable outcomes students can self-assess

### 3. Main Content Sections

Each content section must include:

#### Visual Flow Diagrams
- Large, colored boxes showing hierarchies/processes
- Arrow connections between steps
- Icons for each stage
- Color-coded by level (e.g., red→orange→green→blue)
- Examples at each stage

#### Content Cards
- Header with icon
- Clear H2/H3 headings
- Rich text with **bold key terms**
- Styled boxes for:
  - **Formula boxes** (orange) - For equations and formulas
  - **Info boxes** (green) - For important concepts
  - **Highlight boxes** (yellow/orange) - For warnings or key points
  - **Worked examples** (step-by-step solutions)

#### Tables
- Styled data tables with headers
- Clear column alignment
- Hover effects
- Examples, not just theory

### 4. Copy Into Books Section
```
┌─────────────────────────────────────────┐
│ 📋 COPY INTO YOUR BOOKS                │
│ (Red/orange border, distinct section)   │
├─────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐              │
│ │ Topic 1  │ │ Topic 2  │              │
│ │ • Bullet │ │ • Bullet │              │
│ └──────────┘ └──────────┘              │
└─────────────────────────────────────────┘
```

**Required:**
- Summary of key points
- Bullet-point format
- Organized by sub-topic

### 5. Activities

Each activity must have:
- Numbered badge (ACTIVITY 01, ACTIVITY 02)
- Clear title
- Brief description of what students will do
- Instructions
- Answer areas (dashed boxes)
- Multiple question types:
  - Create diagrams
  - Analysis questions
  - Fill-in tables
  - Extended responses

### 6. Assessment Section

**Multiple Choice:**
- Styled option boxes (A, B, C, D)
- Hover effects
- Clear question text
- Marks indicated

**Short Answer:**
- Question with mark allocation
- Sufficient answer space
- Clear prompts

### 7. Comprehensive Answers Section
```
┌─────────────────────────────────────────┐
│ ✅ COMPREHENSIVE ANSWERS               │
│ (Green border, at end of lesson)        │
├─────────────────────────────────────────┤
│ Activity 1                              │
│ • Detailed answer with explanations     │
│ • Step-by-step solutions                │
│ • Why the answer is correct             │
└─────────────────────────────────────────┘
```

**Required:**
- ALL activities have complete answers
- Step-by-step solutions
- Explanations, not just answers
- Reference to marking criteria

---

## Content Quality Requirements

### Minimum Content Per Lesson

| Element | Minimum |
|---------|---------|
| Content sections | 3-4 major sections |
| Worked examples | 2-3 with step-by-step solutions |
| Tables | 2-3 data tables |
| Styled boxes | 4-5 (info, warning, formula, highlight) |
| Activities | 3-4 activities |
| MCQ questions | 4-5 questions |
| Short answer | 3-4 questions |
| Total lesson time | 45-60 minutes |

### Writing Style

✅ **DO:**
- Use clear, concise language
- Define key terms on first use (bold)
- Provide real-world examples
- Include step-by-step worked examples
- Add "Common Mistake" warnings
- Include "Check" prompts
- Use Australian English

❌ **DON'T:**
- Write walls of text without breaks
- Skip worked examples
- Leave out answer keys
- Use overly technical jargon without explanation
- Include American spellings

---

## Technical Implementation (Option C)

### JSON Metadata Structure
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
  "difficulty": "Foundational",
  
  "learningIntentions": [
    "Students can...",
    "Students can..."
  ],
  
  "successCriteria": [
    "I can...",
    "I can..."
  ],
  
  "keyConnections": [
    {"topic": "Prior topic", "link": "module-x-lesson-y"},
    {"topic": "Future topic", "link": "module-z-lesson-w"}
  ],
  
  "hero": {
    "subjectBadge": "Biology",
    "levelBadge": "Foundational",
    "icon": "🧬",
    "gradient": "blue-to-purple"
  }
}
```

### HTML Content Blocks

Content sections are now HTML with specific CSS classes:

```html
<!-- Hero -->
<div class="hero">
  <div class="hero-grid">
    <div class="hero-content">
      <div class="hero-meta">
        <span class="badge badge-module">Biology</span>
        <span class="badge badge-foundational">Foundational</span>
      </div>
      <h1>Lesson Title</h1>
      <p class="hero-description">Description...</p>
    </div>
    <div class="hero-icon">🧬</div>
  </div>
</div>

<!-- Three-Column Grid -->
<div class="intentions-grid">
  <div class="intention-card blue">
    <h3>🎯 LEARNING INTENTIONS</h3>
    <ul>...</ul>
  </div>
  <div class="intention-card purple">...</div>
  <div class="intention-card green">...</div>
</div>

<!-- Flow Diagram -->
<div class="flow-diagram">
  <div class="flow-box level-1">...</div>
  <div class="flow-arrow">↓</div>
  <div class="flow-box level-2">...</div>
</div>

<!-- Styled Boxes -->
<div class="formula-box">...</div>
<div class="info-box">...</div>
<div class="highlight-box">...</div>
<div class="worked-example">...</div>

<!-- Activity -->
<div class="activity">
  <div class="activity-number">ACTIVITY 01</div>
  <h3>Activity Title</h3>
  <p class="activity-meta">Description</p>
  <!-- Activity content -->
  <div class="answer-area"></div>
</div>
```

---

## CSS Classes Reference

### Layout Classes
- `.hero` - Hero header section
- `.hero-grid` - Two-column hero layout
- `.intentions-grid` - Three-column grid
- `.card` - Content card container
- `.flow-diagram` - Flow diagram container
- `.activity` - Activity section
- `.answers` - Answers section

### Styled Boxes
- `.formula-box` - Orange-bordered formula box
- `.info-box` - Green-bordered info box
- `.highlight-box` - Yellow/orange highlight
- `.worked-example` - Step-by-step example
- `.warning-box` - Red warning box
- `.step-box` - Numbered step box

### UI Components
- `.badge` - Subject/level badges
- `.flow-box` - Flow diagram boxes (level-1, level-2, etc.)
- `.flow-arrow` - Arrow between boxes
- `.answer-area` - Dashed answer space
- `.mc-option` - Multiple choice option
- `.question-item` - Short answer question
- `.answer-item` - Answer section item

### Tables
- `.table-wrap` - Table container with scroll
- Standard HTML `<table>` with styled `<th>`, `<td>`

---

## Example Lessons Reference

The following lessons are the **gold standard** to reference:

1. **Chemistry Workshop (Gravimetric Analysis)** - Provided HTML
   - Excellent worked examples
   - Formula boxes
   - Comprehensive answer section

2. **Biology (Cells, Tissues, Organs)** - Provided HTML
   - Beautiful flow diagram
   - Three-column grid
   - Rich content cards
   - Comprehensive activities

All new lessons must match or exceed these examples in:
- Visual design quality
- Content comprehensiveness
- Pedagogical structure
- Answer completeness

---

## Implementation Checklist

When creating/updating a lesson, verify:

- [ ] Hero header with badges and icon
- [ ] Three-column intentions grid
- [ ] At least 3 content sections with styled boxes
- [ ] Flow diagram or visual hierarchy
- [ ] 2-3 tables with data
- [ ] Copy into books section
- [ ] 3-4 activities with answer areas
- [ ] Assessment section (4-5 MCQ, 3-4 SA)
- [ ] Comprehensive answers section
- [ ] Australian English spellings
- [ ] All key terms bolded
- [ ] Mobile-responsive design
- [ ] Run `node scripts/run-all-checks.js` - all pass

---

## Quality Gates

A lesson is **NOT COMPLETE** until:

1. All checklist items verified
2. Visual design matches examples
3. Content is comprehensive (not sparse)
4. All answers included
5. Tests pass with 0 errors
6. Mobile responsive at 375px
7. Kyle approves scientific accuracy

---

## Next Steps

1. **Create pilot lesson** using this specification
2. **Update lesson-renderer.js** to support new HTML content blocks
3. **Update CSS** with new classes from specification
4. **Retrofit existing lessons** to new standard (gradually)
5. **All new lessons** must meet this standard
