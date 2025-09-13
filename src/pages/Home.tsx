import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, Users, Leaf, Camera, Award, Sparkles } from 'lucide-react';
import { categories, touristSites } from '@/data/mockData';
import EnhancedInteractiveMap from '@/components/EnhancedInteractiveMap';
import heroImage from '@/assets/hero-eco-tourism.jpg';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section 
        className="relative h-[85vh] bg-cover bg-center bg-no-repeat flex items-center justify-center hero-parallax"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-overlay"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-5xl px-4 animate-fade-in">
          <div className="mb-6 inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Discover Sustainable Adventures</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="block mb-2">Eco & Culture</span>
            <span className="gradient-text">Tourism India</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Connect with nature, culture, and communities through sustainable travel experiences that make a positive impact
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="glass-effect rounded-2xl p-6 max-w-3xl mx-auto shadow-elevated">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Discover activities, destinations, experiences..."
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground backdrop-blur-sm"
                />
              </div>
              <Button size="lg" className="btn-premium px-8 py-4 rounded-xl">
                <MapPin className="w-5 h-5 mr-2" />
                Explore Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <span className="text-sm font-medium">Categories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Explore By Interest</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Discover diverse experiences that connect you with nature and authentic cultures
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card key={category.id} className="premium-card hover-float group cursor-pointer" style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Destinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16">
            <div className="animate-slide-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
                <span className="text-sm font-medium">Featured</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Premium Destinations</h2>
              <p className="text-muted-foreground text-xl">Handpicked sustainable travel experiences</p>
            </div>
            <Link to="/trip-planner" className="mt-6 lg:mt-0">
              <Button variant="outline" size="lg" className="rounded-xl hover-glow">
                View All Destinations
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {touristSites.map((site, index) => (
              <Card key={site.id} className="premium-card hover-float group overflow-hidden" style={{animationDelay: `${index * 150}ms`}}>
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={site.image} 
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="glass-effect text-foreground font-medium">
                      {site.type.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="glass-effect rounded-lg px-3 py-2 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-sm font-medium">{site.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{site.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{site.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-primary">${site.price}</span>
                    <Button size="lg" className="rounded-xl hover:scale-105 transition-transform">
                      Book Experience
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Interactive Map Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-success/10 text-success mb-6">
              <span className="text-sm font-medium">Interactive</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Explore Destinations</h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
              Discover sustainable locations across India with our interactive map experience
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-elevated">
            <EnhancedInteractiveMap />
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-culture/10 text-culture mb-6">
              <span className="text-sm font-medium">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">EcoTravel Difference</h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
              Experience travel that creates positive impact for communities and environment
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="text-center group animate-scale-in" style={{animationDelay: '0ms'}}>
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-eco rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Eco-Friendly</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                All experiences are designed to minimize environmental impact and support conservation efforts
              </p>
            </div>
            
            <div className="text-center group animate-scale-in" style={{animationDelay: '200ms'}}>
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-culture rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Community Impact</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Support local communities and artisans through authentic cultural exchanges and sustainable tourism
              </p>
            </div>
            
            <div className="text-center group animate-scale-in" style={{animationDelay: '400ms'}}>
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-warm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Earn Rewards</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Get eco-points for sustainable choices and redeem them for future adventures and exclusive experiences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-overlay opacity-80"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 text-white">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready for Your Adventure?</h2>
            <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
              Join thousands of conscious travelers making a positive impact through sustainable tourism
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/trip-planner">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 rounded-xl text-lg shadow-elevated hover:scale-105 transition-transform">
                  <MapPin className="w-6 h-6 mr-2" />
                  Plan Your Journey
                </Button>
              </Link>
              <Link to="/ar-experience">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-lg backdrop-blur-sm hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6 mr-2" />
                  Try AR Experience
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;