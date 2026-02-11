#!/usr/bin/env node
/**
 * CSS Variable Validator
 * Run: node scripts/validate-css.js
 *
 * Validates that all CSS custom properties used in stylesheets
 * are actually defined in global.css :root.
 *
 * Prevents runtime errors where var(--undefined) silently falls
 * back to browser defaults, making the entire site look unstyled.
 */

const fs = require('fs');
const path = require('path');

const CSS_DIR = path.join(__dirname, '..', 'assets', 'css');
const GLOBAL_CSS = path.join(CSS_DIR, 'global.css');

// Extract all defined variables from global.css :root
function getDefinedVariables() {
  const content = fs.readFileSync(GLOBAL_CSS, 'utf-8');
  const defined = new Set();

  // Match :root { ... } block
  const rootMatch = content.match(/:root\s*\{([^}]+)\}/s);
  if (!rootMatch) {
    console.error('ERROR: Could not find :root block in global.css');
    process.exit(1);
  }

  const rootBlock = rootMatch[1];

  // Match all --variable-name declarations
  const varMatches = rootBlock.matchAll(/--([a-z0-9-]+)\s*:/g);
  for (const match of varMatches) {
    defined.add(`--${match[1]}`);
  }

  return defined;
}

// Extract all used variables from a CSS file
function getUsedVariables(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const used = new Set();

  // Match var(--variable-name)
  const varMatches = content.matchAll(/var\((--[a-z0-9-]+)/g);
  for (const match of varMatches) {
    used.add(match[1]);
  }

  return used;
}

function main() {
  console.log('CSS Variable Validator\n');

  const defined = getDefinedVariables();
  console.log(`Defined in global.css: ${defined.size} variables\n`);

  const cssFiles = fs.readdirSync(CSS_DIR)
    .filter(f => f.endsWith('.css') && f !== 'global.css')
    .map(f => path.join(CSS_DIR, f));

  let totalUndefined = 0;
  const undefinedByFile = {};

  for (const cssFile of cssFiles) {
    const fileName = path.basename(cssFile);
    const used = getUsedVariables(cssFile);
    const undefined = [];

    for (const variable of used) {
      if (!defined.has(variable)) {
        undefined.push(variable);
        totalUndefined++;
      }
    }

    if (undefined.length > 0) {
      undefinedByFile[fileName] = undefined;
    }
  }

  if (totalUndefined === 0) {
    console.log('✅ PASS: All CSS variables are defined\n');
    process.exit(0);
  } else {
    console.log(`❌ FAIL: ${totalUndefined} undefined CSS variables found\n`);

    for (const [fileName, variables] of Object.entries(undefinedByFile)) {
      console.log(`${fileName}:`);
      for (const variable of variables) {
        console.log(`  - ${variable}`);
      }
      console.log('');
    }

    console.log('Fix: Add these variables to assets/css/global.css :root block\n');
    process.exit(1);
  }
}

main();
