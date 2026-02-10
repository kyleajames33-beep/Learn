#!/usr/bin/env node
/**
 * Lesson Quality Scorer
 * Run: node scripts/score-lessons.js
 *
 * Analyzes each lesson JSON and scores it on a 100-point scale.
 * Detects quality regression by comparing against baseline (first 5 lessons).
 *
 * Scoring Rubric:
 * - Content Completeness (30 pts)
 * - Activity Quality (25 pts)
 * - Assessment Quality (20 pts)
 * - Content Quality (15 pts)
 * - Technical Quality (10 pts)
 */

const fs = require('fs');
const path = require('path');

const LESSON_DIRS = [
  path.join(__dirname, '..', 'hsc-biology', 'data', 'lessons'),
  path.join(__dirname, '..', 'data', 'lessons')
];

const SKIP_FILES = ['TEMPLATE.json', 'index.json'];
const BASELINE_LESSONS = 5; // First 5 lessons are the quality baseline

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

function scoreLesson(data, filePath) {
  let score = 0;
  const breakdown = [];
  const warnings = [];

  // CONTENT COMPLETENESS (30 points)
  let contentScore = 0;

  // Engagement hook (5 pts)
  if (data.engagementHook && data.engagementHook.content && data.engagementHook.content.length > 20) {
    contentScore += 5;
  } else {
    warnings.push('Missing or weak engagement hook');
  }

  // Activity diversity (10 pts)
  const activities = data.activities || [];
  const activityTypes = new Set(activities.map(a => a.type));
  if (activityTypes.size >= 3) {
    contentScore += 10;
  } else if (activityTypes.size === 2) {
    contentScore += 7;
    warnings.push('Only 2 activity types (recommend 3+)');
  } else if (activityTypes.size === 1) {
    contentScore += 3;
    warnings.push('Only 1 activity type (recommend 3+)');
  } else {
    warnings.push('No activities');
  }

  // Multiple choice questions (5 pts)
  const mcqs = data.assessment?.multipleChoice || [];
  if (mcqs.length >= 3) {
    contentScore += 5;
  } else if (mcqs.length >= 2) {
    contentScore += 3;
    warnings.push(`Only ${mcqs.length} MCQs (recommend 3)`);
  } else {
    warnings.push(`Only ${mcqs.length} MCQs (recommend 3)`);
  }

  // Short answer questions (5 pts)
  const saqs = data.assessment?.shortAnswer || [];
  if (saqs.length >= 2) {
    contentScore += 5;
  } else if (saqs.length === 1) {
    contentScore += 3;
    warnings.push('Only 1 SAQ (recommend 2)');
  } else {
    warnings.push('No SAQs (recommend 2)');
  }

  // Copy-to-book definitions (5 pts)
  const definitions = data.copyToBook?.definitions || [];
  if (definitions.length >= 5) {
    contentScore += 5;
  } else if (definitions.length >= 3) {
    contentScore += 3;
    warnings.push(`Only ${definitions.length} definitions (recommend 5)`);
  } else {
    warnings.push(`Only ${definitions.length} definitions (recommend 5)`);
  }

  score += contentScore;
  breakdown.push({ category: 'Content Completeness', score: contentScore, max: 30 });

  // ACTIVITY QUALITY (25 points)
  let activityScore = 0;

  // No duplicate types (10 pts)
  if (activities.length > 0 && activityTypes.size === activities.length) {
    activityScore += 10;
  } else if (activities.length > 0 && activityTypes.size >= activities.length * 0.7) {
    activityScore += 7;
  } else if (activities.length > 0) {
    activityScore += 3;
    warnings.push('Many duplicate activity types');
  }

  // Activity count (10 pts)
  if (activities.length >= 4) {
    activityScore += 10;
  } else if (activities.length === 3) {
    activityScore += 8;
  } else if (activities.length === 2) {
    activityScore += 5;
    warnings.push('Only 2 activities (recommend 4)');
  } else {
    warnings.push('Too few activities (recommend 4)');
  }

  // Calculation activities have tolerance defined (5 pts)
  const calcActivities = activities.filter(a => a.type === 'calculation');
  if (calcActivities.length === 0) {
    activityScore += 5; // Not applicable, full credit
  } else {
    const withTolerance = calcActivities.filter(a => a.tolerance !== undefined);
    if (withTolerance.length === calcActivities.length) {
      activityScore += 5;
    } else {
      activityScore += Math.floor(5 * (withTolerance.length / calcActivities.length));
      warnings.push(`${calcActivities.length - withTolerance.length} calculation activities missing tolerance`);
    }
  }

  score += activityScore;
  breakdown.push({ category: 'Activity Quality', score: activityScore, max: 25 });

  // ASSESSMENT QUALITY (20 points)
  let assessmentScore = 0;

  // MCQ correctAnswer matches options (10 pts)
  let validMcqs = 0;
  for (const mcq of mcqs) {
    if (mcq.options && mcq.correctAnswer && mcq.options.includes(mcq.correctAnswer)) {
      validMcqs++;
    }
  }
  if (mcqs.length > 0) {
    assessmentScore += Math.floor(10 * (validMcqs / mcqs.length));
    if (validMcqs < mcqs.length) {
      warnings.push(`${mcqs.length - validMcqs} MCQs have incorrect answer keys`);
    }
  } else {
    // No MCQs, can't score
  }

  // SAQs have sufficient depth (10 pts)
  let detailedSaqs = 0;
  for (const saq of saqs) {
    if (saq.marks && saq.marks >= 3) {
      detailedSaqs++;
    }
  }
  if (saqs.length > 0) {
    assessmentScore += Math.floor(10 * (detailedSaqs / saqs.length));
  } else if (saqs.length === 0 && mcqs.length > 0) {
    // Has MCQs but no SAQs, partial credit
    assessmentScore += 5;
  }

  score += assessmentScore;
  breakdown.push({ category: 'Assessment Quality', score: assessmentScore, max: 20 });

  // CONTENT QUALITY (15 points)
  let qualityScore = 0;

  // Australian English (5 pts) - simple check
  const jsonText = JSON.stringify(data);
  const americanPatterns = [/\bspecialized\b/i, /\bbehavior\b/i, /\bcenter\b/i, /\bcolor\b/i];
  let americanCount = 0;
  for (const pattern of americanPatterns) {
    if (pattern.test(jsonText)) americanCount++;
  }
  if (americanCount === 0) {
    qualityScore += 5;
  } else {
    qualityScore += Math.max(0, 5 - americanCount);
    warnings.push(`${americanCount} American spelling patterns detected`);
  }

  // Has diagram/image (5 pts)
  const hasDiagram = data.contentSections && data.contentSections.some(s => s.type === 'diagram' || s.type === 'image');
  if (hasDiagram) {
    qualityScore += 5;
  } else {
    warnings.push('No diagrams or images');
  }

  // Text readability - simple length check (5 pts)
  const description = data.description || '';
  if (description.length >= 50 && description.length <= 200) {
    qualityScore += 5;
  } else if (description.length > 0) {
    qualityScore += 3;
    if (description.length < 50) warnings.push('Description too short');
    if (description.length > 200) warnings.push('Description too long');
  }

  score += qualityScore;
  breakdown.push({ category: 'Content Quality', score: qualityScore, max: 15 });

  // TECHNICAL QUALITY (10 points)
  let technicalScore = 0;

  // Navigation links valid (5 pts)
  if (data.navigation) {
    technicalScore += 5;
  } else {
    warnings.push('Missing navigation object');
  }

  // All required fields present (5 pts)
  const requiredFields = ['id', 'title', 'module', 'moduleTitle', 'lessonNumber', 'duration', 'difficulty'];
  const missingFields = requiredFields.filter(f => !data[f]);
  if (missingFields.length === 0) {
    technicalScore += 5;
  } else {
    technicalScore += Math.max(0, 5 - missingFields.length);
    warnings.push(`Missing ${missingFields.length} required fields: ${missingFields.join(', ')}`);
  }

  score += technicalScore;
  breakdown.push({ category: 'Technical Quality', score: technicalScore, max: 10 });

  return { score, breakdown, warnings };
}

function getQualityLevel(score) {
  if (score >= 90) return { level: 'EXCELLENT', icon: '✅' };
  if (score >= 80) return { level: 'GOOD', icon: '✅' };
  if (score >= 70) return { level: 'ACCEPTABLE', icon: '⚠️ ' };
  if (score >= 60) return { level: 'NEEDS IMPROVEMENT', icon: '⚠️ ' };
  return { level: 'POOR', icon: '❌' };
}

function main() {
  console.log('='.repeat(60));
  console.log('  LESSON QUALITY REPORT');
  console.log('='.repeat(60));
  console.log('');

  const files = findLessonFiles();
  if (files.length === 0) {
    console.log('No lesson JSON files found.');
    process.exit(1);
  }

  const results = [];

  for (const filePath of files) {
    const fileName = path.basename(filePath, '.json');
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.log(`SKIP  ${fileName} (JSON parse error)`);
      continue;
    }

    const result = scoreLesson(data, filePath);
    results.push({
      file: fileName,
      id: data.id,
      title: data.title,
      ...result
    });
  }

  // Sort by lesson number/ID
  results.sort((a, b) => {
    const aNum = parseInt(a.id.match(/\d+/)?.[0] || '0');
    const bNum = parseInt(b.id.match(/\d+/)?.[0] || '0');
    return aNum - bNum;
  });

  // Print results
  for (const result of results) {
    const { level, icon } = getQualityLevel(result.score);
    console.log(`${icon} ${result.id}: ${result.score}/100 (${level})`);
    if (result.score < 80) {
      for (const warning of result.warnings.slice(0, 3)) {
        console.log(`     - ${warning}`);
      }
    }
  }

  console.log('');
  console.log('-'.repeat(60));

  // Calculate baseline (first 5 lessons)
  const baseline = results.slice(0, Math.min(BASELINE_LESSONS, results.length));
  const baselineAvg = baseline.reduce((sum, r) => sum + r.score, 0) / baseline.length;

  // Calculate current average
  const currentAvg = results.reduce((sum, r) => sum + r.score, 0) / results.length;

  // Calculate category averages
  const categoryAverages = {};
  if (results.length > 0) {
    for (const cat of results[0].breakdown) {
      const catScores = results.map(r => {
        const catBreakdown = r.breakdown.find(b => b.category === cat.category);
        return catBreakdown ? (catBreakdown.score / catBreakdown.max) * 100 : 0;
      });
      categoryAverages[cat.category] = catScores.reduce((a, b) => a + b, 0) / catScores.length;
    }
  }

  console.log(`Total Lessons:     ${results.length}`);
  console.log(`Average Score:     ${currentAvg.toFixed(1)}/100`);
  console.log(`Baseline Avg:      ${baselineAvg.toFixed(1)}/100 (lessons 1-${baseline.length})`);
  console.log('');

  console.log('Category Averages:');
  for (const [category, avg] of Object.entries(categoryAverages)) {
    console.log(`  ${category}: ${avg.toFixed(1)}%`);
  }
  console.log('');

  // Regression detection
  if (currentAvg < baselineAvg - 5) {
    console.log(`⚠️  REGRESSION DETECTED: Current lessons ${(baselineAvg - currentAvg).toFixed(1)} points below baseline`);
  } else if (currentAvg >= baselineAvg) {
    console.log(`✅ Quality maintained or improved (${(currentAvg - baselineAvg >= 0 ? '+' : '')}${(currentAvg - baselineAvg).toFixed(1)} points vs baseline)`);
  } else {
    console.log(`⚠️  Slight quality dip (${(baselineAvg - currentAvg).toFixed(1)} points below baseline, within tolerance)`);
  }

  console.log('');
  process.exit(0);
}

main();
