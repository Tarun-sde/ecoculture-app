interface VisionAPIResponse {
  landmarkAnnotations?: Array<{
    description: string;
    score: number;
    locations?: Array<{
      latLng: {
        latitude: number;
        longitude: number;
      };
    }>;
  }>;
  textAnnotations?: Array<{
    description: string;
    locale?: string;
  }>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

interface DetectedLandmark {
  name: string;
  confidence: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  source: 'google_vision' | 'fallback';
  rawResponse?: any;
}

class GoogleVisionService {
  private apiKey: string;
  private apiUrl: string;
  private confidenceThreshold: number;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.REACT_APP_GOOGLE_VISION_API_KEY || '';
    this.apiUrl = 'https://vision.googleapis.com/v1/images:annotate';
    this.confidenceThreshold = 0.7; // 70% confidence threshold
  }

  /**
   * Convert image file to base64 string for API submission
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convert image URL to base64 string
   */
  private async urlToBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Failed to convert URL to base64: ${error}`);
    }
  }

  /**
   * Detect landmarks in an image using Google Vision API
   */
  async detectLandmarks(
    imageSource: File | string,
    maxResults: number = 5
  ): Promise<DetectedLandmark[]> {
    if (!this.apiKey) {
      throw new Error('Google Vision API key is not configured');
    }

    try {
      // Convert image to base64
      let base64Image: string;
      if (imageSource instanceof File) {
        base64Image = await this.fileToBase64(imageSource);
      } else {
        base64Image = await this.urlToBase64(imageSource);
      }

      // Prepare API request
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              {
                type: 'LANDMARK_DETECTION',
                maxResults: maxResults
              },
              {
                type: 'TEXT_DETECTION',
                maxResults: 5
              }
            ]
          }
        ]
      };

      // Make API call
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Google Vision API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.responses?.[0]?.error) {
        throw new Error(`Vision API error: ${data.responses[0].error.message}`);
      }

      return this.processVisionResponse(data.responses[0]);

    } catch (error) {
      console.error('Google Vision API error:', error);
      throw error;
    }
  }

  /**
   * Process Google Vision API response and extract landmark information
   */
  private processVisionResponse(response: VisionAPIResponse): DetectedLandmark[] {
    const landmarks: DetectedLandmark[] = [];

    // Process landmark annotations
    if (response.landmarkAnnotations && response.landmarkAnnotations.length > 0) {
      for (const landmark of response.landmarkAnnotations) {
        if (landmark.score >= this.confidenceThreshold) {
          const coordinates = landmark.locations?.[0]?.latLng;
          
          if (coordinates) {
            landmarks.push({
              name: landmark.description,
              confidence: Math.round(landmark.score * 100),
              coordinates: {
                lat: coordinates.latitude,
                lng: coordinates.longitude
              },
              source: 'google_vision',
              rawResponse: landmark
            });
          }
        }
      }
    }

    // If no landmarks found with high confidence, try to extract from text
    if (landmarks.length === 0 && response.textAnnotations) {
      const textContent = response.textAnnotations[0]?.description || '';
      const potentialLandmark = this.extractLandmarkFromText(textContent);
      
      if (potentialLandmark) {
        landmarks.push(potentialLandmark);
      }
    }

    return landmarks.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Extract potential landmark information from text detection
   */
  private extractLandmarkFromText(text: string): DetectedLandmark | null {
    // This is a simplified implementation
    // In production, you'd use more sophisticated NLP
    const landmarkKeywords = [
      'temple', 'fort', 'palace', 'monument', 'hill', 'mountain',
      'sanctuary', 'park', 'beach', 'lake', 'waterfall'
    ];

    const lowercaseText = text.toLowerCase();
    const foundKeyword = landmarkKeywords.find(keyword => 
      lowercaseText.includes(keyword)
    );

    if (foundKeyword) {
      return {
        name: text.split('\n')[0] || 'Unknown Location',
        confidence: 60, // Lower confidence for text-based detection
        coordinates: {
          lat: 0,
          lng: 0
        },
        source: 'fallback'
      };
    }

    return null;
  }

  /**
   * Validate API key
   */
  async validateApiKey(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      // Test with a small dummy request
      const testResponse = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R/aQVXX4bcfVPGGV'
              },
              features: [{ type: 'LANDMARK_DETECTION', maxResults: 1 }]
            }
          ]
        })
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Set confidence threshold for landmark detection
   */
  setConfidenceThreshold(threshold: number): void {
    if (threshold >= 0 && threshold <= 1) {
      this.confidenceThreshold = threshold;
    }
  }

  /**
   * Get current confidence threshold
   */
  getConfidenceThreshold(): number {
    return this.confidenceThreshold;
  }
}

export default GoogleVisionService;
export type { DetectedLandmark };