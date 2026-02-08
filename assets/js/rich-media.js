/**
 * Rich Media - Phase 0.6.4
 * Video embeds, iframes, and external simulations
 * Version: 1.0.0
 */

const RichMedia = {
  version: '1.0.0',
  
  // Whitelisted providers for security
  providers: {
    youtube: {
      name: 'YouTube',
      pattern: /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      embedUrl: 'https://www.youtube.com/embed/{id}',
      thumbnailUrl: 'https://img.youtube.com/vi/{id}/mqdefault.jpg',
      allowFullscreen: true
    },
    vimeo: {
      name: 'Vimeo',
      pattern: /vimeo\.com\/(\d+)/,
      embedUrl: 'https://player.vimeo.com/video/{id}',
      allowFullscreen: true
    },
    phet: {
      name: 'PhET Interactive Simulations',
      pattern: /phet\.colorado\.edu/,
      allowFullscreen: true,
      trusted: true
    },
    biointeractive: {
      name: 'BioInteractive',
      pattern: /biointeractive\.org/,
      allowFullscreen: true,
      trusted: true
    },
    learn genetics: {
      name: 'Learn Genetics (Utah)',
      pattern: /learn\.genetics\.utah\.edu/,
      allowFullscreen: true,
      trusted: true
    },
    cellsalive: {
      name: 'Cells Alive',
      pattern: /cellsalive\.com/,
      allowFullscreen: true,
      trusted: true
    }
  },
  
  /**
   * Parse a URL to determine provider and extract ID
   * @param {string} url 
   * @returns {Object|null}
   */
  parseUrl(url) {
    for (const [key, provider] of Object.entries(this.providers)) {
      const match = url.match(provider.pattern);
      if (match) {
        return {
          provider: key,
          providerName: provider.name,
          videoId: match[1] || null,
          embedUrl: provider.embedUrl ? provider.embedUrl.replace('{id}', match[1]) : url,
          thumbnailUrl: provider.thumbnailUrl ? provider.thumbnailUrl.replace('{id}', match[1]) : null,
          allowFullscreen: provider.allowFullscreen,
          trusted: provider.trusted || false
        };
      }
    }
    return null;
  },
  
  /**
   * Check if URL is from a whitelisted provider
   * @param {string} url 
   * @returns {boolean}
   */
  isAllowed(url) {
    return this.parseUrl(url) !== null;
  },
  
  /**
   * Create a video embed configuration
   * @param {Object} config 
   * @returns {Object}
   */
  createVideo(config = {}) {
    const parsed = config.url ? this.parseUrl(config.url) : null;
    
    return {
      id: config.id || this.generateId('video'),
      type: 'video',
      title: config.title || 'Video',
      provider: parsed?.provider || config.provider || 'youtube',
      videoId: parsed?.videoId || config.videoId || '',
      url: config.url || '',
      embedUrl: parsed?.embedUrl || config.embedUrl || '',
      startTime: config.startTime || 0,
      endTime: config.endTime || null,
      thumbnail: config.thumbnail || parsed?.thumbnailUrl || '',
      transcript: config.transcript || '',
      caption: config.caption || '',
      width: config.width || 800,
      height: config.height || 450,
      allowFullscreen: config.allowFullscreen !== false
    };
  },
  
  /**
   * Create a simulation/embed configuration
   * @param {Object} config 
   * @returns {Object}
   */
  createSimulation(config = {}) {
    const parsed = config.url ? this.parseUrl(config.url) : null;
    
    if (config.url && !this.isAllowed(config.url)) {
      throw new Error('URL not from allowed provider');
    }
    
    return {
      id: config.id || this.generateId('sim'),
      type: 'simulation',
      title: config.title || 'Interactive Simulation',
      provider: parsed?.providerName || config.provider || 'External',
      url: config.url || '',
      width: config.width || 800,
      height: config.height || 600,
      allowFullscreen: config.allowFullscreen !== false,
      trusted: parsed?.trusted || false
    };
  },
  
  /**
   * Extract YouTube video ID from various URL formats
   * @param {string} url 
   * @returns {string|null}
   */
  extractYouTubeId(url) {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  },
  
  /**
   * Build embed URL with parameters
   * @param {Object} video 
   * @returns {string}
   */
  buildEmbedUrl(video) {
    let url = video.embedUrl;
    
    const params = new URLSearchParams();
    
    if (video.startTime > 0) {
      params.append('start', video.startTime);
    }
    
    if (video.provider === 'youtube') {
      params.append('rel', '0'); // Don't show related videos
      params.append('modestbranding', '1');
    }
    
    const paramString = params.toString();
    if (paramString) {
      url += (url.includes('?') ? '&' : '?') + paramString;
    }
    
    return url;
  },
  
  /**
   * Render video embed
   * @param {Object} video 
   * @returns {string}
   */
  renderVideo(video) {
    const embedUrl = this.buildEmbedUrl(video);
    const aspectRatio = (video.height / video.width * 100).toFixed(2);
    
    return `
      <div class="rich-media-video" data-video-id="${video.id}">
        ${video.caption ? `<p class="media-caption">${this.escapeHtml(video.caption)}</p>` : ''}
        
        <div class="video-wrapper" style="padding-bottom: ${aspectRatio}%;">
          <iframe 
            src="${embedUrl}"
            title="${this.escapeHtml(video.title)}"
            width="${video.width}"
            height="${video.height}"
            frameborder="0"
            ${video.allowFullscreen ? 'allowfullscreen' : ''}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy">
          </iframe>
        </div>
        
        ${video.transcript ? `
          <details class="video-transcript">
            <summary>
              <i data-lucide="file-text"></i>
              Video Transcript
            </summary>
            <div class="transcript-content">
              ${this.formatTranscript(video.transcript)}
            </div>
          </details>
        ` : ''}
      </div>
    `;
  },
  
  /**
   * Render lazy-loaded video (click to play)
   * @param {Object} video 
   * @returns {string}
   */
  renderLazyVideo(video) {
    const thumbnail = video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
    
    return `
      <div class="rich-media-video lazy-load" data-video-id="${video.id}">
        ${video.caption ? `<p class="media-caption">${this.escapeHtml(video.caption)}</p>` : ''}
        
        <div class="video-thumbnail" 
             style="background-image: url('${thumbnail}');"
             onclick="RichMedia.loadVideo(this, '${video.id}')">
          <button class="video-play-button" aria-label="Play video">
            <i data-lucide="play"></i>
          </button>
          <span class="video-duration">${video.startTime ? 'From ' + this.formatTime(video.startTime) : 'Click to play'}</span>
        </div>
        
        <script type="text/template" id="video-template-${video.id}">
          ${this.renderVideo(video)}
        </script>
        
        ${video.transcript ? `
          <details class="video-transcript">
            <summary>
              <i data-lucide="file-text"></i>
              Video Transcript
            </summary>
            <div class="transcript-content">
              ${this.formatTranscript(video.transcript)}
            </div>
          </details>
        ` : ''}
      </div>
    `;
  },
  
  /**
   * Load video on click (for lazy loading)
   * @param {HTMLElement} element 
   * @param {string} videoId 
   */
  loadVideo(element, videoId) {
    const template = document.getElementById(`video-template-${videoId}`);
    if (template) {
      const container = element.closest('.rich-media-video');
      container.innerHTML = template.innerHTML;
      container.classList.remove('lazy-load');
      
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  },
  
  /**
   * Render simulation/embed
   * @param {Object} simulation 
   * @returns {string}
   */
  renderSimulation(simulation) {
    return `
      <div class="rich-media-simulation" data-sim-id="${simulation.id}">
        <div class="simulation-header">
          <h4>
            <i data-lucide="atom"></i>
            ${this.escapeHtml(simulation.title)}
          </h4>
          <span class="simulation-provider">${this.escapeHtml(simulation.provider)}</span>
        </div>
        
        <div class="simulation-wrapper">
          <iframe 
            src="${simulation.url}"
            title="${this.escapeHtml(simulation.title)}"
            width="${simulation.width}"
            height="${simulation.height}"
            frameborder="0"
            ${simulation.allowFullscreen ? 'allowfullscreen' : ''}
            sandbox="allow-scripts allow-same-origin allow-popups"
            loading="lazy">
          </iframe>
        </div>
        
        ${simulation.allowFullscreen ? `
          <button class="btn btn-secondary simulation-fullscreen" onclick="RichMedia.toggleFullscreen(this)">
            <i data-lucide="maximize"></i>
            Fullscreen
          </button>
        ` : ''}
      </div>
    `;
  },
  
  /**
   * Toggle fullscreen for simulation
   * @param {HTMLElement} button 
   */
  toggleFullscreen(button) {
    const simulation = button.closest('.rich-media-simulation');
    const wrapper = simulation.querySelector('.simulation-wrapper');
    
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().then(() => {
        wrapper.classList.add('fullscreen');
        button.innerHTML = '<i data-lucide="minimize"></i> Exit Fullscreen';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    } else {
      document.exitFullscreen().then(() => {
        wrapper.classList.remove('fullscreen');
        button.innerHTML = '<i data-lucide="maximize"></i> Fullscreen';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    }
  },
  
  /**
   * Format transcript text
   * @param {string} transcript 
   * @returns {string}
   */
  formatTranscript(transcript) {
    // If transcript has timestamps, format them
    if (transcript.includes('[') && transcript.includes(']')) {
      return transcript
        .split('\n')
        .map(line => {
          const match = line.match(/^\[(\d{1,2}:\d{2})\]\s*(.+)/);
          if (match) {
            return `<p><span class="transcript-time">${match[1]}</span> ${this.escapeHtml(match[2])}</p>`;
          }
          return `<p>${this.escapeHtml(line)}</p>`;
        })
        .join('');
    }
    
    // Simple paragraph format
    return transcript
      .split('\n\n')
      .map(p => `<p>${this.escapeHtml(p)}</p>`)
      .join('');
  },
  
  /**
   * Format seconds to MM:SS
   * @param {number} seconds 
   * @returns {string}
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },
  
  /**
   * Validate video URL
   * @param {string} url 
   * @returns {Object}
   */
  validateVideoUrl(url) {
    const parsed = this.parseUrl(url);
    
    if (!parsed) {
      return {
        valid: false,
        error: 'Unsupported video URL. Please use YouTube or Vimeo.'
      };
    }
    
    return {
      valid: true,
      ...parsed
    };
  },
  
  /**
   * Validate simulation URL
   * @param {string} url 
   * @returns {Object}
   */
  validateSimulationUrl(url) {
    if (!this.isAllowed(url)) {
      return {
        valid: false,
        error: 'URL not from an approved educational provider. Allowed: PhET, BioInteractive, Learn Genetics, Cells Alive.'
      };
    }
    
    return {
      valid: true,
      ...this.parseUrl(url)
    };
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
  generateId(prefix = 'media') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Export for both module and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RichMedia };
}
