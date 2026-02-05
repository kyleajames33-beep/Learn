/*
 * Science Learning Hub - Search Functionality
 *
 * Handles search across all lessons and modules
 * Version: 1.0.0
 * Last updated: February 4, 2026
 */

// Search index will be populated by each page or loaded from a JSON file
let searchIndex = [];


/**
 * Initialize search functionality
 */
function initSearch() {
  const searchInput = document.getElementById('global-search');
  if (!searchInput) return;

  // Set up search input handler with debounce
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  });

  // Handle search on Enter key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(searchInput.value);
    }
  });

  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer && !searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.style.display = 'none';
    }
  });

  // Show results when focusing on search
  searchInput.addEventListener('focus', () => {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer && searchInput.value.trim()) {
      resultsContainer.style.display = 'block';
    }
  });
}


/**
 * Perform search and display results
 * @param {string} query - Search query
 */
function performSearch(query) {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    hideSearchResults();
    return;
  }

  const results = search(trimmedQuery);
  displaySearchResults(results, trimmedQuery);
}


/**
 * Search through the index
 * @param {string} query - Search query
 * @returns {Array} Array of matching results
 */
function search(query) {
  const lowercaseQuery = query.toLowerCase();
  const words = lowercaseQuery.split(/\s+/);

  return searchIndex.filter(item => {
    // Check title match
    const titleMatch = item.title.toLowerCase().includes(lowercaseQuery);

    // Check keyword match
    const keywordMatch = item.keywords && item.keywords.some(keyword =>
      keyword.toLowerCase().includes(lowercaseQuery)
    );

    // Check module name match
    const moduleMatch = item.moduleName && item.moduleName.toLowerCase().includes(lowercaseQuery);

    // Check if all words are found somewhere
    const allWordsMatch = words.every(word =>
      item.title.toLowerCase().includes(word) ||
      (item.keywords && item.keywords.some(k => k.toLowerCase().includes(word))) ||
      (item.moduleName && item.moduleName.toLowerCase().includes(word))
    );

    return titleMatch || keywordMatch || moduleMatch || allWordsMatch;
  }).slice(0, 10); // Limit to 10 results
}


/**
 * Display search results
 * @param {Array} results - Array of search results
 * @param {string} query - Original search query
 */
function displaySearchResults(results, query) {
  let resultsContainer = document.getElementById('search-results');

  // Create results container if it doesn't exist
  if (!resultsContainer) {
    resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results';
    resultsContainer.className = 'search-results-container';

    const searchInput = document.getElementById('global-search');
    if (searchInput && searchInput.parentElement) {
      searchInput.parentElement.appendChild(resultsContainer);
    }
  }

  // Clear previous results
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="search-no-results">
        <p>No results found for "${escapeHtml(query)}"</p>
      </div>
    `;
  } else {
    resultsContainer.innerHTML = `
      <div class="search-results-header">
        <span>${results.length} result${results.length !== 1 ? 's' : ''} found</span>
      </div>
      ${results.map(result => createSearchResultHTML(result, query)).join('')}
    `;
  }

  resultsContainer.style.display = 'block';
}


/**
 * Create HTML for a single search result
 * @param {Object} result - Search result object
 * @param {string} query - Search query for highlighting
 * @returns {string} HTML string
 */
function createSearchResultHTML(result, query) {
  const highlightedTitle = highlightMatch(result.title, query);

  return `
    <a href="${result.url}" class="search-result-item">
      <div class="result-header">
        <span class="result-badge ${getBadgeClass(result.yearLevel)}">${formatYearLevel(result.yearLevel)}</span>
        <span class="result-lesson-number">Lesson ${result.lessonNumber}</span>
      </div>
      <div class="result-title">${highlightedTitle}</div>
      <div class="result-meta">${escapeHtml(result.moduleName)}</div>
    </a>
  `;
}


/**
 * Highlight matching text in search results
 * @param {string} text - Text to highlight
 * @param {string} query - Query to highlight
 * @returns {string} HTML string with highlights
 */
function highlightMatch(text, query) {
  const escapedText = escapeHtml(text);
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return escapedText.replace(regex, '<mark>$1</mark>');
}


/**
 * Hide search results
 */
function hideSearchResults() {
  const resultsContainer = document.getElementById('search-results');
  if (resultsContainer) {
    resultsContainer.style.display = 'none';
  }
}


/**
 * Get badge class based on year level
 * @param {string} yearLevel - Year level identifier
 * @returns {string} CSS class name
 */
function getBadgeClass(yearLevel) {
  if (yearLevel.includes('hsc-biology')) return 'badge-biology';
  if (yearLevel.includes('hsc-chemistry')) return 'badge-chemistry';
  if (yearLevel.includes('year-8')) return 'badge-year8';
  if (yearLevel.includes('year-9')) return 'badge-year9';
  return 'badge-default';
}


/**
 * Format year level for display
 * @param {string} yearLevel - Year level identifier
 * @returns {string} Formatted year level
 */
function formatYearLevel(yearLevel) {
  const formats = {
    'hsc-biology': 'HSC Biology',
    'hsc-chemistry': 'HSC Chemistry',
    'year-7': 'Year 7',
    'year-8': 'Year 8',
    'year-9': 'Year 9',
    'year-10': 'Year 10'
  };
  return formats[yearLevel] || yearLevel;
}


/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


/**
 * Escape regex special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


/**
 * Load search index from JSON file
 * @param {string} url - URL to search index JSON
 */
async function loadSearchIndex(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load search index');

    searchIndex = await response.json();
    console.log(`Search index loaded: ${searchIndex.length} items`);
  } catch (error) {
    console.error('Error loading search index:', error);
  }
}


/**
 * Add a lesson to the search index
 * @param {Object} lesson - Lesson object
 */
function addToSearchIndex(lesson) {
  searchIndex.push(lesson);
}


/**
 * Build search index from current page lessons
 * Useful for module overview pages
 */
function buildSearchIndexFromPage() {
  const lessonItems = document.querySelectorAll('[data-lesson]');
  const yearLevel = document.querySelector('main')?.dataset.yearLevel;
  const module = document.querySelector('main')?.dataset.module;
  const moduleName = document.querySelector('.module-title')?.textContent;

  lessonItems.forEach((item, index) => {
    const lesson = item.dataset.lesson;
    const title = item.querySelector('.lesson-title')?.textContent || '';
    const href = item.getAttribute('href');

    if (lesson && title && href) {
      addToSearchIndex({
        yearLevel,
        module,
        moduleName,
        lesson,
        lessonNumber: index + 1,
        title,
        keywords: title.toLowerCase().split(/\s+/),
        url: href
      });
    }
  });
}


/**
 * Add search result styles
 */
function addSearchStyles() {
  if (document.getElementById('search-styles')) return;

  const style = document.createElement('style');
  style.id = 'search-styles';
  style.textContent = `
    .search-results-container {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      margin-top: 8px;
    }

    .search-results-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-light);
      font-size: var(--text-sm);
      color: var(--text-muted);
      font-weight: var(--weight-medium);
    }

    .search-result-item {
      display: block;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-light);
      text-decoration: none;
      transition: background-color 0.2s ease;
    }

    .search-result-item:last-child {
      border-bottom: none;
    }

    .search-result-item:hover {
      background-color: var(--bg-elevated);
      text-decoration: none;
    }

    .result-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }

    .result-badge {
      font-size: var(--text-xs);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      font-weight: var(--weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-biology {
      background-color: var(--secondary-light);
      color: var(--text-primary);
    }

    .badge-chemistry {
      background-color: var(--accent-light);
      color: var(--text-primary);
    }

    .badge-year8, .badge-year9 {
      background-color: var(--primary-light);
      color: var(--text-primary);
    }

    .badge-default {
      background-color: var(--bg-elevated);
      color: var(--text-muted);
    }

    .result-lesson-number {
      font-size: var(--text-xs);
      color: var(--text-muted);
    }

    .result-title {
      font-size: var(--text-base);
      font-weight: var(--weight-medium);
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .result-title mark {
      background-color: var(--warning);
      color: var(--text-primary);
      padding: 2px 4px;
      border-radius: 3px;
    }

    .result-meta {
      font-size: var(--text-sm);
      color: var(--text-muted);
    }

    .search-no-results {
      padding: 24px 16px;
      text-align: center;
      color: var(--text-muted);
    }

    .nav-search {
      position: relative;
    }

    @media (max-width: 767px) {
      .search-results-container {
        position: fixed;
        top: 60px;
        left: 16px;
        right: 16px;
        max-height: calc(100vh - 80px);
      }
    }
  `;
  document.head.appendChild(style);
}


// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    addSearchStyles();
  });
} else {
  initSearch();
  addSearchStyles();
}


// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initSearch,
    search,
    loadSearchIndex,
    addToSearchIndex,
    buildSearchIndexFromPage
  };
}
