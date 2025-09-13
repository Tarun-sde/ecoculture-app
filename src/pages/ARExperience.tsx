import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Play, Smartphone, Globe, ArrowRight, Star, Eye } from 'lucide-react';

const ARExperience = () => {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);

  const arExperiences = [
    {
      id: 'temple-tour',
      title: 'Virtual Temple Tour',
      description: 'Explore ancient Khajuraho temples with AR overlays showing historical reconstructions',
      image: '/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png',
      duration: '15 min',
      rating: 4.8,
      features: ['360° View', 'Historical Timeline', 'Audio Guide'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'wildlife-safari',
      title: 'AR Wildlife Safari',
      description: 'Experience Sundarbans wildlife through augmented reality with interactive animal information',
      image: '/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png',
      duration: '20 min',
      rating: 4.9,
      features: ['Animal Tracking', 'Species Info', 'Conservation Facts'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'craft-workshop',
      title: 'Virtual Craft Workshop',
      description: 'Learn traditional handicrafts from master artisans through immersive AR tutorials',
      image: '/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png',
      duration: '25 min',
      rating: 4.7,
      features: ['Step-by-step Guide', 'Cultural Context', 'Virtual Tools'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-culture/5 to-accent/5">
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Immersive Cultural Previews
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Experience destinations before you visit through cutting-edge AR and VR technology
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-culture hover:bg-culture/90">
                <Camera className="w-5 h-5 mr-2" />
                Try AR Experience
              </Button>
              <Button size="lg" variant="outline">
                <Smartphone className="w-5 h-5 mr-2" />
                Download Mobile App
              </Button>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-culture to-accent rounded-2xl flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">360° Virtual Tours</h3>
                <p className="text-sm text-muted-foreground">
                  Explore destinations with immersive 360-degree experiences
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-success rounded-2xl flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Cultural Context</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about history, traditions, and local customs
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary to-warning rounded-2xl flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Interactive Elements</h3>
                <p className="text-sm text-muted-foreground">
                  Touch, explore, and interact with virtual objects
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AR Experiences */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured AR Experiences</h2>
            <p className="text-muted-foreground">
              Preview authentic cultural and natural experiences from the comfort of your home
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {arExperiences.map((experience) => (
              <Card 
                key={experience.id} 
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedExperience(experience.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={experience.image} 
                    alt={experience.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 rounded-lg px-2 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-sm font-medium">{experience.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl">{experience.title}</CardTitle>
                  <CardDescription>{experience.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="secondary">{experience.duration}</Badge>
                    <Button size="sm" variant="ghost">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {experience.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Player Modal */}
      {selectedExperience && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-background border-b border-border p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {arExperiences.find(exp => exp.id === selectedExperience)?.title}
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedExperience(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="p-6">
              <div className="aspect-video mb-6 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={arExperiences.find(exp => exp.id === selectedExperience)?.videoUrl}
                  title="AR Experience Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  This is a preview of our AR experience. Download our mobile app for the full immersive experience!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-culture hover:bg-culture/90">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Download iOS App
                  </Button>
                  <Button variant="outline">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Download Android App
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">More Experiences Coming Soon</h2>
          <p className="text-muted-foreground mb-8">
            We're constantly adding new AR and VR experiences to help you discover amazing destinations
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  Himalayan Trek Preview
                </CardTitle>
                <CardDescription>
                  Experience high-altitude trekking through VR simulation
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  Traditional Cooking Class
                </CardTitle>
                <CardDescription>
                  Learn regional recipes through interactive AR tutorials
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ARExperience;