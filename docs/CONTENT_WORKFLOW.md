# Content Creation & Review Workflow

## Overview

This document describes the workflow for creating and reviewing lessons using the Lesson Builder tool.

## Tools

### 1. Lesson Builder
**URL:** `/lesson-builder.html`

Use this tool to:
- Create new lessons from scratch
- Edit existing lessons
- Export lessons as JSON files

### 2. Content Review
**URL:** `/content-review.html`

Use this tool to:
- Review migrated lessons
- Validate lesson structure
- Approve lessons for deployment
- Track review progress

## Workflow

### For New Lessons (Kyle)

1. **Open Lesson Builder**
   ```
   https://kyleajames33-beep.github.io/Learn/lesson-builder.html
   ```

2. **Fill in Lesson Metadata**
   - Lesson Title
   - Select Module
   - Lesson Number
   - Duration
   - Difficulty Level
   - Description

3. **Add Learning Intentions**
   - Click "Add" button for each intention
   - Write measurable learning goals

4. **Add Success Criteria**
   - Click "Add" button for each criterion
   - Define what students should be able to do

5. **Add Content Sections**
   - Click "Add Section" dropdown
   - Choose section type

6. **Add Activities**
   - Click "Add Activity" dropdown
   - Choose activity type

7. **Add Assessment**
   - Click "Add MCQ" for multiple choice

8. **Preview Lesson**
   - Check "Live Preview" panel

9. **Export JSON**
   - Click "Export JSON" button

10. **Submit for Review**
    - Send JSON file to developer

### For Editing Existing Lessons

1. **Open Lesson with Edit Parameter**
   ```
   https://kyleajames33-beep.github.io/Learn/lesson-builder.html?edit=module-1-cells-lesson-1
   ```

2. **Make Changes**
3. **Export Updated JSON**

## File Locations

### Deployed Files
```
/Learn/hsc-biology/data/lessons/
  ├── module-1-cells-lesson-1.json
  ├── module-1-cells-lesson-2.json
  └── ...
```

## Validation Rules

### Required Fields
- Lesson Title
- Module
- Lesson Number
- Description
- Duration
- At least 1 learning intention
- At least 1 content section

## Tips

### Writing Learning Intentions
✅ Good: "Students will be able to calculate surface area to volume ratios"
❌ Bad: "Learn about cells"

### Content Formatting
- Use **bold** for key terms
- Use bullet lists for multiple items
- Keep paragraphs short

## Contact

For issues or questions:
- Technical: Developer
- Content: Kyle
