/**
 * Client-Side Error Tracker
 * Captures all JavaScript errors and logs them to localStorage
 * for later debugging analysis.
 *
 * Usage: Include this script in lesson.html BEFORE other scripts
 * <script src="../assets/js/error-tracker.js"></script>
 */

(function() {
  'use strict';

  const MAX_ERRORS = 50; // Maximum errors to store
  const STORAGE_KEY = 'science-hub-errors';

  // Get browser info
  function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    else if (ua.indexOf('Edge') > -1) browser = 'Edge';

    return {
      browser,
      userAgent: ua,
      platform: navigator.platform,
      language: navigator.language,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };
  }

  // Get current lesson ID from URL
  function getCurrentLessonId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lesson') || window.location.pathname.split('/').pop().replace('.html', '') || 'unknown';
  }

  // Store error in localStorage
  function logError(errorData) {
    try {
      const errors = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

      // Add new error
      errors.push(errorData);

      // Keep only last MAX_ERRORS
      const trimmed = errors.slice(-MAX_ERRORS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      // localStorage might be full or unavailable
      console.error('[ErrorTracker] Failed to log error:', e);
    }
  }

  // Capture JavaScript errors
  window.addEventListener('error', function(event) {
    const errorData = {
      type: 'error',
      timestamp: new Date().toISOString(),
      lessonId: getCurrentLessonId(),
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
      stack: event.error ? event.error.stack : null,
      browser: getBrowserInfo()
    };

    logError(errorData);
    console.error('[ErrorTracker] Logged error:', errorData.message);
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const errorData = {
      type: 'unhandledRejection',
      timestamp: new Date().toISOString(),
      lessonId: getCurrentLessonId(),
      message: event.reason ? event.reason.toString() : 'Unknown promise rejection',
      stack: event.reason && event.reason.stack ? event.reason.stack : null,
      browser: getBrowserInfo()
    };

    logError(errorData);
    console.error('[ErrorTracker] Logged promise rejection:', errorData.message);
  });

  // Expose API for manual error logging
  window.ErrorTracker = {
    log: function(message, context) {
      const errorData = {
        type: 'manual',
        timestamp: new Date().toISOString(),
        lessonId: getCurrentLessonId(),
        message: message,
        context: context || {},
        browser: getBrowserInfo()
      };
      logError(errorData);
    },

    clear: function() {
      localStorage.removeItem(STORAGE_KEY);
      console.log('[ErrorTracker] Error log cleared');
    },

    getAll: function() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      } catch (e) {
        return [];
      }
    },

    count: function() {
      return this.getAll().length;
    }
  };

  console.log('[ErrorTracker] Initialized - errors will be logged to localStorage');
})();
