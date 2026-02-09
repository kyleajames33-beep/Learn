# Science Learning Hub - Architecture Guide

## CSS Architecture

### Core Files (Required on ALL pages)
| File | Purpose | Always Include? |
|------|---------|-----------------|
| `global.css` | Variables, base styles, utilities | ✅ Yes |
| `layout.css` | Grid systems, sidebar, responsive | ✅ Yes |
| `components.css` | Buttons, cards, forms | ✅ Yes |

### Feature Files (Include as needed)
| File | Purpose | Include When... |
|------|---------|-----------------|
| `streak.css` | Streak UI | Using streak features |
| `xp.css` | XP/progress bars | Using XP system |
| `achievements.css` | Achievement badges | Showing achievements |
| `diagrams.css` | Interactive diagrams | Page has diagrams |
| `loading-states.css` | Loading spinners | Page has async loading |
| `activities.css` | Activity components | Lesson has activities |
| `simulations.css` | Slider/simulator UI | Interactive simulations |

## JS Architecture

### Core Files (Required on ALL pages)
| File | Purpose |
|------|---------|
| `main.js` | Service worker, navigation, init |

### Feature Files (Include as needed)
| File | Purpose |
|------|---------|
| `lesson-renderer.js` | Lesson content rendering |
| `lesson-data-schema.js` | Lesson data validation |
| `streak.js` | Streak tracking |
| `xp.js` | XP tracking |
| `achievements.js` | Achievement system |

## Path Guidelines

### ✅ CORRECT: Relative Paths
```html
<!-- From hsc-biology/lesson.html -->
<link rel="stylesheet" href="../assets/css/global.css">
<a href="../index.html">Home</a>
```

### ❌ WRONG: Absolute Paths
```html
<!-- Breaks on GitHub Pages subdirectory -->
<link rel="stylesheet" href="/assets/css/global.css">
<a href="/index.html">Home</a>
```

### Exception: External URLs
```html
<!-- External URLs are fine -->
<script src="https://unpkg.com/lucide@latest"></script>
```

## Page Type Templates

### 1. Landing Page (index.html)
```html
<head>
  <link rel="stylesheet" href="./assets/css/global.css">
  <link rel="stylesheet" href="./assets/css/layout.css">
  <link rel="stylesheet" href="./assets/css/components.css">
</head>
<body>
  <!-- content -->
  <script src="./assets/js/main.js"></script>
</body>
```

### 2. Subject Page (hsc-biology/index.html)
```html
<head>
  <link rel="stylesheet" href="../assets/css/global.css">
  <link rel="stylesheet" href="../assets/css/layout.css">
  <link rel="stylesheet" href="../assets/css/components.css">
</head>
<body>
  <!-- content -->
  <script src="../assets/js/main.js"></script>
</body>
```

### 3. Lesson Page (hsc-biology/lesson.html)
```html
<head>
  <link rel="stylesheet" href="../assets/css/global.css">
  <link rel="stylesheet" href="../assets/css/layout.css">
  <link rel="stylesheet" href="../assets/css/components.css">
  <link rel="stylesheet" href="../assets/css/diagrams.css">
  <script src="js/lesson-data-schema.js"></script>
  <script src="js/lesson-renderer.js"></script>
</head>
<body>
  <!-- content -->
  <script src="../assets/js/main.js"></script>
</body>
```

## Validation Checklist

Before committing changes:
- [ ] Run `node scripts/validate-pages.js`
- [ ] Test on GitHub Pages URL (with `/Learn/` subdirectory)
- [ ] Check all links work
- [ ] Verify CSS loads (no 404s in Network tab)
- [ ] Verify JS loads (no console errors)
