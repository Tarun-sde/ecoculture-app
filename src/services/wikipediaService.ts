interface WikipediaSearchResult {
  pageid: number;
  title: string;
  snippet: string;
  size: number;
  wordcount: number;
  timestamp: string;
}

interface WikipediaPage {
  pageid: number;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageimage?: string;
  coordinates?: Array<{
    lat: number;
    lon: number;
    primary?: boolean;
    globe: string;
  }>;
  categories?: Array<{
    title: string;
  }>;
}

interface WikipediaGeosearchResult {
  pageid: number;
  title: string;
  lat: number;
  lon: number;
  dist: number;
  primary?: boolean;
}

interface EnrichedLocationData {
  title: string;
  description: string;
  fullDescription: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  categories: string[];
  thumbnail?: string;
  wikipediaUrl: string;
  nearbyPlaces: string[];
  culturalSignificance?: string;
  historicalContext?: string;
  bestTimeToVisit?: string;
  activities?: string[];
  accessibility?: string;
  languages: string[];
  lastUpdated: string;
}

class WikipediaService {
  private baseUrl = 'https://en.wikipedia.org/api/rest_v1';
  private apiUrl = 'https://en.wikipedia.org/w/api.php';
  private requestTimeout = 10000; // 10 seconds

  /**
   * Search for Wikipedia articles by title/keyword
   */
  async searchByTitle(
    query: string, 
    limit: number = 5,
    language: string = 'en'
  ): Promise<WikipediaSearchResult[]> {
    try {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: query,
        srlimit: limit.toString(),
        origin: '*'
      });

      const response = await fetch(`${this.apiUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(this.requestTimeout)
      });

      if (!response.ok) {
        throw new Error(`Wikipedia search failed: ${response.status}`);
      }

      const data = await response.json();
      return data.query?.search || [];

    } catch (error) {
      console.error('Wikipedia search error:', error);
      throw new Error(`Failed to search Wikipedia: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for Wikipedia articles by geographic coordinates
   */
  async searchByCoordinates(
    lat: number,
    lng: number,
    radius: number = 10000, // 10km default
    limit: number = 10
  ): Promise<WikipediaGeosearchResult[]> {
    try {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        list: 'geosearch',
        gscoord: `${lat}|${lng}`,
        gsradius: radius.toString(),
        gslimit: limit.toString(),
        origin: '*'
      });

      const response = await fetch(`${this.apiUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(this.requestTimeout)
      });

      if (!response.ok) {
        throw new Error(`Wikipedia geosearch failed: ${response.status}`);
      }

      const data = await response.json();
      return data.query?.geosearch || [];

    } catch (error) {
      console.error('Wikipedia geosearch error:', error);
      throw new Error(`Failed to search Wikipedia by coordinates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get detailed information about a Wikipedia page
   */
  async getPageDetails(
    pageId: number | string,
    language: string = 'en'
  ): Promise<WikipediaPage | null> {
    try {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        pageids: pageId.toString(),
        prop: 'extracts|pageimages|coordinates|categories',
        exintro: 'true',
        explaintext: 'true',
        exlimit: '1',
        piprop: 'thumbnail',
        pithumbsize: '500',
        cllimit: 'max',
        origin: '*'
      });

      const response = await fetch(`${this.apiUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(this.requestTimeout)
      });

      if (!response.ok) {
        throw new Error(`Wikipedia page details failed: ${response.status}`);
      }

      const data = await response.json();
      const pages = data.query?.pages;
      
      if (!pages) return null;

      const pageData = Object.values(pages)[0] as any;
      
      if (!pageData || pageData.missing) return null;

      return {
        pageid: pageData.pageid,
        title: pageData.title,
        extract: pageData.extract || '',
        thumbnail: pageData.thumbnail,
        pageimage: pageData.pageimage,
        coordinates: pageData.coordinates,
        categories: pageData.categories
      };

    } catch (error) {
      console.error('Wikipedia page details error:', error);
      throw new Error(`Failed to get Wikipedia page details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get enriched location data combining multiple Wikipedia APIs
   */
  async getEnrichedLocationData(
    landmarkName: string,
    coordinates?: { lat: number; lng: number }
  ): Promise<EnrichedLocationData | null> {
    try {
      // First, search by title
      const searchResults = await this.searchByTitle(landmarkName, 3);
      
      if (searchResults.length === 0) {
        // If no title search results, try coordinate search if available
        if (coordinates) {
          const geoResults = await this.searchByCoordinates(
            coordinates.lat, 
            coordinates.lng, 
            5000, 
            5
          );
          
          if (geoResults.length === 0) return null;
          
          // Use the closest result
          const closestResult = geoResults[0];
          const pageDetails = await this.getPageDetails(closestResult.pageid);
          
          if (!pageDetails) return null;
          
          return this.formatEnrichedData(pageDetails, {
            lat: closestResult.lat,
            lng: closestResult.lon
          });
        }
        return null;
      }

      // Get detailed information for the best match
      const bestMatch = searchResults[0];
      const pageDetails = await this.getPageDetails(bestMatch.pageid);
      
      if (!pageDetails) return null;

      // If we have coordinates, also get nearby places
      let nearbyPlaces: string[] = [];
      let pageCoordinates = coordinates;

      if (pageDetails.coordinates && pageDetails.coordinates.length > 0) {
        pageCoordinates = {
          lat: pageDetails.coordinates[0].lat,
          lng: pageDetails.coordinates[0].lon
        };
      }

      if (pageCoordinates) {
        const nearby = await this.searchByCoordinates(
          pageCoordinates.lat,
          pageCoordinates.lng,
          10000,
          8
        );
        
        nearbyPlaces = nearby
          .filter(place => place.title !== pageDetails.title)
          .slice(0, 5)
          .map(place => place.title);
      }

      return this.formatEnrichedData(pageDetails, pageCoordinates, nearbyPlaces);

    } catch (error) {
      console.error('Get enriched location data error:', error);
      return null;
    }
  }

  /**
   * Format Wikipedia data into enriched location data structure
   */
  private formatEnrichedData(
    pageDetails: WikipediaPage,
    coordinates?: { lat: number; lng: number },
    nearbyPlaces: string[] = []
  ): EnrichedLocationData {
    const categories = pageDetails.categories
      ?.map(cat => cat.title.replace('Category:', ''))
      .filter(cat => !cat.startsWith('CS1') && !cat.startsWith('Articles'))
      .slice(0, 5) || [];

    // Extract specific information from the description
    const extract = pageDetails.extract;
    const culturalInfo = this.extractCulturalSignificance(extract);
    const historicalInfo = this.extractHistoricalContext(extract);
    const visitInfo = this.extractVisitingInfo(extract);
    const activities = this.extractActivities(extract, categories);

    return {
      title: pageDetails.title,
      description: this.createShortDescription(extract),
      fullDescription: extract,
      coordinates,
      categories,
      thumbnail: pageDetails.thumbnail?.source,
      wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(pageDetails.title)}`,
      nearbyPlaces,
      culturalSignificance: culturalInfo,
      historicalContext: historicalInfo,
      bestTimeToVisit: visitInfo.bestTime,
      activities: activities,
      accessibility: visitInfo.accessibility,
      languages: ['English'], // Default, could be enhanced
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Create a short description from the full extract
   */
  private createShortDescription(extract: string): string {
    if (!extract) return 'No description available';
    
    const sentences = extract.split('.').filter(s => s.trim().length > 0);
    const shortDesc = sentences.slice(0, 2).join('.').trim();
    
    return shortDesc.length > 200 
      ? shortDesc.substring(0, 197) + '...'
      : shortDesc + '.';
  }

  /**
   * Extract cultural significance from text
   */
  private extractCulturalSignificance(text: string): string | undefined {
    const culturalKeywords = [
      'cultural', 'religious', 'spiritual', 'sacred', 'traditional',
      'heritage', 'ritual', 'ceremony', 'pilgrimage', 'worship',
      'tribal', 'indigenous', 'ancient', 'mythology', 'legend'
    ];

    const sentences = text.split('.').filter(s => s.trim().length > 0);
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if (culturalKeywords.some(keyword => lowerSentence.includes(keyword))) {
        return sentence.trim() + '.';
      }
    }

    return undefined;
  }

  /**
   * Extract historical context from text
   */
  private extractHistoricalContext(text: string): string | undefined {
    const historicalKeywords = [
      'built', 'constructed', 'founded', 'established', 'century',
      'empire', 'dynasty', 'king', 'ruler', 'battle', 'war',
      'colonial', 'independence', 'historical', 'ancient'
    ];

    const sentences = text.split('.').filter(s => s.trim().length > 0);
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if (historicalKeywords.some(keyword => lowerSentence.includes(keyword))) {
        return sentence.trim() + '.';
      }
    }

    return undefined;
  }

  /**
   * Extract visiting information
   */
  private extractVisitingInfo(text: string): { bestTime?: string; accessibility?: string } {
    const result: { bestTime?: string; accessibility?: string } = {};

    // Look for time-related information
    const timeRegex = /(best time|visit|season|month|weather|climate)/i;
    const sentences = text.split('.').filter(s => s.trim().length > 0);

    for (const sentence of sentences) {
      if (timeRegex.test(sentence)) {
        result.bestTime = sentence.trim() + '.';
        break;
      }
    }

    // Look for accessibility information
    const accessRegex = /(access|reach|transport|road|railway|airport)/i;
    for (const sentence of sentences) {
      if (accessRegex.test(sentence)) {
        result.accessibility = sentence.trim() + '.';
        break;
      }
    }

    return result;
  }

  /**
   * Extract activities from text and categories
   */
  private extractActivities(text: string, categories: string[]): string[] {
    const activities: Set<string> = new Set();

    // From categories
    const categoryActivities = {
      'tourist attractions': ['Sightseeing', 'Photography'],
      'national parks': ['Wildlife viewing', 'Nature walks', 'Hiking'],
      'temples': ['Spiritual visits', 'Architecture viewing'],
      'forts': ['Historical tours', 'Photography'],
      'museums': ['Educational tours', 'Cultural exploration'],
      'beaches': ['Swimming', 'Sunbathing', 'Water sports'],
      'mountains': ['Trekking', 'Climbing', 'Scenic views'],
      'waterfalls': ['Nature viewing', 'Photography', 'Swimming']
    };

    for (const category of categories) {
      const lowerCategory = category.toLowerCase();
      for (const [key, acts] of Object.entries(categoryActivities)) {
        if (lowerCategory.includes(key)) {
          acts.forEach(act => activities.add(act));
        }
      }
    }

    // From text content
    const activityKeywords = {
      'trek': 'Trekking',
      'hik': 'Hiking',
      'climb': 'Climbing',
      'swim': 'Swimming',
      'photograph': 'Photography',
      'wildlife': 'Wildlife viewing',
      'bird': 'Bird watching',
      'adventure': 'Adventure sports',
      'meditation': 'Meditation',
      'yoga': 'Yoga',
      'festival': 'Cultural festivals'
    };

    const lowerText = text.toLowerCase();
    for (const [keyword, activity] of Object.entries(activityKeywords)) {
      if (lowerText.includes(keyword)) {
        activities.add(activity);
      }
    }

    return Array.from(activities).slice(0, 6); // Limit to 6 activities
  }

  /**
   * Check if Wikipedia service is available
   */
  async isServiceAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}?action=query&format=json&meta=siteinfo&origin=*`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default WikipediaService;
export type { EnrichedLocationData, WikipediaSearchResult, WikipediaPage };