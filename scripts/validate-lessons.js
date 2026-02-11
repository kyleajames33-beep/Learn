#!/usr/bin/env node
/**
 * Lesson JSON Validator
 * Run: node scripts/validate-lessons.js
 *
 * Validates all lesson JSON files against the schema defined in
 * hsc-biology/js/lesson-data-schema.js
 *
 * Checks:
 * - Valid JSON syntax
 * - Required fields present (id, title, module, etc.)
 * - Field types correct (string, number, array, etc.)
 * - ID format matches pattern
 * - Content quality (activity count, assessment questions, etc.)
 * - Navigation chain consistency (prev/next links)
 */

const fs = require('fs');
const path = require('path');

// Import the schema
const { LessonSchema } = require('../hsc-biology/js/lesson-data-schema.js');

// Directories to scan
const LESSON_DIRS = [
  path.join(__dirname, '..', 'hsc-biology', 'data', 'lessons'),
  path.join(__dirname, '..', 'data', 'lessons')
];

// Files to skip
const SKIP_FILES = ['TEMPLATE.json', 'index.json'];

// Supported activity types in the renderer (V1 + V2)
const SUPPORTED_ACTIVITY_TYPES = [
  'matching', 'fill-blank', 'classification', 'ordering',
  'labeling', 'fillBlank', 'calculation',
  'problemSolving', 'comparison-table', 'interactive-slider',
  'tonicity-simulator', 'multiple-choice'
];

// American spellings to flag
const AMERICAN_SPELLINGS = [
  { wrong: /\bspecialized\b/gi, correct: 'specialised' },
  { wrong: /\bbehavior\b/gi, correct: 'behaviour' },
  { wrong: /\bcolor\b/gi, correct: 'colour' },
  { wrong: /\bcenter\b/gi, correct: 'centre' },
  { wrong: /\banalyze\b/gi, correct: 'analyse' },
  { wrong: /\bfiber\b/gi, correct: 'fibre' },
  { wrong: /\bhemoglobin\b/gi, correct: 'haemoglobin' },
  { wrong: /\borganize\b/gi, correct: 'organise' },
  { wrong: /\brecognize\b/gi, correct: 'recognise' },
  { wrong: /\blabeled\b/gi, correct: 'labelled' },
  { wrong: /\bmodeling\b/gi, correct: 'modelling' },
  { wrong: /\bfavor\b/gi, correct: 'favour' },
  { wrong: /\bhonor\b/gi, correct: 'honour' },
  { wrong: /\btumor\b/gi, correct: 'tumour' },
  { wrong: /\bdefense\b/gi, correct: 'defence' },
  { wrong: /\boffense\b/gi, correct: 'offence' },
  { wrong: /\bfetus\b/gi, correct: 'foetus' },
  { wrong: /\bestrogen\b/gi, correct: 'oestrogen' },
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

  return files;
}

function validateLessonContent(data, filePath) {
  const warnings = [];
  const errors = [];
  const fileName = path.basename(filePath);
  const isV2 = data.v2 === true || data.version === 2 || data.version === '2.0' || !!data.contentHTML;

  // 1. Schema validation
  const schemaResult = LessonSchema.validate(data);
  if (!schemaResult.valid) {
    errors.push(...schemaResult.errors.map(e => `Schema: ${e}`));
  }

  // 2. Activity count check (V2 embeds activities in assessment)
  const activities = data.activities || [];
  if (!isV2 && activities.length < 2) {
    warnings.push(`Content: Only ${activities.length} activities (minimum 2 recommended)`);
  }

  // 3. Activity type support check
  for (const activity of activities) {
    if (activity.type && !SUPPORTED_ACTIVITY_TYPES.includes(activity.type)) {
      errors.push(`Activity "${activity.id || '?'}": type "${activity.type}" is not supported by the renderer`);
    }
  }

  // 4. Activity type diversity check
  if (!isV2) {
    const activityTypes = new Set(activities.map(a => a.type));
    if (activities.length >= 2 && activityTypes.size < 2) {
      warnings.push(`Content: All ${activities.length} activities are the same type "${[...activityTypes][0]}" (recommend 2+ distinct types)`);
    }
  }

  // 5. Assessment check (support both field names)
  const mcqs = data.assessment?.multipleChoice || data.assessment?.mcq || [];
  const saqs = data.assessment?.shortAnswer || data.assessment?.saq || [];
  if (mcqs.length < 3) {
    warnings.push(`Assessment: Only ${mcqs.length} MCQs (recommend 3)`);
  }
  if (!isV2 && saqs.length < 2) {
    warnings.push(`Assessment: Only ${saqs.length} short answer questions (recommend 2)`);
  }

  // 6. MCQ validation (support correctAnswer text or correct index)
  for (const mcq of mcqs) {
    if (mcq.options && mcq.correctAnswer) {
      if (!mcq.options.includes(mcq.correctAnswer)) {
        errors.push(`MCQ "${mcq.id || '?'}": correctAnswer "${mcq.correctAnswer}" is not in options list`);
      }
    }
    if (mcq.options && mcq.correct !== undefined) {
      if (mcq.correct < 0 || mcq.correct >= mcq.options.length) {
        errors.push(`MCQ "${mcq.id || '?'}": correct index ${mcq.correct} is out of range (0-${mcq.options.length - 1})`);
      }
    }
    if (mcq.options && mcq.options.length < 4) {
      warnings.push(`MCQ "${mcq.id || '?'}": Only ${mcq.options.length} options (recommend 4)`);
    }
  }

  // 7. Copy to book check (V1 only — V2 uses contentHTML)
  if (!isV2) {
    const definitions = data.copyToBook?.definitions || [];
    if (definitions.length < 5) {
      warnings.push(`CopyToBook: Only ${definitions.length} definitions (recommend 5)`);
    }
  }

  // 8. Engagement hook check (V1 only — V2 embeds hooks in contentHTML)
  if (!isV2 && (!data.engagementHook || !data.engagementHook.content)) {
    warnings.push('Content: Missing engagement hook');
  }

  // 9. Navigation check
  if (!data.navigation) {
    warnings.push('Navigation: Missing navigation object (prev/next links)');
  }

  // 10. Content sections check (V1 only — V2 uses contentHTML)
  if (!isV2) {
    const sections = data.contentSections || [];
    if (sections.length < 2) {
      warnings.push(`Content: Only ${sections.length} content sections (recommend 2+)`);
    }
  }

  // 11. V2-specific: contentHTML must be non-empty
  if (isV2 && (!data.contentHTML || data.contentHTML.trim().length < 100)) {
    warnings.push('V2 Content: contentHTML is missing or very short');
  }

  // 12. Australian spelling check (search all string values)
  const jsonText = JSON.stringify(data);
  for (const spelling of AMERICAN_SPELLINGS) {
    const matches = jsonText.match(spelling.wrong);
    if (matches) {
      errors.push(`Spelling: Found "${matches[0]}" — should be "${spelling.correct}" (Australian English)`);
    }
  }

  return { errors, warnings };
}

function validateNavigationChain(lessons) {
  const errors = [];
  const lessonMap = new Map();

  // Build a map of lesson ID -> data
  for (const { data, file } of lessons) {
    lessonMap.set(data.id, { data, file });
  }

  // Check navigation links
  for (const { data, file } of lessons) {
    const nav = data.navigation;
    if (!nav) continue;

    if (nav.next && !lessonMap.has(nav.next)) {
      errors.push(`${data.id}: navigation.next points to "${nav.next}" which doesn't exist`);
    }
    if (nav.previous && !lessonMap.has(nav.previous)) {
      errors.push(`${data.id}: navigation.previous points to "${nav.previous}" which doesn't exist`);
    }
  }

  return errors;
}

function main() {
  console.log('Validating lesson JSON files...\n');

  const files = findLessonFiles();

  if (files.length === 0) {
    console.log('No lesson JSON files found.');
    process.exit(1);
  }

  let totalErrors = 0;
  let totalWarnings = 0;
  let validCount = 0;
  const allLessons = [];
  const results = [];

  // Track unique lesson IDs to detect duplicates across directories
  const seenIds = new Map();

  for (const filePath of files) {
    const relativePath = path.relative(process.cwd(), filePath);
    const fileName = path.basename(filePath);

    // Parse JSON
    let data;
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(raw);
    } catch (e) {
      results.push({ file: relativePath, errors: [`JSON parse error: ${e.message}`], warnings: [] });
      totalErrors++;
      continue;
    }

    // Check for duplicate IDs
    if (data.id && seenIds.has(data.id)) {
      // Only flag if in same directory (cross-directory duplicates are expected)
      const existingDir = path.dirname(seenIds.get(data.id));
      const thisDir = path.dirname(filePath);
      if (existingDir === thisDir) {
        results.push({ file: relativePath, errors: [`Duplicate ID: "${data.id}" also in ${path.relative(process.cwd(), seenIds.get(data.id))}`], warnings: [] });
        totalErrors++;
      }
    }
    seenIds.set(data.id, filePath);

    // Validate content
    const { errors, warnings } = validateLessonContent(data, filePath);
    allLessons.push({ data, file: filePath });

    totalErrors += errors.length;
    totalWarnings += warnings.length;

    if (errors.length === 0) {
      validCount++;
    }

    results.push({ file: relativePath, errors, warnings });
  }

  // Validate navigation chain (per directory)
  const dirGroups = new Map();
  for (const lesson of allLessons) {
    const dir = path.dirname(lesson.file);
    if (!dirGroups.has(dir)) dirGroups.set(dir, []);
    dirGroups.get(dir).push(lesson);
  }

  const navErrors = [];
  for (const [dir, lessons] of dirGroups) {
    navErrors.push(...validateNavigationChain(lessons));
  }

  // Print results
  for (const result of results) {
    if (result.errors.length > 0) {
      console.log(`FAIL  ${result.file}`);
      for (const err of result.errors) {
        console.log(`  ERROR: ${err}`);
      }
      for (const warn of result.warnings) {
        console.log(`  WARN:  ${warn}`);
      }
      console.log('');
    } else if (result.warnings.length > 0) {
      console.log(`WARN  ${result.file}`);
      for (const warn of result.warnings) {
        console.log(`  WARN:  ${warn}`);
      }
      console.log('');
    } else {
      console.log(`PASS  ${result.file}`);
    }
  }

  // Print navigation errors
  if (navErrors.length > 0) {
    console.log('\nNavigation Chain Issues:');
    for (const err of navErrors) {
      console.log(`  ERROR: ${err}`);
    }
    totalErrors += navErrors.length;
  }

  // Summary
  console.log('\n---');
  console.log(`Files scanned: ${files.length}`);
  console.log(`Valid:         ${validCount}/${files.length}`);
  console.log(`Errors:        ${totalErrors}`);
  console.log(`Warnings:      ${totalWarnings}`);
  console.log('');

  if (totalErrors === 0) {
    console.log('All lesson files passed validation.');
  } else {
    console.log(`${totalErrors} error(s) found. Fix errors before deploying.`);
  }

  process.exit(totalErrors > 0 ? 1 : 0);
}

main();
