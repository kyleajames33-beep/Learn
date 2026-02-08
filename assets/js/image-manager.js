/**
 * Image Manager - Phase 0.6.1
 * Upload, organize, and optimize visual assets for lessons
 * Version: 1.0.0
 */

const ImageManager = {
  version: '1.0.0',
  
  // Configuration
  config: {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'],
    thumbnailWidth: 200,
    acceptedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
    storagePath: '/assets/images/lessons/',
    maxImagesPerLesson: 50
  },
  
  // State
  state: {
    images: [],
    currentLessonId: null,
    uploadQueue: [],
    isUploading: false,
    selectedImage: null
  },
  
  // Callbacks
  callbacks: {
    onImageAdded: null,
    onImageRemoved: null,
    onImageSelected: null,
    onError: null
  },
  
  /**
   * Initialize the image manager
   * @param {Object} options - Configuration options
   */
  init(options = {}) {
    this.config = { ...this.config, ...options.config };
    this.callbacks = { ...this.callbacks, ...options.callbacks };
    this.state.currentLessonId = options.lessonId || null;
    
    // Load existing images from lesson data if provided
    if (options.existingImages) {
      this.state.images = [...options.existingImages];
    }
    
    console.log('Image Manager initialized');
    return this;
  },
  
  /**
   * Set the current lesson ID
   * @param {string} lessonId 
   */
  setLessonId(lessonId) {
    this.state.currentLessonId = lessonId;
  },
  
  /**
   * Get all images
   * @returns {Array}
   */
  getImages() {
    return [...this.state.images];
  },
  
  /**
   * Get image by ID
   * @param {string} imageId 
   * @returns {Object|null}
   */
  getImage(imageId) {
    return this.state.images.find(img => img.id === imageId) || null;
  },
  
  /**
   * Validate file before upload
   * @param {File} file 
   * @returns {Object} - { valid: boolean, error: string|null }
   */
  validateFile(file) {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${this.formatFileSize(this.config.maxFileSize)}.`
      };
    }
    
    // Check file type
    if (!this.config.acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Accepted: JPG, PNG, GIF, SVG, WebP.`
      };
    }
    
    // Check if at max images
    if (this.state.images.length >= this.config.maxImagesPerLesson) {
      return {
        valid: false,
        error: `Maximum ${this.config.maxImagesPerLesson} images per lesson reached.`
      };
    }
    
    return { valid: true, error: null };
  },
  
  /**
   * Process and upload a file
   * @param {File} file 
   * @param {Object} metadata - Optional metadata (alt, caption, credit)
   * @returns {Promise<Object>}
   */
  async uploadFile(file, metadata = {}) {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    this.state.isUploading = true;
    
    try {
      // Generate unique ID and filename
      const imageId = this.generateId();
      const timestamp = Date.now();
      const safeName = this.sanitizeFilename(file.name);
      const lessonId = this.state.currentLessonId || 'draft';
      const filename = `${lessonId}-${timestamp}-${safeName}`;
      
      // Create image object
      const imageData = {
        id: imageId,
        originalName: file.name,
        filename: filename,
        mimeType: file.type,
        size: file.size,
        alt: metadata.alt || '',
        caption: metadata.caption || '',
        credit: metadata.credit || '',
        uploadedAt: new Date().toISOString(),
        width: 0,
        height: 0,
        src: null,
        srcWebp: null,
        thumbnail: null,
        dominantColor: null,
        blurHash: null
      };
      
      // Read file as data URL
      const dataUrl = await this.readFileAsDataURL(file);
      
      // Get image dimensions
      const dimensions = await this.getImageDimensions(dataUrl);
      imageData.width = dimensions.width;
      imageData.height = dimensions.height;
      
      // Generate thumbnail
      const thumbnail = await this.generateThumbnail(dataUrl, dimensions);
      imageData.thumbnail = thumbnail;
      
      // Generate WebP version if not already WebP
      if (file.type !== 'image/webp' && !file.name.endsWith('.svg')) {
        try {
          const webpData = await this.convertToWebP(dataUrl, dimensions);
          imageData.srcWebp = webpData;
        } catch (e) {
          console.warn('WebP conversion failed:', e);
        }
      }
      
      // Estimate dominant color for placeholder
      imageData.dominantColor = await this.estimateDominantColor(dataUrl);
      
      // Set main source
      imageData.src = dataUrl;
      
      // Add to state
      this.state.images.push(imageData);
      
      // Trigger callback
      if (this.callbacks.onImageAdded) {
        this.callbacks.onImageAdded(imageData);
      }
      
      this.state.isUploading = false;
      return imageData;
      
    } catch (error) {
      this.state.isUploading = false;
      console.error('Upload failed:', error);
      if (this.callbacks.onError) {
        this.callbacks.onError(error.message);
      }
      throw error;
    }
  },
  
  /**
   * Upload multiple files
   * @param {FileList|Array} files 
   * @param {Function} onProgress - Callback(progress, current, total)
   * @returns {Promise<Array>}
   */
  async uploadMultiple(files, onProgress = null) {
    const fileArray = Array.from(files);
    const results = [];
    const errors = [];
    
    for (let i = 0; i < fileArray.length; i++) {
      try {
        if (onProgress) {
          onProgress({
            percent: Math.round((i / fileArray.length) * 100),
            current: i + 1,
            total: fileArray.length,
            filename: fileArray[i].name
          });
        }
        
        const imageData = await this.uploadFile(fileArray[i]);
        results.push({ success: true, image: imageData });
      } catch (error) {
        errors.push({ filename: fileArray[i].name, error: error.message });
        results.push({ success: false, error: error.message });
      }
    }
    
    if (onProgress) {
      onProgress({ percent: 100, current: fileArray.length, total: fileArray.length, complete: true });
    }
    
    return { results, errors };
  },
  
  /**
   * Remove an image
   * @param {string} imageId 
   * @returns {boolean}
   */
  removeImage(imageId) {
    const index = this.state.images.findIndex(img => img.id === imageId);
    if (index === -1) return false;
    
    const removed = this.state.images.splice(index, 1)[0];
    
    if (this.callbacks.onImageRemoved) {
      this.callbacks.onImageRemoved(removed);
    }
    
    return true;
  },
  
  /**
   * Update image metadata
   * @param {string} imageId 
   * @param {Object} metadata 
   */
  updateImageMetadata(imageId, metadata) {
    const image = this.state.images.find(img => img.id === imageId);
    if (!image) return false;
    
    Object.assign(image, metadata);
    return true;
  },
  
  /**
   * Select an image
   * @param {string} imageId 
   */
  selectImage(imageId) {
    this.state.selectedImage = imageId;
    const image = this.getImage(imageId);
    
    if (this.callbacks.onImageSelected) {
      this.callbacks.onImageSelected(image);
    }
    
    return image;
  },
  
  /**
   * Read file as Data URL
   * @param {File} file 
   * @returns {Promise<string>}
   */
  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },
  
  /**
   * Get image dimensions
   * @param {string} dataUrl 
   * @returns {Promise<{width: number, height: number}>}
   */
  getImageDimensions(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  },
  
  /**
   * Generate thumbnail
   * @param {string} dataUrl 
   * @param {{width: number, height: number}} dimensions 
   * @returns {Promise<string>}
   */
  async generateThumbnail(dataUrl, dimensions) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate thumbnail dimensions
        let { width, height } = dimensions;
        if (width > this.config.thumbnailWidth) {
          height = (height * this.config.thumbnailWidth) / width;
          width = this.config.thumbnailWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Use better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Failed to generate thumbnail'));
      img.src = dataUrl;
    });
  },
  
  /**
   * Convert image to WebP format
   * @param {string} dataUrl 
   * @param {{width: number, height: number}} dimensions 
   * @returns {Promise<string>}
   */
  async convertToWebP(dataUrl, dimensions) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        
        ctx.drawImage(img, 0, 0);
        
        // Convert to WebP with good quality
        try {
          const webpData = canvas.toDataURL('image/webp', 0.85);
          resolve(webpData);
        } catch (e) {
          reject(new Error('WebP not supported'));
        }
      };
      img.onerror = () => reject(new Error('Failed to convert to WebP'));
      img.src = dataUrl;
    });
  },
  
  /**
   * Estimate dominant color from image
   * @param {string} dataUrl 
   * @returns {Promise<string>}
   */
  async estimateDominantColor(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Sample a small version
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);
        
        try {
          const imageData = ctx.getImageData(0, 0, 50, 50);
          const data = imageData.data;
          
          let r = 0, g = 0, b = 0;
          let count = 0;
          
          // Sample every 10th pixel for performance
          for (let i = 0; i < data.length; i += 40) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
          
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          
          resolve(`rgb(${r}, ${g}, ${b})`);
        } catch (e) {
          resolve('#e2e8f0'); // Default fallback
        }
      };
      img.onerror = () => resolve('#e2e8f0');
      img.src = dataUrl;
    });
  },
  
  /**
   * Sanitize filename
   * @param {string} filename 
   * @returns {string}
   */
  sanitizeFilename(filename) {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  },
  
  /**
   * Format file size for display
   * @param {number} bytes 
   * @returns {string}
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },
  
  /**
   * Generate unique ID
   * @param {string} prefix 
   * @returns {string}
   */
  generateId(prefix = 'img') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
  
  /**
   * Create image HTML with lazy loading and responsive srcset
   * @param {Object} image 
   * @param {Object} options 
   * @returns {string}
   */
  createImageHTML(image, options = {}) {
    const {
      className = '',
      loading = 'lazy',
      sizes = '(max-width: 768px) 100vw, 800px',
      maxWidth = null
    } = options;
    
    const style = maxWidth ? ` style="max-width: ${maxWidth};"` : '';
    
    // Build srcset if we have multiple versions
    let srcset = '';
    if (image.srcWebp) {
      srcset = `${image.srcWebp} 1x`;
    }
    
    // Placeholder with dominant color
    const placeholder = image.dominantColor || '#e2e8f0';
    
    return `
      <figure class="lesson-image${className ? ' ' + className : ''}"${style}>
        <picture>
          ${image.srcWebp ? `<source srcset="${image.srcWebp}" type="image/webp">` : ''}
          <img 
            src="${image.thumbnail || image.src}" 
            data-src="${image.src}"
            alt="${this.escapeHtml(image.alt || '')}"
            loading="${loading}"
            width="${image.width}"
            height="${image.height}"
            style="background-color: ${placeholder};"
            ${srcset ? `srcset="${srcset}"` : ''}
            ${sizes ? `sizes="${sizes}"` : ''}
            onload="this.classList.add('loaded')"
          >
        </picture>
        ${image.caption ? `<figcaption>${this.escapeHtml(image.caption)}</figcaption>` : ''}
        ${image.credit ? `<cite>${this.escapeHtml(image.credit)}</cite>` : ''}
      </figure>
    `;
  },
  
  /**
   * Escape HTML entities
   * @param {string} text 
   * @returns {string}
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  /**
   * Export images data for lesson JSON
   * @returns {Array}
   */
  exportForLesson() {
    return this.state.images.map(img => ({
      id: img.id,
      src: img.src,
      srcWebp: img.srcWebp,
      thumbnail: img.thumbnail,
      alt: img.alt,
      caption: img.caption,
      credit: img.credit,
      width: img.width,
      height: img.height,
      size: img.size,
      mimeType: img.mimeType,
      uploadedAt: img.uploadedAt
    }));
  },
  
  /**
   * Import images from lesson data
   * @param {Array} images 
   */
  importFromLesson(images) {
    if (Array.isArray(images)) {
      this.state.images = [...images];
    }
  },
  
  /**
   * Clear all images
   */
  clear() {
    this.state.images = [];
    this.state.selectedImage = null;
  },
  
  /**
   * Get stats about current images
   * @returns {Object}
   */
  getStats() {
    const totalSize = this.state.images.reduce((sum, img) => sum + (img.size || 0), 0);
    const webpCount = this.state.images.filter(img => img.srcWebp).length;
    
    return {
      count: this.state.images.length,
      totalSize: totalSize,
      totalSizeFormatted: this.formatFileSize(totalSize),
      withWebp: webpCount,
      withoutAlt: this.state.images.filter(img => !img.alt).length
    };
  }
};

// Export for both module and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ImageManager };
}
