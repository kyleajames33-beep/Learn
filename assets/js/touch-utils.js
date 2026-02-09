/**
 * Touch Event Utilities
 * Mobile-first touch handling with 300ms delay prevention
 * Phase A: Infrastructure
 * Version: 1.0.0
 */

const TouchUtils = {
  version: '1.0.0',
  
  /**
   * Bind both click and touchstart to element
   * Prevents 300ms delay on mobile browsers
   * @param {Element} element 
   * @param {Function} handler 
   * @param {Object} options
   */
  bindTap(element, handler, options = {}) {
    if (!element || typeof handler !== 'function') return;
    
    let touched = false;
    const preventDouble = options.preventDouble !== false;
    const doubleTapDelay = options.doubleTapDelay || 300;
    
    const touchHandler = (e) => {
      touched = true;
      handler(e);
      
      // Reset touch flag after delay
      if (preventDouble) {
        setTimeout(() => { touched = false; }, doubleTapDelay);
      }
    };
    
    const clickHandler = (e) => {
      // Ignore click if it was triggered by touch
      if (touched) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      handler(e);
    };
    
    // Touch events (mobile)
    element.addEventListener('touchstart', touchHandler, { passive: true });
    
    // Click events (desktop/fallback)
    element.addEventListener('click', clickHandler);
    
    // Return cleanup function
    return () => {
      element.removeEventListener('touchstart', touchHandler);
      element.removeEventListener('click', clickHandler);
    };
  },
  
  /**
   * Enhanced drag handling with touch support
   * @param {Element} element - Draggable element
   * @param {Object} callbacks - { onStart, onMove, onEnd }
   */
  makeDraggable(element, callbacks = {}) {
    if (!element) return;
    
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    const onStart = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      startX = clientX;
      startY = clientY;
      initialX = element.offsetLeft;
      initialY = element.offsetTop;
      
      element.style.zIndex = '1000';
      element.classList.add('dragging');
      
      if (callbacks.onStart) callbacks.onStart(e, { x: initialX, y: initialY });
    };
    
    const onMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const dx = clientX - startX;
      const dy = clientY - startY;
      
      element.style.left = `${initialX + dx}px`;
      element.style.top = `${initialY + dy}px`;
      
      if (callbacks.onMove) callbacks.onMove(e, { x: initialX + dx, y: initialY + dy, dx, dy });
    };
    
    const onEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      
      element.style.zIndex = '';
      element.classList.remove('dragging');
      
      if (callbacks.onEnd) callbacks.onEnd(e);
    };
    
    // Touch events
    element.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
    
    // Mouse events
    element.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    
    // Cleanup function
    return () => {
      element.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      element.removeEventListener('mousedown', onStart);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
    };
  },
  
  /**
   * Check if device is touch-capable
   * @returns {boolean}
   */
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  /**
   * Add touch-specific CSS classes to document
   */
  initTouchDetection() {
    if (this.isTouchDevice()) {
      document.documentElement.classList.add('touch-device');
    } else {
      document.documentElement.classList.add('no-touch');
    }
  },
  
  /**
   * Prevent double-tap zoom on buttons
   * @param {Element} element
   */
  preventDoubleTapZoom(element) {
    if (!element) return;
    
    let lastTouchEnd = 0;
    element.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
  }
};

// Auto-init touch detection
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TouchUtils.initTouchDetection());
  } else {
    TouchUtils.initTouchDetection();
  }
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TouchUtils };
}
