/**
 * HSC Biology - Lesson Data Schema & Validation
 * Phase 0.2 - JSON Data System
 * Version: 1.0.0
 */

const LessonSchema = {
  version: '1.0.0',
  lastUpdated: '2026-02-07',
  
  // Schema definition for lesson data
  definition: {
    // Required fields
    required: [
      'id',
      'title',
      'module',
      'moduleTitle',
      'lessonNumber',
      'duration',
      'difficulty',
      'learningIntentions',
      'successCriteria',
      'contentSections'
    ],
    
    // Field types and validation
    fields: {
      id: { type: 'string', pattern: '^module-[0-9]+-[a-z-]+-lesson-[0-9]+$' },
      title: { type: 'string', minLength: 1, maxLength: 200 },
      module: { type: 'string', pattern: '^module-[0-9]+-[a-z-]+$' },
      moduleTitle: { type: 'string', minLength: 1 },
      moduleNumber: { type: 'number', minimum: 1, maximum: 8 },
      lessonNumber: { type: 'number', minimum: 1 },
      description: { type: 'string', minLength: 10 },
      duration: { type: 'string', pattern: '^[0-9]+ minutes$' },
      difficulty: { type: 'string', enum: ['Foundation Level', 'Intermediate', 'Advanced'] },
      worksOffline: { type: 'boolean', default: true },
      
      learningIntentions: { 
        type: 'array', 
        minItems: 1, 
        items: { type: 'string', minLength: 5 } 
      },
      
      syllabusLinks: {
        type: 'object',
        required: ['module', 'inquiryQuestion'],
        fields: {
          module: { type: 'string' },
          inquiryQuestion: { type: 'string' },
          focus: { type: 'string' }
        }
      },
      
      successCriteria: {
        type: 'array',
        minItems: 1,
        items: { type: 'string', minLength: 5 }
      },
      
      engagementHook: {
        type: 'object',
        fields: {
          title: { type: 'string' },
          content: { type: 'string', minLength: 10 }
        }
      },
      
      contentSections: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['id', 'type', 'title'],
          fields: {
            id: { type: 'string' },
            type: { 
              type: 'string', 
              enum: ['content', 'definition', 'grid', 'accordion', 'worked-example', 'activity', 'copy-to-book', 'assessment'] 
            },
            title: { type: 'string' },
            icon: { type: 'string', default: 'book-open' },
            content: { type: 'string' },
            items: { type: 'array' },
            definition: { type: 'string' },
            term: { type: 'string' },
            gridItems: { type: 'array' },
            open: { type: 'boolean', default: false }
          }
        }
      },
      
      activities: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'type', 'title'],
          fields: {
            id: { type: 'string' },
            type: { type: 'string', enum: ['matching', 'fill-blank', 'multiple-choice', 'sorting'] },
            title: { type: 'string' },
            description: { type: 'string' },
            items: { type: 'array' },
            theme: { type: 'string', enum: ['teal', 'purple', 'orange', 'blue'], default: 'teal' }
          }
        }
      },
      
      assessment: {
        type: 'object',
        fields: {
          multipleChoice: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'question', 'options', 'correctAnswer'],
              fields: {
                id: { type: 'string' },
                question: { type: 'string' },
                options: { type: 'array', minItems: 2, items: { type: 'string' } },
                correctAnswer: { type: 'string' }
              }
            }
          },
          shortAnswer: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'question', 'marks'],
              fields: {
                id: { type: 'string' },
                question: { type: 'string' },
                marks: { type: 'number', minimum: 1 }
              }
            }
          }
        }
      },
      
      copyToBook: {
        type: 'object',
        fields: {
          definitions: { type: 'array', items: { type: 'string' } },
          keyPoints: { type: 'array', items: { type: 'string' } },
          diagrams: { type: 'array', items: { type: 'string' } }
        }
      },
      
      answerKey: {
        type: 'object',
        fields: {
          multipleChoice: { type: 'array', items: { type: 'string' } },
          shortAnswer: { type: 'array', items: { type: 'string' } }
        }
      },
      
      navigation: {
        type: 'object',
        fields: {
          previous: { type: ['string', 'null'] },
          previousTitle: { type: ['string', 'null'] },
          next: { type: ['string', 'null'] },
          nextTitle: { type: ['string', 'null'] }
        }
      },
      
      meta: {
        type: 'object',
        fields: {
          author: { type: 'string' },
          createdAt: { type: 'string', pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' },
          lastModified: { type: 'string', pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' },
          version: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  },
  
  /**
   * Validate a lesson data object against the schema
   * @param {Object} data - The lesson data to validate
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  validate(data) {
    const errors = [];
    
    // Check required fields
    for (const field of this.definition.required) {
      if (data[field] === undefined || data[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    // Check field types
    for (const [fieldName, value] of Object.entries(data)) {
      const fieldDef = this.definition.fields[fieldName];
      if (!fieldDef) {
        // Allow extra fields, but log warning in strict mode
        continue;
      }
      
      const typeError = this._validateType(fieldName, value, fieldDef);
      if (typeError) {
        errors.push(typeError);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },
  
  /**
   * Validate a specific field's type
   * @private
   */
  _validateType(fieldName, value, fieldDef) {
    if (fieldDef.type === 'string') {
      if (typeof value !== 'string') {
        return `${fieldName}: expected string, got ${typeof value}`;
      }
      if (fieldDef.minLength && value.length < fieldDef.minLength) {
        return `${fieldName}: minimum length is ${fieldDef.minLength}`;
      }
      if (fieldDef.maxLength && value.length > fieldDef.maxLength) {
        return `${fieldName}: maximum length is ${fieldDef.maxLength}`;
      }
      if (fieldDef.pattern && !new RegExp(fieldDef.pattern).test(value)) {
        return `${fieldName}: does not match required pattern`;
      }
      if (fieldDef.enum && !fieldDef.enum.includes(value)) {
        return `${fieldName}: must be one of [${fieldDef.enum.join(', ')}]`;
      }
    }
    
    if (fieldDef.type === 'number') {
      if (typeof value !== 'number') {
        return `${fieldName}: expected number, got ${typeof value}`;
      }
      if (fieldDef.minimum !== undefined && value < fieldDef.minimum) {
        return `${fieldName}: minimum value is ${fieldDef.minimum}`;
      }
      if (fieldDef.maximum !== undefined && value > fieldDef.maximum) {
        return `${fieldName}: maximum value is ${fieldDef.maximum}`;
      }
    }
    
    if (fieldDef.type === 'boolean') {
      if (typeof value !== 'boolean') {
        return `${fieldName}: expected boolean, got ${typeof value}`;
      }
    }
    
    if (fieldDef.type === 'array') {
      if (!Array.isArray(value)) {
        return `${fieldName}: expected array, got ${typeof value}`;
      }
      if (fieldDef.minItems !== undefined && value.length < fieldDef.minItems) {
        return `${fieldName}: minimum ${fieldDef.minItems} items required`;
      }
    }
    
    if (fieldDef.type === 'object') {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return `${fieldName}: expected object, got ${typeof value}`;
      }
      if (fieldDef.required) {
        for (const reqField of fieldDef.required) {
          if (value[reqField] === undefined || value[reqField] === null) {
            return `${fieldName}: missing required field ${reqField}`;
          }
        }
      }
    }
    
    return null;
  },
  
  /**
   * Sanitize lesson data - fill in defaults and clean up
   * @param {Object} data - Raw lesson data
   * @returns {Object} - Sanitized data
   */
  sanitize(data) {
    const sanitized = { ...data };
    
    // Apply defaults
    if (sanitized.worksOffline === undefined) {
      sanitized.worksOffline = true;
    }
    
    // Ensure array fields
    if (!sanitized.activities) sanitized.activities = [];
    if (!sanitized.syllabusLinks) sanitized.syllabusLinks = {};
    if (!sanitized.meta) sanitized.meta = {};
    
    // Add schema version
    sanitized._schemaVersion = this.version;
    
    return sanitized;
  },
  
  /**
   * Get lesson ID from URL parameters
   * @returns {string|null}
   */
  getLessonIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lesson');
  },
  
  /**
   * Build lesson URL with parameter
   * @param {string} lessonId 
   * @returns {string}
   */
  buildLessonURL(lessonId) {
    return `lesson.html?lesson=${lessonId}`;
  },
  
  /**
   * Convert old HTML lesson path to new lesson ID
   * @param {string} oldPath - e.g., "module-1-cells/lesson-1.html"
   * @returns {string|null} - e.g., "module-1-cells-lesson-1"
   */
  convertOldPathToId(oldPath) {
    const match = oldPath.match(/(module-\d+-[\w-]+)\/lesson-(\d+)\.html/);
    if (match) {
      return `${match[1]}-lesson-${match[2]}`;
    }
    return null;
  }
};

// Export for both module and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LessonSchema };
}
