/**
 * Migration Tool - Phase 0.4
 * HTML to JSON lesson migration utility
 */

const MigrationTool = {
  // Track migration status
  migrationStatus: {},

  /**
   * Parse HTML lesson file and extract lesson data
   * @param {string} htmlContent - The HTML content
   * @param {string} filePath - Path to the HTML file (for reference)
   * @returns {Object} - Extracted lesson data
   */
  parseHTMLLesson(htmlContent, filePath) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const lesson = {
      id: this.generateLessonId(filePath),
      title: this.extractTitle(doc),
      module: this.extractModule(filePath),
      moduleTitle: this.extractModuleTitle(filePath),
      moduleNumber: this.extractModuleNumber(filePath),
      lessonNumber: this.extractLessonNumber(filePath),
      description: this.extractDescription(doc),
      duration: this.extractDuration(doc),
      difficulty: this.extractDifficulty(doc),
      worksOffline: true,
      learningIntentions: this.extractLearningIntentions(doc),
      successCriteria: this.extractSuccessCriteria(doc),
      syllabusLinks: this.extractSyllabusLinks(doc),
      engagementHook: this.extractEngagementHook(doc),
      contentSections: this.extractContentSections(doc),
      activities: this.extractActivities(doc),
      assessment: this.extractAssessment(doc),
      navigation: this.extractNavigation(doc, filePath),
      meta: {
        author: 'Science Hub',
        createdAt: this.extractDate(doc) || new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        version: '1.0.0',
        migratedFrom: filePath,
        migrationDate: new Date().toISOString()
      }
    };

    return lesson;
  },

  /**
   * Generate lesson ID from file path
   */
  generateLessonId(filePath) {
    const match = filePath.match(/(module-\d+-[\w-]+).*lesson-(\d+)/);
    if (match) {
      return `${match[1]}-lesson-${match[2]}`;
    }
    return `unknown-lesson-${Date.now()}`;
  },

  /**
   * Extract lesson title
   */
  extractTitle(doc) {
    // Try h1 first
    const h1 = doc.querySelector('.lesson-hero-title, h1');
    if (h1) return h1.textContent.trim();
    
    // Fall back to page title
    const title = doc.querySelector('title');
    if (title) {
      const parts = title.textContent.split('|');
      return parts[0]?.replace('Lesson X:', '').trim() || 'Untitled Lesson';
    }
    
    return 'Untitled Lesson';
  },

  /**
   * Extract module from file path
   */
  extractModule(filePath) {
    const match = filePath.match(/(module-\d+-[\w-]+)/);
    return match ? match[1] : '';
  },

  /**
   * Extract module title
   */
  extractModuleTitle(filePath) {
    const moduleMap = {
      'module-1-cells': 'Module 1: Cells',
      'module-2-organisation': 'Module 2: Organisation',
      'module-3-diversity': 'Module 3: Diversity',
      'module-4-ecosystems': 'Module 4: Ecosystems',
      'module-5-heredity': 'Module 5: Heredity',
      'module-6-genetic-change': 'Module 6: Genetic Change',
      'module-7-infectious-disease': 'Module 7: Infectious Disease',
      'module-8-non-infectious-disease': 'Module 8: Non-Infectious Disease'
    };
    
    const module = this.extractModule(filePath);
    return moduleMap[module] || module;
  },

  /**
   * Extract module number
   */
  extractModuleNumber(filePath) {
    const match = filePath.match(/module-(\d+)/);
    return match ? parseInt(match[1]) : null;
  },

  /**
   * Extract lesson number
   */
  extractLessonNumber(filePath) {
    const match = filePath.match(/lesson-(\d+)/);
    return match ? parseInt(match[1]) : null;
  },

  /**
   * Extract description from hero section
   */
  extractDescription(doc) {
    const desc = doc.querySelector('.lesson-hero-description, .lesson-content-wrapper > section:first-child p');
    return desc ? desc.textContent.trim() : '';
  },

  /**
   * Extract duration from meta or content
   */
  extractDuration(doc) {
    const meta = doc.querySelector('.lesson-hero-meta, .hero-meta-item');
    if (meta) {
      const text = meta.textContent;
      const match = text.match(/(\d+)\s*minutes?/i);
      if (match) return `${match[1]} minutes`;
    }
    return '45 minutes';
  },

  /**
   * Extract difficulty level
   */
  extractDifficulty(doc) {
    const meta = doc.querySelector('.lesson-hero-meta');
    if (meta) {
      const text = meta.textContent.toLowerCase();
      if (text.includes('advanced')) return 'Advanced';
      if (text.includes('intermediate')) return 'Intermediate';
    }
    return 'Foundation Level';
  },

  /**
   * Extract learning intentions
   */
  extractLearningIntentions(doc) {
    const intentions = [];
    
    // Look for Learning Intentions section
    const section = this.findSectionByTitle(doc, 'Learning Intentions');
    if (section) {
      const items = section.querySelectorAll('li');
      items.forEach(li => {
        const text = li.textContent.trim();
        if (text) intentions.push(text);
      });
    }
    
    return intentions.length > 0 ? intentions : ['Understand key concepts'];
  },

  /**
   * Extract success criteria
   */
  extractSuccessCriteria(doc) {
    const criteria = [];
    
    const section = this.findSectionByTitle(doc, 'Success Criteria');
    if (section) {
      const items = section.querySelectorAll('li');
      items.forEach(li => {
        const text = li.textContent.trim();
        if (text) criteria.push(text);
      });
    }
    
    return criteria.length > 0 ? criteria : ['Complete lesson activities'];
  },

  /**
   * Extract syllabus links
   */
  extractSyllabusLinks(doc) {
    const section = this.findSectionByTitle(doc, 'Syllabus Links');
    if (section) {
      const text = section.textContent;
      const links = {};
      
      // Try to extract inquiry question
      const iqMatch = text.match(/Inquiry Question:([^\n]+)/i);
      if (iqMatch) links.inquiryQuestion = iqMatch[1].trim();
      
      // Try to extract focus
      const focusMatch = text.match(/Focus:([^\n]+)/i);
      if (focusMatch) links.focus = focusMatch[1].trim();
      
      return links;
    }
    
    return { inquiryQuestion: '', focus: '' };
  },

  /**
   * Extract engagement hook
   */
  extractEngagementHook(doc) {
    const hook = doc.querySelector('.engagement-hook, .engagement-hook-card');
    if (hook) {
      const title = hook.querySelector('h4, .hook-title');
      const content = hook.querySelector('p, .hook-content');
      
      return {
        title: title ? title.textContent.trim() : 'Think About This...',
        content: content ? content.textContent.trim() : ''
      };
    }
    
    return { title: '', content: '' };
  },

  /**
   * Extract content sections
   */
  extractContentSections(doc) {
    const sections = [];
    
    // Find all content sections
    const sectionElements = doc.querySelectorAll('.content-section, section.section, .lesson-content-wrapper section');
    
    sectionElements.forEach((section, index) => {
      const titleEl = section.querySelector('h2, h3');
      const title = titleEl ? titleEl.textContent.trim() : `Section ${index + 1}`;
      
      // Skip special sections
      if (title.toLowerCase().includes('learning intention') ||
          title.toLowerCase().includes('success criteria') ||
          title.toLowerCase().includes('syllabus')) {
        return;
      }
      
      // Determine section type
      let type = 'content';
      if (section.querySelector('.definition-box')) type = 'definition';
      else if (section.querySelector('.grid-2-col, .grid-3-col')) type = 'grid';
      else if (section.closest('details, .accordion')) type = 'accordion';
      else if (section.querySelector('.worked-example')) type = 'worked-example';
      
      const contentSection = {
        id: `section-${index + 1}`,
        type: type,
        title: title,
        icon: this.getIconForSection(title),
        content: this.extractSectionContent(section)
      };
      
      // Extract specific content based on type
      if (type === 'definition') {
        const defBox = section.querySelector('.definition-box');
        if (defBox) {
          const strong = defBox.querySelector('strong');
          if (strong) {
            contentSection.term = strong.textContent.replace(':', '').trim();
            contentSection.definition = defBox.textContent.replace(strong.textContent, '').trim();
          }
        }
      }
      
      sections.push(contentSection);
    });
    
    return sections.length > 0 ? sections : [{
      id: 'section-1',
      type: 'content',
      title: 'Introduction',
      icon: 'book-open',
      content: '<p>Lesson content goes here.</p>'
    }];
  },

  /**
   * Extract section content HTML
   */
  extractSectionContent(section) {
    // Clone to avoid modifying original
    const clone = section.cloneNode(true);
    
    // Remove the heading
    const heading = clone.querySelector('h2, h3');
    if (heading) heading.remove();
    
    // Get remaining content
    let content = clone.innerHTML.trim();
    
    // Clean up common issues
    content = content.replace(/\n\s*/g, ' ');
    content = content.replace(/>\s+</g, '><');
    
    return content || '<p>Content section.</p>';
  },

  /**
   * Get appropriate icon for section title
   */
  getIconForSection(title) {
    const title_lower = title.toLowerCase();
    if (title_lower.includes('cell')) return 'microscope';
    if (title_lower.includes('theory')) return 'book-open';
    if (title_lower.includes('structure')) return 'layers';
    if (title_lower.includes('example')) return 'calculator';
    if (title_lower.includes('activity')) return 'activity';
    return 'book-open';
  },

  /**
   * Find section by title text
   */
  findSectionByTitle(doc, titleText) {
    const sections = doc.querySelectorAll('.card, section');
    for (const section of sections) {
      const title = section.querySelector('h2, h3, .card-title');
      if (title && title.textContent.toLowerCase().includes(titleText.toLowerCase())) {
        return section;
      }
    }
    return null;
  },

  /**
   * Extract activities
   */
  extractActivities(doc) {
    const activities = [];
    const activityCards = doc.querySelectorAll('.activity-card, [class*="activity"]');
    
    activityCards.forEach((card, index) => {
      const titleEl = card.querySelector('h3, .activity-title');
      const title = titleEl ? titleEl.textContent.trim() : `Activity ${index + 1}`;
      
      const descEl = card.querySelector('p, .activity-description');
      const description = descEl ? descEl.textContent.trim() : '';
      
      // Determine activity type
      let type = 'matching';
      if (card.querySelector('input[type="text"]')) type = 'fill-blank';
      if (card.querySelector('.matching-item')) type = 'matching';
      
      const activity = {
        id: `activity-${index + 1}`,
        type: type,
        title: title,
        description: description,
        theme: 'teal',
        items: []
      };
      
      // Extract items based on type
      if (type === 'matching') {
        const items = card.querySelectorAll('.matching-item');
        items.forEach(item => {
          const term = item.querySelector('.matching-term')?.textContent.trim();
          if (term) {
            activity.items.push({
              term: term,
              correctValue: 'a',
              options: [
                { value: 'a', label: 'Option A' },
                { value: 'b', label: 'Option B' },
                { value: 'c', label: 'Option C' }
              ]
            });
          }
        });
      } else if (type === 'fill-blank') {
        const inputs = card.querySelectorAll('input[type="text"]');
        inputs.forEach((input, i) => {
          const label = input.previousElementSibling?.textContent.trim() || `Item ${i + 1}`;
          activity.items.push({
            label: label,
            correctAnswer: input.dataset.correct || '',
            placeholder: input.placeholder || 'Answer',
            maxLength: parseInt(input.maxLength) || 10
          });
        });
      }
      
      if (activity.items.length > 0) {
        activities.push(activity);
      }
    });
    
    return activities;
  },

  /**
   * Extract assessment questions
   */
  extractAssessment(doc) {
    const assessment = {
      multipleChoice: [],
      shortAnswer: []
    };
    
    // Find MCQs
    const mcqSection = this.findSectionByTitle(doc, 'Assessment');
    if (mcqSection) {
      const questions = mcqSection.querySelectorAll('.quiz-question, .mcq-question');
      
      questions.forEach((q, index) => {
        const questionText = q.querySelector('p')?.textContent.trim() || '';
        const options = [];
        const optionEls = q.querySelectorAll('.quiz-option, .mcq-option');
        
        optionEls.forEach(opt => {
          const text = opt.querySelector('.quiz-option-text, .option-text')?.textContent.trim();
          if (text) options.push(text);
        });
        
        // Get correct answer from data attribute
        const correct = q.dataset.correct || 'a';
        
        if (questionText && options.length > 0) {
          assessment.multipleChoice.push({
            id: `q${index + 1}`,
            question: questionText,
            options: options,
            correctAnswer: correct
          });
        }
      });
    }
    
    return assessment;
  },

  /**
   * Extract navigation links
   */
  extractNavigation(doc, filePath) {
    const nav = {
      previous: null,
      previousTitle: null,
      next: null,
      nextTitle: null
    };
    
    const navEl = doc.querySelector('.lesson-navigation');
    if (navEl) {
      const prevLink = navEl.querySelector('.lesson-nav-btn:first-child, a[rel="prev"]');
      if (prevLink && prevLink.href && !prevLink.classList.contains('disabled')) {
        nav.previous = this.extractLessonIdFromUrl(prevLink.href);
        nav.previousTitle = prevLink.querySelector('.nav-btn-title')?.textContent.trim();
      }
      
      const nextLink = navEl.querySelector('.lesson-nav-btn:last-child, a[rel="next"]');
      if (nextLink && nextLink.href && !nextLink.classList.contains('disabled')) {
        nav.next = this.extractLessonIdFromUrl(nextLink.href);
        nav.nextTitle = nextLink.querySelector('.nav-btn-title')?.textContent.trim();
      }
    }
    
    return nav;
  },

  /**
   * Extract lesson ID from URL
   */
  extractLessonIdFromUrl(url) {
    const match = url.match(/(module-\d+-[\w-]+).*lesson-(\d+)/);
    if (match) {
      return `${match[1]}-lesson-${match[2]}`;
    }
    return null;
  },

  /**
   * Extract date from meta or content
   */
  extractDate(doc) {
    const meta = doc.querySelector('meta[name="date"], meta[name="created"]');
    if (meta) return meta.content;
    return new Date().toISOString().split('T')[0];
  },

  /**
   * Compare original HTML with migrated JSON
   */
  compareContent(originalHTML, migratedJSON) {
    const originalText = this.extractPlainText(originalHTML);
    const migratedText = this.extractPlainTextFromJSON(migratedJSON);
    
    // Calculate similarity percentage
    const similarity = this.calculateSimilarity(originalText, migratedText);
    
    return {
      originalLength: originalText.length,
      migratedLength: migratedText.length,
      similarity: similarity,
      differences: this.findDifferences(originalText, migratedText),
      passed: similarity > 95
    };
  },

  /**
   * Extract plain text from HTML
   */
  extractPlainText(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
  },

  /**
   * Extract plain text from JSON
   */
  extractPlainTextFromJSON(json) {
    let text = '';
    
    text += json.title + ' ';
    text += json.description + ' ';
    
    json.learningIntentions?.forEach(i => text += i + ' ');
    json.successCriteria?.forEach(s => text += s + ' ');
    
    json.contentSections?.forEach(section => {
      text += section.title + ' ';
      text += section.content + ' ';
    });
    
    return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  },

  /**
   * Calculate text similarity (Levenshtein distance based)
   */
  calculateSimilarity(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    
    if (len1 === 0) return len2 === 0 ? 100 : 0;
    if (len2 === 0) return 0;
    
    const matrix = [];
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return ((maxLen - distance) / maxLen) * 100;
  },

  /**
   * Find text differences (simple implementation)
   */
  findDifferences(original, migrated) {
    const differences = [];
    
    if (Math.abs(original.length - migrated.length) > 100) {
      differences.push(`Length difference: ${Math.abs(original.length - migrated.length)} characters`);
    }
    
    return differences;
  },

  /**
   * Batch migrate multiple lessons
   */
  async batchMigrate(fileList) {
    const results = [];
    
    for (const filePath of fileList) {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load ${filePath}: ${response.status}`);
        }
        
        const html = await response.text();
        const lesson = this.parseHTMLLesson(html, filePath);
        
        // Compare with original
        const comparison = this.compareContent(html, lesson);
        
        results.push({
          filePath,
          lesson,
          comparison,
          status: comparison.passed ? 'passed' : 'needs_review'
        });
        
      } catch (error) {
        results.push({
          filePath,
          error: error.message,
          status: 'failed'
        });
      }
    }
    
    return results;
  },

  /**
   * Export lesson as JSON file
   */
  exportJSON(lesson, filename = null) {
    const json = JSON.stringify(lesson, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${lesson.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  },

  /**
   * Validate lesson against schema
   */
  validateLesson(lesson) {
    const errors = [];
    const warnings = [];
    
    // Required fields
    if (!lesson.id) errors.push('Missing lesson ID');
    if (!lesson.title) errors.push('Missing lesson title');
    if (!lesson.module) errors.push('Missing module');
    if (!lesson.description) errors.push('Missing description');
    if (!lesson.duration) errors.push('Missing duration');
    
    // Content validation
    if (lesson.learningIntentions?.length === 0) {
      warnings.push('No learning intentions');
    }
    if (lesson.successCriteria?.length === 0) {
      warnings.push('No success criteria');
    }
    if (lesson.contentSections?.length === 0) {
      errors.push('No content sections');
    }
    
    // Pedagogical checks
    const totalAssessment = (lesson.assessment?.multipleChoice?.length || 0) + 
                           (lesson.assessment?.shortAnswer?.length || 0);
    if (totalAssessment === 0) {
      warnings.push('No assessment questions');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MigrationTool };
}
