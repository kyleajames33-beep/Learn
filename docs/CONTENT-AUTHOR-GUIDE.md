# Content Author Guide — Science Hub Lesson HTML

**Purpose:** Give this document to any AI (or human) generating lesson HTML content. The HTML they produce will be pasted into the `contentHTML` field of a V2 JSON lesson file.

**Important:** You are ONLY generating the HTML content. Do NOT generate the JSON wrapper, activities, assessment, or navigation — those are handled separately.

---

## Rules

1. **Australian English** — organisation, colour, analyse, behaviour, defence, licence (noun)
2. **No `<style>` or `<script>` tags** — all styling comes from existing CSS classes listed below
3. **Use only single quotes** inside HTML attributes (the HTML will be stored in a JSON string with double quotes)
4. **No IDs needed** — the renderer handles interactivity
5. **Emojis are encouraged** for section headings and visual cues
6. **Bold key terms** on first use with `<span class='key-term'>term</span>`
7. **Every lesson must follow the structure below** in order

---

## Required Lesson Structure (in order)

### 1. Hero Header

```html
<div class='hero'>
  <div class='hero-grid'>
    <div class='hero-content'>
      <div class='hero-meta'>
        <span class='badge badge-module'>HSC Biology</span>
        <span class='badge badge-foundational'>Foundational</span>
      </div>
      <h1>Lesson Title: Descriptive Subtitle</h1>
      <p class='hero-description'>One or two sentences that hook the student and explain why this topic matters.</p>
    </div>
    <div class='hero-icon'>🦠</div>
  </div>
</div>
```

**Badge classes available:**
| Class | Colour | Use for |
|-------|--------|---------|
| `badge-module` | Blue | Subject name (e.g. "HSC Biology", "HSC Chemistry") |
| `badge-foundational` | Green | "Foundational" level |
| `badge-advanced` | Purple | "Advanced" level |

**Hero icon:** Use a single large emoji that represents the lesson topic.

---

### 2. Intentions Grid (3 columns)

```html
<div class='intentions-grid'>
  <div class='intention-card blue'>
    <h3>🎯 LEARNING INTENTIONS</h3>
    <ul>
      <li>Students can explain...</li>
      <li>Students can analyse...</li>
      <li>Students can apply...</li>
      <li>Students can evaluate...</li>
    </ul>
  </div>
  <div class='intention-card purple'>
    <h3>🔗 KEY CONNECTIONS</h3>
    <ul>
      <li><strong>Prior:</strong> Topic name</li>
      <li><strong>Future:</strong> Topic name</li>
      <li><strong>Real World:</strong> Application</li>
    </ul>
  </div>
  <div class='intention-card green'>
    <h3>✅ SUCCESS CRITERIA</h3>
    <ul>
      <li>I can define...</li>
      <li>I can explain...</li>
      <li>I can solve...</li>
    </ul>
  </div>
</div>
```

**Card colours:** `blue` (learning), `purple` (connections), `green` (success). Always use this order.

---

### 3. Content Cards (3-4 sections minimum)

Each major section of content goes in a `.card`:

```html
<div class='card'>
  <div class='card-header'>
    <div class='card-icon'>🔬</div>
    <h2>Section Title</h2>
  </div>
  <p>Paragraph text. Use <span class='key-term'>key terms</span> for important vocabulary on first use.</p>
  <!-- Add styled boxes, tables, diagrams as needed (see below) -->
</div>
```

---

### 4. Copy Into Books Section

```html
<div class='copy-section'>
  <h2>📋 COPY INTO YOUR BOOKS</h2>
  <div class='copy-grid'>
    <div class='copy-item'>
      <h4>Topic Area 1</h4>
      <ul>
        <li>Key point to copy</li>
        <li>Key point to copy</li>
        <li>Key point to copy</li>
      </ul>
    </div>
    <div class='copy-item'>
      <h4>Topic Area 2</h4>
      <ul>
        <li>Key point to copy</li>
        <li>Key point to copy</li>
        <li>Key point to copy</li>
      </ul>
    </div>
  </div>
</div>
```

Use 2-4 `copy-item` blocks. Keep points concise — these are what students physically write in their books.

---

### 5. Activities (3-4 per lesson)

Activities in the HTML are **static placeholders** only. The interactive versions (drag-and-drop, matching, etc.) are handled by JSON + the renderer. Use this pattern for written/analysis activities:

```html
<div class='activity'>
  <div class='activity-number'>ACTIVITY 01</div>
  <h3>Activity Title</h3>
  <p class='activity-meta'>Brief description of what students will do.</p>
  <p style='color:var(--text-muted);margin-bottom:16px'>Detailed instructions here...</p>
  <div class='answer-area' style='min-height:100px'>Space for student answers</div>
</div>
```

For multi-part activities:
```html
<div class='activity'>
  <div class='activity-number'>ACTIVITY 02</div>
  <h3>Analysis Activity</h3>
  <p class='activity-meta'>Apply your knowledge to analyse a scenario.</p>
  <ol style='color:var(--text-muted);line-height:2;margin-left:20px'>
    <li>First question requiring analysis</li>
    <div class='answer-area'></div>
    <li>Second question requiring application</li>
    <div class='answer-area'></div>
  </ol>
</div>
```

Number activities sequentially: ACTIVITY 01, ACTIVITY 02, ACTIVITY 03, etc.

---

### 6. Assessment Section

```html
<div class='card'>
  <div class='card-header'>
    <div class='card-icon'>❓</div>
    <h2>Assessment Questions</h2>
  </div>

  <h3>Multiple Choice <span class='marks'>5 MARKS</span></h3>

  <div style='margin:24px 0'>
    <p style='color:var(--text);margin-bottom:12px;font-weight:500'>1. Question text here?</p>
    <div class='mc-option'><div class='mc-letter'>A</div><span class='mc-text'>Option A text</span></div>
    <div class='mc-option'><div class='mc-letter'>B</div><span class='mc-text'>Option B text</span></div>
    <div class='mc-option'><div class='mc-letter'>C</div><span class='mc-text'>Option C text</span></div>
    <div class='mc-option'><div class='mc-letter'>D</div><span class='mc-text'>Option D text</span></div>
  </div>

  <!-- Repeat for each MCQ question -->

  <h3 style='margin-top:40px'>Short Answer <span class='marks'>7 MARKS</span></h3>

  <div class='question-item'>
    <p>Question text here. <span class='marks'>2 MARKS</span></p>
    <div class='answer-area' style='min-height:120px'></div>
  </div>

  <!-- Repeat for each short answer question -->
</div>
```

**Minimums:** 4-5 MCQ questions, 3-4 short answer questions.

---

### 7. Comprehensive Answers Section

```html
<div class='answers'>
  <div class='answers-header'>
    <div style='font-size:32px'>✅</div>
    <h2>Comprehensive Answers</h2>
  </div>

  <div class='answer-item'>
    <h4>🎯 ACTIVITY 01 — Activity Title</h4>
    <p><strong>Answer:</strong> Detailed answer with full explanation...</p>
  </div>

  <div class='answer-item'>
    <h4>🎯 ACTIVITY 02 — Activity Title</h4>
    <p><strong>Answer:</strong> Detailed answer...</p>
  </div>

  <div class='answer-item'>
    <h4>❓ MULTIPLE CHOICE</h4>
    <p><strong>1. C</strong> — Explanation of why C is correct and why other options are wrong.</p>
    <p><strong>2. B</strong> — Explanation...</p>
    <!-- Continue for all MCQ -->
  </div>

  <div class='answer-item'>
    <h4>📝 SHORT ANSWER</h4>
    <p><strong>Q1 (2 marks):</strong> Full model answer.</p>
    <p><strong>Marking criteria:</strong> 1 mark for X, 1 mark for Y</p>
    <!-- Continue for all SA -->
  </div>
</div>
```

**Every question must have a complete answer with explanation.** No exceptions.

---

## Styled Box Reference

Use these inside `.card` elements to add visual variety and emphasis.

### Info Box (green — important concepts)
```html
<div class='info-box'>
  <strong>💡 Key Concept:</strong> Important information students must remember.
</div>
```

### Highlight Box (orange — warnings, common mistakes)
```html
<div class='highlight-box'>
  <strong>⚠️ Common Mistake:</strong> Description of what students often get wrong and the correct understanding.
</div>
```

### Warning Box (red — critical errors, exam traps)
```html
<div class='warning-box'>
  <strong>🚫 Exam Trap:</strong> Critical misconception that loses marks in exams.
</div>
```

### Formula Box (orange border — equations and formulas)
```html
<div class='formula-box'>
  <strong>Formula:</strong> Rate = Distance / Time<br><br>
  <strong>Where:</strong><br>
  • Distance = total displacement (m)<br>
  • Time = total duration (s)
</div>
```

### Worked Example (grey background — step-by-step solutions)
```html
<div class='worked-example'>
  <h4>📝 Worked Example: Problem Title</h4>
  <p><strong>Question:</strong> Clear problem statement.</p>
  <p><strong>Solution:</strong></p>
  <div class='step-box'><strong>Step 1:</strong> First step explanation</div>
  <div class='step-box'><strong>Step 2:</strong> Second step explanation</div>
  <div class='step-box'><strong>Step 3:</strong> Final answer with units</div>
  <p><strong>Check:</strong> Verify the answer makes sense by...</p>
</div>
```

**Minimum per lesson:** Use at least 4-5 styled boxes across the content sections.

---

## Table Reference

```html
<div class='table-wrap'>
  <table>
    <thead>
      <tr>
        <th>Column Header 1</th>
        <th>Column Header 2</th>
        <th>Column Header 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Row label</strong></td>
        <td>Data</td>
        <td>Data</td>
      </tr>
      <!-- More rows -->
    </tbody>
  </table>
</div>
```

**Minimum per lesson:** 2-3 data comparison tables.

---

## Flow Diagram Reference

Use for hierarchies, processes, or sequences.

```html
<div class='flow-diagram'>
  <div class='flow-box level-1'>
    <span class='icon'>🔬</span>
    <h4>Stage 1 Title</h4>
    <p>Description of this stage</p>
    <div class='examples'><strong>Examples:</strong> Specific examples</div>
  </div>
  <div class='flow-arrow'>↓</div>
  <p style='text-align:center;color:var(--text-muted);font-size:14px'><strong>Transition explanation</strong></p>
  <div class='flow-box level-2'>
    <span class='icon'>🧪</span>
    <h4>Stage 2 Title</h4>
    <p>Description of this stage</p>
    <div class='examples'><strong>Examples:</strong> Specific examples</div>
  </div>
  <div class='flow-arrow'>↓</div>
  <div class='flow-box level-3'>
    <span class='icon'>🧬</span>
    <h4>Stage 3 Title</h4>
    <p>Description of this stage</p>
    <div class='examples'><strong>Examples:</strong> Specific examples</div>
  </div>
</div>
```

**Flow box levels and colours:**
| Class | Border Colour | Use for |
|-------|--------------|---------|
| `level-1` | Red | Top/first level |
| `level-2` | Orange | Second level |
| `level-3` | Green | Third level |
| `level-4` | Blue | Fourth level |

---

## Content Quality Checklist

Before submitting HTML, verify:

- [ ] Hero header with badges and emoji icon
- [ ] 3-column intentions grid (blue, purple, green)
- [ ] 3-4 content cards with `card-header` icons
- [ ] At least 1 flow diagram OR visual hierarchy
- [ ] At least 2-3 tables with data
- [ ] At least 4-5 styled boxes (info, highlight, warning, formula, worked-example)
- [ ] At least 2 worked examples with step-by-step solutions (for calculation lessons)
- [ ] Copy Into Books section with 2-4 topic areas
- [ ] 3-4 activities with numbered badges
- [ ] Assessment: 4-5 MCQ + 3-4 short answer questions with marks
- [ ] Comprehensive Answers section covering ALL questions
- [ ] All key terms wrapped in `<span class='key-term'>...</span>` on first use
- [ ] Australian English throughout
- [ ] Only single quotes in HTML attributes
- [ ] No `<style>`, `<script>`, or `id` attributes

---

## Example Prompt for Another AI

Copy and paste this when asking another AI to generate a lesson:

> Generate the HTML content for a Science Hub lesson on **[TOPIC]** for **[SUBJECT e.g. HSC Biology]** at **[LEVEL e.g. Foundational]** level.
>
> Follow the structure and CSS classes defined in the Content Author Guide exactly. Here is the guide:
>
> [Paste this entire document]
>
> The lesson should cover:
> - [Syllabus dot point 1]
> - [Syllabus dot point 2]
> - [Syllabus dot point 3]
>
> Include:
> - A flow diagram showing [process/hierarchy]
> - Comparison table for [X vs Y]
> - Worked examples for [calculation type] (if applicable)
> - Common misconceptions about [topic]
>
> Output ONLY the HTML. No JSON wrapper, no explanation.

---

## What Happens After

Once you have the HTML:

1. **You** paste it into a conversation with the project AI (Claude Code)
2. **Claude Code** wraps it in the V2 JSON structure, adding:
   - Metadata (id, title, module, navigation)
   - Interactive activities (drag-and-drop, matching, classification, ordering)
   - Assessment data (correct answers, marking criteria)
   - Answer keys
   - Copy-to-book structured data
3. The renderer loads the JSON and displays the lesson

This workflow scales to hundreds of lessons because:
- Change a style? Edit 1 CSS file
- Add a feature? Edit the renderer once
- Content stays human-readable HTML
