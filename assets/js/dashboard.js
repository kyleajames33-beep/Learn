/**
 * Science Learning Hub - Dashboard Manager
 * Phase 02: Gamification Layer
 * 
 * Comprehensive learning analytics and visualizations
 */

const DashboardManager = {
  init() {
    this.renderQuickStats();
    this.renderXPCard();
    this.renderStreakCard();
    this.renderAchievementsCard();
    this.renderTimeCard();
    this.renderModuleProgress();
    this.renderActivityChart();
    this.renderRecentAchievements();
    this.renderSkillsAnalysis();
    this.renderMinigameStats();
    this.renderRecommendations();
    this.renderGoals();
  },

  /**
   * Get comprehensive learning stats
   */
  getLearningStats() {
    const xpData = XPManager.getXPData();
    const streakInfo = StreakManager.getStreakInfo();
    const achievementStats = AchievementManager.getStats();
    const gameStats = MiniGameManager.getGameStats();
    
    // Calculate study time estimate (5 mins per lesson)
    const completedLessons = this.getCompletedLessons();
    const estimatedMinutes = completedLessons.length * 5;
    
    return {
      xp: xpData,
      streak: streakInfo,
      achievements: achievementStats,
      games: gameStats,
      studyTime: {
        totalMinutes: estimatedMinutes,
        hours: Math.floor(estimatedMinutes / 60),
        minutes: estimatedMinutes % 60
      },
      lessons: {
        completed: completedLessons.length,
        total: 30 // Estimated total for HSC Biology
      }
    };
  },

  /**
   * Get list of completed lessons
   */
  getCompletedLessons() {
    const achievementData = AchievementManager.getAchievementData();
    return achievementData.lessonsCompleted || [];
  },

  /**
   * Render quick stats in header
   */
  renderQuickStats() {
    const stats = this.getLearningStats();
    const container = document.getElementById('quick-stats');
    if (!container) return;
    
    container.innerHTML = `
      <div class="quick-stat">
        <span class="quick-stat-value">${stats.lessons.completed}</span>
        <span class="quick-stat-label">Lessons</span>
      </div>
      <div class="quick-stat">
        <span class="quick-stat-value">${stats.streak.currentStreak}</span>
        <span class="quick-stat-label">Day Streak</span>
      </div>
      <div class="quick-stat">
        <span class="quick-stat-value">${stats.xp.totalXP || 0}</span>
        <span class="quick-stat-label">XP Total</span>
      </div>
      <div class="quick-stat">
        <span class="quick-stat-value">${stats.achievements.unlocked}</span>
        <span class="quick-stat-label">Badges</span>
      </div>
    `;
  },

  /**
   * Render XP/Level card
   */
  renderXPCard() {
    const stats = this.getLearningStats();
    const container = document.getElementById('xp-display');
    if (!container) return;
    
    const xpData = stats.xp;
    const level = XPManager.calculateLevel(xpData.totalXP);
    const rank = XPManager.getRankForLevel(level);
    const nextLevelXP = level * 200;
    const currentLevelXP = (level - 1) * 200;
    const xpInLevel = xpData.totalXP - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    const progress = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
    
    container.innerHTML = `
      <div class="xp-level-badge">
        <span class="xp-level-number">${level}</span>
        <span class="xp-level-label">Level</span>
      </div>
      <div class="xp-progress-bar">
        <div class="xp-progress-fill" style="width: ${progress}%"></div>
      </div>
      <div class="xp-text">
        <strong>${xpInLevel}</strong> / ${xpNeeded} XP to next level
      </div>
      <div class="rank-display">
        Current Rank: <span class="rank-name">${rank}</span>
      </div>
    `;
  },

  /**
   * Render streak card
   */
  renderStreakCard() {
    const stats = this.getLearningStats();
    const container = document.getElementById('streak-display');
    if (!container) return;
    
    const streak = stats.streak;
    const nextMilestone = [7, 30, 60, 100, 180, 365].find(m => m > streak.currentStreak) || 365;
    const progress = Math.round((streak.currentStreak / nextMilestone) * 100);
    
    container.innerHTML = `
      <div class="streak-flame">🔥</div>
      <div class="streak-number">${streak.currentStreak}</div>
      <div class="streak-label">${streak.currentStreak === 1 ? 'Day' : 'Days'}</div>
      <div class="streak-stats">
        <div class="streak-stat">
          <span class="streak-stat-value">${streak.longestStreak}</span>
          <span class="streak-stat-label">Best</span>
        </div>
        <div class="streak-stat">
          <span class="streak-stat-value">${nextMilestone}</span>
          <span class="streak-stat-label">Next Goal</span>
        </div>
      </div>
    `;
  },

  /**
   * Render achievements card
   */
  renderAchievementsCard() {
    const stats = this.getLearningStats();
    const container = document.getElementById('achievements-display');
    if (!container) return;
    
    const achievementStats = stats.achievements;
    const recentAchievements = AchievementManager.getAllAchievements()
      .filter(a => a.unlocked)
      .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
      .slice(0, 3);
    
    container.innerHTML = `
      <div class="achievements-count">${achievementStats.unlocked}</div>
      <div class="achievements-total">of ${achievementStats.total} badges earned</div>
      <div class="achievements-progress">
        <div class="achievements-progress-fill" style="width: ${achievementStats.progress}%"></div>
      </div>
      ${recentAchievements.length > 0 ? `
        <div class="recent-badges">
          ${recentAchievements.map(a => `
            <div class="recent-badge" title="${a.name}">
              <i data-lucide="${a.icon}"></i>
            </div>
          `).join('')}
        </div>
      ` : '<p style="color: #9ca3af; margin-top: 16px;">Start learning to earn badges!</p>'}
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  /**
   * Render study time card
   */
  renderTimeCard() {
    const stats = this.getLearningStats();
    const container = document.getElementById('time-display');
    if (!container) return;
    
    const time = stats.studyTime;
    const gamesPlayed = stats.games.gamesPlayed || 0;
    
    container.innerHTML = `
      <div class="time-main">${time.hours}</div>
      <div class="time-unit">hours ${time.minutes} mins</div>
      <div class="time-breakdown">
        <div class="time-breakdown-item">
          <span class="time-breakdown-value">${stats.lessons.completed}</span>
          <span class="time-breakdown-label">Lessons</span>
        </div>
        <div class="time-breakdown-item">
          <span class="time-breakdown-value">${gamesPlayed}</span>
          <span class="time-breakdown-label">Games</span>
        </div>
        <div class="time-breakdown-item">
          <span class="time-breakdown-value">${stats.streak.totalCheckIns || 0}</span>
          <span class="time-breakdown-label">Sessions</span>
        </div>
      </div>
    `;
  },

  /**
   * Render module progress section
   */
  renderModuleProgress() {
    const container = document.getElementById('module-progress');
    if (!container) return;
    
    // Module data for HSC Biology
    const modules = [
      { id: 'module-1', name: 'Cells as the Basis of Life', lessons: 15, completed: 0 },
      { id: 'module-2', name: 'Cell Organisation', lessons: 12, completed: 0 },
      { id: 'module-3', name: 'Biological Diversity', lessons: 14, completed: 0 },
      { id: 'module-4', name: 'Ecosystem Dynamics', lessons: 12, completed: 0 },
      { id: 'module-5', name: 'Heredity', lessons: 13, completed: 0 },
      { id: 'module-6', name: 'Genetic Change', lessons: 14, completed: 0 },
      { id: 'module-7', name: 'Infectious Disease', lessons: 15, completed: 0 },
      { id: 'module-8', name: 'Non-infectious Disease', lessons: 13, completed: 0 }
    ];
    
    // Get actual progress from storage
    const progress = StorageManager.getProgress('hsc-biology') || {};
    
    modules.forEach(module => {
      const moduleProgress = progress[module.id] || {};
      module.completed = Object.values(moduleProgress).filter(Boolean).length;
    });
    
    container.innerHTML = modules.map(module => {
      const progress = Math.round((module.completed / module.lessons) * 100);
      let statusClass = 'not-started';
      let statusText = 'Not Started';
      
      if (module.completed === module.lessons) {
        statusClass = 'completed';
        statusText = 'Completed';
      } else if (module.completed > 0) {
        statusClass = 'in-progress';
        statusText = 'In Progress';
      }
      
      return `
        <div class="module-progress-item">
          <div class="module-progress-header">
            <span class="module-name">
              <i data-lucide="book-open" style="width: 16px; height: 16px;"></i>
              ${module.name}
            </span>
            <span class="module-status ${statusClass}">${statusText}</span>
          </div>
          <div class="module-progress-bar">
            <div class="module-progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="module-progress-meta">
            <span>${module.completed} of ${module.lessons} lessons</span>
            <span>${progress}%</span>
          </div>
        </div>
      `;
    }).join('');
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  /**
   * Render activity chart (last 7 days)
   */
  renderActivityChart() {
    const container = document.getElementById('activity-chart');
    if (!container) return;
    
    // Generate last 7 days
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date,
        dayName: dayNames[date.getDay()],
        lessons: Math.floor(Math.random() * 3), // Placeholder - would use actual data
        quizzes: Math.floor(Math.random() * 2)
      });
    }
    
    const maxValue = Math.max(...days.map(d => d.lessons + d.quizzes), 1);
    
    container.innerHTML = days.map(day => {
      const lessonHeight = (day.lessons / maxValue) * 100;
      const quizHeight = (day.quizzes / maxValue) * 100;
      
      return `
        <div class="activity-bar-wrapper">
          <div class="activity-bar lessons" style="height: ${Math.max(lessonHeight, 5)}%" title="${day.lessons} lessons"></div>
          <div class="activity-bar quizzes" style="height: ${Math.max(quizHeight, 5)}%" title="${day.quizzes} quizzes"></div>
          <span class="activity-bar-label">${day.dayName}</span>
        </div>
      `;
    }).join('');
  },

  /**
   * Render recent achievements
   */
  renderRecentAchievements() {
    const container = document.getElementById('recent-achievements');
    if (!container) return;
    
    const recentAchievements = AchievementManager.getAllAchievements()
      .filter(a => a.unlocked)
      .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
      .slice(0, 5);
    
    if (recentAchievements.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 32px; color: #9ca3af;">
          <i data-lucide="trophy" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5;"></i>
          <p>No achievements yet. Start learning to earn your first badge!</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      return;
    }
    
    container.innerHTML = recentAchievements.map(a => {
      const date = new Date(a.unlockedAt);
      const timeAgo = this.getTimeAgo(date);
      
      return `
        <div class="recent-achievement-item">
          <div class="recent-achievement-icon">
            <i data-lucide="${a.icon}"></i>
          </div>
          <div class="recent-achievement-info">
            <div class="recent-achievement-name">${a.name}</div>
            <div class="recent-achievement-date">${timeAgo}</div>
          </div>
          <div class="recent-achievement-xp">+${a.xpReward} XP</div>
        </div>
      `;
    }).join('');
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  /**
   * Render skills analysis
   */
  renderSkillsAnalysis() {
    const container = document.getElementById('skills-radar');
    if (!container) return;
    
    // Calculate skill levels based on achievements and activity
    const stats = this.getLearningStats();
    const achievements = AchievementManager.getAllAchievements();
    
    const skills = [
      { name: 'Consistency', value: Math.min(100, stats.streak.currentStreak * 10) },
      { name: 'Completion', value: Math.round((stats.lessons.completed / stats.lessons.total) * 100) },
      { name: 'Performance', value: Math.min(100, achievements.filter(a => a.unlocked && a.category === 'performance').length * 25) },
      { name: 'Exploration', value: Math.min(100, achievements.filter(a => a.unlocked && a.category === 'explorer').length * 25) },
      { name: 'Practice', value: Math.min(100, stats.games.gamesPlayed * 10) },
      { name: 'Mastery', value: Math.min(100, stats.achievements.unlocked * 5) }
    ];
    
    container.innerHTML = skills.map(skill => `
      <div class="skill-bar-item">
        <span class="skill-bar-label">${skill.name}</span>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" style="width: ${skill.value}%; background: ${this.getSkillColor(skill.value)}"></div>
        </div>
        <span class="skill-bar-value">${skill.value}%</span>
      </div>
    `).join('');
  },

  getSkillColor(value) {
    if (value >= 80) return '#22c55e';
    if (value >= 60) return '#14b8a6';
    if (value >= 40) return '#f59e0b';
    return '#ef4444';
  },

  /**
   * Render mini-game stats
   */
  renderMinigameStats() {
    const container = document.getElementById('minigame-stats');
    if (!container) return;
    
    const gameStats = MiniGameManager.getGameStats();
    
    const games = [
      { type: 'dragdrop', name: 'Drag & Drop', icon: 'move' },
      { type: 'flashcards', name: 'Flashcards', icon: 'layers' },
      { type: 'matching', name: 'Matching', icon: 'copy' },
      { type: 'sequence', name: 'Sequence', icon: 'arrow-up-down' }
    ];
    
    container.innerHTML = games.map(game => {
      const stats = MiniGameManager.getGameTypeStats(game.type);
      
      return `
        <div class="minigame-stat-card">
          <div class="minigame-stat-icon">
            <i data-lucide="${game.icon}"></i>
          </div>
          <div class="minigame-stat-value">${stats.played}</div>
          <div class="minigame-stat-label">${game.name}</div>
        </div>
      `;
    }).join('');
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  /**
   * Render recommendations
   */
  renderRecommendations() {
    const container = document.getElementById('recommendations');
    if (!container) return;
    
    // Generate recommendations based on progress
    const recommendations = [];
    const stats = this.getLearningStats();
    
    if (stats.streak.currentStreak === 0) {
      recommendations.push({
        icon: 'flame',
        title: 'Start a Learning Streak',
        reason: 'Build consistency with daily practice',
        link: './lesson.html?lesson=module-1-cells-lesson-1'
      });
    }
    
    if (stats.lessons.completed < 5) {
      recommendations.push({
        icon: 'book-open',
        title: 'Complete Module 1: Cells',
        reason: 'Foundation for all HSC Biology',
        link: './lesson.html?lesson=module-1-cells-lesson-1'
      });
    }
    
    if (stats.achievements.unlocked < 3) {
      recommendations.push({
        icon: 'trophy',
        title: 'Earn Your First Badge',
        reason: 'Complete a lesson to unlock achievements',
        link: './achievements.html'
      });
    }
    
    recommendations.push({
      icon: 'zap',
      title: 'Practice with Mini-Games',
      reason: 'Reinforce learning through play',
      link: './lesson.html?lesson=module-1-cells-lesson-4'
    });
    
    container.innerHTML = recommendations.slice(0, 3).map(rec => `
      <a href="${rec.link}" class="recommendation-item">
        <div class="recommendation-icon">
          <i data-lucide="${rec.icon}"></i>
        </div>
        <div class="recommendation-info">
          <div class="recommendation-title">${rec.title}</div>
          <div class="recommendation-reason">${rec.reason}</div>
        </div>
        <div class="recommendation-arrow">
          <i data-lucide="chevron-right"></i>
        </div>
      </a>
    `).join('');
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  /**
   * Render goals and milestones
   */
  renderGoals() {
    const container = document.getElementById('goals-grid');
    if (!container) return;
    
    const stats = this.getLearningStats();
    
    const goals = [
      { 
        id: 'lessons-5',
        title: 'Complete 5 Lessons', 
        current: stats.lessons.completed, 
        target: 5,
        icon: 'book-open'
      },
      { 
        id: 'streak-7',
        title: '7-Day Learning Streak', 
        current: stats.streak.currentStreak, 
        target: 7,
        icon: 'flame'
      },
      { 
        id: 'achievements-10',
        title: 'Earn 10 Badges', 
        current: stats.achievements.unlocked, 
        target: 10,
        icon: 'trophy'
      },
      { 
        id: 'games-10',
        title: 'Play 10 Mini-Games', 
        current: stats.games.gamesPlayed, 
        target: 10,
        icon: 'gamepad-2'
      }
    ];
    
    container.innerHTML = goals.map(goal => {
      const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
      const completed = goal.current >= goal.target;
      
      return `
        <div class="goal-card ${completed ? 'completed' : ''}">
          <div class="goal-header">
            <span class="goal-title">
              <i data-lucide="${goal.icon}" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 6px;"></i>
              ${goal.title}
            </span>
            <span class="goal-status ${completed ? 'completed' : 'pending'}">
              <i data-lucide="${completed ? 'check' : 'circle'}"></i>
            </span>
          </div>
          <div class="goal-progress">
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="goal-progress-text">${goal.current} / ${goal.target}</div>
          </div>
        </div>
      `;
    }).join('');
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  /**
   * Get human-readable time ago
   */
  getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return 'Just now';
  }
};

window.DashboardManager = DashboardManager;

console.log('✓ Dashboard Manager loaded');
