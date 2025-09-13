interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  priority: number;
  size: number;
}

interface CacheOptions {
  maxSize?: number; // Max entries
  maxMemory?: number; // Max memory in bytes
  defaultTTL?: number; // Default time to live in ms
  enableCompression?: boolean;
  enablePersistence?: boolean;
  storageKey?: string;
}

interface CacheStats {
  totalEntries: number;
  memoryUsage: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  oldestEntry: number;
  newestEntry: number;
}

class SmartCacheManager<T = any> {
  private cache: Map<string, CacheEntry<T>>;
  private options: Required<CacheOptions>;
  private stats: {
    hits: number;
    misses: number;
    evictions: number;
    totalMemory: number;
  };

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.options = {
      maxSize: 100,
      maxMemory: 50 * 1024 * 1024, // 50MB
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      enableCompression: false,
      enablePersistence: true,
      storageKey: 'ar_cache',
      ...options
    };

    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalMemory: 0
    };

    // Load from localStorage if persistence is enabled
    if (this.options.enablePersistence) {
      this.loadFromStorage();
    }

    // Set up periodic cleanup
    this.startCleanupInterval();
  }

  /**
   * Store data in cache with optional TTL and priority
   */
  set(
    key: string, 
    data: T, 
    options?: {
      ttl?: number;
      priority?: number;
      compress?: boolean;
    }
  ): void {
    const now = Date.now();
    const ttl = options?.ttl || this.options.defaultTTL;
    const priority = options?.priority || 1;
    
    // Calculate data size (rough estimate)
    const size = this.calculateSize(data);
    
    // Check memory limits before adding
    if (this.stats.totalMemory + size > this.options.maxMemory) {
      this.evictByMemory(size);
    }

    // Check size limits before adding
    if (this.cache.size >= this.options.maxSize) {
      this.evictLeastUsed();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
      accessCount: 0,
      lastAccessed: now,
      priority,
      size
    };

    // Remove old entry if exists (for updates)
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!;
      this.stats.totalMemory -= oldEntry.size;
    }

    this.cache.set(key, entry);
    this.stats.totalMemory += size;

    // Persist to storage if enabled
    if (this.options.enablePersistence) {
      this.saveToStorage();
    }
  }

  /**
   * Retrieve data from cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    
    // Check if expired
    if (now > entry.expiresAt) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;
    
    this.stats.hits++;
    return entry.data;
  }

  /**
   * Check if key exists in cache (without updating access stats)
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) return false;
    
    const now = Date.now();
    if (now > entry.expiresAt) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (entry) {
      this.stats.totalMemory -= entry.size;
      const deleted = this.cache.delete(key);
      
      if (this.options.enablePersistence) {
        this.saveToStorage();
      }
      
      return deleted;
    }
    
    return false;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats.totalMemory = 0;
    this.stats.evictions = 0;
    
    if (this.options.enablePersistence) {
      this.clearStorage();
    }
  }

  /**
   * Get or set with fallback function
   */
  async getOrSet<K>(
    key: string,
    fallbackFn: () => Promise<K>,
    options?: {
      ttl?: number;
      priority?: number;
    }
  ): Promise<K> {
    const cached = this.get(key) as K;
    
    if (cached !== null) {
      return cached;
    }

    // Execute fallback function
    const data = await fallbackFn();
    this.set(key, data as T, options);
    
    return data;
  }

  /**
   * Evict entries based on memory usage
   */
  private evictByMemory(requiredSize: number): void {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, entry }))
      .sort((a, b) => {
        // Sort by priority (lower first) then by access frequency
        if (a.entry.priority !== b.entry.priority) {
          return a.entry.priority - b.entry.priority;
        }
        return a.entry.accessCount - b.entry.accessCount;
      });

    let freedMemory = 0;
    
    for (const { key, entry } of entries) {
      if (freedMemory >= requiredSize) break;
      
      this.cache.delete(key);
      freedMemory += entry.size;
      this.stats.totalMemory -= entry.size;
      this.stats.evictions++;
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLeastUsed(): void {
    let lruKey: string | null = null;
    let lruTime = Date.now();
    let lruPriority = Infinity;

    for (const [key, entry] of this.cache) {
      // Consider both priority and last access time
      const effectiveTime = entry.lastAccessed - (entry.priority * 3600000); // 1 hour per priority level
      
      if (entry.priority < lruPriority || 
          (entry.priority === lruPriority && effectiveTime < lruTime)) {
        lruKey = key;
        lruTime = effectiveTime;
        lruPriority = entry.priority;
      }
    }

    if (lruKey) {
      const entry = this.cache.get(lruKey)!;
      this.stats.totalMemory -= entry.size;
      this.cache.delete(lruKey);
      this.stats.evictions++;
    }
  }

  /**
   * Calculate approximate size of data in bytes
   */
  private calculateSize(data: T): number {
    try {
      const jsonString = JSON.stringify(data);
      return new Blob([jsonString]).size;
    } catch {
      // Fallback estimation
      return JSON.stringify(data).length * 2; // Rough UTF-16 estimate
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.stats.totalMemory -= entry.size;
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0 && this.options.enablePersistence) {
      this.saveToStorage();
    }

    return removedCount;
  }

  /**
   * Start periodic cleanup interval
   */
  private startCleanupInterval(): void {
    // Clean up every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const hitRate = this.stats.hits + this.stats.misses > 0 
      ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100 
      : 0;

    return {
      totalEntries: this.cache.size,
      memoryUsage: this.stats.totalMemory,
      hitRate,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : 0,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : 0
    };
  }

  /**
   * Get cache entries by pattern
   */
  getByPattern(pattern: RegExp): Map<string, T> {
    const results = new Map<string, T>();
    
    for (const [key, entry] of this.cache) {
      if (pattern.test(key) && Date.now() <= entry.expiresAt) {
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        results.set(key, entry.data);
      }
    }
    
    return results;
  }

  /**
   * Preload multiple entries
   */
  async preload<K>(
    entries: Array<{
      key: string;
      loader: () => Promise<K>;
      options?: { ttl?: number; priority?: number };
    }>
  ): Promise<Map<string, K>> {
    const results = new Map<string, K>();
    
    const promises = entries.map(async ({ key, loader, options }) => {
      try {
        const data = await loader();
        this.set(key, data as T, options);
        results.set(key, data);
      } catch (error) {
        console.warn(`Failed to preload cache entry for key: ${key}`, error);
      }
    });

    await Promise.allSettled(promises);
    return results;
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    try {
      const cacheData = {
        entries: Array.from(this.cache.entries()),
        stats: this.stats,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.options.storageKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.options.storageKey);
      
      if (!stored) return;
      
      const cacheData = JSON.parse(stored);
      const now = Date.now();
      
      // Only load if not too old (max 7 days)
      if (now - cacheData.timestamp > 7 * 24 * 60 * 60 * 1000) {
        this.clearStorage();
        return;
      }

      // Restore cache entries, filtering out expired ones
      for (const [key, entry] of cacheData.entries) {
        if (now <= entry.expiresAt) {
          this.cache.set(key, entry);
          this.stats.totalMemory += entry.size;
        }
      }

      // Restore stats (but reset hits/misses for new session)
      this.stats.evictions = cacheData.stats.evictions || 0;
      
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
      this.clearStorage();
    }
  }

  /**
   * Clear storage
   */
  private clearStorage(): void {
    try {
      localStorage.removeItem(this.options.storageKey);
    } catch (error) {
      console.warn('Failed to clear cache storage:', error);
    }
  }

  /**
   * Export cache data for debugging
   */
  export(): any {
    return {
      entries: Array.from(this.cache.entries()),
      stats: this.getStats(),
      options: this.options
    };
  }

  /**
   * Update cache options
   */
  updateOptions(newOptions: Partial<CacheOptions>): void {
    this.options = { ...this.options, ...newOptions };
    
    // Apply new limits if necessary
    if (newOptions.maxSize && this.cache.size > newOptions.maxSize) {
      while (this.cache.size > newOptions.maxSize) {
        this.evictLeastUsed();
      }
    }
    
    if (newOptions.maxMemory && this.stats.totalMemory > newOptions.maxMemory) {
      this.evictByMemory(this.stats.totalMemory - newOptions.maxMemory);
    }
  }
}

// Specialized cache instances for different data types
class ImageRecognitionCache extends SmartCacheManager<any> {
  constructor() {
    super({
      maxSize: 200,
      maxMemory: 100 * 1024 * 1024, // 100MB
      defaultTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
      storageKey: 'ar_recognition_cache'
    });
  }

  setLandmarkResult(imageHash: string, result: any, confidence: number): void {
    const priority = confidence >= 90 ? 3 : confidence >= 70 ? 2 : 1;
    const ttl = confidence >= 80 ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    
    this.set(`landmark_${imageHash}`, result, { priority, ttl });
  }

  getLandmarkResult(imageHash: string): any {
    return this.get(`landmark_${imageHash}`);
  }
}

class WikipediaCache extends SmartCacheManager<any> {
  constructor() {
    super({
      maxSize: 500,
      maxMemory: 50 * 1024 * 1024, // 50MB
      defaultTTL: 30 * 24 * 60 * 60 * 1000, // 30 days
      storageKey: 'ar_wikipedia_cache'
    });
  }

  setLocationData(landmarkName: string, data: any): void {
    this.set(`location_${landmarkName.toLowerCase()}`, data, { priority: 2 });
  }

  getLocationData(landmarkName: string): any {
    return this.get(`location_${landmarkName.toLowerCase()}`);
  }

  setNearbyPlaces(coordinates: string, places: any): void {
    this.set(`nearby_${coordinates}`, places, { 
      priority: 1,
      ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  getNearbyPlaces(coordinates: string): any {
    return this.get(`nearby_${coordinates}`);
  }
}

export default SmartCacheManager;
export { ImageRecognitionCache, WikipediaCache };
export type { CacheEntry, CacheOptions, CacheStats };