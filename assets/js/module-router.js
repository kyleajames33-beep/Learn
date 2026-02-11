/**
 * Module Router - Phase 1
 * Dynamic module loading and navigation
 */

const ModuleRouter = {
  // Cache for loaded modules
  cache: {},

  /**
   * Load module manifest
   * @param {string} moduleId - e.g., "module-1-cells"
   * @returns {Promise<Object>} Module data
   */
  async loadModule(moduleId) {
    // Return cached if available
    if (this.cache[moduleId]) {
      return this.cache[moduleId];
    }

    try {
      const response = await fetch(`../hsc-biology/data/modules/${moduleId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load module: ${moduleId}`);
      }

      const module = await response.json();
      this.cache[moduleId] = module;
      return module;
    } catch (error) {
      console.error('Module load error:', error);
      return null;
    }
  },

  /**
   * Get lesson data from module
   * @param {string} lessonId - e.g., "module-1-cells-lesson-1"
   * @returns {Promise<Object>} Lesson data
   */
  async getLesson(lessonId) {
    const moduleId = lessonId.replace(/-lesson-\d+$/, '');
    const module = await this.loadModule(moduleId);
    
    if (!module) return null;

    return module.lessons.find(l => l.id === lessonId) || null;
  },

  /**
   * Get adjacent lessons (prev/next)
   * @param {string} lessonId - Current lesson ID
   * @returns {Promise<Object>} { prev, next }
   */
  async getAdjacentLessons(lessonId) {
    const moduleId = lessonId.replace(/-lesson-\d+$/, '');
    const module = await this.loadModule(moduleId);
    
    if (!module) return { prev: null, next: null };

    const currentIndex = module.lessons.findIndex(l => l.id === lessonId);
    if (currentIndex === -1) return { prev: null, next: null };

    const prev = currentIndex > 0 ? module.lessons[currentIndex - 1] : null;
    const next = currentIndex < module.lessons.length - 1 ? module.lessons[currentIndex + 1] : null;

    return { prev, next };
  },

  /**
   * Calculate module progress
   * @param {string} moduleId - Module ID
   * @returns {Promise<Object>} Progress stats
   */
  async getProgress(moduleId) {
    const module = await this.loadModule(moduleId);
    if (!module) return { completed: 0, total: 0, percentage: 0 };

    // Get completed lessons from localStorage
    const progressKey = `hsc-biology-${moduleId}-progress`;
    let completed = [];
    
    try {
      const data = localStorage.getItem(progressKey);
      if (data) {
        const progress = JSON.parse(data);
        completed = Object.keys(progress).filter(k => progress[k] === true);
      }
    } catch (e) {
      console.error('Progress read error:', e);
    }

    const availableLessons = module.lessons.filter(l => l.status === 'available');
    const percentage = availableLessons.length > 0 
      ? Math.round((completed.length / availableLessons.length) * 100) 
      : 0;

    return {
      completed: completed.length,
      total: availableLessons.length,
      percentage: Math.min(100, percentage)
    };
  },

  /**
   * Render module sidebar
   * @param {string} moduleId - Module ID
   * @param {string} activeLessonId - Currently active lesson
   */
  async renderSidebar(moduleId, activeLessonId) {
    const module = await this.loadModule(moduleId);
    if (!module) return;

    const progress = await this.getProgress(moduleId);
    const container = document.querySelector('.lesson-list');
    if (!container) return;

    container.innerHTML = module.lessons.map(lesson => {
      const isActive = lesson.id === activeLessonId;
      const isAvailable = lesson.status === 'available';
      
      return `
        <a href="${isAvailable ? `lesson.html?lesson=${lesson.id}` : '#'}" 
           class="lesson-item ${isActive ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}"
           data-lesson="${lesson.number}"
           ${isActive ? 'aria-current="page"' : ''}
           ${!isAvailable ? 'onclick="return false"' : ''}>
          <span class="lesson-number">${lesson.number}</span>
          <span class="lesson-title-text">${lesson.title}</span>
          ${lesson.status === 'coming-soon' 
            ? '<span class="coming-soon-badge">Soon</span>' 
            : '<i data-lucide="check" class="lesson-check"></i>'}
        </a>
      `;
    }).join('');

    // Update progress bar
    const progressFill = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) progressFill.style.width = `${progress.percentage}%`;
    if (progressText) progressText.textContent = `${progress.completed}/${progress.total} lessons`;

    // Re-init icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  /**
   * Render navigation buttons
   * @param {string} lessonId - Current lesson ID
   */
  async renderNavigation(lessonId) {
    const { prev, next } = await this.getAdjacentLessons(lessonId);
    const container = document.querySelector('.lesson-navigation');
    if (!container) return;

    container.innerHTML = `
      ${prev && prev.status === 'available' ? `
        <a href="lesson.html?lesson=${prev.id}" class="lesson-nav-btn">
          <i data-lucide="chevron-left"></i>
          <div class="nav-btn-content">
            <span class="nav-btn-label">Previous</span>
            <span class="nav-btn-title">${prev.title}</span>
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

      <a href="${this.getModuleIndexUrl(lessonId)}" class="lesson-nav-home">
        <i data-lucide="grid-3x3"></i>
        <span>All Lessons</span>
      </a>

      ${next && next.status === 'available' ? `
        <a href="lesson.html?lesson=${next.id}" class="lesson-nav-btn">
          <div class="nav-btn-content" style="text-align: right;">
            <span class="nav-btn-label">Next</span>
            <span class="nav-btn-title">${next.title}</span>
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
    `;

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  /**
   * Get module index URL from lesson ID
   */
  getModuleIndexUrl(lessonId) {
    const moduleId = lessonId.replace(/-lesson-\d+$/, '');
    return `hsc-biology/${moduleId.replace('module-', 'module-')}/index.html`;
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModuleRouter };
}
