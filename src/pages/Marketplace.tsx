import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, MapPin, Filter, Heart, ShoppingCart, Leaf, Users } from 'lucide-react';
import { marketplaceItems } from '@/data/mockData';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    { id: 'all', label: 'All Categories', count: marketplaceItems.length },
    { id: 'handicraft', label: 'Handicrafts', count: 1 },
    { id: 'food', label: 'Local Food', count: 1 },
    { id: 'homestay', label: 'Homestays', count: 1 }
  ];

  const featuredArtisans = [
    {
      id: 1,
      name: 'Maya Devi',
      location: 'Assam',
      specialty: 'Bamboo Crafts',
      rating: 4.8,
      image: '/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png',
      description: 'Master craftsperson with 25+ years of experience in traditional bamboo weaving',
      verified: true
    },
    {
      id: 2,
      name: 'Ravi Kumar',
      location: 'Kerala',
      specialty: 'Organic Spices',
      rating: 4.9,
      image: '/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png',
      description: 'Third-generation spice farmer growing organic spices using traditional methods',
      verified: true
    },
    {
      id: 3,
      name: 'Himalayan Retreats',
      location: 'Himachal Pradesh',
      specialty: 'Eco Lodges',
      rating: 4.7,
      image: '/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png',
      description: 'Sustainable mountain lodges with breathtaking views and local cuisine',
      verified: true
    }
  ];

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-secondary/10 to-warning/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Local Artisan Marketplace</h1>
            <p className="text-muted-foreground text-lg">
              Discover authentic products from local artisans and support sustainable communities
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products, artisans, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="eco-points">Most Eco Points</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-sm"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Featured Artisans */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-culture" />
                  Featured Artisans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredArtisans.map((artisan) => (
                  <div key={artisan.id} className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-3">
                      <img 
                        src={artisan.image} 
                        alt={artisan.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{artisan.name}</h4>
                          {artisan.verified && (
                            <Badge variant="secondary" className="text-xs">✓</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <MapPin className="w-3 h-3" />
                          {artisan.location}
                        </div>
                        <div className="flex items-center gap-1 text-xs mb-2">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          {artisan.rating}
                        </div>
                        <p className="text-xs text-muted-foreground">{artisan.specialty}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Marketplace</h2>
                <p className="text-muted-foreground">
                  {filteredItems.length} products found
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-success text-success-foreground">
                        <Leaf className="w-3 h-3 mr-1" />
                        +{item.ecoPoints} pts
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-white/90 rounded-lg px-2 py-1 flex items-center space-x-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      by {item.artisan}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      {item.location}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-primary">${item.price}</span>
                        <div className="text-sm text-muted-foreground">Free shipping</div>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse different categories
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Community Impact Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-success/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Your Purchase Makes a Difference</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">Environmental Impact</h3>
              <p className="text-muted-foreground">
                Every purchase supports sustainable practices and eco-friendly production
              </p>
            </div>
            
            <div>
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-muted-foreground">
                Your purchase directly supports local artisans and their families
              </p>
            </div>
            
            <div>
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Cultural Preservation</h3>
              <p className="text-muted-foreground">
                Help preserve traditional crafts and cultural heritage for future generations
              </p>
            </div>
          </div>
          
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Leaf className="w-5 h-5 mr-2" />
            Learn More About Our Impact
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Marketplace;