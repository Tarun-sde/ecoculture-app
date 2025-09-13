import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  X, 
  MapPin, 
  Info, 
  Globe, 
  Star,
  Clock,
  Camera,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Share2,
  Bookmark,
  Navigation,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface AROverlayProps {
  imageUrl: string;
  landmarkData: {
    name: string;
    confidence: number;
    coordinates: { lat: number; lng: number };
    description: string;
    culturalSignificance?: string;
    historicalContext?: string;
    bestTimeToVisit?: string;
    activities?: string[];
    categories: string[];
    wikipediaUrl?: string;
    nearbyPlaces?: string[];
    thumbnail?: string;
  };
  onClose: () => void;
  isVisible: boolean;
}

interface HotspotPosition {
  x: number;
  y: number;
  id: string;
  type: 'info' | 'historical' | 'cultural' | 'activity';
  content: string;
  title: string;
}

const AROverlay: React.FC<AROverlayProps> = ({
  imageUrl,
  landmarkData,
  onClose,
  isVisible
}) => {
  const [overlayMode, setOverlayMode] = useState<'minimal' | 'detailed' | 'immersive'>('minimal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();

  // Generate hotspots based on landmark data
  const generateHotspots = useCallback((): HotspotPosition[] => {
    const hotspots: HotspotPosition[] = [];

    // Main landmark info hotspot (center)
    hotspots.push({
      x: 50,
      y: 40,
      id: 'main-info',
      type: 'info',
      title: landmarkData.name,
      content: landmarkData.description
    });

    // Historical context hotspot (if available)
    if (landmarkData.historicalContext) {
      hotspots.push({
        x: 25,
        y: 25,
        id: 'historical',
        type: 'historical',
        title: 'Historical Context',
        content: landmarkData.historicalContext
      });
    }

    // Cultural significance hotspot (if available)
    if (landmarkData.culturalSignificance) {
      hotspots.push({
        x: 75,
        y: 30,
        id: 'cultural',
        type: 'cultural',
        title: 'Cultural Significance',
        content: landmarkData.culturalSignificance
      });
    }

    // Activities hotspot (if available)
    if (landmarkData.activities && landmarkData.activities.length > 0) {
      hotspots.push({
        x: 60,
        y: 70,
        id: 'activities',
        type: 'activity',
        title: 'Activities',
        content: landmarkData.activities.join(', ')
      });
    }

    return hotspots;
  }, [landmarkData]);

  const [hotspots] = useState<HotspotPosition[]>(generateHotspots());

  // Animation effect for immersive mode
  useEffect(() => {
    if (overlayMode === 'immersive' && isPlaying) {
      const animate = () => {
        setAnimationProgress(prev => {
          const next = prev + 0.02;
          return next > 1 ? 0 : next;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [overlayMode, isPlaying]);

  // Handle image dragging for zoom mode
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (imageZoom > 1) {
      setIsDragging(true);
      e.preventDefault();
    }
  }, [imageZoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && imageZoom > 1) {
      setImagePosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  }, [isDragging, imageZoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Audio narration (mock implementation)
  const toggleAudio = useCallback(() => {
    if (audioEnabled) {
      setAudioEnabled(false);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setAudioEnabled(true);
      // In a real implementation, you would use text-to-speech API
      console.log('Starting audio narration for:', landmarkData.name);
    }
  }, [audioEnabled, landmarkData.name]);

  // Share functionality
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Discovered: ${landmarkData.name}`,
          text: landmarkData.description,
          url: landmarkData.wikipediaUrl || window.location.href
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Discovered: ${landmarkData.name}\n${landmarkData.description}\n${landmarkData.wikipediaUrl || ''}`;
      navigator.clipboard.writeText(shareText);
    }
  }, [landmarkData]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, [isFullscreen]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setImageZoom(prev => Math.min(prev + 0.5, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setImageZoom(prev => Math.max(prev - 0.5, 1));
    if (imageZoom <= 1.5) {
      setImagePosition({ x: 0, y: 0 });
    }
  }, [imageZoom]);

  const resetView = useCallback(() => {
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-all duration-500 ${
        isFullscreen ? 'p-0' : 'p-4'
      }`}
    >
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Star className="w-3 h-3 mr-1" />
            {landmarkData.confidence}% Confidence
          </Badge>
          <Badge variant="outline" className="text-white border-white/30">
            AR Mode
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mode Toggle */}
          <div className="flex items-center bg-black/50 rounded-lg p-1">
            <Button
              size="sm"
              variant={overlayMode === 'minimal' ? 'default' : 'ghost'}
              onClick={() => setOverlayMode('minimal')}
              className="text-white text-xs"
            >
              Minimal
            </Button>
            <Button
              size="sm"
              variant={overlayMode === 'detailed' ? 'default' : 'ghost'}
              onClick={() => setOverlayMode('detailed')}
              className="text-white text-xs"
            >
              Detailed
            </Button>
            <Button
              size="sm"
              variant={overlayMode === 'immersive' ? 'default' : 'ghost'}
              onClick={() => setOverlayMode('immersive')}
              className="text-white text-xs"
            >
              Immersive
            </Button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={toggleAudio}
            className="text-white"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFullscreen}
            className="text-white"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full pt-16">
        {/* Image Container */}
        <div className="flex-1 relative overflow-hidden rounded-lg">
          <img
            ref={imageRef}
            src={imageUrl}
            alt={landmarkData.name}
            className={`w-full h-full object-cover transition-transform duration-300 cursor-${
              imageZoom > 1 ? 'move' : 'default'
            }`}
            style={{
              transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
              filter: overlayMode === 'immersive' ? 
                `brightness(${0.8 + Math.sin(animationProgress * Math.PI * 2) * 0.2})` : 
                'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* Image Controls */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 rounded-lg p-2">
            <Button size="sm" variant="ghost" onClick={handleZoomOut} className="text-white">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-white text-sm">{Math.round(imageZoom * 100)}%</span>
            <Button size="sm" variant="ghost" onClick={handleZoomIn} className="text-white">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={resetView} className="text-white">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Immersive Mode Controls */}
          {overlayMode === 'immersive' && (
            <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/50 rounded-lg p-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <span className="text-white text-sm">Experience</span>
            </div>
          )}

          {/* AR Hotspots */}
          {(overlayMode === 'detailed' || overlayMode === 'immersive') && hotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                overlayMode === 'immersive' ? 'animate-pulse' : ''
              }`}
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: overlayMode === 'immersive' ? 
                  `translate(-50%, -50%) scale(${1 + Math.sin(animationProgress * Math.PI * 4 + hotspot.x) * 0.1})` :
                  'translate(-50%, -50%)'
              }}
              onClick={() => setSelectedHotspot(selectedHotspot === hotspot.id ? null : hotspot.id)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                selectedHotspot === hotspot.id ? 'scale-125 bg-primary' : 'bg-white/20 hover:bg-white/30'
              }`}>
                {hotspot.type === 'info' && <Info className="w-4 h-4 text-white" />}
                {hotspot.type === 'historical' && <Clock className="w-4 h-4 text-white" />}
                {hotspot.type === 'cultural' && <Globe className="w-4 h-4 text-white" />}
                {hotspot.type === 'activity' && <Camera className="w-4 h-4 text-white" />}
              </div>

              {/* Hotspot Tooltip */}
              {selectedHotspot === hotspot.id && (
                <Card className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 z-20">
                  <CardContent className="p-3">
                    <h4 className="font-semibold text-sm mb-1">{hotspot.title}</h4>
                    <p className="text-xs text-muted-foreground">{hotspot.content}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* Info Panel */}
        {showInfoPanel && overlayMode !== 'minimal' && (
          <div className="w-80 ml-4 space-y-4 overflow-y-auto">
            <Card className="bg-black/30 border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold">{landmarkData.name}</h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowInfoPanel(false)}
                    className="text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-sm text-white/80 mb-4">{landmarkData.description}</p>

                {/* Location Info */}
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">
                    {landmarkData.coordinates.lat.toFixed(4)}, {landmarkData.coordinates.lng.toFixed(4)}
                  </span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {landmarkData.categories.slice(0, 3).map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>

                {/* Best Time to Visit */}
                {landmarkData.bestTimeToVisit && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-1">Best Time to Visit</h4>
                    <p className="text-xs text-white/70">{landmarkData.bestTimeToVisit}</p>
                  </div>
                )}

                {/* Activities */}
                {landmarkData.activities && landmarkData.activities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Activities</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {landmarkData.activities.slice(0, 4).map((activity, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-white border-white/30">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handleShare} className="flex-1">
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-white border-white/30">
                    <Bookmark className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                </div>

                {landmarkData.wikipediaUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(landmarkData.wikipediaUrl, '_blank')}
                    className="w-full mt-2 text-white border-white/30"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Learn More on Wikipedia
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Nearby Places */}
            {landmarkData.nearbyPlaces && landmarkData.nearbyPlaces.length > 0 && (
              <Card className="bg-black/30 border-white/20 text-white">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Nearby Places</h3>
                  <div className="space-y-2">
                    {landmarkData.nearbyPlaces.slice(0, 3).map((place, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 rounded bg-white/10">
                        <Navigation className="w-4 h-4 text-primary" />
                        <span className="text-sm">{place}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Collapsed Info Panel Button */}
        {!showInfoPanel && overlayMode !== 'minimal' && (
          <Button
            onClick={() => setShowInfoPanel(true)}
            className="absolute top-1/2 right-4 transform -translate-y-1/2"
            size="sm"
          >
            <Info className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Audio element for narration */}
      <audio ref={audioRef} hidden />
    </div>
  );
};

export default AROverlay;