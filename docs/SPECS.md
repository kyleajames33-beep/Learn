# Science Hub - Technical Specifications
**Last Updated:** 2026-02-09  
**Applies To:** Phase 1 - Module 1 Lessons  

---

## 1. LESSON JSON SPECIFICATION

### Required Fields

```typescript
interface Lesson {
  // Identity
  id: string;                    // Format: "module-1-cells-lesson-X" or "mod1-lessonXX"
  title: string;                 // Lesson title
  module: string;                // "module-1-cells"
  moduleTitle: string;          // "Cells as the Basis of Life"
  moduleNumber: number;         // 1
  lessonNumber: number;         // 1-25
  
  // Metadata
  description: string;          // 1-2 sentence summary
  duration: string;             // "50 minutes"
  difficulty: "Foundation Level" | "Intermediate" | "Advanced";
  worksOffline: boolean;        // Always true for Phase 1
  
  // Pedagogy
  learningIntentions: string[]; // 3-4 measurable goals
  successCriteria: string[];    // 3-4 student-friendly criteria
  engagementHook: {
    title: string;
    content: string;           // Hook scenario/question
  };
  
  // Content
  keyConcepts: KeyConcept[];
  misconceptions: Misconception[];
  contentSections: ContentSection[];
  
  // Interactions
  activities: Activity[];
  assessment: Assessment;
  
  // Study aids
  copyToBook: {
    definitions: string[];     // 5 bullet points
    keyPoints: string[];       // 4-5 items
    diagrams: string[];        // List of diagrams to draw
  };
  
  // Navigation
  prerequisites: Prerequisite[];
  navigation: {
    previous: string | null;
    previousTitle: string | null;
    next: string | null;
    nextTitle: string | null;
  };
  
  // Meta
  meta: {
    author: string;
    createdAt: string;         // "2026-02-09"
    lastModified: string;
    version: string;           // "1.0.0"
    tags: string[];
  };
  
  imageLibrary: Image[];
}
```

### Content Section Types

#### 1. Diagram Section
```json
{
  "id": "unique-id",
  "type": "diagram",
  "title": "Section Title",
  "icon": "microscope|recycle|columns|alert-triangle",
  "content": "Description text",
  "keyPoints": ["Point 1", "Point 2"],
  "example": "Real-world example",
  "checkForUnderstanding": "Question to ask",
  "image": {
    "src": "assets/images/mod1/lessonXX/image.webp",
    "alt": "Descriptive alt text",
    "caption": "Image caption"
  }
}
```

#### 2. Grid Section
```json
{
  "id": "unique-id",
  "type": "grid",
  "title": "Comparison Title",
  "icon": "columns",
  "gridItems": [
    { "header": "Column 1", "items": ["Item 1", "Item 2"] },
    { "header": "Column 2", "items": ["Item 1", "Item 2"] }
  ],
  "note": "Additional note",
  "example": "Example scenario"
}
```

#### 3. Content Section
```json
{
  "id": "unique-id",
  "type": "content",
  "title": "Title",
  "icon": "book-open|shield|info",
  "content": "HTML content (escaped)",
  "example": "Example",
  "checkForUnderstanding": "Question"
}
```

---

## 2. ACTIVITY SPECIFICATIONS

### Activity Type: Labeling

```typescript
interface LabelingActivity {
  id: string;
  type: "labeling";
  title: string;
  description: string;
  learningObjective: string;
  theme: "teal" | "purple" | "orange";
  xpReward: number;           // 50 XP standard
  image: {
    src: string;
    alt: string;
  };
  labels: Label[];
}

interface Label {
  id: string;
  zone: {
    x: number;              // Percentage (0-100)
    y: number;              // Percentage (0-100)
    width: number;          // Percentage (0-100)
    height: number;         // Percentage (0-100)
  };
  correctText: string;
  alternatives: string[];   // Acceptable alternatives
  hint: string;             // Helpful hint
}
```

**Requirements:**
- Touch target minimum: 44×44px
- Zone percentages relative to image dimensions
- Popup modal for label selection
- Immediate visual feedback (correct/incorrect)

---

### Activity Type: Matching

```typescript
interface MatchingActivity {
  id: string;
  type: "matching";
  title: string;
  description: string;
  learningObjective: string;
  theme: "teal" | "purple" | "orange";
  xpReward: number;
  items: MatchingPair[];
  correctApproach: string;  // Explanation of correct matching
}

interface MatchingPair {
  id: string;
  text: string;            // Left side (term)
  match: string;           // Right side (definition)
}
```

**Requirements:**
- Maximum 6 pairs (cognitive load)
- Visual connection lines between matches
- Cards shuffle/randomize on load
- Immediate feedback on match attempt

---

### Activity Type: Ordering

```typescript
interface OrderingActivity {
  id: string;
  type: "ordering";
  title: string;
  description: string;
  learningObjective: string;
  theme: "teal" | "purple" | "orange";
  xpReward: number;
  items: OrderItem[];
  correctOrder: string[];   // Array of item IDs in correct order
}

interface OrderItem {
  id: string;
  text: string;
}
```

**Requirements:**
- Drag-and-drop or tap-to-reorder
- Visual sequence indicators (1, 2, 3...)
- Strict matching required
- Check button validates full sequence

---

### Activity Type: Classification

```typescript
interface ClassificationActivity {
  id: string;
  type: "classification";
  title: string;
  description: string;
  learningObjective: string;
  theme: "teal" | "purple" | "orange";
  xpReward: number;
  categories: Category[];
  items: ClassifiableItem[];
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface ClassifiableItem {
  id: string;
  text: string;
  correctCategory: string;  // Category ID
}
```

**Requirements:**
- Drag items to category boxes
- Distractors allowed (items that don't fit any category)
- Visual feedback on drop
- Score calculation: X/Y correct

---

### Activity Type: Problem Solving

```typescript
interface ProblemSolvingActivity {
  id: string;
  type: "problemSolving";
  title: string;
  description: string;
  learningObjective: string;
  theme: "teal" | "purple" | "orange";
  xpReward: number;
  problems: Problem[];
}

interface Problem {
  id: string;
  question: string;
  workingSteps: string[];   // Step-by-step guidance
  correctAnswer: number;
  tolerance: number;        // ±5% = 0.05, ±2% = 0.02
  unit: string;            // "μm", "mm", "x", etc.
  hint: string;
}
```

**Tolerance Rules:**
```javascript
function checkAnswer(userAnswer, correctAnswer, tolerance) {
  const relativeError = Math.abs(userAnswer - correctAnswer) / correctAnswer;
  return relativeError <= tolerance;
}

// Standard: tolerance = 0.05 (±5%)
// Precision: tolerance = 0.02 (±2%)
// High precision: tolerance = 0.005 (±0.5%)
```

---

## 3. ASSESSMENT SPECIFICATION

### Multiple Choice Questions

```typescript
interface MultipleChoiceQuestion {
  id: string;
  question: string;         // Can include HTML for formatting
  options: string[];       // 4 options (A, B, C, D)
  correctAnswer: string;   // Exact text of correct option
  rationale: string;       // Why correct, why others wrong
}
```

**Requirements:**
- Exactly 3 MCQ per lesson
- 4 options each
- Rationale explains misconceptions
- Radio button styling

### Short Answer Questions

```typescript
interface ShortAnswerQuestion {
  id: string;
  question: string;
  marks: number;           // Usually 2 marks
  markingCriteria: string[]; // 1 mark per criterion
  commonError: string;     // Common mistake to watch for
}
```

**Requirements:**
- Exactly 2 SAQ per lesson
- Marking criteria clearly defined
- Common errors noted for feedback
- Textarea input with 3-5 lines

---

## 4. RENDERER IMPLEMENTATION GUIDE

### Lesson Renderer Architecture

```
lesson.html
  ↓
lesson-renderer.js (main controller)
  ↓
  ├── URL Parser: Extract ?lesson=module-1-cells-lesson-1
  ├── Data Loader: Fetch JSON from data/lessons/
  ├── Schema Validator: Validate against lesson-data-schema.js
  ├── Section Renderers:
  │     ├── HeroRenderer
  │     ├── ContentSectionRenderer
  │     ├── ActivityRenderer (delegates to type-specific)
  │     └── AssessmentRenderer
  └── NavigationRenderer
```

### Activity Renderer Delegation

```javascript
const activityRenderers = {
  labeling: renderLabelingActivity,
  matching: renderMatchingActivity,
  ordering: renderOrderingActivity,
  classification: renderClassificationActivity,
  problemSolving: renderProblemSolvingActivity,
  comparisonTable: renderComparisonTableActivity,
  interactiveSlider: renderInteractiveSliderActivity,
  tonicitySimulator: renderTonicitySimulatorActivity
};

function renderActivity(activity) {
  const renderer = activityRenderers[activity.type];
  if (!renderer) {
    console.error(`Unknown activity type: ${activity.type}`);
    return;
  }
  return renderer(activity);
}
```

---

## 5. TOUCH EVENT REQUIREMENTS

### Event Binding Pattern

```javascript
// ALWAYS bind both for <100ms feedback
element.addEventListener('click', handleInteraction);
element.addEventListener('touchstart', handleInteraction, { passive: true });

// Prevent double-firing
let isHandled = false;
function handleInteraction(e) {
  if (isHandled) return;
  isHandled = true;
  
  // Handle interaction
  
  setTimeout(() => { isHandled = false; }, 100);
}
```

### Touch Target Sizing

```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;        /* Comfortable touch area */
}

/* For small elements like radio buttons */
.touch-wrapper {
  padding: 12px;
  margin: -12px;        /* Expand touch area without visual change */
}
```

---

## 6. LOCALSTORAGE SCHEMA

### Progress Tracking

```javascript
// Keys
const PROGRESS_KEY = 'lesson-progress-[lesson-id]';
const LAST_VISITED_KEY = 'last-visited-lesson';
const XP_KEY = 'total-xp';
const STREAK_KEY = 'streak-data';
const ACHIEVEMENTS_KEY = 'unlocked-achievements';

// Example data
localStorage.setItem('lesson-progress-module-1-cells-lesson-1', JSON.stringify({
  completed: true,
  completedAt: '2026-02-09T10:30:00Z',
  score: 85,              // Percentage if applicable
  timeSpent: 2400         // Seconds
}));

localStorage.setItem('last-visited-lesson', 'module-1-cells-lesson-3');
```

### Prerequisite Checking

```javascript
function checkPrerequisites(lesson) {
  if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
    return { canAccess: true };
  }
  
  for (const prereq of lesson.prerequisites) {
    const key = `lesson-progress-${prereq.lessonId}`;
    const progress = JSON.parse(localStorage.getItem(key));
    
    if (prereq.required && (!progress || !progress.completed)) {
      return {
        canAccess: false,
        blockedBy: prereq.lessonId,
        message: `Complete ${prereq.description} first`
      };
    }
  }
  
  return { canAccess: true };
}
```

---

## 7. IMAGE SPECIFICATIONS

### Required Formats

| Type | Format | Max Size | Dimensions |
|------|--------|----------|------------|
| Full diagrams | WebP | 100KB | 800×600px |
| Thumbnails | WebP | 20KB | 200×150px |
| Micrographs | WebP | 50KB | 400×400px |
| Icons | SVG | 5KB | 24×24px |

### Naming Convention

```
assets/images/mod1/lesson01/
├── prokaryote-diagram.webp          # Main diagram
├── prokaryote-diagram-thumb.webp    # Thumbnail
├── nucleoid-tem.webp                # TEM micrograph
└── nucleoid-tem-thumb.webp          # TEM thumbnail
```

### Alt Text Requirements

- Descriptive but concise (<125 characters)
- Include context (not just "diagram")
- Example: "Diagram of prokaryotic cell showing nucleoid region, cell wall, and 70S ribosomes"

---

## 8. AUSTRALIAN ENGLISH CHECKLIST

### Common Replacements

| American | Australian | Context |
|----------|------------|---------|
| specialized | specialised | All content |
| behavior | behaviour | All content |
| color | colour | All content |
| center | centre | All content |
| analyze | analyse | All content |
| fiber | fibre | Biology content |
| hemoglobin | haemoglobin | Biology content |
| program | programme | Educational context |
| gray | grey | Color descriptions |
| mold | mould | Biology content |

### Pre-Commit Check

```bash
# Search for American spellings
grep -r "specialized\|behavior\|color\|center\|analyze" data/lessons/

# Should return no results
```

---

## 9. PERFORMANCE BUDGET

### Per Lesson Maximums

| Resource | Budget | Current Target |
|----------|--------|----------------|
| HTML/JS/CSS | 200KB | 150KB |
| Images | 200KB | 150KB |
| JSON Data | 50KB | 30KB |
| **Total** | **450KB** | **330KB** |

### Loading Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| First Contentful Paint | <1s | <1.5s |
| Time to Interactive | <2s | <3s |
| Lighthouse Performance | >95 | >90 |

---

## 10. ERROR HANDLING

### Graceful Degradation

```javascript
// JSON load failure
try {
  const response = await fetch(`data/lessons/${lessonId}.json`);
  if (!response.ok) throw new Error('Failed to load');
  const lesson = await response.json();
} catch (error) {
  console.error('Lesson load failed:', error);
  showError('Unable to load lesson. Please check your connection.');
  // Fallback: Show offline cached version if available
}

// Activity renderer failure
function renderActivity(activity) {
  try {
    const renderer = activityRenderers[activity.type];
    if (!renderer) throw new Error(`Unknown type: ${activity.type}`);
    return renderer(activity);
  } catch (error) {
    console.error('Activity render failed:', error);
    return `<div class="error">Activity unavailable</div>`;
  }
}
```

---

### Activity Type: Comparison Table

```typescript
interface ComparisonTableActivity {
  id: string;
  type: "comparison-table";
  title: string;
  description: string;
  learningObjective: string;
  theme: "teal" | "purple" | "orange";
  xpReward: number;
  categories: ComparisonCategory[];
}

interface ComparisonCategory {
  id: string;
  name: string;
  items: string[];
}
```

**Requirements:**
- Toggle buttons to show/hide categories
- Responsive grid layout
- Works on mobile (375px)

---

### Activity Type: Interactive Slider

```typescript
interface InteractiveSliderActivity {
  id: string;
  type: "interactive-slider";
  title: string;
  description: string;
  learningObjective: string;
  theme: "teal" | "purple" | "orange";
  xpReward: number;
  slider: {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    unit: string;
    label: string;
  };
  zones: SliderZone[];
}

interface SliderZone {
  min: number;
  max: number;
  label: string;
  description: string;
  visualState: string;
  cholesterolEffect?: string;
}
```

**Requirements:**
- Real-time visual feedback
- CSS animations for state changes
- Mobile touch support

---

### Activity Type: Tonicity Simulator

```typescript
interface TonicitySimulatorActivity {
  id: string;
  type: "tonicity-simulator";
  title: string;
  description: string;
  learningObjective: string;
  theme: "teal" | "purple" | "orange";
  xpReward: number;
  cellTypes: CellType[];
  solutions: TonicitySolution[];
}

interface CellType {
  id: string;
  name: string;
  hasCellWall: boolean;
}

interface TonicitySolution {
  id: string;
  name: string;
  waterPotential: number;
  animalEffect: string;
  plantEffect: string;
}
```

**Requirements:**
- Cell visual changes based on solution
- Toggle between animal/plant cells
- Clear effect descriptions

---

**Document Location:** `/docs/SPECS.md`  
**Update Frequency:** When technical specs change  
**Owner:** Developer
