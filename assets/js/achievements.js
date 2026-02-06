/**
 * Science Learning Hub - Achievement System
 * Phase 02: Gamification Layer
 * 
 * Badge Categories:
 * - Progress Badges: Complete lessons, modules
 * - Performance Badges: Perfect scores, speed completions
 * - Streak Badges: Maintain learning streaks
 * - Explorer Badges: Try different features, visit all sections
 * - Special Badges: Easter eggs, hidden achievements
 */

const AchievementManager = {
  STORAGE_KEY: 'sh_achievements',
  
  // Achievement definitions
  ACHIEVEMENTS: {
    // Progress Badges
    'first_lesson': {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: 'shoe',
      category: 'progress',
      xpReward: 50,
      rarity: 'common'
    },
    'lesson_starter': {
      id: 'lesson_starter',
      name: 'Lesson Starter',
      description: 'Complete 5 lessons',
      icon: 'book-open',
      category: 'progress',
      xpReward: 100,
      rarity: 'common',
      requirement: 5
    },
    'lesson_warrior': {
      id: 'lesson_warrior',
      name: 'Lesson Warrior',
      description: 'Complete 15 lessons',
      icon: 'sword',
      category: 'progress',
      xpReward: 250,
      rarity: 'uncommon',
      requirement: 15
    },
    'lesson_master': {
      id: 'lesson_master',
      name: 'Lesson Master',
      description: 'Complete 30 lessons',
      icon: 'crown',
      category: 'progress',
      xpReward: 500,
      rarity: 'rare',
      requirement: 30
    },
    'module_explorer': {
      id: 'module_explorer',
      name: 'Module Explorer',
      description: 'Complete all lessons in a module',
      icon: 'compass',
      category: 'progress',
      xpReward: 300,
      rarity: 'uncommon'
    },
    
    // Performance Badges
    'perfect_score': {
      id: 'perfect_score',
      name: 'Perfectionist',
      description: 'Get 100% on a quiz',
      icon: 'star',
      category: 'performance',
      xpReward: 100,
      rarity: 'uncommon'
    },
    'speed_reader': {
      id: 'speed_reader',
      name: 'Speed Reader',
      description: 'Complete a lesson in under 10 minutes',
      icon: 'zap',
      category: 'performance',
      xpReward: 75,
      rarity: 'uncommon'
    },
    'quiz_champion': {
      id: 'quiz_champion',
      name: 'Quiz Champion',
      description: 'Get 5 perfect quiz scores in a row',
      icon: 'trophy',
      category: 'performance',
      xpReward: 300,
      rarity: 'rare',
      requirement: 5
    },
    'attention_to_detail': {
      id: 'attention_to_detail',
      name: 'Detail Oriented',
      description: 'Complete all activities in a lesson',
      icon: 'search',
      category: 'performance',
      xpReward: 100,
      rarity: 'common'
    },
    
    // Streak Badges
    'streak_starter': {
      id: 'streak_starter',
      name: 'Getting Warm',
      description: 'Maintain a 3-day streak',
      icon: 'flame',
      category: 'streak',
      xpReward: 100,
      rarity: 'common',
      requirement: 3
    },
    'streak_seeker': {
      id: 'streak_seeker',
      name: 'On Fire',
      description: 'Maintain a 7-day streak',
      icon: 'flame',
      category: 'streak',
      xpReward: 200,
      rarity: 'uncommon',
      requirement: 7
    },
    'streak_champion': {
      id: 'streak_champion',
      name: 'Unstoppable',
      description: 'Maintain a 30-day streak',
      icon: 'flame',
      category: 'streak',
      xpReward: 500,
      rarity: 'rare',
      requirement: 30
    },
    'streak_legend': {
      id: 'streak_legend',
      name: 'Legendary',
      description: 'Maintain a 100-day streak',
      icon: 'flame',
      category: 'streak',
      xpReward: 1000,
      rarity: 'epic',
      requirement: 100
    },
    
    // Explorer Badges
    'night_owl': {
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Complete a lesson between 10 PM and 6 AM',
      icon: 'moon',
      category: 'explorer',
      xpReward: 75,
      rarity: 'uncommon'
    },
    'early_bird': {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Complete a lesson before 8 AM',
      icon: 'sun',
      category: 'explorer',
      xpReward: 75,
      rarity: 'uncommon'
    },
    'weekend_warrior': {
      id: 'weekend_warrior',
      name: 'Weekend Warrior',
      description: 'Complete lessons on both Saturday and Sunday',
      icon: 'calendar',
      category: 'explorer',
      xpReward: 150,
      rarity: 'uncommon'
    },
    'completionist': {
      id: 'completionist',
      name: 'Completionist',
      description: 'Read every section including "Copy Into Books"',
      icon: 'check-circle',
      category: 'explorer',
      xpReward: 100,
      rarity: 'common'
    },
    
    // Special Badges
    'comeback_kid': {
      id: 'comeback_kid',
      name: 'Comeback Kid',
      description: 'Return after losing a streak and start a new one',
      icon: 'refresh-cw',
      category: 'special',
      xpReward: 150,
      rarity: 'uncommon'
    },
    'first_visit': {
      id: 'first_visit',
      name: 'Welcome Aboard',
      description: 'Visit the Science Hub for the first time',
      icon: 'hand',
      category: 'special',
      xpReward: 25,
      rarity: 'common',
      hidden: false
    },
    'dedicated_student': {
      id: 'dedicated_student',
      name: 'Dedicated Student',
      description: 'Study for 7 days in a single week',
      icon: 'award',
      category: 'special',
      xpReward: 200,
      rarity: 'uncommon'
    },
    'knowledge_seeker': {
      id: 'knowledge_seeker',
      name: 'Knowledge Seeker',
      description: 'Open 3 different Deep Dive sections in one lesson',
      icon: 'book-marked',
      category: 'special',
      xpReward: 100,
      rarity: 'uncommon'
    }
  },
  
  /**
   * Get achievement data from storage
   */
  getAchievementData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      unlocked: [],
      progress: {},
      firstVisit: null,
      lessonsCompleted: [],
      perfectQuizzes: 0,
      consecutivePerfectQuizzes: 0,
      activitiesCompleted: [],
      deepDivesOpened: [],
      weekendDays: [],
      allSectionsRead: []
    };
  },
  
  /**
   * Save achievement data
   */
  saveAchievementData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },
  
  /**
   * Check and award achievements
   */
  checkAchievements(trigger, data = {}) {
    const achievementsToCheck = this.getAchievementsByTrigger(trigger);
    const newlyUnlocked = [];
    
    for (const achievement of achievementsToCheck) {
      if (this.isUnlocked(achievement.id)) continue;
      
      if (this.checkRequirement(achievement, data)) {
        this.unlockAchievement(achievement);
        newlyUnlocked.push(achievement);
      }
    }
    
    return newlyUnlocked;
  },
  
  /**
   * Get achievements by trigger type
   */
  getAchievementsByTrigger(trigger) {
    return Object.values(this.ACHIEVEMENTS).filter(a => {
      switch (trigger) {
        case 'lesson_complete':
          return ['first_lesson', 'lesson_starter', 'lesson_warrior', 'lesson_master', 'module_explorer', 'completionist'].includes(a.id);
        case 'quiz_complete':
          return ['perfect_score', 'quiz_champion'].includes(a.id);
        case 'activity_complete':
          return ['attention_to_detail'].includes(a.id);
        case 'streak_update':
          return ['streak_starter', 'streak_seeker', 'streak_champion', 'streak_legend'].includes(a.id);
        case 'time_check':
          return ['night_owl', 'early_bird', 'weekend_warrior'].includes(a.id);
        case 'deep_dive':
          return ['knowledge_seeker'].includes(a.id);
        case 'all_sections':
          return ['completionist'].includes(a.id);
        case 'streak_lost':
          return ['comeback_kid'].includes(a.id);
        case 'first_visit':
          return ['first_visit'].includes(a.id);
        default:
          return false;
      }
    });
  },
  
  /**
   * Check if achievement requirement is met
   */
  checkRequirement(achievement, data) {
    const achievementData = this.getAchievementData();
    
    switch (achievement.id) {
      case 'first_lesson':
        return achievementData.lessonsCompleted.length >= 1;
      
      case 'lesson_starter':
        return achievementData.lessonsCompleted.length >= 5;
      
      case 'lesson_warrior':
        return achievementData.lessonsCompleted.length >= 15;
      
      case 'lesson_master':
        return achievementData.lessonsCompleted.length >= 30;
      
      case 'perfect_score':
        return data.perfectScore === true;
      
      case 'quiz_champion':
        return achievementData.consecutivePerfectQuizzes >= 5;
      
      case 'streak_starter':
        return data.streakDays >= 3;
      
      case 'streak_seeker':
        return data.streakDays >= 7;
      
      case 'streak_champion':
        return data.streakDays >= 30;
      
      case 'streak_legend':
        return data.streakDays >= 100;
      
      case 'night_owl':
        const hour = new Date().getHours();
        return hour >= 22 || hour < 6;
      
      case 'early_bird':
        return new Date().getHours() < 8;
      
      case 'weekend_warrior':
        const day = new Date().getDay();
        if (day === 6) achievementData.weekendDays.push('saturday');
        if (day === 0) achievementData.weekendDays.push('sunday');
        this.saveAchievementData(achievementData);
        return achievementData.weekendDays.includes('saturday') && 
               achievementData.weekendDays.includes('sunday');
      
      case 'first_visit':
        return achievementData.firstVisit !== null;
      
      case 'comeback_kid':
        return data.hadPreviousStreak === true && data.newStreak === 1;
      
      case 'knowledge_seeker':
        if (data.deepDiveOpened) {
          const lessonDeepDives = achievementData.deepDivesOpened.filter(
            d => d.lessonId === data.lessonId
          );
          return lessonDeepDives.length >= 3;
        }
        return false;
      
      default:
        return false;
    }
  },
  
  /**
   * Unlock an achievement
   */
  unlockAchievement(achievement) {
    const data = this.getAchievementData();
    
    if (!data.unlocked.includes(achievement.id)) {
      data.unlocked.push({
        id: achievement.id,
        unlockedAt: new Date().toISOString()
      });
      this.saveAchievementData(data);
      
      // Award XP bonus
      if (achievement.xpReward && window.XPManager) {
        XPManager.awardXP(achievement.xpReward, 'achievement', {
          achievementId: achievement.id,
          achievementName: achievement.name
        });
      }
      
      return true;
    }
    return false;
  },
  
  /**
   * Check if achievement is unlocked
   */
  isUnlocked(achievementId) {
    const data = this.getAchievementData();
    return data.unlocked.some(a => a.id === achievementId);
  },
  
  /**
   * Record lesson completion
   */
  recordLessonComplete(lessonId, moduleId) {
    const data = this.getAchievementData();
    if (!data.lessonsCompleted.includes(lessonId)) {
      data.lessonsCompleted.push(lessonId);
      this.saveAchievementData(data);
    }
    
    // Check achievements
    return this.checkAchievements('lesson_complete', { lessonId, moduleId });
  },
  
  /**
   * Record quiz completion
   */
  recordQuizComplete(score, perfect) {
    const data = this.getAchievementData();
    
    if (perfect) {
      data.perfectQuizzes++;
      data.consecutivePerfectQuizzes++;
    } else {
      data.consecutivePerfectQuizzes = 0;
    }
    
    this.saveAchievementData(data);
    
    return this.checkAchievements('quiz_complete', { 
      perfectScore: perfect,
      score: score 
    });
  },
  
  /**
   * Record first visit
   */
  recordFirstVisit() {
    const data = this.getAchievementData();
    if (!data.firstVisit) {
      data.firstVisit = new Date().toISOString();
      this.saveAchievementData(data);
      return this.checkAchievements('first_visit');
    }
    return [];
  },
  
  /**
   * Get all achievements with unlock status
   */
  getAllAchievements() {
    return Object.values(this.ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      unlocked: this.isUnlocked(achievement.id),
      unlockedAt: this.getUnlockDate(achievement.id)
    }));
  },
  
  /**
   * Get unlock date for achievement
   */
  getUnlockDate(achievementId) {
    const data = this.getAchievementData();
    const unlocked = data.unlocked.find(a => a.id === achievementId);
    return unlocked ? unlocked.unlockedAt : null;
  },
  
  /**
   * Get achievements by category
   */
  getAchievementsByCategory(category) {
    return this.getAllAchievements().filter(a => a.category === category);
  },
  
  /**
   * Get achievement stats
   */
  getStats() {
    const all = this.getAllAchievements();
    const unlocked = all.filter(a => a.unlocked);
    
    return {
      total: all.length,
      unlocked: unlocked.length,
      progress: Math.round((unlocked.length / all.length) * 100),
      totalXPEarned: unlocked.reduce((sum, a) => sum + (a.xpReward || 0), 0),
      byCategory: {
        progress: this.getAchievementsByCategory('progress').filter(a => a.unlocked).length,
        performance: this.getAchievementsByCategory('performance').filter(a => a.unlocked).length,
        streak: this.getAchievementsByCategory('streak').filter(a => a.unlocked).length,
        explorer: this.getAchievementsByCategory('explorer').filter(a => a.unlocked).length,
        special: this.getAchievementsByCategory('special').filter(a => a.unlocked).length
      }
    };
  },
  
  /**
   * Reset achievements (for testing)
   */
  resetAchievements() {
    localStorage.removeItem(this.STORAGE_KEY);
    return { message: 'Achievements reset' };
  }
};

// Export
window.AchievementManager = AchievementManager;

/**
 * Achievement UI
 */
const AchievementUI = {
  init() {
    // Check for first visit achievement
    setTimeout(() => {
      const newAchievements = AchievementManager.recordFirstVisit();
      if (newAchievements.length > 0) {
        newAchievements.forEach(a => this.showUnlockNotification(a));
      }
    }, 1000);
    
    // Check time-based achievements periodically
    setInterval(() => {
      this.checkTimeBasedAchievements();
    }, 60000); // Check every minute
    
    // Render mini widget in sidebar
    this.renderMiniWidget();
  },
  
  /**
   * Render mini achievement widget in sidebar
   */
  renderMiniWidget() {
    const sidebar = document.querySelector('.lesson-sidebar');
    if (!sidebar) return;
    
    // Check if widget already exists
    if (sidebar.querySelector('.achievement-mini-widget')) return;
    
    const stats = AchievementManager.getStats();
    const recentAchievements = AchievementManager.getAllAchievements()
      .filter(a => a.unlocked)
      .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
      .slice(0, 3);
    
    const widget = document.createElement('div');
    widget.className = 'achievement-mini-widget';
    widget.innerHTML = `
      <a href="./achievements.html" class="achievement-mini-header" style="text-decoration: none; color: inherit;">
        <div class="achievement-mini-title">
          <i data-lucide="trophy"></i>
          <span>Achievements</span>
        </div>
        <span class="achievement-mini-count">${stats.unlocked}/${stats.total}</span>
      </a>
      <div class="achievement-mini-progress">
        <div class="achievement-mini-bar">
          <div class="achievement-mini-fill" style="width: ${stats.progress}%"></div>
        </div>
        <span class="achievement-mini-percent">${stats.progress}%</span>
      </div>
      ${recentAchievements.length > 0 ? `
        <div class="achievement-recent">
          ${recentAchievements.map(a => `
            <div class="achievement-recent-item" title="${a.name}">
              <i data-lucide="${a.icon}"></i>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
    
    // Insert after streak widget or progress section
    const streakWidget = sidebar.querySelector('.streak-widget');
    if (streakWidget) {
      streakWidget.after(widget);
    } else {
      const progressSection = sidebar.querySelector('.sidebar-progress');
      if (progressSection) {
        progressSection.after(widget);
      } else {
        sidebar.appendChild(widget);
      }
    }
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  checkTimeBasedAchievements() {
    const newAchievements = AchievementManager.checkAchievements('time_check');
    if (newAchievements.length > 0) {
      newAchievements.forEach(a => this.showUnlockNotification(a));
    }
  },
  
  showUnlockNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-unlock-icon">
        <i data-lucide="${achievement.icon}"></i>
      </div>
      <div class="achievement-unlock-content">
        <div class="achievement-unlock-title">Achievement Unlocked!</div>
        <div class="achievement-unlock-name">${achievement.name}</div>
        <div class="achievement-unlock-desc">${achievement.description}</div>
        <div class="achievement-unlock-xp">+${achievement.xpReward} XP</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 500);
    }, 5000);
  },
  
  renderAchievementShowcase() {
    const achievements = AchievementManager.getAllAchievements();
    const stats = AchievementManager.getStats();
    
    const container = document.createElement('div');
    container.className = 'achievement-showcase';
    
    // Header with stats
    container.innerHTML = `
      <div class="achievement-header">
        <h2>Achievements</h2>
        <div class="achievement-stats">
          <span class="achievement-progress">${stats.unlocked}/${stats.total}</span>
          <div class="achievement-progress-bar">
            <div class="achievement-progress-fill" style="width: ${stats.progress}%"></div>
          </div>
        </div>
      </div>
      <div class="achievement-categories">
        ${this.renderCategory('progress', 'Progress', achievements)}
        ${this.renderCategory('performance', 'Performance', achievements)}
        ${this.renderCategory('streak', 'Streaks', achievements)}
        ${this.renderCategory('explorer', 'Explorer', achievements)}
        ${this.renderCategory('special', 'Special', achievements)}
      </div>
    `;
    
    return container;
  },
  
  renderCategory(category, title, achievements) {
    const categoryAchievements = achievements.filter(a => a.category === category);
    const unlockedCount = categoryAchievements.filter(a => a.unlocked).length;
    
    return `
      <div class="achievement-category">
        <h3>${title} <span class="achievement-count">${unlockedCount}/${categoryAchievements.length}</span></h3>
        <div class="achievement-grid">
          ${categoryAchievements.map(a => this.renderAchievementCard(a)).join('')}
        </div>
      </div>
    `;
  },
  
  renderAchievementCard(achievement) {
    const rarityColors = {
      common: '#6b7280',
      uncommon: '#22c55e',
      rare: '#3b82f6',
      epic: '#a855f7'
    };
    
    return `
      <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}" 
           style="--rarity-color: ${rarityColors[achievement.rarity]}">
        <div class="achievement-icon">
          <i data-lucide="${achievement.icon}"></i>
        </div>
        <div class="achievement-info">
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-desc">${achievement.description}</div>
          ${achievement.unlocked ? `
            <div class="achievement-date">Unlocked ${new Date(achievement.unlockedAt).toLocaleDateString()}</div>
          ` : '<div class="achievement-locked">Locked</div>'}
        </div>
        <div class="achievement-xp">+${achievement.xpReward} XP</div>
      </div>
    `;
  }
};

window.AchievementUI = AchievementUI;

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AchievementUI.init());
} else {
  AchievementUI.init();
}

console.log('✓ Achievement Manager loaded');
