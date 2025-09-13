import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Star, Clock, Users, Leaf, Search, Filter, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { mockActivities, statesData } from '@/data/enhancedMockData';
import type { Activity, TouristPlace } from '@/data/enhancedMockData';

interface InteractiveMapProps {
  selectedCategory?: string;
  onLocationSelect?: (location: Activity | TouristPlace) => void;
}

const EnhancedInteractiveMap: React.FC<InteractiveMapProps> = ({ 
  selectedCategory, 
  onLocationSelect 
}) => {
  const [hoveredLocation, setHoveredLocation] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'activities' | 'states'>('activities');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [selectedMarkers, setSelectedMarkers] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Add this new state for map size
  const [mapSize, setMapSize] = useState({
    width: window.innerWidth * 0.9, // 90% of screen width
    height: window.innerHeight * 0.8 // 80% of screen height
  });

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setMapSize({
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.8
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter activities based on selected category and search term
  const filteredActivities = useMemo(() => {
    let activities = mockActivities;
    
    // Filter by category
    if (selectedCategory) {
      activities = activities.filter(activity => 
        activity.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      activities = activities.filter(activity => 
        activity.name.toLowerCase().includes(searchLower) ||
        activity.location.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower)
      );
    }
    
    return activities;
  }, [selectedCategory, searchTerm]);

  const handleLocationClick = useCallback((location: Activity | TouristPlace) => {
    // Add visual feedback for selection
    if ('ecoScore' in location) {
      setSelectedMarkers(prev => 
        prev.includes(location.id) 
          ? prev.filter(id => id !== location.id)
          : [...prev, location.id]
      );
    }
    onLocationSelect?.(location);
  }, [onLocationSelect]);

  const handleZoomIn = useCallback(() => {
    setMapZoom(prev => Math.min(prev + 0.2, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setMapZoom(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setMapZoom(1);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const renderActivityMarkers = () => {
    return filteredActivities.map((activity) => {
      const isHovered = hoveredLocation === activity.id;
      const isSelected = selectedMarkers.includes(activity.id);
      
      // Better coordinate calculation for Jharkhand region
      const lat = activity.coordinates?.lat || 23.5;
      const lng = activity.coordinates?.lng || 85.5;
      
      // Map boundaries for Jharkhand (approximate)
      const minLat = 22.0, maxLat = 25.0;
      const minLng = 83.0, maxLng = 88.0;
      
      // Convert coordinates to percentage positions
      const leftPercent = ((lng - minLng) / (maxLng - minLng)) * 80 + 10; // 10-90% range
      const topPercent = ((maxLat - lat) / (maxLat - minLat)) * 80 + 10;   // 10-90% range
      
      return (
        <div
          key={activity.id}
          className={`absolute cursor-pointer transition-all duration-500 ${
            isHovered ? 'scale-125 z-30' : isSelected ? 'scale-110 z-20' : 'z-10'
          }`}
          style={{
            left: `${leftPercent}%`,
            top: `${topPercent}%`,
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center',
          }}
          onMouseEnter={() => setHoveredLocation(activity.id)}
          onMouseLeave={() => setHoveredLocation(null)}
          onClick={() => handleLocationClick(activity)}
        >
          {/* Enhanced Marker with Pulse Effect */}
          <div className={`relative ${isHovered ? 'animate-bounce' : ''}`}>
            {/* Pulse Ring for Selected */}
            {isSelected && (
              <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-current scale-150"></div>
            )}
            
            <div className={`w-8 h-8 rounded-full border-2 border-white shadow-2xl transition-all duration-300 ${
              activity.category === 'Cultural' ? 'bg-purple-600 shadow-purple-500/50' :
              activity.category === 'Conservation' ? 'bg-green-600 shadow-green-500/50' :
              activity.category === 'Outdoor' ? 'bg-blue-600 shadow-blue-500/50' : 'bg-orange-600 shadow-orange-500/50'
            } ${
              isSelected ? 'ring-4 ring-white/50' : ''
            }`}>
              <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current"></div>
              {/* Activity Icon */}
              <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                {activity.category === 'Cultural' && '🏛️'}
                {activity.category === 'Conservation' && '🌱'}
                {activity.category === 'Outdoor' && '🥾'}
              </div>
            </div>
            
            {/* Enhanced Tooltip */}
            {isHovered && (
              <Card className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-72 sm:w-80 z-40 shadow-2xl border-0 bg-white/95 backdrop-blur-md animate-fade-in">
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-sm sm:text-base text-foreground leading-tight pr-2">
                        {activity.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {activity.category}
                      </Badge>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {activity.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                        <span className="text-muted-foreground truncate text-xs">
                          {activity.location}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                        <span className="text-success font-semibold text-xs">
                          {activity.ecoScore}/10
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                        <span className="font-medium text-xs">{activity.duration}h</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="font-bold text-primary text-sm">
                          ₹{activity.price || 'Free'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Difficulty Badge */}
                    <div className="flex justify-between items-center pt-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          activity.difficulty === 'Easy' ? 'border-success text-success' :
                          activity.difficulty === 'Moderate' ? 'border-warning text-warning' :
                          'border-destructive text-destructive'
                        }`}
                      >
                        {activity.difficulty}
                      </Badge>
                      <Button size="sm" className="h-6 sm:h-7 text-xs px-2 sm:px-3">
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      );
    });
  };

  const renderStateMap = () => {
    const states = Object.entries(statesData);
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {states.map(([stateKey, stateInfo]) => (
            <Card 
              key={stateKey}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedState === stateKey ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedState(selectedState === stateKey ? null : stateKey)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{stateInfo.name}</h3>
                    <Badge variant="outline">{stateInfo.capital}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {stateInfo.description}
                  </p>
                  
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{stateInfo.touristPlaces.length} tourist places</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Selected State Details */}
        {selectedState && (
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl mb-4">
                Top Places in {statesData[selectedState as keyof typeof statesData].name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statesData[selectedState as keyof typeof statesData].touristPlaces.map((place) => (
                  <Card 
                    key={place.id}
                    className="cursor-pointer hover:shadow-md transition-shadow duration-300"
                    onClick={() => handleLocationClick(place)}
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={place.imageUrl} 
                        alt={place.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-background/80 text-foreground">
                        {place.category}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{place.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {place.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Best time: {place.bestTimeToVisit}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {place.activities.slice(0, 3).map((activity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Toggle Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
        <Button
          variant={viewMode === 'activities' ? 'default' : 'outline'}
          onClick={() => setViewMode('activities')}
          className="flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <MapPin className="w-4 h-4" />
          <span>Activity Map</span>
        </Button>
        <Button
          variant={viewMode === 'states' ? 'default' : 'outline'}
          onClick={() => setViewMode('states')}
          className="flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Users className="w-4 h-4" />
          <span>State Explorer</span>
        </Button>
      </div>

      {/* Map Content */}
      {viewMode === 'activities' ? (
        <Card className={`w-full transition-all duration-500 ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
        }`}>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Enhanced Header with Search and Controls */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    Interactive Activity Map
                    <Badge variant="outline" className="text-sm">
                      {filteredActivities.length} activities
                    </Badge>
                  </h3>
                  {selectedCategory && (
                    <Badge variant="secondary" className="text-sm">{selectedCategory}</Badge>
                  )}
                </div>
                
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities, locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm" 
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </div>
              </div>
              
              {/* Advanced Filters (Collapsible) */}
              {showFilters && (
                <Card className="p-4 bg-muted/50 animate-fade-in">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <select className="w-full p-2 rounded border bg-background">
                        <option value="">All Levels</option>
                        <option value="easy">Easy</option>
                        <option value="moderate">Moderate</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration</label>
                      <select className="w-full p-2 rounded border bg-background">
                        <option value="">Any Duration</option>
                        <option value="short">&lt; 3 hours</option>
                        <option value="medium">3-6 hours</option>
                        <option value="long">6+ hours</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <select className="w-full p-2 rounded border bg-background">
                        <option value="">Any Price</option>
                        <option value="free">Free</option>
                        <option value="budget">₹1-500</option>
                        <option value="premium">₹500+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Eco Score</label>
                      <select className="w-full p-2 rounded border bg-background">
                        <option value="">Any Score</option>
                        <option value="high">9.0+</option>
                        <option value="good">7.0-8.9</option>
                        <option value="fair">&lt; 7.0</option>
                      </select>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Enhanced Map Container */}
              <div className={`relative w-full bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 rounded-2xl border-2 border-dashed border-border overflow-hidden transition-all duration-500 ${
                isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[500px] lg:h-[600px]'
              }`}
              style={{
                width: mapSize.width,
                height: mapSize.height,
                margin: '0 auto',
                maxWidth: '100%',
                maxHeight: '80vh'
              }}>
                {/* Enhanced Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="w-full h-full" style={{
                    backgroundImage: `radial-gradient(circle at 30px 30px, currentColor 2px, transparent 2px)`,
                    backgroundSize: '60px 60px'
                  }}></div>
                </div>
                
                {/* Map Title */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
                  <Badge className="bg-white/90 text-foreground shadow-lg text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2">
                    🗺️ <span className="hidden sm:inline">Jharkhand & Surrounding Regions</span>
                    <span className="sm:hidden">Jharkhand Region</span>
                  </Badge>
                </div>
                
                {/* Map Controls */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex flex-col gap-2 animate-fade-in">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    className="w-8 h-8 sm:w-10 sm:h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    className="w-8 h-8 sm:w-10 sm:h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetZoom}
                    className="w-8 h-8 sm:w-10 sm:h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="w-8 h-8 sm:w-10 sm:h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
                
                {/* Activity Markers */}
                <div className="relative w-full h-full transition-transform duration-300 ease-out" style={{ 
                  transform: `scale(${mapZoom})`, 
                  transformOrigin: 'center'
                }}>
                  {renderActivityMarkers()}
                </div>
                
                {/* Enhanced Legend */}
                <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-2xl border animate-slide-up max-w-[200px] sm:max-w-none">
                  <h4 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 text-gray-900">Categories</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm hover:bg-gray-50 p-1 sm:p-2 rounded-lg transition-colors cursor-pointer">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-purple-600 shadow-lg flex items-center justify-center text-xs transition-transform hover:scale-110">🏛️</div>
                      <span className="font-medium hidden sm:inline">Cultural Heritage</span>
                      <span className="font-medium sm:hidden">Cultural</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm hover:bg-gray-50 p-1 sm:p-2 rounded-lg transition-colors cursor-pointer">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-600 shadow-lg flex items-center justify-center text-xs transition-transform hover:scale-110">🌱</div>
                      <span className="font-medium">Conservation</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm hover:bg-gray-50 p-1 sm:p-2 rounded-lg transition-colors cursor-pointer">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-600 shadow-lg flex items-center justify-center text-xs transition-transform hover:scale-110">🥾</div>
                      <span className="font-medium hidden sm:inline">Outdoor Adventure</span>
                      <span className="font-medium sm:hidden">Outdoor</span>
                    </div>
                  </div>
                  
                  {/* Activity Stats */}
                  <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <div>Total: {filteredActivities.length}</div>
                      <div className="hidden sm:block">Zoom: {(mapZoom * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
                
                {/* Loading/Empty State */}
                {filteredActivities.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Card className="p-8 bg-white/90 backdrop-blur-sm">
                      <div className="text-center space-y-4">
                        <div className="text-4xl">🔍</div>
                        <h3 className="font-semibold text-lg">No Activities Found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTerm('');
                            setShowFilters(false);
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        renderStateMap()
      )}
    </div>
  );
};

export default EnhancedInteractiveMap;