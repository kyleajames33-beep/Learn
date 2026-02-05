/**
 * PROGRESS.JS
 * Handles progress tracking and display for lessons
 *
 * Dependencies: storage.js
 * Version: 1.0.0
 */

/**
 * Update progress bar for current module
 * @param {string} yearLevel - e.g., 'hsc-biology'
 * @param {string} module - e.g., 'module-5-heredity'
 * @param {number} totalLessons - Total number of lessons in the module
 */
function updateProgressBar(yearLevel, module, totalLessons) {
  const completed = getModuleProgress(yearLevel, module).length;
  const percentage = Math.round((completed / totalLessons) * 100);

  const progressFill = document.querySelector('.progress-bar-fill');
  const progressText = document.querySelector('.progress-text');

  if (progressFill) {
    progressFill.style.width = percentage + '%';
  }

  if (progressText) {
    progressText.textContent = `${completed}/${totalLessons} lessons (${percentage}%)`;
  }

  return {
    completed,
    total: totalLessons,
    percentage
  };
}

/**
 * Mark all completed lessons in sidebar
 * @param {string} yearLevel - e.g., 'hsc-biology'
 * @param {string} module - e.g., 'module-5-heredity'
 */
function markCompletedInSidebar(yearLevel, module) {
  const completedLessons = getModuleProgress(yearLevel, module);

  completedLessons.forEach(lessonId => {
    const item = document.querySelector(`[data-lesson="${lessonId}"]`);
    if (item) {
      item.classList.add('completed');

      // Show checkmark icon
      const checkIcon = item.querySelector('.lesson-check');
      if (checkIcon) {
        checkIcon.style.opacity = '1';
      }
    }
  });

  return completedLessons.length;
}

/**
 * Get completion status for a specific lesson
 * @param {string} yearLevel
 * @param {string} module
 * @param {string} lessonId
 * @returns {boolean} - True if lesson is complete
 */
function getLessonCompletionStatus(yearLevel, module, lessonId) {
  return isLessonComplete(yearLevel, module, lessonId);
}

/**
 * Initialize progress tracking for a lesson page
 * Combines common progress initialization tasks
 * @param {string} yearLevel
 * @param {string} module
 * @param {string} currentLesson
 * @param {number} totalLessons
 */
function initializeLessonProgress(yearLevel, module, currentLesson, totalLessons) {
  // Track page visit
  saveLastVisited(yearLevel, module, currentLesson);

  // Check if current lesson is complete
  const isCompleted = isLessonComplete(yearLevel, module, currentLesson);
  const completeBtn = document.getElementById('mark-complete-btn');

  if (isCompleted && completeBtn) {
    completeBtn.classList.add('completed');
    completeBtn.innerHTML = '<i data-lucide="check-circle" class="icon-sm"></i><span>Completed</span>';
    // Reinitialize Lucide icons if available
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // Mark completed lessons in sidebar
  markCompletedInSidebar(yearLevel, module);

  // Update progress bar
  const progress = updateProgressBar(yearLevel, module, totalLessons);

  return {
    isCurrentLessonComplete: isCompleted,
    progressData: progress
  };
}

/**
 * Setup mark complete button handler
 * @param {string} yearLevel
 * @param {string} module
 * @param {string} lessonId
 * @param {Function} callback - Optional callback after marking complete
 */
function setupMarkCompleteButton(yearLevel, module, lessonId, callback) {
  const completeBtn = document.getElementById('mark-complete-btn');

  if (!completeBtn) {
    console.warn('Mark complete button not found');
    return;
  }

  completeBtn.addEventListener('click', function() {
    // Mark lesson as complete
    markLessonComplete(yearLevel, module, lessonId);

    // Update button appearance
    this.classList.add('completed');
    this.innerHTML = '<i data-lucide="check-circle" class="icon-sm"></i><span>Completed!</span>';

    // Reinitialize Lucide icons if available
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }

    // Update sidebar
    const sidebarItem = document.querySelector('.lesson-item.active');
    if (sidebarItem) {
      sidebarItem.classList.add('completed');
    }

    // Update progress bar
    updateProgressBar(yearLevel, module, 30);

    // Execute callback if provided
    if (typeof callback === 'function') {
      callback();
    }

    // Show success message (optional)
    console.log(`✓ Lesson ${lessonId} marked as complete`);
  });
}

/**
 * Get progress statistics for a module
 * @param {string} yearLevel
 * @param {string} module
 * @param {number} totalLessons
 * @returns {Object} - Progress statistics
 */
function getProgressStats(yearLevel, module, totalLessons) {
  const completedLessons = getModuleProgress(yearLevel, module);
  const completed = completedLessons.length;
  const remaining = totalLessons - completed;
  const percentage = Math.round((completed / totalLessons) * 100);

  return {
    completed,
    remaining,
    total: totalLessons,
    percentage,
    completedLessons
  };
}

/**
 * Reset progress for a module (for testing/debugging)
 * @param {string} yearLevel
 * @param {string} module
 */
function resetModuleProgress(yearLevel, module) {
  const key = `${STORAGE_PREFIX}progress_${yearLevel}_${module}`;
  localStorage.removeItem(key);
  console.log(`✓ Progress reset for ${yearLevel}/${module}`);

  // Refresh progress display
  updateProgressBar(yearLevel, module, 30);

  // Remove completed class from all sidebar items
  document.querySelectorAll('.lesson-item.completed').forEach(item => {
    item.classList.remove('completed');
  });
}

/**
 * Export progress data (for debugging)
 * @param {string} yearLevel
 * @param {string} module
 * @returns {string} - JSON string of progress data
 */
function exportProgressData(yearLevel, module) {
  const stats = getProgressStats(yearLevel, module, 30);
  return JSON.stringify(stats, null, 2);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    updateProgressBar,
    markCompletedInSidebar,
    getLessonCompletionStatus,
    initializeLessonProgress,
    setupMarkCompleteButton,
    getProgressStats,
    resetModuleProgress,
    exportProgressData
  };
}

console.log('✓ Progress module loaded');
