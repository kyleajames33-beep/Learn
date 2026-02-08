/**
 * Activity: Fill-in-the-Blank (Cloze) - Phase 0.6.3
 * Inline text completion activity
 * Version: 1.0.0
 */

const ActivityFillBlank = {
  version: '1.0.0',
  
  // Registry of active instances
  instances: new Map(),
  
  // Track current focus for keyboard navigation
  currentFocusIndex: 0,
  
  /**
   * Create fill-in-the-blank activity configuration
   * @param {Object} config 
   * @returns {Object}
   */
  create(config = {}) {
    return {
      id: config.id || this.generateId('fillblank'),
      type: 'fillBlank',
      title: config.title || 'Fill in the Blanks',
      text: config.text || '',
      blanks: config.blanks || [],
      xpReward: config.xpReward || 50,
      allowRetry: config.allowRetry !== false
    };
  },
  
  /**
   * Parse text with [blank] markers and create blanks config
   * @param {string} text 
   * @returns {Object}
   */
  parseText(text) {
    const blanks = [];
    let blankIndex = 1;
    
    // Replace [blank] or [blank1], [blank2] etc. with placeholders
    const processedText = text.replace(/\[blank(\d*)\]/g, (match, num) => {
      const id = num || blankIndex;
      if (!num) blankIndex++;
      
      blanks.push({
        id: `blank-${id}`,
        placeholder: `blank${id}`
      });
      
      return `[${blanks[blanks.length - 1].id}]`;
    });
    
    return {
      text: processedText,
      blanks: blanks
    };
  },
  
  /**
   * Add a blank
   * @param {Object} activity 
   * @param {Object} blankData 
   * @returns {Object}
   */
  addBlank(activity, blankData) {
    const blank = {
      id: blankData.id || this.generateId('blank'),
      correct: blankData.correct || '',
      alternatives: blankData.alternatives || [],
      hint: blankData.hint || '',
      caseSensitive: blankData.caseSensitive || false,
      showFirstLetter: blankData.showFirstLetter || false
    };
    
    activity.blanks.push(blank);
    return blank;
  },
  
  /**
   * Update blank text markers in the activity text
   * @param {Object} activity 
   */
  updateBlankMarkers(activity) {
    // Ensure all blanks have markers in the text
    activity.blanks.forEach((blank, index) => {
      const marker = `[${blank.id}]`;
      if (!activity.text.includes(marker)) {
        // Add marker at end if not found
        activity.text += ` ${marker}`;
      }
    });
  },
  
  /**
   * Render the activity for student view
   * @param {Object} activity 
   * @param {Object} options 
   * @returns {string}
   */
  render(activity, options = {}) {
    const instanceId = this.generateId('instance');
    const theme = options.theme || 'teal';
    
    // Ensure markers are in text
    this.updateBlankMarkers(activity);
    
    // Store instance data
    this.instances.set(instanceId, {
      activity: activity,
      answers: {},
      checked: false,
      correct: false
    });
    
    // Process text to replace markers with inputs
    const processedText = this.processText(activity.text, activity.blanks, instanceId);
    
    return `
      <div class="activity-card activity-card--${theme} activity-fillblank" 
           data-activity-id="${activity.id}"
           data-instance-id="${instanceId}"
           data-type="fillBlank">
        <div class="activity-card-header">
          <i data-lucide="text-cursor-input"></i>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-card-body">
          <p class="activity-instructions">Read the text and fill in the missing words.</p>
          
          <div class="fillblank-text" id="text-${instanceId}">
            ${processedText}
          </div>
          
          <div class="fillblank-hints" id="hints-${instanceId}" style="display: none;">
            <h4>Hints:</h4>
            <ul>
              ${activity.blanks.map((blank, index) => `
                <li><strong>Blank ${index + 1}:</strong> ${blank.hint}</li>
              `).join('')}
            </ul>
          </div>
          
          <div class="fillblank-feedback" id="feedback-${instanceId}" style="display: none;"></div>
          
          <div class="fillblank-actions">
            <button class="btn btn-primary check-fillblank-btn" data-instance="${instanceId}">
              <i data-lucide="check-circle"></i>
              Check Answers
            </button>
            ${activity.allowRetry ? `
              <button class="btn btn-secondary reset-fillblank-btn" data-instance="${instanceId}" style="display: none;">
                <i data-lucide="refresh-cw"></i>
                Try Again
              </button>
            ` : ''}
            <button class="btn btn-ghost show-hints-btn" data-instance="${instanceId}">
              <i data-lucide="help-circle"></i>
              Show Hints
            </button>
          </div>
        </div>
      </div>
    `;
  },
  
  /**
   * Process text to replace markers with input fields
   * @param {string} text 
   * @param {Array} blanks 
   * @param {string} instanceId 
   * @returns {string}
   */
  processText(text, blanks, instanceId) {
    let processedText = this.escapeHtml(text);
    
    blanks.forEach((blank, index) => {
      const marker = `[${blank.id}]`;
      const placeholder = blank.showFirstLetter 
        ? `${blank.correct.charAt(0)}${'_'.repeat(blank.correct.length - 1)}` 
        : '?';
      
      const inputHtml = `
        <input type="text" 
               class="fillblank-input" 
               data-blank-id="${blank.id}"
               data-blank-index="${index}"
               placeholder="${placeholder}"
               aria-label="Blank ${index + 1}"
               autocomplete="off"
               spellcheck="false">
      `;
      
      processedText = processedText.replace(marker, inputHtml);
    });
    
    // Convert newlines to paragraphs
    const paragraphs = processedText.split(/\n\n+/);
    return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  },
  
  /**
   * Bind events for the activity
   * @param {HTMLElement} container 
   */
  bindEvents(container) {
    // Check button
    container.querySelectorAll('.check-fillblank-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const instanceId = e.currentTarget.dataset.instance;
        this.checkAnswer(instanceId);
      });
    });
    
    // Reset button
    container.querySelectorAll('.reset-fillblank-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const instanceId = e.currentTarget.dataset.instance;
        this.reset(instanceId);
      });
    });
    
    // Show hints
    container.querySelectorAll('.show-hints-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const instanceId = e.currentTarget.dataset.instance;
        this.showHints(instanceId);
      });
    });
    
    // Input events
    container.querySelectorAll('.fillblank-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const instanceId = e.target.closest('.activity-fillblank').dataset.instanceId;
        const blankId = e.target.dataset.blankId;
        const instance = this.instances.get(instanceId);
        
        if (instance) {
          instance.answers[blankId] = e.target.value;
        }
        
        // Clear feedback on input
        e.target.classList.remove('correct', 'incorrect');
      });
      
      // Tab navigation
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          
          const inputs = Array.from(container.querySelectorAll('.fillblank-input'));
          const currentIndex = inputs.indexOf(e.target);
          const nextIndex = e.shiftKey 
            ? (currentIndex - 1 + inputs.length) % inputs.length
            : (currentIndex + 1) % inputs.length;
          
          inputs[nextIndex].focus();
        }
      });
    });
  },
  
  /**
   * Check the answers
   * @param {string} instanceId 
   */
  checkAnswer(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) return;
    
    const activity = instance.activity;
    const container = document.querySelector(`[data-instance-id="${instanceId}"]`);
    
    let correctCount = 0;
    let answeredCount = 0;
    
    activity.blanks.forEach(blank => {
      const input = container.querySelector(`[data-blank-id="${blank.id}"]`);
      const userAnswer = (instance.answers[blank.id] || '').trim();
      
      if (userAnswer) answeredCount++;
      
      const isCorrect = this.checkAnswerText(userAnswer, blank);
      
      input.classList.remove('correct', 'incorrect');
      input.classList.add(isCorrect ? 'correct' : userAnswer ? 'incorrect' : '');
      
      if (isCorrect) correctCount++;
      
      // Disable input
      input.disabled = true;
    });
    
    const allCorrect = correctCount === activity.blanks.length;
    const allAnswered = answeredCount === activity.blanks.length;
    
    instance.checked = true;
    instance.correct = allCorrect;
    
    // Show feedback
    const feedback = document.getElementById(`feedback-${instanceId}`);
    feedback.style.display = 'block';
    
    if (allCorrect) {
      feedback.innerHTML = `
        <div class="feedback-success">
          <i data-lucide="check-circle"></i>
          <span>Perfect! All answers are correct!</span>
        </div>
      `;
      
      if (typeof XPManager !== 'undefined') {
        XPManager.awardActivityXP(activity.id, activity.xpReward);
      }
    } else if (!allAnswered) {
      feedback.innerHTML = `
        <div class="feedback-warning">
          <i data-lucide="alert-triangle"></i>
          <span>Please fill in all blanks before checking.</span>
        </div>
      `;
    } else {
      feedback.innerHTML = `
        <div class="feedback-error">
          <i data-lucide="alert-circle"></i>
          <span>You got ${correctCount} out of ${activity.blanks.length} correct. Review the red boxes and try again.</span>
        </div>
      `;
    }
    
    // Show reset button if allowed and not all correct
    if (activity.allowRetry && !allCorrect) {
      const resetBtn = container.querySelector('.reset-fillblank-btn');
      if (resetBtn) resetBtn.style.display = 'inline-flex';
    }
    
    // Disable check button if all correct
    const checkBtn = container.querySelector('.check-fillblank-btn');
    if (allCorrect) {
      checkBtn.disabled = true;
    }
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  /**
   * Check if answer text matches
   * @param {string} userAnswer 
   * @param {Object} blank 
   * @returns {boolean}
   */
  checkAnswerText(userAnswer, blank) {
    if (!userAnswer) return false;
    
    let correct = blank.correct;
    let answer = userAnswer;
    
    if (!blank.caseSensitive) {
      correct = correct.toLowerCase();
      answer = answer.toLowerCase();
    }
    
    correct = correct.trim();
    answer = answer.trim();
    
    if (answer === correct) return true;
    
    // Check alternatives
    return (blank.alternatives || []).some(alt => {
      let checkAlt = alt;
      if (!blank.caseSensitive) checkAlt = alt.toLowerCase();
      return answer === checkAlt.trim();
    });
  },
  
  /**
   * Show hints
   * @param {string} instanceId 
   */
  showHints(instanceId) {
    const hints = document.getElementById(`hints-${instanceId}`);
    if (hints) {
      hints.style.display = hints.style.display === 'none' ? 'block' : 'none';
    }
  },
  
  /**
   * Reset the activity
   * @param {string} instanceId 
   */
  reset(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) return;
    
    const activity = instance.activity;
    const container = document.querySelector(`[data-instance-id="${instanceId}"]`);
    
    // Clear answers
    instance.answers = {};
    instance.checked = false;
    instance.correct = false;
    
    // Reset inputs
    container.querySelectorAll('.fillblank-input').forEach(input => {
      input.value = '';
      input.disabled = false;
      input.classList.remove('correct', 'incorrect');
    });
    
    // Clear feedback
    const feedback = document.getElementById(`feedback-${instanceId}`);
    feedback.style.display = 'none';
    feedback.innerHTML = '';
    
    // Hide reset button
    const resetBtn = container.querySelector('.reset-fillblank-btn');
    if (resetBtn) resetBtn.style.display = 'none';
    
    // Enable check button
    const checkBtn = container.querySelector('.check-fillblank-btn');
    checkBtn.disabled = false;
    
    // Focus first input
    const firstInput = container.querySelector('.fillblank-input');
    if (firstInput) firstInput.focus();
  },
  
  /**
   * Escape HTML
   * @param {string} text 
   * @returns {string}
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  /**
   * Generate unique ID
   * @param {string} prefix 
   * @returns {string}
   */
  generateId(prefix = 'item') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Export for both module and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ActivityFillBlank };
}
