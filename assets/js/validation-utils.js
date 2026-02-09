/**
 * Validation Utilities for HSC Biology
 * Phase A: Infrastructure
 * Version: 1.0.0
 */

const ValidationUtils = {
  version: '1.0.0',
  
  /**
   * Check if user answer is within tolerance of correct answer
   * @param {number} userVal - User's answer
   * @param {number} correctVal - Correct answer
   * @param {number} percent - Tolerance percentage (e.g., 5 for ±5%)
   * @returns {Object} - { correct: boolean, diff: number, percentDiff: number }
   */
  checkTolerance(userVal, correctVal, percent = 5) {
    const user = parseFloat(userVal);
    const correct = parseFloat(correctVal);
    
    if (isNaN(user) || isNaN(correct)) {
      return { correct: false, diff: NaN, percentDiff: NaN, error: 'Invalid number' };
    }
    
    const diff = Math.abs(user - correct);
    const percentDiff = (diff / correct) * 100;
    const tolerance = Math.abs(percent);
    
    return {
      correct: percentDiff <= tolerance,
      diff: diff,
      percentDiff: percentDiff,
      tolerance: tolerance,
      userVal: user,
      correctVal: correct
    };
  },
  
  /**
   * Format number for display (max 2 decimal places, trailing zeros removed)
   * @param {number} num 
   * @returns {string}
   */
  formatNumber(num) {
    if (isNaN(num)) return '---';
    return parseFloat(num.toFixed(2)).toString();
  },
  
  /**
   * Sanitise text input (basic XSS protection)
   * @param {string} text 
   * @returns {string}
   */
  sanitiseText(text) {
    if (!text) return '';
    return text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .trim();
  },
  
  /**
   * Check keyword spotting in text answer
   * @param {string} userAnswer 
   * @param {Array<string>} keywords - Required keywords
   * @param {Array<string>} [distractors] - Forbidden words
   * @returns {Object} - { passed: boolean, found: Array, missing: Array, forbidden: Array }
   */
  checkKeywords(userAnswer, keywords, distractors = []) {
    const answer = userAnswer.toLowerCase();
    const found = [];
    const missing = [];
    const forbidden = [];
    
    keywords.forEach(kw => {
      if (answer.includes(kw.toLowerCase())) {
        found.push(kw);
      } else {
        missing.push(kw);
      }
    });
    
    distractors.forEach(dw => {
      if (answer.includes(dw.toLowerCase())) {
        forbidden.push(dw);
      }
    });
    
    return {
      passed: found.length === keywords.length && forbidden.length === 0,
      found,
      missing,
      forbidden
    };
  }
};

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ValidationUtils };
}
