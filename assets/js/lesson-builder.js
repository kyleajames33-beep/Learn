/**
 * Lesson Builder - Phase 0.3
 * State management and form logic for lesson creation
 */

const LessonBuilder = {
  // State
  state: {
    lesson: {
      id: '',
      title: '',
      module: '',
      moduleTitle: '',
      moduleNumber: null,
      lessonNumber: null,
      description: '',
      duration: '',
      difficulty: 'Foundation Level',
      worksOffline: true,
      learningIntentions: [],
      successCriteria: [],
      syllabusLinks: {
        module: '',
        inquiryQuestion: '',
        focus: ''
      },
      engagementHook: {
        title: '',
        content: ''
      },
      contentSections: [],
      activities: [],
      assessment: {
        multipleChoice: [],
        shortAnswer: []
      },
      navigation: {
        previous: null,
        previousTitle: null,
        next: null,
        nextTitle: null
      },
      meta: {
        author: 'Science Hub',
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        version: '1.0.0'
      }
    },
    validationErrors: [],
    unsavedChanges: false,
    autoSaveTimer: null
  },

  // Module mapping
  moduleMap: {
    'module-1-cells': { number: 1, title: 'Module 1: Cells as the Basis of Life', short: 'Module 1: Cells' },
    'module-2-organisation': { number: 2, title: 'Module 2: Organisation of Living Things', short: 'Module 2: Organisation' },
    'module-3-diversity': { number: 3, title: 'Module 3: Biological Diversity', short: 'Module 3: Diversity' },
    'module-4-ecosystems': { number: 4, title: 'Module 4: Ecosystems', short: 'Module 4: Ecosystems' },
    'module-5-heredity': { number: 5, title: 'Module 5: Heredity', short: 'Module 5: Heredity' },
    'module-6-genetic-change': { number: 6, title: 'Module 6: Genetic Change', short: 'Module 6: Genetic Change' },
    'module-7-infectious-disease': { number: 7, title: 'Module 7: Infectious Disease', short: 'Module 7: Infectious Disease' },
    'module-8-non-infectious-disease': { number: 8, title: 'Module 8: Non-Infectious Disease', short: 'Module 8: Non-Infectious Disease' }
  },

  /**
   * Initialize the builder
   */
  async init() {
    this.bindEvents();
    
    // Check for URL parameter ?edit=lesson-id
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
      // Try to load from data folder
      const loaded = await this.loadLessonFromFile(editId);
      if (loaded) {
        console.log(`Loaded lesson: ${editId}`);
      } else {
        // Fall back to localStorage if file not found
        this.loadFromLocalStorage();
      }
    } else {
      this.loadFromLocalStorage();
    }
    
    this.updateUI();
    this.startAutoSave();
    
    // Initialize empty dynamic lists
    this.renderContentSections();
    this.renderActivities();
    this.renderAssessment();
    this.initRichTextEditors();
  },

  /**
   * Load lesson from JSON file
   * @param {string} lessonId - The lesson ID to load
   * @returns {Promise<boolean>} - Success status
   */
  async loadLessonFromFile(lessonId) {
    try {
      const response = await fetch(`hsc-biology/data/lessons/${lessonId}.json`);
      if (!response.ok) {
        console.warn(`Lesson file not found: ${lessonId}`);
        return false;
      }
      
      const lesson = await response.json();
      this.state.lesson = { ...this.state.lesson, ...lesson };
      
      // Update last modified
      this.state.lesson.meta.lastModified = new Date().toISOString().split('T')[0];
      
      return true;
    } catch (error) {
      console.error('Error loading lesson:', error);
      return false;
    }
  },

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
    });

    // Metadata inputs
    document.getElementById('lessonTitle')?.addEventListener('input', (e) => {
      this.state.lesson.title = e.target.value;
      this.generateLessonId();
      this.markUnsaved();
      this.debounceUpdate();
    });

    document.getElementById('moduleSelect')?.addEventListener('change', (e) => {
      const moduleId = e.target.value;
      this.state.lesson.module = moduleId;
      const moduleInfo = this.moduleMap[moduleId];
      if (moduleInfo) {
        this.state.lesson.moduleTitle = moduleInfo.short;
        this.state.lesson.moduleNumber = moduleInfo.number;
        this.state.lesson.syllabusLinks.module = moduleInfo.title;
        document.getElementById('moduleNumber').value = moduleInfo.number;
      }
      this.generateLessonId();
      this.markUnsaved();
      this.debounceUpdate();
    });

    document.getElementById('lessonNumber')?.addEventListener('input', (e) => {
      this.state.lesson.lessonNumber = parseInt(e.target.value) || null;
      this.generateLessonId();
      this.markUnsaved();
      this.debounceUpdate();
    });

    document.getElementById('duration')?.addEventListener('change', (e) => {
      this.state.lesson.duration = e.target.value;
      this.markUnsaved();
      this.debounceUpdate();
    });

    document.getElementById('description')?.addEventListener('input', (e) => {
      this.state.lesson.description = e.target.value;
      this.markUnsaved();
      this.debounceUpdate();
    });

    // Difficulty radio buttons
    document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.lesson.difficulty = e.target.value;
        this.markUnsaved();
        this.debounceUpdate();
      });
    });

    // Syllabus links
    document.getElementById('inquiryQuestion')?.addEventListener('input', (e) => {
      this.state.lesson.syllabusLinks.inquiryQuestion = e.target.value;
      this.markUnsaved();
    });

    document.getElementById('syllabusFocus')?.addEventListener('input', (e) => {
      this.state.lesson.syllabusLinks.focus = e.target.value;
      this.markUnsaved();
    });

    // Engagement hook
    document.getElementById('hookTitle')?.addEventListener('input', (e) => {
      this.state.lesson.engagementHook.title = e.target.value;
      this.markUnsaved();
      this.debounceUpdate();
    });

    document.getElementById('hookContent')?.addEventListener('input', (e) => {
      this.state.lesson.engagementHook.content = e.target.value;
      this.markUnsaved();
      this.debounceUpdate();
    });

    // Dynamic list buttons
    document.getElementById('addIntentionBtn')?.addEventListener('click', () => this.addIntention());
    document.getElementById('addCriteriaBtn')?.addEventListener('click', () => this.addCriteria());

    // Section dropdown
    document.getElementById('addSectionBtn')?.addEventListener('click', () => {
      document.getElementById('sectionTypeMenu').parentElement.classList.toggle('open');
    });

    document.querySelectorAll('#sectionTypeMenu .dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        this.addContentSection(item.dataset.type);
        item.closest('.dropdown').classList.remove('open');
      });
    });

    // Activity dropdown
    document.getElementById('addActivityBtn')?.addEventListener('click', () => {
      document.getElementById('activityTypeMenu').parentElement.classList.toggle('open');
    });

    document.querySelectorAll('#activityTypeMenu .dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        this.addActivity(item.dataset.type);
        item.closest('.dropdown').classList.remove('open');
      });
    });

    // Add MCQ
    document.getElementById('addMCQBtn')?.addEventListener('click', () => this.addMCQ());

    // Header actions
    document.getElementById('loadExistingBtn')?.addEventListener('click', () => this.openLoadModal());
    document.getElementById('saveDraftBtn')?.addEventListener('click', () => this.saveToLocalStorage());
    document.getElementById('exportJsonBtn')?.addEventListener('click', () => this.exportJSON());

    // Modal
    document.getElementById('confirmLoadBtn')?.addEventListener('click', () => this.loadFromModal());
    document.getElementById('loadJsonFile')?.addEventListener('change', (e) => this.handleFileUpload(e));

    document.querySelectorAll('.modal-close, .modal-cancel, .modal-overlay').forEach(el => {
      el.addEventListener('click', () => this.closeLoadModal());
    });

    // JSON panel toggle
    document.getElementById('toggleJsonBtn')?.addEventListener('click', () => {
      document.getElementById('jsonPanel').classList.toggle('collapsed');
    });

    // Copy JSON
    document.getElementById('copyJsonBtn')?.addEventListener('click', () => this.copyJSON());

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
      }
    });

    // Dynamic list remove buttons (delegated)
    document.getElementById('learningIntentionsList')?.addEventListener('click', (e) => {
      if (e.target.closest('.remove-btn')) {
        e.target.closest('.dynamic-item').remove();
        this.updateIntentionsFromDOM();
      }
    });

    document.getElementById('successCriteriaList')?.addEventListener('click', (e) => {
      if (e.target.closest('.remove-btn')) {
        e.target.closest('.dynamic-item').remove();
        this.updateCriteriaFromDOM();
      }
    });

    // Input changes on dynamic lists
    document.getElementById('learningIntentionsList')?.addEventListener('input', () => {
      this.updateIntentionsFromDOM();
      this.markUnsaved();
    });

    document.getElementById('successCriteriaList')?.addEventListener('input', () => {
      this.updateCriteriaFromDOM();
      this.markUnsaved();
    });
  },

  /**
   * Generate lesson ID from title and module
   */
  generateLessonId() {
    const { title, module, lessonNumber } = this.state.lesson;
    if (module && lessonNumber) {
      const id = `${module}-lesson-${lessonNumber}`;
      this.state.lesson.id = id;
      document.getElementById('lessonId').value = id;
    }
  },

  /**
   * Switch between view modes
   */
  switchView(view) {
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.view-btn[data-view="${view}"]`)?.classList.add('active');
    
    const container = document.getElementById('builderContainer');
    container.className = 'builder-container';
    container.classList.add(`view-${view}`);
    
    if (view === 'split' || view === 'preview') {
      this.updatePreview();
    }
  },

  /**
   * Add learning intention
   */
  addIntention(value = '') {
    const container = document.getElementById('learningIntentionsList');
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.innerHTML = `
      <input type="text" class="form-input intention-input" placeholder="Students will be able to..." value="${value}">
      <button class="btn btn-icon btn-ghost remove-btn" title="Remove">
        <i data-lucide="x"></i>
      </button>
    `;
    container.appendChild(item);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    this.updateIntentionsFromDOM();
    this.markUnsaved();
  },

  /**
   * Add success criteria
   */
  addCriteria(value = '') {
    const container = document.getElementById('successCriteriaList');
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.innerHTML = `
      <input type="text" class="form-input criteria-input" placeholder="By the end of this lesson, students will..." value="${value}">
      <button class="btn btn-icon btn-ghost remove-btn" title="Remove">
        <i data-lucide="x"></i>
      </button>
    `;
    container.appendChild(item);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    this.updateCriteriaFromDOM();
    this.markUnsaved();
  },

  /**
   * Update intentions from DOM
   */
  updateIntentionsFromDOM() {
    const inputs = document.querySelectorAll('.intention-input');
    this.state.lesson.learningIntentions = Array.from(inputs).map(i => i.value).filter(v => v.trim());
  },

  /**
   * Update criteria from DOM
   */
  updateCriteriaFromDOM() {
    const inputs = document.querySelectorAll('.criteria-input');
    this.state.lesson.successCriteria = Array.from(inputs).map(i => i.value).filter(v => v.trim());
  },

  /**
   * Add content section
   */
  addContentSection(type) {
    const section = {
      id: `section-${Date.now()}`,
      type: type,
      title: '',
      icon: this.getDefaultIcon(type),
      content: ''
    };

    switch (type) {
      case 'grid':
        section.gridItems = [
          { title: '', icon: 'check', items: [] },
          { title: '', icon: 'activity', items: [] }
        ];
        break;
      case 'definition':
        section.term = '';
        section.definition = '';
        break;
      case 'accordion':
        section.open = false;
        section.items = [];
        break;
      case 'worked-example':
        break;
    }

    this.state.lesson.contentSections.push(section);
    this.renderContentSections();
    this.markUnsaved();
    this.debounceUpdate();
  },

  /**
   * Get default icon for section type
   */
  getDefaultIcon(type) {
    const icons = {
      'content': 'book-open',
      'definition': 'book-open',
      'grid': 'layers',
      'accordion': 'book-open',
      'worked-example': 'calculator'
    };
    return icons[type] || 'book-open';
  },

  /**
   * Render content sections
   */
  renderContentSections() {
    const container = document.getElementById('contentSectionsList');
    if (!container) return;

    // Hide/show empty state
    const emptyState = document.getElementById('emptySections');
    if (emptyState) {
      emptyState.style.display = this.state.lesson.contentSections.length > 0 ? 'none' : 'block';
    }

    // Remove existing cards (keep empty state)
    container.querySelectorAll('.builder-section-card').forEach(el => el.remove());

    if (this.state.lesson.contentSections.length === 0) return;

    // Add section cards
    const cardsHTML = this.state.lesson.contentSections.map((section, index) => `
      <div class="builder-section-card" data-index="${index}">
        <div class="builder-section-card-header">
          <span class="badge">${section.type}</span>
          <h4>Section ${index + 1}</h4>
          <button class="btn btn-icon btn-ghost remove-section-btn" data-index="${index}">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        <div class="form-group">
          <label>Section Title</label>
          <input type="text" class="form-input section-title" value="${section.title}" placeholder="e.g., What is a Cell?">
        </div>
        ${section.type === 'definition' ? `
          <div class="form-group">
            <label>Term</label>
            <input type="text" class="form-input section-term" value="${section.term || ''}" placeholder="e.g., Cell">
          </div>
          <div class="form-group">
            <label>Definition</label>
            <textarea class="form-textarea section-definition" rows="2" placeholder="Enter definition...">${section.definition || ''}</textarea>
          </div>
        ` : `
          <div class="form-group">
            <label>Content</label>
            <textarea class="form-textarea section-content" rows="4" placeholder="Enter content...">${section.content || ''}</textarea>
          </div>
        `}
      </div>
    `).join('');

    container.insertAdjacentHTML('beforeend', cardsHTML);

    // Bind events
    container.querySelectorAll('.remove-section-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.closest('.remove-section-btn').dataset.index);
        this.state.lesson.contentSections.splice(index, 1);
        this.renderContentSections();
        this.markUnsaved();
        this.debounceUpdate();
      });
    });

    container.querySelectorAll('.section-title').forEach((input, index) => {
      input.addEventListener('input', (e) => {
        this.state.lesson.contentSections[index].title = e.target.value;
        this.markUnsaved();
        this.debounceUpdate();
      });
    });

    container.querySelectorAll('.section-content').forEach((textarea, index) => {
      textarea.addEventListener('input', (e) => {
        this.state.lesson.contentSections[index].content = e.target.value;
        this.markUnsaved();
        this.debounceUpdate();
      });
    });

    container.querySelectorAll('.section-term').forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const section = this.state.lesson.contentSections[index];
        if (section.type === 'definition') {
          section.term = e.target.value;
          this.markUnsaved();
          this.debounceUpdate();
        }
      });
    });

    container.querySelectorAll('.section-definition').forEach((textarea, index) => {
      textarea.addEventListener('input', (e) => {
        const section = this.state.lesson.contentSections[index];
        if (section.type === 'definition') {
          section.definition = e.target.value;
          this.markUnsaved();
          this.debounceUpdate();
        }
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  /**
   * Add activity
   */
  addActivity(type) {
    const activity = {
      id: `activity-${Date.now()}`,
      type: type,
      title: '',
      description: '',
      theme: 'teal',
      items: []
    };

    if (type === 'matching') {
      activity.items = [
        { term: '', correctValue: '', options: [] }
      ];
    } else if (type === 'fill-blank') {
      activity.items = [
        { label: '', correctAnswer: '', placeholder: '', maxLength: 10 }
      ];
    }

    this.state.lesson.activities.push(activity);
    this.renderActivities();
    this.markUnsaved();
    this.debounceUpdate();
  },

  /**
   * Render activities
   */
  renderActivities() {
    const container = document.getElementById('activitiesList');
    if (!container) return;

    // Hide/show empty state
    const emptyState = document.getElementById('emptyActivities');
    if (emptyState) {
      emptyState.style.display = this.state.lesson.activities.length > 0 ? 'none' : 'block';
    }

    // Remove existing cards
    container.querySelectorAll('.activity-card').forEach(el => el.remove());

    if (this.state.lesson.activities.length === 0) return;

    const cardsHTML = this.state.lesson.activities.map((activity, index) => `
      <div class="activity-card" data-index="${index}">
        <div class="activity-header">
          <span class="badge">${activity.type}</span>
          <h4>Activity ${index + 1}</h4>
          <button class="btn btn-icon btn-ghost remove-activity-btn" data-index="${index}">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        <div class="form-group">
          <label>Title</label>
          <input type="text" class="form-input activity-title" value="${activity.title}" placeholder="e.g., Cell Matching">
        </div>
        <div class="form-group">
          <label>Description</label>
          <input type="text" class="form-input activity-desc" value="${activity.description}" placeholder="Instructions for students...">
        </div>
      </div>
    `).join('');

    container.insertAdjacentHTML('beforeend', cardsHTML);

    container.querySelectorAll('.remove-activity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.closest('.remove-activity-btn').dataset.index);
        this.state.lesson.activities.splice(index, 1);
        this.renderActivities();
        this.markUnsaved();
        this.debounceUpdate();
      });
    });

    container.querySelectorAll('.activity-title').forEach((input, index) => {
      input.addEventListener('input', (e) => {
        this.state.lesson.activities[index].title = e.target.value;
        this.markUnsaved();
        this.debounceUpdate();
      });
    });

    container.querySelectorAll('.activity-desc').forEach((input, index) => {
      input.addEventListener('input', (e) => {
        this.state.lesson.activities[index].description = e.target.value;
        this.markUnsaved();
        this.debounceUpdate();
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  /**
   * Add MCQ
   */
  addMCQ() {
    const mcq = {
      id: `q${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 'a'
    };

    this.state.lesson.assessment.multipleChoice.push(mcq);
    this.renderAssessment();
    this.markUnsaved();
    this.debounceUpdate();
  },

  /**
   * Render assessment
   */
  renderAssessment() {
    const container = document.getElementById('assessmentList');
    if (!container) return;

    // Hide/show empty state
    const emptyState = document.getElementById('emptyAssessment');
    const totalQuestions = (this.state.lesson.assessment.multipleChoice?.length || 0) + (this.state.lesson.assessment.shortAnswer?.length || 0);
    if (emptyState) {
      emptyState.style.display = totalQuestions > 0 ? 'none' : 'block';
    }

    // Remove existing cards
    container.querySelectorAll('.mcq-card').forEach(el => el.remove());

    if (!this.state.lesson.assessment.multipleChoice || this.state.lesson.assessment.multipleChoice.length === 0) return;

    const cardsHTML = this.state.lesson.assessment.multipleChoice.map((mcq, index) => `
      <div class="mcq-card" data-index="${index}">
        <div class="mcq-header">
          <div class="form-group">
            <label>Question ${index + 1}</label>
            <input type="text" class="form-input mcq-question" value="${mcq.question}" placeholder="Enter question...">
          </div>
          <button class="btn btn-icon btn-ghost remove-mcq-btn" data-index="${index}">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        <div class="mcq-options">
          ${mcq.options.map((opt, optIndex) => `
            <div class="mcq-option">
              <input type="radio" name="mcq-${index}" value="${String.fromCharCode(97 + optIndex)}" ${mcq.correctAnswer === String.fromCharCode(97 + optIndex) ? 'checked' : ''}>
              <input type="text" class="form-input mcq-option-text" value="${opt}" placeholder="Option ${String.fromCharCode(65 + optIndex)}">
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Insert HTML into container
    container.insertAdjacentHTML('beforeend', cardsHTML);

    // Initialize icons for new cards
    if (typeof lucide !== 'undefined') {
      container.querySelectorAll('.mcq-card i[data-lucide]').forEach(icon => {
        lucide.createIcons({ icons: { [icon.dataset.lucide]: lucide.icons[icon.dataset.lucide] }, nameAttr: 'data-lucide' });
      });
    }

    container.querySelectorAll('.remove-mcq-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.closest('.remove-mcq-btn').dataset.index);
        this.state.lesson.assessment.multipleChoice.splice(index, 1);
        this.renderAssessment();
        this.markUnsaved();
        this.debounceUpdate();
      });
    });

    container.querySelectorAll('.mcq-question').forEach((input, index) => {
      input.addEventListener('input', (e) => {
        this.state.lesson.assessment.multipleChoice[index].question = e.target.value;
        this.markUnsaved();
        this.debounceUpdate();
      });
    });

    container.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const card = e.target.closest('.mcq-card');
        const index = parseInt(card.dataset.index);
        this.state.lesson.assessment.multipleChoice[index].correctAnswer = e.target.value;
        this.markUnsaved();
      });
    });

    container.querySelectorAll('.mcq-option-text').forEach((input, optIndex) => {
      input.addEventListener('input', (e) => {
        const card = e.target.closest('.mcq-card');
        const mcqIndex = parseInt(card.dataset.index);
        const optionIndex = Array.from(card.querySelectorAll('.mcq-option-text')).indexOf(e.target);
        this.state.lesson.assessment.multipleChoice[mcqIndex].options[optionIndex] = e.target.value;
        this.markUnsaved();
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  /**
   * Debounced update
   */
  debounceTimer: null,
  debounceUpdate() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.updatePreview();
      this.updateJSON();
      this.validate();
    }, 500);
  },

  /**
   * Update preview
   */
  updatePreview() {
    const preview = document.getElementById('previewContent');
    if (!preview) return;

    // Check if we have minimum data
    if (!this.state.lesson.title && !this.state.lesson.description) {
      preview.innerHTML = `
        <div class="preview-placeholder">
          <i data-lucide="eye-off"></i>
          <p>Start building your lesson to see the preview</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    // Use LessonRenderer if available
    if (typeof LessonRenderer !== 'undefined') {
      // Temporarily override the current lesson
      const originalLesson = LessonRenderer.currentLesson;
      LessonRenderer.currentLesson = this.buildFullLesson();
      
      preview.innerHTML = `
        <div class="lesson-preview-wrapper">
          ${LessonRenderer.renderHero(this.state.lesson)}
          ${LessonRenderer.renderInfoCards(this.state.lesson)}
          ${this.state.lesson.engagementHook?.content ? LessonRenderer.renderEngagementHook(this.state.lesson.engagementHook) : ''}
          ${LessonRenderer.renderContentSections(this.state.lesson.contentSections)}
          ${LessonRenderer.renderActivities(this.state.lesson.activities)}
          ${LessonRenderer.renderMarkComplete(this.state.lesson)}
        </div>
      `;
      
      LessonRenderer.currentLesson = originalLesson;
    } else {
      // Fallback basic preview
      preview.innerHTML = this.renderBasicPreview();
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  /**
   * Build full lesson object for rendering
   */
  buildFullLesson() {
    return {
      ...this.state.lesson,
      moduleLessons: [
        { id: this.state.lesson.id, number: this.state.lesson.lessonNumber || 1, title: this.state.lesson.title }
      ]
    };
  },

  /**
   * Render basic preview (fallback)
   */
  renderBasicPreview() {
    const lesson = this.state.lesson;
    return `
      <div style="background: white; padding: 24px; border-radius: 12px;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">${lesson.title || 'Untitled Lesson'}</h1>
        <p style="color: #64748b; margin-bottom: 24px;">${lesson.description || ''}</p>
        
        ${lesson.learningIntentions.length ? `
          <h3 style="margin-bottom: 12px;">Learning Intentions</h3>
          <ul style="padding-left: 20px; margin-bottom: 24px;">
            ${lesson.learningIntentions.map(i => `<li>${i}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${lesson.contentSections.length ? `
          <h3 style="margin-bottom: 12px;">Content Sections</h3>
          ${lesson.contentSections.map(s => `
            <div style="margin-bottom: 16px; padding: 16px; background: #f8fafc; border-radius: 8px;">
              <h4>${s.title || 'Untitled Section'}</h4>
              <p style="color: #64748b;">${s.content || ''}</p>
            </div>
          `).join('')}
        ` : ''}
      </div>
    `;
  },

  /**
   * Update JSON output
   */
  updateJSON() {
    const output = document.getElementById('jsonOutput');
    if (!output) return;

    const json = JSON.stringify(this.buildFullLesson(), null, 2);
    output.textContent = json;
  },

  /**
   * Validate lesson
   */
  validate() {
    const errors = [];
    const lesson = this.state.lesson;

    if (!lesson.title.trim()) errors.push('Title is required');
    if (!lesson.module) errors.push('Module is required');
    if (!lesson.lessonNumber) errors.push('Lesson number is required');
    if (!lesson.description.trim()) errors.push('Description is required');
    if (lesson.learningIntentions.length === 0) errors.push('At least one learning intention is required');

    this.state.validationErrors = errors;

    // Update UI
    const status = document.getElementById('validationStatus');
    if (status) {
      if (errors.length === 0) {
        status.classList.remove('invalid');
        status.innerHTML = '<i data-lucide="check-circle"></i><span>Valid</span>';
      } else {
        status.classList.add('invalid');
        status.innerHTML = `<i data-lucide="alert-circle"></i><span>${errors.length} error${errors.length > 1 ? 's' : ''}</span>`;
      }
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    return errors.length === 0;
  },

  /**
   * Mark as unsaved
   */
  markUnsaved() {
    this.state.unsavedChanges = true;
    
    // Show unsaved indicator
    const indicator = document.getElementById('unsavedIndicator');
    if (indicator) {
      indicator.style.display = 'inline-flex';
    }
  },

  /**
   * Save to local storage
   */
  saveToLocalStorage() {
    try {
      localStorage.setItem('lesson-builder-draft', JSON.stringify(this.state.lesson));
      this.state.unsavedChanges = false;
      
      // Hide unsaved indicator
      const indicator = document.getElementById('unsavedIndicator');
      if (indicator) {
        indicator.style.display = 'none';
      }
      
      this.showAutosaveIndicator();
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  },

  /**
   * Load from local storage
   */
  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('lesson-builder-draft');
      if (saved) {
        const lesson = JSON.parse(saved);
        this.state.lesson = { ...this.state.lesson, ...lesson };
        this.populateForm();
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
  },

  /**
   * Populate form from state
   */
  populateForm() {
    const lesson = this.state.lesson;

    document.getElementById('lessonTitle').value = lesson.title || '';
    document.getElementById('lessonId').value = lesson.id || '';
    document.getElementById('moduleSelect').value = lesson.module || '';
    document.getElementById('moduleNumber').value = lesson.moduleNumber || '';
    document.getElementById('lessonNumber').value = lesson.lessonNumber || '';
    document.getElementById('duration').value = lesson.duration || '';
    document.getElementById('description').value = lesson.description || '';
    document.getElementById('inquiryQuestion').value = lesson.syllabusLinks?.inquiryQuestion || '';
    document.getElementById('syllabusFocus').value = lesson.syllabusLinks?.focus || '';
    document.getElementById('hookTitle').value = lesson.engagementHook?.title || '';
    document.getElementById('hookContent').value = lesson.engagementHook?.content || '';

    // Difficulty
    const difficultyRadio = document.querySelector(`input[name="difficulty"][value="${lesson.difficulty}"]`);
    if (difficultyRadio) difficultyRadio.checked = true;

    // Learning intentions
    document.getElementById('learningIntentionsList').innerHTML = '';
    if (lesson.learningIntentions?.length) {
      lesson.learningIntentions.forEach(i => this.addIntention(i));
    } else {
      this.addIntention();
    }

    // Success criteria
    document.getElementById('successCriteriaList').innerHTML = '';
    if (lesson.successCriteria?.length) {
      lesson.successCriteria.forEach(c => this.addCriteria(c));
    } else {
      this.addCriteria();
    }

    // Re-render dynamic content
    this.renderContentSections();
    this.renderActivities();
    this.renderAssessment();
    this.updateJSON();
  },

  /**
   * Start auto-save timer
   */
  startAutoSave() {
    setInterval(() => {
      if (this.state.unsavedChanges) {
        this.saveToLocalStorage();
      }
    }, 30000); // 30 seconds
  },

  /**
   * Show autosave indicator
   */
  showAutosaveIndicator() {
    const indicator = document.getElementById('autosaveIndicator');
    if (indicator) {
      indicator.classList.add('show');
      setTimeout(() => indicator.classList.remove('show'), 2000);
    }
  },

  /**
   * Open load modal
   */
  openLoadModal() {
    document.getElementById('loadModal').classList.add('open');
  },

  /**
   * Close load modal
   */
  closeLoadModal() {
    document.getElementById('loadModal').classList.remove('open');
  },

  /**
   * Handle file upload
   */
  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('loadJsonInput').value = e.target.result;
    };
    reader.readAsText(file);
  },

  /**
   * Load from modal
   */
  loadFromModal() {
    const json = document.getElementById('loadJsonInput').value;
    if (!json.trim()) {
      alert('Please paste JSON or upload a file');
      return;
    }

    try {
      const lesson = JSON.parse(json);
      
      // Validate required fields
      if (!lesson.title) {
        alert('Invalid lesson JSON: missing title');
        return;
      }

      this.state.lesson = { ...this.state.lesson, ...lesson };
      this.populateForm();
      this.closeLoadModal();
      this.markUnsaved();
      this.debounceUpdate();
      
      // Clear inputs
      document.getElementById('loadJsonInput').value = '';
      document.getElementById('loadJsonFile').value = '';
      
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  },

  /**
   * Export JSON
   */
  exportJSON() {
    if (!this.validate()) {
      alert('Please fix validation errors before exporting:\n\n' + this.state.validationErrors.join('\n'));
      return;
    }

    const lesson = this.buildFullLesson();
    const json = JSON.stringify(lesson, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.id || 'lesson'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Copy JSON to clipboard
   */
  copyJSON() {
    const json = JSON.stringify(this.buildFullLesson(), null, 2);
    navigator.clipboard.writeText(json).then(() => {
      const btn = document.getElementById('copyJsonBtn');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i data-lucide="check"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 2000);
    });
  },

  /**
   * Initialize rich text editors
   */
  initRichTextEditors() {
    // Add rich text toolbar to existing textareas
    document.querySelectorAll('.form-textarea:not([data-rich-init])').forEach(textarea => {
      this.makeRichTextEditor(textarea);
    });
  },

  /**
   * Convert textarea to rich text editor
   */
  makeRichTextEditor(textarea) {
    textarea.dataset.richInit = 'true';
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'rich-editor-wrapper';
    
    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'rich-editor-toolbar';
    toolbar.innerHTML = `
      <button type="button" data-cmd="bold" title="Bold"><b>B</b></button>
      <button type="button" data-cmd="italic" title="Italic"><i>I</i></button>
      <button type="button" data-cmd="underline" title="Underline"><u>U</u></button>
      <span class="toolbar-divider"></span>
      <button type="button" data-cmd="insertUnorderedList" title="Bullet List">• List</button>
      <button type="button" data-cmd="insertOrderedList" title="Numbered List">1. List</button>
      <span class="toolbar-divider"></span>
      <button type="button" data-cmd="createLink" title="Insert Link">🔗</button>
      <button type="button" data-cmd="removeFormat" title="Clear Formatting">✕</button>
    `;
    
    // Create editable div
    const editor = document.createElement('div');
    editor.className = 'rich-editor-content';
    editor.contentEditable = true;
    editor.innerHTML = textarea.value;
    
    // Style to match textarea
    editor.style.minHeight = textarea.rows * 24 + 'px';
    editor.style.padding = '10px 12px';
    editor.style.border = '1px solid var(--border-color, #e2e8f0)';
    editor.style.borderRadius = '8px';
    editor.style.fontSize = '14px';
    editor.style.lineHeight = '1.6';
    editor.style.background = 'white';
    
    // Hide original textarea but keep it for form submission
    textarea.style.display = 'none';
    
    // Insert wrapper
    textarea.parentNode.insertBefore(wrapper, textarea);
    wrapper.appendChild(toolbar);
    wrapper.appendChild(editor);
    wrapper.appendChild(textarea);
    
    // Toolbar events
    toolbar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        
        if (cmd === 'createLink') {
          const url = prompt('Enter URL:');
          if (url) document.execCommand(cmd, false, url);
        } else {
          document.execCommand(cmd, false, null);
        }
        
        editor.focus();
        this.updateTextareaFromEditor(editor, textarea);
      });
    });
    
    // Sync editor to textarea
    editor.addEventListener('input', () => {
      this.updateTextareaFromEditor(editor, textarea);
      this.markUnsaved();
      this.debounceUpdate();
    });
    
    // Sync textarea to editor (for external updates)
    textarea.addEventListener('change', () => {
      if (editor.innerHTML !== textarea.value) {
        editor.innerHTML = textarea.value;
      }
    });
  },

  /**
   * Sync editor content to textarea
   */
  updateTextareaFromEditor(editor, textarea) {
    // Clean up the HTML
    let content = editor.innerHTML;
    
    // Remove unnecessary attributes
    content = content.replace(/ style="[^"]*"/g, '');
    content = content.replace(/ class="[^"]*"/g, '');
    content = content.replace(/ data-[^=]*="[^"]*"/g, '');
    
    // Convert divs to paragraphs
    content = content.replace(/<div>/g, '<p>');
    content = content.replace(/<\/div>/g, '</p>');
    
    textarea.value = content;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  },

  /**
   * Update UI after state change
   */
  updateUI() {
    this.populateForm();
    this.updatePreview();
    this.updateJSON();
    this.validate();
  },

  // ==========================================
  // PHASE 0.6 ENHANCEMENTS
  // ==========================================

  /**
   * Initialize Phase 0.6 modules
   */
  initPhase06() {
    // Initialize Image Manager
    if (typeof ImageManager !== 'undefined') {
      ImageManager.init({
        lessonId: this.state.lesson.id || 'draft',
        existingImages: this.state.lesson.imageLibrary || [],
        callbacks: {
          onImageAdded: (image) => {
            this.state.lesson.imageLibrary = ImageManager.getImages();
            this.renderImageGallery();
            this.markUnsaved();
          },
          onImageRemoved: (image) => {
            this.state.lesson.imageLibrary = ImageManager.getImages();
            this.renderImageGallery();
            this.markUnsaved();
          },
          onError: (error) => {
            alert('Image Error: ' + error);
          }
        }
      });
      this.renderImageGallery();
      this.bindImageUploadEvents();
    }

    // Initialize Template Library
    if (typeof TemplateLibrary !== 'undefined') {
      TemplateLibrary.init({
        callbacks: {
          onTemplateSelected: (templateId) => {
            this.applyTemplate(templateId);
          }
        }
      });
    }

    // Bind template library button
    document.getElementById('openTemplateLibraryBtn')?.addEventListener('click', () => {
      this.openTemplateLibrary();
    });
  },

  /**
   * Bind image upload events
   */
  bindImageUploadEvents() {
    const uploadArea = document.getElementById('imageUploadArea');
    const fileInput = document.getElementById('imageFileInput');

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    // File selection
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleImageUpload(e.target.files);
      }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      
      if (e.dataTransfer.files.length > 0) {
        this.handleImageUpload(e.dataTransfer.files);
      }
    });

    // Upload button
    document.getElementById('uploadImageBtn')?.addEventListener('click', () => {
      fileInput.click();
    });
  },

  /**
   * Handle image file upload
   * @param {FileList} files 
   */
  async handleImageUpload(files) {
    const uploadArea = document.getElementById('imageUploadArea');
    uploadArea.classList.add('uploading');

    try {
      const { results, errors } = await ImageManager.uploadMultiple(files, (progress) => {
        uploadArea.innerHTML = `
          <div class="upload-progress">
            <div class="upload-progress-bar" style="width: ${progress.percent}%"></div>
            <span>Uploading ${progress.current} of ${progress.total}...</span>
          </div>
        `;
      });

      // Reset upload area
      uploadArea.classList.remove('uploading');
      uploadArea.innerHTML = `
        <i data-lucide="upload-cloud"></i>
        <p>Drag and drop images here, or click to browse</p>
        <span class="upload-hint">JPG, PNG, GIF, SVG, WebP (max 2MB)</span>
      `;

      if (errors.length > 0) {
        alert(`Uploaded ${results.filter(r => r.success).length} images.\nErrors: ${errors.map(e => e.filename + ': ' + e.error).join('\n')}`);
      }

      if (typeof lucide !== 'undefined') lucide.createIcons();

    } catch (error) {
      uploadArea.classList.remove('uploading');
      alert('Upload failed: ' + error.message);
    }
  },

  /**
   * Render image gallery
   */
  renderImageGallery() {
    const gallery = document.getElementById('imageGallery');
    if (!gallery) return;

    const images = ImageManager.getImages();

    if (images.length === 0) {
      gallery.innerHTML = '<p class="gallery-empty">No images uploaded yet</p>';
      return;
    }

    gallery.innerHTML = images.map(img => `
      <div class="image-card" data-image-id="${img.id}">
        <img src="${img.thumbnail || img.src}" alt="${this.escapeHtml(img.alt)}" loading="lazy">
        <div class="image-card-overlay">
          <button class="btn btn-icon btn-sm btn-ghost image-insert-btn" data-image-id="${img.id}" title="Insert into content">
            <i data-lucide="plus"></i>
          </button>
          <button class="btn btn-icon btn-sm btn-ghost image-use-diagram-btn" data-image-id="${img.id}" title="Use in diagram">
            <i data-lucide="map"></i>
          </button>
          <button class="btn btn-icon btn-sm btn-ghost image-delete-btn" data-image-id="${img.id}" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
        ${img.alt ? `<span class="image-alt">${this.escapeHtml(img.alt.substring(0, 20))}${img.alt.length > 20 ? '...' : ''}</span>` : ''}
      </div>
    `).join('');

    // Bind events
    gallery.querySelectorAll('.image-insert-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const imageId = e.currentTarget.dataset.imageId;
        this.insertImageIntoContent(imageId);
      });
    });

    gallery.querySelectorAll('.image-use-diagram-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const imageId = e.currentTarget.dataset.imageId;
        this.createDiagramFromImage(imageId);
      });
    });

    gallery.querySelectorAll('.image-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const imageId = e.currentTarget.dataset.imageId;
        if (confirm('Delete this image?')) {
          ImageManager.removeImage(imageId);
        }
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  /**
   * Insert image into content section
   * @param {string} imageId 
   */
  insertImageIntoContent(imageId) {
    const image = ImageManager.getImage(imageId);
    if (!image) return;

    // Add image section to content sections
    const section = {
      id: `section-${Date.now()}`,
      type: 'image',
      title: image.caption || image.alt || 'Image',
      icon: 'image',
      content: '',
      image: {
        src: image.src,
        srcWebp: image.srcWebp,
        thumbnail: image.thumbnail,
        alt: image.alt,
        caption: image.caption,
        credit: image.credit,
        width: image.width,
        height: image.height
      }
    };

    this.state.lesson.contentSections.push(section);
    this.renderContentSections();
    this.markUnsaved();
    this.debounceUpdate();

    // Scroll to new section
    const sections = document.querySelectorAll('.builder-section-card');
    if (sections.length > 0) {
      sections[sections.length - 1].scrollIntoView({ behavior: 'smooth' });
    }
  },

  /**
   * Create diagram from image
   * @param {string} imageId 
   */
  createDiagramFromImage(imageId) {
    const image = ImageManager.getImage(imageId);
    if (!image || typeof DiagramTool === 'undefined') return;

    const diagram = DiagramTool.createDiagram(image, image.alt || 'Diagram');
    
    // Add diagram section
    const section = {
      id: `section-${Date.now()}`,
      type: 'diagram',
      title: diagram.title,
      icon: 'map',
      content: '',
      diagram: diagram
    };

    this.state.lesson.contentSections.push(section);
    this.renderContentSections();
    this.markUnsaved();
    this.debounceUpdate();

    // Open diagram editor modal
    this.openDiagramEditor(section.id);
  },

  /**
   * Open diagram editor modal
   * @param {string} sectionId 
   */
  openDiagramEditor(sectionId) {
    const section = this.state.lesson.contentSections.find(s => s.id === sectionId);
    if (!section || !section.diagram) return;

    // Load diagram into tool
    DiagramTool.loadDiagram(section.diagram);

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal open';
    modal.id = 'diagramEditorModal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content modal-content--xlarge">
        <div class="modal-header">
          <h3>Edit Diagram: ${this.escapeHtml(section.diagram.title)}</h3>
          <button class="btn btn-icon btn-ghost modal-close" onclick="document.getElementById('diagramEditorModal').remove()">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="diagram-editor-layout">
            <div class="diagram-canvas-panel">
              <div id="diagramBuilderCanvas"></div>
            </div>
            <div class="diagram-tools-panel">
              <div class="tool-section">
                <h4>Hotspots</h4>
                <button class="btn btn-secondary btn-sm" id="addHotspotBtn">
                  <i data-lucide="plus-circle"></i>
                  Add Hotspot
                </button>
              </div>
              <div class="tool-section" id="hotspotProperties" style="display: none;">
                <h4>Hotspot Properties</h4>
                <div class="form-group">
                  <label>Type</label>
                  <select class="form-select" id="hotspotType">
                    <option value="popup">Info Popup</option>
                    <option value="label">Label Reveal</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Title</label>
                  <input type="text" class="form-input" id="hotspotTitle" placeholder="Hotspot title">
                </div>
                <div class="form-group">
                  <label>Content</label>
                  <textarea class="form-textarea" id="hotspotContent" rows="3" placeholder="Description..."></textarea>
                </div>
                <div class="form-group">
                  <label>Color</label>
                  <div class="color-picker">
                    ${DiagramTool.config.hotspotColors.map(c => `
                      <button class="color-option" style="background-color: ${c.value};" 
                              data-color="${c.value}" title="${c.name}"></button>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('diagramEditorModal').remove()">Cancel</button>
          <button class="btn btn-primary" id="saveDiagramBtn">Save Diagram</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Render diagram canvas
    const canvasContainer = document.getElementById('diagramBuilderCanvas');
    DiagramTool.renderBuilder(canvasContainer);

    // Bind save
    document.getElementById('saveDiagramBtn').addEventListener('click', () => {
      section.diagram = DiagramTool.export();
      this.renderContentSections();
      this.markUnsaved();
      this.debounceUpdate();
      modal.remove();
    });

    // Bind add hotspot
    document.getElementById('addHotspotBtn').addEventListener('click', () => {
      DiagramTool.addHotspot({
        x: 50,
        y: 50,
        type: 'popup',
        title: 'New Hotspot',
        content: 'Add description here...'
      });
      DiagramTool.renderBuilder(canvasContainer);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  /**
   * Open template library modal
   */
  openTemplateLibrary() {
    const modal = document.createElement('div');
    modal.className = 'modal open';
    modal.id = 'templateLibraryModal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content modal-content--xlarge">
        <div class="modal-header">
          <h3>Template Library</h3>
          <button class="btn btn-icon btn-ghost modal-close" onclick="document.getElementById('templateLibraryModal').remove()">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div id="templateBrowser"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Render template browser
    const browser = document.getElementById('templateBrowser');
    TemplateLibrary.renderBrowser(browser);

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  /**
   * Apply a template
   * @param {string} templateId 
   */
  applyTemplate(templateId) {
    try {
      const { template, diagram, labelingActivity } = TemplateLibrary.applyTemplate(templateId);

      // Add diagram if created
      if (diagram) {
        const section = {
          id: `section-${Date.now()}`,
          type: 'diagram',
          title: diagram.title,
          icon: 'map',
          content: '',
          diagram: diagram
        };
        this.state.lesson.contentSections.push(section);
      }

      // Add labeling activity if created
      if (labelingActivity) {
        this.state.lesson.activities.push(labelingActivity);
      }

      this.renderContentSections();
      this.renderActivities();
      this.markUnsaved();
      this.debounceUpdate();

      // Close modal
      document.getElementById('templateLibraryModal')?.remove();

      alert(`Template "${template.name}" applied!`);

    } catch (error) {
      alert('Failed to apply template: ' + error.message);
    }
  },

  /**
   * Escape HTML entities
   * @param {string} text 
   * @returns {string}
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Handle new activity types (Phase 0.6)
   * @param {string} type 
   */
  addActivityExtended(type) {
    const baseActivity = {
      id: `activity-${Date.now()}`,
      type: type,
      title: '',
      description: '',
      theme: 'teal'
    };

    let activity;

    switch (type) {
      case 'ordering':
        activity = ActivityOrdering.create({
          id: baseActivity.id,
          title: 'Ordering Activity',
          items: [
            { id: '1', text: 'Step 1', correctPosition: 1 },
            { id: '2', text: 'Step 2', correctPosition: 2 },
            { id: '3', text: 'Step 3', correctPosition: 3 }
          ]
        });
        break;

      case 'labeling':
        activity = ActivityLabeling.create({
          id: baseActivity.id,
          title: 'Label the Diagram',
          image: null,
          labels: []
        });
        break;

      case 'fillBlank':
        activity = ActivityFillBlank.create({
          id: baseActivity.id,
          title: 'Fill in the Blanks',
          text: 'The [blank1] is the powerhouse of the cell. [blank2] is the process of cell division.',
          blanks: [
            { id: 'blank1', correct: 'mitochondria', alternatives: ['mitochondrion'] },
            { id: 'blank2', correct: 'mitosis', alternatives: [] }
          ]
        });
        break;

      default:
        // Fall back to original addActivity
        return this.addActivity(type);
    }

    this.state.lesson.activities.push(activity);
    this.renderActivities();
    this.markUnsaved();
    this.debounceUpdate();
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  LessonBuilder.init();
  
  // Initialize Phase 0.6 modules
  setTimeout(() => {
    LessonBuilder.initPhase06();
  }, 100);
});
