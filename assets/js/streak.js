/**
 * Science Learning Hub - Streak Manager
 * Phase 02: Gamification Layer
 * 
 * Tracks daily learning streaks with the following rules:
 * - Streak increases when user completes a lesson on a new day
 * - Streak resets if user misses 2+ consecutive days
 * - Streak is preserved if user misses only 1 day (forgiveness)
 * - Milestones: 7, 30, 60, 100, 365 days
 */

const StreakManager = {
  STORAGE_KEY: 'sh_streak',
  
  /**
   * Get today's date string (YYYY-MM-DD)
   */
  getTodayString() {
    return new Date().toISOString().split('T')[0];
  },
  
  /**
   * Get yesterday's date string
   */
  getYesterdayString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  },
  
  /**
   * Get streak data from storage
   */
  getStreakData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      streakHistory: [],
      milestonesReached: []
    };
  },
  
  /**
   * Save streak data to storage
   */
  saveStreakData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },
  
  /**
   * Calculate days between two dates
   */
  daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
  
  /**
   * Check and update streak when user completes a lesson
   * Returns: { streakUpdated: boolean, milestoneReached: number|null, message: string }
   */
  checkIn() {
    const today = this.getTodayString();
    const yesterday = this.getYesterdayString();
    const data = this.getStreakData();
    
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
      this.saveStreakData(data);
      
      return {
        streakUpdated: true,
        currentStreak: 1,
        milestoneReached: null,
        message: 'Streak started! Day 1! 🔥'
      };
    }
    
    // Check how many days since last activity
    const daysSinceLastActivity = this.daysBetween(data.lastActiveDate, today);
    
    if (daysSinceLastActivity === 1) {
      // Consecutive day - increase streak
      data.currentStreak += 1;
      data.lastActiveDate = today;
      data.streakHistory.push({ date: today, streak: data.currentStreak });
      
      // Update longest streak if needed
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak;
      }
      
      // Check for milestones
      const milestone = this.checkMilestone(data.currentStreak, data.milestonesReached);
      if (milestone) {
        data.milestonesReached.push(milestone);
      }
      
      this.saveStreakData(data);
      
      return {
        streakUpdated: true,
        currentStreak: data.currentStreak,
        milestoneReached: milestone,
        message: milestone 
          ? `🔥 ${milestone} day streak! Amazing!` 
          : `Day ${data.currentStreak}! Keep it up! 🔥`
      };
      
    } else if (daysSinceLastActivity === 2) {
      // Missed one day - STREAK FORGIVENESS (don't reset)
      data.currentStreak += 1;
      data.lastActiveDate = today;
      data.streakHistory.push({ 
        date: today, 
        streak: data.currentStreak,
        forgiven: true 
      });
      
      this.saveStreakData(data);
      
      return {
        streakUpdated: true,
        currentStreak: data.currentStreak,
        milestoneReached: null,
        message: `Back on track! Day ${data.currentStreak} (missed yesterday but we're counting it!) 🔥`
      };
      
    } else {
      // Missed 2+ days - reset streak
      const oldStreak = data.currentStreak;
      data.currentStreak = 1;
      data.lastActiveDate = today;
      data.streakHistory.push({ 
        date: today, 
        streak: 1,
        reset: true,
        previousStreak: oldStreak
      });
      
      this.saveStreakData(data);
      
      return {
        streakUpdated: true,
        currentStreak: 1,
        milestoneReached: null,
        message: `Streak reset after ${daysSinceLastActivity} days away. Starting fresh! Day 1! 💪`,
        wasReset: true,
        oldStreak: oldStreak
      };
    }
  },
  
  /**
   * Check if current streak hits a milestone
   */
  checkMilestone(streak, milestonesReached) {
    const milestones = [7, 30, 60, 100, 180, 365];
    for (const milestone of milestones) {
      if (streak === milestone && !milestonesReached.includes(milestone)) {
        return milestone;
      }
    }
    return null;
  },
  
  /**
   * Get current streak info for display
   */
  getStreakInfo() {
    const data = this.getStreakData();
    const today = this.getTodayString();
    const daysSinceLastActivity = data.lastActiveDate 
      ? this.daysBetween(data.lastActiveDate, today)
      : null;
    
    // Determine streak status
    let status = 'active';
    if (!data.lastActiveDate) {
      status = 'new';
    } else if (data.lastActiveDate === today) {
      status = 'checked-in';
    } else if (daysSinceLastActivity === 1) {
      status = 'at-risk'; // Will reset tomorrow if not checked in
    } else if (daysSinceLastActivity >= 2) {
      status = 'expired';
    }
    
    return {
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      lastActiveDate: data.lastActiveDate,
      status: status,
      daysSinceLastActivity: daysSinceLastActivity,
      nextMilestone: this.getNextMilestone(data.currentStreak),
      milestonesReached: data.milestonesReached
    };
  },
  
  /**
   * Get next milestone
   */
  getNextMilestone(currentStreak) {
    const milestones = [7, 30, 60, 100, 180, 365];
    for (const milestone of milestones) {
      if (currentStreak < milestone) {
        return {
          days: milestone,
          daysAway: milestone - currentStreak
        };
      }
    }
    return null; // All milestones reached!
  },
  
  /**
   * Get streak history (last 30 days)
   */
  getStreakHistory(days = 30) {
    const data = this.getStreakData();
    const history = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = data.streakHistory.find(h => h.date === dateStr);
      history.push({
        date: dateStr,
        active: !!dayData,
        streak: dayData ? dayData.streak : 0
      });
    }
    
    return history;
  },
  
  /**
   * Reset streak (for testing/admin)
   */
  resetStreak() {
    localStorage.removeItem(this.STORAGE_KEY);
    return { message: 'Streak reset successfully' };
  },
  
  /**
   * Simulate streak for testing
   */
  simulateStreak(days) {
    const data = {
      currentStreak: days,
      longestStreak: days,
      lastActiveDate: this.getTodayString(),
      streakHistory: [],
      milestonesReached: []
    };
    
    // Add history entries
    for (let i = days; i > 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i - 1));
      data.streakHistory.push({
        date: date.toISOString().split('T')[0],
        streak: days - i + 1
      });
    }
    
    // Calculate milestones reached
    const milestones = [7, 30, 60, 100, 180, 365];
    data.milestonesReached = milestones.filter(m => m <= days);
    
    this.saveStreakData(data);
    return { message: `Simulated ${days} day streak` };
  }
};

// Export for use in other scripts
window.StreakManager = StreakManager;

/**
 * UI Functions for Streak Display
 */
const StreakUI = {
  /**
   * Initialize streak display in sidebar
   */
  init() {
    this.renderStreakWidget();
    this.updateStreakDisplay();
  },
  
  /**
   * Render the streak widget HTML
   */
  renderStreakWidget() {
    const sidebar = document.querySelector('.lesson-sidebar');
    if (!sidebar) return;
    
    // Check if widget already exists
    if (sidebar.querySelector('.streak-widget')) return;
    
    const widget = document.createElement('div');
    widget.className = 'streak-widget';
    widget.innerHTML = `
      <div class="streak-header">
        <i data-lucide="flame"></i>
        <span>Daily Streak</span>
      </div>
      <div class="streak-display">
        <span class="streak-number">0</span>
        <span class="streak-label">days</span>
      </div>
      <div class="streak-status"></div>
      <div class="streak-next-milestone"></div>
      <div class="streak-calendar"></div>
    `;
    
    // Insert after progress bar
    const progressSection = sidebar.querySelector('.sidebar-progress');
    if (progressSection) {
      progressSection.after(widget);
    } else {
      sidebar.appendChild(widget);
    }
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  /**
   * Update streak display with current data
   */
  updateStreakDisplay() {
    const info = StreakManager.getStreakInfo();
    const widget = document.querySelector('.streak-widget');
    if (!widget) return;
    
    // Update streak number
    const numberEl = widget.querySelector('.streak-number');
    if (numberEl) {
      numberEl.textContent = info.currentStreak;
    }
    
    // Update status
    const statusEl = widget.querySelector('.streak-status');
    if (statusEl) {
      let statusText = '';
      let statusClass = '';
      
      switch (info.status) {
        case 'new':
          statusText = 'Start your streak today!';
          statusClass = 'status-new';
          break;
        case 'checked-in':
          statusText = '✓ Checked in today';
          statusClass = 'status-checked';
          break;
        case 'at-risk':
          statusText = '⚠️ Check in to keep your streak!';
          statusClass = 'status-risk';
          break;
        case 'expired':
          statusText = 'Streak expired. Start fresh!';
          statusClass = 'status-expired';
          break;
        default:
          statusText = 'Keep learning!';
      }
      
      statusEl.textContent = statusText;
      statusEl.className = `streak-status ${statusClass}`;
    }
    
    // Update next milestone
    const milestoneEl = widget.querySelector('.streak-next-milestone');
    if (milestoneEl && info.nextMilestone) {
      milestoneEl.innerHTML = `
        <div class="milestone-progress">
          <div class="milestone-bar">
            <div class="milestone-fill" style="width: ${((info.currentStreak / info.nextMilestone.days) * 100).toFixed(1)}%"></div>
          </div>
          <span class="milestone-text">${info.nextMilestone.daysAway} days to ${info.nextMilestone.days}!</span>
        </div>
      `;
    }
    
    // Render mini calendar
    this.renderMiniCalendar(widget);
  },
  
  /**
   * Render mini calendar of last 7 days
   */
  renderMiniCalendar(widget) {
    const calendarEl = widget.querySelector('.streak-calendar');
    if (!calendarEl) return;
    
    const history = StreakManager.getStreakHistory(7);
    
    calendarEl.innerHTML = history.map(day => {
      const date = new Date(day.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'narrow' });
      const isToday = day.date === StreakManager.getTodayString();
      
      return `
        <div class="calendar-day ${day.active ? 'active' : ''} ${isToday ? 'today' : ''}" title="${day.date}">
          <span class="day-name">${dayName}</span>
          <span class="day-dot"></span>
        </div>
      `;
    }).join('');
  },
  
  /**
   * Show streak celebration modal
   */
  showCelebration(milestone) {
    const modal = document.createElement('div');
    modal.className = 'streak-celebration-modal';
    modal.innerHTML = `
      <div class="celebration-content">
        <div class="celebration-icon">🔥</div>
        <h2>${milestone} Day Streak!</h2>
        <p>Incredible dedication! You're building an amazing learning habit.</p>
        <button class="btn btn-primary" onclick="this.closest('.streak-celebration-modal').remove()">
          Keep Going!
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 5000);
  }
};

// Export UI functions
window.StreakUI = StreakUI;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => StreakUI.init());
} else {
  StreakUI.init();
}

console.log('✓ Streak Manager loaded');
