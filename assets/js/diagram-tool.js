/**
 * Diagram Tool - Phase 0.6.2
 * Interactive diagrams with hotspots, labels, and layers
 * Version: 1.0.0
 */

const DiagramTool = {
  version: '1.0.0',
  
  // Configuration
  config: {
    minHotspotSize: 20,
    maxHotspotSize: 100,
    defaultHotspotSize: 40,
    defaultHotspotColor: '#93e4f9',
    hotspotColors: [
      { name: 'Cyan', value: '#93e4f9' },
      { name: 'Green', value: '#a7f3e0' },
      { name: 'Yellow', value: '#fde68a' },
      { name: 'Pink', value: '#fbcfe8' },
      { name: 'Purple', value: '#ddd6fe' },
      { name: 'Orange', value: '#fed7aa' },
      { name: 'Red', value: '#fecaca' },
      { name: 'Blue', value: '#bfdbfe' }
    ],
    minZoom: 0.5,
    maxZoom: 3,
    defaultZoom: 1,
    touchTargetSize: 44 // Minimum touch target size in px
  },
  
  // State
  state: {
    diagram: null,
    mode: 'view', // 'view', 'edit', 'place-hotspot'
    selectedHotspot: null,
    zoom: 1,
    pan: { x: 0, y: 0 },
    isDragging: false,
    isPanning: false,
    dragStart: { x: 0, y: 0 },
    currentLayer: null
  },
  
  // Callbacks
  callbacks: {
    onHotspotAdded: null,
    onHotspotUpdated: null,
    onHotspotRemoved: null,
    onHotspotSelected: null,
    onDiagramUpdated: null,
    onZoomChanged: null
  },
  
  /**
   * Initialize the diagram tool
   * @param {Object} options 
   */
  init(options = {}) {
    this.config = { ...this.config, ...options.config };
    this.callbacks = { ...this.callbacks, ...options.callbacks };
    
    if (options.diagram) {
      this.loadDiagram(options.diagram);
    }
    
    console.log('Diagram Tool initialized');
    return this;
  },
  
  /**
   * Create a new diagram
   * @param {Object} image - Image object from ImageManager
   * @param {string} title 
   * @returns {Object}
   */
  createDiagram(image, title = 'Untitled Diagram') {
    const diagram = {
      id: this.generateId('diagram'),
      title: title,
      image: {
        src: image.src,
        srcWebp: image.srcWebp,
        thumbnail: image.thumbnail,
        alt: image.alt,
        width: image.width,
        height: image.height
      },
      hotspots: [],
      layers: [],
      defaultZoom: this.config.defaultZoom,
      maxZoom: this.config.maxZoom,
      minZoom: this.config.minZoom
    };
    
    this.state.diagram = diagram;
    return diagram;
  },
  
  /**
   * Load an existing diagram
   * @param {Object} diagram 
   */
  loadDiagram(diagram) {
    this.state.diagram = { ...diagram };
    this.state.zoom = diagram.defaultZoom || this.config.defaultZoom;
    this.state.pan = { x: 0, y: 0 };
    this.state.selectedHotspot = null;
    return this.state.diagram;
  },
  
  /**
   * Get current diagram
   * @returns {Object|null}
   */
  getDiagram() {
    return this.state.diagram ? { ...this.state.diagram } : null;
  },
  
  /**
   * Add a hotspot
   * @param {Object} hotspotData 
   * @returns {Object}
   */
  addHotspot(hotspotData) {
    if (!this.state.diagram) {
      throw new Error('No diagram loaded');
    }
    
    const hotspot = {
      id: this.generateId('hs'),
      x: hotspotData.x || 50,
      y: hotspotData.y || 50,
      size: hotspotData.size || this.config.defaultHotspotSize,
      color: hotspotData.color || this.config.defaultHotspotColor,
      type: hotspotData.type || 'popup',
      title: hotspotData.title || '',
      content: hotspotData.content || '',
      labelText: hotspotData.labelText || '',
      labelPosition: hotspotData.labelPosition || 'right',
      detailImage: hotspotData.detailImage || null,
      layerId: hotspotData.layerId || null
    };
    
    this.state.diagram.hotspots.push(hotspot);
    
    if (this.callbacks.onHotspotAdded) {
      this.callbacks.onHotspotAdded(hotspot);
    }
    
    this.notifyUpdate();
    return hotspot;
  },
  
  /**
   * Update a hotspot
   * @param {string} hotspotId 
   * @param {Object} updates 
   */
  updateHotspot(hotspotId, updates) {
    const hotspot = this.state.diagram.hotspots.find(h => h.id === hotspotId);
    if (!hotspot) return false;
    
    Object.assign(hotspot, updates);
    
    if (this.callbacks.onHotspotUpdated) {
      this.callbacks.onHotspotUpdated(hotspot);
    }
    
    this.notifyUpdate();
    return true;
  },
  
  /**
   * Remove a hotspot
   * @param {string} hotspotId 
   */
  removeHotspot(hotspotId) {
    const index = this.state.diagram.hotspots.findIndex(h => h.id === hotspotId);
    if (index === -1) return false;
    
    const removed = this.state.diagram.hotspots.splice(index, 1)[0];
    
    // Remove from layers
    this.state.diagram.layers.forEach(layer => {
      layer.visibleHotspots = layer.visibleHotspots.filter(id => id !== hotspotId);
    });
    
    if (this.state.selectedHotspot === hotspotId) {
      this.state.selectedHotspot = null;
    }
    
    if (this.callbacks.onHotspotRemoved) {
      this.callbacks.onHotspotRemoved(removed);
    }
    
    this.notifyUpdate();
    return true;
  },
  
  /**
   * Get hotspot by ID
   * @param {string} hotspotId 
   * @returns {Object|null}
   */
  getHotspot(hotspotId) {
    return this.state.diagram.hotspots.find(h => h.id === hotspotId) || null;
  },
  
  /**
   * Select a hotspot
   * @param {string} hotspotId 
   */
  selectHotspot(hotspotId) {
    this.state.selectedHotspot = hotspotId;
    const hotspot = this.getHotspot(hotspotId);
    
    if (this.callbacks.onHotspotSelected) {
      this.callbacks.onHotspotSelected(hotspot);
    }
    
    return hotspot;
  },
  
  /**
   * Deselect current hotspot
   */
  deselectHotspot() {
    this.state.selectedHotspot = null;
    if (this.callbacks.onHotspotSelected) {
      this.callbacks.onHotspotSelected(null);
    }
  },
  
  /**
   * Add a layer
   * @param {string} name 
   * @param {Array} visibleHotspots 
   * @returns {Object}
   */
  addLayer(name, visibleHotspots = []) {
    if (!this.state.diagram) {
      throw new Error('No diagram loaded');
    }
    
    const layer = {
      id: this.generateId('layer'),
      name: name,
      visibleHotspots: visibleHotspots
    };
    
    this.state.diagram.layers.push(layer);
    this.notifyUpdate();
    return layer;
  },
  
  /**
   * Update layer
   * @param {string} layerId 
   * @param {Object} updates 
   */
  updateLayer(layerId, updates) {
    const layer = this.state.diagram.layers.find(l => l.id === layerId);
    if (!layer) return false;
    
    Object.assign(layer, updates);
    this.notifyUpdate();
    return true;
  },
  
  /**
   * Remove layer
   * @param {string} layerId 
   */
  removeLayer(layerId) {
    const index = this.state.diagram.layers.findIndex(l => l.id === layerId);
    if (index === -1) return false;
    
    this.state.diagram.layers.splice(index, 1);
    
    // Reset current layer if removed
    if (this.state.currentLayer === layerId) {
      this.state.currentLayer = null;
    }
    
    this.notifyUpdate();
    return true;
  },
  
  /**
   * Set active layer
   * @param {string} layerId 
   */
  setActiveLayer(layerId) {
    this.state.currentLayer = layerId;
  },
  
  /**
   * Get visible hotspots for current layer
   * @returns {Array}
   */
  getVisibleHotspots() {
    if (!this.state.diagram) return [];
    
    if (!this.state.currentLayer) {
      return this.state.diagram.hotspots;
    }
    
    const layer = this.state.diagram.layers.find(l => l.id === this.state.currentLayer);
    if (!layer) return this.state.diagram.hotspots;
    
    return this.state.diagram.hotspots.filter(h => 
      layer.visibleHotspots.includes(h.id)
    );
  },
  
  /**
   * Set zoom level
   * @param {number} zoom 
   */
  setZoom(zoom) {
    this.state.zoom = Math.max(
      this.state.diagram?.minZoom || this.config.minZoom,
      Math.min(this.state.diagram?.maxZoom || this.config.maxZoom, zoom)
    );
    
    if (this.callbacks.onZoomChanged) {
      this.callbacks.onZoomChanged(this.state.zoom);
    }
    
    return this.state.zoom;
  },
  
  /**
   * Zoom in
   * @param {number} delta 
   */
  zoomIn(delta = 0.25) {
    return this.setZoom(this.state.zoom + delta);
  },
  
  /**
   * Zoom out
   * @param {number} delta 
   */
  zoomOut(delta = 0.25) {
    return this.setZoom(this.state.zoom - delta);
  },
  
  /**
   * Reset zoom and pan
   */
  resetView() {
    this.state.zoom = this.state.diagram?.defaultZoom || this.config.defaultZoom;
    this.state.pan = { x: 0, y: 0 };
    
    if (this.callbacks.onZoomChanged) {
      this.callbacks.onZoomChanged(this.state.zoom);
    }
  },
  
  /**
   * Set pan position
   * @param {number} x 
   * @param {number} y 
   */
  setPan(x, y) {
    this.state.pan = { x, y };
  },
  
  /**
   * Convert screen coordinates to diagram coordinates (percentage)
   * @param {number} screenX 
   * @param {number} screenY 
   * @param {DOMRect} containerRect 
   * @returns {{x: number, y: number}}
   */
  screenToDiagramCoords(screenX, screenY, containerRect) {
    const relativeX = (screenX - containerRect.left - this.state.pan.x) / this.state.zoom;
    const relativeY = (screenY - containerRect.top - this.state.pan.y) / this.state.zoom;
    
    const x = (relativeX / containerRect.width) * 100;
    const y = (relativeY / containerRect.height) * 100;
    
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    };
  },
  
  /**
   * Convert diagram coordinates to screen coordinates
   * @param {number} diagramX - Percentage (0-100)
   * @param {number} diagramY - Percentage (0-100)
   * @param {DOMRect} containerRect 
   * @returns {{x: number, y: number}}
   */
  diagramToScreenCoords(diagramX, diagramY, containerRect) {
    const relativeX = (diagramX / 100) * containerRect.width;
    const relativeY = (diagramY / 100) * containerRect.height;
    
    return {
      x: relativeX * this.state.zoom + this.state.pan.x,
      y: relativeY * this.state.zoom + this.state.pan.y
    };
  },
  
  /**
   * Check if a point is within a hotspot
   * @param {number} x - Percentage
   * @param {number} y - Percentage
   * @param {Object} hotspot 
   * @returns {boolean}
   */
  isPointInHotspot(x, y, hotspot) {
    // Convert hotspot size from pixels to percentage (approximate)
    const sizePercent = (hotspot.size / 500) * 100; // Assume 500px base
    const radius = sizePercent / 2;
    
    const dx = x - hotspot.x;
    const dy = y - hotspot.y;
    
    return (dx * dx + dy * dy) <= (radius * radius);
  },
  
  /**
   * Find hotspot at position
   * @param {number} x - Percentage
   * @param {number} y - Percentage
   * @returns {Object|null}
   */
  findHotspotAt(x, y) {
    const hotspots = this.getVisibleHotspots();
    // Check in reverse order (top to bottom)
    for (let i = hotspots.length - 1; i >= 0; i--) {
      if (this.isPointInHotspot(x, y, hotspots[i])) {
        return hotspots[i];
      }
    }
    return null;
  },
  
  /**
   * Start dragging a hotspot
   * @param {string} hotspotId 
   * @param {number} startX 
   * @param {number} startY 
   */
  startDrag(hotspotId, startX, startY) {
    this.state.isDragging = true;
    this.state.selectedHotspot = hotspotId;
    this.state.dragStart = { x: startX, y: startY };
  },
  
  /**
   * Update drag position
   * @param {number} x - Percentage
   * @param {number} y - Percentage
   */
  updateDrag(x, y) {
    if (!this.state.isDragging || !this.state.selectedHotspot) return;
    
    this.updateHotspot(this.state.selectedHotspot, { x, y });
  },
  
  /**
   * End dragging
   */
  endDrag() {
    this.state.isDragging = false;
  },
  
  /**
   * Start panning
   * @param {number} startX 
   * @param {number} startY 
   */
  startPan(startX, startY) {
    this.state.isPanning = true;
    this.state.dragStart = { x: startX, y: startY };
  },
  
  /**
   * Update pan position
   * @param {number} currentX 
   * @param {number} currentY 
   */
  updatePan(currentX, currentY) {
    if (!this.state.isPanning) return;
    
    const dx = currentX - this.state.dragStart.x;
    const dy = currentY - this.state.dragStart.y;
    
    this.state.pan.x += dx;
    this.state.pan.y += dy;
    this.state.dragStart = { x: currentX, y: currentY };
  },
  
  /**
   * End panning
   */
  endPan() {
    this.state.isPanning = false;
  },
  
  /**
   * Notify diagram updated
   */
  notifyUpdate() {
    if (this.callbacks.onDiagramUpdated) {
      this.callbacks.onDiagramUpdated(this.getDiagram());
    }
  },
  
  /**
   * Render diagram for builder (edit mode)
   * @param {HTMLElement} container 
   */
  renderBuilder(container) {
    if (!this.state.diagram) {
      container.innerHTML = '<p class="diagram-placeholder">No diagram loaded</p>';
      return;
    }
    
    const diagram = this.state.diagram;
    const hotspots = this.getVisibleHotspots();
    
    container.innerHTML = `
      <div class="diagram-builder" data-diagram-id="${diagram.id}">
        <div class="diagram-canvas-container">
          <div class="diagram-canvas" 
               style="transform: translate(${this.state.pan.x}px, ${this.state.pan.y}px) scale(${this.state.zoom});">
            <img src="${diagram.image.src}" 
                 alt="${diagram.image.alt}" 
                 class="diagram-image"
                 draggable="false">
            ${hotspots.map(h => this.renderHotspot(h, 'builder')).join('')}
          </div>
        </div>
        
        <div class="diagram-toolbar">
          <button class="diagram-btn" data-action="zoom-in" title="Zoom In">
            <i data-lucide="zoom-in"></i>
          </button>
          <button class="diagram-btn" data-action="zoom-out" title="Zoom Out">
            <i data-lucide="zoom-out"></i>
          </button>
          <button class="diagram-btn" data-action="reset" title="Reset View">
            <i data-lucide="maximize-2"></i>
          </button>
          <span class="diagram-zoom-level">${Math.round(this.state.zoom * 100)}%</span>
        </div>
      </div>
    `;
    
    this.bindBuilderEvents(container);
  },
  
  /**
   * Render a hotspot
   * @param {Object} hotspot 
   * @param {string} mode 
   * @returns {string}
   */
  renderHotspot(hotspot, mode = 'view') {
    const isSelected = this.state.selectedHotspot === hotspot.id;
    const size = Math.max(this.config.touchTargetSize, hotspot.size);
    
    return `
      <div class="diagram-hotspot ${isSelected ? 'selected' : ''} ${mode === 'builder' ? 'editable' : ''}"
           data-hotspot-id="${hotspot.id}"
           style="left: ${hotspot.x}%; top: ${hotspot.y}%; 
                  width: ${size}px; height: ${size}px;
                  margin-left: -${size/2}px; margin-top: -${size/2}px;
                  background-color: ${hotspot.color};">
        ${mode === 'view' ? `<div class="hotspot-pulse" style="background-color: ${hotspot.color}"></div>` : ''}
        ${mode === 'builder' && isSelected ? `
          <div class="hotspot-handle" data-handle="resize"></div>
        ` : ''}
      </div>
    `;
  },
  
  /**
   * Bind builder events
   * @param {HTMLElement} container 
   */
  bindBuilderEvents(container) {
    const canvas = container.querySelector('.diagram-canvas');
    const canvasContainer = container.querySelector('.diagram-canvas-container');
    
    // Toolbar buttons
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        switch (action) {
          case 'zoom-in': this.zoomIn(); break;
          case 'zoom-out': this.zoomOut(); break;
          case 'reset': this.resetView(); break;
        }
        this.renderBuilder(container);
      });
    });
    
    // Canvas click for adding/selecting hotspots
    canvasContainer.addEventListener('click', (e) => {
      if (e.target === canvas || e.target.classList.contains('diagram-image')) {
        const rect = canvasContainer.getBoundingClientRect();
        const coords = this.screenToDiagramCoords(e.clientX, e.clientY, rect);
        
        // Check if clicked on existing hotspot
        const clickedHotspot = this.findHotspotAt(coords.x, coords.y);
        
        if (clickedHotspot) {
          this.selectHotspot(clickedHotspot.id);
        } else {
          this.deselectHotspot();
        }
        
        this.renderBuilder(container);
      }
    });
    
    // Hotspot drag
    canvasContainer.addEventListener('mousedown', (e) => {
      const hotspotEl = e.target.closest('.diagram-hotspot');
      if (hotspotEl) {
        e.preventDefault();
        const hotspotId = hotspotEl.dataset.hotspotId;
        this.startDrag(hotspotId, e.clientX, e.clientY);
      }
    });
    
    window.addEventListener('mousemove', (e) => {
      if (this.state.isDragging) {
        const rect = canvasContainer.getBoundingClientRect();
        const coords = this.screenToDiagramCoords(e.clientX, e.clientY, rect);
        this.updateDrag(coords.x, coords.y);
        
        // Update hotspot position in DOM
        const hotspotEl = canvas.querySelector(`[data-hotspot-id="${this.state.selectedHotspot}"]`);
        if (hotspotEl) {
          const hotspot = this.getHotspot(this.state.selectedHotspot);
          hotspotEl.style.left = `${hotspot.x}%`;
          hotspotEl.style.top = `${hotspot.y}%`;
        }
      }
    });
    
    window.addEventListener('mouseup', () => {
      this.endDrag();
    });
  },
  
  /**
   * Render diagram for student view
   * @param {Object} diagram 
   * @returns {string}
   */
  renderStudentView(diagram) {
    const hotspots = diagram.hotspots || [];
    
    return `
      <div class="diagram-viewer" data-diagram-id="${diagram.id}">
        <div class="diagram-canvas-container">
          <div class="diagram-canvas" 
               style="transform: scale(${diagram.defaultZoom || 1});">
            <img src="${diagram.image.src}" 
                 alt="${diagram.image.alt}" 
                 class="diagram-image">
            ${hotspots.map(h => this.renderHotspotForStudent(h)).join('')}
          </div>
        </div>
        
        <div class="diagram-controls">
          <button class="diagram-btn" data-action="zoom-in" aria-label="Zoom in">
            <i data-lucide="plus"></i>
          </button>
          <button class="diagram-btn" data-action="zoom-out" aria-label="Zoom out">
            <i data-lucide="minus"></i>
          </button>
          <button class="diagram-btn" data-action="reset" aria-label="Reset view">
            <i data-lucide="maximize-2"></i>
          </button>
        </div>
        
        ${diagram.layers?.length > 0 ? `
          <div class="diagram-layers">
            ${diagram.layers.map(layer => `
              <button class="diagram-layer-btn" data-layer="${layer.id}">
                ${layer.name}
              </button>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="diagram-popup" id="diagram-popup-${diagram.id}" style="display: none;">
          <div class="diagram-popup-content">
            <button class="diagram-popup-close" aria-label="Close">
              <i data-lucide="x"></i>
            </button>
            <h4 class="diagram-popup-title"></h4>
            <div class="diagram-popup-body"></div>
          </div>
        </div>
      </div>
    `;
  },
  
  /**
   * Render hotspot for student view
   * @param {Object} hotspot 
   * @returns {string}
   */
  renderHotspotForStudent(hotspot) {
    const size = Math.max(this.config.touchTargetSize, hotspot.size);
    
    return `
      <button class="diagram-hotspot"
              data-hotspot-id="${hotspot.id}"
              data-hotspot-type="${hotspot.type}"
              style="left: ${hotspot.x}%; top: ${hotspot.y}%; 
                     width: ${size}px; height: ${size}px;
                     margin-left: -${size/2}px; margin-top: -${size/2}px;
                     background-color: ${hotspot.color};"
              aria-label="${hotspot.title || 'Hotspot'}"
              tabindex="0">
        <div class="hotspot-pulse" style="background-color: ${hotspot.color}"></div>
      </button>
    `;
  },
  
  /**
   * Bind student view events
   * @param {HTMLElement} container 
   */
  bindStudentView(container) {
    const popup = container.querySelector('.diagram-popup');
    const popupTitle = popup?.querySelector('.diagram-popup-title');
    const popupBody = popup?.querySelector('.diagram-popup-body');
    
    // Hotspot clicks
    container.querySelectorAll('.diagram-hotspot').forEach(hotspot => {
      hotspot.addEventListener('click', (e) => {
        e.stopPropagation();
        const hotspotId = e.currentTarget.dataset.hotspotId;
        const diagramId = container.dataset.diagramId;
        const diagram = this.state.diagram;
        
        if (!diagram) return;
        
        const hotspotData = diagram.hotspots.find(h => h.id === hotspotId);
        if (!hotspotData) return;
        
        if (hotspotData.type === 'popup') {
          popupTitle.textContent = hotspotData.title;
          popupBody.innerHTML = `
            ${hotspotData.detailImage ? `<img src="${hotspotData.detailImage}" alt="${hotspotData.title}" class="diagram-popup-image">` : ''}
            <p>${hotspotData.content}</p>
          `;
          popup.style.display = 'block';
        } else if (hotspotData.type === 'label') {
          // Show label
          const label = document.createElement('div');
          label.className = 'diagram-label';
          label.textContent = hotspotData.labelText;
          label.style.cssText = `
            position: absolute;
            left: ${hotspotData.x}%;
            top: ${hotspotData.y}%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 10;
          `;
          container.querySelector('.diagram-canvas').appendChild(label);
          
          setTimeout(() => label.remove(), 3000);
        }
      });
    });
    
    // Close popup
    popup?.querySelector('.diagram-popup-close')?.addEventListener('click', () => {
      popup.style.display = 'none';
    });
    
    // Close on outside click
    popup?.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.style.display = 'none';
      }
    });
  },
  
  /**
   * Export diagram data
   * @returns {Object}
   */
  export() {
    if (!this.state.diagram) return null;
    
    return {
      type: 'diagram',
      ...this.state.diagram
    };
  },
  
  /**
   * Generate unique ID
   * @param {string} prefix 
   * @returns {string}
   */
  generateId(prefix = 'item') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Export for both module and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DiagramTool };
}
