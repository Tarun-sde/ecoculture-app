interface PerformanceMetrics {
  imageProcessingTime: number;
  apiCallTime: number;
  totalRecognitionTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  networkLatency: number;
  timestamp: number;
}

interface OptimizationConfig {
  enableImageCompression: boolean;
  maxImageSize: number;
  compressionQuality: number;
  enableWebWorkers: boolean;
  batchAPIRequests: boolean;
  preloadCommonResults: boolean;
  enableLazyLoading: boolean;
  prefetchNearbyData: boolean;
}

class PerformanceOptimizer {
  private metrics: PerformanceMetrics[] = [];
  private config: OptimizationConfig;
  private imageWorker: Worker | null = null;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = {
      enableImageCompression: true,
      maxImageSize: 2 * 1024 * 1024, // 2MB
      compressionQuality: 0.8,
      enableWebWorkers: true,
      batchAPIRequests: true,
      preloadCommonResults: true,
      enableLazyLoading: true,
      prefetchNearbyData: true,
      ...config
    };

    this.initializeWebWorker();
  }

  /**
   * Initialize web worker for image processing
   */
  private initializeWebWorker(): void {
    if (!this.config.enableWebWorkers || typeof Worker === 'undefined') {
      return;
    }

    try {
      // Create worker from blob to avoid external file dependency
      const workerCode = `
        self.onmessage = function(e) {
          const { imageData, maxSize, quality } = e.data;
          
          try {
            // Create canvas for image processing
            const canvas = new OffscreenCanvas(1, 1);
            const ctx = canvas.getContext('2d');
            
            // Process image data here
            // This is a simplified version - in production you'd implement
            // proper image compression algorithms
            
            self.postMessage({
              success: true,
              processedData: imageData, // Placeholder
              compressionRatio: 0.7
            });
          } catch (error) {
            self.postMessage({
              success: false,
              error: error.message
            });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.imageWorker = new Worker(URL.createObjectURL(blob));
    } catch (error) {
      console.warn('Failed to initialize image processing worker:', error);
    }
  }

  /**
   * Optimize image before processing
   */
  async optimizeImage(imageFile: File): Promise<{ file: File; compressionRatio: number }> {
    const startTime = performance.now();

    try {
      // Check if image needs compression
      if (imageFile.size <= this.config.maxImageSize && !this.config.enableImageCompression) {
        return { file: imageFile, compressionRatio: 1 };
      }

      // Use web worker if available
      if (this.imageWorker && this.config.enableWebWorkers) {
        return await this.compressImageWithWorker(imageFile);
      }

      // Fallback to main thread compression
      return await this.compressImageMainThread(imageFile);

    } finally {
      const processingTime = performance.now() - startTime;
      this.recordMetric('imageProcessingTime', processingTime);
    }
  }

  /**
   * Compress image using web worker
   */
  private async compressImageWithWorker(imageFile: File): Promise<{ file: File; compressionRatio: number }> {
    return new Promise((resolve, reject) => {
      if (!this.imageWorker) {
        reject(new Error('Web worker not available'));
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageWorker!.onmessage = (e) => {
          if (e.data.success) {
            // Create new file from processed data
            const compressedFile = new File([e.data.processedData], imageFile.name, {
              type: imageFile.type,
              lastModified: Date.now()
            });
            resolve({ file: compressedFile, compressionRatio: e.data.compressionRatio });
          } else {
            reject(new Error(e.data.error));
          }
        };

        this.imageWorker!.postMessage({
          imageData: fileReader.result,
          maxSize: this.config.maxImageSize,
          quality: this.config.compressionQuality
        });
      };

      fileReader.onerror = () => reject(new Error('Failed to read file'));
      fileReader.readAsArrayBuffer(imageFile);
    });
  }

  /**
   * Compress image on main thread
   */
  private async compressImageMainThread(imageFile: File): Promise<{ file: File; compressionRatio: number }> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions
          const maxDimension = 1920; // Max width or height
          let { width, height } = img;

          if (width > maxDimension || height > maxDimension) {
            const ratio = Math.min(maxDimension / width, maxDimension / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx!.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], imageFile.name, {
                  type: imageFile.type,
                  lastModified: Date.now()
                });
                const compressionRatio = blob.size / imageFile.size;
                resolve({ file: compressedFile, compressionRatio });
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            imageFile.type,
            this.config.compressionQuality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }

  /**
   * Optimize API requests with batching and caching
   */
  async optimizeAPIRequest<T>(
    requestFn: () => Promise<T>,
    cacheKey?: string,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<T> {
    // Add to queue if batching is enabled
    if (this.config.batchAPIRequests && priority !== 'high') {
      return this.addToQueue(requestFn, priority);
    }

    // Execute immediately for high priority requests
    return this.executeWithMetrics(requestFn, 'apiCallTime');
  }

  /**
   * Add request to processing queue
   */
  private async addToQueue<T>(
    requestFn: () => Promise<T>,
    priority: 'medium' | 'low'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const queueItem = async () => {
        try {
          const result = await this.executeWithMetrics(requestFn, 'apiCallTime');
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      // Insert based on priority
      if (priority === 'medium') {
        this.requestQueue.unshift(queueItem);
      } else {
        this.requestQueue.push(queueItem);
      }

      this.processQueue();
    });
  }

  /**
   * Process request queue with throttling
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      // Process requests in batches to avoid overwhelming APIs
      const batchSize = 3;
      
      while (this.requestQueue.length > 0) {
        const batch = this.requestQueue.splice(0, batchSize);
        
        // Execute batch with slight delay between requests
        for (const request of batch) {
          await request();
          await this.delay(100); // 100ms delay between requests
        }

        // Longer delay between batches
        if (this.requestQueue.length > 0) {
          await this.delay(500);
        }
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Execute function with performance metrics
   */
  private async executeWithMetrics<T>(
    fn: () => Promise<T>,
    metricType: keyof PerformanceMetrics
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      return result;
    } finally {
      const executionTime = performance.now() - startTime;
      this.recordMetric(metricType, executionTime);
    }
  }

  /**
   * Preload common landmark data
   */
  async preloadCommonData(landmarks: string[]): Promise<void> {
    if (!this.config.preloadCommonResults) return;

    const preloadPromises = landmarks.map(async (landmark) => {
      try {
        // This would integrate with your caching system
        console.log(`Preloading data for: ${landmark}`);
        // await this.cacheManager.preload(landmark);
      } catch (error) {
        console.warn(`Failed to preload ${landmark}:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
  }

  /**
   * Prefetch data for nearby locations
   */
  async prefetchNearbyData(
    coordinates: { lat: number; lng: number },
    radius: number = 10000
  ): Promise<void> {
    if (!this.config.prefetchNearbyData) return;

    try {
      // This would integrate with your Wikipedia service
      console.log(`Prefetching data near ${coordinates.lat}, ${coordinates.lng}`);
      // await this.wikipediaService.searchByCoordinates(coordinates.lat, coordinates.lng, radius);
    } catch (error) {
      console.warn('Failed to prefetch nearby data:', error);
    }
  }

  /**
   * Monitor network performance
   */
  measureNetworkLatency(): Promise<number> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      // Use a fast, lightweight endpoint for latency measurement
      const testUrl = 'https://httpbin.org/status/200';
      
      fetch(testUrl, { 
        method: 'HEAD',
        cache: 'no-cache'
      })
        .then(() => {
          const latency = performance.now() - startTime;
          this.recordMetric('networkLatency', latency);
          resolve(latency);
        })
        .catch(() => {
          // Fallback to a conservative estimate
          resolve(500);
        });
    });
  }

  /**
   * Record performance metric
   */
  private recordMetric(type: keyof PerformanceMetrics, value: number): void {
    // Find or create current metric entry
    const now = Date.now();
    let currentMetric = this.metrics.find(m => now - m.timestamp < 60000); // Within 1 minute

    if (!currentMetric) {
      currentMetric = {
        imageProcessingTime: 0,
        apiCallTime: 0,
        totalRecognitionTime: 0,
        memoryUsage: 0,
        cacheHitRate: 0,
        networkLatency: 0,
        timestamp: now
      };
      this.metrics.push(currentMetric);
    }

    currentMetric[type] = value;

    // Keep only recent metrics (last hour)
    this.metrics = this.metrics.filter(m => now - m.timestamp < 3600000);
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    averageImageProcessing: number;
    averageAPICall: number;
    averageNetworkLatency: number;
    memoryTrend: number[];
    recommendedOptimizations: string[];
  } {
    if (this.metrics.length === 0) {
      return {
        averageImageProcessing: 0,
        averageAPICall: 0,
        averageNetworkLatency: 0,
        memoryTrend: [],
        recommendedOptimizations: []
      };
    }

    const avgImageProcessing = this.metrics.reduce((sum, m) => sum + m.imageProcessingTime, 0) / this.metrics.length;
    const avgAPICall = this.metrics.reduce((sum, m) => sum + m.apiCallTime, 0) / this.metrics.length;
    const avgNetworkLatency = this.metrics.reduce((sum, m) => sum + m.networkLatency, 0) / this.metrics.length;

    const memoryTrend = this.metrics.slice(-10).map(m => m.memoryUsage);

    const recommendedOptimizations = this.generateOptimizationRecommendations(
      avgImageProcessing,
      avgAPICall,
      avgNetworkLatency
    );

    return {
      averageImageProcessing: avgImageProcessing,
      averageAPICall: avgAPICall,
      averageNetworkLatency: avgNetworkLatency,
      memoryTrend,
      recommendedOptimizations
    };
  }

  /**
   * Generate optimization recommendations based on metrics
   */
  private generateOptimizationRecommendations(
    avgImageProcessing: number,
    avgAPICall: number,
    avgNetworkLatency: number
  ): string[] {
    const recommendations: string[] = [];

    if (avgImageProcessing > 2000) {
      recommendations.push('Consider enabling image compression to reduce processing time');
    }

    if (avgAPICall > 3000) {
      recommendations.push('Enable request batching to improve API performance');
    }

    if (avgNetworkLatency > 1000) {
      recommendations.push('Enable aggressive caching due to slow network conditions');
    }

    if (avgImageProcessing > 1000 && !this.config.enableWebWorkers) {
      recommendations.push('Enable web workers for better image processing performance');
    }

    if (!this.config.preloadCommonResults) {
      recommendations.push('Enable preloading of common landmarks to improve response time');
    }

    return recommendations;
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<OptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Reinitialize web worker if needed
    if (newConfig.enableWebWorkers !== undefined) {
      if (newConfig.enableWebWorkers && !this.imageWorker) {
        this.initializeWebWorker();
      } else if (!newConfig.enableWebWorkers && this.imageWorker) {
        this.imageWorker.terminate();
        this.imageWorker = null;
      }
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): OptimizationConfig {
    return { ...this.config };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.imageWorker) {
      this.imageWorker.terminate();
      this.imageWorker = null;
    }
    
    this.requestQueue = [];
    this.metrics = [];
  }
}

// Image lazy loading utility
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private imageQueue: Set<HTMLImageElement> = new Set();

  constructor() {
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              this.loadImage(img);
            }
          });
        },
        { rootMargin: '50px' }
      );
    }
  }

  observe(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.observe(img);
      this.imageQueue.add(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
    }
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      
      if (this.observer) {
        this.observer.unobserve(img);
      }
      this.imageQueue.delete(img);
    }
  }

  cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.imageQueue.clear();
  }
}

export default PerformanceOptimizer;
export type { PerformanceMetrics, OptimizationConfig };