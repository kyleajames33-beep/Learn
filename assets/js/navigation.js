/**
 * NAVIGATION.JS
 * Science Learning Hub - Navigation System
 *
 * Handles all navigation-related functionality:
 * - Mobile sidebar toggle
 * - Active link highlighting
 * - Smooth scrolling
 * - Search toggle
 * - Keyboard navigation
 *
 * Version: 1.0.0
 * Last updated: February 4, 2026
 */

// ============================================
// MOBILE SIDEBAR TOGGLE
// ============================================

function initSidebarToggle() {
  const sidebar = document.getElementById('lesson-sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!sidebar || !toggleBtn) return;

  // Toggle sidebar on button click
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    document.body.classList.toggle('sidebar-open');

    // Update aria-expanded
    const isOpen = sidebar.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close sidebar on overlay click (mobile)
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      document.body.classList.remove('sidebar-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // Close sidebar on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      document.body.classList.remove('sidebar-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}


// ============================================
// ACTIVE LINK HIGHLIGHTING
// ============================================

function highlightActiveLinks() {
  const currentPath = window.location.pathname;

  // Highlight active lesson in sidebar
  const lessonLinks = document.querySelectorAll('.lesson-item');
  lessonLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || link.href === window.location.href) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Highlight active nav links
  const navLinks = document.querySelectorAll('.top-nav a, .breadcrumb a');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
}


// ============================================
// SMOOTH SCROLLING
// ============================================

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Don't smooth scroll for just "#"
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Update URL without triggering navigation
        history.pushState(null, null, href);
      }
    });
  });
}


// ============================================
// SEARCH TOGGLE (for future implementation)
// ============================================

function initSearchToggle() {
  const searchInput = document.getElementById('global-search');
  const searchResults = document.getElementById('search-results');

  if (!searchInput) return;

  // Show search results on focus
  searchInput.addEventListener('focus', () => {
    if (searchResults) {
      searchResults.classList.add('visible');
    }
  });

  // Hide search results on click outside
  document.addEventListener('click', (e) => {
    if (searchResults &&
        !searchInput.contains(e.target) &&
        !searchResults.contains(e.target)) {
      searchResults.classList.remove('visible');
    }
  });

  // Clear search on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchInput === document.activeElement) {
      searchInput.value = '';
      searchInput.blur();
      if (searchResults) {
        searchResults.classList.remove('visible');
      }
    }
  });
}


// ============================================
// KEYBOARD NAVIGATION
// ============================================

function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Don't trigger if user is typing in an input
    if (e.target.matches('input, textarea, select')) return;

    switch (e.key) {
      case '/':
        // Focus search bar
        e.preventDefault();
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
          searchInput.focus();
        }
        break;

      case 'Escape':
        // Close sidebar, unfocus search
        const sidebar = document.getElementById('lesson-sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          document.body.classList.remove('sidebar-open');
        }
        if (document.activeElement.matches('input')) {
          document.activeElement.blur();
        }
        break;
    }
  });
}


// ============================================
// BREADCRUMB HELPERS
// ============================================

/**
 * Generate breadcrumb items from current path
 * @returns {Array} Array of breadcrumb objects {label, href}
 */
function generateBreadcrumbs() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(s => s);

  const breadcrumbs = [
    { label: 'Home', href: '/', icon: 'home' }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += '/' + segment;

    // Format label
    let label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    // Special formatting
    if (segment.startsWith('module-')) {
      label = 'Module ' + segment.match(/\d+/)[0];
    } else if (segment.startsWith('lesson-')) {
      label = 'Lesson ' + segment.match(/\d+/)[0];
    } else if (segment === 'hsc-biology') {
      label = 'HSC Biology';
    } else if (segment === 'hsc-chemistry') {
      label = 'HSC Chemistry';
    } else if (segment.match(/year-\d+/)) {
      label = 'Year ' + segment.match(/\d+/)[0] + ' Science';
    }

    breadcrumbs.push({
      label,
      href: currentPath,
      isLast: index === segments.length - 1
    });
  });

  return breadcrumbs;
}


// ============================================
// MOBILE MENU HELPERS
// ============================================

function isMobile() {
  return window.innerWidth <= 768;
}

function handleResize() {
  const sidebar = document.getElementById('lesson-sidebar');

  if (!sidebar) return;

  if (!isMobile()) {
    // Desktop: remove mobile classes
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
  }
}

// Listen for window resize
window.addEventListener('resize', handleResize);


// ============================================
// INITIALIZE ALL NAVIGATION
// ============================================

function initNavigation() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSidebarToggle();
      highlightActiveLinks();
      initSmoothScrolling();
      initSearchToggle();
      initKeyboardNavigation();
    });
  } else {
    // DOM is already ready
    initSidebarToggle();
    highlightActiveLinks();
    initSmoothScrolling();
    initSearchToggle();
    initKeyboardNavigation();
  }
}


// Auto-initialize
initNavigation();


// Export functions for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initSidebarToggle,
    highlightActiveLinks,
    initSmoothScrolling,
    initSearchToggle,
    initKeyboardNavigation,
    generateBreadcrumbs,
    isMobile
  };
}

console.log('✓ Navigation module loaded');
