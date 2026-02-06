/**
 * Science Learning Hub - Event Bus
 * Phase 0.1: Gamification Consolidation
 * 
 * Centralized pub/sub system for decoupled communication
 * between gamification subsystems and UI components.
 */

const EventBus = (function() {
  'use strict';

  // Private subscribers store
  // Map<eventName, Set<callback>>
  const subscribers = new Map();

  // Error boundary to prevent one failed callback from breaking others
  function safeExecute(callback, data, eventName) {
    try {
      callback(data);
    } catch (error) {
      console.error(`[EventBus] Error in subscriber for "${eventName}":`, error);
      // Continue to next subscriber - don't let one failure break the chain
    }
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Event to listen for
   * @param {Function} callback - Function to call when event fires
   * @returns {Function} Unsubscribe function
   */
  function on(eventName, callback) {
    if (typeof eventName !== 'string' || !eventName) {
      console.warn('[EventBus] Invalid event name:', eventName);
      return () => {}; // No-op unsubscribe
    }

    if (typeof callback !== 'function') {
      console.warn('[EventBus] Callback must be a function');
      return () => {}; // No-op unsubscribe
    }

    if (!subscribers.has(eventName)) {
      subscribers.set(eventName, new Set());
    }

    subscribers.get(eventName).add(callback);

    // Return unsubscribe function
    return function off() {
      const eventSubscribers = subscribers.get(eventName);
      if (eventSubscribers) {
        eventSubscribers.delete(callback);
        // Clean up empty sets to prevent memory leaks
        if (eventSubscribers.size === 0) {
          subscribers.delete(eventName);
        }
      }
    };
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Event to unsubscribe from
   * @param {Function} callback - Original callback function
   */
  function off(eventName, callback) {
    if (typeof eventName !== 'string' || typeof callback !== 'function') {
      return;
    }

    const eventSubscribers = subscribers.get(eventName);
    if (eventSubscribers) {
      eventSubscribers.delete(callback);
      if (eventSubscribers.size === 0) {
        subscribers.delete(eventName);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   * @param {string} eventName - Event to emit
   * @param {*} data - Data to pass to subscribers
   * @returns {number} Number of subscribers notified
   */
  function emit(eventName, data) {
    if (typeof eventName !== 'string' || !eventName) {
      console.warn('[EventBus] Cannot emit invalid event name:', eventName);
      return 0;
    }

    const eventSubscribers = subscribers.get(eventName);
    if (!eventSubscribers || eventSubscribers.size === 0) {
      // No subscribers - this is fine, just return 0
      return 0;
    }

    // Create an immutable copy of data to prevent mutation issues
    const immutableData = data !== undefined ? JSON.parse(JSON.stringify(data)) : undefined;

    let notifiedCount = 0;
    eventSubscribers.forEach(callback => {
      safeExecute(callback, immutableData, eventName);
      notifiedCount++;
    });

    // Debug logging in development
    if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
      console.log(`[EventBus] "${eventName}" → ${notifiedCount} subscriber(s)`, immutableData);
    }

    return notifiedCount;
  }

  /**
   * Subscribe to an event but only receive it once
   * @param {string} eventName - Event to listen for
   * @param {Function} callback - Function to call once
   */
  function once(eventName, callback) {
    const unsubscribe = on(eventName, (data) => {
      unsubscribe();
      callback(data);
    });
    return unsubscribe;
  }

  /**
   * Get count of subscribers for an event
   * @param {string} eventName - Event to check
   * @returns {number} Subscriber count
   */
  function subscriberCount(eventName) {
    if (!eventName) {
      // Return total across all events
      let total = 0;
      subscribers.forEach(set => total += set.size);
      return total;
    }
    const eventSubscribers = subscribers.get(eventName);
    return eventSubscribers ? eventSubscribers.size : 0;
  }

  /**
   * Clear all subscribers (useful for testing)
   */
  function clear() {
    subscribers.clear();
    console.log('[EventBus] All subscribers cleared');
  }

  /**
   * List all active event names
   * @returns {string[]} Array of event names with subscribers
   */
  function listEvents() {
    return Array.from(subscribers.keys());
  }

  // Public API
  return {
    on,
    off,
    emit,
    once,
    subscriberCount,
    clear,
    listEvents
  };
})();

// Expose to global scope for legacy compatibility
window.EventBus = EventBus;

console.log('✓ EventBus loaded - Pub/Sub system ready');
