#!/usr/bin/env node
/**
 * Error Log Reader
 * Run: node scripts/read-errors.js
 *
 * Reads error logs from localStorage (via manual paste).
 *
 * USAGE:
 * 1. Open browser DevTools Console on the lesson page
 * 2. Run: copy(JSON.stringify(localStorage.getItem('science-hub-errors')))
 * 3. Paste the output into errors.json in this directory
 * 4. Run: node scripts/read-errors.js
 *
 * Alternatively, pipe errors directly:
 * echo '<pasted-json>' | node scripts/read-errors.js --stdin
 */

const fs = require('fs');
const path = require('path');

const ERRORS_FILE = path.join(__dirname, 'errors.json');

function parseErrors(jsonString) {
  try {
    // Handle double-stringified JSON (from localStorage.getItem)
    let data = JSON.parse(jsonString);
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Failed to parse error JSON:', e.message);
    return [];
  }
}

function groupByLesson(errors) {
  const grouped = {};
  for (const error of errors) {
    const lessonId = error.lessonId || 'unknown';
    if (!grouped[lessonId]) {
      grouped[lessonId] = [];
    }
    grouped[lessonId].push(error);
  }
  return grouped;
}

function formatError(error, index) {
  const time = new Date(error.timestamp).toLocaleString();
  const browser = error.browser ? error.browser.browser : 'Unknown';

  console.log(`\n  [${index + 1}] ${error.type.toUpperCase()} at ${time}`);
  console.log(`      Browser: ${browser}`);
  console.log(`      Message: ${error.message}`);

  if (error.filename) {
    console.log(`      Location: ${error.filename}:${error.line}:${error.column}`);
  }

  if (error.stack) {
    const stackLines = error.stack.split('\n').slice(0, 3);
    console.log(`      Stack:`);
    for (const line of stackLines) {
      console.log(`        ${line.trim()}`);
    }
  }

  if (error.context) {
    console.log(`      Context: ${JSON.stringify(error.context)}`);
  }
}

function main() {
  console.log('='.repeat(60));
  console.log('  ERROR LOG ANALYSIS');
  console.log('='.repeat(60));
  console.log('');

  // Check for stdin
  const args = process.argv.slice(2);
  let jsonString;

  if (args.includes('--stdin')) {
    // Read from stdin
    const stdin = fs.readFileSync(0, 'utf-8');
    jsonString = stdin.trim();
  } else if (fs.existsSync(ERRORS_FILE)) {
    // Read from errors.json
    jsonString = fs.readFileSync(ERRORS_FILE, 'utf-8').trim();
  } else {
    console.log('No error data found.\n');
    console.log('To export errors from browser:');
    console.log('1. Open DevTools Console on any lesson page');
    console.log('2. Run: copy(JSON.stringify(localStorage.getItem("science-hub-errors")))');
    console.log('3. Save the clipboard content to scripts/errors.json');
    console.log('4. Run this script again\n');
    console.log('Or pipe directly:');
    console.log('echo \'<pasted-json>\' | node scripts/read-errors.js --stdin');
    process.exit(1);
  }

  const errors = parseErrors(jsonString);

  if (errors.length === 0) {
    console.log('✅ No errors logged. Your lessons are clean!');
    console.log('');
    process.exit(0);
  }

  console.log(`Total Errors Logged: ${errors.length}\n`);

  // Group by lesson
  const byLesson = groupByLesson(errors);
  const lessonIds = Object.keys(byLesson).sort();

  for (const lessonId of lessonIds) {
    const lessonErrors = byLesson[lessonId];
    console.log(`━━━ Lesson: ${lessonId} (${lessonErrors.length} errors) ━━━`);

    for (let i = 0; i < Math.min(lessonErrors.length, 5); i++) {
      formatError(lessonErrors[i], i);
    }

    if (lessonErrors.length > 5) {
      console.log(`\n  ... and ${lessonErrors.length - 5} more errors`);
    }

    console.log('');
  }

  // Error type summary
  const errorTypes = {};
  for (const error of errors) {
    errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
  }

  console.log('-'.repeat(60));
  console.log('Error Types:');
  for (const [type, count] of Object.entries(errorTypes)) {
    console.log(`  ${type}: ${count}`);
  }

  console.log('');
  console.log(`⚠️  Found ${errors.length} error(s) across ${lessonIds.length} lesson(s)`);
  console.log('');

  process.exit(1);
}

main();
