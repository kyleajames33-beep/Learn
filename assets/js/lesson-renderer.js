/**
 * Science Hub Lesson Renderer
 * Renders lesson JSON into interactive HTML
 * Supports: labeling, matching, ordering, classification, problemSolving, 
 *           comparison-table, interactive-slider, tonicity-simulator
 */

class LessonRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.lesson = null;
    this.currentActivity = null;
  }

  /**
   * Load and render a lesson
   */
  async loadLesson(lessonId) {
    try {
      const response = await fetch(`../../data/lessons/${lessonId}.json`);
      if (!response.ok) throw new Error(`Failed to load lesson: ${lessonId}`);
      
      this.lesson = await response.json();
      this.render();
      return true;
    } catch (error) {
      console.error('Lesson load error:', error);
      this.container.innerHTML = `
        <div class="error-message">
          <h3>Unable to load lesson</h3>
          <p>Please check your connection and try again.</p>
          <p class="error-details">${error.message}</p>
        </div>
      `;
      return false;
    }
  }

  /**
   * Detect V2 format lessons
   */
  isV2Format() {
    return this.lesson && (this.lesson.v2 === true || this.lesson.contentHTML);
  }

  /**
   * Dynamically load V2 CSS if not already loaded
   */
  loadV2Styles() {
    if (document.getElementById('lesson-v2-css')) return;
    const link = document.createElement('link');
    link.id = 'lesson-v2-css';
    link.rel = 'stylesheet';
    link.href = '../assets/css/lesson-v2.css';
    document.head.appendChild(link);
  }

  /**
   * Render the complete lesson
   */
  render() {
    if (!this.lesson) return;

    if (this.isV2Format()) {
      this.loadV2Styles();
      this.renderV2();
      return;
    }

    const html = `
      ${this.renderHero()}
      ${this.renderLearningIntentions()}
      ${this.renderEngagementHook()}
      ${this.renderContentSections()}
      ${this.renderActivities()}
      ${this.renderAssessment()}
      ${this.renderCopyToBook()}
      ${this.renderNavigation()}
    `;

    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  /**
   * V2 Format: Render the complete lesson
   */
  renderV2() {
    const html = `
      <div class="lesson-content">
        ${this.renderV2Hero()}
        ${this.renderV2Intentions()}
        ${this.renderV2ContentHTML()}
        ${this.renderV2Activities()}
        ${this.renderV2Assessment()}
        ${this.renderV2Answers()}
        ${this.renderV2CopyToBook()}
        ${this.renderNavigation()}
      </div>
    `;

    this.container.innerHTML = html;
    this.bindV2ActivityHandlers();
    this.attachEventListeners();
  }

  /**
   * V2: Render hero with badges, gradient, icon
   */
  renderV2Hero() {
    const hero = this.lesson.hero || {};
    return `
      <header class="hero">
        <div class="hero-grid">
          <div>
            <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
              ${hero.subjectBadge ? `<span class="badge">${hero.subjectBadge}</span>` : ''}
              ${hero.levelBadge ? `<span class="badge">${hero.levelBadge}</span>` : ''}
              ${this.lesson.difficulty ? `<span class="badge">${this.lesson.difficulty}</span>` : ''}
            </div>
            <h1>${hero.icon ? hero.icon + ' ' : ''}${this.lesson.title}</h1>
            <p>${this.lesson.description || ''}</p>
            <div class="lesson-hero-meta" style="margin-top:16px">
              <span class="hero-meta-item">
                <i data-lucide="clock"></i>
                <span>${this.lesson.duration || ''}</span>
              </span>
              <span class="hero-meta-item">
                <i data-lucide="book-open"></i>
                <span>Lesson ${this.lesson.lessonNumber || ''}</span>
              </span>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  /**
   * V2: Render intentions grid (3-column: Learning, Connections, Success)
   */
  renderV2Intentions() {
    const intentions = this.lesson.intentions;
    if (!intentions) {
      // Fall back to V1 fields
      if (this.lesson.learningIntentions) {
        return this.renderLearningIntentions();
      }
      return '';
    }

    return `
      <section class="intentions-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-bottom:32px">
        <div class="card">
          <div class="card-header">
            <div class="icon-wrapper"><i data-lucide="target"></i></div>
            <h2 class="card-title">Learning Intentions</h2>
          </div>
          <div class="card-content">
            <ul class="intention-list">
              ${(intentions.learning || []).map(li => `<li>${li}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="icon-wrapper icon-wrapper-secondary"><i data-lucide="link"></i></div>
            <h2 class="card-title">Connections</h2>
          </div>
          <div class="card-content">
            <ul class="intention-list">
              ${(intentions.connections || []).map(c => `<li><strong>${c.topic}:</strong> ${c.description}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="icon-wrapper"><i data-lucide="check-circle"></i></div>
            <h2 class="card-title">Success Criteria</h2>
          </div>
          <div class="card-content">
            <ul class="criteria-list">
              ${(intentions.success || []).map(sc => `<li>${sc}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * V2: Render rich HTML content
   */
  renderV2ContentHTML() {
    if (!this.lesson.contentHTML) return '';
    return `<section class="v2-content">${this.lesson.contentHTML}</section>`;
  }

  /**
   * V2: Render activities with enhanced styling
   */
  renderV2Activities() {
    if (!this.lesson.activities || this.lesson.activities.length === 0) return '';

    return `
      <section class="activities-section" style="margin-top:40px">
        <h2 class="section-title"><i data-lucide="activity"></i> Activities</h2>
        ${this.lesson.activities.map((activity, idx) => `
          <div style="margin-bottom:8px"><span class="badge">${idx + 1}</span></div>
          ${this.renderActivity(activity)}
        `).join('')}
      </section>
    `;
  }

  /**
   * V2: Render assessment with enhanced styling
   */
  renderV2Assessment() {
    const assessment = this.lesson.assessment;
    if (!assessment) return '';

    return `
      <section class="assessment-section" style="margin-top:40px">
        <h2 class="section-title"><i data-lucide="help-circle"></i> Assessment</h2>

        ${assessment.multipleChoice ? `
          <div class="mcq-section">
            <h3>Multiple Choice Questions</h3>
            ${assessment.multipleChoice.map((mcq, idx) => `
              <div class="mcq-item card" data-mcq-id="${mcq.id}" style="padding:20px;margin-bottom:16px">
                <p class="mcq-question"><strong>Q${idx + 1}:</strong> ${mcq.question}</p>
                <div class="mcq-options">
                  ${mcq.options.map(opt => `
                    <label class="quiz-option">
                      <input type="${mcq.multiSelect ? 'checkbox' : 'radio'}"
                             name="${mcq.id}"
                             value="${opt}"
                             data-correct="${Array.isArray(mcq.correctAnswer) ? mcq.correctAnswer.includes(opt) : mcq.correctAnswer === opt}">
                      <span class="quiz-option-circle"></span>
                      <span class="quiz-option-text">${opt}</span>
                    </label>
                  `).join('')}
                </div>
                <div class="mcq-rationale" style="display:none">
                  <p><strong>Answer:</strong> ${mcq.correctAnswer}</p>
                  <p>${mcq.rationale || ''}</p>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${assessment.shortAnswer ? `
          <div class="short-answer-section">
            <h3>Short Answer Questions</h3>
            ${assessment.shortAnswer.map((sa, idx) => `
              <div class="sa-item card" data-sa-id="${sa.id}" style="padding:20px;margin-bottom:16px">
                <p class="sa-question"><strong>Q${idx + 1}:</strong> ${sa.question}</p>
                <p class="sa-marks">[${sa.marks} marks]</p>
                <textarea class="modern-input sa-answer" rows="${sa.lines || 4}" placeholder="Type your answer here..."></textarea>
                <details class="answer-key" style="margin-top:12px">
                  <summary>View marking guide</summary>
                  <div class="marking-criteria">
                    <h4>Marking Criteria:</h4>
                    <ul>
                      ${sa.markingCriteria.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                    ${sa.commonError ? `<p class="common-error"><strong>Common error:</strong> ${sa.commonError}</p>` : ''}
                  </div>
                </details>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </section>
    `;
  }

  /**
   * V2: Render answer key section
   */
  renderV2Answers() {
    const answers = this.lesson.answers;
    if (!answers) return '';

    return `
      <section class="answers-section" style="margin-top:40px">
        <details class="card" style="padding:20px">
          <summary style="cursor:pointer;font-weight:600;font-size:1.1em">
            <i data-lucide="check-square"></i> Complete Answer Key
          </summary>
          <div style="margin-top:16px">
            ${answers.activities ? answers.activities.map(act => `
              <div style="margin-bottom:24px">
                <h4>${act.title || act.activityId || 'Activity'}</h4>
                ${this.renderV2ActivityAnswer(act)}
                ${act.keyPoint ? `<div class="info-box"><strong>Key Point:</strong> ${act.keyPoint}</div>` : ''}
                ${act.examTip ? `<div class="highlight-box"><strong>Exam Tip:</strong> ${act.examTip}</div>` : ''}
              </div>
            `).join('') : ''}

            ${answers.assessment ? `
              <h4>Assessment Answers</h4>
              ${answers.assessment.map(a => `
                <div style="margin-bottom:16px;padding:12px;background:#f8fafc;border-radius:8px">
                  <p><strong>${a.questionId}:</strong> ${a.question}</p>
                  <p style="color:#059669;font-weight:600">${a.correctAnswer}</p>
                  <p style="color:#64748b;font-size:0.9em">${a.explanation}</p>
                </div>
              `).join('')}
            ` : ''}
          </div>
        </details>
      </section>
    `;
  }

  /**
   * V2: Render a single activity answer (handles array, object, or missing formats)
   */
  renderV2ActivityAnswer(act) {
    // Format 1: answers is an array of {label, description}
    if (Array.isArray(act.answers)) {
      return `<ul>${act.answers.map(a => `<li><strong>${a.label}:</strong> ${a.description}</li>`).join('')}</ul>`;
    }

    // Format 2: answers is an object with category keys (e.g. classification)
    if (act.answers && typeof act.answers === 'object') {
      return Object.entries(act.answers).map(([category, items]) => `
        <div style="margin-bottom:8px">
          <strong>${category}:</strong>
          ${Array.isArray(items) ? `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>` : `<p>${items}</p>`}
        </div>
      `).join('');
    }

    // Format 3: no answers property — use correctOrder/explanation
    if (act.correctOrder) {
      return `
        <p><strong>Correct Order:</strong></p>
        <ol>${(Array.isArray(act.correctOrder) ? act.correctOrder : [act.correctOrder]).map(item => `<li>${item}</li>`).join('')}</ol>
        ${act.explanation ? `<p>${act.explanation}</p>` : ''}
      `;
    }

    // Fallback: render whatever text fields are available
    if (act.explanation) return `<p>${act.explanation}</p>`;
    return '<p><em>See activity for answer.</em></p>';
  }

  /**
   * V2: Render copy to book with sections support
   */
  renderV2CopyToBook() {
    const ctb = this.lesson.copyToBook;
    if (!ctb) return '';

    // V2 format has sections array
    if (ctb.sections) {
      return `
        <section class="copy-to-book-section" style="margin-top:40px">
          <details class="card" style="padding:20px">
            <summary>
              <div class="icon-wrapper" style="display:inline-block"><i data-lucide="book-open"></i></div>
              <span>Copy Into Your Book</span>
            </summary>
            <div class="card-content" style="margin-top:16px">
              ${ctb.sections.map(section => `
                <h4>${section.title}</h4>
                <ul>
                  ${section.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
              `).join('')}
            </div>
          </details>
        </section>
      `;
    }

    // Fall back to V1 format
    return this.renderCopyToBook();
  }

  /**
   * V2: Bind interactive handlers for activities
   */
  bindV2ActivityHandlers() {
    // MCQ click handlers
    this.container.querySelectorAll('.quiz-option input').forEach(input => {
      input.addEventListener('change', (e) => this.checkMCQ(e));
    });
  }

  /**
   * Render hero section
   */
  renderHero() {
    return `
      <header class="lesson-hero">
        <div class="lesson-hero-badges">
          <span class="badge badge-critical">${this.lesson.moduleTitle}</span>
          <span class="badge">Lesson ${this.lesson.lessonNumber}</span>
          <span class="badge badge-secondary">${this.lesson.difficulty}</span>
        </div>
        <h1 class="lesson-hero-title">${this.lesson.title}</h1>
        <p class="lesson-hero-description">${this.lesson.description}</p>
        <div class="lesson-hero-meta">
          <span class="hero-meta-item">
            <i data-lucide="clock"></i>
            <span>${this.lesson.duration}</span>
          </span>
        </div>
      </header>
    `;
  }

  /**
   * Render learning intentions and success criteria
   */
  renderLearningIntentions() {
    return `
      <section class="learning-intentions">
        <div class="grid-3-col">
          <div class="card">
            <div class="card-header">
              <div class="icon-wrapper"><i data-lucide="target"></i></div>
              <h2 class="card-title">Learning Intentions</h2>
            </div>
            <div class="card-content">
              <ul class="intention-list">
                ${this.lesson.learningIntentions.map(li => `<li>${li}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div class="icon-wrapper icon-wrapper-secondary"><i data-lucide="book-open"></i></div>
              <h2 class="card-title">Syllabus Links</h2>
            </div>
            <div class="card-content">
              <p><strong>${this.lesson.syllabusLinks.module}</strong></p>
              <p>${this.lesson.syllabusLinks.inquiryQuestion}</p>
              <p class="text-muted">${this.lesson.syllabusLinks.focus}</p>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div class="icon-wrapper"><i data-lucide="check-circle"></i></div>
              <h2 class="card-title">Success Criteria</h2>
            </div>
            <div class="card-content">
              <ul class="criteria-list">
                ${this.lesson.successCriteria.map(sc => `<li>${sc}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render engagement hook
   */
  renderEngagementHook() {
    const hook = this.lesson.engagementHook;
    if (!hook) return '';
    return `
      <section class="engagement-hook">
        <div class="hook-box">
          <div class="hook-icon"><i data-lucide="lightbulb"></i></div>
          <div class="hook-content">
            <h3>${hook.title}</h3>
            <p>${hook.content}</p>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render content sections
   */
  renderContentSections() {
    if (!this.lesson.contentSections) return '';
    return this.lesson.contentSections.map(section => {
      switch (section.type) {
        case 'diagram':
          return this.renderDiagramSection(section);
        case 'grid':
          return this.renderGridSection(section);
        case 'content':
          return this.renderContentSection(section);
        default:
          return '';
      }
    }).join('');
  }

  renderDiagramSection(section) {
    return `
      <section class="content-section" id="${section.id}">
        <h2 class="section-title"><i data-lucide="${section.icon}"></i> ${section.title}</h2>
        <div class="diagram-container">
          ${section.image ? `
            <div class="diagram-image">
              <img src="${section.image.src}" alt="${section.image.alt}" loading="lazy">
              <p class="caption">${section.image.caption}</p>
            </div>
          ` : ''}
          <div class="diagram-content">
            <p>${section.content}</p>
            <ul class="key-points">
              ${section.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
            </ul>
            ${section.example ? `<p class="example"><strong>Example:</strong> ${section.example}</p>` : ''}
            ${section.checkForUnderstanding ? `<p class="cfu"><strong>Check:</strong> ${section.checkForUnderstanding}</p>` : ''}
          </div>
        </div>
      </section>
    `;
  }

  renderGridSection(section) {
    const headers = section.gridItems.map(item => item.header);
    const maxRows = Math.max(...section.gridItems.map(item => item.items.length));
    
    return `
      <section class="content-section" id="${section.id}">
        <h2 class="section-title"><i data-lucide="${section.icon}"></i> ${section.title}</h2>
        <div class="comparison-table-container">
          <table class="comparison-table">
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${Array.from({length: maxRows}, (_, i) => `
                <tr>${section.gridItems.map(item => `<td>${item.items[i] || ''}</td>`).join('')}</tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ${section.example ? `<p class="example"><strong>Example:</strong> ${section.example}</p>` : ''}
        ${section.note ? `<p class="note"><strong>Note:</strong> ${section.note}</p>` : ''}
      </section>
    `;
  }

  renderContentSection(section) {
    return `
      <section class="content-section" id="${section.id}">
        <h2 class="section-title"><i data-lucide="${section.icon}"></i> ${section.title}</h2>
        <div class="content-text">
          <p>${section.content}</p>
          ${section.example ? `<p class="example"><strong>Example:</strong> ${section.example}</p>` : ''}
          ${section.checkForUnderstanding ? `<p class="cfu"><strong>Check:</strong> ${section.checkForUnderstanding}</p>` : ''}
        </div>
      </section>
    `;
  }

  /**
   * Render activities
   */
  renderActivities() {
    if (!this.lesson.activities || this.lesson.activities.length === 0) return '';
    
    return `
      <section class="activities-section">
        <h2 class="section-title"><i data-lucide="activity"></i> Activities</h2>
        ${this.lesson.activities.map(activity => this.renderActivity(activity)).join('')}
      </section>
    `;
  }

  renderActivity(activity) {
    switch (activity.type) {
      case 'labeling':
        return this.renderLabelingActivity(activity);
      case 'matching':
        return this.renderMatchingActivity(activity);
      case 'ordering':
        return this.renderOrderingActivity(activity);
      case 'classification':
        return this.renderClassificationActivity(activity);
      case 'fillBlank':
      case 'fill-blank':
        return this.renderFillBlankActivity(activity);
      case 'calculation':
        return this.renderCalculationActivity(activity);
      case 'problemSolving':
        return this.renderProblemSolvingActivity(activity);
      case 'comparison-table':
        return this.renderComparisonTableActivity(activity);
      case 'interactive-slider':
        return this.renderInteractiveSliderActivity(activity);
      case 'tonicity-simulator':
        return this.renderTonicitySimulatorActivity(activity);
      default:
        return `<div class="activity-card">Unknown activity type: ${activity.type}</div>`;
    }
  }

  /**
   * Labeling Activity
   */
  renderLabelingActivity(activity) {
    return `
      <div class="activity-card activity-card--${activity.theme}" data-activity-id="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="map-pin"></i>
          <h3>${activity.title}</h3>
          <span class="xp-badge">+${activity.xpReward} XP</span>
        </div>
        <div class="activity-card-body">
          <p class="activity-description">${activity.description}</p>
          <div class="labeling-activity">
            <div class="labeling-image-container">
              <img src="${activity.image.src}" alt="${activity.image.alt}" class="labeling-image">
              ${activity.labels.map(label => `
                <div class="labeling-zone" 
                     style="left:${label.zone.x}%;top:${label.zone.y}%;width:${label.zone.width}%;height:${label.zone.height}%"
                     data-label-id="${label.id}"
                     data-correct="${label.correctText}"
                     data-alternatives='${JSON.stringify(label.alternatives)}'
                     data-hint="${label.hint}">
                  <span class="zone-marker">?</span>
                </div>
              `).join('')}
            </div>
            <div class="labeling-controls">
              <div class="labeling-input-area">
                <input type="text" class="modern-input labeling-input" placeholder="Type your answer...">
                <button class="btn-primary check-label-btn">Check</button>
                <button class="btn-secondary hint-btn">Hint</button>
              </div>
              <p class="hint-text" style="display:none"></p>
              <div class="labeling-progress"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Matching Activity
   */
  renderMatchingActivity(activity) {
    const shuffledItems = [...activity.items].sort(() => Math.random() - 0.5);
    const shuffledMatches = [...activity.items].sort(() => Math.random() - 0.5);
    
    return `
      <div class="activity-card activity-card--${activity.theme}" data-activity-id="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="git-compare"></i>
          <h3>${activity.title}</h3>
          <span class="xp-badge">+${activity.xpReward} XP</span>
        </div>
        <div class="activity-card-body">
          <p class="activity-description">${activity.description}</p>
          <div class="matching-activity">
            <div class="matching-columns">
              <div class="matching-column">
                <h4>Terms</h4>
                ${shuffledItems.map(item => `
                  <div class="matching-item" data-id="${item.id}" data-match="${item.match}">${item.text}</div>
                `).join('')}
              </div>
              <div class="matching-column">
                <h4>Definitions</h4>
                ${shuffledMatches.map(item => `
                  <div class="matching-target" data-match="${item.match}">${item.match}</div>
                `).join('')}
              </div>
            </div>
            <button class="btn-primary check-matching-btn">Check Answers</button>
            <div class="matching-feedback"></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Ordering Activity
   */
  renderOrderingActivity(activity) {
    return `
      <div class="activity-card activity-card--${activity.theme}" data-activity-id="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="list-ordered"></i>
          <h3>${activity.title}</h3>
          <span class="xp-badge">+${activity.xpReward} XP</span>
        </div>
        <div class="activity-card-body">
          <p class="activity-description">${activity.description}</p>
          <div class="ordering-activity">
            <p class="ordering-instruction">Drag to order: Most significant factor (top) to least significant (bottom)</p>
            <div class="ordering-list" id="ordering-${activity.id}">
              ${activity.items.map(item => `
                <div class="ordering-item" draggable="true" data-id="${item.id}" data-order="${item.correctOrder}">
                  <span class="order-number">?</span>
                  <span class="order-text">${item.text}</span>
                  <i data-lucide="grip-vertical"></i>
                </div>
              `).join('')}
            </div>
            <button class="btn-primary check-ordering-btn">Check Order</button>
            <div class="ordering-feedback"></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Classification Activity
   */
  renderClassificationActivity(activity) {
    return `
      <div class="activity-card activity-card--${activity.theme}" data-activity-id="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="layout-grid"></i>
          <h3>${activity.title}</h3>
          <span class="xp-badge">+${activity.xpReward} XP</span>
        </div>
        <div class="activity-card-body">
          <p class="activity-description">${activity.description}</p>
          <div class="classification-activity">
            <div class="classification-categories">
              ${activity.categories.map(cat => `
                <div class="category-box" data-category="${cat.id}">
                  <h4>${cat.name}</h4>
                  <p class="category-desc">${cat.description}</p>
                  <div class="category-dropzone"></div>
                </div>
              `).join('')}
            </div>
            <div class="classification-items">
              <h4>Items to classify:</h4>
              ${activity.items.map(item => `
                <div class="classification-item draggable" draggable="true" data-id="${item.id}" data-category="${item.correctCategory}">
                  ${item.text}
                </div>
              `).join('')}
            </div>
            <button class="btn-primary check-classification-btn">Check Classification</button>
            <div class="classification-feedback"></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Problem Solving Activity
   */
  renderProblemSolvingActivity(activity) {
    return `
      <div class="activity-card activity-card--${activity.theme}" data-activity-id="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="calculator"></i>
          <h3>${activity.title}</h3>
          <span class="xp-badge">+${activity.xpReward} XP</span>
        </div>
        <div class="activity-card-body">
          <p class="activity-description">${activity.description}</p>
          ${activity.problems.map((problem, idx) => `
            <div class="problem-container" data-problem-id="${problem.id}">
              <div class="problem-statement">
                <p><strong>Problem ${idx + 1}:</strong> ${problem.question}</p>
                ${problem.context ? `<p class="problem-context">${problem.context}</p>` : ''}
                <p class="formula">Formula: ${problem.formula}</p>
              </div>
              <div class="problem-working">
                <details class="working-steps">
                  <summary>Show working steps</summary>
                  <ol>
                    ${problem.workingSteps.map(step => `<li>${step}</li>`).join('')}
                  </ol>
                </details>
              </div>
              <div class="problem-input">
                <label>Your answer:</label>
                <div class="input-with-unit">
                  <input type="number" class="modern-input problem-answer" 
                         data-correct="${problem.correctAnswer}" 
                         data-tolerance="${problem.tolerance}"
                         step="any">
                  <span class="unit">${problem.unit}</span>
                </div>
                ${problem.hint ? `<p class="hint-text">Hint: ${problem.hint}</p>` : ''}
              </div>
              <div class="problem-feedback"></div>
              ${problem.followUpQuestion ? `<p class="follow-up">${problem.followUpQuestion}</p>` : ''}
            </div>
          `).join('')}
          <button class="btn-primary check-problems-btn">Check Answers</button>
        </div>
      </div>
    `;
  }

  /**
   * Comparison Table Activity (Lesson 6)
   */
  renderComparisonTableActivity(activity) {
    return `
      <div class="activity-card activity-card--${activity.theme}" data-activity-id="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="columns"></i>
          <h3>${activity.title}</h3>
          <span class="xp-badge">+${activity.xpReward} XP</span>
        </div>
        <div class="activity-card-body">
          <p class="activity-description">${activity.description}</p>
          <div class="comparison-toggle-activity">
            <div class="toggle-controls">
              <button class="toggle-btn active" data-view="all">Show All</button>
              <button class="toggle-btn" data-view="animal">Animal Only</button>
              <button class="toggle-btn" data-view="plant">Plant Only</button>
              <button class="toggle-btn" data-view="both">Both</button>
            </div>
            <div class="comparison-categories">
              ${activity.categories.map(cat => `
                <div class="comparison-category" data-category="${cat.id}">
                  <h4>${cat.name}</h4>
                  <ul class="category-items">
                    ${cat.items.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Interactive Slider Activity (Lesson 8)
   */
  renderInteractiveSliderActivity(activity) {
    return `
      <div class="activity-card activity-card--${activity.theme}" data-activity-id="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="sliders-horizontal"></i>
          <h3>${activity.title}</h3>
          <span class="xp-badge">+${activity.xpReward} XP</span>
        </div>
        <div class="activity-card-body">
          <p class="activity-description">${activity.description}</p>
          <div class="interactive-slider-activity">
            <div class="slider-container">
              <label for="temp-slider-${activity.id}">
                Temperature: <span class="temp-value">${activity.slider.defaultValue}</span>${activity.slider.unit}
              </label>
              <input type="range" 
                     id="temp-slider-${activity.id}"
                     class="temp-slider"
                     min="${activity.slider.min}" 
                     max="${activity.slider.max}" 
                     value="${activity.slider.defaultValue}"
                     step="${activity.slider.step}">
              <div class="slider-labels">
                <span>${activity.slider.min}°C</span>
                <span>${activity.slider.max}°C</span>
              </div>
            </div>
            <div class="membrane-visualisation">
              <div class="membrane-state" data-state="optimal">
                <div class="phospholipids">
                  ${Array.from({length: 12}, (_, i) => `
                    <div class="phospholipid" style="animation-delay:${i * 0.1}s">
                      <div class="head"></div>
                      <div class="tails"></div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
            <div class="temperature-feedback">
              ${activity.zones.map(zone => `
                <div class="zone-feedback" data-min="${zone.min}" data-max="${zone.max}" style="display:none">
                  <h4>${zone.label}</h4>
                  <p>${zone.description}</p>
                  <p class="cholesterol-effect"><strong>Cholesterol effect:</strong> ${zone.cholesterolEffect}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Tonicity Simulator Activity (Lesson 10)
   */
  renderTonicitySimulatorActivity(activity) {
    return `
      <div class="activity-card activity-card--${activity.theme}" data-activity-id="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="microscope"></i>
          <h3>${activity.title}</h3>
          <span class="xp-badge">+${activity.xpReward} XP</span>
        </div>
        <div class="activity-card-body">
          <p class="activity-description">${activity.description}</p>
          <div class="tonicity-simulator">
            <div class="cell-type-selector">
              <label>Select cell type:</label>
              <select class="cell-type-select">
                ${activity.cellTypes.map(type => `
                  <option value="${type.id}">${type.name}</option>
                `).join('')}
              </select>
            </div>
            <div class="solution-selector">
              <label>Select solution:</label>
              <div class="solution-buttons">
                ${activity.solutions.map(sol => `
                  <button class="solution-btn" data-solution="${sol.id}" data-wp="${sol.waterPotential}">
                    ${sol.name}
                  </button>
                `).join('')}
              </div>
            </div>
            <div class="cell-visualisation">
              <div class="cell-container" data-cell="animal">
                <div class="cell animal-cell">
                  <div class="cell-membrane"></div>
                  <div class="cytoplasm">
                    <div class="nucleus"></div>
                  </div>
                </div>
                <div class="solution-label">Solution: <span class="current-solution">Isotonic</span></div>
              </div>
            </div>
            <div class="effect-description">
              <p class="effect-text">Select a solution to see the effect on the cell.</p>
            </div>
            ${activity.solutions.map(sol => `
              <div class="solution-data" 
                   data-solution="${sol.id}" 
                   data-animal="${sol.animalEffect}"
                   data-plant="${sol.plantEffect}"
                   style="display:none">
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Fill-in-the-Blank Activity
   */
  renderFillBlankActivity(activity) {
    return `
      <div class="activity-card activity-card--${activity.theme}" data-activity-id="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="edit-3"></i>
          <h3>${activity.title}</h3>
          <span class="xp-badge">+${activity.xpReward || 10} XP</span>
        </div>
        <div class="activity-card-body">
          <p class="activity-description">${activity.description}</p>
          <div class="fillblank-activity">
            ${activity.items.map((item, index) => `
              <div class="fillblank-item" data-index="${index}">
                <span class="fillblank-text">${item.text.replace('__________', `<input type="text" class="fillblank-input" data-answer="${item.answer}" data-index="${index}" placeholder="Type answer...">`)}</span>
              </div>
            `).join('')}
          </div>
          <div class="activity-feedback" id="feedback-${activity.id}"></div>
          <button class="btn btn-primary check-activity-btn" data-activity="${activity.id}">Check Answers</button>
        </div>
      </div>
    `;
  }

  /**
   * Calculation Activity
   */
  renderCalculationActivity(activity) {
    return `
      <div class="activity-card activity-card--${activity.theme}" data-activity-id="${activity.id}">
        <div class="activity-card-header">
          <i data-lucide="calculator"></i>
          <h3>${activity.title}</h3>
          <span class="xp-badge">+${activity.xpReward || 15} XP</span>
        </div>
        <div class="activity-card-body">
          <p class="activity-description">${activity.description}</p>
          ${activity.problem ? `<div class="calculation-problem">${activity.problem}</div>` : ''}
          ${activity.formula ? `
            <div class="formula-box">
              <strong>Formula:</strong> ${activity.formula}
            </div>
          ` : ''}
          <div class="calculation-activity">
            ${activity.steps ? activity.steps.map((step, index) => `
              <div class="calculation-step">
                <span class="step-number">${index + 1}.</span>
                <span class="step-text">${step.text}</span>
                ${step.input ? `<input type="text" class="calculation-input" data-answer="${step.answer}" placeholder="${step.placeholder || 'Answer'}">` : ''}
              </div>
            `).join('') : activity.items ? activity.items.map((item, index) => `
              <div class="calculation-item">
                <p class="calculation-question">${item.question}</p>
                <input type="text" class="calculation-input" data-answer="${item.answer}" placeholder="Enter your answer">
                ${item.units ? `<span class="calculation-units">${item.units}</span>` : ''}
              </div>
            `).join('') : ''}
          </div>
          <div class="activity-feedback" id="feedback-${activity.id}"></div>
          <button class="btn btn-primary check-activity-btn" data-activity="${activity.id}">Check Answers</button>
          ${activity.hints ? `
            <details class="calculation-hints">
              <summary>Need a hint?</summary>
              <ul>${activity.hints.map(hint => `<li>${hint}</li>`).join('')}</ul>
            </details>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render assessment section
   */
  renderAssessment() {
    const assessment = this.lesson.assessment;
    return `
      <section class="assessment-section">
        <h2 class="section-title"><i data-lucide="help-circle"></i> Assessment</h2>
        
        <div class="mcq-section">
          <h3>Multiple Choice Questions</h3>
          ${assessment.multipleChoice.map((mcq, idx) => `
            <div class="mcq-item" data-mcq-id="${mcq.id}">
              <p class="mcq-question"><strong>Q${idx + 1}:</strong> ${mcq.question}</p>
              <div class="mcq-options">
                ${mcq.options.map(opt => `
                  <label class="quiz-option">
                    <input type="${mcq.multiSelect ? 'checkbox' : 'radio'}" 
                           name="${mcq.id}" 
                           value="${opt}"
                           data-correct="${mcq.correctAnswer.includes(opt)}">
                    <span class="quiz-option-circle"></span>
                    <span class="quiz-option-text">${opt}</span>
                  </label>
                `).join('')}
              </div>
              <div class="mcq-rationale" style="display:none">
                <p><strong>Answer:</strong> ${mcq.correctAnswer}</p>
                <p>${mcq.rationale}</p>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="short-answer-section">
          <h3>Short Answer Questions</h3>
          ${assessment.shortAnswer.map((sa, idx) => `
            <div class="sa-item" data-sa-id="${sa.id}">
              <p class="sa-question"><strong>Q${idx + 1}:</strong> ${sa.question}</p>
              <p class="sa-marks">[${sa.marks} marks]</p>
              <textarea class="modern-input sa-answer" rows="4" placeholder="Type your answer here..."></textarea>
              <details class="answer-key">
                <summary>View marking guide</summary>
                <div class="marking-criteria">
                  <h4>Marking Criteria:</h4>
                  <ul>
                    ${sa.markingCriteria.map(c => `<li>${c}</li>`).join('')}
                  </ul>
                  <p class="common-error"><strong>Common error:</strong> ${sa.commonError}</p>
                </div>
              </details>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Render copy to book section
   */
  renderCopyToBook() {
    const ctb = this.lesson.copyToBook;
    return `
      <section class="copy-to-book-section">
        <details class="card">
          <summary>
            <div class="icon-wrapper"><i data-lucide="book-open"></i></div>
            <span>Copy Into Your Book</span>
          </summary>
          <div class="card-content">
            <h4>Key Definitions</h4>
            <ul>
              ${ctb.definitions.map(d => `<li>${d}</li>`).join('')}
            </ul>
            <h4>Key Points</h4>
            <ul>
              ${ctb.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
            </ul>
            <h4>Diagrams to Draw</h4>
            <ul>
              ${ctb.diagrams.map(d => `<li>${d}</li>`).join('')}
            </ul>
          </div>
        </details>
      </section>
    `;
  }

  /**
   * Render navigation
   */
  renderNavigation() {
    const nav = this.lesson.navigation;
    return `
      <nav class="lesson-navigation">
        ${nav.previous ? `
          <a href="lesson.html?lesson=${nav.previous}" class="lesson-nav-btn">
            <i data-lucide="chevron-left"></i>
            <div class="nav-btn-content">
              <span class="nav-btn-label">Previous</span>
              <span class="nav-btn-title">${nav.previousTitle}</span>
            </div>
          </a>
        ` : '<div></div>'}
        
        <a href="index.html" class="lesson-nav-home">
          <i data-lucide="grid-3x3"></i>
          <span>All Lessons</span>
        </a>
        
        ${nav.next ? `
          <a href="lesson.html?lesson=${nav.next}" class="lesson-nav-btn">
            <div class="nav-btn-content" style="text-align:right">
              <span class="nav-btn-label">Next</span>
              <span class="nav-btn-title">${nav.nextTitle}</span>
            </div>
            <i data-lucide="chevron-right"></i>
          </a>
        ` : '<div></div>'}
      </nav>
    `;
  }

  /**
   * Attach event listeners after render
   */
  attachEventListeners() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Labeling activity
    this.container.querySelectorAll('.labeling-zone').forEach(zone => {
      zone.addEventListener('click', (e) => this.handleLabelClick(e));
      zone.addEventListener('touchstart', (e) => this.handleLabelClick(e), {passive: true});
    });

    // Matching activity
    this.container.querySelectorAll('.matching-item').forEach(item => {
      item.addEventListener('click', (e) => this.handleMatchingItemClick(e));
    });
    this.container.querySelectorAll('.matching-target').forEach(target => {
      target.addEventListener('click', (e) => this.handleMatchingTargetClick(e));
    });

    // Ordering activity - drag and drop
    this.initOrderingDragAndDrop();

    // Classification activity - drag and drop
    this.initClassificationDragAndDrop();

    // Problem solving
    this.container.querySelectorAll('.check-problems-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.checkProblems(e));
    });

    // Comparison table toggle
    this.container.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleComparisonToggle(e));
    });

    // Interactive slider
    this.container.querySelectorAll('.temp-slider').forEach(slider => {
      slider.addEventListener('input', (e) => this.handleTemperatureChange(e));
    });

    // Tonicity simulator
    this.container.querySelectorAll('.solution-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleSolutionChange(e));
    });
    this.container.querySelectorAll('.cell-type-select').forEach(select => {
      select.addEventListener('change', (e) => this.handleCellTypeChange(e));
    });

    // MCQ checking
    this.container.querySelectorAll('.quiz-option input').forEach(input => {
      input.addEventListener('change', (e) => this.checkMCQ(e));
    });
  }

  // Activity handlers
  handleLabelClick(e) {
    const zone = e.currentTarget;
    const labelId = zone.dataset.labelId;
    const correct = zone.dataset.correct;
    const hint = zone.dataset.hint;
    
    // Show input for this zone
    const inputArea = zone.closest('.labeling-activity').querySelector('.labeling-input-area');
    inputArea.querySelector('.labeling-input').dataset.currentZone = labelId;
    inputArea.querySelector('.hint-text').textContent = `Hint: ${hint}`;
    
    // Highlight selected zone
    zone.closest('.labeling-image-container').querySelectorAll('.labeling-zone').forEach(z => z.classList.remove('selected'));
    zone.classList.add('selected');
  }

  handleMatchingItemClick(e) {
    const item = e.currentTarget;
    item.classList.toggle('selected');
  }

  handleMatchingTargetClick(e) {
    const target = e.currentTarget;
    const selectedItem = this.container.querySelector('.matching-item.selected');
    
    if (selectedItem) {
      const isCorrect = selectedItem.dataset.match === target.dataset.match;
      target.classList.add(isCorrect ? 'correct' : 'incorrect');
      selectedItem.classList.remove('selected');
      selectedItem.classList.add(isCorrect ? 'matched' : 'mismatched');
    }
  }

  initOrderingDragAndDrop() {
    const lists = this.container.querySelectorAll('.ordering-list');
    lists.forEach(list => {
      let draggedItem = null;
      
      list.querySelectorAll('.ordering-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
          draggedItem = item;
          item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
          draggedItem = null;
        });
        
        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (draggedItem && draggedItem !== item) {
            const rect = item.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            if (e.clientY < midpoint) {
              item.before(draggedItem);
            } else {
              item.after(draggedItem);
            }
          }
        });
      });
    });

    // Check ordering button
    this.container.querySelectorAll('.check-ordering-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.checkOrdering(e));
    });
  }

  checkOrdering(e) {
    const activity = e.target.closest('.activity-card');
    const items = activity.querySelectorAll('.ordering-item');
    let allCorrect = true;
    
    items.forEach((item, index) => {
      const correctOrder = parseInt(item.dataset.order);
      const isCorrect = correctOrder === index + 1;
      item.classList.add(isCorrect ? 'correct' : 'incorrect');
      item.querySelector('.order-number').textContent = index + 1;
      if (!isCorrect) allCorrect = false;
    });

    const feedback = activity.querySelector('.ordering-feedback');
    feedback.textContent = allCorrect ? '✓ Correct order!' : '✗ Some items are out of order. Try again.';
    feedback.className = 'ordering-feedback ' + (allCorrect ? 'success' : 'error');
  }

  initClassificationDragAndDrop() {
    const draggables = this.container.querySelectorAll('.classification-item.draggable');
    const dropzones = this.container.querySelectorAll('.category-dropzone');

    draggables.forEach(item => {
      item.addEventListener('dragstart', () => item.classList.add('dragging'));
      item.addEventListener('dragend', () => item.classList.remove('dragging'));
    });

    dropzones.forEach(zone => {
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
        const dragging = this.container.querySelector('.classification-item.dragging');
        if (dragging) {
          zone.appendChild(dragging);
        }
      });
    });

    // Check classification button
    this.container.querySelectorAll('.check-classification-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.checkClassification(e));
    });
  }

  checkClassification(e) {
    const activity = e.target.closest('.activity-card');
    const categories = activity.querySelectorAll('.category-box');
    let allCorrect = true;
    let totalItems = 0;
    let correctItems = 0;

    categories.forEach(cat => {
      const catId = cat.dataset.category;
      const items = cat.querySelectorAll('.classification-item');
      
      items.forEach(item => {
        totalItems++;
        const isCorrect = item.dataset.category === catId;
        item.classList.add(isCorrect ? 'correct' : 'incorrect');
        if (isCorrect) correctItems++;
        else allCorrect = false;
      });
    });

    const feedback = activity.querySelector('.classification-feedback');
    feedback.textContent = `${correctItems}/${totalItems} correct. ${allCorrect ? 'Perfect!' : 'Some items need to be moved.'}`;
    feedback.className = 'classification-feedback ' + (allCorrect ? 'success' : 'error');
  }

  checkProblems(e) {
    const activity = e.target.closest('.activity-card');
    const problems = activity.querySelectorAll('.problem-container');
    
    problems.forEach(problem => {
      const input = problem.querySelector('.problem-answer');
      const correct = parseFloat(input.dataset.correct);
      const tolerance = parseFloat(input.dataset.tolerance);
      const userAnswer = parseFloat(input.value);
      const feedback = problem.querySelector('.problem-feedback');
      
      if (isNaN(userAnswer)) {
        feedback.textContent = 'Please enter a number';
        feedback.className = 'problem-feedback error';
        return;
      }

      // For text answers
      if (input.dataset.isTextAnswer) {
        const acceptable = JSON.parse(input.dataset.acceptableAnswers || '[]');
        const isCorrect = acceptable.some(ans => 
          userAnswer.toString().toLowerCase().includes(ans.toLowerCase())
        );
        feedback.textContent = isCorrect ? '✓ Correct!' : '✗ Incorrect. Try again.';
        feedback.className = 'problem-feedback ' + (isCorrect ? 'success' : 'error');
        return;
      }

      // For numeric answers with tolerance
      const relativeError = Math.abs(userAnswer - correct) / Math.abs(correct);
      const isCorrect = relativeError <= tolerance;
      
      feedback.textContent = isCorrect ? 
        `✓ Correct! (${correct})` : 
        `✗ Incorrect. Correct answer: ${correct}`;
      feedback.className = 'problem-feedback ' + (isCorrect ? 'success' : 'error');
    });
  }

  handleComparisonToggle(e) {
    const btn = e.target;
    const view = btn.dataset.view;
    const activity = btn.closest('.activity-card');
    
    // Update button states
    activity.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Show/hide categories
    const categories = activity.querySelectorAll('.comparison-category');
    categories.forEach(cat => {
      const catId = cat.dataset.category;
      if (view === 'all' || catId === view) {
        cat.style.display = 'block';
      } else {
        cat.style.display = 'none';
      }
    });
  }

  handleTemperatureChange(e) {
    const slider = e.target;
    const temp = parseInt(slider.value);
    const activity = slider.closest('.activity-card');
    
    // Update displayed temperature
    activity.querySelector('.temp-value').textContent = temp;
    
    // Find applicable zone
    const zones = activity.querySelectorAll('.zone-feedback');
    zones.forEach(zone => {
      const min = parseInt(zone.dataset.min);
      const max = parseInt(zone.dataset.max);
      if (temp >= min && temp <= max) {
        zone.style.display = 'block';
      } else {
        zone.style.display = 'none';
      }
    });
    
    // Update visualisation
    const membrane = activity.querySelector('.membrane-state');
    if (temp < 10) {
      membrane.dataset.state = 'rigid';
    } else if (temp > 35) {
      membrane.dataset.state = 'fluid';
    } else {
      membrane.dataset.state = 'optimal';
    }
  }

  handleSolutionChange(e) {
    const btn = e.target;
    const solution = btn.dataset.solution;
    const activity = btn.closest('.activity-card');
    const cellType = activity.querySelector('.cell-type-select').value;
    
    // Update button states
    activity.querySelectorAll('.solution-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update cell visualisation
    const cell = activity.querySelector('.cell');
    const effectData = activity.querySelector(`[data-solution="${solution}"]`);
    const effect = cellType === 'animal' ? effectData.dataset.animal : effectData.dataset.plant;
    
    // Update cell appearance based on solution
    cell.className = `cell ${cellType}-cell ${solution}`;
    
    // Update labels
    activity.querySelector('.current-solution').textContent = btn.textContent.trim();
    activity.querySelector('.effect-text').textContent = effect;
  }

  handleCellTypeChange(e) {
    const select = e.target;
    const cellType = select.value;
    const activity = select.closest('.activity-card');
    const cell = activity.querySelector('.cell');
    
    // Update cell visualisation
    cell.className = `cell ${cellType}-cell`;
    
    // Reset solution
    activity.querySelectorAll('.solution-btn').forEach(b => b.classList.remove('active'));
    activity.querySelector('.effect-text').textContent = 'Select a solution to see the effect.';
  }

  checkMCQ(e) {
    const input = e.target;
    const option = input.closest('.quiz-option');
    const isCorrect = input.dataset.correct === 'true';
    
    option.classList.remove('correct', 'incorrect');
    option.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    // Show rationale
    const mcqItem = option.closest('.mcq-item');
    const rationale = mcqItem.querySelector('.mcq-rationale');
    rationale.style.display = 'block';
  }
}

// Export for use
window.LessonRenderer = LessonRenderer;
