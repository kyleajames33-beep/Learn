/**
 * STORAGE.JS
 * Science Learning Hub - Local Storage Management
 *
 * Manages local storage operations for progress tracking:
 * - Last visited lesson tracking
 * - Lesson completion tracking
 * - Module progress calculation
 * - User preferences
 *
 * Version: 1.0.0
 * Last updated: February 4, 2026
 */

const STORAGE_PREFIX = 'scienceHub_';


// ============================================
// LAST VISITED LESSON
// ============================================

/**
 * Save the current lesson as last visited
 * @param {string} yearLevel - e.g., 'hsc-biology'
 * @param {string} module - e.g., 'module-5-heredity'
 * @param {string} lesson - e.g., 'lesson-12'
 */
function saveLastVisited(yearLevel, module, lesson) {
  const data = {
    yearLevel,
    module,
    lesson,
    timestamp: new Date().toISOString()
  };

  try {
    localStorage.setItem(`${STORAGE_PREFIX}lastVisited`, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}


/**
 * Get the last visited lesson
 * @returns {Object|null} Last visited data or null
 */
function getLastVisited() {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}lastVisited`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Could not read from localStorage:', e);
    return null;
  }
}


// ============================================
// LESSON COMPLETION
// ============================================

/**
 * Mark a lesson as complete
 * @param {string} yearLevel - e.g., 'hsc-biology'
 * @param {string} module - e.g., 'module-5-heredity'
 * @param {string} lesson - e.g., 'lesson-12'
 */
function markLessonComplete(yearLevel, module, lesson) {
  const key = `${STORAGE_PREFIX}progress_${yearLevel}_${module}`;

  try {
    let progress = JSON.parse(localStorage.getItem(key)) || { completed: [] };

    if (!progress.completed.includes(lesson)) {
      progress.completed.push(lesson);
      progress.lastAccessed = new Date().toISOString();
      localStorage.setItem(key, JSON.stringify(progress));

      // Dispatch event for UI updates
      window.dispatchEvent(new CustomEvent('lessonCompleted', {
        detail: { yearLevel, module, lesson }
      }));
    }
  } catch (e) {
    console.warn('Could not save progress:', e);
  }
}


/**
 * Check if a lesson is complete
 * @param {string} yearLevel
 * @param {string} module
 * @param {string} lesson
 * @returns {boolean}
 */
function isLessonComplete(yearLevel, module, lesson) {
  const key = `${STORAGE_PREFIX}progress_${yearLevel}_${module}`;

  try {
    const progress = JSON.parse(localStorage.getItem(key));
    return progress && progress.completed.includes(lesson);
  } catch (e) {
    return false;
  }
}


/**
 * Get all completed lessons for a module
 * @param {string} yearLevel
 * @param {string} module
 * @returns {Array} Array of completed lesson IDs
 */
function getModuleProgress(yearLevel, module) {
  const key = `${STORAGE_PREFIX}progress_${yearLevel}_${module}`;

  try {
    const progress = JSON.parse(localStorage.getItem(key));
    return progress ? progress.completed : [];
  } catch (e) {
    return [];
  }
}


/**
 * Calculate module completion percentage
 * @param {string} yearLevel
 * @param {string} module
 * @param {number} totalLessons
 * @returns {number} Percentage (0-100)
 */
function getModuleCompletionPercentage(yearLevel, module, totalLessons) {
  const completed = getModuleProgress(yearLevel, module);
  return Math.round((completed.length / totalLessons) * 100);
}


// ============================================
// USER PREFERENCES
// ============================================

/**
 * Save user preference
 * @param {string} key - Preference key
 * @param {any} value - Preference value
 */
function savePreference(key, value) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}pref_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('Could not save preference:', e);
  }
}


/**
 * Get user preference
 * @param {string} key - Preference key
 * @param {any} defaultValue - Default if not found
 * @returns {any}
 */
function getPreference(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(`${STORAGE_PREFIX}pref_${key}`);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}


// ============================================
// CLEAR DATA (for debugging/reset)
// ============================================

/**
 * Clear all Science Hub data from localStorage
 */
function clearAllData() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
  console.log('All Science Hub data cleared');
}


// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    saveLastVisited,
    getLastVisited,
    markLessonComplete,
    isLessonComplete,
    getModuleProgress,
    getModuleCompletionPercentage,
    savePreference,
    getPreference,
    clearAllData
  };
}

console.log('✓ Storage module loaded');
