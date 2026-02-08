/**
 * HSC Biology - Lesson Renderer
 * Phase 1.0 - With Prerequisite Lock, Calculation Tolerance, Completion Tracking
 * Version: 1.1.0
 * 
 * Renders lesson data from JSON into the lesson template
 */

/**
 * ActivityLabeling - Simple labeling activity component
 */
const ActivityLabeling = {
  render(activity, options = {}) {
    const theme = options.theme || 'biology';
    const items = activity.items || [];
    
    return `
      <div class="activity-card theme-${theme}" data-activity="labeling">
        <div class="activity-header">
          <h3>
            <i data-lucide="tag"></i>
            ${activity.title || 'Labeling Activity'}
          </h3>
          ${activity.xpReward ? `<span class="xp-badge">+${activity.xpReward} XP</span>` : ''}
        </div>
        <div class="activity-content">
          ${activity.description ? `<p class="activity-description">${activity.description}</p>` : ''}
          <div class="labeling-container">
            ${items.map((item, idx) => `
              <div class="labeling-item" data-item-id="${item.id}">
                <span class="labeling-number">${idx + 1}</span>
                <input type="text" 
                       class="labeling-input" 
                       placeholder="Enter label..."
                       data-correct="${item.correctLabel.toLowerCase()}">
                <span class="labeling-hint">${item.hint || ''}</span>
              </div>
            `).join('')}
          </div>
          <button class="activity-submit-btn" data-activity-type="labeling">Check Answers</button>
          <div class="activity-feedback"></div>
        </div>
      </div>
    `;
  },

  bindEvents(document) {
    document.querySelectorAll('[data-activity="labeling"]').forEach(container => {
      const submitBtn = container.querySelector('.activity-submit-btn');
      const feedback = container.querySelector('.activity-feedback');
      
      if (submitBtn && !submitBtn.dataset.bound) {
        submitBtn.dataset.bound = 'true';
        submitBtn.addEventListener('click', () => {
          const items = container.querySelectorAll('.labeling-item');
          let correct = 0;
          
          items.forEach(item => {
            const input = item.querySelector('.labeling-input');
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = input.dataset.correct;
            
            if (userAnswer === correctAnswer) {
              input.classList.add('correct');
              input.classList.remove('incorrect');
              correct++;
            } else {
              input.classList.add('incorrect');
              input.classList.remove('correct');
            }
          });
          
          if (feedback) {
            const total = items.length;
            feedback.innerHTML = `<p class="feedback-message ${correct === total ? 'success' : 'partial'}">
              You got ${correct} out of ${total} correct!
            </p>`;
          }
        });
      }
    });
  }
};

/**
 * ActivityOrdering - Simple ordering/sequencing activity component
 */
const ActivityOrdering = {
  render(activity, options = {}) {
    const theme = options.theme || 'biology';
    const items = activity.items || [];
    
    return `
      <div class="activity-card theme-${theme}" data-activity="ordering">
        <div class="activity-header">
          <h3>
            <i data-lucide="arrow-up-down"></i>
            ${activity.title || 'Ordering Activity'}
          </h3>
          ${activity.xpReward ? `<span class="xp-badge">+${activity.xpReward} XP</span>` : ''}
        </div>
        <div class="activity-content">
          ${activity.description ? `<p class="activity-description">${activity.description}</p>` : ''}
          <div class="ordering-container">
            ${items.map((item, idx) => `
              <div class="ordering-item" data-item-id="${item.id}" data-order="${item.correctOrder}">
                <span class="order-number">${idx + 1}</span>
                <span class="order-content">${item.content}</span>
                <div class="order-controls">
                  <button class="order-btn up" data-action="up"><i data-lucide="chevron-up"></i></button>
                  <button class="order-btn down" data-action="down"><i data-lucide="chevron-down"></i></button>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="activity-submit-btn" data-activity-type="ordering">Check Order</button>
          <div class="activity-feedback"></div>
        </div>
      </div>
    `;
  },

  bindEvents(document) {
    document.querySelectorAll('[data-activity="ordering"]').forEach(container => {
      const itemsContainer = container.querySelector('.ordering-container');
      
      // Handle up/down buttons
      container.querySelectorAll('.order-btn').forEach(btn => {
        if (!btn.dataset.bound) {
          btn.dataset.bound = 'true';
          btn.addEventListener('click', (e) => {
            const item = e.target.closest('.ordering-item');
            const action = e.target.closest('.order-btn').dataset.action;
            
            if (action === 'up' && item.previousElementSibling) {
              itemsContainer.insertBefore(item, item.previousElementSibling);
            } else if (action === 'down' && item.nextElementSibling) {
              itemsContainer.insertBefore(item.nextElementSibling, item);
            }
            
            // Update order numbers
            container.querySelectorAll('.ordering-item').forEach((el, idx) => {
              el.querySelector('.order-number').textContent = idx + 1;
            });
          });
        }
      });
      
      // Handle check button
      const submitBtn = container.querySelector('.activity-submit-btn');
      const feedback = container.querySelector('.activity-feedback');
      
      if (submitBtn && !submitBtn.dataset.bound) {
        submitBtn.dataset.bound = 'true';
        submitBtn.addEventListener('click', () => {
          const items = container.querySelectorAll('.ordering-item');
          let correct = 0;
          
          items.forEach((item, idx) => {
            const correctOrder = parseInt(item.dataset.order);
            if (correctOrder === idx + 1) {
              item.classList.add('correct');
              item.classList.remove('incorrect');
              correct++;
            } else {
              item.classList.add('incorrect');
              item.classList.remove('correct');
            }
          });
          
          if (feedback) {
            const total = items.length;
            feedback.innerHTML = `<p class="feedback-message ${correct === total ? 'success' : 'partial'}">
              You got ${correct} out of ${total} in correct order!
            </p>`;
          }
        });
      }
    });
  }
};

/**
 * ActivityFillBlank - Fill in the blank activity component
 */
const ActivityFillBlank = {
  render(activity, options = {}) {
    const theme = options.theme || 'biology';
    const blanks = activity.blanks || [];
    let text = activity.text || '';
    
    // Replace [blank] placeholders with input fields
    blanks.forEach((blank, idx) => {
      text = text.replace(
        '[blank]',
        `<input type="text" class="fill-blank-input" data-blank-id="${blank.id}" data-correct="${blank.answer.toLowerCase()}" placeholder="...">`
      );
    });
    
    return `
      <div class="activity-card theme-${theme}" data-activity="fillBlank">
        <div class="activity-header">
          <h3>
            <i data-lucide="edit-3"></i>
            ${activity.title || 'Fill in the Blanks'}
          </h3>
          ${activity.xpReward ? `<span class="xp-badge">+${activity.xpReward} XP</span>` : ''}
        </div>
        <div class="activity-content">
          ${activity.description ? `<p class="activity-description">${activity.description}</p>` : ''}
          <div class="fill-blank-text">${text}</div>
          <button class="activity-submit-btn" data-activity-type="fillBlank">Check Answers</button>
          <div class="activity-feedback"></div>
        </div>
      </div>
    `;
  },

  bindEvents(document) {
    document.querySelectorAll('[data-activity="fillBlank"]').forEach(container => {
      const submitBtn = container.querySelector('.activity-submit-btn');
      const feedback = container.querySelector('.activity-feedback');
      
      if (submitBtn && !submitBtn.dataset.bound) {
        submitBtn.dataset.bound = 'true';
        submitBtn.addEventListener('click', () => {
          const inputs = container.querySelectorAll('.fill-blank-input');
          let correct = 0;
          
          inputs.forEach(input => {
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = input.dataset.correct;
            
            if (userAnswer === correctAnswer) {
              input.classList.add('correct');
              input.classList.remove('incorrect');
              correct++;
            } else {
              input.classList.add('incorrect');
              input.classList.remove('correct');
            }
          });
          
          if (feedback) {
            const total = inputs.length;
            feedback.innerHTML = `<p class="feedback-message ${correct === total ? 'success' : 'partial'}">
              You got ${correct} out of ${total} correct!
            </p>`;
          }
        });
      }
    });
  }
};

const LessonRenderer = {
  version: '1.1.0',
  
  // Current lesson data
  currentLesson: null,
  
  // Calculation tolerance percentage (default 5%)
  calculationTolerance: 0.05,
  
  // Icon mapping for Lucide icons
  iconMap: {
    'book-open': 'book-open',
    'microscope': 'microscope',
    'layers': 'layers',
    'activity': 'activity',
    'calculator': 'calculator',
    'check': 'check',
    'target': 'target',
    'link': 'link',
    'check-circle': 'check-circle',
    'clipboard-check': 'clipboard-check',
    'circle-dot': 'circle-dot',
    'align-left': 'align-left',
    'pen-tool': 'pen-tool',
    'lightbulb': 'lightbulb',
    'clock': 'clock',
    'signal': 'signal',
    'wifi-off': 'wifi-off',
    'grid-3x3': 'grid-3x3',
    'chevron-left': 'chevron-left',
    'chevron-right': 'chevron-right',
    'menu': 'menu',
    'atom': 'atom',
    'key': 'key',
    'list-checks': 'list-checks'
  },
  
  // ==========================================
  // PRIORITY FEATURES: Prerequisites, Completion, Calculations
  // ==========================================
  
  /**
   * Check if a lesson is completed
   * @param {string} lessonId - The lesson ID to check
   * @returns {boolean}
   */
  isLessonCompleted(lessonId) {
    try {
      const key = 'hsc-biology-completed-lessons';
      const data = localStorage.getItem(key);
      if (data) {
        const completed = JSON.parse(data);
        return completed[lessonId] === true;
      }
    } catch (e) {
      console.error('Error checking completion:', e);
    }
    return false;
  },
  
  /**
   * Mark a lesson as completed
   * @param {string} lessonId - The lesson ID to mark
   */
  markLessonCompleted(lessonId) {
    try {
      const key = 'hsc-biology-completed-lessons';
      let data = localStorage.getItem(key);
      let completed = data ? JSON.parse(data) : {};
      completed[lessonId] = true;
      completed[`${lessonId}-completed-at`] = new Date().toISOString();
      localStorage.setItem(key, JSON.stringify(completed));
      console.log(`Lesson ${lessonId} marked as completed`);
    } catch (e) {
      console.error('Error saving completion:', e);
    }
  },
  
  /**
   * Check if all prerequisites are met for a lesson
   * @param {Object} lesson - The lesson data with prerequisites array
   * @returns {Object} - { met: boolean, missing: string[] }
   */
  checkPrerequisites(lesson) {
    if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
      return { met: true, missing: [] };
    }
    
    const missing = [];
    for (const prereq of lesson.prerequisites) {
      if (prereq.required !== false) {
        const isCompleted = this.isLessonCompleted(prereq.lessonId);
        if (!isCompleted) {
          missing.push({
            lessonId: prereq.lessonId,
            description: prereq.description || prereq.lessonId
          });
        }
      }
    }
    
    return {
      met: missing.length === 0,
      missing: missing
    };
  },
  
  /**
   * Render prerequisite lock screen
   * @param {Object} lesson - The lesson data
   * @param {Object} prereqStatus - Status from checkPrerequisites()
   * @returns {string} HTML for lock screen
   */
  renderPrerequisiteLock(lesson, prereqStatus) {
    const missingList = prereqStatus.missing.map(m => `
      <div class="prereq-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 8px;">
        <i data-lucide="lock" style="color: var(--warning);"></i>
        <div>
          <strong>${m.description}</strong>
          <div style="font-size: 0.875rem; color: var(--text-tertiary);">Complete this lesson first</div>
        </div>
      </div>
    `).join('');
    
    return `
      <div class="prerequisite-lock" style="max-width: 600px; margin: 48px auto; padding: 32px; background: var(--card-bg); border: 2px solid var(--warning); border-radius: 16px; text-align: center;">
        <div style="width: 80px; height: 80px; background: var(--warning-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
          <i data-lucide="lock" style="width: 40px; height: 40px; color: var(--warning);"></i>
        </div>
        <h2 style="margin-bottom: 16px; color: var(--text-primary);">Lesson Locked</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">
          Complete the following prerequisite lessons to unlock <strong>${lesson.title}</strong>:
        </p>
        <div style="text-align: left; margin-bottom: 24px;">
          ${missingList}
        </div>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <a href="index.html" class="btn btn-secondary">
            <i data-lucide="arrow-left"></i>
            Back to Modules
          </a>
          ${prereqStatus.missing.length > 0 ? `
            <a href="lesson.html?lesson=${prereqStatus.missing[0].lessonId}" class="btn btn-primary">
              <i data-lucide="play"></i>
              Start Required Lesson
            </a>
          ` : ''}
        </div>
      </div>
    `;
  },
  
  /**
   * Validate calculation answer with tolerance
   * @param {number} userAnswer - The user's answer
   * @param {number} correctAnswer - The correct answer
   * @param {number} tolerance - Tolerance as decimal (default 0.05 = 5%)
   * @returns {Object} - { correct: boolean, withinTolerance: boolean, diff: number }
   */
  validateCalculation(userAnswer, correctAnswer, tolerance = null) {
    const tol = tolerance !== null ? tolerance : this.calculationTolerance;
    const diff = Math.abs(userAnswer - correctAnswer);
    const percentDiff = diff / correctAnswer;
    const withinTolerance = percentDiff <= tol;
    
    return {
      correct: withinTolerance,
      withinTolerance: withinTolerance,
      diff: diff,
      percentDiff: percentDiff,
      tolerance: tol,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer
    };
  },
  
  /**
   * Show calculation feedback with tolerance info
   * @param {HTMLElement} container - The feedback container
   * @param {Object} result - Result from validateCalculation()
   */
  showCalculationFeedback(container, result) {
    const tolPercent = (result.tolerance * 100).toFixed(0);
    
    if (result.correct) {
      container.innerHTML = `
        <div class="feedback correct" style="padding: 16px; background: var(--success-light); border-radius: 8px; color: var(--success);">
          <i data-lucide="check-circle" style="display: inline-block; vertical-align: middle; margin-right: 8px;"></i>
          <strong>Correct!</strong> Your answer (${result.userAnswer}) is within ±${tolPercent}% of the expected value (${result.correctAnswer}).
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="feedback incorrect" style="padding: 16px; background: var(--critical-light); border-radius: 8px; color: var(--critical);">
          <i data-lucide="x-circle" style="display: inline-block; vertical-align: middle; margin-right: 8px;"></i>
          <strong>Not quite.</strong> Your answer (${result.userAnswer}) is outside the ±${tolPercent}% tolerance range. 
          Expected: ${result.correctAnswer} (±${(result.correctAnswer * result.tolerance).toFixed(2)})
        </div>
      `;
    }
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  /**
   * Initialize the renderer
   */
  init() {
    this.bindEvents();
  },
  
  /**
   * Bind global events
   */
  bindEvents() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.loadLessonFromURL();
    });
  },
  
  /**
   * Load and render a lesson from the current URL
   */
  async loadLessonFromURL() {
    const lessonId = LessonSchema.getLessonIdFromURL();
    
    if (!lessonId) {
      this.showError('No lesson specified. Please select a lesson from the module page.');
      return;
    }
    
    await this.loadLesson(lessonId);
  },
  
  /**
   * Load lesson data from JSON file
   * @param {string} lessonId - The lesson ID
   */
  async loadLesson(lessonId) {
    try {
      this.showLoading();
      
      const response = await fetch(`data/lessons/${lessonId}.json`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Lesson "${lessonId}" not found.`);
        }
        throw new Error(`Failed to load lesson: ${response.status} ${response.statusText}`);
      }
      
      const lessonData = await response.json();
      
      // Validate the data
      const validation = LessonSchema.validate(lessonData);
      if (!validation.valid) {
        console.error('Lesson validation errors:', validation.errors);
        throw new Error(`Invalid lesson data: ${validation.errors.join(', ')}`);
      }
      
      // Sanitize and store
      this.currentLesson = LessonSchema.sanitize(lessonData);
      
      // Check prerequisites before rendering
      const prereqStatus = this.checkPrerequisites(this.currentLesson);
      if (!prereqStatus.met) {
        // Show prerequisite lock screen
        this.renderPrerequisiteLockScreen(this.currentLesson, prereqStatus);
        this.hideLoading();
        return;
      }
      
      // Render the lesson
      this.render(this.currentLesson);
      
      // Update page title
      document.title = `${this.currentLesson.title} | HSC Biology | Science Hub`;
      
      // Update gamification
      this.initGamification();
      
      // Re-initialize Lucide icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      
      // Scroll to top
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error('Error loading lesson:', error);
      this.showError(error.message);
    } finally {
      this.hideLoading();
    }
  },
  
  /**
   * Render the complete lesson
   * @param {Object} lesson - The lesson data
   */
  render(lesson) {
    // Render sidebar
    this.renderSidebar(lesson);
    
    // Render main content
    this.renderMainContent(lesson);
    
    // Update breadcrumb
    this.updateBreadcrumb(lesson);
  },
  
  /**
   * Render the sidebar navigation
   */
  renderSidebar(lesson) {
    const sidebarHeader = document.querySelector('.sidebar-header h3');
    const sidebarModule = document.querySelector('.sidebar-header span');
    
    if (sidebarHeader) sidebarHeader.textContent = lesson.moduleTitle;
    if (sidebarModule) sidebarModule.textContent = 'HSC Biology';
    
    // Render lesson list
    const lessonList = document.querySelector('.lesson-list');
    if (lessonList && lesson.moduleLessons) {
      lessonList.innerHTML = lesson.moduleLessons.map(l => `
        <a href="lesson.html?lesson=${l.id}" 
           class="lesson-item ${l.id === lesson.id ? 'active' : ''}" 
           data-lesson="${l.number}"
           ${l.id === lesson.id ? 'aria-current="page"' : ''}>
          <span class="lesson-number">${l.number}</span>
          <span class="lesson-title-text">${l.title}</span>
          <i data-lucide="check" class="lesson-check"></i>
        </a>
      `).join('');
    }
    
    // Update progress
    this.updateProgress(lesson);
  },
  
  /**
   * Update sidebar progress
   */
  updateProgress(lesson) {
    const progressFill = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText && lesson.moduleLessons) {
      const total = lesson.moduleLessons.length;
      // Get completed lessons from storage
      const completed = this.getCompletedLessons(lesson.module);
      const percentage = (completed.length / total) * 100;
      
      progressFill.style.width = `${percentage}%`;
      progressText.textContent = `${completed.length}/${total} lessons`;
    }
  },
  
  /**
   * Get completed lessons from localStorage
   */
  getCompletedLessons(moduleId) {
    try {
      const key = `hsc-biology-${moduleId}-progress`;
      const data = localStorage.getItem(key);
      if (data) {
        const progress = JSON.parse(data);
        return Object.keys(progress).filter(k => progress[k] === true);
      }
    } catch (e) {
      console.error('Error reading progress:', e);
    }
    return [];
  },
  
  /**
   * Render prerequisite lock screen to the page
   * @param {Object} lesson - The lesson data
   * @param {Object} prereqStatus - Status from checkPrerequisites()
   */
  renderPrerequisiteLockScreen(lesson, prereqStatus) {
    const main = document.getElementById('main-content');
    if (!main) return;
    
    main.innerHTML = this.renderPrerequisiteLock(lesson, prereqStatus);
    
    // Update page title
    document.title = `Locked: ${lesson.title} | HSC Biology | Science Hub`;
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  },

  /**
   * Render main content area
   */
  renderMainContent(lesson) {
    const main = document.getElementById('main-content');
    if (!main) return;
    
    main.innerHTML = `
      ${this.renderHero(lesson)}
      ${this.renderInfoCards(lesson)}
      ${lesson.engagementHook ? this.renderEngagementHook(lesson.engagementHook) : ''}
      ${this.renderContentSections(lesson.contentSections)}
      ${this.renderActivities(lesson.activities)}
      ${this.renderCopyToBook(lesson.copyToBook)}
      ${this.renderAssessment(lesson.assessment)}
      ${this.renderAnswerKey(lesson.answerKey)}
      ${this.renderMarkComplete(lesson)}
      ${this.renderNavigation(lesson.navigation)}
    `;
    
    // Bind activity handlers
    this.bindActivityHandlers();
    
    // Bind assessment handlers
    this.bindAssessmentHandlers();
    
    // Trigger reveal animations
    this.initRevealAnimations();
  },
  
  /**
   * Render the hero section
   */
  renderHero(lesson) {
    return `
      <header class="lesson-hero">
        <div class="lesson-hero-badges">
          <span class="badge badge-critical">HSC Biology</span>
          <span class="badge badge-secondary">${lesson.moduleTitle}</span>
          <span class="badge">Lesson ${lesson.lessonNumber}</span>
        </div>
        
        <h1 class="lesson-hero-title">${lesson.title}</h1>
        
        <p class="lesson-hero-description">${lesson.description}</p>
        
        <div class="lesson-hero-meta">
          <span class="hero-meta-item">
            <i data-lucide="clock"></i>
            <span>${lesson.duration}</span>
          </span>
          <span class="hero-meta-item">
            <i data-lucide="signal"></i>
            <span>${lesson.difficulty}</span>
          </span>
          ${lesson.worksOffline ? `
          <span class="hero-meta-item">
            <i data-lucide="wifi-off"></i>
            <span>Works Offline</span>
          </span>
          ` : ''}
        </div>
      </header>
    `;
  },
  
  /**
   * Render info cards (Learning Intentions, Syllabus Links, Success Criteria)
   */
  renderInfoCards(lesson) {
    return `
      <div class="grid-3-col" style="margin-bottom: 48px;">
        <div class="card reveal">
          <div class="card-header">
            <div class="icon-wrapper icon-wrapper-secondary">
              <i data-lucide="target"></i>
            </div>
            <h2 class="card-title">Learning Intentions</h2>
          </div>
          <div class="card-content">
            <ul style="padding-left: 20px; color: var(--text-secondary);">
              ${lesson.learningIntentions.map(li => `<li style="margin-bottom: 8px;">${li}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="card reveal">
          <div class="card-header">
            <div class="icon-wrapper icon-wrapper-critical">
              <i data-lucide="link"></i>
            </div>
            <h2 class="card-title">Syllabus Links</h2>
          </div>
          <div class="card-content">
            <ul style="padding-left: 20px; color: var(--text-secondary);">
              ${lesson.syllabusLinks ? `
                <li style="margin-bottom: 8px;">${lesson.syllabusLinks.module || lesson.moduleTitle}</li>
                <li style="margin-bottom: 8px;">Inquiry Question: ${lesson.syllabusLinks.inquiryQuestion}</li>
                ${lesson.syllabusLinks.focus ? `<li>Focus: ${lesson.syllabusLinks.focus}</li>` : ''}
              ` : `
                <li style="margin-bottom: 8px;">${lesson.moduleTitle}</li>
                <li>Module ${lesson.moduleNumber || ''}</li>
              `}
            </ul>
          </div>
        </div>

        <div class="card reveal">
          <div class="card-header">
            <div class="icon-wrapper">
              <i data-lucide="check-circle"></i>
            </div>
            <h2 class="card-title">Success Criteria</h2>
          </div>
          <div class="card-content">
            <ul style="padding-left: 20px; color: var(--text-secondary);">
              ${lesson.successCriteria.map(sc => `<li style="margin-bottom: 8px;">${sc}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  },
  
  /**
   * Render engagement hook
   */
  renderEngagementHook(hook) {
    return `
      <div class="engagement-hook reveal">
        <i data-lucide="lightbulb"></i>
        <div>
          <h4>${hook.title || 'Think About This...'}</h4>
          <p>${hook.content}</p>
        </div>
      </div>
    `;
  },
  
  /**
   * Render content sections
   */
  renderContentSections(sections) {
    if (!sections || sections.length === 0) return '';
    
    return sections.map(section => {
      const icon = section.icon || 'book-open';
      
      switch (section.type) {
        case 'content':
          return this.renderContentSection(section, icon);
        case 'definition':
          return this.renderDefinitionSection(section, icon);
        case 'grid':
          return this.renderGridSection(section, icon);
        case 'accordion':
          return this.renderAccordionSection(section, icon);
        case 'worked-example':
          return this.renderWorkedExample(section, icon);
        case 'diagram':
          return this.renderDiagramSection(section, icon);
        default:
          return this.renderContentSection(section, icon);
      }
    }).join('');
  },
  
  /**
   * Render a standard content section
   */
  renderContentSection(section, icon) {
    return `
      <section class="content-section reveal" id="${section.id}">
        <h2>
          <i data-lucide="${icon}"></i>
          ${section.title}
        </h2>
        ${section.content || ''}
        ${section.items ? `
          <ul style="padding-left: 24px; color: var(--text-secondary); margin-top: 16px;">
            ${section.items.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
          </ul>
        ` : ''}
      </section>
    `;
  },
  
  /**
   * Render a definition box section
   */
  renderDefinitionSection(section, icon) {
    return `
      <section class="content-section reveal" id="${section.id}">
        <h2>
          <i data-lucide="${icon}"></i>
          ${section.title}
        </h2>
        <div class="definition-box">
          <strong>${section.term}:</strong> ${section.definition}
        </div>
        ${section.content ? `<p>${section.content}</p>` : ''}
      </section>
    `;
  },
  
  /**
   * Render a grid section
   */
  renderGridSection(section, icon) {
    const gridItems = section.gridItems || section.items || [];
    return `
      <section class="content-section reveal" id="${section.id}">
        <h2>
          <i data-lucide="${icon}"></i>
          ${section.title}
        </h2>
        <div class="grid-2-col">
          ${gridItems.map(item => `
            <div class="info-grid-item">
              <h4>
                <i data-lucide="${item.icon || 'check'}"></i>
                ${item.header || item.title || ''}
              </h4>
              <ul>
                ${item.items ? item.items.map(i => `<li>${i}</li>`).join('') : ''}
              </ul>
            </div>
          `).join('')}
        </div>
        ${section.note ? `<p style="margin-top: 16px; font-style: italic; color: var(--text-tertiary);"><i data-lucide="info" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 6px;"></i>${section.note}</p>` : ''}
        ${section.example ? `<div class="example-box" style="background: rgba(245, 158, 11, 0.1); padding: 12px; border-radius: 8px; margin-top: 12px; border-left: 4px solid var(--warning);"><strong>Example:</strong> ${section.example}</div>` : ''}
      </section>
    `;
  },
  
  /**
   * Render an accordion section
   */
  renderAccordionSection(section, icon) {
    return `
      <details class="card reveal" ${section.open ? 'open' : ''}>
        <summary>
          <div class="icon-wrapper icon-wrapper-critical">
            <i data-lucide="${icon}"></i>
          </div>
          <span>${section.title}</span>
        </summary>
        <div class="card-content">
          ${section.content || ''}
          ${section.items ? `
            <ul style="margin: 16px 0; padding-left: 24px; color: var(--text-secondary);">
              ${section.items.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </details>
    `;
  },
  
  /**
   * Render a worked example
   */
  renderWorkedExample(section, icon) {
    return `
      <div class="worked-example reveal">
        <div class="worked-example-header">
          <i data-lucide="${icon}"></i>
          ${section.title}
        </div>
        ${section.content || ''}
      </div>
    `;
  },

  /**
   * Render a diagram section with image and key points
   */
  renderDiagramSection(section, icon) {
    const image = section.image || {};
    const keyPoints = section.keyPoints || [];
    
    return `
      <section class="content-section reveal" id="${section.id}">
        <h2>
          <i data-lucide="${icon}"></i>
          ${section.title}
        </h2>
        <p>${section.content || ''}</p>
        
        ${image.src ? `
          <figure class="diagram-figure" style="margin: 24px 0; text-align: center;">
            <img src="${image.src}" alt="${image.alt || ''}" style="max-width: 100%; border-radius: 12px; box-shadow: var(--shadow-md);">
            ${image.caption ? `<figcaption style="margin-top: 12px; color: var(--text-secondary); font-size: 0.9rem;">${image.caption}</figcaption>` : ''}
          </figure>
        ` : ''}
        
        ${keyPoints.length > 0 ? `
          <div class="key-points-box" style="background: var(--bg-elevated); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid var(--primary);">
            <h4 style="margin-bottom: 12px; color: var(--primary);">
              <i data-lucide="key" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;"></i>
              Key Points
            </h4>
            <ul style="padding-left: 20px; color: var(--text-secondary);">
              ${keyPoints.map(point => `<li style="margin-bottom: 8px;">${point}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${section.example ? `
          <div class="example-box" style="background: rgba(245, 158, 11, 0.1); padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid var(--warning);">
            <strong><i data-lucide="lightbulb" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 6px;"></i> Example:</strong> ${section.example}
          </div>
        ` : ''}
        
        ${section.checkForUnderstanding ? `
          <div class="check-understanding" style="background: rgba(99, 102, 241, 0.1); padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid var(--secondary);">
            <strong><i data-lucide="help-circle" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 6px;"></i> Check for Understanding:</strong> ${section.checkForUnderstanding}
          </div>
        ` : ''}
      </section>
    `;
  },
  
  /**
   * Render activities
   */
  renderActivities(activities) {
    if (!activities || activities.length === 0) return '';
    
    return activities.map(activity => {
      const theme = activity.theme || 'teal';
      
      switch (activity.type) {
        case 'matching':
          return this.renderMatchingActivity(activity, theme);
        case 'fill-blank':
          return this.renderFillBlankActivity(activity, theme);
        default:
          return '';
      }
    }).join('');
  },
  
  /**
   * Render matching activity
   */
  renderMatchingActivity(activity, theme) {
    const items = activity.items || [];
    // Create options from all match values
    const allMatches = items.map(item => item.match || item.correctMatch || '');
    
    return `
      <div class="activity-card activity-card--${theme} reveal" data-activity="${activity.id}" data-activity-type="matching">
        <div class="activity-card-header">
          <i data-lucide="microscope"></i>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-card-body">
          ${activity.description ? `<p style="margin-bottom: 16px;">${activity.description}</p>` : ''}
          <div class="matching-form">
            ${items.map((item, index) => `
              <div class="matching-item" data-correct="${item.match || item.correctMatch || ''}">
                <span class="matching-term">${item.text || item.term || item.label || ''}</span>
                <i data-lucide="arrow-right" class="matching-arrow"></i>
                <select class="modern-input matching-select">
                  <option value="">Select...</option>
                  ${allMatches.map(match => `<option value="${match}">${match}</option>`).join('')}
                </select>
              </div>
            `).join('')}
            <button class="btn btn-primary check-matching-btn" style="margin-top: 16px;">
              <i data-lucide="check-circle"></i>
              Check Answers
            </button>
            <div class="matching-feedback" style="margin-top: 16px;"></div>
          </div>
        </div>
      </div>
    `;
  },
  
  /**
   * Render fill-in-the-blank activity
   */
  renderFillBlankActivity(activity, theme) {
    return `
      <div class="activity-card activity-card--${theme} reveal" data-activity="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="list-checks"></i>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-card-body">
          ${activity.description ? `<p style="margin-bottom: 16px;">${activity.description}</p>` : ''}
          <div class="fill-blank-form">
            <div style="display: flex; flex-wrap: wrap; gap: 24px;">
              ${activity.items.map((item, index) => `
                <div style="flex: 1; min-width: 200px;">
                  <label style="display: block; margin-bottom: 8px; font-weight: 600;">${index + 1}. ${item.label}</label>
                  <input type="text" 
                         class="modern-input modern-input--small" 
                         data-correct="${item.correctAnswer}" 
                         maxlength="${item.maxLength || 10}" 
                         placeholder="${item.placeholder || 'Answer'}">
                </div>
              `).join('')}
            </div>
            <button class="btn btn-primary check-fill-btn" style="margin-top: 24px;">
              <i data-lucide="check-circle"></i>
              Check Answers
            </button>
          </div>
        </div>
      </div>
    `;
  },
  
  /**
   * Render copy to book section
   */
  renderCopyToBook(copyToBook) {
    if (!copyToBook) return '';
    
    return `
      <details class="card reveal" ${copyToBook.open ? 'open' : ''}>
        <summary>
          <div class="icon-wrapper">
            <i data-lucide="pen-tool"></i>
          </div>
          <span>Copy Into Your Books</span>
        </summary>
        <div class="card-content">
          ${copyToBook.definitions ? `
            <p style="margin-bottom: 16px;"><strong>Key Definitions:</strong></p>
            <ul style="padding-left: 24px; color: var(--text-secondary); margin-bottom: 24px;">
              ${copyToBook.definitions.map(d => `<li style="margin-bottom: 8px;">${d}</li>`).join('')}
            </ul>
          ` : ''}
          ${copyToBook.keyPoints ? `
            <p style="margin-bottom: 16px;"><strong>Key Points:</strong></p>
            <ul style="padding-left: 24px; color: var(--text-secondary);">
              ${copyToBook.keyPoints.map(p => `<li style="margin-bottom: 8px;">${p}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </details>
    `;
  },
  
  /**
   * Render assessment section
   */
  renderAssessment(assessment) {
    if (!assessment) return '';
    
    let html = `
      <section class="content-section reveal" style="margin-top: 48px;">
        <h2>
          <i data-lucide="clipboard-check"></i>
          Assessment Questions
        </h2>
    `;
    
    // Multiple Choice
    if (assessment.multipleChoice && assessment.multipleChoice.length > 0) {
      html += `
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-header">
            <div class="icon-wrapper">
              <i data-lucide="circle-dot"></i>
            </div>
            <h3 class="card-title">Multiple Choice</h3>
          </div>
          <div class="card-content quiz-form">
            ${assessment.multipleChoice.map((q, index) => `
              <div class="quiz-question" data-correct="${q.correctAnswer}" style="margin-bottom: 32px;">
                <p style="font-weight: 600; margin-bottom: 12px;">${index + 1}. ${q.question}</p>
                <div class="quiz-options">
                  ${q.options.map((opt, optIndex) => `
                    <label class="quiz-option">
                      <input type="radio" name="q${index + 1}" value="${String.fromCharCode(97 + optIndex)}">
                      <span class="quiz-option-circle"></span>
                      <span class="quiz-option-letter">${String.fromCharCode(65 + optIndex)}</span>
                      <span class="quiz-option-text">${opt}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            `).join('')}
            <button class="btn btn-primary check-answers-btn" style="margin-top: 24px;">
              <i data-lucide="check-circle"></i>
              Check Answers
            </button>
          </div>
        </div>
      `;
    }
    
    // Short Answer
    if (assessment.shortAnswer && assessment.shortAnswer.length > 0) {
      html += `
        <div class="card">
          <div class="card-header">
            <div class="icon-wrapper icon-wrapper-secondary">
              <i data-lucide="align-left"></i>
            </div>
            <h3 class="card-title">Short Answer</h3>
          </div>
          <div class="card-content">
            ${assessment.shortAnswer.map((q, index) => `
              <div style="margin-bottom: 24px;">
                <p style="font-weight: 600; margin-bottom: 8px;">${index + 1}. ${q.question} (${q.marks} mark${q.marks > 1 ? 's' : ''})</p>
                <textarea class="modern-input" placeholder="Type your answer here..."></textarea>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    html += '</section>';
    return html;
  },
  
  /**
   * Render answer key
   */
  renderAnswerKey(answerKey) {
    if (!answerKey) return '';
    
    return `
      <details class="card reveal">
        <summary>
          <div class="icon-wrapper icon-wrapper-accent">
            <i data-lucide="key"></i>
          </div>
          <span>Answer Key</span>
        </summary>
        <div class="card-content">
          ${answerKey.multipleChoice ? `
            <p style="font-weight: 600; margin-bottom: 8px;">Multiple Choice:</p>
            <ol style="padding-left: 24px; color: var(--text-secondary); margin-bottom: 24px;">
              ${answerKey.multipleChoice.map(ans => `<li style="margin-bottom: 4px;">${ans}</li>`).join('')}
            </ol>
          ` : ''}
          ${answerKey.shortAnswer ? `
            <p style="font-weight: 600; margin-bottom: 8px;">Short Answer:</p>
            ${answerKey.shortAnswer.map((ans, index) => `
              <p style="color: var(--text-secondary); margin-bottom: 8px;"><strong>${index + 1}.</strong> ${ans}</p>
            `).join('')}
          ` : ''}
        </div>
      </details>
    `;
  },
  
  /**
   * Render mark complete button
   */
  renderMarkComplete(lesson) {
    const isCompleted = this.isLessonCompleted(lesson.id);
    const btnClass = isCompleted ? 'mark-complete-btn completed' : 'mark-complete-btn';
    const btnText = isCompleted ? 'Completed!' : 'Mark as Complete';
    const iconName = isCompleted ? 'check-circle' : 'circle';
    
    return `
      <div style="text-align: center; margin: 48px 0;">
        <button class="${btnClass}" data-lesson-id="${lesson.id}" ${isCompleted ? 'disabled' : ''}>
          <i data-lucide="${iconName}"></i>
          <span>${btnText}</span>
        </button>
        ${isCompleted ? '<p style="color: var(--success); margin-top: 12px;">You can now proceed to the next lesson!</p>' : ''}
      </div>
    `;
  },
  
  /**
   * Render lesson navigation
   */
  renderNavigation(nav) {
    if (!nav) return '';
    
    return `
      <nav class="lesson-navigation reveal" aria-label="Lesson navigation">
        ${nav.previous ? `
          <a href="lesson.html?lesson=${nav.previous}" class="lesson-nav-btn">
            <i data-lucide="chevron-left"></i>
            <div class="nav-btn-content">
              <span class="nav-btn-label">Previous</span>
              <span class="nav-btn-title">${nav.previousTitle}</span>
            </div>
          </a>
        ` : `
          <a href="" class="lesson-nav-btn" style="visibility: hidden;">
            <i data-lucide="chevron-left"></i>
            <div class="nav-btn-content">
              <span class="nav-btn-label">Previous</span>
              <span class="nav-btn-title">—</span>
            </div>
          </a>
        `}

        <a href="${this.currentLesson.module}/index.html" class="lesson-nav-home">
          <i data-lucide="grid-3x3"></i>
          <span>All Lessons</span>
        </a>

        ${nav.next ? `
          <a href="lesson.html?lesson=${nav.next}" class="lesson-nav-btn">
            <div class="nav-btn-content" style="text-align: right;">
              <span class="nav-btn-label">Next</span>
              <span class="nav-btn-title">${nav.nextTitle}</span>
            </div>
            <i data-lucide="chevron-right"></i>
          </a>
        ` : `
          <a href="" class="lesson-nav-btn" style="visibility: hidden;">
            <div class="nav-btn-content" style="text-align: right;">
              <span class="nav-btn-label">Next</span>
              <span class="nav-btn-title">—</span>
            </div>
            <i data-lucide="chevron-right"></i>
          </a>
        `}
      </nav>
    `;
  },
  
  /**
   * Update breadcrumb
   */
  updateBreadcrumb(lesson) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <a href="../../index.html">Home</a>
        <i data-lucide="chevron-right"></i>
        <a href="index.html">HSC Biology</a>
        <i data-lucide="chevron-right"></i>
        <a href="${lesson.module}/index.html">${lesson.moduleTitle}</a>
        <i data-lucide="chevron-right"></i>
        <span>Lesson ${lesson.lessonNumber}</span>
      `;
    }
  },
  
  /**
   * Bind activity handlers
   */
  bindActivityHandlers() {
    // Matching activities
    document.querySelectorAll('.check-matching-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const activity = e.target.closest('[data-activity]');
        const items = activity.querySelectorAll('.matching-item');
        
        items.forEach(item => {
          const select = item.querySelector('select');
          const correct = item.dataset.correct;
          const selected = select.value;
          
          item.classList.remove('correct', 'incorrect');
          item.classList.add(selected === correct ? 'correct' : 'incorrect');
        });
      });
    });
    
    // Fill blank activities
    document.querySelectorAll('.check-fill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const activity = e.target.closest('[data-activity]');
        const inputs = activity.querySelectorAll('input[data-correct]');
        
        inputs.forEach(input => {
          const correct = input.dataset.correct.toLowerCase();
          const value = input.value.trim().toLowerCase();
          
          input.classList.remove('correct', 'incorrect');
          input.classList.add(value === correct ? 'correct' : 'incorrect');
        });
      });
    });
  },
  
  /**
   * Bind assessment handlers
   */
  bindAssessmentHandlers() {
    document.querySelectorAll('.check-answers-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const form = e.target.closest('.quiz-form');
        const questions = form.querySelectorAll('.quiz-question');
        
        questions.forEach(q => {
          const correct = q.dataset.correct;
          const selected = q.querySelector('input[type="radio"]:checked');
          
          q.classList.remove('correct', 'incorrect');
          
          if (selected) {
            q.classList.add(selected.value === correct ? 'correct' : 'incorrect');
          }
        });
      });
    });
  },
  
  /**
   * Initialize gamification
   */
  initGamification() {
    if (!this.currentLesson) return;
    
    const { module, lessonNumber } = this.currentLesson;
    const yearLevel = 'hsc-biology';
    
    // Initialize progress tracking if functions exist
    if (typeof updateSidebarProgress === 'function') {
      const totalLessons = this.currentLesson.moduleLessons?.length || 5;
      updateSidebarProgress(yearLevel, module, totalLessons);
    }
    
    if (typeof setupMarkComplete === 'function') {
      setupMarkComplete(yearLevel, module, lessonNumber.toString());
    }
    
    // Save last visited
    if (typeof StorageManager !== 'undefined' && StorageManager.saveLastVisited) {
      StorageManager.saveLastVisited(yearLevel, module, lessonNumber.toString());
    }
    
    // Bind mark complete button
    const markBtn = document.querySelector('.mark-complete-btn');
    if (markBtn) {
      markBtn.addEventListener('click', () => this.handleMarkComplete());
    }
  },
  
  /**
   * Handle mark complete button click
   */
  handleMarkComplete() {
    const btn = document.querySelector('.mark-complete-btn');
    if (!btn || btn.classList.contains('completed')) return;
    
    const { module, lessonNumber } = this.currentLesson;
    const lessonId = lessonNumber.toString();
    
    // Save progress
    try {
      const key = `hsc-biology-${module}-progress`;
      const data = localStorage.getItem(key);
      const progress = data ? JSON.parse(data) : {};
      progress[lessonId] = true;
      localStorage.setItem(key, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
    
    // Update button
    btn.classList.add('completed');
    btn.innerHTML = `
      <i data-lucide="check-circle"></i>
      <span>Completed!</span>
    `;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    // Award XP if available
    if (typeof XPManager !== 'undefined' && typeof XPUI !== 'undefined') {
      const streakInfo = typeof StreakManager !== 'undefined' ? StreakManager.getStreakInfo() : { currentStreak: 1 };
      const xpResult = XPManager.awardLessonXP(lessonId, streakInfo.currentStreak);
      
      if (xpResult.awarded) {
        let bonusText = null;
        if (xpResult.details.firstLessonBonus) {
          bonusText = 'First lesson of the day bonus!';
        } else if (xpResult.details.streakBonus) {
          bonusText = `${streakInfo.currentStreak} day streak bonus!`;
        }
        XPUI.showXPGain(xpResult.amount, bonusText);
        
        if (xpResult.leveledUp) {
          setTimeout(() => {
            XPUI.showLevelUp(xpResult.newLevel, XPManager.getRankForLevel(xpResult.newLevel));
          }, 1000);
        }
      }
    }
    
    // Update streak if available
    if (typeof StreakManager !== 'undefined' && typeof StreakUI !== 'undefined') {
      const result = StreakManager.checkIn();
      if (result.streakUpdated) {
        StreakUI.updateStreakDisplay();
        if (result.milestoneReached) {
          setTimeout(() => {
            StreakUI.showCelebration(result.milestoneReached);
          }, 1500);
        }
      }
    }
    
    // Update progress bar
    this.updateProgress(this.currentLesson);
  },
  
  /**
   * Initialize reveal animations
   */
  initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => observer.observe(el));
  },
  
  /**
   * Show loading state
   */
  showLoading() {
    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = `
        <div class="loading-state" style="padding: 48px; text-align: center;">
          <div class="loading-spinner" style="width: 48px; height: 48px; margin: 0 auto 24px;"></div>
          <p style="color: var(--text-secondary);">Loading lesson...</p>
        </div>
      `;
    }
  },
  
  /**
   * Hide loading state
   */
  hideLoading() {
    // Loading state is replaced by content
  },
  
  /**
   * Show error message
   */
  showError(message) {
    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = `
        <div class="error-state" style="padding: 48px; text-align: center;">
          <div style="width: 64px; height: 64px; background: var(--critical-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
            <i data-lucide="alert-circle" style="width: 32px; height: 32px; color: var(--critical);"></i>
          </div>
          <h2 style="margin-bottom: 16px;">Unable to Load Lesson</h2>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">${message}</p>
          <a href="index.html" class="btn btn-primary">
            <i data-lucide="home"></i>
            Back to Lessons
          </a>
        </div>
      `;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  },

  // ==========================================
  // PHASE 0.6 ENHANCEMENTS - RENDER FUNCTIONS
  // ==========================================

  /**
   * Render image section
   * @param {Object} section 
   * @param {string} icon 
   * @returns {string}
   */
  renderImageSection(section, icon) {
    if (!section.image) return '';
    
    const img = section.image;
    const pictureHtml = img.srcWebp 
      ? `<source srcset="${img.srcWebp}" type="image/webp"><img src="${img.src}" alt="${img.alt || ''}" loading="lazy">`
      : `<img src="${img.src}" alt="${img.alt || ''}" loading="lazy">`;
    
    return `
      <section class="content-section reveal" id="${section.id}">
        <h2>
          <i data-lucide="${icon}"></i>
          ${section.title}
        </h2>
        <figure class="lesson-figure">
          <picture>${pictureHtml}</picture>
          ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}
          ${img.credit ? `<cite>${img.credit}</cite>` : ''}
        </figure>
        ${section.content ? `<p>${section.content}</p>` : ''}
      </section>
    `;
  },

  /**
   * Render diagram section
   * @param {Object} section 
   * @param {string} icon 
   * @returns {string}
   */
  renderDiagramSection(section, icon) {
    if (!section.diagram) return '';
    
    return `
      <section class="content-section reveal" id="${section.id}">
        <h2>
          <i data-lucide="${icon}"></i>
          ${section.title}
        </h2>
        ${DiagramTool ? DiagramTool.renderStudentView(section.diagram) : '<p>Diagram unavailable</p>'}
      </section>
    `;
  },

  /**
   * Render video section
   * @param {Object} section 
   * @param {string} icon 
   * @returns {string}
   */
  renderVideoSection(section, icon) {
    if (!section.video) return '';
    
    return `
      <section class="content-section reveal" id="${section.id}">
        <h2>
          <i data-lucide="${icon}"></i>
          ${section.title}
        </h2>
        ${RichMedia ? RichMedia.renderVideo(section.video) : '<p>Video unavailable</p>'}
      </section>
    `;
  },

  /**
   * Render simulation section
   * @param {Object} section 
   * @param {string} icon 
   * @returns {string}
   */
  renderSimulationSection(section, icon) {
    if (!section.simulation) return '';
    
    return `
      <section class="content-section reveal" id="${section.id}">
        <h2>
          <i data-lucide="${icon}"></i>
          ${section.title}
        </h2>
        ${RichMedia ? RichMedia.renderSimulation(section.simulation) : '<p>Simulation unavailable</p>'}
      </section>
    `;
  },

  /**
   * Render activities - extended for Phase 0.6 and Phase 1.0
   */
  renderActivities(activities) {
    if (!activities || activities.length === 0) return '';
    
    return activities.map(activity => {
      const theme = activity.theme || 'teal';
      
      switch (activity.type) {
        case 'matching':
          return this.renderMatchingActivity(activity, theme);
        case 'fill-blank':
          return this.renderFillBlankActivity(activity, theme);
        case 'ordering':
          return ActivityOrdering ? ActivityOrdering.render(activity, { theme }) : '';
        case 'labeling':
          return ActivityLabeling ? ActivityLabeling.render(activity, { theme }) : '';
        case 'fillBlank':
          return ActivityFillBlank ? ActivityFillBlank.render(activity, { theme }) : '';
        case 'calculation':
          return this.renderCalculationActivity(activity, theme);
        default:
          return '';
      }
    }).join('');
  },
  
  /**
   * Render calculation activity with tolerance
   * @param {Object} activity - The calculation activity
   * @param {string} theme - The theme color
   * @returns {string} HTML for calculation activity
   */
  renderCalculationActivity(activity, theme) {
    const questions = activity.questions || [];
    const tolerance = activity.tolerance || this.calculationTolerance;
    const tolerancePercent = (tolerance * 100).toFixed(0);
    
    return `
      <div class="activity-card theme-${theme}" data-activity="calculation" data-tolerance="${tolerance}">
        <div class="activity-header">
          <h3>
            <i data-lucide="calculator"></i>
            ${activity.title}
          </h3>
          ${activity.xpReward ? `<span class="xp-badge">+${activity.xpReward} XP</span>` : ''}
        </div>
        <div class="activity-content">
          ${activity.description ? `<p class="activity-description">${activity.description}</p>` : ''}
          <p style="color: var(--text-tertiary); font-size: 0.875rem; margin-bottom: 16px;">
            <i data-lucide="info" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"></i>
            Answers within ±${tolerancePercent}% are accepted
          </p>
          <div class="calculation-questions">
            ${questions.map((q, idx) => `
              <div class="calculation-question" data-question-id="${q.id}" data-correct="${q.correctAnswer}" data-tolerance="${tolerance}">
                <p class="question-text">${idx + 1}. ${q.question}</p>
                <div class="calculation-input-group">
                  <input type="number" 
                         class="calculation-input" 
                         placeholder="Enter your answer"
                         step="any"
                         data-question-id="${q.id}">
                  <span class="calculation-unit">${q.unit || ''}</span>
                </div>
                <div class="calculation-feedback" data-question-id="${q.id}"></div>
              </div>
            `).join('')}
          </div>
          <button class="check-calculation-btn btn btn-primary" style="margin-top: 24px;">
            <i data-lucide="check-circle"></i>
            Check Answers
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Bind activity handlers - extended for Phase 0.6
   */
  bindActivityHandlers() {
    // Matching activities
    document.querySelectorAll('.check-matching-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const activity = e.target.closest('[data-activity]');
        const items = activity.querySelectorAll('.matching-item');
        
        items.forEach(item => {
          const select = item.querySelector('select');
          const correct = item.dataset.correct;
          const selected = select.value;
          
          item.classList.remove('correct', 'incorrect');
          item.classList.add(selected === correct ? 'correct' : 'incorrect');
        });
      });
    });
    
    // Fill blank activities (legacy)
    document.querySelectorAll('.check-fill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const activity = e.target.closest('[data-activity]');
        const inputs = activity.querySelectorAll('input[data-correct]');
        
        inputs.forEach(input => {
          const correct = input.dataset.correct.toLowerCase();
          const value = input.value.trim().toLowerCase();
          
          input.classList.remove('correct', 'incorrect');
          input.classList.add(value === correct ? 'correct' : 'incorrect');
        });
      });
    });
    
    // Calculation activities with tolerance
    document.querySelectorAll('.check-calculation-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const activity = e.target.closest('[data-activity]');
        const questions = activity.querySelectorAll('.calculation-question');
        
        questions.forEach(question => {
          const correctAnswer = parseFloat(question.dataset.correct);
          const tolerance = parseFloat(question.dataset.tolerance) || this.calculationTolerance;
          const input = question.querySelector('.calculation-input');
          const feedbackContainer = question.querySelector('.calculation-feedback');
          
          const userAnswer = parseFloat(input.value);
          
          if (isNaN(userAnswer)) {
            feedbackContainer.innerHTML = `
              <div class="feedback" style="padding: 12px; background: var(--warning-light); border-radius: 8px; color: var(--warning);">
                <i data-lucide="alert-circle" style="display: inline-block; vertical-align: middle; margin-right: 8px;"></i>
                Please enter a valid number
              </div>
            `;
          } else {
            const result = this.validateCalculation(userAnswer, correctAnswer, tolerance);
            this.showCalculationFeedback(feedbackContainer, result);
            
            // Visual feedback on input
            input.classList.remove('correct', 'incorrect');
            input.classList.add(result.correct ? 'correct' : 'incorrect');
          }
        });
        
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    });

    // Phase 0.6 activities
    if (typeof ActivityOrdering !== 'undefined') {
      ActivityOrdering.bindEvents(document);
    }
    if (typeof ActivityLabeling !== 'undefined') {
      ActivityLabeling.bindEvents(document);
    }
    if (typeof ActivityFillBlank !== 'undefined') {
      ActivityFillBlank.bindEvents(document);
    }
    if (typeof DiagramTool !== 'undefined') {
      document.querySelectorAll('.diagram-viewer').forEach(container => {
        DiagramTool.bindStudentView(container);
      });
    }
    
    // Bind mark complete buttons
    this.bindMarkCompleteHandler();
  },
  
  /**
   * Bind mark complete button handler
   */
  bindMarkCompleteHandler() {
    document.querySelectorAll('.mark-complete-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lessonId = e.currentTarget.dataset.lessonId;
        if (lessonId) {
          this.markLessonCompleted(lessonId);
          
          // Update button appearance
          e.currentTarget.disabled = true;
          e.currentTarget.classList.add('completed');
          e.currentTarget.innerHTML = `
            <i data-lucide="check-circle"></i>
            <span>Completed!</span>
          `;
          
          // Add success message
          const msg = document.createElement('p');
          msg.style.cssText = 'color: var(--success); margin-top: 12px;';
          msg.textContent = 'You can now proceed to the next lesson!';
          e.currentTarget.parentNode.appendChild(msg);
          
          // Re-initialize icons
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
          
          // Update sidebar progress
          if (this.currentLesson) {
            this.updateProgress(this.currentLesson);
          }
        }
      });
    });
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  LessonRenderer.init();
  LessonRenderer.loadLessonFromURL();
});

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LessonRenderer };
}
