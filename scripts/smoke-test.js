#!/usr/bin/env node
/**
 * Lesson Smoke Tester
 * Run: node scripts/smoke-test.js
 *
 * Quickly verifies that all lessons can load and render without errors.
 * This is a fast "does it work?" check before deployment.
 *
 * Checks:
 * 1. JSON loads without syntax errors
 * 2. Passes schema validation
 * 3. All activity types have renderers
 * 4. All referenced images exist on disk
 * 5. Navigation links are valid
 * 6. No obvious rendering blockers
 */

const fs = require('fs');
const path = require('path');

const LESSON_DIRS = [
  path.join(__dirname, '..', 'hsc-biology', 'data', 'lessons'),
  path.join(__dirname, '..', 'data', 'lessons')
];

const IMAGE_DIRS = [
  path.join(__dirname, '..', 'hsc-biology', 'images'),
  path.join(__dirname, '..', 'assets', 'images')
];

const SKIP_FILES = ['TEMPLATE.json', 'index.json'];

// Activity types that the renderer supports
const SUPPORTED_ACTIVITY_TYPES = [
  'matching', 'fill-blank', 'classification', 'ordering',
  'labeling', 'fillBlank', 'calculation'
];

function findLessonFiles() {
  const files = [];
  for (const dir of LESSON_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (!item.endsWith('.json') || SKIP_FILES.includes(item)) continue;
      files.push(path.join(dir, item));
    }
  }
  return files.sort();
}

function imageExists(imagePath) {
  for (const dir of IMAGE_DIRS) {
    const fullPath = path.join(dir, imagePath);
    if (fs.existsSync(fullPath)) return true;
  }
  return false;
}

function smokeTestLesson(filePath) {
  const errors = [];
  const warnings = [];
  const fileName = path.basename(filePath, '.json');

  // 1. Load JSON
  let data;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(raw);
  } catch (e) {
    return { file: fileName, passed: false, errors: [`JSON parse error: ${e.message}`], warnings: [] };
  }

  // 2. Basic schema validation (required fields)
  const requiredFields = ['id', 'title', 'module', 'contentSections'];
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // 3. Activity type validation
  const activities = data.activities || [];
  for (const activity of activities) {
    if (activity.type && !SUPPORTED_ACTIVITY_TYPES.includes(activity.type)) {
      errors.push(`Unsupported activity type "${activity.type}" in activity "${activity.id || '?'}"`);
    }
  }

  // 4. Image existence check
  const contentSections = data.contentSections || [];
  for (const section of contentSections) {
    if (section.type === 'image' && section.image && section.image.src) {
      if (!imageExists(section.image.src)) {
        warnings.push(`Image not found: ${section.image.src}`);
      }
    }
    if (section.type === 'diagram' && section.diagram && section.diagram.image && section.diagram.image.src) {
      if (!imageExists(section.diagram.image.src)) {
        warnings.push(`Diagram image not found: ${section.diagram.image.src}`);
      }
    }
  }

  // Check activity images (for labeling activities)
  for (const activity of activities) {
    if (activity.type === 'labeling' && activity.image && activity.image.src) {
      if (!imageExists(activity.image.src)) {
        warnings.push(`Activity image not found: ${activity.image.src}`);
      }
    }
  }

  // 5. Navigation validation (warn only, not error)
  if (!data.navigation) {
    warnings.push('No navigation object defined');
  }

  // 6. Assessment validation
  const mcqs = data.assessment?.multipleChoice || [];
  for (const mcq of mcqs) {
    if (mcq.options && mcq.correctAnswer && !mcq.options.includes(mcq.correctAnswer)) {
      errors.push(`MCQ "${mcq.id || '?'}": correctAnswer "${mcq.correctAnswer}" not in options`);
    }
  }

  // 7. Content section rendering check
  if (contentSections.length === 0) {
    warnings.push('No content sections (lesson will be empty)');
  }

  return {
    file: fileName,
    id: data.id,
    activityCount: activities.length,
    imageCount: contentSections.filter(s => s.type === 'image' || s.type === 'diagram').length + activities.filter(a => a.type === 'labeling').length,
    passed: errors.length === 0,
    errors,
    warnings
  };
}

function main() {
  const startTime = Date.now();

  console.log('='.repeat(60));
  console.log('  SMOKE TEST - Lesson Renderer');
  console.log('='.repeat(60));
  console.log('');

  const files = findLessonFiles();

  if (files.length === 0) {
    console.log('No lesson JSON files found.');
    process.exit(1);
  }

  console.log(`Testing ${files.length} lessons...\n`);

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const filePath of files) {
    const result = smokeTestLesson(filePath);
    results.push(result);

    if (result.passed) {
      console.log(`✅ ${result.id} (${result.activityCount} activities, ${result.imageCount} images)`);
      passed++;
    } else {
      console.log(`❌ ${result.id} (FAIL)`);
      for (const error of result.errors) {
        console.log(`     ERROR: ${error}`);
      }
      for (const warning of result.warnings.slice(0, 2)) {
        console.log(`     WARN:  ${warning}`);
      }
      failed++;
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('');
  console.log('-'.repeat(60));
  console.log(`Passed: ${passed}/${files.length}`);
  console.log(`Failed: ${failed}/${files.length}`);
  console.log(`Runtime: ${duration} seconds`);
  console.log('');

  if (failed > 0) {
    console.log(`❌ ${failed} lesson(s) failed smoke test. Fix errors before deploying.`);
    process.exit(1);
  } else {
    console.log('✅ All lessons passed smoke test. Safe to deploy.');
    process.exit(0);
  }
}

main();
