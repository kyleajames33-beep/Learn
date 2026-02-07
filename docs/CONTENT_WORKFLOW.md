# Content Creation & Review Workflow

## Phase 0.4 Status: CORE COMPLETE (Hybrid Approach)

**Completed:** Migration pipeline and 6 lessons (4 simplified + 2 full fidelity)  
**Pending:** Lessons 6-8 creation (to be done in Phase 1 by Kyle)

---

## Current Lesson Status

| Lesson | Status | Fidelity | Notes |
|--------|--------|----------|-------|
| M1L1: Introduction to Cells | ✅ Ready | Simplified (70%) | Phase 0.2 - Core content only |
| M1L2: Prokaryotic Cells | ✅ Ready | Simplified (70%) | Phase 0.2 - Core content only |
| M1L3: Eukaryotic Cells | ✅ Ready | Simplified (70%) | Phase 0.2 - Core content only |
| M1L4: Cell Membrane | ✅ Ready | Full | Migrated from HTML |
| M1L5: Passive Transport | ✅ Ready | Full | Migrated from HTML |
| M5L1: Heredity | ✅ Ready | Full | Created in Builder |
| M1L6: Active Transport | ⏳ Phase 1 | - | Kyle creates NEW |
| M1L7: Osmosis | ⏳ Phase 1 | - | Kyle creates NEW |
| M1L8: Enzymes | ⏳ Phase 1 | - | Kyle creates NEW |

**Legend:**
- M1 = Module 1: Cells
- M5 = Module 5: Heredity
- L1-8 = Lesson numbers

---

## Tools

### 1. Lesson Builder
**URL:** `/lesson-builder.html`

Use this tool to:
- Create new lessons from scratch (Kyle's primary tool for Phase 1)
- Edit existing lessons
- Export lessons as JSON files

**Features:**
- Form-based lesson creation (no coding required)
- Rich text editor for formatting
- Live preview of lesson
- Auto-save to browser storage
- JSON export for deployment

**To Edit Existing Lesson:**
```
https://kyleajames33-beep.github.io/Learn/lesson-builder.html?edit=module-1-cells-lesson-1
```

### 2. Content Review
**URL:** `/content-review.html`

Use this tool to:
- Review migrated lessons
- Validate lesson structure
- Approve lessons for deployment
- Track review progress

---

## Workflow for Kyle (Phase 1)

### Creating NEW Lessons (Lessons 6-8)

1. **Open Lesson Builder**
   ```
   https://kyleajames33-beep.github.io/Learn/lesson-builder.html
   ```

2. **Fill in Lesson Metadata**
   - Lesson Title (e.g., "Lesson 6: Active Transport")
   - Select Module: "Module 1: Cells"
   - Lesson Number: 6
   - Duration: 45 minutes
   - Difficulty: Intermediate
   - Description: Brief overview

3. **Add Learning Intentions** (3-4 items)
   - Click "Add" button for each
   - Write measurable goals
   - Example: "Explain how active transport differs from passive transport"

4. **Add Success Criteria** (3-4 items)
   - Define what students should demonstrate
   - Example: "Compare ATP usage in active vs passive transport"

5. **Add Content Sections**
   - Click "Add Section" dropdown
   - Choose type: Text, Definition, Grid, Accordion, Worked Example
   - Fill in content using rich text editor

6. **Add Activities** (1-2 per lesson)
   - Matching activities
   - Fill-in-blank exercises

7. **Add Assessment** (3-5 MCQs)
   - Click "Add MCQ"
   - Write question + 4 options
   - Select correct answer

8. **Preview & Export**
   - Check Live Preview panel
   - Click "Export JSON"
   - Fix any validation errors
   - Download JSON file

9. **Submit to Developer**
   - Send JSON file
   - Include any notes

---

## Important Notes for Kyle

### Content Fidelity Differences

**Lessons 1-3:** These were created early in Phase 0.2 as simplified versions. They have:
- Core content present
- Fewer activity items
- Simplified assessments
- **Will be enhanced in Phase 1.5**

**Lessons 4-5:** These were migrated from existing HTML and have:
- Full original content
- Complete activities
- Full assessments
- **Production-ready**

**Lessons 6-8:** These will be created by you using the Builder tool with:
- Full fidelity from the start
- All activities and assessments
- **Set the standard for future lessons**

### When Creating New Lessons

✅ **Do:**
- Write 3-4 specific learning intentions
- Include 1-2 interactive activities
- Add 3-5 assessment questions
- Use the rich text editor for formatting
- Keep paragraphs short (2-3 sentences)

❌ **Don't:**
- Skip the assessment section
- Create lessons without activities
- Use only plain text (use formatting)
- Rush through - quality over speed

---

## File Deployment

### After Kyle Exports JSON:
1. Developer reviews via content-review.html
2. Developer validates and approves
3. JSON moved to: `/hsc-biology/data/lessons/`
4. Module index updated
5. Test deployed lesson

---

## Validation Requirements

### Required Fields (Must Have)
- [ ] Lesson Title
- [ ] Module selection
- [ ] Lesson number
- [ ] Description
- [ ] 1+ learning intentions
- [ ] 1+ content sections

### Recommended (Should Have)
- [ ] 2+ activities
- [ ] 3+ assessment questions
- [ ] Engagement hook
- [ ] Success criteria

---

## Support

For technical issues: Developer  
For content questions: Kyle (self-directed)  

---

## Timeline

**Phase 1 (Weeks 1-2):**
- Kyle creates Lessons 6, 7, 8
- Developer deploys and tests
- Module 1 complete (8 lessons)

**Phase 1.5 (Week 3):**
- Optional: Enhance Lessons 1-3 to full fidelity
- If time permits

**Phase 2+:**
- Scale to other modules
- 1 lesson per day target
