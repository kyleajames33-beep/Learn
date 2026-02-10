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
      console.log('Raw lesson data loaded:', lessonData.id);
      console.log('Content sections in raw data:', lessonData.contentSections?.length || 0);
      
      // Validate the data
      const validation = LessonSchema.validate(lessonData);
      if (!validation.valid) {
        console.error('Lesson validation errors:', validation.errors);
        throw new Error(`Invalid lesson data: ${validation.errors.join(', ')}`);
      }
      
      // Sanitize and store
      this.currentLesson = LessonSchema.sanitize(lessonData);
      
      // Skip prerequisite locking — all lessons accessible
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
   * Check if lesson is in V2.0 format
   */
  isV2Format(lesson) {
    return lesson.hero && lesson.intentions && (lesson.contentHTML || lesson.v2 === true);
  },

  /**
   * Render main content area
   */
  renderMainContent(lesson) {
    const main = document.getElementById('main-content');
    if (!main) {
      console.error('Main content element not found');
      return;
    }
    
    console.log('Rendering lesson:', lesson.id);
    
    // Check for V2.0 format and render accordingly
    if (this.isV2Format(lesson)) {
      console.log('Using V2.0 renderer');
      this.renderV2Content(lesson, main);
      return;
    }
    
    console.log('Content sections:', lesson.contentSections?.length || 0);
    
    const contentSectionsHtml = this.renderContentSections(lesson.contentSections);
    console.log('Content sections HTML length:', contentSectionsHtml.length);
    
    main.innerHTML = `
      ${this.renderHero(lesson)}
      ${this.renderInfoCards(lesson)}
      ${lesson.engagementHook ? this.renderEngagementHook(lesson.engagementHook) : ''}
      ${contentSectionsHtml}
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
   * Render V2.0 lesson content
   */
  renderV2Content(lesson, main) {
    // Load V2 CSS if not already loaded
    this.loadV2Styles();
    
    main.innerHTML = `
      <div class="lesson-content-v2">
        ${this.renderV2Hero(lesson)}
        ${this.renderV2Intentions(lesson)}
        ${this.renderV2ContentHTML(lesson)}
        ${this.renderV2Activities(lesson)}
        ${this.renderV2Assessment(lesson)}
        ${this.renderV2Answers(lesson)}
        ${this.renderMarkComplete(lesson)}
        ${this.renderNavigation(lesson.navigation)}
      </div>
    `;
    
    // Bind V2 activity handlers
    this.bindV2ActivityHandlers();
    
    // Bind assessment handlers
    this.bindAssessmentHandlers();
    
    // Trigger reveal animations
    this.initRevealAnimations();
    
    // Re-initialize Lucide icons for new content
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  /**
   * Load V2 CSS styles dynamically
   */
  loadV2Styles() {
    if (document.getElementById('lesson-v2-styles')) return;
    
    const link = document.createElement('link');
    link.id = 'lesson-v2-styles';
    link.rel = 'stylesheet';
    link.href = '../assets/css/lesson-v2.css';
    document.head.appendChild(link);
  },

  /**
   * Render V2.0 hero section
   */
  renderV2Hero(lesson) {
    const hero = lesson.hero || {};
    const gradientClass = hero.gradient === 'blue-to-purple' ? 'gradient-blue-purple' : 
                          hero.gradient === 'green-to-blue' ? 'gradient-green-blue' : '';
    
    return `
      <div class="hero ${gradientClass}">
        <div class="hero-grid">
          <div class="hero-content">
            <div class="hero-meta">
              ${hero.subjectBadge ? `<span class="badge badge-module">${hero.subjectBadge}</span>` : ''}
              ${hero.levelBadge ? `<span class="badge ${hero.levelBadge === 'Foundational' ? 'badge-foundational' : 'badge-advanced'}">${hero.levelBadge}</span>` : ''}
            </div>
            <h1>${lesson.title}</h1>
            <p class="hero-description">${lesson.description || ''}</p>
          </div>
          ${hero.icon ? `<div class="hero-icon">${hero.icon}</div>` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render V2.0 intentions grid
   */
  renderV2Intentions(lesson) {
    const intentions = lesson.intentions || {};
    
    return `
      <div class="intentions-grid">
        ${intentions.learning ? `
          <div class="intention-card blue">
            <h3><i data-lucide="target"></i> Learning Intentions</h3>
            <ul>
              ${intentions.learning.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${intentions.connections ? `
          <div class="intention-card purple">
            <h3><i data-lucide="link"></i> Key Connections</h3>
            <ul>
              ${Array.isArray(intentions.connections) ? 
                intentions.connections.map(item => {
                  if (typeof item === 'string') return `<li>${item}</li>`;
                  return `<li>${item.topic}${item.link ? ` <a href="${item.link}">→</a>` : ''}</li>`;
                }).join('') : ''}
            </ul>
          </div>
        ` : ''}
        ${intentions.success ? `
          <div class="intention-card green">
            <h3><i data-lucide="check-circle"></i> Success Criteria</h3>
            <ul>
              ${intentions.success.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * Render V2.0 HTML content
   */
  renderV2ContentHTML(lesson) {
    if (!lesson.contentHTML) return '';
    
    return `
      <div class="v2-content-body">
        ${lesson.contentHTML}
      </div>
    `;
  },

  /**
   * Render V2.0 activities
   */
  renderV2Activities(lesson) {
    if (!lesson.activities || lesson.activities.length === 0) return '';
    
    return `
      <div class="v2-activities">
        ${lesson.activities.map((activity, index) => this.renderV2Activity(activity, index + 1)).join('')}
      </div>
    `;
  },

  /**
   * Render a single V2.0 activity
   */
  renderV2Activity(activity, number) {
    const theme = activity.theme || 'teal';
    
    // Render based on activity type
    let activityContent = '';
    switch (activity.type) {
      case 'labeling':
        activityContent = this.renderLabelingActivity(activity, theme);
        break;
      case 'matching':
        activityContent = this.renderMatchingActivity(activity, theme);
        break;
      case 'ordering':
        activityContent = this.renderOrderingActivity(activity, theme);
        break;
      case 'classification':
        activityContent = this.renderClassificationActivity(activity, theme);
        break;
      case 'fillBlank':
        activityContent = this.renderFillBlankActivity(activity, theme);
        break;
      case 'calculation':
        activityContent = this.renderCalculationActivity(activity, theme);
        break;
      default:
        activityContent = this.renderGenericActivity(activity, theme);
    }
    
    return `
      <div class="v2-activity-wrapper" data-activity-number="${number}">
        <div class="activity-header-v2">
          <span class="activity-badge">Activity ${number}</span>
          <span class="activity-xp">+${activity.xpReward || 50} XP</span>
        </div>
        ${activityContent}
      </div>
    `;
  },
  
  /**
   * Render generic activity for V2
   */
  renderGenericActivity(activity, theme) {
    return `
      <div class="activity-card activity-card--${theme}" data-activity="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="activity"></i>
          <h3>${activity.title || 'Activity'}</h3>
        </div>
        <div class="activity-card-body">
          ${activity.description ? `<p>${activity.description}</p>` : ''}
          <div class="answer-area">Complete this activity in your workbook...</div>
        </div>
      </div>
    `;
  },

  /**
   * Render V2.0 assessment
   */
  renderV2Assessment(lesson) {
    if (!lesson.assessment) return '';
    const assessment = lesson.assessment;
    
    return `
      <div class="v2-assessment">
        <h2><i data-lucide="clipboard-check"></i> Assessment</h2>
        ${assessment.multipleChoice ? this.renderV2MCQ(assessment.multipleChoice) : ''}
        ${assessment.shortAnswer ? this.renderV2ShortAnswer(assessment.shortAnswer) : ''}
      </div>
    `;
  },

  /**
   * Render V2.0 multiple choice questions
   */
  renderV2MCQ(questions) {
    if (!questions || questions.length === 0) return '';
    
    return `
      <div class="v2-mcq-section">
        <h3>Multiple Choice</h3>
        ${questions.map((q, index) => `
          <div class="question-item" data-question-id="${q.id || index}">
            <span class="marks"><i data-lucide="award"></i> ${q.marks || 1} mark${q.marks > 1 ? 's' : ''}</span>
            <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
            <div class="mc-options">
              ${q.options.map((opt, optIndex) => `
                <div class="mc-option" data-value="${opt.value || optIndex}">
                  <span class="mc-letter">${String.fromCharCode(65 + optIndex)}</span>
                  <span class="mc-text">${opt.text || opt}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * Render V2.0 short answer questions
   */
  renderV2ShortAnswer(questions) {
    if (!questions || questions.length === 0) return '';
    
    return `
      <div class="v2-saq-section">
        <h3>Short Answer</h3>
        ${questions.map((q, index) => `
          <div class="question-item" data-question-id="${q.id || index}">
            <span class="marks"><i data-lucide="award"></i> ${q.marks || 2} marks</span>
            <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
            <div class="answer-area" data-lines="${q.lines || 4}">
              ${Array(q.lines || 4).fill(0).map(() => '<div class="answer-line"></div>').join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * Render V2.0 answer key
   */
  renderV2Answers(lesson) {
    if (!lesson.answers && !lesson.answerKey) return '';
    
    const answers = lesson.answers || lesson.answerKey;
    
    return `
      <div class="answers">
        <div class="answers-header">
          <h2><i data-lucide="key"></i> Answer Key</h2>
        </div>
        ${answers.activities ? `
          <div class="answer-section">
            <h3>Activity Answers</h3>
            ${answers.activities.map((ans, index) => `
              <div class="answer-item">
                <h4>Activity ${index + 1}</h4>
                <p>${ans}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${answers.assessment ? `
          <div class="answer-section">
            <h3>Assessment Answers</h3>
            ${answers.assessment.map((ans, index) => `
              <div class="answer-item">
                <h4>Question ${index + 1}</h4>
                <p>${typeof ans === 'object' ? ans.explanation || ans.answer : ans}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * Bind V2.0 activity handlers
   */
  bindV2ActivityHandlers() {
    // MCQ option selection
    document.querySelectorAll('.mc-option').forEach(option => {
      option.addEventListener('click', () => {
        const questionItem = option.closest('.question-item');
        questionItem.querySelectorAll('.mc-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        option.classList.add('selected');
      });
    });
    
    // Answer area focus
    document.querySelectorAll('.answer-area').forEach(area => {
      area.addEventListener('focus', () => {
        area.classList.add('focused');
      });
      area.addEventListener('blur', () => {
        area.classList.remove('focused');
      });
    });
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
    if (!hook || typeof hook !== 'object') return '';
    return `
      <div class="engagement-hook reveal">
        <i data-lucide="lightbulb"></i>
        <div>
          <h4>${hook.title || 'Think About This...'}</h4>
          <p>${hook.content || ''}</p>
        </div>
      </div>
    `;
  },
  
  /**
   * Render content sections
   */
  renderContentSections(sections) {
    console.log('renderContentSections called with:', sections?.length || 0, 'sections');
    if (!sections || sections.length === 0) {
      console.log('No sections to render');
      return '';
    }
    
    return sections.map(section => {
      console.log('Rendering section:', section.type, section.title);
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
   * Render classification activity (drag-and-drop categories)
   */
  renderClassificationActivity(activity, theme) {
    const categories = activity.categories || [];
    const items = activity.items || [];
    
    return `
      <div class="activity-card activity-card--${theme} reveal" data-activity="${activity.id}" data-activity-type="classification">
        <div class="activity-card-header">
          <i data-lucide="grid-3x3"></i>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-card-body">
          ${activity.description ? `<p class="activity-description">${activity.description}</p>` : ''}
          
          <div class="classification-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 20px;">
            ${categories.map(cat => `
              <div class="classification-zone" data-category="${cat.id}" style="background: var(--bg-secondary); border: 2px dashed var(--border-light); border-radius: 12px; padding: 16px; min-height: 150px;">
                <h4 style="margin: 0 0 8px 0; color: var(--text-primary); font-size: 16px;">${cat.label}</h4>
                ${cat.description ? `<p style="margin: 0 0 12px 0; color: var(--text-secondary); font-size: 13px;">${cat.description}</p>` : ''}
                <div class="classification-items" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
              </div>
            `).join('')}
          </div>
          
          <div class="classification-items-pool" style="background: var(--bg-secondary); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 12px 0; color: var(--text-secondary); font-size: 14px;">
              <i data-lucide="move" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"></i>
              Drag items to categories or click to select then click category
            </p>
            <div class="classification-draggables" style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${items.map(item => `
                <div class="classification-item" 
                     data-item-id="${item.id}" 
                     data-correct-category="${item.category}"
                     draggable="true"
                     style="background: white; border: 2px solid var(--border-light); border-radius: 8px; padding: 10px 16px; cursor: grab; user-select: none; font-size: 14px; touch-action: manipulation;">
                  ${item.text}
                </div>
              `).join('')}
            </div>
          </div>
          
          <button class="check-classification-btn btn btn-primary">
            <i data-lucide="check-circle"></i>
            Check Answers
          </button>
        </div>
      </div>
    `;
  },
  
  /**
   * Render ordering activity (sequencing)
   */
  renderOrderingActivity(activity, theme) {
    const items = activity.items || [];
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    
    return `
      <div class="activity-card activity-card--${theme} reveal" data-activity="${activity.id}" data-activity-type="ordering">
        <div class="activity-card-header">
          <i data-lucide="arrow-up-down"></i>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-card-body">
          ${activity.description ? `<p class="activity-description">${activity.description}</p>` : ''}
          ${activity.instructions ? `<p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">${activity.instructions}</p>` : ''}
          
          <div class="ordering-container" style="margin-bottom: 20px;">
            <div class="ordering-list" style="display: flex; flex-direction: column; gap: 12px;">
              ${shuffled.map((item, index) => `
                <div class="ordering-item" 
                     data-item-id="${item.id}"
                     data-correct-position="${item.correctPosition}"
                     style="background: white; border: 2px solid var(--border-light); border-radius: 10px; padding: 16px; display: flex; align-items: center; gap: 12px; cursor: grab; touch-action: manipulation;">
                  <div class="ordering-handle" style="color: var(--text-tertiary); cursor: grab;">
                    <i data-lucide="grip-vertical"></i>
                  </div>
                  <div class="ordering-number" style="background: var(--primary-light); color: var(--primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;">${index + 1}</div>
                  <div style="flex: 1;">
                    <div style="font-weight: 500; color: var(--text-primary);">${item.text}</div>
                    ${item.detail ? `<div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">${item.detail}</div>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <button class="check-ordering-btn btn btn-primary">
            <i data-lucide="check-circle"></i>
            Check Order
          </button>
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
    
    // Immediately make elements that are already in viewport visible
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
    
    // Set up observer for elements that come into view later
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
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
        case 'classification':
          return this.renderClassificationActivity(activity, theme);
        case 'ordering':
          return this.renderOrderingActivity(activity, theme);
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
    
    // Classification activities - DRAG AND DROP
    document.querySelectorAll('.classification-item[draggable="true"]').forEach(item => {
      // Drag start
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.dataset.itemId);
        item.style.opacity = '0.5';
      });
      
      // Drag end
      item.addEventListener('dragend', () => {
        item.style.opacity = '1';
      });
      
      // Touch support for mobile
      item.addEventListener('touchstart', (e) => {
        item.dataset.touchDragging = 'true';
        item.style.opacity = '0.5';
      }, { passive: true });
      
      item.addEventListener('touchend', (e) => {
        item.dataset.touchDragging = 'false';
        item.style.opacity = '1';
        
        // Find what zone we're over
        const touch = e.changedTouches[0];
        const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const zone = elemBelow?.closest('.classification-zone');
        
        if (zone) {
          const itemsContainer = zone.querySelector('.classification-items');
          if (itemsContainer) {
            itemsContainer.appendChild(item);
          }
        }
      });
    });
    
    // Classification drop zones
    document.querySelectorAll('.classification-zone').forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.style.background = 'rgba(37, 99, 235, 0.1)';
      });
      
      zone.addEventListener('dragleave', () => {
        zone.style.background = '';
      });
      
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.style.background = '';
        
        const itemId = e.dataTransfer.getData('text/plain');
        const item = document.querySelector(`.classification-item[data-item-id="${itemId}"]`);
        
        if (item) {
          const itemsContainer = zone.querySelector('.classification-items');
          if (itemsContainer) {
            itemsContainer.appendChild(item);
          }
        }
      });
    });
    
    // Classification check button
    document.querySelectorAll('.check-classification-btn').forEach(btn => {
      TouchUtils.bindTap(btn, (e) => {
        const activity = e.target.closest('[data-activity]');
        const zones = activity.querySelectorAll('.classification-zone');
        let allCorrect = true;
        
        zones.forEach(zone => {
          const categoryId = zone.dataset.category;
          const items = zone.querySelectorAll('.classification-item');
          
          items.forEach(item => {
            const correctCategory = item.dataset.correctCategory;
            const isCorrect = categoryId === correctCategory;
            
            item.style.background = isCorrect ? '#d1fae5' : '#fee2e2';
            item.style.borderColor = isCorrect ? '#10b981' : '#ef4444';
            
            if (!isCorrect) allCorrect = false;
          });
        });
        
        // Show explanation for each item
        const items = activity.querySelectorAll('.classification-item');
        items.forEach(item => {
          const itemId = item.dataset.itemId;
          const correctCategory = item.dataset.correctCategory;
          const activityData = this.currentLesson?.activities?.find(a => a.id === activity.dataset.activity);
          const itemData = activityData?.items?.find(i => i.id === itemId);
          
          if (itemData && itemData.explanation) {
            const explanationEl = document.createElement('div');
            explanationEl.className = 'item-explanation';
            explanationEl.style.cssText = 'font-size: 12px; color: var(--text-secondary); margin-top: 6px; padding: 6px; background: rgba(0,0,0,0.05); border-radius: 4px;';
            explanationEl.textContent = itemData.explanation;
            item.appendChild(explanationEl);
          }
        });
        
        // Disable button after checking
        btn.disabled = true;
        btn.innerHTML = `
          <i data-lucide="${allCorrect ? 'check-circle' : 'alert-circle'}"></i>
          ${allCorrect ? 'All Correct!' : 'Review the answers above'}
        `;
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    });
    
    // Ordering activities
    document.querySelectorAll('.check-ordering-btn').forEach(btn => {
      TouchUtils.bindTap(btn, (e) => {
        const activity = e.target.closest('[data-activity]');
        const items = activity.querySelectorAll('.ordering-item');
        let allCorrect = true;
        
        items.forEach((item, index) => {
          const correctPosition = parseInt(item.dataset.correctPosition);
          const currentPosition = index + 1;
          const isCorrect = correctPosition === currentPosition;
          
          item.style.borderColor = isCorrect ? '#10b981' : '#ef4444';
          item.style.background = isCorrect ? '#d1fae5' : '#fee2e2';
          
          if (!isCorrect) allCorrect = false;
        });
        
        // Disable button after checking
        btn.disabled = true;
        btn.innerHTML = `
          <i data-lucide="${allCorrect ? 'check-circle' : 'alert-circle'}"></i>
          ${allCorrect ? 'Perfect Order!' : 'Some items are out of order'}
        `;
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
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

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LessonRenderer };
}
