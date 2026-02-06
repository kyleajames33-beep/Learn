/**
 * Science Learning Hub - Gamification Engine
 * Phase 0.1: Gamification Consolidation
 * 
 * Single source of truth for all gamification logic:
 * - XP System (levels, ranks, awards)
 * - Streak System (daily check-ins, milestones, forgiveness)
 * - Achievement System (22 badges, 5 categories)
 * - Progress System (lesson/module tracking)
 * 
 * Emits events via EventBus for UI updates
 */

const GamificationEngine = (function() {
  'use strict';

  // ============================================
  // CONSTANTS & CONFIGURATION
  // ============================================

  const STORAGE_PREFIX = 'sh_';
  
  const XP_CONFIG = {
    LESSON_COMPLETE: 100,
    ACTIVITY_COMPLETE: 50,
    PERFECT_QUIZ: 25,
    STREAK_BONUS_PER_DAY: 10,
    FIRST_LESSON_DAY: 25,
    DAILY_LOGIN: 10,
    LEVEL_FORMULA: (level) => level * 200
  };

  const STREAK_CONFIG = {
    MILESTONES: [7, 30, 60, 100, 180, 365],
    FORGIVENESS_DAYS: 1
  };

  const RANKS = {
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
  };

  const ACHIEVEMENTS = {
    // Progress Badges
    'first_lesson': {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: 'shoe',
      category: 'progress',
      xpReward: 50,
      rarity: 'common',
      condition: (data) => data.totalLessonsCompleted >= 1
    },
    'lesson_starter': {
      id: 'lesson_starter',
      name: 'Lesson Starter',
      description: 'Complete 5 lessons',
      icon: 'book-open',
      category: 'progress',
      xpReward: 100,
      rarity: 'common',
      requirement: 5,
      condition: (data) => data.totalLessonsCompleted >= 5
    },
    'lesson_warrior': {
      id: 'lesson_warrior',
      name: 'Lesson Warrior',
      description: 'Complete 15 lessons',
      icon: 'sword',
      category: 'progress',
      xpReward: 250,
      rarity: 'uncommon',
      requirement: 15,
      condition: (data) => data.totalLessonsCompleted >= 15
    },
    'lesson_master': {
      id: 'lesson_master',
      name: 'Lesson Master',
      description: 'Complete 30 lessons',
      icon: 'crown',
      category: 'progress',
      xpReward: 500,
      rarity: 'rare',
      requirement: 30,
      condition: (data) => data.totalLessonsCompleted >= 30
    },
    'module_explorer': {
      id: 'module_explorer',
      name: 'Module Explorer',
      description: 'Complete all lessons in a module',
      icon: 'compass',
      category: 'progress',
      xpReward: 300,
      rarity: 'uncommon',
      condition: (data) => data.modulesCompleted > 0
    },
    
    // Performance Badges
    'perfect_score': {
      id: 'perfect_score',
      name: 'Perfectionist',
      description: 'Get 100% on a quiz',
      icon: 'star',
      category: 'performance',
      xpReward: 100,
      rarity: 'uncommon',
      condition: (data) => data.perfectQuizzes >= 1
    },
    'speed_reader': {
      id: 'speed_reader',
      name: 'Speed Reader',
      description: 'Complete a lesson in under 10 minutes',
      icon: 'zap',
      category: 'performance',
      xpReward: 75,
      rarity: 'uncommon',
      condition: (data) => data.speedCompletions >= 1
    },
    'quiz_champion': {
      id: 'quiz_champion',
      name: 'Quiz Champion',
      description: 'Get 5 perfect quiz scores in a row',
      icon: 'trophy',
      category: 'performance',
      xpReward: 300,
      rarity: 'rare',
      requirement: 5,
      condition: (data) => data.consecutivePerfectQuizzes >= 5
    },
    'attention_to_detail': {
      id: 'attention_to_detail',
      name: 'Detail Oriented',
      description: 'Complete all activities in a lesson',
      icon: 'search',
      category: 'performance',
      xpReward: 100,
      rarity: 'common',
      condition: (data) => data.allActivitiesCompleted
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
      requirement: 3,
      condition: (data) => data.currentStreak >= 3
    },
    'streak_seeker': {
      id: 'streak_seeker',
      name: 'On Fire',
      description: 'Maintain a 7-day streak',
      icon: 'flame',
      category: 'streak',
      xpReward: 200,
      rarity: 'uncommon',
      requirement: 7,
      condition: (data) => data.currentStreak >= 7
    },
    'streak_champion': {
      id: 'streak_champion',
      name: 'Unstoppable',
      description: 'Maintain a 30-day streak',
      icon: 'flame',
      category: 'streak',
      xpReward: 500,
      rarity: 'rare',
      requirement: 30,
      condition: (data) => data.currentStreak >= 30
    },
    'streak_legend': {
      id: 'streak_legend',
      name: 'Legendary',
      description: 'Maintain a 100-day streak',
      icon: 'flame',
      category: 'streak',
      xpReward: 1000,
      rarity: 'epic',
      requirement: 100,
      condition: (data) => data.currentStreak >= 100
    },
    
    // Explorer Badges
    'night_owl': {
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Complete a lesson between 10 PM and 6 AM',
      icon: 'moon',
      category: 'explorer',
      xpReward: 75,
      rarity: 'uncommon',
      condition: (data) => {
        const hour = new Date().getHours();
        return hour >= 22 || hour < 6;
      }
    },
    'early_bird': {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Complete a lesson before 8 AM',
      icon: 'sun',
      category: 'explorer',
      xpReward: 75,
      rarity: 'uncommon',
      condition: (data) => new Date().getHours() < 8
    },
    'weekend_warrior': {
      id: 'weekend_warrior',
      name: 'Weekend Warrior',
      description: 'Complete lessons on both Saturday and Sunday',
      icon: 'calendar',
      category: 'explorer',
      xpReward: 150,
      rarity: 'uncommon',
      condition: (data) => {
        const achievementData = getAchievementData();
        return achievementData.weekendDays.includes('saturday') && 
               achievementData.weekendDays.includes('sunday');
      }
    },
    'completionist': {
      id: 'completionist',
      name: 'Completionist',
      description: 'Read every section including "Copy Into Books"',
      icon: 'check-circle',
      category: 'explorer',
      xpReward: 100,
      rarity: 'common',
      condition: (data) => data.allSectionsRead
    },
    
    // Special Badges
    'comeback_kid': {
      id: 'comeback_kid',
      name: 'Comeback Kid',
      description: 'Return after losing a streak and start a new one',
      icon: 'refresh-cw',
      category: 'special',
      xpReward: 150,
      rarity: 'uncommon',
      condition: (data) => data.hadPreviousStreak && data.currentStreak === 1
    },
    'first_visit': {
      id: 'first_visit',
      name: 'Welcome Aboard',
      description: 'Visit the Science Hub for the first time',
      icon: 'hand',
      category: 'special',
      xpReward: 25,
      rarity: 'common',
      condition: (data) => data.hasVisited
    },
    'dedicated_student': {
      id: 'dedicated_student',
      name: 'Dedicated Student',
      description: 'Study for 7 days in a single week',
      icon: 'award',
      category: 'special',
      xpReward: 200,
      rarity: 'uncommon',
      condition: (data) => data.daysStudiedThisWeek >= 7
    },
    'knowledge_seeker': {
      id: 'knowledge_seeker',
      name: 'Knowledge Seeker',
      description: 'Open 3 different Deep Dive sections in one lesson',
      icon: 'book-marked',
      category: 'special',
      xpReward: 100,
      rarity: 'uncommon',
      condition: (data) => data.deepDivesInLesson >= 3
    }
  };

  // ============================================
  // STORAGE HELPERS
  // ============================================

  function getStorageKey(key) {
    return `${STORAGE_PREFIX}${key}`;
  }

  function getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(getStorageKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('[GamificationEngine] Storage read error:', e);
      return defaultValue;
    }
  }

  function setItem(key, value) {
    try {
      localStorage.setItem(getStorageKey(key), JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('[GamificationEngine] Storage write error:', e);
      return false;
    }
  }

  // ============================================
  // DATA MODELS
  // ============================================

  function getXPData() {
    return getItem('xp', {
      totalXP: 0,
      currentLevel: 1,
      xpInCurrentLevel: 0,
      xpHistory: [],
      lastDailyBonusDate: null
    });
  }

  function saveXPData(data) {
    setItem('xp', data);
  }

  function getStreakData() {
    return getItem('streak', {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      streakHistory: [],
      milestonesReached: []
    });
  }

  function saveStreakData(data) {
    setItem('streak', data);
  }

  function getAchievementData() {
    return getItem('achievements', {
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
    });
  }

  function saveAchievementData(data) {
    setItem('achievements', data);
  }

  function getProgressData(yearLevel, module) {
    const key = `progress_${yearLevel}_${module}`;
    return getItem(key, { completed: [], lastVisited: null });
  }

  function saveProgressData(yearLevel, module, data) {
    const key = `progress_${yearLevel}_${module}`;
    setItem(key, data);
  }

  // ============================================
  // XP SYSTEM
  // ============================================

  const XPSystem = {
    getData: getXPData,
    
    calculateLevel(totalXP) {
      let level = 1;
      let xpRemaining = totalXP;
      
      while (xpRemaining >= XP_CONFIG.LEVEL_FORMULA(level)) {
        xpRemaining -= XP_CONFIG.LEVEL_FORMULA(level);
        level++;
      }
      
      return {
        level: level,
        xpInCurrentLevel: xpRemaining,
        xpNeededForNextLevel: XP_CONFIG.LEVEL_FORMULA(level),
        progressPercent: (xpRemaining / XP_CONFIG.LEVEL_FORMULA(level)) * 100
      };
    },

    getRankForLevel(level) {
      const ranks = Object.keys(RANKS).map(Number).filter(l => l <= level).sort((a, b) => b - a);
      return ranks.length > 0 ? RANKS[ranks[0]] : 'Science Student';
    },

    getNextRankLevel(currentLevel) {
      const ranks = Object.keys(RANKS).map(Number).sort((a, b) => a - b);
      for (const level of ranks) {
        if (level > currentLevel) return level;
      }
      return null;
    },

    awardXP(amount, source, details = {}) {
      const data = this.getData();
      const today = new Date().toISOString().split('T')[0];
      
      const oldLevel = data.currentLevel;
      data.totalXP += amount;
      
      // Recalculate level
      const levelInfo = this.calculateLevel(data.totalXP);
      data.currentLevel = levelInfo.level;
      data.xpInCurrentLevel = levelInfo.xpInCurrentLevel;
      
      // Record history
      data.xpHistory.push({
        date: today,
        amount,
        source,
        details,
        newTotal: data.totalXP,
        level: data.currentLevel
      });
      
      // Keep only last 100 entries
      if (data.xpHistory.length > 100) {
        data.xpHistory = data.xpHistory.slice(-100);
      }
      
      saveXPData(data);
      
      const result = {
        awarded: true,
        amount,
        newTotal: data.totalXP,
        newLevel: data.currentLevel,
        leveledUp: data.currentLevel > oldLevel,
        oldLevel,
        levelInfo
      };
      
      // Emit XP event
      if (window.EventBus) {
        EventBus.emit('xp:gained', {
          amount,
          source,
          newTotal: data.totalXP,
          newLevel: data.currentLevel,
          leveledUp: result.leveledUp,
          oldLevel: result.oldLevel,
          details
        });
        
        if (result.leveledUp) {
          EventBus.emit('level:up', {
            newLevel: data.currentLevel,
            rank: this.getRankForLevel(data.currentLevel)
          });
        }
      }
      
      return result;
    },

    getStats() {
      const data = this.getData();
      const levelInfo = this.calculateLevel(data.totalXP);
      const rank = this.getRankForLevel(data.currentLevel);
      const nextRankLevel = this.getNextRankLevel(data.currentLevel);
      
      return {
        totalXP: data.totalXP,
        currentLevel: data.currentLevel,
        rank,
        nextRank: nextRankLevel ? RANKS[nextRankLevel] : null,
        nextRankLevel,
        xpInCurrentLevel: data.xpInCurrentLevel,
        xpNeededForNextLevel: levelInfo.xpNeededForNextLevel,
        progressPercent: levelInfo.progressPercent,
        xpToNextLevel: levelInfo.xpNeededForNextLevel - data.xpInCurrentLevel
      };
    }
  };

  // ============================================
  // STREAK SYSTEM
  // ============================================

  const StreakSystem = {
    getData: getStreakData,

    getTodayString() {
      return new Date().toISOString().split('T')[0];
    },

    getYesterdayString() {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    },

    daysBetween(date1, date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
    },

    checkIn() {
      const today = this.getTodayString();
      const yesterday = this.getYesterdayString();
      const data = this.getData();
      
      // Already checked in today
      if (data.lastActiveDate === today) {
        return {
          streakUpdated: false,
          currentStreak: data.currentStreak,
          milestoneReached: null,
          message: 'Already checked in today!'
        };
      }
      
      // First time user
      if (!data.lastActiveDate) {
        data.currentStreak = 1;
        data.longestStreak = 1;
        data.lastActiveDate = today;
        data.streakHistory.push({ date: today, streak: 1 });
        saveStreakData(data);
        
        this.emitStreakEvent(data.currentStreak);
        
        return {
          streakUpdated: true,
          currentStreak: 1,
          milestoneReached: null,
          message: 'Streak started! Day 1! 🔥'
        };
      }
      
      const daysSince = this.daysBetween(data.lastActiveDate, today);
      
      if (daysSince === 1) {
        // Consecutive day
        data.currentStreak += 1;
        data.lastActiveDate = today;
        data.streakHistory.push({ date: today, streak: data.currentStreak });
        
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak;
        }
        
        const milestone = this.checkMilestone(data.currentStreak, data.milestonesReached);
        if (milestone) {
          data.milestonesReached.push(milestone);
        }
        
        saveStreakData(data);
        this.emitStreakEvent(data.currentStreak, milestone);
        
        return {
          streakUpdated: true,
          currentStreak: data.currentStreak,
          milestoneReached: milestone,
          message: milestone 
            ? `🔥 ${milestone} day streak! Amazing!` 
            : `Day ${data.currentStreak}! Keep it up! 🔥`
        };
        
      } else if (daysSince === 2) {
        // Forgiveness - 1 day missed
        data.currentStreak += 1;
        data.lastActiveDate = today;
        data.streakHistory.push({ date: today, streak: data.currentStreak, forgiven: true });
        saveStreakData(data);
        
        this.emitStreakEvent(data.currentStreak, null, true);
        
        return {
          streakUpdated: true,
          currentStreak: data.currentStreak,
          milestoneReached: null,
          message: `Back on track! Day ${data.currentStreak} (missed yesterday but we're counting it!) 🔥`,
          forgiven: true
        };
        
      } else {
        // Reset
        const oldStreak = data.currentStreak;
        data.currentStreak = 1;
        data.lastActiveDate = today;
        data.streakHistory.push({ date: today, streak: 1, reset: true, previousStreak: oldStreak });
        saveStreakData(data);
        
        this.emitStreakEvent(1, null, false, true, oldStreak);
        
        return {
          streakUpdated: true,
          currentStreak: 1,
          milestoneReached: null,
          message: `Streak reset after ${daysSince} days away. Starting fresh! Day 1! 💪`,
          wasReset: true,
          oldStreak
        };
      }
    },

    checkMilestone(streak, reached) {
      for (const milestone of STREAK_CONFIG.MILESTONES) {
        if (streak === milestone && !reached.includes(milestone)) {
          return milestone;
        }
      }
      return null;
    },

    emitStreakEvent(streak, milestone = null, forgiven = false, wasReset = false, oldStreak = null) {
      if (window.EventBus) {
        EventBus.emit('streak:updated', { streak, milestone, forgiven, wasReset, oldStreak });
        if (milestone) {
          EventBus.emit('streak:milestone', { milestone, streak });
        }
      }
    },

    getInfo() {
      const data = this.getData();
      const today = this.getTodayString();
      const daysSince = data.lastActiveDate ? this.daysBetween(data.lastActiveDate, today) : null;
      
      let status = 'new';
      if (!data.lastActiveDate) status = 'new';
      else if (data.lastActiveDate === today) status = 'checked-in';
      else if (daysSince === 1) status = 'active';
      else if (daysSince === 2) status = 'at-risk';
      else status = 'expired';
      
      const nextMilestone = STREAK_CONFIG.MILESTONES.find(m => m > data.currentStreak);
      
      return {
        currentStreak: data.currentStreak,
        longestStreak: data.longestStreak,
        lastActiveDate: data.lastActiveDate,
        status,
        daysSinceLastActivity: daysSince,
        nextMilestone: nextMilestone ? { days: nextMilestone, daysAway: nextMilestone - data.currentStreak } : null,
        milestonesReached: data.milestonesReached
      };
    }
  };

  // ============================================
  // ACHIEVEMENT SYSTEM
  // ============================================

  const AchievementSystem = {
    getData: getAchievementData,

    isUnlocked(achievementId) {
      const data = this.getData();
      return data.unlocked.some(a => a.id === achievementId);
    },

    unlock(achievement) {
      const data = this.getData();
      
      if (!this.isUnlocked(achievement.id)) {
        data.unlocked.push({
          id: achievement.id,
          unlockedAt: new Date().toISOString()
        });
        saveAchievementData(data);
        
        // Award XP
        if (achievement.xpReward) {
          XPSystem.awardXP(achievement.xpReward, 'achievement', {
            achievementId: achievement.id,
            achievementName: achievement.name
          });
        }
        
        // Emit event
        if (window.EventBus) {
          EventBus.emit('achievement:unlocked', {
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            category: achievement.category,
            rarity: achievement.rarity,
            xpReward: achievement.xpReward
          });
        }
        
        return true;
      }
      return false;
    },

    checkAll(contextData = {}) {
      const unlocked = [];
      
      for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (!this.isUnlocked(id) && achievement.condition(contextData)) {
          if (this.unlock(achievement)) {
            unlocked.push(achievement);
          }
        }
      }
      
      return unlocked;
    },

    recordLessonComplete(lessonId, moduleId) {
      const data = this.getData();
      
      if (!data.lessonsCompleted.includes(lessonId)) {
        data.lessonsCompleted.push(lessonId);
      }
      
      // Track weekend days
      const day = new Date().getDay();
      if (day === 6 && !data.weekendDays.includes('saturday')) {
        data.weekendDays.push('saturday');
      }
      if (day === 0 && !data.weekendDays.includes('sunday')) {
        data.weekendDays.push('sunday');
      }
      
      saveAchievementData(data);
      
      // Check achievements
      return this.checkAll({
        totalLessonsCompleted: data.lessonsCompleted.length,
        currentStreak: StreakSystem.getInfo().currentStreak,
        hadPreviousStreak: StreakSystem.getInfo().longestStreak > 0
      });
    },

    getAll() {
      return Object.values(ACHIEVEMENTS).map(a => ({
        ...a,
        unlocked: this.isUnlocked(a.id),
        unlockedAt: this.getUnlockDate(a.id)
      }));
    },

    getUnlockDate(achievementId) {
      const data = this.getData();
      const unlocked = data.unlocked.find(a => a.id === achievementId);
      return unlocked ? unlocked.unlockedAt : null;
    },

    getStats() {
      const all = this.getAll();
      const unlocked = all.filter(a => a.unlocked);
      
      return {
        total: all.length,
        unlocked: unlocked.length,
        progress: Math.round((unlocked.length / all.length) * 100),
        totalXPEarned: unlocked.reduce((sum, a) => sum + (a.xpReward || 0), 0),
        byCategory: {
          progress: this.getByCategory('progress').filter(a => a.unlocked).length,
          performance: this.getByCategory('performance').filter(a => a.unlocked).length,
          streak: this.getByCategory('streak').filter(a => a.unlocked).length,
          explorer: this.getByCategory('explorer').filter(a => a.unlocked).length,
          special: this.getByCategory('special').filter(a => a.unlocked).length
        }
      };
    },

    getByCategory(category) {
      return this.getAll().filter(a => a.category === category);
    }
  };

  // ============================================
  // PROGRESS SYSTEM
  // ============================================

  const ProgressSystem = {
    markComplete(yearLevel, module, lesson) {
      const data = getProgressData(yearLevel, module);
      
      if (!data.completed.includes(lesson)) {
        data.completed.push(lesson);
        data.completed.sort();
      }
      
      data.lastVisited = lesson;
      data.lastAccessed = new Date().toISOString();
      
      saveProgressData(yearLevel, module, data);
      
      // Emit progress event
      if (window.EventBus) {
        EventBus.emit('progress:updated', {
          yearLevel,
          module,
          lesson,
          completed: data.completed.length,
          totalLessons: 30 // Assuming 30 lessons per module
        });
      }
      
      return {
        completed: data.completed.length,
        total: 30,
        percentage: Math.round((data.completed.length / 30) * 100)
      };
    },

    isComplete(yearLevel, module, lesson) {
      const data = getProgressData(yearLevel, module);
      return data.completed.includes(lesson);
    },

    getProgress(yearLevel, module, totalLessons = 30) {
      const data = getProgressData(yearLevel, module);
      return {
        completed: data.completed.length,
        total: totalLessons,
        percentage: Math.round((data.completed.length / totalLessons) * 100),
        completedLessons: data.completed,
        lastVisited: data.lastVisited
      };
    },

    saveLastVisited(yearLevel, module, lesson) {
      const data = getProgressData(yearLevel, module);
      data.lastVisited = lesson;
      data.lastAccessed = new Date().toISOString();
      saveProgressData(yearLevel, module, data);
    }
  };

  // ============================================
  // MAIN ORCHESTRATOR
  // ============================================

  function handleLessonCompleted(eventData) {
    const { yearLevel, module, lesson, quizScore, timeSpent } = eventData;
    const results = {
      xp: null,
      streak: null,
      achievements: [],
      progress: null
    };

    // 1. Update progress
    results.progress = ProgressSystem.markComplete(yearLevel, module, lesson);

    // 2. Check streak (must happen before XP for streak bonus)
    results.streak = StreakSystem.checkIn();

    // 3. Calculate XP with bonuses
    let xpAmount = XP_CONFIG.LESSON_COMPLETE;
    const xpDetails = { lessonId: lesson };

    // First lesson of day bonus
    const xpData = getXPData();
    const today = new Date().toISOString().split('T')[0];
    if (xpData.lastDailyBonusDate !== today) {
      xpAmount += XP_CONFIG.FIRST_LESSON_DAY;
      xpDetails.firstLessonBonus = true;
      xpData.lastDailyBonusDate = today;
      saveXPData(xpData);
    }

    // Streak bonus
    if (results.streak.currentStreak > 1) {
      const streakBonus = results.streak.currentStreak * XP_CONFIG.STREAK_BONUS_PER_DAY;
      xpAmount += streakBonus;
      xpDetails.streakBonus = streakBonus;
    }

    results.xp = XPSystem.awardXP(xpAmount, 'lesson', xpDetails);

    // 4. Check achievements
    results.achievements = AchievementSystem.recordLessonComplete(lesson, module);

    // Emit completion event
    if (window.EventBus) {
      EventBus.emit('lesson:processed', results);
    }

    return results;
  }

  function handleQuizCompleted(eventData) {
    const { score, perfect, lessonId } = eventData;
    
    if (perfect) {
      // Award perfect quiz XP
      XPSystem.awardXP(XP_CONFIG.PERFECT_QUIZ, 'perfect_quiz', { lessonId });
      
      // Update achievement tracking
      const data = getAchievementData();
      data.perfectQuizzes++;
      data.consecutivePerfectQuizzes++;
      saveAchievementData(data);
      
      // Check achievements
      AchievementSystem.checkAll({
        perfectQuizzes: data.perfectQuizzes,
        consecutivePerfectQuizzes: data.consecutivePerfectQuizzes
      });
    } else {
      // Reset consecutive counter
      const data = getAchievementData();
      data.consecutivePerfectQuizzes = 0;
      saveAchievementData(data);
    }
  }

  function handleActivityCompleted(eventData) {
    const { activityId, lessonId } = eventData;
    
    XPSystem.awardXP(XP_CONFIG.ACTIVITY_COMPLETE, 'activity', {
      activityId,
      lessonId
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    // Subscribe to events from the rest of the app
    if (window.EventBus) {
      EventBus.on('lesson:completed', handleLessonCompleted);
      EventBus.on('quiz:completed', handleQuizCompleted);
      EventBus.on('activity:completed', handleActivityCompleted);
    }

    // Record first visit achievement
    const data = getAchievementData();
    if (!data.firstVisit) {
      data.firstVisit = new Date().toISOString();
      saveAchievementData(data);
      AchievementSystem.checkAll({ hasVisited: true });
    }

    console.log('✓ GamificationEngine initialized');
  }

  // Auto-init if DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    // Systems
    XP: XPSystem,
    Streak: StreakSystem,
    Achievement: AchievementSystem,
    Progress: ProgressSystem,
    
    // Config
    config: {
      XP: XP_CONFIG,
      STREAK: STREAK_CONFIG,
      RANKS,
      ACHIEVEMENTS
    },
    
    // Methods
    init,
    emitTestEvent: (name, data) => window.EventBus && EventBus.emit(name, data)
  };
})();

// Expose to global scope
window.GamificationEngine = GamificationEngine;

console.log('✓ GamificationEngine loaded - XP/Streak/Achievement/Progress consolidated');
