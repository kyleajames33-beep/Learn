#!/usr/bin/env node
/**
 * Cache-Busting Version Bumper
 * Run: node scripts/bump-versions.js
 *
 * Scans all HTML files and adds/updates ?v= cache-busting parameters
 * on all local CSS and JS references. Uses a Unix timestamp so every
 * run produces a unique version that forces browsers to fetch fresh files.
 *
 * This script should be run BEFORE every commit that changes CSS or JS files.
 * It is part of the mandatory pre-commit verification workflow.
 *
 * What it does:
 * - Finds all <link href="...css"> and <script src="...js"> tags
 * - Skips external URLs (https://, http://)
 * - Adds ?v=TIMESTAMP if no version param exists
 * - Updates existing ?v=XXX to ?v=TIMESTAMP
 * - Reports what was changed
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const VERSION = Math.floor(Date.now() / 1000).toString();

const EXCLUDED_DIRS = ['node_modules', '.git', 'scripts', 'docs'];

function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !EXCLUDED_DIRS.includes(item)) {
      findHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function bumpVersionsInFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf-8');
  let content = original;
  let changes = 0;

  // Match <link ... href="...css..."> — local CSS files
  // Handles: href="path/file.css" or href="path/file.css?v=123"
  content = content.replace(
    /(<link\b[^>]*\bhref=["'])([^"']+\.css)(\?v=[^"']*)?(?=["'])/gi,
    (match, prefix, cssPath, existingVersion) => {
      // Skip external URLs
      if (cssPath.startsWith('http://') || cssPath.startsWith('https://')) {
        return match;
      }
      changes++;
      return `${prefix}${cssPath}?v=${VERSION}`;
    }
  );

  // Match <script ... src="...js..."> — local JS files
  // Handles: src="path/file.js" or src="path/file.js?v=123"
  content = content.replace(
    /(<script\b[^>]*\bsrc=["'])([^"']+\.js)(\?v=[^"']*)?(?=["'])/gi,
    (match, prefix, jsPath, existingVersion) => {
      // Skip external URLs
      if (jsPath.startsWith('http://') || jsPath.startsWith('https://')) {
        return match;
      }
      changes++;
      return `${prefix}${jsPath}?v=${VERSION}`;
    }
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  return changes;
}

function main() {
  console.log(`Cache-busting version bump: v=${VERSION}\n`);

  const files = findHtmlFiles(PROJECT_ROOT);
  let totalChanges = 0;
  let filesModified = 0;

  for (const filePath of files) {
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    const changes = bumpVersionsInFile(filePath);

    if (changes > 0) {
      console.log(`  UPDATED  ${relativePath} (${changes} references)`);
      totalChanges += changes;
      filesModified++;
    } else {
      console.log(`  SKIP     ${relativePath} (no local CSS/JS)`);
    }
  }

  console.log('\n---');
  console.log(`Version:        v=${VERSION}`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`References:     ${totalChanges}`);
  console.log('');

  if (totalChanges > 0) {
    console.log('Cache-busting versions updated. Commit these changes.');
  } else {
    console.log('No local CSS/JS references found to update.');
  }
}

main();
