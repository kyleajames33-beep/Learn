/**
 * Template Library - Phase 0.6.5
 * Pre-built diagram templates for biology concepts
 * Version: 1.0.0
 */

const TemplateLibrary = {
  version: '1.0.0',
  
  // Templates data
  templates: null,
  
  // Current filter
  filter: {
    category: null,
    search: '',
    syllabusTags: []
  },
  
  // Callbacks
  callbacks: {
    onTemplateSelected: null,
    onTemplateLoaded: null
  },
  
  /**
   * Initialize the template library
   * @param {Object} options 
   */
  async init(options = {}) {
    this.callbacks = { ...this.callbacks, ...options.callbacks };
    
    // Load templates
    await this.loadTemplates();
    
    console.log('Template Library initialized');
    return this;
  },
  
  /**
   * Load templates from JSON
   */
  async loadTemplates() {
    try {
      const response = await fetch('/assets/data/templates/biology-diagrams.json');
      if (response.ok) {
        this.templates = await response.json();
      } else {
        // Use default templates
        this.templates = this.getDefaultTemplates();
      }
    } catch (error) {
      console.warn('Failed to load templates, using defaults:', error);
      this.templates = this.getDefaultTemplates();
    }
  },
  
  /**
   * Get default templates if JSON fails to load
   * @returns {Object}
   */
  getDefaultTemplates() {
    return {
      name: "Default Biology Templates",
      version: "1.0.0",
      categories: [
        {
          id: "cell-structure",
          name: "Cell Structure",
          templates: [
            {
              id: "animal-cell",
              name: "Animal Cell",
              description: "Basic animal cell diagram",
              type: "diagram",
              image: { src: "", alt: "Animal cell", width: 600, height: 400 },
              suggestedLabels: [],
              syllabusTags: ["cell-structure"]
            }
          ]
        }
      ]
    };
  },
  
  /**
   * Get all categories
   * @returns {Array}
   */
  getCategories() {
    if (!this.templates) return [];
    return this.templates.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: cat.templates.length
    }));
  },
  
  /**
   * Get templates by category
   * @param {string} categoryId 
   * @returns {Array}
   */
  getTemplatesByCategory(categoryId) {
    if (!this.templates) return [];
    
    const category = this.templates.categories.find(c => c.id === categoryId);
    return category ? category.templates : [];
  },
  
  /**
   * Get all templates
   * @returns {Array}
   */
  getAllTemplates() {
    if (!this.templates) return [];
    
    return this.templates.categories.flatMap(cat => 
      cat.templates.map(t => ({ ...t, category: cat.name, categoryId: cat.id }))
    );
  },
  
  /**
   * Search templates
   * @param {string} query 
   * @returns {Array}
   */
  searchTemplates(query) {
    const all = this.getAllTemplates();
    const lowerQuery = query.toLowerCase();
    
    return all.filter(t => 
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.syllabusTags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },
  
  /**
   * Get template by ID
   * @param {string} templateId 
   * @returns {Object|null}
   */
  getTemplate(templateId) {
    return this.getAllTemplates().find(t => t.id === templateId) || null;
  },
  
  /**
   * Filter templates
   * @returns {Array}
   */
  getFilteredTemplates() {
    let templates = this.getAllTemplates();
    
    if (this.filter.category) {
      templates = templates.filter(t => t.categoryId === this.filter.category);
    }
    
    if (this.filter.search) {
      const lowerQuery = this.filter.search.toLowerCase();
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    return templates;
  },
  
  /**
   * Set filter
   * @param {string} key 
   * @param {any} value 
   */
  setFilter(key, value) {
    this.filter[key] = value;
  },
  
  /**
   * Clear filters
   */
  clearFilters() {
    this.filter = {
      category: null,
      search: '',
      syllabusTags: []
    };
  },
  
  /**
   * Apply a template to create a diagram/activity
   * @param {string} templateId 
   * @param {Object} customizations 
   * @returns {Object}
   */
  applyTemplate(templateId, customizations = {}) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    
    // Create diagram from template
    const diagram = {
      id: this.generateId('diagram'),
      title: customizations.title || template.name,
      image: customizations.image || template.image,
      hotspots: customizations.hotspots || template.hotspots || [],
      layers: customizations.layers || template.layers || [],
      defaultZoom: 1,
      maxZoom: 3,
      minZoom: 0.5
    };
    
    // Create labeling activity from suggested labels
    const labelingActivity = template.suggestedLabels ? {
      id: this.generateId('labeling'),
      type: 'labeling',
      title: `Label the ${template.name}`,
      image: template.image,
      labels: template.suggestedLabels.map((label, index) => ({
        id: this.generateId('label'),
        zone: {
          x: label.x,
          y: label.y,
          width: 80,
          height: 40
        },
        correctText: label.text,
        alternatives: [],
        hint: ''
      })),
      allowRetry: true,
      xpReward: 50
    } : null;
    
    if (this.callbacks.onTemplateLoaded) {
      this.callbacks.onTemplateLoaded(template, diagram, labelingActivity);
    }
    
    return {
      template,
      diagram,
      labelingActivity
    };
  },
  
  /**
   * Create ordering activity from mitosis stages template
   * @returns {Object}
   */
  createMitosisOrderingActivity() {
    return {
      id: this.generateId('ordering'),
      type: 'ordering',
      title: 'Stages of Mitosis',
      instructions: 'Arrange the stages of mitosis in the correct order.',
      items: [
        { id: 'p', text: 'Prophase', correctPosition: 1 },
        { id: 'm', text: 'Metaphase', correctPosition: 2 },
        { id: 'a', text: 'Anaphase', correctPosition: 3 },
        { id: 't', text: 'Telophase', correctPosition: 4 },
        { id: 'c', text: 'Cytokinesis', correctPosition: 5 }
      ],
      shuffleDisplay: true,
      lockFirst: false,
      xpReward: 50
    };
  },
  
  /**
   * Create cell organelle matching activity
   * @returns {Object}
   */
  createOrganelleMatchingActivity() {
    return {
      id: this.generateId('matching'),
      type: 'matching',
      title: 'Cell Organelle Functions',
      description: 'Match each organelle with its function.',
      items: [
        { term: 'Nucleus', correctValue: 'control-center', options: [
          { value: 'control-center', label: 'Control center of the cell' },
          { value: 'energy', label: 'Produces energy (ATP)' },
          { value: 'protein', label: 'Makes proteins' },
          { value: 'digest', label: 'Breaks down waste' }
        ]},
        { term: 'Mitochondria', correctValue: 'energy', options: [
          { value: 'control-center', label: 'Control center of the cell' },
          { value: 'energy', label: 'Produces energy (ATP)' },
          { value: 'protein', label: 'Makes proteins' },
          { value: 'digest', label: 'Breaks down waste' }
        ]},
        { term: 'Ribosomes', correctValue: 'protein', options: [
          { value: 'control-center', label: 'Control center of the cell' },
          { value: 'energy', label: 'Produces energy (ATP)' },
          { value: 'protein', label: 'Makes proteins' },
          { value: 'digest', label: 'Breaks down waste' }
        ]},
        { term: 'Lysosomes', correctValue: 'digest', options: [
          { value: 'control-center', label: 'Control center of the cell' },
          { value: 'energy', label: 'Produces energy (ATP)' },
          { value: 'protein', label: 'Makes proteins' },
          { value: 'digest', label: 'Breaks down waste' }
        ]}
      ],
      theme: 'teal'
    };
  },
  
  /**
   * Render template browser
   * @param {HTMLElement} container 
   */
  renderBrowser(container) {
    const categories = this.getCategories();
    const templates = this.getFilteredTemplates();
    
    container.innerHTML = `
      <div class="template-library">
        <div class="template-header">
          <h3>
            <i data-lucide="layout-template"></i>
            Template Library
          </h3>
          <div class="template-search">
            <input type="text" 
                   class="form-input" 
                   placeholder="Search templates..."
                   id="templateSearch"
                   value="${this.escapeHtml(this.filter.search)}">
          </div>
        </div>
        
        <div class="template-categories">
          <button class="template-category-btn ${!this.filter.category ? 'active' : ''}" 
                  data-category="">
            All (${this.getAllTemplates().length})
          </button>
          ${categories.map(cat => `
            <button class="template-category-btn ${this.filter.category === cat.id ? 'active' : ''}" 
                    data-category="${cat.id}">
              ${this.escapeHtml(cat.name)} (${cat.count})
            </button>
          `).join('')}
        </div>
        
        <div class="template-grid">
          ${templates.length > 0 ? templates.map(t => `
            <div class="template-card" data-template-id="${t.id}">
              <div class="template-preview">
                ${t.image?.src ? `
                  <img src="${t.image.src}" alt="${this.escapeHtml(t.image.alt || t.name)}" loading="lazy">
                ` : `
                  <div class="template-placeholder">
                    <i data-lucide="image"></i>
                  </div>
                `}
              </div>
              <div class="template-info">
                <h4>${this.escapeHtml(t.name)}</h4>
                <p>${this.escapeHtml(t.description)}</p>
                <span class="template-category-badge">${this.escapeHtml(t.category)}</span>
              </div>
              <button class="btn btn-primary btn-sm template-use-btn" data-template-id="${t.id}">
                <i data-lucide="plus"></i>
                Use Template
              </button>
            </div>
          `).join('') : `
            <div class="template-empty">
              <i data-lucide="search-x"></i>
              <p>No templates found</p>
            </div>
          `}
        </div>
      </div>
    `;
    
    this.bindBrowserEvents(container);
  },
  
  /**
   * Bind browser events
   * @param {HTMLElement} container 
   */
  bindBrowserEvents(container) {
    // Search
    const searchInput = container.querySelector('#templateSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.setFilter('search', e.target.value);
        this.renderBrowser(container);
      });
    }
    
    // Category filter
    container.querySelectorAll('.template-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category || null;
        this.setFilter('category', category);
        this.renderBrowser(container);
      });
    });
    
    // Use template
    container.querySelectorAll('.template-use-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const templateId = e.currentTarget.dataset.templateId;
        
        if (this.callbacks.onTemplateSelected) {
          this.callbacks.onTemplateSelected(templateId);
        }
      });
    });
    
    // Card click to preview
    container.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          const templateId = card.dataset.templateId;
          this.showPreview(templateId);
        }
      });
    });
  },
  
  /**
   * Show template preview modal
   * @param {string} templateId 
   */
  showPreview(templateId) {
    const template = this.getTemplate(templateId);
    if (!template) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal open';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content modal-content--large">
        <div class="modal-header">
          <h3>${this.escapeHtml(template.name)}</h3>
          <button class="btn btn-icon btn-ghost modal-close">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="modal-body">
          ${template.image?.src ? `
            <div class="template-preview-large">
              <img src="${template.image.src}" alt="${this.escapeHtml(template.image.alt || template.name)}">
            </div>
          ` : ''}
          <p>${this.escapeHtml(template.description)}</p>
          
          ${template.suggestedLabels ? `
            <h4>Suggested Labels (${template.suggestedLabels.length})</h4>
            <ul class="template-labels-list">
              ${template.suggestedLabels.map(l => `
                <li><i data-lucide="tag"></i> ${this.escapeHtml(l.text)}</li>
              `).join('')}
            </ul>
          ` : ''}
          
          ${template.hotspots ? `
            <h4>Interactive Hotspots (${template.hotspots.length})</h4>
            <ul class="template-hotspots-list">
              ${template.hotspots.map(h => `
                <li><i data-lucide="mouse-pointer-2"></i> ${this.escapeHtml(h.title)}</li>
              `).join('')}
            </ul>
          ` : ''}
          
          ${template.syllabusTags ? `
            <h4>Syllabus Tags</h4>
            <div class="template-tags">
              ${template.syllabusTags.map(tag => `
                <span class="badge badge-secondary">${this.escapeHtml(tag)}</span>
              `).join('')}
            </div>
          ` : ''}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary template-use-confirm" data-template-id="${templateId}">
            <i data-lucide="plus"></i>
            Use This Template
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Bind events
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
    
    modal.querySelector('.template-use-confirm').addEventListener('click', () => {
      if (this.callbacks.onTemplateSelected) {
        this.callbacks.onTemplateSelected(templateId);
      }
      modal.remove();
    });
    
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
  generateId(prefix = 'template') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Export for both module and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TemplateLibrary };
}
