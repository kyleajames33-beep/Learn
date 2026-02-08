/**
 * Activity: Labeling - Phase 0.6.3
 * Label parts of a diagram by clicking or dragging
 * Version: 1.0.0
 */

const ActivityLabeling = {
  version: '1.0.0',
  
  // Registry of active instances
  instances: new Map(),
  
  /**
   * Create labeling activity configuration
   * @param {Object} config 
   * @returns {Object}
   */
  create(config = {}) {
    return {
      id: config.id || this.generateId('labeling'),
      type: 'labeling',
      title: config.title || 'Label the Diagram',
      image: config.image || null,
      labels: config.labels || [],
      allowRetry: config.allowRetry !== false,
      showHints: config.showHints !== false,
      xpReward: config.xpReward || 50,
      mode: config.mode || 'click' // 'click' or 'drag'
    };
  },
  
  /**
   * Add a label zone
   * @param {Object} activity 
   * @param {Object} labelData 
   * @returns {Object}
   */
  addLabel(activity, labelData) {
    const label = {
      id: this.generateId('label'),
      zone: {
        x: labelData.x || 0,
        y: labelData.y || 0,
        width: labelData.width || 80,
        height: labelData.height || 60,
        polygon: labelData.polygon || null
      },
      correctText: labelData.correctText || '',
      alternatives: labelData.alternatives || [],
      hint: labelData.hint || ''
    };
    
    activity.labels.push(label);
    return label;
  },
  
  /**
   * Remove a label
   * @param {Object} activity 
   * @param {string} labelId 
   */
  removeLabel(activity, labelId) {
    const index = activity.labels.findIndex(l => l.id === labelId);
    if (index > -1) {
      activity.labels.splice(index, 1);
    }
  },
  
  /**
   * Update label zone
   * @param {Object} activity 
   * @param {string} labelId 
   * @param {Object} zoneData 
   */
  updateLabelZone(activity, labelId, zoneData) {
    const label = activity.labels.find(l => l.id === labelId);
    if (label) {
      label.zone = { ...label.zone, ...zoneData };
    }
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
    
    // Store instance data
    this.instances.set(instanceId, {
      activity: activity,
      answers: {}, // labelId -> user answer
      checked: false,
      correct: false
    });
    
    // Prepare labels for display
    const labelsToShow = [...activity.labels];
    if (activity.mode === 'drag') {
      // Shuffle for drag mode
      for (let i = labelsToShow.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [labelsToShow[i], labelsToShow[j]] = [labelsToShow[j], labelsToShow[i]];
      }
    }
    
    return `
      <div class="activity-card activity-card--${theme} activity-labeling" 
           data-activity-id="${activity.id}"
           data-instance-id="${instanceId}"
           data-type="labeling"
           data-mode="${activity.mode}">
        <div class="activity-card-header">
          <i data-lucide="tags"></i>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-card-body">
          ${activity.mode === 'drag' ? `
            <p class="activity-instructions">Drag each label to the correct area on the diagram.</p>
          ` : `
            <p class="activity-instructions">Click on each numbered area and type the correct label.</p>
          `}
          
          <div class="labeling-container">
            <div class="labeling-diagram-wrapper">
              <div class="labeling-diagram" id="diagram-${instanceId}">
                <img src="${activity.image?.src || activity.image}" 
                     alt="Diagram to label"
                     class="labeling-image">
                ${activity.labels.map((label, index) => `
                  <div class="labeling-zone ${activity.mode === 'click' ? 'clickable' : ''}"
                       data-label-id="${label.id}"
                       data-zone-index="${index + 1}"
                       style="left: ${label.zone.x}%; top: ${label.zone.y}%; 
                              width: ${label.zone.width}px; height: ${label.zone.height}px;">
                    <span class="zone-number">${index + 1}</span>
                    ${activity.mode === 'click' ? `
                      <input type="text" 
                             class="labeling-input" 
                             placeholder="Label..."
                             aria-label="Label for zone ${index + 1}">
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
            
            ${activity.mode === 'drag' ? `
              <div class="labeling-pool" id="pool-${instanceId}">
                ${labelsToShow.map(label => `
                  <div class="labeling-draggable" 
                       draggable="true"
                       data-label-id="${label.id}"
                       title="${activity.showHints && label.hint ? label.hint : ''}">
                    ${this.escapeHtml(label.correctText)}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
          
          <div class="labeling-feedback" id="feedback-${instanceId}" style="display: none;"></div>
          
          <div class="labeling-actions">
            <button class="btn btn-primary check-labeling-btn" data-instance="${instanceId}">
              <i data-lucide="check-circle"></i>
              Check Labels
            </button>
            ${activity.allowRetry ? `
              <button class="btn btn-secondary reset-labeling-btn" data-instance="${instanceId}" style="display: none;">
                <i data-lucide="refresh-cw"></i>
                Try Again
              </button>
            ` : ''}
            ${activity.showHints ? `
              <button class="btn btn-ghost show-hints-btn" data-instance="${instanceId}">
                <i data-lucide="help-circle"></i>
                Show Hints
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },
  
  /**
   * Bind events for the activity
   * @param {HTMLElement} container 
   */
  bindEvents(container) {
    // Check button
    container.querySelectorAll('.check-labeling-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const instanceId = e.currentTarget.dataset.instance;
        this.checkAnswer(instanceId);
      });
    });
    
    // Reset button
    container.querySelectorAll('.reset-labeling-btn').forEach(btn => {
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
    
    // Click mode: zone selection
    container.querySelectorAll('.labeling-zone.clickable').forEach(zone => {
      zone.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          const input = zone.querySelector('.labeling-input');
          if (input) input.focus();
        }
      });
    });
    
    // Drag mode
    this.bindDragEvents(container);
  },
  
  /**
   * Bind drag and drop events
   * @param {HTMLElement} container 
   */
  bindDragEvents(container) {
    let draggedLabel = null;
    
    // Draggable labels
    container.querySelectorAll('.labeling-draggable').forEach(label => {
      label.addEventListener('dragstart', (e) => {
        draggedLabel = label;
        label.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', label.dataset.labelId);
      });
      
      label.addEventListener('dragend', () => {
        label.classList.remove('dragging');
        draggedLabel = null;
      });
    });
    
    // Drop zones
    container.querySelectorAll('.labeling-zone').forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });
      
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        
        const labelId = e.dataTransfer.getData('text/plain');
        const instanceId = zone.closest('.activity-labeling').dataset.instanceId;
        const instance = this.instances.get(instanceId);
        
        if (instance && draggedLabel) {
          const zoneId = zone.dataset.labelId;
          instance.answers[zoneId] = labelId;
          
          // Visual feedback
          zone.innerHTML = `<span class="zone-label">${draggedLabel.textContent}</span>`;
          zone.classList.add('has-label');
          
          // Remove from pool
          draggedLabel.style.display = 'none';
        }
      });
    });
    
    // Return to pool
    container.querySelectorAll('.labeling-pool').forEach(pool => {
      pool.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      
      pool.addEventListener('drop', (e) => {
        e.preventDefault();
        
        if (draggedLabel) {
          draggedLabel.style.display = 'block';
          
          // Clear any zone that had this label
          const instanceId = pool.closest('.activity-labeling').dataset.instanceId;
          const instance = this.instances.get(instanceId);
          
          Object.keys(instance.answers).forEach(zoneId => {
            if (instance.answers[zoneId] === draggedLabel.dataset.labelId) {
              delete instance.answers[zoneId];
              
              // Reset zone visual
              const zone = document.querySelector(`[data-label-id="${zoneId}"]`);
              if (zone) {
                const index = zone.dataset.zoneIndex;
                zone.innerHTML = `<span class="zone-number">${index}</span>`;
                zone.classList.remove('has-label');
              }
            }
          });
        }
      });
    });
  },
  
  /**
   * Check the answer
   * @param {string} instanceId 
   */
  checkAnswer(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) return;
    
    const activity = instance.activity;
    const container = document.querySelector(`[data-instance-id="${instanceId}"]`);
    
    let correctCount = 0;
    
    if (activity.mode === 'click') {
      // Check input values
      container.querySelectorAll('.labeling-zone').forEach(zone => {
        const labelId = zone.dataset.labelId;
        const input = zone.querySelector('.labeling-input');
        const userAnswer = input.value.trim().toLowerCase();
        
        const label = activity.labels.find(l => l.id === labelId);
        const isCorrect = this.checkAnswerText(userAnswer, label);
        
        zone.classList.remove('correct', 'incorrect');
        input.classList.remove('correct', 'incorrect');
        
        if (isCorrect) {
          zone.classList.add('correct');
          input.classList.add('correct');
          correctCount++;
        } else if (userAnswer) {
          zone.classList.add('incorrect');
          input.classList.add('incorrect');
        }
        
        // Disable input
        input.disabled = true;
      });
    } else {
      // Check drag mode answers
      Object.entries(instance.answers).forEach(([zoneId, labelId]) => {
        const zone = container.querySelector(`[data-label-id="${zoneId}"]`);
        const label = activity.labels.find(l => l.id === zoneId);
        const userLabel = activity.labels.find(l => l.id === labelId);
        
        const isCorrect = labelId === zoneId;
        
        zone.classList.remove('correct', 'incorrect');
        zone.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        if (isCorrect) correctCount++;
      });
      
      // Mark unanswered as incorrect
      activity.labels.forEach(label => {
        if (!instance.answers[label.id]) {
          const zone = container.querySelector(`[data-label-id="${label.id}"]`);
          zone.classList.add('incorrect');
        }
      });
    }
    
    const allCorrect = correctCount === activity.labels.length;
    instance.checked = true;
    instance.correct = allCorrect;
    
    // Show feedback
    const feedback = document.getElementById(`feedback-${instanceId}`);
    feedback.style.display = 'block';
    
    if (allCorrect) {
      feedback.innerHTML = `
        <div class="feedback-success">
          <i data-lucide="check-circle"></i>
          <span>Excellent! All labels are correct!</span>
        </div>
      `;
      
      if (typeof XPManager !== 'undefined') {
        XPManager.awardActivityXP(activity.id, activity.xpReward);
      }
    } else {
      feedback.innerHTML = `
        <div class="feedback-error">
          <i data-lucide="alert-circle"></i>
          <span>You got ${correctCount} out of ${activity.labels.length} correct. Try again!</span>
        </div>
      `;
    }
    
    // Show reset button if allowed
    if (activity.allowRetry && !allCorrect) {
      const resetBtn = container.querySelector('.reset-labeling-btn');
      if (resetBtn) resetBtn.style.display = 'inline-flex';
    }
    
    // Disable check button
    const checkBtn = container.querySelector('.check-labeling-btn');
    checkBtn.disabled = true;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  /**
   * Check if answer text matches (with alternatives)
   * @param {string} userAnswer 
   * @param {Object} label 
   * @returns {boolean}
   */
  checkAnswerText(userAnswer, label) {
    if (!userAnswer) return false;
    
    const correct = label.correctText.toLowerCase().trim();
    const alternatives = (label.alternatives || []).map(a => a.toLowerCase().trim());
    
    return userAnswer === correct || alternatives.includes(userAnswer);
  },
  
  /**
   * Show hints
   * @param {string} instanceId 
   */
  showHints(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) return;
    
    const activity = instance.activity;
    const container = document.querySelector(`[data-instance-id="${instanceId}"]`);
    
    if (activity.mode === 'click') {
      container.querySelectorAll('.labeling-zone').forEach(zone => {
        const labelId = zone.dataset.labelId;
        const label = activity.labels.find(l => l.id === labelId);
        
        if (label.hint) {
          const input = zone.querySelector('.labeling-input');
          input.placeholder = label.hint;
        }
      });
    } else {
      container.querySelectorAll('.labeling-draggable').forEach(el => {
        const labelId = el.dataset.labelId;
        const label = activity.labels.find(l => l.id === labelId);
        
        if (label.hint) {
          el.title = label.hint;
        }
      });
    }
    
    // Disable hints button
    const hintsBtn = container.querySelector('.show-hints-btn');
    if (hintsBtn) {
      hintsBtn.disabled = true;
      hintsBtn.innerHTML = '<i data-lucide="help-circle"></i> Hints Shown';
    }
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
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
    
    if (activity.mode === 'click') {
      // Reset inputs
      container.querySelectorAll('.labeling-input').forEach(input => {
        input.value = '';
        input.disabled = false;
        input.classList.remove('correct', 'incorrect');
        input.placeholder = 'Label...';
      });
    } else {
      // Reset zones
      container.querySelectorAll('.labeling-zone').forEach(zone => {
        const index = zone.dataset.zoneIndex;
        zone.innerHTML = `<span class="zone-number">${index}</span>`;
        zone.classList.remove('correct', 'incorrect', 'has-label');
      });
      
      // Show all draggables
      container.querySelectorAll('.labeling-draggable').forEach(el => {
        el.style.display = 'block';
      });
    }
    
    // Clear zone classes
    container.querySelectorAll('.labeling-zone').forEach(zone => {
      zone.classList.remove('correct', 'incorrect');
    });
    
    // Clear feedback
    const feedback = document.getElementById(`feedback-${instanceId}`);
    feedback.style.display = 'none';
    feedback.innerHTML = '';
    
    // Hide reset button
    const resetBtn = container.querySelector('.reset-labeling-btn');
    if (resetBtn) resetBtn.style.display = 'none';
    
    // Enable check button
    const checkBtn = container.querySelector('.check-labeling-btn');
    checkBtn.disabled = false;
    
    // Enable hints button
    const hintsBtn = container.querySelector('.show-hints-btn');
    if (hintsBtn) {
      hintsBtn.disabled = false;
      hintsBtn.innerHTML = '<i data-lucide="help-circle"></i> Show Hints';
    }
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
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
  module.exports = { ActivityLabeling };
}
