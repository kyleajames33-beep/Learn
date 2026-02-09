#!/usr/bin/env node
/**
 * Australian English Spelling Checker
 * Run: node scripts/validate-spelling.js
 *
 * Scans all lesson JSON files for American English spellings
 * that should be Australian English.
 */

const fs = require('fs');
const path = require('path');

const LESSON_DIRS = [
  path.join(__dirname, '..', 'hsc-biology', 'data', 'lessons'),
  path.join(__dirname, '..', 'data', 'lessons')
];

const SKIP_FILES = ['TEMPLATE.json', 'index.json'];

// American -> Australian spelling pairs
// Each entry: { pattern, american, australian }
const SPELLING_RULES = [
  // -ize vs -ise
  { pattern: /\bspecializ(e[ds]?|ing|ation)\b/gi, american: 'specializ-', australian: 'specialis-' },
  { pattern: /\borganiz(e[ds]?|ing|ation)\b/gi, american: 'organiz-', australian: 'organis-' },
  { pattern: /\brecogniz(e[ds]?|ing|ation)\b/gi, american: 'recogniz-', australian: 'recognis-' },
  { pattern: /\banalyz(e[ds]?|ing)\b/gi, american: 'analyz-', australian: 'analys-' },
  { pattern: /\bminimiz(e[ds]?|ing|ation)\b/gi, american: 'minimiz-', australian: 'minimis-' },
  { pattern: /\bmaximiz(e[ds]?|ing|ation)\b/gi, american: 'maximiz-', australian: 'maximis-' },
  { pattern: /\butiliz(e[ds]?|ing|ation)\b/gi, american: 'utiliz-', australian: 'utilis-' },
  { pattern: /\bsummariz(e[ds]?|ing|ation)\b/gi, american: 'summariz-', australian: 'summaris-' },
  { pattern: /\bcategoriz(e[ds]?|ing|ation)\b/gi, american: 'categoriz-', australian: 'categoris-' },
  { pattern: /\bhypothesiz(e[ds]?|ing)\b/gi, american: 'hypothesiz-', australian: 'hypothesis-' },

  // -or vs -our
  { pattern: /\bbehavior(s|al)?\b/gi, american: 'behavior', australian: 'behaviour' },
  { pattern: /\bcolor(s|ed|ing|ful|less)?\b/gi, american: 'color', australian: 'colour' },
  { pattern: /\bfavor(s|ed|ing|ite|able)?\b/gi, american: 'favor', australian: 'favour' },
  { pattern: /\bhonor(s|ed|ing|able)?\b/gi, american: 'honor', australian: 'honour' },
  { pattern: /\btumor(s)?\b/gi, american: 'tumor', australian: 'tumour' },
  { pattern: /\bhumor(s|ous)?\b/gi, american: 'humor', australian: 'humour' },
  { pattern: /\bneighbor(s|ing|hood)?\b/gi, american: 'neighbor', australian: 'neighbour' },
  { pattern: /\bodor(s|less)?\b/gi, american: 'odor', australian: 'odour' },
  { pattern: /\bvigor(ous)?\b/gi, american: 'vigor', australian: 'vigour' },

  // -er vs -re
  { pattern: /\bcenter(s|ed|ing)?\b/gi, american: 'center', australian: 'centre' },
  { pattern: /\bfiber(s)?\b/gi, american: 'fiber', australian: 'fibre' },
  { pattern: /\bliter(s)?\b/gi, american: 'liter', australian: 'litre' },
  { pattern: /\bmeter(s)?\b/gi, american: 'meter', australian: 'metre' },

  // -se vs -ce
  { pattern: /\bdefense(s)?\b/gi, american: 'defense', australian: 'defence' },
  { pattern: /\boffense(s)?\b/gi, american: 'offense', australian: 'offence' },
  // Note: practice/licence are context-dependent (noun vs verb) so not checked here

  // Medical/scientific terms
  { pattern: /\bhemoglobin\b/gi, american: 'hemoglobin', australian: 'haemoglobin' },
  { pattern: /\bestrogen\b/gi, american: 'estrogen', australian: 'oestrogen' },
  { pattern: /\bfetus(es)?\b/gi, american: 'fetus', australian: 'foetus' },
  { pattern: /\banemia\b/gi, american: 'anemia', australian: 'anaemia' },
  { pattern: /\bpediatric(s|ian)?\b/gi, american: 'pediatric', australian: 'paediatric' },
  { pattern: /\bgynecolog(y|ist|ical)?\b/gi, american: 'gynecolog-', australian: 'gynaecolog-' },
  { pattern: /\bhemorrhag(e|ing|ic)\b/gi, american: 'hemorrhag-', australian: 'haemorrhag-' },
  { pattern: /\bleukemia\b/gi, american: 'leukemia', australian: 'leukaemia' },
  { pattern: /\bdiarrhea\b/gi, american: 'diarrhea', australian: 'diarrhoea' },
  { pattern: /\bedema\b/gi, american: 'edema', australian: 'oedema' },

  // -led/-ling vs -lled/-lling
  { pattern: /\blabeled\b/gi, american: 'labeled', australian: 'labelled' },
  { pattern: /\bmodeling\b/gi, american: 'modeling', australian: 'modelling' },
  { pattern: /\btraveling\b/gi, american: 'traveling', australian: 'travelling' },
  { pattern: /\bcanceled\b/gi, american: 'canceled', australian: 'cancelled' },
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

function extractTextFields(obj, prefix = '') {
  const texts = [];

  if (typeof obj === 'string') {
    texts.push({ path: prefix, value: obj });
    return texts;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      texts.push(...extractTextFields(item, `${prefix}[${i}]`));
    });
    return texts;
  }

  if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      texts.push(...extractTextFields(value, prefix ? `${prefix}.${key}` : key));
    }
  }

  return texts;
}

function checkSpelling(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  const issues = [];

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return { file: relativePath, issues: [{ field: '-', word: '-', suggestion: `JSON parse error: ${e.message}` }] };
  }

  const textFields = extractTextFields(data);

  for (const { path: fieldPath, value } of textFields) {
    for (const rule of SPELLING_RULES) {
      const matches = value.match(rule.pattern);
      if (matches) {
        for (const match of matches) {
          issues.push({
            field: fieldPath,
            word: match,
            suggestion: `Use "${rule.australian}" instead of "${rule.american}"`
          });
        }
      }
    }
  }

  return { file: relativePath, issues };
}

function main() {
  console.log('Checking Australian English spelling...\n');

  const files = findLessonFiles();

  if (files.length === 0) {
    console.log('No lesson JSON files found.');
    process.exit(1);
  }

  let totalIssues = 0;
  let cleanFiles = 0;

  for (const filePath of files) {
    const result = checkSpelling(filePath);

    if (result.issues.length > 0) {
      console.log(`FAIL  ${result.file}`);
      for (const issue of result.issues) {
        console.log(`  "${issue.word}" in ${issue.field}`);
        console.log(`    ${issue.suggestion}`);
      }
      console.log('');
      totalIssues += result.issues.length;
    } else {
      console.log(`PASS  ${result.file}`);
      cleanFiles++;
    }
  }

  console.log('\n---');
  console.log(`Files scanned: ${files.length}`);
  console.log(`Clean files:   ${cleanFiles}/${files.length}`);
  console.log(`Spelling issues: ${totalIssues}`);
  console.log('');

  if (totalIssues === 0) {
    console.log('All files use Australian English.');
  } else {
    console.log(`${totalIssues} American spelling(s) found. Fix before deploying.`);
  }

  process.exit(totalIssues > 0 ? 1 : 0);
}

main();
