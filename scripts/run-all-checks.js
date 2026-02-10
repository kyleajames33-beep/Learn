#!/usr/bin/env node
/**
 * Master Test Runner - Science Hub
 * Run: node scripts/run-all-checks.js
 *
 * Runs ALL validation scripts and produces a unified pass/fail report.
 * This is the MANDATORY verification step before any commit or deployment.
 *
 * Exit codes:
 *   0 = All checks passed
 *   1 = One or more checks failed
 */

const { execSync } = require('child_process');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname);

const CHECKS = [
  {
    name: 'Smoke Test',
    script: 'smoke-test.js',
    description: 'Quick verification that all lessons load and render without errors'
  },
  {
    name: 'HTML Page Structure',
    script: 'validate-pages.js',
    description: 'Checks all HTML files for required CSS/JS, meta tags, absolute paths'
  },
  {
    name: 'Lesson JSON Validation',
    script: 'validate-lessons.js',
    description: 'Validates lesson JSON against schema, checks content quality, navigation chain'
  },
  {
    name: 'Australian English Spelling',
    script: 'validate-spelling.js',
    description: 'Scans lesson content for American English spellings'
  },
  {
    name: 'Quality Scoring',
    script: 'score-lessons.js',
    description: 'Scores each lesson on quality metrics and detects regression'
  }
];

function runCheck(check) {
  const scriptPath = path.join(SCRIPTS_DIR, check.script);
  const startTime = Date.now();

  try {
    const output = execSync(`node "${scriptPath}"`, {
      encoding: 'utf-8',
      timeout: 30000,
      cwd: path.join(__dirname, '..')
    });
    const duration = Date.now() - startTime;
    return { name: check.name, passed: true, output, duration };
  } catch (err) {
    const duration = Date.now() - startTime;
    // execSync throws on non-zero exit code
    const output = err.stdout || err.message;
    return { name: check.name, passed: false, output, duration };
  }
}

function main() {
  console.log('='.repeat(60));
  console.log('  SCIENCE HUB - VERIFICATION SUITE');
  console.log('='.repeat(60));
  console.log('');

  const results = [];

  for (const check of CHECKS) {
    console.log(`Running: ${check.name}...`);
    console.log(`  (${check.description})`);
    console.log('');

    const result = runCheck(check);
    results.push(result);

    // Print the output indented
    const lines = result.output.trim().split('\n');
    for (const line of lines) {
      console.log(`  ${line}`);
    }
    console.log('');
    console.log(`  Result: ${result.passed ? 'PASSED' : 'FAILED'} (${result.duration}ms)`);
    console.log('-'.repeat(60));
    console.log('');
  }

  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('='.repeat(60));
  console.log('  SUMMARY');
  console.log('='.repeat(60));
  console.log('');

  for (const result of results) {
    const icon = result.passed ? 'PASS' : 'FAIL';
    console.log(`  [${icon}] ${result.name} (${result.duration}ms)`);
  }

  console.log('');
  console.log(`  Total: ${passed} passed, ${failed} failed out of ${results.length} checks`);
  console.log('');

  if (failed === 0) {
    console.log('  All checks passed. Safe to commit/deploy.');
  } else {
    console.log('  BLOCKED: Fix failures before committing.');
    console.log('  Run individual scripts for detailed output:');
    for (const result of results) {
      if (!result.passed) {
        const check = CHECKS.find(c => c.name === result.name);
        console.log(`    node scripts/${check.script}`);
      }
    }
  }

  console.log('');
  process.exit(failed > 0 ? 1 : 0);
}

main();
