import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Info } from 'lucide-react';
import { touristSites } from '@/data/mockData';

const InteractiveMap = () => {
  // Mock Google Maps embed - in a real app, you'd use Google Maps API
  const mockMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15282225.79979123!2d73.7250245393691!3d20.750301298393563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sus!4v1635840215756!5m2!1sen!2sus`;

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={mockMapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
        />
        
        {/* Overlay with sample markers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Mock marker for Sundarban */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <div className="relative group">
              <Button
                size="sm"
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 p-0 shadow-lg"
              >
                <MapPin className="w-5 h-5" />
              </Button>
              
              {/* Tooltip */}
              <Card className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-64 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <img 
                      src={touristSites[0].image} 
                      alt={touristSites[0].name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{touristSites[0].name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{touristSites[0].description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          <span className="text-xs">{touristSites[0].rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          ${touristSites[0].price}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Mock marker for Khajuraho */}
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <div className="relative group">
              <Button
                size="sm"
                className="w-10 h-10 rounded-full bg-culture hover:bg-culture/90 p-0 shadow-lg"
              >
                <MapPin className="w-5 h-5" />
              </Button>
              
              {/* Tooltip */}
              <Card className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-64 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <img 
                      src={touristSites[1].image} 
                      alt={touristSites[1].name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{touristSites[1].name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{touristSites[1].description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          <span className="text-xs">{touristSites[1].rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          ${touristSites[1].price}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Mock marker for Kerala */}
          <div className="absolute top-2/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <div className="relative group">
              <Button
                size="sm"
                className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/90 p-0 shadow-lg"
              >
                <MapPin className="w-5 h-5" />
              </Button>
              
              {/* Tooltip */}
              <Card className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-64 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <img 
                      src={touristSites[2].image} 
                      alt={touristSites[2].name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{touristSites[2].name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{touristSites[2].description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          <span className="text-xs">{touristSites[2].rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          ${touristSites[2].price}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Eco Parks</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-culture rounded-full"></div>
            <span>Cultural Sites</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span>Homestays</span>
          </div>
        </div>
      </div>
      
      {/* Map Controls */}
      <div className="absolute bottom-4 left-4">
        <Button size="sm" variant="outline" className="bg-background/95 backdrop-blur-sm">
          <Info className="w-4 h-4 mr-2" />
          View Full Map
        </Button>
      </div>
    </div>
  );
};

export default InteractiveMap;