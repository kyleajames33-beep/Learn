/**
 * Science Learning Hub - XP & Level System
 * Phase 02: Gamification Layer
 * 
 * XP Earning:
 * - Complete lesson: 100 XP
 * - Complete activity: 50 XP
 * - Perfect quiz score: 25 XP bonus
 * - Streak bonus: 10 XP per day of streak
 * - First lesson of day: 25 XP bonus
 * 
 * Level Formula: XP needed = level * 200 (e.g., Level 1 = 200 XP, Level 2 = 400 XP, etc.)
 */

const XPManager = {
  STORAGE_KEY: 'sh_xp',
  
  // XP values for different actions
  XP_VALUES: {
    LESSON_COMPLETE: 100,
    ACTIVITY_COMPLETE: 50,
    PERFECT_QUIZ: 25,
    STREAK_BONUS: 10,
    FIRST_LESSON_DAY: 25,
    DAILY_LOGIN: 10
  },
  
  // Level titles/ranks
  LEVEL_RANKS: {
    1: 'Novice Explorer',
    2: 'Curious Learner',
    3: 'Science Enthusiast',
    4: 'Knowledge Seeker',
    5: 'Cell Specialist',
    6: 'Biology Apprentice',
    7: 'Lab Assistant',
    8: 'Research Student',
    9: 'Junior Scientist',
    10: 'Science Scholar',
    15: 'Senior Researcher',
    20: 'Master Biologist',
    25: 'Science Professor',
    30: 'Nobel Candidate',
    40: 'Legendary Scientist',
    50: 'Science Icon'
  },
  
  /**
   * Get XP data from storage
   */
  getXPData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      totalXP: 0,
      currentLevel: 1,
      xpInCurrentLevel: 0,
      xpHistory: [],
      lessonsCompleted: [],
      activitiesCompleted: [],
      dailyBonusClaimed: false,
      lastDailyBonusDate: null
    };
  },
  
  /**
   * Save XP data to storage
   */
  saveXPData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },
  
  /**
   * Calculate XP needed for a level
   * Formula: level * 200
   */
  getXPForLevel(level) {
    return level * 200;
  },
  
  /**
   * Get total XP needed to reach a level
   */
  getTotalXPForLevel(targetLevel) {
    let total = 0;
    for (let i = 1; i < targetLevel; i++) {
      total += this.getXPForLevel(i);
    }
    return total;
  },
  
  /**
   * Calculate level from total XP
   */
  calculateLevel(totalXP) {
    let level = 1;
    let xpRemaining = totalXP;
    
    while (xpRemaining >= this.getXPForLevel(level)) {
      xpRemaining -= this.getXPForLevel(level);
      level++;
    }
    
    return {
      level: level,
      xpInCurrentLevel: xpRemaining,
      xpNeededForNextLevel: this.getXPForLevel(level),
      progressPercent: (xpRemaining / this.getXPForLevel(level)) * 100
    };
  },
  
  /**
   * Get rank title for level
   */
  getRankForLevel(level) {
    // Find the highest rank that applies to this level
    const ranks = Object.keys(this.LEVEL_RANKS)
      .map(Number)
      .filter(l => l <= level)
      .sort((a, b) => b - a);
    
    return ranks.length > 0 ? this.LEVEL_RANKS[ranks[0]] : 'Science Student';
  },
  
  /**
   * Award XP for an action
   */
  awardXP(amount, source, details = {}) {
    const data = this.getXPData();
    const today = new Date().toISOString().split('T')[0];
    
    // Check for duplicate awards (same lesson/activity)
    if (source === 'lesson' && details.lessonId) {
      if (data.lessonsCompleted.includes(details.lessonId)) {
        return { awarded: false, reason: 'Lesson already completed' };
      }
      data.lessonsCompleted.push(details.lessonId);
    }
    
    if (source === 'activity' && details.activityId) {
      const activityKey = `${details.lessonId}-${details.activityId}`;
      if (data.activitiesCompleted.includes(activityKey)) {
        return { awarded: false, reason: 'Activity already completed' };
      }
      data.activitiesCompleted.push(activityKey);
    }
    
    // Check for daily first lesson bonus
    if (source === 'lesson' && data.lastDailyBonusDate !== today) {
      amount += this.XP_VALUES.FIRST_LESSON_DAY;
      data.lastDailyBonusDate = today;
      details.firstLessonBonus = true;
    }
    
    // Add streak bonus if applicable
    if (details.streakDays && details.streakDays > 1) {
      const streakBonus = details.streakDays * this.XP_VALUES.STREAK_BONUS;
      amount += streakBonus;
      details.streakBonus = streakBonus;
    }
    
    // Award the XP
    data.totalXP += amount;
    
    // Recalculate level
    const levelInfo = this.calculateLevel(data.totalXP);
    const oldLevel = data.currentLevel;
    data.currentLevel = levelInfo.level;
    data.xpInCurrentLevel = levelInfo.xpInCurrentLevel;
    
    // Record in history
    data.xpHistory.push({
      date: today,
      amount: amount,
      source: source,
      details: details,
      newTotal: data.totalXP,
      level: data.currentLevel
    });
    
    // Keep only last 100 entries
    if (data.xpHistory.length > 100) {
      data.xpHistory = data.xpHistory.slice(-100);
    }
    
    this.saveXPData(data);
    
    return {
      awarded: true,
      amount: amount,
      newTotal: data.totalXP,
      newLevel: data.currentLevel,
      leveledUp: data.currentLevel > oldLevel,
      oldLevel: oldLevel,
      levelInfo: levelInfo
    };
  },
  
  /**
   * Award XP for completing a lesson
   */
  awardLessonXP(lessonId, streakDays = 0) {
    return this.awardXP(this.XP_VALUES.LESSON_COMPLETE, 'lesson', {
      lessonId: lessonId,
      streakDays: streakDays
    });
  },
  
  /**
   * Award XP for completing an activity
   */
  awardActivityXP(lessonId, activityId) {
    return this.awardXP(this.XP_VALUES.ACTIVITY_COMPLETE, 'activity', {
      lessonId: lessonId,
      activityId: activityId
    });
  },
  
  /**
   * Award bonus XP for perfect quiz
   */
  awardPerfectQuizXP(lessonId) {
    return this.awardXP(this.XP_VALUES.PERFECT_QUIZ, 'perfect_quiz', {
      lessonId: lessonId
    });
  },
  
  /**
   * Get XP stats for display
   */
  getXPStats() {
    const data = this.getXPData();
    const levelInfo = this.calculateLevel(data.totalXP);
    const rank = this.getRankForLevel(data.currentLevel);
    const nextRankLevel = this.getNextRankLevel(data.currentLevel);
    
    return {
      totalXP: data.totalXP,
      currentLevel: data.currentLevel,
      rank: rank,
      nextRank: nextRankLevel ? this.LEVEL_RANKS[nextRankLevel] : null,
      nextRankLevel: nextRankLevel,
      xpInCurrentLevel: data.xpInCurrentLevel,
      xpNeededForNextLevel: levelInfo.xpNeededForNextLevel,
      progressPercent: levelInfo.progressPercent,
      xpToNextLevel: levelInfo.xpNeededForNextLevel - data.xpInCurrentLevel,
      totalXPNeededForNextLevel: this.getTotalXPForLevel(data.currentLevel + 1),
      lessonsCompleted: data.lessonsCompleted.length,
      activitiesCompleted: data.activitiesCompleted.length,
      recentXP: data.xpHistory.slice(-7)
    };
  },
  
  /**
   * Get next rank level
   */
  getNextRankLevel(currentLevel) {
    const ranks = Object.keys(this.LEVEL_RANKS).map(Number).sort((a, b) => a - b);
    for (const level of ranks) {
      if (level > currentLevel) {
        return level;
      }
    }
    return null;
  },
  
  /**
   * Get XP breakdown for today
   */
  getTodayXP() {
    const data = this.getXPData();
    const today = new Date().toISOString().split('T')[0];
    
    const todayEntries = data.xpHistory.filter(entry => entry.date === today);
    
    return {
      total: todayEntries.reduce((sum, entry) => sum + entry.amount, 0),
      entries: todayEntries,
      lessons: todayEntries.filter(e => e.source === 'lesson').length,
      activities: todayEntries.filter(e => e.source === 'activity').length
    };
  },
  
  /**
   * Reset XP (for testing)
   */
  resetXP() {
    localStorage.removeItem(this.STORAGE_KEY);
    return { message: 'XP reset successfully' };
  },
  
  /**
   * Simulate XP for testing
   */
  simulateXP(totalXP) {
    const levelInfo = this.calculateLevel(totalXP);
    const data = {
      totalXP: totalXP,
      currentLevel: levelInfo.level,
      xpInCurrentLevel: levelInfo.xpInCurrentLevel,
      xpHistory: [],
      lessonsCompleted: [],
      activitiesCompleted: [],
      dailyBonusClaimed: false,
      lastDailyBonusDate: null
    };
    
    // Simulate some history
    let remainingXP = totalXP;
    let day = 0;
    while (remainingXP > 0 && day < 30) {
      const xpForDay = Math.min(remainingXP, Math.floor(Math.random() * 150) + 50);
      const date = new Date();
      date.setDate(date.getDate() - day);
      
      data.xpHistory.push({
        date: date.toISOString().split('T')[0],
        amount: xpForDay,
        source: 'lesson',
        details: { lessonId: `lesson-${day}` },
        newTotal: totalXP - remainingXP + xpForDay,
        level: this.calculateLevel(totalXP - remainingXP + xpForDay).level
      });
      
      remainingXP -= xpForDay;
      day++;
    }
    
    this.saveXPData(data);
    return { message: `Simulated ${totalXP} XP (Level ${levelInfo.level})` };
  }
};

// Export for use in other scripts
window.XPManager = XPManager;

/**
 * XP UI Component
 */
const XPUI = {
  /**
   * Initialize XP display
   */
  init() {
    this.renderXPBar();
    this.updateXPDisplay();
  },
  
  /**
   * Render XP bar in sidebar
   */
  renderXPBar() {
    const sidebar = document.querySelector('.lesson-sidebar');
    if (!sidebar) return;
    
    // Check if already exists
    if (sidebar.querySelector('.xp-widget')) return;
    
    // Find streak widget to insert after
    const streakWidget = sidebar.querySelector('.streak-widget');
    
    const widget = document.createElement('div');
    widget.className = 'xp-widget';
    widget.innerHTML = `
      <div class="xp-header">
        <i data-lucide="star"></i>
        <span>Level Progress</span>
      </div>
      <div class="xp-level-info">
        <div class="xp-level-number">1</div>
        <div class="xp-rank">Novice Explorer</div>
      </div>
      <div class="xp-bar-container">
        <div class="xp-bar">
          <div class="xp-fill" style="width: 0%"></div>
        </div>
        <div class="xp-text">
          <span class="xp-current">0</span> / <span class="xp-needed">200</span> XP
        </div>
      </div>
      <div class="xp-next-rank"></div>
    `;
    
    if (streakWidget) {
      streakWidget.after(widget);
    } else {
      const progressSection = sidebar.querySelector('.sidebar-progress');
      if (progressSection) {
        progressSection.after(widget);
      }
    }
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  /**
   * Update XP display
   */
  updateXPDisplay() {
    const stats = XPManager.getXPStats();
    const widget = document.querySelector('.xp-widget');
    if (!widget) return;
    
    // Update level number
    const levelEl = widget.querySelector('.xp-level-number');
    if (levelEl) {
      levelEl.textContent = stats.currentLevel;
    }
    
    // Update rank
    const rankEl = widget.querySelector('.xp-rank');
    if (rankEl) {
      rankEl.textContent = stats.rank;
    }
    
    // Update XP bar
    const fillEl = widget.querySelector('.xp-fill');
    if (fillEl) {
      fillEl.style.width = `${stats.progressPercent}%`;
    }
    
    // Update XP text
    const currentEl = widget.querySelector('.xp-current');
    const neededEl = widget.querySelector('.xp-needed');
    if (currentEl && neededEl) {
      currentEl.textContent = stats.xpInCurrentLevel;
      neededEl.textContent = stats.xpNeededForNextLevel;
    }
    
    // Update next rank info
    const nextRankEl = widget.querySelector('.xp-next-rank');
    if (nextRankEl && stats.nextRank) {
      nextRankEl.innerHTML = `
        <span class="next-rank-text">Next: ${stats.nextRank} (Lvl ${stats.nextRankLevel})</span>
      `;
    }
  },
  
  /**
   * Show XP gain animation
   */
  showXPGain(amount, bonus = null) {
    // Create floating XP notification
    const notification = document.createElement('div');
    notification.className = 'xp-gain-notification';
    notification.innerHTML = `
      <div class="xp-gain-amount">+${amount} XP</div>
      ${bonus ? `<div class="xp-gain-bonus">${bonus}</div>` : ''}
    `;
    
    document.body.appendChild(notification);
    
    // Animate and remove
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 2000);
    
    // Update display
    this.updateXPDisplay();
  },
  
  /**
   * Show level up celebration
   */
  showLevelUp(newLevel, newRank) {
    const modal = document.createElement('div');
    modal.className = 'level-up-modal';
    modal.innerHTML = `
      <div class="level-up-content">
        <div class="level-up-icon">⭐</div>
        <h2>Level Up!</h2>
        <div class="level-up-level">Level ${newLevel}</div>
        <div class="level-up-rank">${newRank}</div>
        <p>Congratulations! You've reached a new level.</p>
        <button class="btn btn-primary" onclick="this.closest('.level-up-modal').remove()">
          Continue Learning
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 6000);
  }
};

// Export UI
window.XPUI = XPUI;

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => XPUI.init());
} else {
  XPUI.init();
}

console.log('✓ XP Manager loaded');
