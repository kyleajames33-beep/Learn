/**
 * HSC Biology - Lesson Data Schema & Validation
 * Phase 0.6 - Enhanced with Image Manager, Diagram Tool, Rich Media support
 * Version: 1.1.0
 */

const LessonSchema = {
  version: '1.1.0',
  lastUpdated: '2026-02-08',
  
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
      
      prerequisites: {
        type: 'array',
        default: [],
        items: {
          type: 'object',
          required: ['lessonId'],
          fields: {
            lessonId: { type: 'string', pattern: '^module-[0-9]+-[a-z-]+-lesson-[0-9]+$' },
            description: { type: 'string' },
            required: { type: 'boolean', default: true }
          }
        }
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
              enum: ['content', 'definition', 'grid', 'accordion', 'worked-example', 'activity', 'copy-to-book', 'assessment', 'diagram', 'image', 'video', 'simulation'] 
            },
            title: { type: 'string' },
            icon: { type: 'string', default: 'book-open' },
            content: { type: 'string' },
            items: { type: 'array' },
            definition: { type: 'string' },
            term: { type: 'string' },
            gridItems: { type: 'array' },
            open: { type: 'boolean', default: false },
            // New Phase 0.6 fields
            image: { type: 'object' },
            diagram: { type: 'object' },
            video: { type: 'object' },
            simulation: { type: 'object' }
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
            type: { type: 'string', enum: ['matching', 'fill-blank', 'multiple-choice', 'ordering', 'labeling', 'fillBlank'] },
            title: { type: 'string' },
            description: { type: 'string' },
            items: { type: 'array' },
            theme: { type: 'string', enum: ['teal', 'purple', 'orange', 'blue'], default: 'teal' },
            // Phase 0.6 activity-specific fields
            labels: { type: 'array' },
            blanks: { type: 'array' },
            shuffleDisplay: { type: 'boolean' },
            lockFirst: { type: 'boolean' },
            xpReward: { type: 'number', default: 50 }
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
      },
      
      // Phase 0.6: Image library for the lesson
      imageLibrary: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'src', 'alt'],
          fields: {
            id: { type: 'string' },
            src: { type: 'string' },
            srcWebp: { type: 'string' },
            thumbnail: { type: 'string' },
            alt: { type: 'string' },
            caption: { type: 'string' },
            credit: { type: 'string' },
            width: { type: 'number' },
            height: { type: 'number' },
            size: { type: 'number' },
            mimeType: { type: 'string' },
            uploadedAt: { type: 'string' }
          }
        }
      }
    }
  },
  
  /**
   * Image object schema for validation
   */
  imageSchema: {
    required: ['src', 'alt'],
    fields: {
      src: { type: 'string', minLength: 1 },
      srcWebp: { type: 'string' },
      thumbnail: { type: 'string' },
      alt: { type: 'string', minLength: 1 },
      caption: { type: 'string' },
      credit: { type: 'string' },
      width: { type: 'number', minimum: 1 },
      height: { type: 'number', minimum: 1 }
    }
  },
  
  /**
   * Diagram object schema for validation
   */
  diagramSchema: {
    required: ['id', 'title', 'image'],
    fields: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 },
      image: { type: 'object' },
      hotspots: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'x', 'y', 'type'],
          fields: {
            id: { type: 'string' },
            x: { type: 'number', minimum: 0, maximum: 100 },
            y: { type: 'number', minimum: 0, maximum: 100 },
            size: { type: 'number', minimum: 20, maximum: 100 },
            color: { type: 'string' },
            type: { type: 'string', enum: ['popup', 'label', 'layer'] },
            title: { type: 'string' },
            content: { type: 'string' },
            labelText: { type: 'string' },
            labelPosition: { type: 'string', enum: ['above', 'below', 'left', 'right'] },
            detailImage: { type: 'string' }
          }
        }
      },
      layers: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'name'],
          fields: {
            id: { type: 'string' },
            name: { type: 'string' },
            visibleHotspots: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      defaultZoom: { type: 'number', minimum: 0.5, maximum: 3 },
      maxZoom: { type: 'number', minimum: 1, maximum: 5 },
      minZoom: { type: 'number', minimum: 0.25, maximum: 1 }
    }
  },
  
  /**
   * Video object schema for validation
   */
  videoSchema: {
    required: ['id', 'type', 'title'],
    fields: {
      id: { type: 'string' },
      type: { type: 'string', enum: ['video'] },
      title: { type: 'string' },
      provider: { type: 'string', enum: ['youtube', 'vimeo'] },
      videoId: { type: 'string' },
      url: { type: 'string' },
      startTime: { type: 'number', minimum: 0 },
      endTime: { type: 'number', minimum: 0 },
      thumbnail: { type: 'string' },
      transcript: { type: 'string' },
      caption: { type: 'string' }
    }
  },
  
  /**
   * Activity schemas for Phase 0.6
   */
  activitySchemas: {
    ordering: {
      required: ['type', 'title', 'items'],
      fields: {
        type: { type: 'string', enum: ['ordering'] },
        title: { type: 'string' },
        instructions: { type: 'string' },
        items: {
          type: 'array',
          minItems: 2,
          items: {
            type: 'object',
            required: ['id', 'text', 'correctPosition'],
            fields: {
              id: { type: 'string' },
              text: { type: 'string' },
              correctPosition: { type: 'number', minimum: 1 }
            }
          }
        },
        shuffleDisplay: { type: 'boolean', default: true },
        lockFirst: { type: 'boolean', default: false },
        xpReward: { type: 'number', default: 50 }
      }
    },
    
    labeling: {
      required: ['type', 'title', 'image', 'labels'],
      fields: {
        type: { type: 'string', enum: ['labeling'] },
        title: { type: 'string' },
        image: { type: 'object' },
        labels: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['id', 'zone', 'correctText'],
            fields: {
              id: { type: 'string' },
              zone: {
                type: 'object',
                required: ['x', 'y', 'width', 'height'],
                fields: {
                  x: { type: 'number' },
                  y: { type: 'number' },
                  width: { type: 'number' },
                  height: { type: 'number' },
                  polygon: { type: 'array' }
                }
              },
              correctText: { type: 'string' },
              alternatives: { type: 'array', items: { type: 'string' } },
              hint: { type: 'string' }
            }
          }
        },
        allowRetry: { type: 'boolean', default: true },
        xpReward: { type: 'number', default: 50 }
      }
    },
    
    fillBlank: {
      required: ['type', 'title', 'text', 'blanks'],
      fields: {
        type: { type: 'string', enum: ['fillBlank'] },
        title: { type: 'string' },
        text: { type: 'string' },
        blanks: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['id', 'correct'],
            fields: {
              id: { type: 'string' },
              correct: { type: 'string' },
              alternatives: { type: 'array', items: { type: 'string' } },
              hint: { type: 'string' },
              caseSensitive: { type: 'boolean', default: false },
              showFirstLetter: { type: 'boolean', default: false }
            }
          }
        },
        xpReward: { type: 'number', default: 50 }
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
    if (!sanitized.imageLibrary) sanitized.imageLibrary = [];
    
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
  },
  
  /**
   * Generate unique ID
   * @param {string} prefix - ID prefix
   * @returns {string}
   */
  generateId(prefix = 'item') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Export for both module and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LessonSchema };
}
