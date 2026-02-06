/**
 * Science Learning Hub - Mini-Games System
 * Phase 02: Gamification Layer
 * 
 * Game Types:
 * - dragdrop: Drag and drop labels onto diagrams
 * - flashcards: Term/definition flip cards
 * - matching: Memory matching pairs
 * - sequence: Order steps in correct sequence
 */

const MiniGameManager = {
  STORAGE_KEY: 'sh_minigames',
  
  /**
   * Get game stats from storage
   */
  getGameStats() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      highScores: {},
      gameHistory: [],
      perfectGames: 0
    };
  },
  
  /**
   * Save game stats
   */
  saveGameStats(stats) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
  },
  
  /**
   * Record a completed game
   */
  recordGame(gameType, score, maxScore, won) {
    const stats = this.getGameStats();
    stats.gamesPlayed++;
    stats.totalScore += score;
    
    if (won) {
      stats.gamesWon++;
    }
    
    if (score === maxScore) {
      stats.perfectGames++;
    }
    
    // Track high score
    const gameKey = `${gameType}_highscore`;
    if (!stats.highScores[gameKey] || score > stats.highScores[gameKey]) {
      stats.highScores[gameKey] = score;
    }
    
    // Add to history
    stats.gameHistory.push({
      gameType,
      score,
      maxScore,
      won,
      date: new Date().toISOString()
    });
    
    // Keep only last 50 games
    if (stats.gameHistory.length > 50) {
      stats.gameHistory = stats.gameHistory.slice(-50);
    }
    
    this.saveGameStats(stats);
    
    // Award XP for playing
    if (window.XPManager) {
      const xpAmount = won ? 25 : 10;
      const bonusXP = score === maxScore ? 25 : 0;
      XPManager.awardXP(xpAmount + bonusXP, 'minigame', {
        gameType,
        score,
        perfect: score === maxScore
      });
    }
    
    return stats;
  },
  
  /**
   * Get stats for a specific game type
   */
  getGameTypeStats(gameType) {
    const stats = this.getGameStats();
    const history = stats.gameHistory.filter(g => g.gameType === gameType);
    
    return {
      played: history.length,
      won: history.filter(g => g.won).length,
      highScore: stats.highScores[`${gameType}_highscore`] || 0,
      averageScore: history.length > 0 
        ? Math.round(history.reduce((sum, g) => sum + g.score, 0) / history.length)
        : 0
    };
  }
};

window.MiniGameManager = MiniGameManager;

/**
 * Drag & Drop Game
 * Players drag labels onto correct drop zones
 */
const DragDropGame = {
  container: null,
  config: null,
  score: 0,
  totalItems: 0,
  placedItems: 0,
  
  /**
   * Initialize a drag and drop game
   * @param {HTMLElement} container - Container element
   * @param {Object} config - Game configuration
   * @param {string} config.title - Game title
   * @param {string} config.image - Background image URL (optional)
   * @param {Array} config.items - Array of {id, label, x, y, width, height}
   * @param {Function} config.onComplete - Callback when game completes
   */
  init(container, config) {
    this.container = container;
    this.config = config;
    this.score = 0;
    this.placedItems = 0;
    this.totalItems = config.items.length;
    
    this.render();
    this.setupDragAndDrop();
  },
  
  render() {
    const gameId = 'dragdrop-' + Date.now();
    
    this.container.innerHTML = `
      <div class="minigame-container dragdrop-game" id="${gameId}">
        <div class="minigame-header">
          <h3 class="minigame-title">${this.config.title}</h3>
          <div class="minigame-score">
            <span class="score-label">Score:</span>
            <span class="score-value">0/${this.totalItems}</span>
          </div>
        </div>
        
        <div class="minigame-instructions">
          <i data-lucide="move"></i>
          <span>Drag each label to its correct position on the diagram</span>
        </div>
        
        <div class="dragdrop-workspace">
          <div class="dragdrop-diagram" 
               style="${this.config.image ? `background-image: url('${this.config.image}');` : ''}
                      ${this.config.diagramWidth ? `width: ${this.config.diagramWidth};` : ''}
                      ${this.config.diagramHeight ? `height: ${this.config.diagramHeight};` : ''}">
            ${this.config.items.map(item => `
              <div class="drop-zone" 
                   data-id="${item.id}"
                   style="left: ${item.x}; top: ${item.y}; width: ${item.width || '120px'}; height: ${item.height || '40px'};">
                <span class="drop-hint">?</span>
              </div>
            `).join('')}
          </div>
          
          <div class="dragdrop-labels">
            <h4>Labels</h4>
            <div class="labels-container">
              ${this.shuffleArray([...this.config.items]).map(item => `
                <div class="draggable-label" draggable="true" data-id="${item.id}">
                  ${item.label}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="minigame-feedback" style="display: none;">
          <div class="feedback-content"></div>
        </div>
        
        <div class="minigame-actions">
          <button class="btn btn-secondary minigame-reset">
            <i data-lucide="rotate-ccw"></i>
            Reset
          </button>
          <button class="btn btn-primary minigame-check" disabled>
            <i data-lucide="check-circle"></i>
            Check Answers
          </button>
        </div>
      </div>
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    // Bind reset button
    this.container.querySelector('.minigame-reset').addEventListener('click', () => {
      this.reset();
    });
    
    // Bind check button
    this.container.querySelector('.minigame-check').addEventListener('click', () => {
      this.checkAnswers();
    });
  },
  
  setupDragAndDrop() {
    const draggables = this.container.querySelectorAll('.draggable-label');
    const dropZones = this.container.querySelectorAll('.drop-zone');
    
    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', draggable.dataset.id);
        draggable.classList.add('dragging');
      });
      
      draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
      });
    });
    
    dropZones.forEach(zone => {
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
        
        const id = e.dataTransfer.getData('text/plain');
        const draggable = this.container.querySelector(`.draggable-label[data-id="${id}"]`);
        
        if (draggable && !zone.classList.contains('filled')) {
          // Clear any existing label in this zone
          const existing = zone.querySelector('.draggable-label');
          if (existing) {
            this.returnLabelToPool(existing);
          }
          
          // Place the label
          zone.appendChild(draggable);
          zone.classList.add('filled');
          draggable.setAttribute('draggable', 'false');
          draggable.classList.add('placed');
          
          // Allow clicking to remove
          draggable.addEventListener('click', () => {
            this.returnLabelToPool(draggable);
            zone.classList.remove('filled');
            zone.querySelector('.drop-hint').style.display = 'flex';
          }, { once: true });
          
          zone.querySelector('.drop-hint').style.display = 'none';
          this.updateProgress();
        }
      });
    });
  },
  
  returnLabelToPool(label) {
    const pool = this.container.querySelector('.labels-container');
    label.setAttribute('draggable', 'true');
    label.classList.remove('placed');
    pool.appendChild(label);
    this.updateProgress();
  },
  
  updateProgress() {
    const filled = this.container.querySelectorAll('.drop-zone.filled').length;
    this.placedItems = filled;
    
    this.container.querySelector('.score-value').textContent = `${filled}/${this.totalItems}`;
    
    const checkBtn = this.container.querySelector('.minigame-check');
    checkBtn.disabled = filled !== this.totalItems;
  },
  
  checkAnswers() {
    const dropZones = this.container.querySelectorAll('.drop-zone');
    let correct = 0;
    
    dropZones.forEach(zone => {
      const zoneId = zone.dataset.id;
      const label = zone.querySelector('.draggable-label');
      
      if (label) {
        const labelId = label.dataset.id;
        
        if (zoneId === labelId) {
          zone.classList.add('correct');
          zone.classList.remove('incorrect');
          correct++;
        } else {
          zone.classList.add('incorrect');
          zone.classList.remove('correct');
        }
      }
    });
    
    this.score = correct;
    
    // Show feedback
    const feedback = this.container.querySelector('.minigame-feedback');
    const content = feedback.querySelector('.feedback-content');
    
    const percentage = Math.round((correct / this.totalItems) * 100);
    let message, icon;
    
    if (percentage === 100) {
      message = 'Perfect! 🎉 You got them all right!';
      icon = 'trophy';
    } else if (percentage >= 80) {
      message = `Great job! ${correct}/${this.totalItems} correct`;
      icon = 'star';
    } else if (percentage >= 60) {
      message = `Good effort! ${correct}/${this.totalItems} correct`;
      icon = 'thumbs-up';
    } else {
      message = `Keep practicing! ${correct}/${this.totalItems} correct`;
      icon = 'refresh-cw';
    }
    
    content.innerHTML = `
      <i data-lucide="${icon}"></i>
      <span>${message}</span>
    `;
    
    feedback.style.display = 'block';
    feedback.className = `minigame-feedback ${percentage === 100 ? 'success' : percentage >= 60 ? 'good' : 'try-again'}`;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    // Disable check button
    this.container.querySelector('.minigame-check').disabled = true;
    
    // Record game
    MiniGameManager.recordGame('dragdrop', this.score, this.totalItems, this.score === this.totalItems);
    
    // Trigger callback
    if (this.config.onComplete) {
      this.config.onComplete({
        score: this.score,
        maxScore: this.totalItems,
        won: this.score === this.totalItems
      });
    }
  },
  
  reset() {
    this.score = 0;
    this.placedItems = 0;
    this.init(this.container, this.config);
  },
  
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
};

window.DragDropGame = DragDropGame;

/**
 * Flashcard Game
 * Flip cards to study terms and definitions
 */
const FlashcardGame = {
  container: null,
  config: null,
  currentIndex: 0,
  cards: [],
  flipped: new Set(),
  
  /**
   * Initialize flashcard game
   * @param {HTMLElement} container - Container element
   * @param {Object} config - Game configuration
   * @param {string} config.title - Game title
   * @param {Array} config.cards - Array of {term, definition, image}
   */
  init(container, config) {
    this.container = container;
    this.config = config;
    this.currentIndex = 0;
    this.flipped = new Set();
    this.cards = this.shuffleArray([...config.cards]);
    
    this.render();
  },
  
  render() {
    const current = this.cards[this.currentIndex];
    
    this.container.innerHTML = `
      <div class="minigame-container flashcard-game">
        <div class="minigame-header">
          <h3 class="minigame-title">${this.config.title}</h3>
          <div class="minigame-progress">
            <span class="progress-current">${this.currentIndex + 1}</span>
            <span class="progress-separator">/</span>
            <span class="progress-total">${this.cards.length}</span>
          </div>
        </div>
        
        <div class="minigame-instructions">
          <i data-lucide="rotate-3d"></i>
          <span>Click the card to flip and see the answer</span>
        </div>
        
        <div class="flashcard-container">
          <div class="flashcard ${this.flipped.has(this.currentIndex) ? 'flipped' : ''}" 
               onclick="FlashcardGame.flipCurrent()">
            <div class="flashcard-inner">
              <div class="flashcard-front">
                ${current.image ? `<img src="${current.image}" alt="${current.term}">` : ''}
                <h4>${current.term}</h4>
                <span class="flashcard-hint">Click to flip</span>
              </div>
              <div class="flashcard-back">
                <h4>${current.term}</h4>
                <p>${current.definition}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flashcard-progress-bar">
          <div class="progress-fill" style="width: ${((this.currentIndex + 1) / this.cards.length) * 100}%"></div>
        </div>
        
        <div class="minigame-actions">
          <button class="btn btn-secondary" onclick="FlashcardGame.previous()" 
                  ${this.currentIndex === 0 ? 'disabled' : ''}>
            <i data-lucide="chevron-left"></i>
            Previous
          </button>
          
          <button class="btn btn-primary" onclick="FlashcardGame.markKnown()">
            <i data-lucide="check"></i>
            I Know This
          </button>
          
          <button class="btn btn-secondary" onclick="FlashcardGame.next()"
                  ${this.currentIndex === this.cards.length - 1 ? 'disabled' : ''}>
            Next
            <i data-lucide="chevron-right"></i>
          </button>
        </div>
        
        <div class="flashcard-stats">
          <span>Known: ${this.flipped.size}/${this.cards.length}</span>
        </div>
      </div>
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  flipCurrent() {
    this.flipped.add(this.currentIndex);
    const card = this.container.querySelector('.flashcard');
    card.classList.toggle('flipped');
    this.render();
  },
  
  next() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      this.render();
    }
  },
  
  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
    }
  },
  
  markKnown() {
    this.flipped.add(this.currentIndex);
    
    if (this.currentIndex < this.cards.length - 1) {
      this.next();
    } else {
      // Completed all cards
      this.showCompletion();
    }
  },
  
  showCompletion() {
    const known = this.flipped.size;
    const total = this.cards.length;
    
    MiniGameManager.recordGame('flashcards', known, total, known === total);
    
    this.container.innerHTML = `
      <div class="minigame-container flashcard-complete">
        <div class="completion-celebration">
          <i data-lucide="award"></i>
          <h3>Session Complete!</h3>
          <p>You reviewed ${total} flashcards</p>
          <div class="completion-stats">
            <div class="stat">
              <span class="stat-number">${known}</span>
              <span class="stat-label">Cards Known</span>
            </div>
          </div>
          <button class="btn btn-primary" onclick="FlashcardGame.restart()">
            <i data-lucide="rotate-ccw"></i>
            Study Again
          </button>
        </div>
      </div>
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  restart() {
    this.currentIndex = 0;
    this.flipped.clear();
    this.cards = this.shuffleArray([...this.config.cards]);
    this.render();
  },
  
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
};

window.FlashcardGame = FlashcardGame;

/**
 * Matching/Memory Game
 * Match pairs of cards
 */
const MatchingGame = {
  container: null,
  config: null,
  cards: [],
  flipped: [],
  matched: [],
  moves: 0,
  score: 0,
  gameLocked: false,
  
  /**
   * Initialize matching game
   * @param {HTMLElement} container - Container element
   * @param {Object} config - Game configuration
   * @param {string} config.title - Game title
   * @param {Array} config.pairs - Array of {id, term, match}
   */
  init(container, config) {
    this.container = container;
    this.config = config;
    this.flipped = [];
    this.matched = [];
    this.moves = 0;
    this.score = 0;
    this.gameLocked = false;
    
    // Create pairs
    this.cards = [];
    config.pairs.forEach((pair, index) => {
      this.cards.push(
        { id: `a-${index}`, pairId: index, content: pair.term, type: 'term' },
        { id: `b-${index}`, pairId: index, content: pair.match, type: 'match' }
      );
    });
    
    this.cards = this.shuffleArray(this.cards);
    this.render();
  },
  
  render() {
    this.container.innerHTML = `
      <div class="minigame-container matching-game">
        <div class="minigame-header">
          <h3 class="minigame-title">${this.config.title}</h3>
          <div class="minigame-stats">
            <span class="stat-item">
              <i data-lucide="move"></i>
              Moves: ${this.moves}
            </span>
            <span class="stat-item">
              <i data-lucide="check-circle"></i>
              Matches: ${this.matched.length}/${this.config.pairs.length}
            </span>
          </div>
        </div>
        
        <div class="minigame-instructions">
          <i data-lucide="search"></i>
          <span>Flip cards to find matching pairs</span>
        </div>
        
        <div class="matching-grid" style="grid-template-columns: repeat(${Math.min(4, this.cards.length / 2)}, 1fr);">
          ${this.cards.map(card => `
            <div class="matching-card ${this.matched.includes(card.id) ? 'matched' : ''} ${this.flipped.includes(card.id) ? 'flipped' : ''}"
                 data-id="${card.id}"
                 onclick="MatchingGame.flip('${card.id}')">
              <div class="matching-card-inner">
                <div class="matching-card-front">
                  <i data-lucide="help-circle"></i>
                </div>
                <div class="matching-card-back">
                  ${card.content}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="minigame-actions">
          <button class="btn btn-secondary" onclick="MatchingGame.reset()">
            <i data-lucide="rotate-ccw"></i>
            New Game
          </button>
        </div>
      </div>
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  flip(cardId) {
    if (this.gameLocked) return;
    if (this.flipped.includes(cardId)) return;
    if (this.matched.includes(cardId)) return;
    if (this.flipped.length >= 2) return;
    
    this.flipped.push(cardId);
    
    const card = this.container.querySelector(`.matching-card[data-id="${cardId}"]`);
    card.classList.add('flipped');
    
    if (this.flipped.length === 2) {
      this.moves++;
      this.checkMatch();
    }
  },
  
  checkMatch() {
    this.gameLocked = true;
    
    const [id1, id2] = this.flipped;
    const card1 = this.cards.find(c => c.id === id1);
    const card2 = this.cards.find(c => c.id === id2);
    
    if (card1.pairId === card2.pairId) {
      // Match!
      setTimeout(() => {
        this.matched.push(id1, id2);
        this.score++;
        this.flipped = [];
        this.gameLocked = false;
        this.render();
        
        if (this.matched.length === this.cards.length) {
          this.showCompletion();
        }
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        this.flipped = [];
        this.gameLocked = false;
        this.render();
      }, 1000);
    }
  },
  
  showCompletion() {
    const accuracy = Math.round((this.score / this.moves) * 100) || 0;
    const stars = this.moves <= this.config.pairs.length ? 3 : 
                  this.moves <= this.config.pairs.length * 1.5 ? 2 : 1;
    
    MiniGameManager.recordGame('matching', this.score, this.config.pairs.length, true);
    
    this.container.innerHTML = `
      <div class="minigame-container matching-complete">
        <div class="completion-celebration">
          <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
          <h3>Congratulations!</h3>
          <p>You found all the matches</p>
          <div class="completion-stats">
            <div class="stat">
              <span class="stat-number">${this.moves}</span>
              <span class="stat-label">Total Moves</span>
            </div>
            <div class="stat">
              <span class="stat-number">${accuracy}%</span>
              <span class="stat-label">Accuracy</span>
            </div>
          </div>
          <button class="btn btn-primary" onclick="MatchingGame.reset()">
            <i data-lucide="rotate-ccw"></i>
            Play Again
          </button>
        </div>
      </div>
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  reset() {
    this.flipped = [];
    this.matched = [];
    this.moves = 0;
    this.score = 0;
    this.gameLocked = false;
    this.cards = this.shuffleArray(this.cards);
    this.render();
  },
  
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
};

window.MatchingGame = MatchingGame;

/**
 * Sequence Game
 * Order items in the correct sequence
 */
const SequenceGame = {
  container: null,
  config: null,
  currentOrder: [],
  score: 0,
  
  init(container, config) {
    this.container = container;
    this.config = config;
    this.currentOrder = this.shuffleArray([...config.items]);
    this.score = 0;
    
    this.render();
  },
  
  render() {
    this.container.innerHTML = `
      <div class="minigame-container sequence-game">
        <div class="minigame-header">
          <h3 class="minigame-title">${this.config.title}</h3>
          <div class="minigame-instructions">
            <i data-lucide="arrow-up-down"></i>
            <span>Drag to arrange in the correct order</span>
          </div>
        </div>
        
        <div class="sequence-list">
          ${this.currentOrder.map((item, index) => `
            <div class="sequence-item" draggable="true" data-index="${index}" data-id="${item.id}">
              <span class="sequence-number">${index + 1}</span>
              <span class="sequence-content">${item.content}</span>
              <i data-lucide="grip-vertical" class="sequence-handle"></i>
            </div>
          `).join('')}
        </div>
        
        <div class="minigame-actions">
          <button class="btn btn-secondary" onclick="SequenceGame.shuffle()">
            <i data-lucide="shuffle"></i>
            Shuffle
          </button>
          <button class="btn btn-primary" onclick="SequenceGame.check()">
            <i data-lucide="check-circle"></i>
            Check Order
          </button>
        </div>
        
        <div class="minigame-feedback" style="display: none;"></div>
      </div>
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    this.setupDragAndDrop();
  },
  
  setupDragAndDrop() {
    const items = this.container.querySelectorAll('.sequence-item');
    let draggedItem = null;
    
    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        item.classList.add('dragging');
      });
      
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        draggedItem = null;
        this.updateNumbers();
      });
      
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedItem && draggedItem !== item) {
          const list = item.parentElement;
          const draggedIndex = Array.from(list.children).indexOf(draggedItem);
          const targetIndex = Array.from(list.children).indexOf(item);
          
          if (draggedIndex < targetIndex) {
            item.after(draggedItem);
          } else {
            item.before(draggedItem);
          }
        }
      });
    });
  },
  
  updateNumbers() {
    const items = this.container.querySelectorAll('.sequence-item');
    items.forEach((item, index) => {
      item.querySelector('.sequence-number').textContent = index + 1;
      item.dataset.index = index;
    });
  },
  
  shuffle() {
    this.currentOrder = this.shuffleArray([...this.currentOrder]);
    this.render();
  },
  
  check() {
    const items = this.container.querySelectorAll('.sequence-item');
    const currentIds = Array.from(items).map(item => parseInt(item.dataset.id));
    const correctIds = this.config.items.map(item => item.id);
    
    let correct = 0;
    items.forEach((item, index) => {
      const id = parseInt(item.dataset.id);
      if (id === correctIds[index]) {
        correct++;
        item.classList.add('correct');
        item.classList.remove('incorrect');
      } else {
        item.classList.add('incorrect');
        item.classList.remove('correct');
      }
    });
    
    this.score = correct;
    const total = this.config.items.length;
    const percentage = Math.round((correct / total) * 100);
    
    const feedback = this.container.querySelector('.minigame-feedback');
    
    let message;
    if (percentage === 100) {
      message = 'Perfect sequence! 🎉';
    } else if (percentage >= 75) {
      message = `Good job! ${correct}/${total} in correct order`;
    } else {
      message = `Keep trying! ${correct}/${total} in correct order`;
    }
    
    feedback.innerHTML = `
      <div class="feedback-content ${percentage === 100 ? 'success' : 'partial'}">
        <i data-lucide="${percentage === 100 ? 'check-circle' : 'alert-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    feedback.style.display = 'block';
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    MiniGameManager.recordGame('sequence', correct, total, correct === total);
  },
  
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
};

window.SequenceGame = SequenceGame;

/**
 * Mini-Game Loader
 * Loads and initializes games in lesson pages
 */
const MiniGameLoader = {
  /**
   * Initialize all games on the page
   */
  init() {
    const gameContainers = document.querySelectorAll('[data-minigame]');
    gameContainers.forEach(container => {
      this.loadGame(container);
    });
  },
  
  /**
   * Load a specific game into a container
   */
  loadGame(container) {
    const gameType = container.dataset.minigame;
    const gameData = container.dataset.gameData;
    
    let config;
    try {
      config = JSON.parse(gameData);
    } catch (e) {
      console.error('Invalid game data:', e);
      return;
    }
    
    switch (gameType) {
      case 'dragdrop':
        DragDropGame.init(container, config);
        break;
      case 'flashcards':
        FlashcardGame.init(container, config);
        break;
      case 'matching':
        MatchingGame.init(container, config);
        break;
      case 'sequence':
        SequenceGame.init(container, config);
        break;
      default:
        console.error('Unknown game type:', gameType);
    }
  }
};

window.MiniGameLoader = MiniGameLoader;

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MiniGameLoader.init());
} else {
  MiniGameLoader.init();
}

console.log('✓ Mini-Games loaded');
