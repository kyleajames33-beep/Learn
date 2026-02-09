#!/usr/bin/env node
/**
 * Page Structure Validator
 * Run: node scripts/validate-pages.js
 * 
 * Checks all HTML files for:
 * - Required CSS files
 * - Required JS files
 * - Proper meta tags
 * - Path consistency
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_CSS = [
  'global.css',
  'layout.css', 
  'components.css'
];

const REQUIRED_JS = [
  'main.js'
];

const EXCLUDED_PATHS = [
  'node_modules',
  '.git',
  'scripts',
  'docs'
];

function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !EXCLUDED_PATHS.includes(item)) {
      findHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function validateHtml(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Check required CSS
  for (const css of REQUIRED_CSS) {
    if (!content.includes(css)) {
      issues.push(`Missing CSS: ${css}`);
    }
  }
  
  // Check required JS
  for (const js of REQUIRED_JS) {
    if (!content.includes(js)) {
      issues.push(`Missing JS: ${js}`);
    }
  }
  
  // Check for absolute paths that might break on GitHub Pages
  const absolutePathRegex = /href="\/[^"]*"|src="\/[^"]*"/g;
  const matches = content.match(absolutePathRegex);
  if (matches) {
    issues.push(`Absolute paths found: ${matches.slice(0, 3).join(', ')}${matches.length > 3 ? '...' : ''}`);
  }
  
  // Check viewport meta
  if (!content.includes('viewport')) {
    issues.push('Missing viewport meta tag');
  }
  
  // Check charset
  if (!content.includes('charset="UTF-8"') && !content.includes("charset='UTF-8'")) {
    issues.push('Missing charset declaration');
  }
  
  return { file: relativePath, issues };
}

function main() {
  console.log('🔍 Validating HTML pages...\n');
  
  const htmlFiles = findHtmlFiles('.');
  let errorCount = 0;
  
  for (const file of htmlFiles) {
    const result = validateHtml(file);
    
    if (result.issues.length > 0) {
      console.log(`❌ ${result.file}`);
      for (const issue of result.issues) {
        console.log(`   - ${issue}`);
      }
      console.log('');
      errorCount += result.issues.length;
    } else {
      console.log(`✅ ${result.file}`);
    }
  }
  
  console.log(`\n${errorCount === 0 ? '✅ All checks passed!' : `❌ ${errorCount} issues found`}`);
  process.exit(errorCount > 0 ? 1 : 0);
}

main();
