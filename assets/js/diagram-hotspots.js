/**
 * Diagram Hotspot System
 * Interactive overlays for labeling activities
 * Phase A: Infrastructure
 * Version: 1.0.0
 */

const DiagramHotspots = {
  version: '1.0.0',
  
  // Registry of active instances
  instances: new Map(),
  
  /**
   * Create hotspot overlay on diagram
   * @param {string} containerId - ID of container element
   * @param {Object} config - Configuration object
   */
  create(containerId, config = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container #${containerId} not found`);
      return null;
    }
    
    const instance = {
      id: containerId,
      hotspots: config.hotspots || [],
      identified: new Set(),
      onIdentify: config.onIdentify || (() => {}),
      imageSrc: config.imageSrc || '',
      alt: config.alt || 'Diagram'
    };
    
    this.instances.set(containerId, instance);
    this.render(container, instance);
    this.bindEvents(container, instance);
    
    return instance;
  },
  
  /**
   * Render the diagram with hotspot overlays
   */
  render(container, instance) {
    const { hotspots, imageSrc, alt } = instance;
    
    container.innerHTML = `
      <div class="diagram-hotspot-container" style="position: relative; display: inline-block; max-width: 100%;">
        <img src="${imageSrc}" alt="${alt}" class="diagram-base-image" style="width: 100%; height: auto; display: block;">
        <svg class="hotspot-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;" viewBox="0 0 100 100" preserveAspectRatio="none">
          ${hotspots.map((h, i) => `
            <circle class="hotspot-marker" 
                    data-hotspot-id="${h.id}" 
                    cx="${h.x}" cy="${h.y}" r="3"
                    style="pointer-events: auto; cursor: pointer; fill: #3b82f6; stroke: white; stroke-width: 0.5; filter: drop-shadow(0 0 3px rgba(59,130,246,0.5));"
                    tabindex="0"
                    role="button"
                    aria-label="Hotspot: ${h.label}"
                    aria-pressed="false">
              <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
            </circle>
          `).join('')}
        </svg>
        <div class="hotspot-progress" style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); color: white; padding: 8px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">
          <span class="identified-count">0</span>/${hotspots.length} identified
        </div>
      </div>
    `;
  },
  
  /**
   * Bind click/touch events to hotspots
   */
  bindEvents(container, instance) {
    const markers = container.querySelectorAll('.hotspot-marker');
    
    markers.forEach(marker => {
      // Click handler
      marker.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openHotspotModal(instance, marker.dataset.hotspotId);
      });
      
      // Touch handler (prevent 300ms delay)
      marker.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.openHotspotModal(instance, marker.dataset.hotspotId);
      }, { passive: false });
      
      // Keyboard handler
      marker.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openHotspotModal(instance, marker.dataset.hotspotId);
        }
      });
    });
  },
  
  /**
   * Open modal for hotspot identification
   */
  openHotspotModal(instance, hotspotId) {
    const hotspot = instance.hotspots.find(h => h.id === hotspotId);
    if (!hotspot) return;
    
    const isIdentified = instance.identified.has(hotspotId);
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'hotspot-modal';
    modal.innerHTML = `
      <div class="hotspot-modal-backdrop" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px;">
        <div class="hotspot-modal-content" style="background: white; border-radius: 12px; max-width: 400px; width: 100%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.2);" role="dialog" aria-labelledby="hotspot-title" aria-modal="true">
          <div style="padding: 20px;">
            <h3 id="hotspot-title" style="margin: 0 0 12px 0; color: #1e3a5f; font-size: 20px;">${hotspot.label}</h3>
            <p style="margin: 0 0 16px 0; color: #4a5f7a; line-height: 1.6;">${hotspot.description}</p>
            ${hotspot.hint ? `<div class="hotspot-hint" style="background: #f0f9ff; border-left: 4px solid #93e4f9; padding: 12px; margin-bottom: 16px; border-radius: 0 8px 8px 0;">
              <strong style="color: #1e3a5f;">Hint:</strong> ${hotspot.hint}
            </div>` : ''}
            <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 12px; background: #f8fafc; border-radius: 8px; margin-bottom: 16px;">
              <input type="checkbox" class="identify-checkbox" ${isIdentified ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: #10b981;">
              <span style="font-weight: 500; color: #1e3a5f;">Mark as Identified</span>
            </label>
            <button class="close-modal-btn" style="width: 100%; padding: 12px; background: #1e3a5f; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; touch-action: manipulation;">
              ${isIdentified ? 'Update' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus trap
    const checkbox = modal.querySelector('.identify-checkbox');
    const closeBtn = modal.querySelector('.close-modal-btn');
    checkbox.focus();
    
    // Close handlers
    const closeModal = () => {
      const isNowIdentified = checkbox.checked;
      
      if (isNowIdentified && !isIdentified) {
        this.markIdentified(instance, hotspotId);
      } else if (!isNowIdentified && isIdentified) {
        this.unmarkIdentified(instance, hotspotId);
      }
      
      modal.remove();
    };
    
    closeBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      closeModal();
    }, { passive: false });
    
    // Backdrop click to close
    modal.querySelector('.hotspot-modal-backdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
    
    // Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  },
  
  /**
   * Mark hotspot as identified
   */
  markIdentified(instance, hotspotId) {
    instance.identified.add(hotspotId);
    this.updateVisualState(instance, hotspotId, true);
    this.updateProgress(instance);
    instance.onIdentify(hotspotId, instance.identified.size);
  },
  
  /**
   * Unmark hotspot
   */
  unmarkIdentified(instance, hotspotId) {
    instance.identified.delete(hotspotId);
    this.updateVisualState(instance, hotspotId, false);
    this.updateProgress(instance);
  },
  
  /**
   * Update visual state of hotspot marker
   */
  updateVisualState(instance, hotspotId, identified) {
    const container = document.getElementById(instance.id);
    if (!container) return;
    
    const marker = container.querySelector(`[data-hotspot-id="${hotspotId}"]`);
    if (!marker) return;
    
    if (identified) {
      marker.style.fill = '#10b981'; // Green
      marker.style.filter = 'drop-shadow(0 0 5px rgba(16,185,129,0.6))';
      marker.setAttribute('aria-pressed', 'true');
      // Stop pulsing animation
      const animate = marker.querySelector('animate');
      if (animate) animate.remove();
    } else {
      marker.style.fill = '#3b82f6'; // Blue
      marker.style.filter = 'drop-shadow(0 0 3px rgba(59,130,246,0.5))';
      marker.setAttribute('aria-pressed', 'false');
    }
  },
  
  /**
   * Update progress counter
   */
  updateProgress(instance) {
    const container = document.getElementById(instance.id);
    if (!container) return;
    
    const countEl = container.querySelector('.identified-count');
    if (countEl) {
      countEl.textContent = instance.identified.size;
    }
  },
  
  /**
   * Get identified hotspots for saving
   */
  getIdentified(containerId) {
    const instance = this.instances.get(containerId);
    return instance ? Array.from(instance.identified) : [];
  },
  
  /**
   * Restore identified hotspots from saved state
   */
  restore(containerId, identifiedIds) {
    const instance = this.instances.get(containerId);
    if (!instance) return;
    
    identifiedIds.forEach(id => {
      instance.identified.add(id);
      this.updateVisualState(instance, id, true);
    });
    this.updateProgress(instance);
  },
  
  /**
   * Check if all hotspots identified
   */
  isComplete(containerId) {
    const instance = this.instances.get(containerId);
    if (!instance) return false;
    return instance.identified.size === instance.hotspots.length;
  }
};

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DiagramHotspots };
}
