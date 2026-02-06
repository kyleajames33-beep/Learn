/**
 * Science Learning Hub - Interactive Diagrams
 * Phase 03: Content Expansion & Polish
 * 
 * Features:
 * - Interactive labeling (click to reveal)
 * - Image zoom/lightbox
 * - Pinch to zoom on mobile
 * - Annotations and hotspots
 */

/**
 * Interactive Diagram Component
 * Creates clickable hotspots on diagrams with info panels
 */
const InteractiveDiagram = {
  /**
   * Initialize an interactive diagram
   * @param {HTMLElement} container - Container element
   * @param {Object} config - Diagram configuration
   */
  init(container, config) {
    this.container = container;
    this.config = config;
    this.activeHotspot = null;
    
    this.render();
    this.attachEvents();
  },
  
  render() {
    this.container.innerHTML = `
      <div class="interactive-diagram">
        <div class="diagram-container">
          <img src="${this.config.image}" alt="${this.config.title}" class="diagram-image">
          ${this.config.hotspots.map((spot, index) => `
            <button class="diagram-hotspot ${spot.shape || 'circle'}" 
                    style="left: ${spot.x}; top: ${spot.y};"
                    data-index="${index}"
                    aria-label="View ${spot.label}">
              <span class="hotspot-number">${index + 1}</span>
            </button>
          `).join('')}
        </div>
        <div class="diagram-info-panel">
          <div class="info-panel-content">
            <h4 class="info-panel-title">${this.config.title}</h4>
            <p class="info-panel-instruction">Click on the numbered markers to learn about each part</p>
          </div>
        </div>
      </div>
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  attachEvents() {
    const hotspots = this.container.querySelectorAll('.diagram-hotspot');
    const panel = this.container.querySelector('.info-panel-content');
    
    hotspots.forEach(hotspot => {
      hotspot.addEventListener('click', () => {
        const index = parseInt(hotspot.dataset.index);
        this.showHotspotInfo(index, panel);
        
        // Update active state
        hotspots.forEach(h => h.classList.remove('active'));
        hotspot.classList.add('active');
      });
    });
  },
  
  showHotspotInfo(index, panel) {
    const spot = this.config.hotspots[index];
    panel.innerHTML = `
      <h4 class="info-panel-title">${spot.label}</h4>
      <p class="info-panel-description">${spot.description}</p>
      ${spot.function ? `<div class="info-panel-function"><strong>Function:</strong> ${spot.function}</div>` : ''}
      ${spot.hscNote ? `<div class="info-panel-hsc"><i data-lucide="graduation-cap"></i> ${spot.hscNote}</div>` : ''}
    `;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
};

window.InteractiveDiagram = InteractiveDiagram;

/**
 * Image Lightbox
 * Zoom and pan images with touch support
 */
const ImageLightbox = {
  container: null,
  img: null,
  scale: 1,
  isDragging: false,
  startX: 0,
  startY: 0,
  translateX: 0,
  translateY: 0,
  
  init() {
    // Create lightbox container if not exists
    this.container = document.querySelector('.image-lightbox');
    if (!this.container) {
      this.createLightbox();
    }
    
    // Attach to all zoomable images
    this.attachToImages();
  },
  
  createLightbox() {
    this.container = document.createElement('div');
    this.container.className = 'image-lightbox';
    this.container.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">
          <i data-lucide="x"></i>
        </button>
        <button class="lightbox-zoom-in" aria-label="Zoom in">
          <i data-lucide="zoom-in"></i>
        </button>
        <button class="lightbox-zoom-out" aria-label="Zoom out">
          <i data-lucide="zoom-out"></i>
        </button>
        <button class="lightbox-reset" aria-label="Reset zoom">
          <i data-lucide="maximize-2"></i>
        </button>
        <div class="lightbox-image-container">
          <img src="" alt="" class="lightbox-image">
        </div>
        <div class="lightbox-caption"></div>
      </div>
    `;
    
    document.body.appendChild(this.container);
    
    // Event listeners
    this.container.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.container.querySelector('.lightbox-overlay').addEventListener('click', () => this.close());
    this.container.querySelector('.lightbox-zoom-in').addEventListener('click', () => this.zoomIn());
    this.container.querySelector('.lightbox-zoom-out').addEventListener('click', () => this.zoomOut());
    this.container.querySelector('.lightbox-reset').addEventListener('click', () => this.reset());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.container.classList.contains('active')) return;
      
      if (e.key === 'Escape') this.close();
      if (e.key === '+' || e.key === '=') this.zoomIn();
      if (e.key === '-') this.zoomOut();
    });
    
    // Touch events for pan
    const imgContainer = this.container.querySelector('.lightbox-image-container');
    imgContainer.addEventListener('mousedown', (e) => this.startDrag(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.endDrag());
    
    // Pinch zoom on mobile
    imgContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    imgContainer.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    imgContainer.addEventListener('touchend', () => this.handleTouchEnd());
    
    // Mouse wheel zoom
    imgContainer.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
  },
  
  attachToImages() {
    document.querySelectorAll('img[data-zoomable]').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => this.open(img));
    });
  },
  
  open(imgElement) {
    this.img = this.container.querySelector('.lightbox-image');
    this.img.src = imgElement.src;
    this.img.alt = imgElement.alt;
    
    const caption = this.container.querySelector('.lightbox-caption');
    caption.textContent = imgElement.dataset.caption || imgElement.alt || '';
    
    this.container.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    this.reset();
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  close() {
    this.container.classList.remove('active');
    document.body.style.overflow = '';
  },
  
  zoomIn() {
    this.scale = Math.min(4, this.scale * 1.25);
    this.updateTransform();
  },
  
  zoomOut() {
    this.scale = Math.max(0.5, this.scale / 1.25);
    this.updateTransform();
  },
  
  reset() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.updateTransform();
  },
  
  updateTransform() {
    if (this.img) {
      this.img.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    }
  },
  
  startDrag(e) {
    if (this.scale <= 1) return;
    this.isDragging = true;
    this.startX = e.clientX - this.translateX;
    this.startY = e.clientY - this.translateY;
    this.img.style.cursor = 'grabbing';
  },
  
  drag(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    this.translateX = e.clientX - this.startX;
    this.translateY = e.clientY - this.startY;
    this.updateTransform();
  },
  
  endDrag() {
    this.isDragging = false;
    if (this.img) {
      this.img.style.cursor = 'grab';
    }
  },
  
  handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    this.scale = Math.max(0.5, Math.min(4, this.scale * delta));
    this.updateTransform();
  },
  
  handleTouchStart(e) {
    if (e.touches.length === 2) {
      this.initialPinchDistance = this.getPinchDistance(e.touches);
      this.initialScale = this.scale;
    } else if (e.touches.length === 1 && this.scale > 1) {
      this.startDrag(e.touches[0]);
    }
  },
  
  handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 2) {
      const distance = this.getPinchDistance(e.touches);
      const scale = (distance / this.initialPinchDistance) * this.initialScale;
      this.scale = Math.max(0.5, Math.min(4, scale));
      this.updateTransform();
    } else if (e.touches.length === 1 && this.isDragging) {
      this.translateX = e.touches[0].clientX - this.startX;
      this.translateY = e.touches[0].clientY - this.startY;
      this.updateTransform();
    }
  },
  
  handleTouchEnd() {
    this.isDragging = false;
  },
  
  getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
};

window.ImageLightbox = ImageLightbox;

/**
 * Glossary Tooltip Component
 * Shows definitions on hover/click of terms
 */
const GlossaryTooltip = {
  terms: {},
  tooltip: null,
  
  init(glossaryData) {
    this.terms = glossaryData || {};
    this.createTooltip();
    this.processTerms();
  },
  
  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'glossary-tooltip';
    this.tooltip.innerHTML = `
      <div class="tooltip-header">
        <span class="tooltip-term"></span>
        <button class="tooltip-close" aria-label="Close">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="tooltip-definition"></div>
    `;
    document.body.appendChild(this.tooltip);
    
    this.tooltip.querySelector('.tooltip-close').addEventListener('click', () => this.hide());
  },
  
  processTerms() {
    document.querySelectorAll('[data-term]').forEach(el => {
      el.classList.add('glossary-term');
      el.addEventListener('mouseenter', (e) => this.show(e, el.dataset.term));
      el.addEventListener('mouseleave', () => this.hide());
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.show(e, el.dataset.term);
      });
    });
  },
  
  show(e, term) {
    const definition = this.terms[term];
    if (!definition) return;
    
    this.tooltip.querySelector('.tooltip-term').textContent = term;
    this.tooltip.querySelector('.tooltip-definition').textContent = definition;
    
    const rect = e.target.getBoundingClientRect();
    this.tooltip.style.left = `${rect.left}px`;
    this.tooltip.style.top = `${rect.bottom + 8}px`;
    this.tooltip.classList.add('active');
    
    // Check if off screen
    const tooltipRect = this.tooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth) {
      this.tooltip.style.left = `${window.innerWidth - tooltipRect.width - 16}px`;
    }
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },
  
  hide() {
    this.tooltip.classList.remove('active');
  }
};

window.GlossaryTooltip = GlossaryTooltip;

/**
 * Print Study Guide
 * Creates a printable version of lesson content
 */
const StudyGuidePrinter = {
  init() {
    document.querySelectorAll('.print-study-guide-btn').forEach(btn => {
      btn.addEventListener('click', () => this.print());
    });
  },
  
  print() {
    const content = document.querySelector('.lesson-content') || document.querySelector('main');
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Study Guide - Science Hub</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          h1 { color: #0f766e; border-bottom: 2px solid #14b8a6; padding-bottom: 10px; }
          h2 { color: #14b8a6; margin-top: 30px; }
          h3 { color: #0d9488; }
          .key-concept { background: #f0fdf4; padding: 15px; border-left: 4px solid #22c55e; margin: 15px 0; }
          .remember { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0; }
          img { max-width: 100%; height: auto; }
          .print-header { text-align: center; margin-bottom: 30px; }
          .print-logo { font-size: 24px; font-weight: bold; color: #14b8a6; }
          @media print {
            .no-print { display: none; }
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div class="print-logo">Science Hub Study Guide</div>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        ${content.innerHTML}
        <div class="no-print" style="margin-top: 40px; text-align: center;">
          <button onclick="window.print()" style="padding: 12px 24px; background: #14b8a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
            Print This Guide
          </button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
};

window.StudyGuidePrinter = StudyGuidePrinter;

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ImageLightbox.init();
    StudyGuidePrinter.init();
  });
} else {
  ImageLightbox.init();
  StudyGuidePrinter.init();
}

console.log('✓ Interactive Diagrams loaded');
