/**
 * Science Learning Hub - Main JavaScript
 * Phase 00: Foundation
 */

// ========================================
// STORAGE MANAGER
// ========================================

const StorageManager = {
  STORAGE_PREFIX: 'sh_',

  /**
   * Check if localStorage is available
   */
  isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available');
      return false;
    }
  },

  /**
   * Get item from storage
   */
  get(key) {
    if (!this.isAvailable()) return null;
    try {
      const item = localStorage.getItem(this.STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from storage:', e);
      return null;
    }
  },

  /**
   * Set item in storage
   */
  set(key, value) {
    if (!this.isAvailable()) return false;
    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error writing to storage:', e);
      return false;
    }
  },

  /**
   * Mark a lesson as complete
   */
  markLessonComplete(yearLevel, moduleId, lessonId) {
    const key = `progress_${yearLevel}_${moduleId}`;
    const progress = this.get(key) || { completed: [], lastVisited: null };
    
    if (!progress.completed.includes(lessonId)) {
      progress.completed.push(lessonId);
      progress.completed.sort((a, b) => a - b);
    }
    
    progress.lastVisited = lessonId;
    return this.set(key, progress);
  },

  /**
   * Check if a lesson is complete
   */
  isLessonComplete(yearLevel, moduleId, lessonId) {
    const key = `progress_${yearLevel}_${moduleId}`;
    const progress = this.get(key);
    return progress && progress.completed.includes(lessonId);
  },

  /**
   * Get module progress stats
   */
  getModuleProgress(yearLevel, moduleId, totalLessons) {
    const key = `progress_${yearLevel}_${moduleId}`;
    const progress = this.get(key);
    const completed = progress ? progress.completed.length : 0;
    
    return {
      completed,
      total: totalLessons,
      percentage: Math.round((completed / totalLessons) * 100),
      completedLessons: progress ? progress.completed : []
    };
  },

  /**
   * Save last visited lesson
   */
  saveLastVisited(yearLevel, moduleId, lessonId) {
    const key = `progress_${yearLevel}_${moduleId}`;
    const progress = this.get(key) || { completed: [], lastVisited: null };
    progress.lastVisited = lessonId;
    return this.set(key, progress);
  },

  /**
   * Get last visited lesson
   */
  getLastVisited(yearLevel, moduleId) {
    const key = `progress_${yearLevel}_${moduleId}`;
    const progress = this.get(key);
    return progress ? progress.lastVisited : null;
  }
};

// ========================================
// UI FUNCTIONS
// ========================================

/**
 * Setup mobile sidebar toggle
 */
function setupMobileSidebar() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.lesson-sidebar');
  
  if (!toggleBtn || !sidebar) return;

  // Create overlay if it doesn't exist
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener('click', closeSidebar);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  // Close sidebar when clicking on a lesson link (mobile)
  const lessonLinks = sidebar.querySelectorAll('.lesson-item');
  lessonLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    });
  });
}

/**
 * Update sidebar progress bar
 */
function updateSidebarProgress(yearLevel, moduleId, totalLessons) {
  const progress = StorageManager.getModuleProgress(yearLevel, moduleId, totalLessons);
  
  const progressFill = document.querySelector('.progress-bar-fill');
  const progressText = document.querySelector('.progress-text');
  
  if (progressFill) {
    progressFill.style.width = `${progress.percentage}%`;
  }
  
  if (progressText) {
    progressText.textContent = `${progress.completed}/${totalLessons} lessons (${progress.percentage}%)`;
  }

  // Update lesson item states
  const lessonItems = document.querySelectorAll('.lesson-item');
  lessonItems.forEach(item => {
    const lessonId = item.dataset.lesson;
    if (lessonId && StorageManager.isLessonComplete(yearLevel, moduleId, lessonId)) {
      item.classList.add('completed');
    }
  });
}

/**
 * Setup Mark Complete button
 */
function setupMarkComplete(yearLevel, moduleId, lessonId) {
  const btn = document.querySelector('.mark-complete-btn');
  if (!btn) return;

  // Check if already completed
  if (StorageManager.isLessonComplete(yearLevel, moduleId, lessonId)) {
    setButtonCompleted(btn);
  }

  btn.addEventListener('click', () => {
    if (btn.classList.contains('completed')) return;

    const success = StorageManager.markLessonComplete(yearLevel, moduleId, lessonId);
    
    if (success) {
      setButtonCompleted(btn);
      
      // Update sidebar
      const totalLessons = document.querySelectorAll('.lesson-item').length || 30;
      updateSidebarProgress(yearLevel, moduleId, totalLessons);
      
      // Show success feedback
      showToast('Lesson marked as complete!');
    }
  });
}

/**
 * Set button to completed state
 */
function setButtonCompleted(btn) {
  btn.classList.add('completed');
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
    <span>Completed!</span>
  `;
}

/**
 * Show toast notification
 */
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--text-primary);
    color: white;
    padding: 12px 24px;
    border-radius: 9999px;
    font-weight: 600;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Setup quiz validation
 */
function setupQuizValidation() {
  const quizForms = document.querySelectorAll('.quiz-form');
  
  quizForms.forEach(form => {
    const checkBtn = form.querySelector('.check-answers-btn');
    if (!checkBtn) return;

    checkBtn.addEventListener('click', () => {
      const questions = form.querySelectorAll('.quiz-question');
      let correct = 0;
      let total = questions.length;

      questions.forEach(q => {
        const correctValue = q.dataset.correct;
        const selected = q.querySelector('input[type="radio"]:checked');
        const options = q.querySelectorAll('.quiz-option');

        options.forEach(opt => {
          opt.classList.remove('correct', 'incorrect');
          const input = opt.querySelector('input[type="radio"]');
          
          if (input.value === correctValue) {
            opt.classList.add('correct');
          } else if (input.checked && input.value !== correctValue) {
            opt.classList.add('incorrect');
          }
        });

        if (selected && selected.value === correctValue) {
          correct++;
        }
      });

      // Show score
      let scoreDisplay = form.querySelector('.quiz-score');
      if (!scoreDisplay) {
        scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'quiz-score';
        scoreDisplay.style.cssText = `
          margin-top: 16px;
          padding: 16px;
          background: var(--bg-elevated);
          border-radius: var(--radius-md);
          text-align: center;
          font-weight: 600;
        `;
        form.appendChild(scoreDisplay);
      }
      
      const percentage = Math.round((correct / total) * 100);
      let message = `${correct}/${total} correct (${percentage}%)`;
      if (percentage === 100) message += ' - Perfect!';
      else if (percentage >= 80) message += ' - Great job!';
      else if (percentage >= 60) message += ' - Good effort!';
      else message += ' - Keep practicing!';
      
      scoreDisplay.textContent = message;
    });
  });
}

/**
 * Setup activity validation
 */
function setupActivityValidation() {
  // Matching activities
  const matchingForms = document.querySelectorAll('.matching-form');
  
  matchingForms.forEach(form => {
    const checkBtn = form.querySelector('.check-matching-btn');
    if (!checkBtn) return;

    checkBtn.addEventListener('click', () => {
      const items = form.querySelectorAll('.matching-item');
      let correct = 0;

      items.forEach(item => {
        const correctValue = item.dataset.correct;
        const select = item.querySelector('select');
        const isCorrect = select && select.value === correctValue;
        
        select.style.borderColor = isCorrect ? 'var(--success-dark)' : 'var(--danger-dark)';
        select.style.backgroundColor = isCorrect ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)';
        
        if (isCorrect) correct++;
      });

      showToast(`${correct}/${items.length} correct`);
    });
  });

  // Fill-in-the-blank activities
  const fillForms = document.querySelectorAll('.fill-blank-form');
  
  fillForms.forEach(form => {
    const checkBtn = form.querySelector('.check-fill-btn');
    if (!checkBtn) return;

    checkBtn.addEventListener('click', () => {
      const inputs = form.querySelectorAll('.modern-input');
      let correct = 0;

      inputs.forEach(input => {
        const correctValue = input.dataset.correct.toLowerCase().trim();
        const userValue = input.value.toLowerCase().trim();
        const isCorrect = userValue === correctValue;
        
        input.style.borderColor = isCorrect ? 'var(--success-dark)' : 'var(--danger-dark)';
        input.style.backgroundColor = isCorrect ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)';
        
        if (isCorrect) correct++;
      });

      showToast(`${correct}/${inputs.length} correct`);
    });
  });
}

/**
 * Setup scroll animations
 */
function setupScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length === 0) return;

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

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Initialize accordions
 */
function setupAccordions() {
  // Auto-open specific accordions
  const autoOpenAccordions = document.querySelectorAll('details[data-open="true"]');
  autoOpenAccordions.forEach(acc => acc.open = true);
}

// ========================================
// SERVICE WORKER REGISTRATION
// ========================================

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./assets/js/service-worker.js')
        .then((registration) => {
          console.log('[SW] Registered:', registration.scope);
        })
        .catch((error) => {
          console.log('[SW] Registration failed:', error);
        });
    });
  }
}

// ========================================
// INITIALIZATION
// ========================================

// Register service worker
registerServiceWorker();

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Setup UI components
  setupMobileSidebar();
  setupScrollAnimations();
  setupAccordions();
  setupQuizValidation();
  setupActivityValidation();
});

// Export for use in lesson files
window.StorageManager = StorageManager;
window.setupMarkComplete = setupMarkComplete;
window.updateSidebarProgress = updateSidebarProgress;
