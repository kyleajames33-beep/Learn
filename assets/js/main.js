/**
 * Science Learning Hub - Main JavaScript
 * Phase 00: Foundation
 * Vanilla ES6+ - No frameworks
 */

// ============================================
// SECTION 1: STORAGE MANAGER
// ============================================

const StorageManager = {
  STORAGE_PREFIX: 'sh_',

  /**
   * Check if localStorage is available
   * @returns {boolean}
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
   * @param {string} key
   * @returns {any}
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
   * @param {string} key
   * @param {any} value
   * @returns {boolean}
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
   * Remove item from storage
   * @param {string} key
   */
  remove(key) {
    if (!this.isAvailable()) return;
    localStorage.removeItem(this.STORAGE_PREFIX + key);
  },

  /**
   * Get progress key for a lesson
   * @param {string} yearLevel - e.g., 'hsc-biology'
   * @param {string} moduleId - e.g., 'module-1-cells'
   * @param {string} lessonId - e.g., 'lesson-1'
   * @returns {string}
   */
  getLessonKey(yearLevel, moduleId, lessonId) {
    return `progress_${yearLevel}_${moduleId}_${lessonId}`;
  },

  /**
   * Get module progress key
   * @param {string} yearLevel
   * @param {string} moduleId
   * @returns {string}
   */
  getModuleKey(yearLevel, moduleId) {
    return `progress_${yearLevel}_${moduleId}`;
  },

  /**
   * Mark a lesson as complete
   * @param {string} yearLevel
   * @param {string} moduleId
   * @param {string} lessonId
   * @returns {boolean}
   */
  markLessonComplete(yearLevel, moduleId, lessonId) {
    const key = this.getLessonKey(yearLevel, moduleId, lessonId);
    const data = {
      completed: true,
      completedAt: new Date().toISOString(),
      yearLevel,
      moduleId,
      lessonId
    };
    return this.set(key, data);
  },

  /**
   * Check if a lesson is complete
   * @param {string} yearLevel
   * @param {string} moduleId
   * @param {string} lessonId
   * @returns {boolean}
   */
  isLessonComplete(yearLevel, moduleId, lessonId) {
    const key = this.getLessonKey(yearLevel, moduleId, lessonId);
    const data = this.get(key);
    return data && data.completed === true;
  },

  /**
   * Mark a lesson as incomplete
   * @param {string} yearLevel
   * @param {string} moduleId
   * @param {string} lessonId
   */
  unmarkLessonComplete(yearLevel, moduleId, lessonId) {
    const key = this.getLessonKey(yearLevel, moduleId, lessonId);
    this.remove(key);
  },

  /**
   * Get all completed lessons for a module
   * @param {string} yearLevel
   * @param {string} moduleId
   * @returns {string[]} - Array of lesson IDs
   */
  getCompletedLessons(yearLevel, moduleId) {
    if (!this.isAvailable()) return [];
    const prefix = this.STORAGE_PREFIX + `progress_${yearLevel}_${moduleId}_lesson-`;
    const completed = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const data = this.get(key.replace(this.STORAGE_PREFIX, ''));
        if (data && data.completed) {
          completed.push(data.lessonId);
        }
      }
    }
    return completed;
  },

  /**
   * Get module progress percentage
   * @param {string} yearLevel
   * @param {string} moduleId
   * @param {number} totalLessons
   * @returns {object} - { completed, total, percentage }
   */
  getModuleProgress(yearLevel, moduleId, totalLessons) {
    const completed = this.getCompletedLessons(yearLevel, moduleId);
    return {
      completed: completed.length,
      total: totalLessons,
      percentage: Math.round((completed.length / totalLessons) * 100)
    };
  },

  /**
   * Save last visited lesson
   * @param {string} yearLevel
   * @param {string} moduleId
   * @param {string} lessonId
   */
  saveLastVisited(yearLevel, moduleId, lessonId) {
    this.set('lastVisited', {
      yearLevel,
      moduleId,
      lessonId,
      visitedAt: new Date().toISOString()
    });
  },

  /**
   * Get last visited lesson
   * @returns {object|null}
   */
  getLastVisited() {
    return this.get('lastVisited');
  },

  /**
   * Clear all progress (for testing)
   */
  clearAllProgress() {
    if (!this.isAvailable()) return;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_PREFIX + 'progress_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
};

// ============================================
// SECTION 2: UI FUNCTIONS
// ============================================

/**
 * Setup mobile sidebar toggle functionality
 */
function setupMobileSidebar() {
  const menuBtn = document.querySelector('.top-nav__menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (!menuBtn || !sidebar) return;
  
  // Create overlay if it doesn't exist
  let overlayEl = overlay;
  if (!overlayEl) {
    overlayEl = document.createElement('div');
    overlayEl.className = 'sidebar-overlay';
    document.body.appendChild(overlayEl);
  }
  
  // Toggle sidebar
  function openSidebar() {
    sidebar.classList.add('open');
    overlayEl.classList.add('active');
    document.body.style.overflow = 'hidden';
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlayEl.classList.remove('active');
    document.body.style.overflow = '';
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  
  function toggleSidebar() {
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
  
  // Event listeners
  menuBtn.addEventListener('click', toggleSidebar);
  overlayEl.addEventListener('click', closeSidebar);
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
  
  // Close sidebar when clicking a lesson link (mobile)
  const lessonLinks = sidebar.querySelectorAll('.sidebar__lesson-link');
  lessonLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    });
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeSidebar();
    }
  });
}

/**
 * Update sidebar progress bar and lesson checkmarks
 * @param {string} yearLevel
 * @param {string} moduleId
 * @param {number} totalLessons
 */
function updateSidebarProgress(yearLevel, moduleId, totalLessons) {
  const progress = StorageManager.getModuleProgress(yearLevel, moduleId, totalLessons);
  
  // Update progress bar
  const progressFill = document.querySelector('.sidebar__progress-fill');
  const progressText = document.querySelector('.sidebar__progress-text');
  
  if (progressFill) {
    progressFill.style.width = `${progress.percentage}%`;
  }
  
  if (progressText) {
    progressText.textContent = `${progress.completed}/${progress.total} lessons (${progress.percentage}%)`;
  }
  
  // Update lesson checkmarks
  const lessonLinks = document.querySelectorAll('.sidebar__lesson-link');
  lessonLinks.forEach(link => {
    const lessonId = link.dataset.lessonId;
    if (!lessonId) return;
    
    const isComplete = StorageManager.isLessonComplete(yearLevel, moduleId, lessonId);
    const checkEl = link.querySelector('.sidebar__lesson-check');
    
    if (isComplete) {
      link.classList.add('completed');
      if (checkEl) {
        checkEl.classList.remove('sidebar__lesson-check--empty');
        checkEl.innerHTML = '<i data-lucide="check" width="12" height="12"></i>';
      }
    } else {
      link.classList.remove('completed');
      if (checkEl) {
        checkEl.classList.add('sidebar__lesson-check--empty');
        checkEl.innerHTML = '';
      }
    }
  });
  
  // Re-initialize icons if Lucide is available
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * Setup Mark Complete button functionality
 * @param {string} yearLevel
 * @param {string} moduleId
 * @param {string} lessonId
 * @param {number} totalLessons
 */
function setupMarkComplete(yearLevel, moduleId, lessonId, totalLessons) {
  const btn = document.querySelector('.mark-complete__btn');
  const status = document.querySelector('.mark-complete__status');
  
  if (!btn) return;
  
  // Check if already complete
  const isComplete = StorageManager.isLessonComplete(yearLevel, moduleId, lessonId);
  
  if (isComplete) {
    showCompletedState();
  }
  
  function showCompletedState() {
    btn.style.display = 'none';
    if (status) {
      status.classList.add('visible');
    }
  }
  
  function showIncompleteState() {
    btn.style.display = 'inline-flex';
    btn.textContent = 'Mark as Complete';
    btn.classList.remove('btn--success');
    btn.classList.add('btn--primary');
    if (status) {
      status.classList.remove('visible');
    }
  }
  
  btn.addEventListener('click', () => {
    const currentlyComplete = StorageManager.isLessonComplete(yearLevel, moduleId, lessonId);
    
    if (currentlyComplete) {
      // Unmark complete
      StorageManager.unmarkLessonComplete(yearLevel, moduleId, lessonId);
      showIncompleteState();
    } else {
      // Mark complete
      const success = StorageManager.markLessonComplete(yearLevel, moduleId, lessonId);
      if (success) {
        showCompletedState();
        
        // Optional: Show celebration effect
        celebrateCompletion();
      }
    }
    
    // Update sidebar
    updateSidebarProgress(yearLevel, moduleId, totalLessons);
  });
  
  // Allow clicking the completed status to unmark
  if (status) {
    status.style.cursor = 'pointer';
    status.addEventListener('click', () => {
      StorageManager.unmarkLessonComplete(yearLevel, moduleId, lessonId);
      showIncompleteState();
      updateSidebarProgress(yearLevel, moduleId, totalLessons);
    });
  }
}

/**
 * Simple celebration animation when marking complete
 */
function celebrateCompletion() {
  const colors = ['#93e4f9', '#a7f3e0', '#ffc996', '#d4c5ff'];
  
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: 50%;
      top: 50%;
    `;
    document.body.appendChild(confetti);
    
    const angle = (Math.PI * 2 * i) / 20;
    const velocity = 100 + Math.random() * 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    confetti.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
    ], {
      duration: 800,
      easing: 'cubic-bezier(0, .9, .57, 1)',
    }).onfinish = () => confetti.remove();
  }
}

/**
 * Setup quiz validation
 * Supports multiple quizzes on one page
 */
function setupQuizValidation() {
  const quizContainers = document.querySelectorAll('[data-quiz]');
  
  quizContainers.forEach(container => {
    const checkBtn = container.querySelector('[data-check-answers]');
    const options = container.querySelectorAll('.quiz-option');
    
    if (!checkBtn) return;
    
    // Handle option selection
    options.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selected from siblings
        const name = option.querySelector('input')?.name;
        if (name) {
          const siblings = container.querySelectorAll(`input[name="${name}"]`);
          siblings.forEach(sibling => {
            sibling.closest('.quiz-option')?.classList.remove('selected');
          });
        }
        option.classList.add('selected');
        
        // Check the radio
        const radio = option.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });
    
    // Handle check answers
    checkBtn.addEventListener('click', () => {
      let correctCount = 0;
      let totalQuestions = 0;
      
      // Group options by question
      const questions = {};
      options.forEach(option => {
        const input = option.querySelector('input[type="radio"]');
        if (!input) return;
        
        const name = input.name;
        if (!questions[name]) {
          questions[name] = { options: [], hasCorrect: false };
          totalQuestions++;
        }
        questions[name].options.push({ option, input });
      });
      
      // Check each question
      Object.values(questions).forEach(question => {
        question.options.forEach(({ option, input }) => {
          option.classList.remove('correct', 'incorrect');
          
          if (input.checked) {
            if (input.dataset.correct === 'true') {
              option.classList.add('correct');
              correctCount++;
            } else {
              option.classList.add('incorrect');
            }
          } else if (input.dataset.correct === 'true') {
            // Show correct answer even if not selected
            option.classList.add('correct');
          }
        });
      });
      
      // Show score
      showQuizScore(container, correctCount, totalQuestions);
    });
  });
}

/**
 * Show quiz score feedback
 * @param {HTMLElement} container
 * @param {number} correct
 * @param {number} total
 */
function showQuizScore(container, correct, total) {
  let resultEl = container.querySelector('.quiz-result');
  if (!resultEl) {
    resultEl = document.createElement('div');
    resultEl.className = 'quiz-result';
    resultEl.style.cssText = `
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 12px;
      font-weight: 500;
      text-align: center;
    `;
    container.appendChild(resultEl);
  }
  
  const percentage = Math.round((correct / total) * 100);
  
  if (percentage === 100) {
    resultEl.style.backgroundColor = 'var(--success)';
    resultEl.style.color = '#065f46';
    resultEl.textContent = `🎉 Perfect! ${correct}/${total} correct`;
  } else if (percentage >= 70) {
    resultEl.style.backgroundColor = '#fef3c7';
    resultEl.style.color = '#92400e';
    resultEl.textContent = `👍 Good job! ${correct}/${total} correct`;
  } else {
    resultEl.style.backgroundColor = 'var(--danger)';
    resultEl.style.color = '#881337';
    resultEl.textContent = `📚 Keep studying! ${correct}/${total} correct`;
  }
}

/**
 * Setup activity validation (text inputs, matching, etc.)
 */
function setupActivityValidation() {
  // Text input activities
  const activityCards = document.querySelectorAll('[data-activity]');
  
  activityCards.forEach(card => {
    const checkBtn = card.querySelector('[data-check-activity]');
    if (!checkBtn) return;
    
    const inputs = card.querySelectorAll('input[data-answer], textarea[data-answer]');
    const resultEl = card.querySelector('.activity-result');
    
    checkBtn.addEventListener('click', () => {
      let correctCount = 0;
      let totalCount = 0;
      
      inputs.forEach(input => {
        totalCount++;
        const correctAnswer = input.dataset.answer?.toLowerCase().trim();
        const userAnswer = input.value.toLowerCase().trim();
        
        // Remove previous styles
        input.style.borderColor = '';
        input.style.backgroundColor = '';
        
        if (userAnswer === correctAnswer) {
          correctCount++;
          input.style.borderColor = '#10b981';
          input.style.backgroundColor = '#d1fae5';
        } else if (userAnswer) {
          input.style.borderColor = '#ef4444';
          input.style.backgroundColor = '#fee2e2';
        }
      });
      
      // Show result
      if (resultEl) {
        resultEl.style.display = 'block';
        if (correctCount === totalCount) {
          resultEl.className = 'activity-result success';
          resultEl.textContent = `✓ All correct! Great job!`;
        } else {
          resultEl.className = 'activity-result error';
          resultEl.textContent = `${correctCount}/${totalCount} correct. Try again!`;
        }
      }
    });
  });
  
  // Matching activities
  const matchingContainers = document.querySelectorAll('[data-matching]');
  matchingContainers.forEach(container => {
    setupMatchingActivity(container);
  });
}

/**
 * Setup drag-and-drop matching activity
 * @param {HTMLElement} container
 */
function setupMatchingActivity(container) {
  const items = container.querySelectorAll('[data-match-item]');
  const targets = container.querySelectorAll('[data-match-target]');
  const checkBtn = container.querySelector('[data-check-matching]');
  
  if (!items.length || !targets.length) return;
  
  // Simple click-to-match for mobile-friendly approach
  let selectedItem = null;
  
  items.forEach(item => {
    item.addEventListener('click', () => {
      // Deselect others
      items.forEach(i => i.classList.remove('selected'));
      
      if (selectedItem === item) {
        selectedItem = null;
      } else {
        selectedItem = item;
        item.classList.add('selected');
      }
    });
  });
  
  targets.forEach(target => {
    target.addEventListener('click', () => {
      if (!selectedItem) return;
      
      // Check if target already has an item
      const existing = target.querySelector('[data-match-item]');
      if (existing) {
        container.appendChild(existing);
      }
      
      // Move selected item to target
      target.appendChild(selectedItem);
      selectedItem.classList.remove('selected');
      selectedItem = null;
    });
  });
  
  // Check answers
  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      let correct = 0;
      let total = targets.length;
      
      targets.forEach(target => {
        const targetId = target.dataset.matchTarget;
        const item = target.querySelector('[data-match-item]');
        
        target.classList.remove('correct', 'incorrect');
        
        if (item && item.dataset.matchItem === targetId) {
          correct++;
          target.classList.add('correct');
        } else {
          target.classList.add('incorrect');
        }
      });
      
      const resultEl = container.querySelector('.matching-result') || document.createElement('div');
      resultEl.className = 'matching-result';
      resultEl.style.cssText = `
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 12px;
        text-align: center;
        font-weight: 500;
      `;
      
      if (correct === total) {
        resultEl.style.backgroundColor = 'var(--success)';
        resultEl.style.color = '#065f46';
        resultEl.textContent = '🎉 Perfect match!';
      } else {
        resultEl.style.backgroundColor = '#fef3c7';
        resultEl.style.color = '#92400e';
        resultEl.textContent = `${correct}/${total} matches correct`;
      }
      
      if (!container.querySelector('.matching-result')) {
        container.appendChild(resultEl);
      }
    });
  }
}

// ============================================
// SECTION 3: SCROLL ANIMATIONS
// ============================================

/**
 * Setup scroll reveal animations using IntersectionObserver
 */
function setupScrollAnimations() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if (!revealElements.length) return;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('visible'));
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after reveal
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

/**
 * Setup smooth anchor link scrolling
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Setup accordion functionality
 */
function setupAccordions() {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(accordion => {
    const triggers = accordion.querySelectorAll('.accordion__trigger');
    
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        const content = document.getElementById(trigger.getAttribute('aria-controls'));
        
        // Toggle current
        trigger.setAttribute('aria-expanded', !expanded);
        if (content) {
          content.setAttribute('aria-hidden', expanded);
        }
        
        // Optional: Close others (accordion behavior vs toggle behavior)
        if (!expanded) {
          triggers.forEach(otherTrigger => {
            if (otherTrigger !== trigger) {
              otherTrigger.setAttribute('aria-expanded', 'false');
              const otherContent = document.getElementById(otherTrigger.getAttribute('aria-controls'));
              if (otherContent) {
                otherContent.setAttribute('aria-hidden', 'true');
              }
            }
          });
        }
      });
    });
  });
}

// ============================================
// SECTION 4: UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func
 * @param {number} limit
 * @returns {Function}
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format date for display
 * @param {string} dateString
 * @returns {string}
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// ============================================
// SECTION 5: INITIALIZATION
// ============================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
  // Initialize Lucide icons if available
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Setup UI components
  setupMobileSidebar();
  setupScrollAnimations();
  setupSmoothScroll();
  setupAccordions();
  setupQuizValidation();
  setupActivityValidation();
  
  // Log initialization
  console.log('🧬 Science Learning Hub initialized');
  
  // Check storage availability
  if (!StorageManager.isAvailable()) {
    console.warn('⚠️ localStorage not available - progress will not be saved');
  }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose to global scope for debugging (remove in production)
window.ScienceHub = {
  StorageManager,
  updateSidebarProgress,
  setupMarkComplete,
  celebrateCompletion,
  clearProgress: () => StorageManager.clearAllProgress()
};
