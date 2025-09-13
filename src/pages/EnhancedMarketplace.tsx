import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ShoppingBag, 
  Star, 
  MapPin, 
  Heart, 
  Filter,
  Search,
  Bookmark,
  ExternalLink,
  Award,
  Users,
  Sparkles,
  CheckCircle,
  Route
} from 'lucide-react';
import { mockMarketplaceItems } from '@/data/enhancedMockData';
import type { MarketplaceItem } from '@/data/enhancedMockData';
import { useStateContext } from '@/contexts/StateContext';

const EnhancedMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [savedToTrip, setSavedToTrip] = useState<number[]>([]);
  const { currentStateInfo } = useStateContext();

  // Get unique categories and locations
  const categories = ['all', ...Array.from(new Set(mockMarketplaceItems.map(item => item.category)))];
  const locations = ['all', ...Array.from(new Set(mockMarketplaceItems.map(item => item.location)))];

  // Filter items based on current state
  const stateFilteredItems = mockMarketplaceItems.filter(item => 
    item.location.toLowerCase().includes(currentStateInfo.name.toLowerCase()) ||
    selectedLocation === 'all'
  );

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items = stateFilteredItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.vendor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || item.location.includes(selectedLocation);
      
      return matchesSearch && matchesCategory && matchesLocation;
    });

    // Sort items
    switch (sortBy) {
      case 'recommended':
        items = items.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));
        break;
      case 'price-low':
        items = items.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items = items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items = items.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return items;
  }, [searchTerm, selectedCategory, selectedLocation, sortBy]);

  const toggleWishlist = (itemId: number) => {
    setWishlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSaveToTrip = (itemId: number) => {
    setSavedToTrip(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crafts': return '🎨';
      case 'food': return '🌾';
      case 'stay': return '🏡';
      case 'activities': return '🏔️';
      default: return '🛍️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crafts': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'food': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'stay': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'activities': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-secondary/10 text-secondary px-4 py-2">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Local Marketplace
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold">
            Support <span className="gradient-text">Local Artisans</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover authentic handcrafted products, organic foods, cultural homestays, 
            and unique experiences from local communities
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="premium-card">
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary mr-2" />
                  <span className="text-2xl font-bold text-primary">50+</span>
                </div>
                <p className="text-sm text-muted-foreground">Local Vendors</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="premium-card">
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent mr-2" />
                  <span className="text-2xl font-bold text-accent">100%</span>
                </div>
                <p className="text-sm text-muted-foreground">Authentic</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="premium-card">
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Award className="w-5 h-5 text-success mr-2" />
                  <span className="text-2xl font-bold text-success">95%</span>
                </div>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="premium-card">
            <CardContent className="p-4 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-secondary mr-2" />
                  <span className="text-2xl font-bold text-secondary">5+</span>
                </div>
                <p className="text-sm text-muted-foreground">Regions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products, vendors, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {getCategoryIcon(category)} {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location === 'all' ? 'All Locations' : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">🌟 Recommended</SelectItem>
                  <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                  <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
                  <SelectItem value="rating">⭐ Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Marketplace Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="premium-card group hover:scale-105 transition-all duration-300">
              <div className="relative">
                {/* Image */}
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 space-y-2">
                    <Badge className={getCategoryColor(item.category)}>
                      {getCategoryIcon(item.category)} {item.category}
                    </Badge>
                    {item.isRecommended && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0 bg-background/80 hover:bg-background"
                      onClick={() => toggleWishlist(item.id)}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0 bg-background/80 hover:bg-background"
                      onClick={() => toggleSaveToTrip(item.id)}
                    >
                      <Bookmark className={`w-4 h-4 ${savedToTrip.includes(item.id) ? 'fill-primary text-primary' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold line-clamp-2">{item.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(item.rating) 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground">
                          ({item.rating})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {item.description}
                  </p>

                  {/* Vendor & Location */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{item.vendor}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        ₹{item.price.toLocaleString()}
                      </div>
                      {item.category === 'stay' && (
                        <div className="text-xs text-muted-foreground">per night</div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {savedToTrip.includes(item.id) ? (
                        <Button size="sm" variant="secondary">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Saved
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => toggleSaveToTrip(item.id)}>
                          <Route className="w-4 h-4 mr-1" />
                          Add to Trip
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card className="premium-card">
            <CardContent className="p-12 text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold">No items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse all categories
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <Card className="premium-card">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Support Local Communities
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Become a <span className="gradient-text">Local Partner</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Are you a local artisan, food producer, or service provider? 
                Join our marketplace and reach conscious travelers
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-premium">
                <Users className="w-5 h-5 mr-2" />
                Join as Vendor
              </Button>
              <Button size="lg" variant="outline">
                <ExternalLink className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedMarketplace;