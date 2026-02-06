# Component Library Specification
**Exact Blueprints for Every UI Element**

**Purpose:** Reference for all implemented UI components. Use existing patterns when building new lessons.
**Status:** ALL COMPONENTS BELOW ARE IMPLEMENTED
**Last Updated:** 2026-02-06

**Implementation Files:**
- `assets/css/global.css` — Design tokens, base styles (1595 lines)
- `assets/css/components.css` — Core UI components (1388 lines)
- `assets/css/layout.css` — Grid & layout systems (1847 lines)
- `assets/css/minigames.css` — Mini-game components (804 lines)
- `assets/css/diagrams.css` — Interactive diagram components (629 lines)
- `assets/css/xp.css`, `streak.css`, `achievements.css`, `dashboard.css` — Gamification UI

---

## Component Hierarchy

Every lesson is built from these components:

1. **Layout Components** (structure)
2. **Navigation Components** (moving around)
3. **Content Components** (displaying information)
4. **Interactive Components** (user input)
5. **Feedback Components** (validation, progress)

---

## 1. LAYOUT COMPONENTS

### 1.1 Page Layout
**File:** All lesson HTML files
**Structure:**
```html
<body>
  <a class="skip-link">Skip to content</a>
  <nav class="top-nav">...</nav>
  <div class="lesson-layout">
    <aside class="lesson-sidebar">...</aside>
    <main id="main-content">...</main>
  </div>
  <footer>...</footer>
</body>
```

**CSS:**
```css
.lesson-layout {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
}

@media (min-width: 1024px) {
  .lesson-layout {
    grid-template-columns: 280px 1fr;
  }
}
```

**Behavior:**
- Mobile: Single column, sidebar hidden
- Desktop: Two column (sidebar + content)

---

### 1.2 Container
**Class:** `.container`
**Purpose:** Center content, max-width
**CSS:**
```css
.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}
```

---

### 1.3 Grid Systems

**3-Column Grid:**
```css
.grid-3-col {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .grid-3-col {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**2-Column Grid:**
```css
.grid-2-col {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .grid-2-col {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## 2. NAVIGATION COMPONENTS

### 2.1 Top Navigation Bar
**Class:** `.top-nav`
**Height:** 70px fixed
**Background:** White with shadow
**Structure:**
```html
<nav class="top-nav" role="navigation">
  <div class="nav-container">
    <!-- Mobile toggle -->
    <button class="mobile-menu-toggle" aria-label="Toggle menu">
      <i data-lucide="menu"></i>
    </button>

    <!-- Logo -->
    <a href="/" class="nav-logo">
      <i data-lucide="atom"></i>
      <span>Science Hub</span>
    </a>

    <!-- Search (hidden mobile) -->
    <div class="nav-search">
      <input type="search" placeholder="Search lessons...">
    </div>

    <!-- Spacer for balance -->
    <div style="width: 40px;"></div>
  </div>

  <!-- Breadcrumb -->
  <div class="breadcrumb-container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <i data-lucide="chevron-right"></i>
      <a href="/hsc-biology/">HSC Biology</a>
      <i data-lucide="chevron-right"></i>
      <span>Lesson 1</span>
    </nav>
  </div>
</nav>
```

**CSS:**
```css
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: white;
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 2px 8px rgba(147, 228, 249, 0.15);
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-menu-toggle {
  display: flex; /* Hidden on desktop via media query */
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

@media (min-width: 1024px) {
  .mobile-menu-toggle { display: none; }
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
}

.nav-logo svg {
  width: 24px;
  height: 24px;
  color: var(--primary-dark);
}
```

---

### 2.2 Sidebar Navigation
**Class:** `.lesson-sidebar`
**Width:** 280px (fixed desktop)
**Background:** Light blue tint
**Structure:**
```html
<aside class="lesson-sidebar" id="lesson-sidebar">
  <div class="sidebar-header">
    <h3>Module 1: Cells</h3>
    <span>HSC Biology</span>
  </div>

  <div class="sidebar-progress">
    <div class="progress-bar-wrapper">
      <div class="progress-bar-fill" style="width: 0%"></div>
    </div>
    <span class="progress-text">0/30 lessons</span>
  </div>

  <nav class="lesson-list">
    <a href="lesson-1.html" class="lesson-item active" data-lesson="lesson-1">
      <span class="lesson-number">1</span>
      <span class="lesson-title-text">Introduction to Cells</span>
      <svg class="lesson-check"><!-- checkmark --></svg>
    </a>
    <!-- More lessons... -->
  </nav>
</aside>
```

**CSS:**
```css
.lesson-sidebar {
  position: fixed;
  top: 70px;
  left: -100%;
  width: 280px;
  height: calc(100vh - 70px);
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-light);
  overflow-y: auto;
  transition: left 0.3s ease;
  z-index: 90;
  padding: 16px;
}

.lesson-sidebar.open {
  left: 0;
}

@media (min-width: 1024px) {
  .lesson-sidebar {
    position: sticky;
    left: 0;
  }
}

.sidebar-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

.sidebar-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.sidebar-progress {
  margin-bottom: 24px;
}

.progress-bar-wrapper {
  height: 8px;
  background: var(--bg-elevated);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--secondary), var(--secondary-dark));
  border-radius: 9999px;
  transition: width 0.5s ease;
}

.lesson-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lesson-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  transition: all 0.15s ease;
}

.lesson-item:hover {
  background: var(--bg-elevated);
}

.lesson-item.active {
  background: rgba(147, 228, 249, 0.1);
  color: var(--text-primary);
  font-weight: 600;
}

.lesson-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.lesson-item.completed .lesson-check {
  opacity: 1;
  transform: scale(1);
}
```

---

### 2.3 Breadcrumb
**Class:** `.breadcrumb`
**Mobile:** Hidden (show current page only)
**Desktop:** Full path
**Structure:**
```html
<div class="breadcrumb-container">
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <i data-lucide="chevron-right"></i>
    <a href="/hsc-biology/">HSC Biology</a>
    <i data-lucide="chevron-right"></i>
    <span>Lesson 1</span>
  </nav>
</div>
```

---

### 2.4 Lesson Navigation (Prev/Next)
**Class:** `.lesson-navigation`
**Structure:**
```html
<nav class="lesson-navigation">
  <a href="lesson-1.html" class="lesson-nav-btn">
    <i data-lucide="chevron-left"></i>
    <div class="nav-btn-content">
      <span class="nav-btn-label">Previous</span>
      <span class="nav-btn-title">Introduction</span>
    </div>
  </a>

  <a href="index.html" class="lesson-nav-home">
    <i data-lucide="grid-3x3"></i>
    <span>All Lessons</span>
  </a>

  <a href="lesson-3.html" class="lesson-nav-btn">
    <div class="nav-btn-content" style="text-align: right;">
      <span class="nav-btn-label">Next</span>
      <span class="nav-btn-title">Prokaryotic Cells</span>
    </div>
    <i data-lucide="chevron-right"></i>
  </a>
</nav>
```

**CSS:**
```css
.lesson-navigation {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 2px solid var(--border-light);
}

.lesson-nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  transition: all 0.15s ease;
}

.lesson-nav-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(147, 228, 249, 0.2);
}

.nav-btn-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
}

.nav-btn-title {
  font-weight: 600;
  color: var(--text-primary);
}
```

---

## 3. CONTENT COMPONENTS

### 3.1 Hero Section
**Class:** `.lesson-hero`
**Structure:**
```html
<header class="lesson-hero">
  <div class="lesson-hero-badges">
    <span class="badge badge-critical">HSC Biology</span>
    <span class="badge badge-secondary">Module 1</span>
    <span class="badge">Lesson 1</span>
  </div>

  <h1 class="lesson-hero-title">Introduction to Cells</h1>

  <p class="lesson-hero-description">
    Discover the fundamental unit of life...
  </p>

  <div class="lesson-hero-meta">
    <span class="hero-meta-item">
      <i data-lucide="clock"></i>
      <span>45 minutes</span>
    </span>
    <!-- More meta items... -->
  </div>
</header>
```

**CSS:**
```css
.lesson-hero {
  text-align: center;
  padding: 48px 0;
  border-bottom: 2px solid var(--border-light);
  margin-bottom: 48px;
}

.lesson-hero-badges {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  padding: 4px 12px;
  background: var(--bg-elevated);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-critical {
  background: var(--critical);
}

.badge-secondary {
  background: var(--secondary);
}

.lesson-hero-title {
  font-size: clamp(24px, 5vw, 32px);
  font-weight: 800;
  margin-bottom: 16px;
}

.lesson-hero-description {
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 24px;
  line-height: 1.7;
}

.lesson-hero-meta {
  display: flex;
  gap: 24px;
  justify-content: center;
  color: var(--text-muted);
  font-size: 14px;
}
```

---

### 3.2 Card Component
**Class:** `.card`
**Variants:** Default, with header, highlighted
**Structure:**
```html
<div class="card">
  <div class="card-header">
    <div class="icon-wrapper">
      <i data-lucide="target"></i>
    </div>
    <h2 class="card-title">Card Title</h2>
  </div>
  <div class="card-content">
    <!-- Content here -->
  </div>
</div>
```

**CSS:**
```css
.card {
  background: white;
  border-radius: 16px;
  border: 1px solid var(--border-light);
  box-shadow: 0 2px 8px rgba(147, 228, 249, 0.15);
  overflow: hidden;
  transition: all 0.15s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(147, 228, 249, 0.2);
  transform: translateY(-2px);
}

.card-header {
  padding: 16px 20px;
  background: var(--bg-sidebar);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
}

.card-content {
  padding: 20px;
}
```

---

### 3.3 Icon Wrapper
**Class:** `.icon-wrapper`
**Sizes:** sm(32px), md(40px), lg(56px)
**Structure:**
```html
<div class="icon-wrapper">
  <i data-lucide="icon-name"></i>
</div>
```

**CSS:**
```css
.icon-wrapper {
  width: 40px;
  height: 40px;
  background: var(--primary-light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper svg {
  width: 20px;
  height: 20px;
  color: var(--primary-dark);
}

.icon-wrapper-secondary {
  background: var(--secondary-light);
}

.icon-wrapper-secondary svg {
  color: #059669;
}
```

---

### 3.4 Accordion (Details/Summary)
**Class:** `details.card`
**Behavior:** Click to expand/collapse
**Structure:**
```html
<details class="card">
  <summary>
    <div class="icon-wrapper">
      <i data-lucide="book-open"></i>
    </div>
    <span>Click to Expand</span>
  </summary>
  <div class="card-content">
    <!-- Hidden content -->
  </div>
</details>
```

**CSS:**
```css
details.card > summary {
  list-style: none;
  cursor: pointer;
  padding: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

details.card > summary::-webkit-details-marker {
  display: none;
}

details.card > summary::after {
  content: '';
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7fa3' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  transition: transform 0.3s ease;
}

details.card[open] > summary::after {
  transform: rotate(180deg);
}

details.card[open] .card-content {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

### 3.5 Activity Card
**Classes:** `.activity-card`, `.activity-card--teal`, `.activity-card--purple`
**Structure:**
```html
<div class="activity-card activity-card--teal">
  <div class="activity-card-header">
    <i data-lucide="microscope"></i>
    <h3>Activity 1: Title</h3>
  </div>
  <div class="activity-card-body">
    <!-- Activity content -->
  </div>
</div>
```

**CSS:**
```css
.activity-card {
  border-radius: 16px;
  overflow: hidden;
  margin: 32px 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.activity-card--teal {
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  border: 2px solid #99f6e4;
}

.activity-card-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #0d9488;
  color: white;
}

.activity-card-header h3 {
  font-size: 18px;
  font-weight: 700;
}

.activity-card-body {
  padding: 24px;
}
```

---

## 4. INTERACTIVE COMPONENTS

### 4.1 Quiz Options (Radio Buttons)
**Class:** `.quiz-option`
**Behavior:** Styled radio buttons
**Structure:**
```html
<div class="quiz-options">
  <label class="quiz-option">
    <input type="radio" name="q1" value="a">
    <span class="quiz-option-circle"></span>
    <span class="quiz-option-letter">A</span>
    <span class="quiz-option-text">Option text</span>
  </label>
</div>
```

**CSS:**
```css
.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quiz-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-main);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.quiz-option:hover {
  background: var(--bg-elevated);
  border-color: var(--border-light);
}

.quiz-option input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.quiz-option-circle {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-medium);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
  position: relative;
}

.quiz-option input[type="radio"]:checked + .quiz-option-circle {
  border-color: var(--primary-dark);
  background: var(--primary-light);
}

.quiz-option input[type="radio"]:checked + .quiz-option-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: var(--primary-dark);
  border-radius: 50%;
}

.quiz-option.correct {
  background: rgba(74, 222, 128, 0.1);
  border-color: #4ade80;
}

.quiz-option.incorrect {
  background: rgba(248, 113, 113, 0.1);
  border-color: #f87171;
}
```

---

### 4.2 Form Inputs
**Class:** `.modern-input`
**Variants:** default, small
**Structure:**
```html
<input type="text" class="modern-input" placeholder="Type here...">
<input type="text" class="modern-input modern-input--small" maxlength="1">
<textarea class="modern-input" placeholder="Long answer..."></textarea>
```

**CSS:**
```css
.modern-input {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-family: inherit;
  font-size: 16px;
  transition: all 0.15s ease;
}

.modern-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(147, 228, 249, 0.1);
}

.modern-input--small {
  width: 60px;
  text-align: center;
  font-weight: 700;
}
```

---

### 4.3 Buttons
**Primary Button:**
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  color: var(--text-primary);
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(147, 228, 249, 0.3);
  transition: all 0.15s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(147, 228, 249, 0.4);
}
```

**Mark Complete Button:**
```css
.mark-complete-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: white;
  border: 2px solid var(--border-medium);
  border-radius: 9999px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.mark-complete-btn:hover {
  border-color: var(--primary);
  color: var(--text-primary);
}

.mark-complete-btn.completed {
  background: var(--success);
  border-color: var(--success-dark);
  color: white;
}
```

---

## 5. FEEDBACK COMPONENTS

### 5.1 Progress Bar
**Classes:** `.progress-bar-wrapper`, `.progress-bar-fill`
**See:** Sidebar component above

**Animation:**
```javascript
// Animate width from 0 to target
element.style.width = targetPercentage + '%';
```

---

### 5.2 Completion Checkmark
**Class:** `.lesson-check`
**Appears:** Next to lesson title when completed
**Animation:** Scale from 0 to 1 with bounce
**CSS:**
```css
.lesson-check {
  width: 16px;
  height: 16px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.lesson-item.completed .lesson-check {
  opacity: 1;
  transform: scale(1);
}
```

---

## Component Checklist (ALL VERIFIED)

All Phase 00 components are implemented and working:

- [x] Top navigation works on mobile/desktop
- [x] Sidebar toggles correctly
- [x] Cards have hover effects
- [x] Accordions expand/collapse smoothly
- [x] Quiz options show selected state
- [x] Buttons have hover/active states
- [x] Form inputs focus correctly
- [x] Progress bar animates
- [x] Completion checkmarks appear
- [x] All components work at 375px width

---

## 6. GAMIFICATION COMPONENTS (Phase 02 — Built Ahead of Schedule)

The following components were built beyond the original Phase 00 spec. See the dedicated CSS/JS files for full implementation details.

### 6.1 XP Widget
**Files:** `xp.css`, `xp.js`
**Features:** Level display, XP progress bar with shimmer, XP gain notifications, level-up modal

### 6.2 Streak Widget
**Files:** `streak.css`, `streak.js`
**Features:** Flame animation, 7-day mini calendar, milestone progress, celebration modal with confetti

### 6.3 Achievement System
**Files:** `achievements.css`, `achievements.js`
**Features:** Badge cards (locked/unlocked), 4 rarity tiers (common/uncommon/rare/epic), glow effects, notification popup

### 6.4 Mini-Games
**Files:** `minigames.css`, `minigames.js`
**Game Types:**
- Drag & Drop — diagram workspace, drop zones, draggable labels
- Flashcards — 3D flip animation, front/back design
- Matching Pairs — grid layout, flip animation, matched states
- Sequence Ordering — draggable list items, numbered circles
**Common:** Game launcher cards, feedback messages, score display, action buttons

### 6.5 Interactive Diagrams
**Files:** `diagrams.css`, `diagrams.js`
**Features:** Hotspot buttons with pulse animation, info panels, image lightbox with zoom, glossary tooltips, comparison layouts, animated particles (diffusion)

### 6.6 Progress Dashboard
**Files:** `dashboard.css`, `dashboard.js`
**Features:** Quick stats cards, module progress list, activity chart, recent achievements, skills radar, recommendations, goals tracking

---

**END OF COMPONENT LIBRARY**

**Next:** See `Quality-Assurance.md` for testing checklist, or `Phase-01-Research/5E-CLT-Pedagogical-Framework.md` for lesson design
