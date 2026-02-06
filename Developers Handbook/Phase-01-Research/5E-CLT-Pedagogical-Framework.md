# 5E-CLT Pedagogical Framework for Phase 01

**Status:** Research Complete - Ready for Implementation  
**Phase:** 01 - Content Core (Weeks 3-6)  
**Research Source:** Kimi Module Analysis  

---

## Executive Summary

This document outlines the 5E-CLT (5E Instructional Model + Cognitive Load Theory) pedagogical framework for designing effective science lessons in Phase 01. This framework maximizes retention and engagement while minimizing cognitive overload.

---

## The 5E-CLT Formula

### Core Architecture

```
Lesson Structure:
├── 1. THE HOOK (Curiosity Gap + Dual Coding)
├── 2. CORE UNITS (Max 4 chunks per section)
│   ├── Unit 1: Visual-First, then Verbal-Visual Integration
│   ├── Unit 2: Checkpoint Micro-Quiz (Testing Effect)
│   └── Unit 3+: Interleaving Bridge to previous lessons
├── 3. DEEP DIVE (Accordion - Autonomy Support)
├── 4. RETRIEVAL ARENA (3 activities with progressive difficulty)
└── 5. META-COGNITIVE CLOSE (Copy Into Books + Self-Check)
```

---

## Research Foundations

### 1. Dual Coding Theory (Paivio, 1986)
**Principle:** Information is processed through separate visual and verbal channels.

**Implementation:**
- Visual diagrams appear BEFORE text explanation
- Explicit linking: "This diagram shows..."
- Avoid decorative images - all visuals must enhance understanding

**Lesson Example:**
```html
<!-- Visual-First (No Text) -->
<div class="diagram-zone">
  [Phospholipid bilayer diagram]
</div>

<!-- Then Verbal-Visual Integration -->
<p>This diagram shows the <strong>phospholipid bilayer</strong>. 
Notice the <span class="highlight-red">red heads</span> face outward...
</p>
```

---

### 2. Cognitive Load Theory (Sweller, 1988)
**Principle:** Working memory has limited capacity (7±2 chunks).

**Implementation:**
- Maximum 4 chunks per section
- No decorative animations
- Worked example → Faded example sequence
- Externalize working memory ("Copy Into Books")

**Chunk Limits:**
| Section Type | Max Chunks | Example |
|--------------|------------|---------|
| Hook | 2-3 | Problem + Visual |
| Core Unit | 4 | Heads/Tails/Barrier/Proteins |
| Activity | 3 steps | Instructions → Action → Feedback |

---

### 3. Testing Effect (Roediger & Karpicke, 2006)
**Principle:** Retrieval practice strengthens memory more than re-reading.

**Implementation:**
- 3 retrieval activities per lesson
- Progressive difficulty: Cued → Recognition → Elaboration
- Immediate feedback (not delayed)
- Interleaving bridges connect to previous lessons

**Retrieval Arena Structure:**
```
Retrieval Arena
├── Activity 1: Cued Recall (3 min) - Cloze/fill-in-blank
├── Activity 2: Recognition (4 min) - Diagram labeling
└── Activity 3: Elaboration (3 min) - Written explanation
```

---

### 4. Self-Determination Theory (Ryan & Deci, 2000)
**Principle:** Intrinsic motivation requires autonomy, competence, and relatedness.

**Implementation:**
| Need | Implementation |
|------|----------------|
| **Autonomy** | Accordion sections (student chooses depth) |
| **Competence** | Progress bar, completion badges, immediate feedback |
| **Relatedness** | Medical context (IV bags), career links, real-world applications |

---

### 5. Flow State (Csikszentmihalyi, 1990)
**Principle:** Optimal learning occurs when challenge matches skill level.

**Implementation:**
- Challenge increases gradually (Unit 1 → Unit 2 → Unit 3)
- Clear goals stated in Learning Intentions
- Immediate feedback on all interactions
- Time estimates for each activity

---

## Component Library for Phase 01

### 1. The Hook Section
```css
.hook-section {
  background: linear-gradient(135deg, var(--critical-light) 0%, var(--bg-elevated) 100%);
  border-left: 4px solid var(--critical);
  margin: var(--space-6) 0;
}

.hook-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  padding: var(--space-6);
}

.cell-visual {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  animation: pulse 3s infinite;
}
```

**Key Elements:**
- Curiosity gap (paradox/question)
- Dual visual comparison (before/after, shriveled/burst)
- Connection to prior knowledge
- Inquiry question prominently displayed

---

### 2. Accordion Component (Deep Dive)
```css
.accordion-container {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.accordion-header {
  width: 100%;
  padding: var(--space-4) var(--space-6);
  background: var(--bg-sidebar);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-slow);
}

.accordion-content.active {
  max-height: 500px;
}
```

**Features:**
- Student-controlled depth (autonomy)
- Optional extensions
- HSC exam connections
- Career links
- Challenge questions

---

### 3. Checkpoint Micro-Quiz
```css
.checkpoint {
  background: var(--bg-elevated);
  border-left: 4px solid var(--accent);
  padding: var(--space-4) var(--space-6);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}
```

**Features:**
- 2-minute time limit
- Immediate feedback
- Single question
- Prevents "illusion of competence"

---

### 4. Retrieval Arena
```css
.retrieval-arena {
  background: linear-gradient(135deg, var(--bg-surface) 0%, var(--primary-light) 100%);
  border: 2px solid var(--primary);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
}

.retrieval-activity {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.retrieval-label {
  background: var(--primary);
  color: var(--text-primary);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  text-transform: uppercase;
}
```

**Activity Types:**

| Type | Duration | Description |
|------|----------|-------------|
| Cued Recall | 3 min | Cloze/fill-in-blank with hints |
| Recognition | 4 min | Diagram labeling, matching |
| Elaboration | 3 min | Written explanations |

---

### 5. Interleaving Bridge
```css
.bridge-section {
  background: linear-gradient(90deg, var(--secondary-light), transparent);
  border-left: 4px solid var(--secondary-dark);
  padding: var(--space-4) var(--space-6);
  font-style: italic;
}
```

**Purpose:**
- Connects to previous lessons
- Forces retrieval of old knowledge
- Shows relationships between concepts

---

### 6. Cloze Input Component
```css
.cloze-input {
  display: inline-block;
  width: 120px;
  border: none;
  border-bottom: 2px solid var(--border-strong);
  background: var(--bg-elevated);
  padding: var(--space-1) var(--space-2);
  text-align: center;
  font-weight: var(--weight-semibold);
  transition: all var(--transition-fast);
}

.cloze-input.correct {
  background: var(--success);
  border-bottom-color: #10b981;
}

.cloze-input.incorrect {
  background: var(--danger);
  border-bottom-color: #ef4444;
}
```

---

## Implementation Timeline (Phase 01)

### Week 1-2: Template Standardization
- [ ] Create 5E-CLT template component library
- [ ] Build interactive components (accordion, cloze, drag-drop)
- [ ] Implement progress tracking enhancements
- [ ] Add Retrieval Arena framework

### Week 3-4: Content Conversion
- [ ] Convert existing 3 lessons to 5E-CLT format
- [ ] Write remaining Module 1 lessons (4-15)
- [ ] Add interleaving bridges between all lessons

### Week 5-6: Advanced Features
- [ ] Implement spaced repetition priming
- [ ] Add "Copy Into Books" structured summaries
- [ ] Build meta-cognitive close components
- [ ] Create challenge question bank

---

## Key Metrics for Success

| Metric | Target | Measurement |
|--------|--------|-------------|
| Completion Rate | >80% | Lessons marked complete |
| Time on Task | 30-50 min | Average lesson time |
| Retrieval Accuracy | >70% | Arena activity scores |
| Return Rate | >3 days/week | User engagement |

---

## HSC-Specific Considerations

### Syllabus Integration
- Every lesson must reference Inquiry Questions
- Include Module 8 (Non-infectious Disease) connections
- Add "Working Scientifically" skill references
- Mark 4-mark challenge questions with marking criteria

### Exam Preparation
- Include past HSC question styles
- Provide marking criteria for all questions
- Connect to Module 5 (Heredity) genetic concepts
- Reference Module 3 (Living Earth) ecosystem contexts

---

## Research Citations

1. **Paivio, A.** (1986). Mental representations: A dual coding approach. *Oxford University Press.*

2. **Sweller, J.** (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science, 12*(2), 257-285.

3. **Roediger, H. L., & Karpicke, J. D.** (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science, 17*(3), 249-255.

4. **Ryan, R. M., & Deci, E. L.** (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. *American Psychologist, 55*(1), 68-78.

5. **Csikszentmihalyi, M.** (1990). Flow: The psychology of optimal experience. *Harper & Row.*

---

## Next Steps

1. **Review with Kyle** - Get teacher approval on pedagogical approach
2. **Prototype Lesson** - Build one full 5E-CLT lesson for testing
3. **Student Testing** - Trial with target demographic
4. **Iterate** - Refine based on feedback
5. **Scale** - Apply framework to all 30 lessons

---

**Document Owner:** Development Team  
**Last Updated:** February 2026  
**Version:** 1.0 (Research Phase)
