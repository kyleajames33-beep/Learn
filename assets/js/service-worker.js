/**
 * Science Learning Hub - Service Worker
 * Phase 00: Foundation
 * Strategy: Cache as you go (lazy caching)
 */

const CACHE_NAME = 'science-hub-v2';

// Assets to cache on install (critical assets only)
// Use relative paths to work on GitHub Pages subdirectory deployments
// Service worker is at /assets/js/, so paths are relative to that
const PRECACHE_ASSETS = [
  '../css/global.css',  // from /assets/js/ to /assets/css/
  './main.js',          // same directory
];

// ========================================
// INSTALL EVENT
// ========================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  // Precache critical assets
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    }).catch((err) => {
      console.error('[SW] Precache failed:', err);
    })
  );
});

// ========================================
// ACTIVATE EVENT
// ========================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients
      return self.clients.claim();
    })
  );
});

// ========================================
// FETCH EVENT
// ========================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle different resource types
  if (isCriticalAsset(request)) {
    // Network-first for CSS/JS (always get fresh code to avoid caching bugs)
    event.respondWith(networkFirst(request));
  } else if (isAsset(request)) {
    // Stale-while-revalidate for images/fonts (performance over freshness)
    event.respondWith(staleWhileRevalidate(request));
  } else if (isPage(request)) {
    // Network-first for pages (for fresh content)
    event.respondWith(networkFirst(request));
  }
});

// ========================================
// STRATEGIES
// ========================================

/**
 * Stale-while-revalidate strategy
 * Return cached version immediately, then update cache
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  // Always fetch for update
  const fetchPromise = fetch(request).then((response) => {
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  // Return cached immediately, or wait for fetch
  return cached || fetchPromise;
}

/**
 * Network-first strategy
 * Try network first, fallback to cache
 */
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.ok) {
      // Cache the fresh response
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Network failed, try cache
    const cached = await cache.match(request);
    
    if (cached) {
      console.log('[SW] Serving from cache:', request.url);
      return cached;
    }
    
    // Nothing in cache - return offline fallback
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Offline - Science Learning Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f0f9ff;
            color: #1e3a5f;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            text-align: center;
          }
          .container {
            padding: 24px;
            max-width: 400px;
          }
          h1 { font-size: 24px; margin-bottom: 16px; }
          p { color: #4a5f7a; line-height: 1.6; }
          .icon { font-size: 48px; margin-bottom: 16px; }
          button {
            background: #93e4f9;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📡</div>
          <h1>You're Offline</h1>
          <p>This page hasn't been cached yet. Connect to the internet to access it.</p>
          <button onclick="location.reload()">Try Again</button>
        </div>
      </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' },
        status: 503,
        statusText: 'Service Unavailable'
      }
    );
  }
}

// ========================================
// HELPERS
// ========================================

/**
 * Check if request is for a critical asset (CSS, JS) that should always be fresh
 */
function isCriticalAsset(request) {
  const criticalExtensions = ['.css', '.js'];
  const url = new URL(request.url);
  return criticalExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Check if request is for an asset (CSS, JS, images, fonts)
 */
function isAsset(request) {
  const assetExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf'];
  const url = new URL(request.url);
  return assetExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Check if request is for an HTML page
 */
function isPage(request) {
  const url = new URL(request.url);
  return url.pathname.endsWith('.html') || url.pathname.endsWith('/') || !url.pathname.includes('.');
}

// ========================================
// MESSAGE HANDLING (for future use)
// ========================================

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker loaded');
