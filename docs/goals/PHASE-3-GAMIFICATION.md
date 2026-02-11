# Phase 3: Gamification Expansion

**Status:** PLANNED (significant foundation already built)
**Goal:** Extend the existing gamification systems with adaptive learning features — study plans, weak area detection, spaced repetition. Fix partial wiring issues in current systems.

**Entry Criteria:** Phase 2 complete.

---

## Already Built (DO NOT REBUILD)

These systems are **fully implemented** in the codebase. Any Phase 3 work should extend, not replace them.

### XP & Level System — COMPLETE
- **Files:** `assets/js/xp.js` (513 lines), `assets/css/xp.css` (315 lines)
- 100 XP/lesson, 50 XP/activity, 25 XP bonus for perfect quiz
- 50 rank levels ("Novice Explorer" → "Science Icon")
- Level-up modal with animations
- XP gain notifications (floating "+X XP")
- LocalStorage key: `sh_xp`

### Streak System — COMPLETE
- **Files:** `assets/js/streak.js` (479 lines), `assets/css/streak.css` (307 lines)
- Daily check-in with 1-day forgiveness
- Milestones at 7, 30, 60, 100, 180, 365 days
- Status tracking: new/checked-in/at-risk/expired/active
- Sidebar widget with 7-day mini-calendar
- Celebration modal on milestones
- LocalStorage key: `sh_streak`

### Achievement & Badge System — COMPLETE
- **Files:** `assets/js/achievements.js` (723 lines), `assets/css/achievements.css` (543 lines)
- **22 badges** across 5 categories:
  - Progress (5): first_lesson, lesson_starter, lesson_warrior, lesson_master, module_explorer
  - Performance (5): perfect_score, speed_reader, quiz_champion, attention_to_detail
  - Streak (4): streak_starter, streak_seeker, streak_champion, streak_legend
  - Explorer (4): night_owl, early_bird, weekend_warrior, completionist
  - Special (4): first_visit, comeback_kid, dedicated_student, knowledge_seeker
- 4 rarity tiers: Common, Uncommon, Rare, Epic
- Full showcase page at `hsc-biology/achievements.html`
- LocalStorage key: `sh_achievements`

### Gamification Engine — COMPLETE
- **File:** `assets/js/gamification-engine.js` (999 lines)
- Master orchestrator coordinating XP, streaks, achievements, progress
- EventBus integration for cross-system communication
- Auto-initialises on page load
- Events: `xp:gained`, `level:up`, `streak:updated`, `streak:milestone`, `achievement:unlocked`

### Progress Tracking — COMPLETE
- **File:** `assets/js/progress.js` (223 lines)
- Per-module completion tracking
- Sidebar progress bars
- Completed lesson highlighting

### Mini-Games — COMPLETE (partially wired)
- **File:** `assets/js/minigames.js` (600+ lines)
- Types: drag & drop, flashcards, matching, sequence
- Scoring, high scores, XP rewards (10-25 XP)
- LocalStorage key: `sh_minigames`

### Dashboard Analytics — COMPLETE
- **File:** `assets/js/dashboard.js` (607 lines)
- 12 sections: quick stats, XP card, streak card, achievements, study time, module progress, activity chart, recent achievements, skills radar, mini-game stats, recommendations, goals

### Event Bus — COMPLETE
- **File:** `assets/js/event-bus.js` (120+ lines)
- Pub/sub system connecting all gamification systems

### UI Controller — COMPLETE
- **File:** `assets/js/ui-controller.js` (200+ lines)
- Notification popups, modals, animations for all events

---

## Known Issues to Fix (Before Building New Features)

These are gaps in the existing implementation that should be fixed first:

| # | Issue | Location | Priority |
|---|-------|----------|----------|
| 1 | **Confetti animation** — CSS defined but JS never triggers it | `assets/css/streak.css` lines 230-248 | LOW |
| 2 | **Speed Reader badge** — <10 min completion not actively tracked | `achievements.js` | MEDIUM |
| 3 | **Knowledge Seeker badge** — deep dive tracking not fully wired | `achievements.js` | MEDIUM |
| 4 | **Completionist badge** — Copy Into Books tracking not wired | `achievements.js` | MEDIUM |
| 5 | **Mini-game UI** — not all game type UIs fully polished | `minigames.js` | LOW |
| 6 | **V2 lesson integration** — gamification scripts need loading in V2 lesson pages | All V2 lessons | HIGH |

---

## Exit Criteria

- [ ] All existing badge wiring issues fixed (table above)
- [ ] Gamification working in V2 lesson format
- [ ] Adaptive study plan generator working
- [ ] Weak area detection identifies topics needing review
- [ ] Spaced repetition scheduling for completed lessons
- [ ] Daily/weekly study goals with persistence
- [ ] Leaderboard (optional, anonymous)

---

## Planned Milestones

### M3.0: Fix Existing Wiring (NEW — do first)
- [ ] Fix speed_reader badge: track lesson start time, compare on completion
- [ ] Fix knowledge_seeker badge: wire deep dive section tracking
- [ ] Fix completionist badge: wire Copy Into Books section tracking
- [ ] Trigger confetti animation JS on major milestones
- [ ] Ensure all V2 lesson pages load gamification scripts
- [ ] Verify all 22 achievements can actually be earned in the current app

### M3.1: Study Plan Generator
- [ ] Algorithm analyses completion data and scores
- [ ] Generates personalised study schedule
- [ ] Adapts based on progress and performance
- [ ] Visual calendar/timeline view

### M3.2: Weak Area Detection
- [ ] Tracks performance per topic/concept
- [ ] Identifies consistently low-scoring areas
- [ ] Recommends review lessons
- [ ] Visual "heat map" of strengths/weaknesses

### M3.3: Spaced Repetition
- [ ] Completed lessons scheduled for review
- [ ] Review intervals: 1 day, 3 days, 7 days, 14 days, 30 days
- [ ] Review mode: abbreviated content + assessment only
- [ ] Notifications/reminders for due reviews

### M3.4: Enhanced Achievements (extend, don't replace)
- [ ] Add secret/hidden achievements for exploration
- [ ] Add achievements tied to specific learning milestones (e.g. "completed all Module 1 lessons")
- [ ] Improve achievement notification animations
- [ ] NOTE: 22 badges + showcase page already exist — extend, don't rebuild

### M3.5: Study Goals
- [ ] Set daily XP target (dashboard goals section already displays these — wire up setting them)
- [ ] Weekly lesson completion goals
- [ ] Streak multipliers for consistency
- [ ] Progress reports (weekly in-app summary)

---

**Location:** `/docs/goals/PHASE-3-GAMIFICATION.md`
**Update Frequency:** When Phase 3 approaches
