# V2 Lesson Format Standards

## Field Name Standards (MUST USE)

To prevent rendering issues and pass validation, always use these standardized field names when creating V2 lessons:

### ✅ Matching Activities
```json
{
  "type": "matching",
  "items": [
    {
      "id": "item1",
      "text": "Term to match",      // ✅ Use "text"
      "match": "Definition"        // ✅ Use "match"
    }
  ]
}
```
**❌ Don't use:** `pairs`, `left`, `right`

### ✅ Classification Activities
```json
{
  "type": "classification",
  "categories": [
    {
      "id": "cat1",
      "label": "Category Name",    // ✅ Use "label"
      "description": "..."
    }
  ],
  "items": [
    {
      "id": "item1",
      "text": "Item to classify",
      "category": "cat1"           // ✅ Use "category"
    }
  ]
}
```
**❌ Don't use:** `name` (for categories), `correctCategory` (for items)

### ✅ Ordering Activities
```json
{
  "type": "ordering",
  "items": [
    {
      "id": "step1",
      "text": "Step description",
      "order": 1                    // ✅ Use "order" or "position"
    }
  ]
}
```
**❌ Don't use:** `correctOrder`

### ✅ Fill-Blank Activities
```json
{
  "type": "fill-blank",
  "items": [                        // ✅ Use "items"
    {
      "id": "blank1",
      "text": "The {{blank}} is...",
      "answer": "mitochondria"      // ✅ Use "answer"
    }
  ]
}
```
**❌ Don't use:** `blanks`, `correct`

### ✅ Assessment - Multiple Choice
```json
{
  "assessment": {
    "multipleChoice": [             // ✅ Use "multipleChoice"
      {
        "id": "mcq1",
        "question": "Question?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "B",       // ✅ Use text-based "correctAnswer"
        "rationale": "Why B is correct..."  // ✅ Use "rationale"
      }
    ]
  }
}
```
**❌ Don't use:** `mcq` (use `multipleChoice`), `correct: 1` (use `correctAnswer: "text"`), `explanation` (use `rationale`)

### ✅ Assessment - Short Answer
```json
{
  "assessment": {
    "shortAnswer": [                // ✅ Use "shortAnswer"
      {
        "id": "saq1",
        "question": "Question?",
        "marks": 3,
        "markingCriteria": [        // ✅ Include marking criteria
          "Point 1 (1 mark)",
          "Point 2 (1 mark)"
        ],
        "modelAnswer": "Full answer showing students what a complete response looks like."
      }
    ]
  }
}
```
**❌ Don't use:** `saq` (use `shortAnswer`)

### ✅ Copy To Book
```json
{
  "copyToBook": {
    "title": "Copy Into Your Book",
    "sections": [
      {
        "title": "Key Concepts",
        "items": [                  // ✅ Use "items"
          "Point 1",
          "Point 2"
        ]
      }
    ]
  }
}
```
**❌ Don't use:** `content` (use `items`)

## Validation

Run `node scripts/validate-lessons.js` to check for:
- ✅ Field name consistency
- ✅ Australian English spelling
- ✅ Required fields present
- ✅ Activity types supported

The validator will **warn** you if deprecated field names are detected.

## Why These Standards Matter

The renderer supports **both** old and new field names via fallback logic (`items || pairs`, `label || name`, etc.), but:

1. **Consistency** - Future maintainers can predict field names
2. **Performance** - Fewer fallback checks
3. **Clarity** - Clear what the "official" format is
4. **Forward compatibility** - We may remove old field name support in the future

## Template

Use `/data/lessons/TEMPLATE-V2.json` as a starting point for new lessons.

## Migration Note

Lessons 1, 3-7 use the old field names. Lesson 2 uses the new field names. Both work, but new lessons should follow the standards above.
