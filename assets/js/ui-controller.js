/**
 * Science Learning Hub - UI Controller
 * Phase 0.1: Gamification Consolidation
 * 
 * Handles all visual feedback, notifications, and modals
 * Listens to EventBus events from GamificationEngine
 */

const UIController = (function() {
  'use strict';

  // ============================================
  // CSS ANIMATION STYLES (injected dynamically)
  // ============================================

  function injectStyles() {
    if (document.getElementById('ui-controller-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'ui-controller-styles';
    styles.textContent = `
      /* XP Gain Notification */
      .xp-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #93e4f9, #67d5ed);
        color: #1e3a5f;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(147, 228, 249, 0.4);
        z-index: 1000;
        transform: translateX(150%);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        font-weight: 600;
        min-width: 200px;
      }
      
      .xp-notification.show {
        transform: translateX(0);
      }
      
      .xp-notification.fade-out {
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.3s ease;
      }
      
      .xp-amount {
        font-size: 24px;
        font-weight: 800;
        margin-bottom: 4px;
      }
      
      .xp-bonus {
        font-size: 12px;
        opacity: 0.9;
      }

      /* Level Up Modal */
      .levelup-modal {
        position: fixed;
        inset: 0;
        background: rgba(30, 58, 95, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        animation: fadeIn 0.3s ease forwards;
      }
      
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      
      .levelup-content {
        background: white;
        padding: 48px;
        border-radius: 24px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        transform: scale(0.8);
        animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s forwards;
      }
      
      @keyframes popIn {
        to { transform: scale(1); }
      }
      
      .levelup-icon {
        font-size: 64px;
        margin-bottom: 16px;
        animation: bounce 1s ease infinite;
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      .levelup-content h2 {
        font-size: 28px;
        margin-bottom: 8px;
        color: #1e3a5f;
      }
      
      .levelup-level {
        font-size: 48px;
        font-weight: 800;
        color: #67d5ed;
        margin-bottom: 8px;
      }
      
      .levelup-rank {
        font-size: 18px;
        color: #4a5f7a;
        margin-bottom: 24px;
      }

      /* Achievement Notification */
      .achievement-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        border-radius: 16px;
        padding: 16px 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 1000;
        transform: translateX(150%);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 350px;
        border-left: 4px solid #a855f7;
      }
      
      .achievement-notification.show {
        transform: translateX(0);
      }
      
      .achievement-notification.fade-out {
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.3s ease;
      }
      
      .achievement-unlock-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #d4c5ff, #b8a3ff);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
      }
      
      .achievement-unlock-content {
        flex: 1;
      }
      
      .achievement-unlock-title {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #a855f7;
        font-weight: 700;
        margin-bottom: 4px;
      }
      
      .achievement-unlock-name {
        font-weight: 700;
        color: #1e3a5f;
        margin-bottom: 2px;
      }
      
      .achievement-unlock-desc {
        font-size: 12px;
        color: #6b7fa3;
        margin-bottom: 4px;
      }
      
      .achievement-unlock-xp {
        font-size: 12px;
        font-weight: 700;
        color: #22c55e;
      }

      /* Streak Celebration Modal */
      .streak-modal {
        position: fixed;
        inset: 0;
        background: rgba(30, 58, 95, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        animation: fadeIn 0.3s ease forwards;
      }
      
      .streak-content {
        background: linear-gradient(135deg, #fff7ed, #ffedd5);
        padding: 48px;
        border-radius: 24px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        border: 3px solid #fb923c;
      }
      
      .streak-flame {
        font-size: 80px;
        animation: flame 1s ease-in-out infinite;
      }
      
      @keyframes flame {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      .streak-content h2 {
        font-size: 32px;
        color: #ea580c;
        margin: 16px 0 8px;
      }
      
      .streak-days {
        font-size: 72px;
        font-weight: 800;
        color: #c2410c;
        line-height: 1;
      }

      /* Toast Notification */
      .toast-notification {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #1e3a5f;
        color: white;
        padding: 12px 24px;
        border-radius: 9999px;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
      }
      
      .toast-notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }

      /* Mobile Adjustments */
      @media (max-width: 640px) {
        .xp-notification,
        .achievement-notification {
          right: 10px;
          left: 10px;
          max-width: none;
        }
        
        .levelup-content,
        .streak-content {
          padding: 32px 24px;
          margin: 20px;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  // ============================================
  // NOTIFICATION HELPERS
  // ============================================

  function createNotification(className, html, duration = 3000) {
    // Remove existing notification of same type
    const existing = document.querySelector(`.${className}`);
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = className;
    notification.innerHTML = html;
    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
      }, duration);
    }

    return notification;
  }

  function showToast(message) {
    createNotification('toast-notification', message, 3000);
  }

  // ============================================
  // XP UI
  // ============================================

  function renderXPWidget() {
    const sidebar = document.querySelector('.lesson-sidebar');
    if (!sidebar || sidebar.querySelector('.xp-widget')) return;

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

    const streakWidget = sidebar.querySelector('.streak-widget');
    const progressSection = sidebar.querySelector('.sidebar-progress');
    
    if (streakWidget) {
      streakWidget.after(widget);
    } else if (progressSection) {
      progressSection.after(widget);
    }

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function updateXPWidget() {
    if (!window.GamificationEngine) return;
    
    const stats = GamificationEngine.XP.getStats();
    const widget = document.querySelector('.xp-widget');
    if (!widget) {
      renderXPWidget();
      return updateXPWidget();
    }

    const levelEl = widget.querySelector('.xp-level-number');
    const rankEl = widget.querySelector('.xp-rank');
    const fillEl = widget.querySelector('.xp-fill');
    const currentEl = widget.querySelector('.xp-current');
    const neededEl = widget.querySelector('.xp-needed');
    const nextRankEl = widget.querySelector('.xp-next-rank');

    if (levelEl) levelEl.textContent = stats.currentLevel;
    if (rankEl) rankEl.textContent = stats.rank;
    if (fillEl) fillEl.style.width = `${stats.progressPercent}%`;
    if (currentEl) currentEl.textContent = stats.xpInCurrentLevel;
    if (neededEl) neededEl.textContent = stats.xpNeededForNextLevel;
    
    if (nextRankEl && stats.nextRank) {
      nextRankEl.innerHTML = `<span class="next-rank-text">Next: ${stats.nextRank} (Lvl ${stats.nextRankLevel})</span>`;
    }
  }

  function showXPGained(data) {
    const { amount, newLevel, leveledUp, details } = data;
    
    let bonusText = '';
    if (details?.firstLessonBonus) bonusText = 'First lesson of the day bonus!';
    else if (details?.streakBonus) bonusText = `${details.streakBonus} XP streak bonus!`;

    const html = `
      <div class="xp-amount">+${amount} XP</div>
      ${bonusText ? `<div class="xp-bonus">${bonusText}</div>` : ''}
    `;

    createNotification('xp-notification', html, 3000);
    updateXPWidget();

    // Show level up modal if applicable
    if (leveledUp) {
      setTimeout(() => showLevelUp(newLevel), 1000);
    }
  }

  function showLevelUp(newLevel) {
    if (!window.GamificationEngine) return;
    
    const rank = GamificationEngine.XP.getRankForLevel(newLevel);
    
    const modal = document.createElement('div');
    modal.className = 'levelup-modal';
    modal.innerHTML = `
      <div class="levelup-content">
        <div class="levelup-icon">⭐</div>
        <h2>Level Up!</h2>
        <div class="levelup-level">Level ${newLevel}</div>
        <div class="levelup-rank">${rank}</div>
        <p>Congratulations! You've reached a new level.</p>
        <button class="btn btn-primary" style="margin-top: 16px;">
          Continue Learning
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('button').addEventListener('click', () => {
      modal.remove();
    });

    // Auto-remove after 6 seconds if not clicked
    setTimeout(() => {
      if (modal.parentNode) modal.remove();
    }, 6000);
  }

  // ============================================
  // STREAK UI
  // ============================================

  function renderStreakWidget() {
    const sidebar = document.querySelector('.lesson-sidebar');
    if (!sidebar || sidebar.querySelector('.streak-widget')) return;

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

    const progressSection = sidebar.querySelector('.sidebar-progress');
    if (progressSection) {
      progressSection.after(widget);
    } else {
      sidebar.appendChild(widget);
    }

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function updateStreakWidget(data) {
    const widget = document.querySelector('.streak-widget');
    if (!widget) {
      renderStreakWidget();
      return;
    }

    const info = data || (window.GamificationEngine?.Streak.getInfo());
    if (!info) return;

    const numberEl = widget.querySelector('.streak-number');
    const statusEl = widget.querySelector('.streak-status');
    const milestoneEl = widget.querySelector('.streak-next-milestone');

    if (numberEl) numberEl.textContent = info.currentStreak;

    if (statusEl) {
      const statusMap = {
        'new': 'Start your streak today!',
        'checked-in': '✓ Checked in today',
        'active': 'Keep it up!',
        'at-risk': '⚠️ Check in to keep your streak!',
        'expired': 'Streak expired. Start fresh!'
      };
      statusEl.textContent = statusMap[info.status] || 'Keep learning!';
      statusEl.className = `streak-status status-${info.status}`;
    }

    if (milestoneEl && info.nextMilestone) {
      const progress = (info.currentStreak / info.nextMilestone.days) * 100;
      milestoneEl.innerHTML = `
        <div class="milestone-progress">
          <div class="milestone-bar">
            <div class="milestone-fill" style="width: ${progress.toFixed(1)}%"></div>
          </div>
          <span class="milestone-text">${info.nextMilestone.daysAway} days to ${info.nextMilestone.days}!</span>
        </div>
      `;
    }

    // Update mini calendar
    renderStreakCalendar(widget);
  }

  function renderStreakCalendar(widget) {
    const calendarEl = widget.querySelector('.streak-calendar');
    if (!calendarEl || !window.GamificationEngine) return;

    const history = GamificationEngine.Streak.getData().streakHistory.slice(-7);
    const today = GamificationEngine.Streak.getTodayString();
    
    // Generate last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'narrow' });
      const isActive = history.some(h => h.date === dateStr);
      const isToday = dateStr === today;
      
      days.push({ dayName, isActive, isToday });
    }

    calendarEl.innerHTML = days.map(day => `
      <div class="calendar-day ${day.isActive ? 'active' : ''} ${day.isToday ? 'today' : ''}">
        <span class="day-name">${day.dayName}</span>
        <span class="day-dot"></span>
      </div>
    `).join('');
  }

  function showStreakMilestone(data) {
    const { milestone } = data;
    
    const modal = document.createElement('div');
    modal.className = 'streak-modal';
    modal.innerHTML = `
      <div class="streak-content">
        <div class="streak-flame">🔥</div>
        <div class="streak-days">${milestone}</div>
        <h2>Day Streak!</h2>
        <p>Incredible dedication! You're building an amazing learning habit.</p>
        <button class="btn btn-primary" style="margin-top: 24px;">
          Keep Going!
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('button').addEventListener('click', () => {
      modal.remove();
    });

    setTimeout(() => {
      if (modal.parentNode) modal.remove();
    }, 5000);
  }

  // ============================================
  // ACHIEVEMENT UI
  // ============================================

  function renderAchievementMiniWidget() {
    const sidebar = document.querySelector('.lesson-sidebar');
    if (!sidebar || sidebar.querySelector('.achievement-mini-widget')) return;
    if (!window.GamificationEngine) return;

    const stats = GamificationEngine.Achievement.getStats();
    const recent = GamificationEngine.Achievement.getAll()
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
      ${recent.length > 0 ? `
        <div class="achievement-recent">
          ${recent.map(a => `
            <div class="achievement-recent-item" title="${a.name}">
              <i data-lucide="${a.icon}"></i>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;

    const streakWidget = sidebar.querySelector('.streak-widget');
    if (streakWidget) {
      streakWidget.after(widget);
    } else {
      sidebar.appendChild(widget);
    }

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function showAchievementUnlocked(data) {
    const { name, description, icon, xpReward } = data;
    
    const html = `
      <div class="achievement-unlock-icon">
        <i data-lucide="${icon}"></i>
      </div>
      <div class="achievement-unlock-content">
        <div class="achievement-unlock-title">Achievement Unlocked!</div>
        <div class="achievement-unlock-name">${name}</div>
        <div class="achievement-unlock-desc">${description}</div>
        <div class="achievement-unlock-xp">+${xpReward} XP</div>
      </div>
    `;

    const notification = createNotification('achievement-notification', html, 5000);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Refresh mini widget
    renderAchievementMiniWidget();
  }

  // ============================================
  // PROGRESS UI
  // ============================================

  function updateProgressUI(data) {
    const { completed, total, percentage } = data;
    
    // Update progress bar
    const progressFill = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${completed}/${total} lessons (${percentage}%)`;
    }

    // Update lesson item states
    const activeItem = document.querySelector('.lesson-item.active');
    if (activeItem) {
      activeItem.classList.add('completed');
    }
  }

  function updateMarkCompleteButton() {
    const btn = document.querySelector('.mark-complete-btn');
    if (!btn) return;

    btn.classList.add('completed');
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      <span>Completed!</span>
    `;
  }

  // ============================================
  // EVENT SUBSCRIPTION
  // ============================================

  function subscribeToEvents() {
    if (!window.EventBus) {
      console.warn('[UIController] EventBus not available');
      return;
    }

    // XP events
    EventBus.on('xp:gained', showXPGained);
    EventBus.on('level:up', (data) => showLevelUp(data.newLevel));

    // Streak events
    EventBus.on('streak:updated', updateStreakWidget);
    EventBus.on('streak:milestone', showStreakMilestone);

    // Achievement events
    EventBus.on('achievement:unlocked', showAchievementUnlocked);

    // Progress events
    EventBus.on('progress:updated', updateProgressUI);

    // Lesson completion (for button state)
    EventBus.on('lesson:processed', () => {
      updateMarkCompleteButton();
    });

    console.log('[UIController] Subscribed to EventBus events');
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    injectStyles();
    subscribeToEvents();
    
    // Render widgets if sidebar exists
    setTimeout(() => {
      renderStreakWidget();
      renderXPWidget();
      renderAchievementMiniWidget();
      
      // Initial data load
      if (window.GamificationEngine) {
        updateXPWidget();
        updateStreakWidget();
      }
    }, 100);

    console.log('✓ UIController initialized');
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    init,
    showToast,
    showLevelUp,
    showStreakMilestone,
    showAchievementUnlocked,
    updateXPWidget,
    updateStreakWidget,
    updateProgressUI
  };
})();

// Expose to global scope
window.UIController = UIController;

console.log('✓ UIController loaded - Visual feedback system ready');
