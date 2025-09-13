interface ErrorDetails {
  code: string;
  message: string;
  userMessage: string;
  suggestions: string[];
  recoverable: boolean;
  category: 'network' | 'api' | 'user' | 'system' | 'permission' | 'validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  context?: Record<string, any>;
}

interface ErrorHandlerOptions {
  enableLogging?: boolean;
  enableUserNotification?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

class ARErrorHandler {
  private errorLog: ErrorDetails[] = [];
  private maxLogSize = 100;
  private options: Required<ErrorHandlerOptions>;

  constructor(options: ErrorHandlerOptions = {}) {
    this.options = {
      enableLogging: true,
      enableUserNotification: true,
      enableRetry: true,
      maxRetries: 3,
      retryDelay: 1000,
      ...options
    };
  }

  /**
   * Handle and categorize errors
   */
  handleError(error: Error | string, context?: Record<string, any>): ErrorDetails {
    const errorDetails = this.categorizeError(error, context);
    
    if (this.options.enableLogging) {
      this.logError(errorDetails);
    }

    return errorDetails;
  }

  /**
   * Categorize and format errors
   */
  private categorizeError(error: Error | string, context?: Record<string, any>): ErrorDetails {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    // Network errors
    if (this.isNetworkError(errorMessage)) {
      return {
        code: 'NETWORK_ERROR',
        message: errorMessage,
        userMessage: 'Network connection issue. Please check your internet connection.',
        suggestions: [
          'Check your internet connection',
          'Try again in a few moments',
          'Switch to a different network if available'
        ],
        recoverable: true,
        category: 'network',
        severity: 'medium',
        timestamp: Date.now(),
        context: { ...context, stack: errorStack }
      };
    }

    // API errors
    if (this.isAPIError(errorMessage)) {
      return this.handleAPIError(errorMessage, context);
    }

    // Permission errors
    if (this.isPermissionError(errorMessage)) {
      return {
        code: 'PERMISSION_DENIED',
        message: errorMessage,
        userMessage: 'Permission required. Please allow access to continue.',
        suggestions: [
          'Allow camera/location permissions in your browser',
          'Check browser settings for this website',
          'Try refreshing the page and allowing permissions'
        ],
        recoverable: true,
        category: 'permission',
        severity: 'high',
        timestamp: Date.now(),
        context: { ...context, stack: errorStack }
      };
    }

    // Validation errors
    if (this.isValidationError(errorMessage)) {
      return {
        code: 'VALIDATION_ERROR',
        message: errorMessage,
        userMessage: 'Invalid input. Please check your data and try again.',
        suggestions: [
          'Ensure image is in a supported format (JPG, PNG, WebP)',
          'Check image size (max 10MB recommended)',
          'Try uploading a different image'
        ],
        recoverable: true,
        category: 'validation',
        severity: 'low',
        timestamp: Date.now(),
        context: { ...context, stack: errorStack }
      };
    }

    // User errors (low confidence, no landmarks found)
    if (this.isUserError(errorMessage)) {
      return {
        code: 'NO_LANDMARK_DETECTED',
        message: errorMessage,
        userMessage: 'Could not identify any landmarks in this image.',
        suggestions: [
          'Try uploading a clearer image of the landmark',
          'Ensure the landmark is clearly visible in the photo',
          'Take a photo closer to the landmark',
          'Try a different angle or lighting condition'
        ],
        recoverable: true,
        category: 'user',
        severity: 'low',
        timestamp: Date.now(),
        context: { ...context, stack: errorStack }
      };
    }

    // Generic system error
    return {
      code: 'SYSTEM_ERROR',
      message: errorMessage,
      userMessage: 'An unexpected error occurred. Please try again.',
      suggestions: [
        'Refresh the page and try again',
        'Clear browser cache and cookies',
        'Try using a different browser',
        'Contact support if the problem persists'
      ],
      recoverable: true,
      category: 'system',
      severity: 'high',
      timestamp: Date.now(),
      context: { ...context, stack: errorStack }
    };
  }

  /**
   * Handle specific API errors
   */
  private handleAPIError(errorMessage: string, context?: Record<string, any>): ErrorDetails {
    const lowerMessage = errorMessage.toLowerCase();

    // Google Vision API errors
    if (lowerMessage.includes('vision api') || lowerMessage.includes('invalid api key')) {
      return {
        code: 'VISION_API_ERROR',
        message: errorMessage,
        userMessage: 'Image recognition service is temporarily unavailable.',
        suggestions: [
          'Try again in a few minutes',
          'Use the State Explorer instead',
          'Contact support if the issue persists'
        ],
        recoverable: true,
        category: 'api',
        severity: 'high',
        timestamp: Date.now(),
        context
      };
    }

    // Wikipedia API errors
    if (lowerMessage.includes('wikipedia') || lowerMessage.includes('wiki')) {
      return {
        code: 'WIKIPEDIA_API_ERROR',
        message: errorMessage,
        userMessage: 'Could not fetch detailed information about this location.',
        suggestions: [
          'Basic landmark information is still available',
          'Try searching manually on Wikipedia',
          'Check back later for full details'
        ],
        recoverable: true,
        category: 'api',
        severity: 'medium',
        timestamp: Date.now(),
        context
      };
    }

    // Rate limiting
    if (lowerMessage.includes('rate limit') || lowerMessage.includes('quota')) {
      return {
        code: 'RATE_LIMIT_EXCEEDED',
        message: errorMessage,
        userMessage: 'Too many requests. Please wait a moment before trying again.',
        suggestions: [
          'Wait 1-2 minutes before trying again',
          'Use cached results if available',
          'Try using the State Explorer feature'
        ],
        recoverable: true,
        category: 'api',
        severity: 'medium',
        timestamp: Date.now(),
        context
      };
    }

    // Generic API error
    return {
      code: 'API_ERROR',
      message: errorMessage,
      userMessage: 'Service temporarily unavailable. Please try again.',
      suggestions: [
        'Try again in a few minutes',
        'Check your internet connection',
        'Use alternative features while we resolve this'
      ],
      recoverable: true,
      category: 'api',
      severity: 'medium',
      timestamp: Date.now(),
      context
    };
  }

  /**
   * Check if error is network-related
   */
  private isNetworkError(message: string): boolean {
    const networkKeywords = [
      'network', 'connection', 'timeout', 'offline', 'unreachable',
      'dns', 'fetch', 'cors', 'net::', 'failed to fetch'
    ];
    const lowerMessage = message.toLowerCase();
    return networkKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Check if error is API-related
   */
  private isAPIError(message: string): boolean {
    const apiKeywords = [
      'api', 'unauthorized', '401', '403', '429', '500', '502', '503',
      'rate limit', 'quota', 'invalid key', 'authentication'
    ];
    const lowerMessage = message.toLowerCase();
    return apiKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Check if error is permission-related
   */
  private isPermissionError(message: string): boolean {
    const permissionKeywords = [
      'permission', 'denied', 'blocked', 'geolocation', 'camera',
      'microphone', 'access denied', 'not allowed'
    ];
    const lowerMessage = message.toLowerCase();
    return permissionKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Check if error is validation-related
   */
  private isValidationError(message: string): boolean {
    const validationKeywords = [
      'invalid file', 'unsupported format', 'file too large',
      'invalid image', 'corrupt', 'validation failed'
    ];
    const lowerMessage = message.toLowerCase();
    return validationKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Check if error is user-related (no results found)
   */
  private isUserError(message: string): boolean {
    const userKeywords = [
      'no landmark', 'not found', 'low confidence', 'unclear image',
      'no results', 'cannot identify', 'recognition failed'
    ];
    const lowerMessage = message.toLowerCase();
    return userKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Log error details
   */
  private logError(errorDetails: ErrorDetails): void {
    this.errorLog.unshift(errorDetails);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.error('AR Error:', errorDetails);
    }
  }

  /**
   * Get error suggestions based on error type
   */
  getErrorSuggestions(errorCode: string): string[] {
    const errorMap: Record<string, string[]> = {
      'NETWORK_ERROR': [
        'Check your internet connection',
        'Try again in a few moments',
        'Switch to a different network'
      ],
      'VISION_API_ERROR': [
        'Try again later',
        'Use the State Explorer feature',
        'Upload a different image'
      ],
      'WIKIPEDIA_API_ERROR': [
        'Basic information is still available',
        'Try searching manually',
        'Check back later'
      ],
      'PERMISSION_DENIED': [
        'Allow camera/location permissions',
        'Check browser settings',
        'Refresh and try again'
      ],
      'NO_LANDMARK_DETECTED': [
        'Upload a clearer image',
        'Ensure landmark is visible',
        'Try different lighting/angle'
      ],
      'VALIDATION_ERROR': [
        'Check image format and size',
        'Try a different image',
        'Ensure file is not corrupted'
      ]
    };

    return errorMap[errorCode] || [
      'Try refreshing the page',
      'Clear browser cache',
      'Contact support if issue persists'
    ];
  }

  /**
   * Create user-friendly error message component data
   */
  formatErrorForUI(errorDetails: ErrorDetails): {
    title: string;
    message: string;
    suggestions: string[];
    canRetry: boolean;
    severity: string;
    icon: string;
  } {
    const icons = {
      network: '🌐',
      api: '⚠️',
      permission: '🔒',
      validation: '📁',
      user: '📷',
      system: '❌'
    };

    const titles = {
      network: 'Connection Issue',
      api: 'Service Unavailable',
      permission: 'Permission Required',
      validation: 'Invalid File',
      user: 'No Landmark Found',
      system: 'System Error'
    };

    return {
      title: titles[errorDetails.category] || 'Error',
      message: errorDetails.userMessage,
      suggestions: errorDetails.suggestions,
      canRetry: errorDetails.recoverable,
      severity: errorDetails.severity,
      icon: icons[errorDetails.category] || '❌'
    };
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByCategory: Record<string, number>;
    errorsBySeverity: Record<string, number>;
    recentErrors: ErrorDetails[];
  } {
    const errorsByCategory: Record<string, number> = {};
    const errorsBySeverity: Record<string, number> = {};

    for (const error of this.errorLog) {
      errorsByCategory[error.category] = (errorsByCategory[error.category] || 0) + 1;
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
    }

    return {
      totalErrors: this.errorLog.length,
      errorsByCategory,
      errorsBySeverity,
      recentErrors: this.errorLog.slice(0, 10)
    };
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Check if error is recoverable
   */
  isRecoverable(errorDetails: ErrorDetails): boolean {
    return errorDetails.recoverable;
  }

  /**
   * Get retry delay for specific error types
   */
  getRetryDelay(errorDetails: ErrorDetails): number {
    const delayMap: Record<string, number> = {
      'NETWORK_ERROR': 2000,
      'RATE_LIMIT_EXCEEDED': 60000, // 1 minute
      'API_ERROR': 5000,
      'SYSTEM_ERROR': 3000
    };

    return delayMap[errorDetails.code] || this.options.retryDelay;
  }

  /**
   * Create a retry function for failed operations
   */
  createRetryFunction<T>(
    operation: () => Promise<T>,
    errorContext?: Record<string, any>
  ): () => Promise<T> {
    return async (): Promise<T> => {
      let lastError: ErrorDetails | null = null;
      
      for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = this.handleError(error as Error, {
            ...errorContext,
            attempt: attempt + 1,
            maxRetries: this.options.maxRetries
          });

          if (!lastError.recoverable || attempt === this.options.maxRetries - 1) {
            throw error;
          }

          // Wait before retry
          const delay = this.getRetryDelay(lastError);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      throw new Error(lastError?.message || 'Max retries exceeded');
    };
  }
}

// Global error handler instance
const globalErrorHandler = new ARErrorHandler();

export default ARErrorHandler;
export { globalErrorHandler };
export type { ErrorDetails, ErrorHandlerOptions };