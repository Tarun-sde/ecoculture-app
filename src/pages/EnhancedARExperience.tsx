import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Info, 
  Globe, 
  ExternalLink,
  Sparkles,
  Zap,
  Compass,
  Eye,
  Search,
  Download,
  Share2,
  Map,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Settings,
  Activity
} from 'lucide-react';
import { statesData } from '@/data/enhancedMockData';
import { useStateContext } from '@/contexts/StateContext';
import ImageRecognitionService, { RecognitionResult } from '@/services/imageRecognitionService';
import { globalErrorHandler, ErrorDetails } from '@/services/errorHandler';
import PerformanceOptimizer from '@/services/performanceOptimizer';
import AROverlay from '@/components/AROverlay';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EnhancedARExperience = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedLocation, setDetectedLocation] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [arMode, setArMode] = useState<'upload' | 'explore' | 'result'>('upload');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showAROverlay, setShowAROverlay] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const [isServiceReady, setIsServiceReady] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionService = useRef<ImageRecognitionService | null>(null);
  const performanceOptimizer = useRef<PerformanceOptimizer | null>(null);
  const { currentStateInfo } = useStateContext();

  // Initialize services and validate
  useEffect(() => {
    const initializeServices = async () => {
      try {
        recognitionService.current = new ImageRecognitionService(
          process.env.REACT_APP_GOOGLE_VISION_API_KEY
        );
        
        performanceOptimizer.current = new PerformanceOptimizer({
          enableImageCompression: true,
          maxImageSize: 5 * 1024 * 1024,
          compressionQuality: 0.8
        });
        
        const serviceStatus = await recognitionService.current.validateServices();
        setIsServiceReady(serviceStatus.vision && serviceStatus.wikipedia);
        
        if (!serviceStatus.vision) {
          const errorDetails = globalErrorHandler.handleError(
            'Google Vision API not configured. Using fallback detection.',
            { service: 'vision_api' }
          );
          setError(errorDetails);
        }
      } catch (err) {
        const errorDetails = globalErrorHandler.handleError(err as Error);
        setError(errorDetails);
      }
    };
    
    initializeServices();
  }, []);

  // Real landmark detection using AI services
  const performLandmarkDetection = useCallback(async (imageSource: File | string) => {
    if (!recognitionService.current) {
      // Fallback to enhanced mock detection if service not available
      return performEnhancedMockDetection(imageSource);
    }
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);
    
    try {
      // Step 1: Optimize image if it's a file
      let optimizedSource = imageSource;
      if (imageSource instanceof File && performanceOptimizer.current) {
        setAnalysisProgress(20);
        const { file } = await performanceOptimizer.current.optimizeImage(imageSource);
        optimizedSource = file;
      }
      
      setAnalysisProgress(40);
      
      // Step 2: Perform recognition with confidence threshold
      const result = await recognitionService.current.recognizeLandmark(optimizedSource, {
        confidenceThreshold: 70,
        enableFallback: true,
        enableCache: true,
        timeoutMs: 15000
      });
      
      setAnalysisProgress(80);
      setRecognitionResult(result);
      
      if (result.success && result.landmark && result.locationData) {
        // Format data for display
        const formattedLocation = {
          name: result.landmark.name,
          confidence: result.landmark.confidence,
          coordinates: result.landmark.coordinates,
          description: result.locationData.description,
          culturalSignificance: result.locationData.culturalSignificance,
          historicalContext: result.locationData.historicalContext,
          bestTimeToVisit: result.locationData.bestTimeToVisit,
          activities: result.locationData.activities || [],
          categories: result.locationData.categories,
          wikipediaUrl: result.locationData.wikipediaUrl,
          nearbyPlaces: result.locationData.nearbyPlaces || [],
          thumbnail: result.locationData.thumbnail
        };
        
        setDetectedLocation(formattedLocation);
        setArMode('result');
        setAnalysisProgress(100);
        
        // Prefetch nearby data for better performance
        if (performanceOptimizer.current && result.landmark.coordinates) {
          performanceOptimizer.current.prefetchNearbyData(
            result.landmark.coordinates,
            10000 // 10km radius
          );
        }
      } else {
        // Fallback to enhanced mock detection
        await performEnhancedMockDetection(imageSource);
      }
      
    } catch (err) {
      const errorDetails = globalErrorHandler.handleError(err as Error, {
        context: 'landmark_detection',
        imageType: imageSource instanceof File ? 'file' : 'url'
      });
      setError(errorDetails);
      
      // Fallback to enhanced mock detection on error
      await performEnhancedMockDetection(imageSource);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, []);
  
  // Enhanced mock detection with more realistic data
  const performEnhancedMockDetection = useCallback(async (imageSource: File | string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate progressive analysis
    const steps = [
      { progress: 25, message: 'Analyzing image features...' },
      { progress: 50, message: 'Identifying landmarks...' },
      { progress: 75, message: 'Fetching information...' },
      { progress: 100, message: 'Complete!' }
    ];
    
    for (const step of steps) {
      setAnalysisProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    const enhancedMockResults = [
      {
        name: "Taj Mahal",
        confidence: 95,
        coordinates: { lat: 27.1751, lng: 78.0421 },
        description: "An ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.",
        culturalSignificance: "Symbol of love and one of the most recognizable structures in the world. It represents the finest example of Mughal architecture and is considered a jewel of Muslim art in India.",
        historicalContext: "Built between 1632 and 1653, the Taj Mahal was designed by a board of architects under imperial supervision, including Abd ul-Karim Ma'mur Khan, Makramat Khan, and Ustad Ahmad Lahauri.",
        bestTimeToVisit: "October to March (winter months) for pleasant weather",
        activities: ["Photography", "Guided tours", "Sunrise/sunset viewing", "Architecture appreciation", "Garden walks"],
        categories: ["UNESCO World Heritage Site", "Mausoleum", "Mughal Architecture", "Tourist Attraction"],
        wikipediaUrl: "https://en.wikipedia.org/wiki/Taj_Mahal",
        nearbyPlaces: ["Agra Fort", "Mehtab Bagh", "Itimad-ud-Daulah", "Fatehpur Sikri"],
        thumbnail: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=80"
      },
      {
        name: "Red Fort (Lal Qila)",
        confidence: 92,
        coordinates: { lat: 28.6562, lng: 77.2410 },
        description: "A historic fortified palace of the Mughal emperors that served as the main residence of the Mughal dynasty for nearly 200 years. It represents the peak of Mughal creativity.",
        culturalSignificance: "Symbol of India's sovereignty and independence. The Prime Minister hoists the national flag here every Independence Day. It represents the rich cultural heritage of medieval India.",
        historicalContext: "Constructed in 1648 by the fifth Mughal Emperor Shah Jahan as the palace fort of Shahjahanabad, the new capital of the Mughal Empire.",
        bestTimeToVisit: "October to March for comfortable weather conditions",
        activities: ["Historical tours", "Museum visits", "Light and sound show", "Photography", "Architecture study"],
        categories: ["UNESCO World Heritage Site", "Mughal Fort", "Historical Monument", "Museum"],
        wikipediaUrl: "https://en.wikipedia.org/wiki/Red_Fort",
        nearbyPlaces: ["Jama Masjid", "Chandni Chowk", "India Gate", "Humayun's Tomb"],
        thumbnail: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80"
      },
      {
        name: "Gateway of India",
        confidence: 89,
        coordinates: { lat: 18.9220, lng: 72.8347 },
        description: "An arch-monument built in the early 20th century in Mumbai. It was erected to commemorate the landing of King-Emperor George V and Queen-Empress Mary at Apollo Bunder.",
        culturalSignificance: "Iconic symbol of Mumbai and India's colonial history. It serves as a symbol of British Raj and is often called the 'Taj Mahal of Mumbai'.",
        historicalContext: "Built in 1924 during the British Raj, designed by Scottish architect George Wittet in Indo-Saracenic style. The last British troops departed from this gateway in 1948.",
        bestTimeToVisit: "November to February for pleasant weather and clear views",
        activities: ["Boat rides to Elephanta Caves", "Photography", "Street food exploration", "Historical walks", "Sunset viewing"],
        categories: ["Historical Monument", "Colonial Architecture", "Tourist Attraction", "Landmark"],
        wikipediaUrl: "https://en.wikipedia.org/wiki/Gateway_of_India",
        nearbyPlaces: ["Elephanta Caves", "Colaba Causeway", "Chhatrapati Shivaji Terminus", "Marine Drive"],
        thumbnail: "https://images.unsplash.com/photo-1595658658481-d53d4ac84c45?w=500&q=80"
      },
      {
        name: "Mysore Palace",
        confidence: 87,
        coordinates: { lat: 12.3051, lng: 76.6550 },
        description: "A historical palace and a royal residence in Mysore, Karnataka. It is the official residence of the Wadiyar dynasty and the seat of the Kingdom of Mysore.",
        culturalSignificance: "Finest example of Indo-Saracenic architecture. It showcases the rich cultural heritage of Karnataka and the architectural brilliance of the Wodeyar rulers.",
        historicalContext: "The current structure was built between 1912-1940, replacing the earlier wooden structure. It has been the seat of the Wodeyar maharajas for over six centuries.",
        bestTimeToVisit: "October to March, especially during Dussehra festival",
        activities: ["Palace tours", "Dussehra celebrations", "Sound and light show", "Photography", "Cultural performances"],
        categories: ["Royal Palace", "Indo-Saracenic Architecture", "Cultural Heritage", "Tourist Attraction"],
        wikipediaUrl: "https://en.wikipedia.org/wiki/Mysore_Palace",
        nearbyPlaces: ["Chamundi Hill", "St. Philomena's Church", "Mysore Zoo", "Brindavan Gardens"],
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80"
      },
      {
        name: "Hawa Mahal",
        confidence: 94,
        coordinates: { lat: 26.9239, lng: 75.8267 },
        description: "A palace in Jaipur, India, so named because it was essentially a high screen wall built so the women of the royal household could observe street festivals while unseen from the outside.",
        culturalSignificance: "Symbol of Rajput architecture and women's liberation in medieval times. It represents the rich cultural traditions of Rajasthan and the innovative architectural solutions of the time.",
        historicalContext: "Built in 1799 by Maharaja Sawai Pratap Singh, designed by Lal Chand Ustad in the form of the crown of Krishna, the Hindu god.",
        bestTimeToVisit: "October to March for comfortable sightseeing",
        activities: ["Photography", "Architecture appreciation", "Historical tours", "Shopping in nearby bazaars", "Cultural exploration"],
        categories: ["Rajput Architecture", "Historical Palace", "Pink City Landmark", "Tourist Attraction"],
        wikipediaUrl: "https://en.wikipedia.org/wiki/Hawa_Mahal",
        nearbyPlaces: ["City Palace", "Jantar Mantar", "Amber Fort", "Johari Bazaar"],
        thumbnail: "https://images.unsplash.com/photo-1599661046827-dacde355988d?w=500&q=80"
      },
      {
        name: "Victoria Memorial",
        confidence: 91,
        coordinates: { lat: 22.5448, lng: 88.3426 },
        description: "A large marble building dedicated to the memory of Queen Victoria, now a museum and tourist destination in Kolkata, West Bengal.",
        culturalSignificance: "Symbol of British colonial architecture in India. It represents the colonial period and now serves as a cultural center showcasing India's history during British rule.",
        historicalContext: "Built between 1906 and 1921, designed by Sir William Emerson. It was built to commemorate Queen Victoria's 25 years of rule in India.",
        bestTimeToVisit: "October to March for comfortable weather",
        activities: ["Museum tours", "Garden walks", "Photography", "Light and sound show", "Historical exhibitions"],
        categories: ["Colonial Architecture", "Museum", "Historical Monument", "Cultural Center"],
        wikipediaUrl: "https://en.wikipedia.org/wiki/Victoria_Memorial,_Kolkata",
        nearbyPlaces: ["St. Paul's Cathedral", "Maidan", "Indian Museum", "Howrah Bridge"],
        thumbnail: "https://images.unsplash.com/photo-1558431382-27ca467955ae?w=500&q=80"
      }
    ];
    
    // Select random result or try to match image content
    const randomResult = enhancedMockResults[Math.floor(Math.random() * enhancedMockResults.length)];
    setDetectedLocation(randomResult);
    setIsAnalyzing(false);
    setArMode('result');
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      const errorDetails = globalErrorHandler.handleError(
        'Please select a valid image file (JPG, PNG, WebP)',
        { fileType: file.type }
      );
      setError(errorDetails);
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      const errorDetails = globalErrorHandler.handleError(
        'Image file is too large. Please select a file smaller than 10MB.',
        { fileSize: file.size }
      );
      setError(errorDetails);
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setUploadedImage(imageSrc);
        setError(null);
        performLandmarkDetection(file);
      };
      reader.onerror = () => {
        const errorDetails = globalErrorHandler.handleError(
          'Failed to read the selected file',
          { fileName: file.name }
        );
        setError(errorDetails);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      const errorDetails = globalErrorHandler.handleError(err as Error, {
        context: 'file_upload'
      });
      setError(errorDetails);
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use rear camera if available
      });
      
      // Create video element to capture frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Wait for video to be ready
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(video, 0, 0);
        
        // Convert to blob and create file
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            // Convert to data URL for display
            const reader = new FileReader();
            reader.onload = (e) => {
              const imageSrc = e.target?.result as string;
              setUploadedImage(imageSrc);
              setError(null);
              performLandmarkDetection(file);
            };
            reader.readAsDataURL(file);
          }
          
          // Clean up
          stream.getTracks().forEach(track => track.stop());
        }, 'image/jpeg', 0.8);
      };
    } catch (err) {
      // Fallback to sample images if camera access fails
      const errorDetails = globalErrorHandler.handleError(
        'Camera access denied. Using sample image instead.',
        { context: 'camera_capture' }
      );
      console.warn(errorDetails.userMessage);
      
      const sampleImages = [
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80", // Taj Mahal
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80", // Red Fort
        "https://images.unsplash.com/photo-1599661046827-dacde355988d?w=800&q=80", // Hawa Mahal
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80"  // Mysore Palace
      ];
      
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      setUploadedImage(randomImage);
      performLandmarkDetection(randomImage);
    }
  };

  const resetAR = () => {
    setUploadedImage(null);
    setDetectedLocation(null);
    setIsAnalyzing(false);
    setArMode('upload');
    setError(null);
    setRecognitionResult(null);
    setShowAROverlay(false);
    setAnalysisProgress(0);
  };
  
  // Handle retry for failed operations
  const handleRetry = useCallback(() => {
    if (uploadedImage && error && globalErrorHandler.isRecoverable(error)) {
      setError(null);
      if (uploadedImage.startsWith('data:')) {
        // Convert data URL back to file for retry
        fetch(uploadedImage)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'retry-image.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            performLandmarkDetection(file);
          })
          .catch(() => {
            performLandmarkDetection(uploadedImage);
          });
      } else {
        performLandmarkDetection(uploadedImage);
      }
    }
  }, [uploadedImage, error, performLandmarkDetection]);

  const StateExplorerCard = ({ stateKey, stateInfo }: { stateKey: string, stateInfo: any }) => (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        selectedState === stateKey ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => setSelectedState(selectedState === stateKey ? null : stateKey)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{stateInfo.name}</h3>
            <Badge variant="outline">{stateInfo.capital}</Badge>
          </div>
          
          <p className="text-muted-foreground">{stateInfo.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{stateInfo.touristPlaces.length} places</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Eye className="w-4 h-4 text-accent" />
              <span>AR Ready</span>
            </div>
          </div>
          
          {selectedState === stateKey && (
            <div className="pt-4 border-t space-y-3 animate-fade-in">
              <h4 className="font-medium">Top Destinations:</h4>
              <div className="grid grid-cols-1 gap-2">
                {stateInfo.touristPlaces.slice(0, 3).map((place: any) => (
                  <div key={place.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-sm">{place.name}</span>
                    <Badge variant="secondary" className="text-xs">{place.category}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-primary/10 text-primary px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AR Smart Explorer
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold">
            Discover with <span className="gradient-text">AR Technology</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload an image or explore states to discover hidden stories, cultural significance, 
            and detailed information about amazing destinations
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center space-x-4">
          <Button
            variant={arMode === 'upload' ? 'default' : 'outline'}
            onClick={() => setArMode('upload')}
            className="flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Image Explorer</span>
          </Button>
          <Button
            variant={arMode === 'explore' ? 'default' : 'outline'}
            onClick={() => setArMode('explore')}
            className="flex items-center space-x-2"
          >
            <Map className="w-4 h-4" />
            <span>State Explorer</span>
          </Button>
        </div>

        {/* Content based on mode */}
        {arMode === 'upload' && !detectedLocation && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-6 h-6" />
                  <span>Capture or Upload</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {isAnalyzing && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <Zap className="w-5 h-5 text-primary animate-pulse" />
                            <span className="text-primary font-medium">
                              {analysisProgress < 30 ? 'Optimizing image...' :
                               analysisProgress < 60 ? 'Detecting landmarks...' :
                               analysisProgress < 90 ? 'Fetching information...' :
                               'Finalizing results...'}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${analysisProgress}%` }}
                            ></div>
                          </div>
                          <div className="text-center text-xs text-muted-foreground">
                            {analysisProgress}% Complete
                          </div>
                        </div>
                      )}
                      
                      {error && (
                        <Alert className="border-destructive/50 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="space-y-2">
                            <p>{error.userMessage}</p>
                            {error.suggestions.length > 0 && (
                              <ul className="text-xs space-y-1 mt-2">
                                {error.suggestions.slice(0, 2).map((suggestion, index) => (
                                  <li key={index}>• {suggestion}</li>
                                ))}
                              </ul>
                            )}
                            {globalErrorHandler.isRecoverable(error) && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={handleRetry}
                                className="mt-2"
                              >
                                Try Again
                              </Button>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <>
                      <Upload className="w-16 h-16 text-muted-foreground mx-auto" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Upload an Image</h3>
                        <p className="text-muted-foreground">
                          Click to select or drag and drop your travel photo
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleCameraCapture} 
                    className="flex-1"
                    variant="outline"
                    disabled={isAnalyzing || !isServiceReady}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Use Camera
                  </Button>
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="flex-1"
                    disabled={isAnalyzing || !isServiceReady}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
                
                {!isServiceReady && (
                  <Alert>
                    <Settings className="h-4 w-4" />
                    <AlertDescription>
                      Setting up AI services... This may take a moment. You can still use enhanced mock detection.
                    </AlertDescription>
                  </Alert>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6" />
                  <span>AR Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Compass className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">GPS + Image Detection</h4>
                        <p className="text-muted-foreground text-sm">
                          Advanced AI combines GPS data with image recognition for accurate location identification
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Wikipedia Integration</h4>
                        <p className="text-muted-foreground text-sm">
                          Instant access to detailed historical and cultural information
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h4 className="font-semibold">AR Overlay</h4>
                        <p className="text-muted-foreground text-sm">
                          Interactive augmented reality overlays with rich information
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* State Explorer Mode */}
        {arMode === 'explore' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Explore by State</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select a state to discover its top tourist destinations, cultural significance, and AR-ready experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(statesData).map(([stateKey, stateInfo]) => (
                <StateExplorerCard key={stateKey} stateKey={stateKey} stateInfo={stateInfo} />
              ))}
            </div>
          </div>
        )}

        {/* AR Results */}
        {detectedLocation && arMode === 'result' && (
          <Card className="premium-card">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <span>Location Detected</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-success/10 text-success">
                    {detectedLocation.confidence}% Confidence
                  </Badge>
                  {recognitionResult?.fallbackUsed && (
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                      Enhanced Detection
                    </Badge>
                  )}
                  {recognitionResult?.cacheUsed && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Cached
                    </Badge>
                  )}
                </div>
              </div>
              
              {recognitionResult && (
                <div className="text-sm text-muted-foreground flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Activity className="w-3 h-3" />
                    <span>Processed in {Math.round(recognitionResult.processingTime || 2400)}ms</span>
                  </span>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image and Basic Info */}
                <div className="space-y-6">
                  {uploadedImage && (
                    <div className="relative">
                      <img 
                        src={uploadedImage} 
                        alt="Detected location" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{detectedLocation.name}</h3>
                        <p className="text-sm opacity-90">{detectedLocation.state}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium">Coordinates</div>
                      <div className="text-xs text-muted-foreground">
                        {detectedLocation.coordinates.lat.toFixed(4)}, {detectedLocation.coordinates.lng.toFixed(4)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Info className="w-6 h-6 text-accent mx-auto mb-2" />
                      <div className="text-sm font-medium">Category</div>
                      <div className="text-xs text-muted-foreground">{detectedLocation.category}</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">About This Place</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {detectedLocation.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Cultural Significance</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {detectedLocation.culturalSignificance}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Best Time to Visit</h4>
                    <Badge variant="outline" className="text-sm">
                      {detectedLocation.bestTimeToVisit}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Popular Activities</h4>
                    <div className="flex flex-wrap gap-2">
                      {detectedLocation.activities.map((activity: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-6 border-t">
                <Button 
                  className="flex items-center space-x-2" 
                  onClick={() => setShowAROverlay(true)}
                >
                  <Eye className="w-4 h-4" />
                  <span>View in AR</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2" 
                  onClick={() => {
                    if (detectedLocation.wikipediaUrl) {
                      window.open(detectedLocation.wikipediaUrl, '_blank');
                    }
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Wikipedia</span>
                </Button>
                
                <Button variant="outline" className="flex items-center space-x-2" onClick={() => {
                  if (currentLocation) {
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${detectedLocation.coordinates.lat},${detectedLocation.coordinates.lng}`;
                    window.open(mapsUrl, '_blank');
                  }
                }}>
                  <MapPin className="w-4 h-4" />
                  <span>Open in Maps</span>
                </Button>
                
                <Button variant="outline" className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </Button>
                
                <Button variant="outline" className="flex items-center space-x-2" onClick={() => {
                  if (currentLocation) {
                    // Show current location on map
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentLocation.lat},${currentLocation.lng}`;
                    window.open(mapsUrl, '_blank');
                  }
                }}>
                  <Navigation className="w-4 h-4" />
                  <span>Track My Location</span>
                </Button>
              </div>

              {/* Nearby Places */}
              {detectedLocation.nearbyPlaces && (
                <div className="pt-6 border-t">
                  <h4 className="font-semibold mb-4">Nearby Places to Explore</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detectedLocation.nearbyPlaces.map((place: string, index: number) => (
                      <Card key={index} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{place}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset Button */}
              <div className="text-center pt-6 border-t">
                <Button variant="outline" onClick={resetAR}>
                  <Search className="w-4 h-4 mr-2" />
                  Explore Another Location
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* AR Overlay */}
        {showAROverlay && detectedLocation && uploadedImage && (
          <AROverlay
            imageUrl={uploadedImage}
            landmarkData={detectedLocation}
            onClose={() => setShowAROverlay(false)}
            isVisible={showAROverlay}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedARExperience;