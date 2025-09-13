import GoogleVisionService, { DetectedLandmark } from './googleVisionService';
import WikipediaService, { EnrichedLocationData } from './wikipediaService';

interface RecognitionResult {
  success: boolean;
  landmark?: DetectedLandmark;
  locationData?: EnrichedLocationData;
  confidence: number;
  processingTime: number;
  error?: string;
  fallbackUsed: boolean;
  cacheUsed: boolean;
}

interface RecognitionOptions {
  maxRetries?: number;
  confidenceThreshold?: number;
  enableFallback?: boolean;
  enableCache?: boolean;
  timeoutMs?: number;
}

interface ProcessingMetrics {
  totalRequests: number;
  successfulDetections: number;
  failedDetections: number;
  averageProcessingTime: number;
  cacheHits: number;
  apiErrors: number;
}

class ImageRecognitionService {
  private visionService: GoogleVisionService;
  private wikipediaService: WikipediaService;
  private metrics: ProcessingMetrics;
  private cache: Map<string, { result: RecognitionResult; timestamp: number }>;
  private cacheExpiryMs: number = 24 * 60 * 60 * 1000; // 24 hours

  constructor(googleApiKey?: string) {
    this.visionService = new GoogleVisionService(googleApiKey);
    this.wikipediaService = new WikipediaService();
    this.cache = new Map();
    this.metrics = {
      totalRequests: 0,
      successfulDetections: 0,
      failedDetections: 0,
      averageProcessingTime: 0,
      cacheHits: 0,
      apiErrors: 0
    };
  }

  /**
   * Main method to recognize landmarks from an image
   */
  async recognizeLandmark(
    imageSource: File | string,
    options: RecognitionOptions = {}
  ): Promise<RecognitionResult> {
    const startTime = performance.now();
    const {
      maxRetries = 2,
      confidenceThreshold = 70,
      enableFallback = true,
      enableCache = true,
      timeoutMs = 15000
    } = options;

    this.metrics.totalRequests++;

    try {
      // Generate cache key
      const cacheKey = await this.generateCacheKey(imageSource);
      
      // Check cache first
      if (enableCache) {
        const cachedResult = this.getCachedResult(cacheKey);
        if (cachedResult) {
          this.metrics.cacheHits++;
          return {
            ...cachedResult,
            processingTime: performance.now() - startTime,
            cacheUsed: true
          };
        }
      }

      // Set up timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Recognition timeout')), timeoutMs);
      });

      // Process image with retries
      const recognitionPromise = this.processWithRetries(
        imageSource,
        confidenceThreshold,
        maxRetries,
        enableFallback
      );

      const result = await Promise.race([recognitionPromise, timeoutPromise]);
      
      // Cache successful results
      if (enableCache && result.success) {
        this.setCachedResult(cacheKey, result);
      }

      // Update metrics
      const processingTime = performance.now() - startTime;
      this.updateMetrics(result.success, processingTime);

      return {
        ...result,
        processingTime,
        cacheUsed: false
      };

    } catch (error) {
      this.metrics.failedDetections++;
      this.metrics.apiErrors++;

      const processingTime = performance.now() - startTime;
      
      return {
        success: false,
        confidence: 0,
        processingTime,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        fallbackUsed: false,
        cacheUsed: false
      };
    }
  }

  /**
   * Process image recognition with retry logic
   */
  private async processWithRetries(
    imageSource: File | string,
    confidenceThreshold: number,
    maxRetries: number,
    enableFallback: boolean
  ): Promise<RecognitionResult> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Try Google Vision API
        const landmarks = await this.visionService.detectLandmarks(imageSource);
        
        if (landmarks.length > 0) {
          const bestLandmark = landmarks[0];
          
          if (bestLandmark.confidence >= confidenceThreshold) {
            // Get enriched data from Wikipedia
            const locationData = await this.wikipediaService.getEnrichedLocationData(
              bestLandmark.name,
              bestLandmark.coordinates
            );

            return {
              success: true,
              landmark: bestLandmark,
              locationData: locationData || undefined,
              confidence: bestLandmark.confidence,
              processingTime: 0, // Will be set by caller
              fallbackUsed: false,
              cacheUsed: false
            };
          }
        }

        // If no high-confidence results, continue to next attempt or fallback
        if (attempt === maxRetries && enableFallback) {
          return await this.tryFallbackRecognition(imageSource);
        }

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // If this is not the last attempt, wait before retry
        if (attempt < maxRetries) {
          await this.delay(1000 * (attempt + 1)); // Exponential backoff
        }
      }
    }

    // If all retries failed and fallback is enabled
    if (enableFallback) {
      try {
        return await this.tryFallbackRecognition(imageSource);
      } catch (fallbackError) {
        // Fallback also failed
      }
    }

    throw lastError || new Error('Failed to recognize landmark after all retries');
  }

  /**
   * Fallback recognition using simpler methods
   */
  private async tryFallbackRecognition(imageSource: File | string): Promise<RecognitionResult> {
    // This could implement alternative recognition methods:
    // 1. Local landmark database matching
    // 2. GPS-based location detection
    // 3. Crowd-sourced data
    // 4. Machine learning models running locally

    // For now, we'll implement a simple GPS-based fallback
    try {
      const userLocation = await this.getCurrentLocation();
      
      if (userLocation) {
        // Search for landmarks near the user's location
        const nearbyResults = await this.wikipediaService.searchByCoordinates(
          userLocation.lat,
          userLocation.lng,
          5000, // 5km radius
          5
        );

        if (nearbyResults.length > 0) {
          const closestPlace = nearbyResults[0];
          const locationData = await this.wikipediaService.getEnrichedLocationData(
            closestPlace.title,
            { lat: closestPlace.lat, lng: closestPlace.lon }
          );

          return {
            success: true,
            landmark: {
              name: closestPlace.title,
              confidence: 60, // Lower confidence for fallback
              coordinates: { lat: closestPlace.lat, lng: closestPlace.lon },
              source: 'fallback'
            },
            locationData: locationData || undefined,
            confidence: 60,
            processingTime: 0,
            fallbackUsed: true,
            cacheUsed: false
          };
        }
      }

      throw new Error('No fallback options available');

    } catch (error) {
      throw new Error(`Fallback recognition failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user's current location using GPS
   */
  private getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          resolve(null);
        },
        {
          timeout: 5000,
          enableHighAccuracy: false
        }
      );
    });
  }

  /**
   * Generate cache key for an image
   */
  private async generateCacheKey(imageSource: File | string): Promise<string> {
    if (typeof imageSource === 'string') {
      // For URLs, use the URL as cache key
      return `url_${btoa(imageSource)}`;
    } else {
      // For files, create a hash based on file properties
      const fileInfo = `${imageSource.name}_${imageSource.size}_${imageSource.lastModified}`;
      return `file_${btoa(fileInfo)}`;
    }
  }

  /**
   * Get cached result if available and not expired
   */
  private getCachedResult(cacheKey: string): RecognitionResult | null {
    const cached = this.cache.get(cacheKey);
    
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.cacheExpiryMs;
    
    if (isExpired) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    return cached.result;
  }

  /**
   * Cache a recognition result
   */
  private setCachedResult(cacheKey: string, result: RecognitionResult): void {
    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });

    // Clean up old cache entries periodically
    if (this.cache.size > 100) {
      this.cleanupCache();
    }
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheExpiryMs) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Update processing metrics
   */
  private updateMetrics(success: boolean, processingTime: number): void {
    if (success) {
      this.metrics.successfulDetections++;
    } else {
      this.metrics.failedDetections++;
    }

    // Update average processing time
    const totalProcessingTime = this.metrics.averageProcessingTime * (this.metrics.totalRequests - 1) + processingTime;
    this.metrics.averageProcessingTime = totalProcessingTime / this.metrics.totalRequests;
  }

  /**
   * Utility method to add delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current processing metrics
   */
  getMetrics(): ProcessingMetrics {
    return { ...this.metrics };
  }

  /**
   * Get success rate percentage
   */
  getSuccessRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return (this.metrics.successfulDetections / this.metrics.totalRequests) * 100;
  }

  /**
   * Clear cache manually
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Set cache expiry time
   */
  setCacheExpiry(ms: number): void {
    this.cacheExpiryMs = ms;
  }

  /**
   * Validate service configuration
   */
  async validateServices(): Promise<{ vision: boolean; wikipedia: boolean }> {
    const [visionValid, wikipediaAvailable] = await Promise.all([
      this.visionService.validateApiKey(),
      this.wikipediaService.isServiceAvailable()
    ]);

    return {
      vision: visionValid,
      wikipedia: wikipediaAvailable
    };
  }

  /**
   * Set confidence threshold for the vision service
   */
  setConfidenceThreshold(threshold: number): void {
    this.visionService.setConfidenceThreshold(threshold / 100); // Convert percentage to decimal
  }
}

export default ImageRecognitionService;
export type { RecognitionResult, RecognitionOptions, ProcessingMetrics };