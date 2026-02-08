/**
 * Content Validator - Phase 1
 * Automated lesson validation before deployment
 */

const ContentValidator = {
  /**
   * Validate a lesson JSON object
   * @param {Object} lesson - Lesson data
   * @returns {Object} { valid: boolean, errors: [], warnings: [] }
   */
  validate(lesson) {
    const errors = [];
    const warnings = [];

    // Required fields
    const required = ['id', 'title', 'module', 'lessonNumber', 'contentSections'];
    required.forEach(field => {
      if (!lesson[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // ID format check
    if (lesson.id && !lesson.id.match(/^module-\d+-[\w-]+-lesson-\d+$/)) {
      errors.push(`Invalid lesson ID format: ${lesson.id}`);
    }

    // Title length
    if (lesson.title) {
      if (lesson.title.length < 5) {
        warnings.push('Title is very short');
      }
      if (lesson.title.length > 200) {
        errors.push('Title exceeds 200 characters');
      }
    }

    // Content sections
    if (lesson.contentSections) {
      if (!Array.isArray(lesson.contentSections)) {
        errors.push('contentSections must be an array');
      } else if (lesson.contentSections.length === 0) {
        errors.push('At least one content section required');
      } else {
        // Check each section
        lesson.contentSections.forEach((section, idx) => {
          if (!section.id) {
            errors.push(`Section ${idx + 1}: missing id`);
          }
          if (!section.title) {
            warnings.push(`Section ${idx + 1}: missing title`);
          }
          if (!section.content && section.type !== 'definition') {
            warnings.push(`Section ${idx + 1}: missing content`);
          }
        });
      }
    }

    // Learning intentions
    if (!lesson.learningIntentions || lesson.learningIntentions.length === 0) {
      warnings.push('No learning intentions specified');
    }

    // Success criteria
    if (!lesson.successCriteria || lesson.successCriteria.length === 0) {
      warnings.push('No success criteria specified');
    }

    // Assessment
    if (lesson.assessment) {
      const mcqCount = lesson.assessment.multipleChoice?.length || 0;
      const saCount = lesson.assessment.shortAnswer?.length || 0;
      
      if (mcqCount === 0 && saCount === 0) {
        warnings.push('No assessment questions');
      }

      // Validate MCQs
      if (lesson.assessment.multipleChoice) {
        lesson.assessment.multipleChoice.forEach((q, idx) => {
          if (!q.question) {
            errors.push(`MCQ ${idx + 1}: missing question`);
          }
          if (!q.options || q.options.length < 2) {
            errors.push(`MCQ ${idx + 1}: needs at least 2 options`);
          }
          if (!q.correctAnswer) {
            errors.push(`MCQ ${idx + 1}: missing correct answer`);
          }
        });
      }
    } else {
      warnings.push('Assessment section missing');
    }

    // Activities
    if (!lesson.activities || lesson.activities.length === 0) {
      warnings.push('No interactive activities');
    }

    // Check for HTML in content (should be clean)
    if (lesson.contentSections) {
      lesson.contentSections.forEach((section, idx) => {
        if (section.content && section.content.includes('<script')) {
          errors.push(`Section ${idx + 1}: Contains script tag (security)`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  },

  /**
   * Quick validation check
   * @param {Object} lesson 
   * @returns {boolean}
   */
  isValid(lesson) {
    return this.validate(lesson).valid;
  },

  /**
   * Validate JSON file content
   * @param {string} jsonContent 
   * @returns {Object} Validation result
   */
  validateJSON(jsonContent) {
    try {
      const lesson = JSON.parse(jsonContent);
      return this.validate(lesson);
    } catch (e) {
      return {
        valid: false,
        errors: [`Invalid JSON: ${e.message}`],
        warnings: []
      };
    }
  },

  /**
   * Generate validation report
   * @param {Object} lesson 
   * @returns {string} HTML report
   */
  generateReport(lesson) {
    const result = this.validate(lesson);
    
    let html = '<div class="validation-report">';
    
    if (result.valid && result.warnings.length === 0) {
      html += '<div class="validation-success">✅ All checks passed</div>';
    } else if (result.valid) {
      html += '<div class="validation-warning">⚠️ Valid with warnings</div>';
    } else {
      html += '<div class="validation-error">❌ Validation failed</div>';
    }

    if (result.errors.length > 0) {
      html += '<h4>Errors (must fix):</h4><ul>';
      result.errors.forEach(e => html += `<li>${e}</li>`);
      html += '</ul>';
    }

    if (result.warnings.length > 0) {
      html += '<h4>Warnings (recommended):</h4><ul>';
      result.warnings.forEach(w => html += `<li>${w}</li>`);
      html += '</ul>';
    }

    html += '</div>';
    return html;
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ContentValidator };
}
