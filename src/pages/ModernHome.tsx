import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Camera, 
  Award, 
  ShoppingBag, 
  Leaf, 
  Star, 
  Clock, 
  ArrowRight,
  Globe,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  BookOpen,
  Play,
  Pause,
  Search,
  Filter,
  Maximize2
} from 'lucide-react';
import EnhancedInteractiveMap from '@/components/EnhancedInteractiveMap';
import { mockCulturalStories, mockRewards, mockHeroSlides, stateSpecificHeroSlides } from '@/data/enhancedMockData';
import { useStateContext } from '@/contexts/StateContext';

const ModernHome = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const { currentStateInfo } = useStateContext();

  // Get location-relevant hero slides
  const getRelevantHeroSlides = () => {
    if (currentStateInfo && stateSpecificHeroSlides[currentStateInfo.id]) {
      // Mix state-specific slides with general slides
      const stateSlides = stateSpecificHeroSlides[currentStateInfo.id];
      const generalSlides = mockHeroSlides.slice(0, 2); // Take first 2 general slides
      return [...stateSlides, ...generalSlides];
    }
    return mockHeroSlides;
  };

  const relevantHeroSlides = getRelevantHeroSlides();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate hero slides
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % relevantHeroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, relevantHeroSlides.length]);

  // Auto-rotate cultural stories
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % mockCulturalStories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: MapPin,
      title: "AI Trip Planner",
      description: "Smart recommendations for eco-friendly adventures",
      link: "/trip-planner",
      color: "bg-primary",
      gradient: "from-primary to-primary-glow"
    },
    {
      icon: Camera,
      title: "AR/VR Explorer",
      description: "Discover places through augmented reality",
      link: "/ar-experience",
      color: "bg-accent",
      gradient: "from-accent to-blue-500"
    },
    {
      icon: Award,
      title: "Eco Rewards",
      description: "Earn points for sustainable travel choices",
      link: "/rewards",
      color: "bg-success",
      gradient: "from-success to-green-400"
    },
    {
      icon: ShoppingBag,
      title: "Local Marketplace",
      description: "Support artisans and local communities",
      link: "/marketplace",
      color: "bg-secondary",
      gradient: "from-secondary to-orange-400"
    }
  ];

  const stats = [
    { icon: Globe, value: "50+", label: "Destinations" },
    { icon: Users, value: "10K+", label: "Happy Travelers" },
    { icon: Leaf, value: "95%", label: "Eco Rating" },
    { icon: Heart, value: "500+", label: "Local Partners" }
  ];

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % relevantHeroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + relevantHeroSlides.length) % relevantHeroSlides.length);
  };

  const nextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % mockCulturalStories.length);
  };

  const prevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + mockCulturalStories.length) % mockCulturalStories.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Hero Slider */}
      <section className="relative h-screen overflow-hidden">
        {/* Slider Container */}
        <div className="relative w-full h-full">
          {relevantHeroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlideIndex 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("${slide.imageUrl}")`,
                }}
              >
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent"></div>
              </div>

              {/* Slide Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-6 max-w-5xl mx-auto">
                  <div className="space-y-6 animate-fade-in">
                    {/* Location Badge */}
                    {slide.location && (
                      <div className="flex justify-center mb-4">
                        <Badge className="bg-emerald-500/20 text-emerald-100 border border-emerald-400/30 px-4 py-2 text-sm backdrop-blur-sm rounded-full">
                          <MapPin className="w-3 h-3 mr-2" />
                          {slide.location}
                        </Badge>
                      </div>
                    )}
                    
                    {/* State-specific Badge */}
                    {slide.state && slide.state !== 'general' && (
                      <div className="flex justify-center mb-4">
                        <Badge className="bg-blue-500/20 text-blue-100 border border-blue-400/30 px-4 py-2 text-sm backdrop-blur-sm rounded-full">
                          <Sparkles className="w-3 h-3 mr-2" />
                          {currentStateInfo?.name || slide.state} Special
                        </Badge>
                      </div>
                    )}
                    
                    {/* Main Heading */}
                    <div className="space-y-4">
                      <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight">
                        {slide.title}
                        <br />
                        <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 bg-clip-text text-transparent">
                          {slide.subtitle}
                        </span>
                      </h1>
                    </div>
                    
                    {/* Description */}
                    <p className="text-xl sm:text-2xl text-emerald-50/90 max-w-3xl mx-auto leading-relaxed mb-8">
                      {slide.description}
                    </p>
                    
                    {/* CTA Button */}
                    <div className="flex justify-center pt-8">
                      <Link to={slide.ctaLink}>
                        <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-10 py-5 h-auto rounded-full font-semibold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
                          <MapPin className="w-6 h-6 mr-3" />
                          {slide.ctaText}
                          <ArrowRight className="w-5 h-5 ml-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="absolute inset-y-0 right-4 flex items-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {relevantHeroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlideIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Auto-play Control */}
        <div className="absolute bottom-8 right-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-5000 ease-linear"
            style={{ 
              width: isAutoPlay ? '100%' : '0%',
              animation: isAutoPlay ? 'progress 5s linear infinite' : 'none'
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <Badge className="mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-200" variant="secondary">
              <Leaf className="w-4 h-4 mr-2" />
              Premium Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Your Gateway to <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">Sustainable Adventure</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Experience cutting-edge technology combined with authentic cultural immersion for responsible travel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="group">
                <Card className="premium-card h-full group-hover:scale-105 transition-all duration-500 group-hover:shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center space-y-6">
                    <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-110`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                    
                    <Button variant="ghost" className="group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all duration-300">
                      Explore Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200" variant="outline">
              <MapPin className="w-4 h-4 mr-2" />
              Interactive Experience
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Discover Hidden <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">Gems</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Explore our enhanced interactive map with real-time search, advanced filters, and immersive activity discovery across India's most sustainable destinations
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-3 p-4 bg-white/80 rounded-xl backdrop-blur-sm border border-white/50 shadow-soft">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-sm">Smart Search</h4>
                  <p className="text-xs text-muted-foreground">Find activities instantly</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 p-4 bg-white/80 rounded-xl backdrop-blur-sm border border-white/50 shadow-soft">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Filter className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-sm">Advanced Filters</h4>
                  <p className="text-xs text-muted-foreground">Precise customization</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 p-4 bg-white/80 rounded-xl backdrop-blur-sm border border-white/50 shadow-soft">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-sm">Fullscreen Mode</h4>
                  <p className="text-xs text-muted-foreground">Immersive exploration</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 hover:shadow-emerald-100/50 transition-shadow duration-500">
            <EnhancedInteractiveMap onLocationSelect={(location) => {
              console.log('Selected location:', location);
              // Handle location selection - could navigate to detail page
            }} />
          </div>
          
          {/* Call-to-Action below map */}
          <div className="text-center mt-12">
            <div className="max-w-2xl mx-auto space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Ready to explore these amazing destinations?
              </h3>
              <p className="text-muted-foreground">
                Plan your eco-friendly adventure with our AI-powered trip planner and earn rewards for sustainable choices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/trip-planner">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
                    <MapPin className="w-5 h-5 mr-2" />
                    Plan Your Trip
                  </Button>
                </Link>
                <Link to="/rewards">
                  <Button size="lg" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    <Award className="w-5 h-5 mr-2" />
                    Earn Eco Rewards
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Stories Carousel */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-emerald-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-amber-100 text-amber-700 hover:bg-amber-200" variant="secondary">
              <BookOpen className="w-4 h-4 mr-2" />
              Cultural Heritage
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Stories from the <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">Heart</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Immerse yourself in authentic tales of tradition, craftsmanship, and community from local storytellers and artisans
            </p>
          </div>

          <div className="relative">
            <Card className="premium-card overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Story Image */}
                <div className="relative h-80 lg:h-96">
                  <img 
                    src={mockCulturalStories[currentStoryIndex].imageUrl}
                    alt={mockCulturalStories[currentStoryIndex].title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <Badge className="absolute top-6 left-6 bg-white/90 text-gray-800 backdrop-blur-sm capitalize font-medium">
                    {mockCulturalStories[currentStoryIndex].category}
                  </Badge>
                </div>

                {/* Story Content */}
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Badge variant="outline" className="w-fit bg-emerald-50 text-emerald-700 border-emerald-200">
                        <Clock className="w-3 h-3 mr-1" />
                        {mockCulturalStories[currentStoryIndex].readTime} min read
                      </Badge>
                      <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
                        {mockCulturalStories[currentStoryIndex].title}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {mockCulturalStories[currentStoryIndex].description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">{mockCulturalStories[currentStoryIndex].location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-amber-600" />
                        <span>By {mockCulturalStories[currentStoryIndex].author}</span>
                      </div>
                    </div>
                    
                    <Button className="w-fit bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
                      Read Full Story
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Enhanced Navigation */}
            <div className="flex justify-center items-center space-x-6 mt-12">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={prevStory}
                className="rounded-full w-12 h-12 p-0 border-2 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex space-x-3 items-center">
                {mockCulturalStories.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStoryIndex 
                        ? 'bg-emerald-600 scale-125 shadow-lg shadow-emerald-600/50' 
                        : 'bg-gray-300 hover:bg-emerald-400'
                    }`}
                    onClick={() => setCurrentStoryIndex(index)}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={nextStory}
                className="rounded-full w-12 h-12 p-0 border-2 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-100 via-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
              Trusted by <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-lg text-muted-foreground">Join our growing community of conscious travelers</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-emerald-100">
                  <stat.icon className="w-10 h-10 text-emerald-600" />
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="premium-card">
            <CardContent className="p-12 space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Your Journey
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready to <span className="gradient-text">Explore</span>?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of conscious travelers discovering authentic experiences 
                  while supporting local communities
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/trip-planner">
                  <Button size="lg" className="btn-premium">
                    <MapPin className="w-5 h-5 mr-2" />
                    Plan Your Adventure
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button size="lg" variant="outline">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ModernHome;