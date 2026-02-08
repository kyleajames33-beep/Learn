/**
 * Activity: Ordering (Sequencing) - Phase 0.6.3
 * Drag-and-drop or button-based ordering activity
 * Version: 1.0.0
 */

const ActivityOrdering = {
  version: '1.0.0',
  
  // Registry of active instances
  instances: new Map(),
  
  /**
   * Create ordering activity configuration
   * @param {Object} config 
   * @returns {Object}
   */
  create(config = {}) {
    return {
      id: config.id || this.generateId('ordering'),
      type: 'ordering',
      title: config.title || 'Ordering Activity',
      instructions: config.instructions || 'Arrange the items in the correct order.',
      items: config.items || [],
      shuffleDisplay: config.shuffleDisplay !== false,
      lockFirst: config.lockFirst || false,
      xpReward: config.xpReward || 50,
      allowRetry: config.allowRetry !== false
    };
  },
  
  /**
   * Add an item to the activity
   * @param {Object} activity 
   * @param {string} text 
   * @param {number} correctPosition 
   * @returns {Object}
   */
  addItem(activity, text, correctPosition) {
    const item = {
      id: this.generateId('item'),
      text: text,
      correctPosition: correctPosition
    };
    
    activity.items.push(item);
    return item;
  },
  
  /**
   * Remove an item
   * @param {Object} activity 
   * @param {string} itemId 
   */
  removeItem(activity, itemId) {
    const index = activity.items.findIndex(i => i.id === itemId);
    if (index > -1) {
      activity.items.splice(index, 1);
      // Update positions
      activity.items.forEach((item, idx) => {
        if (item.correctPosition > index + 1) {
          item.correctPosition--;
        }
      });
    }
  },
  
  /**
   * Get shuffled items for display
   * @param {Object} activity 
   * @returns {Array}
   */
  getDisplayItems(activity) {
    if (!activity.shuffleDisplay) {
      return [...activity.items].sort((a, b) => a.correctPosition - b.correctPosition);
    }
    
    // Shuffle, but respect lockFirst
    const items = [...activity.items];
    const lockedItem = activity.lockFirst ? items.find(i => i.correctPosition === 1) : null;
    
    if (lockedItem) {
      const shuffled = items.filter(i => i.id !== lockedItem.id);
      // Fisher-Yates shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return [lockedItem, ...shuffled];
    }
    
    // Shuffle all
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    
    return items;
  },
  
  /**
   * Render the activity for student view
   * @param {Object} activity 
   * @param {Object} options 
   * @returns {string}
   */
  render(activity, options = {}) {
    const instanceId = this.generateId('instance');
    const displayItems = this.getDisplayItems(activity);
    const theme = options.theme || 'teal';
    
    // Store instance data
    this.instances.set(instanceId, {
      activity: activity,
      currentOrder: displayItems.map(i => i.id),
      checked: false,
      correct: false
    });
    
    return `
      <div class="activity-card activity-card--${theme} activity-ordering" 
           data-activity-id="${activity.id}"
           data-instance-id="${instanceId}"
           data-type="ordering">
        <div class="activity-card-header">
          <i data-lucide="list-ordered"></i>
          <h3>${activity.title}</h3>
        </div>
        <div class="activity-card-body">
          <p class="activity-instructions">${activity.instructions}</p>
          
          <div class="ordering-items" id="ordering-${instanceId}">
            ${displayItems.map((item, index) => `
              <div class="ordering-item ${activity.lockFirst && item.correctPosition === 1 ? 'locked' : ''}"
                   data-item-id="${item.id}"
                   data-position="${index + 1}"
                   draggable="${!(activity.lockFirst && item.correctPosition === 1)}">
                <span class="ordering-number">${index + 1}</span>
                <span class="ordering-text">${this.escapeHtml(item.text)}</span>
                ${!(activity.lockFirst && item.correctPosition === 1) ? `
                  <div class="ordering-controls">
                    <button class="ordering-btn ordering-up" aria-label="Move up">
                      <i data-lucide="chevron-up"></i>
                    </button>
                    <button class="ordering-btn ordering-down" aria-label="Move down">
                      <i data-lucide="chevron-down"></i>
                    </button>
                  </div>
                ` : '<span class="ordering-locked-badge"><i data-lucide="lock"></i></span>'}
              </div>
            `).join('')}
          </div>
          
          <div class="ordering-feedback" id="feedback-${instanceId}" style="display: none;"></div>
          
          <div class="ordering-actions">
            <button class="btn btn-primary check-ordering-btn" data-instance="${instanceId}">
              <i data-lucide="check-circle"></i>
              Check Order
            </button>
            ${activity.allowRetry ? `
              <button class="btn btn-secondary reset-ordering-btn" data-instance="${instanceId}" style="display: none;">
                <i data-lucide="refresh-cw"></i>
                Try Again
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
    container.querySelectorAll('.check-ordering-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const instanceId = e.currentTarget.dataset.instance;
        this.checkAnswer(instanceId);
      });
    });
    
    // Reset button
    container.querySelectorAll('.reset-ordering-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const instanceId = e.currentTarget.dataset.instance;
        this.reset(instanceId);
      });
    });
    
    // Drag and drop
    this.bindDragEvents(container);
    
    // Button controls
    this.bindButtonControls(container);
  },
  
  /**
   * Bind drag and drop events
   * @param {HTMLElement} container 
   */
  bindDragEvents(container) {
    let draggedItem = null;
    let draggedFromIndex = null;
    
    container.querySelectorAll('.ordering-item[draggable="true"]').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        draggedFromIndex = Array.from(item.parentElement.children).indexOf(item);
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        draggedItem = null;
        draggedFromIndex = null;
        
        // Update all numbers
        container.querySelectorAll('.ordering-items').forEach(list => {
          this.updateNumbers(list);
        });
      });
    });
    
    container.querySelectorAll('.ordering-items').forEach(list => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!draggedItem) return;
        
        const afterElement = this.getDragAfterElement(list, e.clientY);
        if (afterElement) {
          list.insertBefore(draggedItem, afterElement);
        } else {
          list.appendChild(draggedItem);
        }
      });
    });
  },
  
  /**
   * Get element after drag position
   * @param {HTMLElement} container 
   * @param {number} y 
   * @returns {HTMLElement|null}
   */
  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.ordering-item[draggable="true"]:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  },
  
  /**
   * Bind button controls (up/down arrows)
   * @param {HTMLElement} container 
   */
  bindButtonControls(container) {
    container.querySelectorAll('.ordering-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.currentTarget.closest('.ordering-item');
        const prev = item.previousElementSibling;
        if (prev && !prev.classList.contains('locked')) {
          item.parentElement.insertBefore(item, prev);
          this.updateNumbers(item.parentElement);
          this.clearFeedback(item.closest('.activity-ordering'));
        }
      });
    });
    
    container.querySelectorAll('.ordering-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.currentTarget.closest('.ordering-item');
        const next = item.nextElementSibling;
        if (next) {
          item.parentElement.insertBefore(next, item);
          this.updateNumbers(item.parentElement);
          this.clearFeedback(item.closest('.activity-ordering'));
        }
      });
    });
  },
  
  /**
   * Update position numbers
   * @param {HTMLElement} list 
   */
  updateNumbers(list) {
    list.querySelectorAll('.ordering-item').forEach((item, index) => {
      item.querySelector('.ordering-number').textContent = index + 1;
      item.dataset.position = index + 1;
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
    const list = document.getElementById(`ordering-${instanceId}`);
    const items = list.querySelectorAll('.ordering-item');
    
    let allCorrect = true;
    const results = [];
    
    items.forEach((itemEl, index) => {
      const itemId = itemEl.dataset.itemId;
      const item = activity.items.find(i => i.id === itemId);
      const currentPosition = index + 1;
      const isCorrect = item.correctPosition === currentPosition;
      
      itemEl.classList.remove('correct', 'incorrect');
      itemEl.classList.add(isCorrect ? 'correct' : 'incorrect');
      
      if (!isCorrect) allCorrect = false;
      results.push({ item, currentPosition, isCorrect });
    });
    
    instance.checked = true;
    instance.correct = allCorrect;
    
    // Show feedback
    const feedback = document.getElementById(`feedback-${instanceId}`);
    feedback.style.display = 'block';
    
    if (allCorrect) {
      feedback.innerHTML = `
        <div class="feedback-success">
          <i data-lucide="check-circle"></i>
          <span>Correct! You arranged all items in the right order.</span>
        </div>
      `;
      
      // Award XP if available
      if (typeof XPManager !== 'undefined') {
        XPManager.awardActivityXP(activity.id, activity.xpReward);
      }
    } else {
      feedback.innerHTML = `
        <div class="feedback-error">
          <i data-lucide="alert-circle"></i>
          <span>Not quite right. Items in red are in the wrong position.</span>
        </div>
      `;
    }
    
    // Show reset button if allowed
    if (activity.allowRetry && !allCorrect) {
      const resetBtn = list.closest('.activity-ordering').querySelector('.reset-ordering-btn');
      if (resetBtn) resetBtn.style.display = 'inline-flex';
    }
    
    // Disable check button
    const checkBtn = list.closest('.activity-ordering').querySelector('.check-ordering-btn');
    checkBtn.disabled = true;
    
    // Re-render icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  /**
   * Clear feedback
   * @param {HTMLElement} container 
   */
  clearFeedback(container) {
    const feedback = container.querySelector('.ordering-feedback');
    if (feedback) {
      feedback.style.display = 'none';
      feedback.innerHTML = '';
    }
    
    container.querySelectorAll('.ordering-item').forEach(item => {
      item.classList.remove('correct', 'incorrect');
    });
    
    const checkBtn = container.querySelector('.check-ordering-btn');
    if (checkBtn) checkBtn.disabled = false;
  },
  
  /**
   * Reset the activity
   * @param {string} instanceId 
   */
  reset(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) return;
    
    const activity = instance.activity;
    const list = document.getElementById(`ordering-${instanceId}`);
    const displayItems = this.getDisplayItems(activity);
    
    // Rebuild the list
    list.innerHTML = displayItems.map((item, index) => `
      <div class="ordering-item ${activity.lockFirst && item.correctPosition === 1 ? 'locked' : ''}"
           data-item-id="${item.id}"
           data-position="${index + 1}"
           draggable="${!(activity.lockFirst && item.correctPosition === 1)}">
        <span class="ordering-number">${index + 1}</span>
        <span class="ordering-text">${this.escapeHtml(item.text)}</span>
        ${!(activity.lockFirst && item.correctPosition === 1) ? `
          <div class="ordering-controls">
            <button class="ordering-btn ordering-up" aria-label="Move up">
              <i data-lucide="chevron-up"></i>
            </button>
            <button class="ordering-btn ordering-down" aria-label="Move down">
              <i data-lucide="chevron-down"></i>
            </button>
          </div>
        ` : '<span class="ordering-locked-badge"><i data-lucide="lock"></i></span>'}
      </div>
    `).join('');
    
    // Clear feedback
    const container = list.closest('.activity-ordering');
    this.clearFeedback(container);
    
    // Hide reset button
    const resetBtn = container.querySelector('.reset-ordering-btn');
    if (resetBtn) resetBtn.style.display = 'none';
    
    // Re-bind events
    this.bindDragEvents(container);
    this.bindButtonControls(container);
    
    // Update instance
    instance.checked = false;
    instance.correct = false;
    instance.currentOrder = displayItems.map(i => i.id);
    
    // Re-render icons
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
  module.exports = { ActivityOrdering };
}
