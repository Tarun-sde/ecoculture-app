import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Users, 
  Camera,
  ShoppingBag,
  TreePine,
  Mountain,
  Building,
  Utensils,
  Palette,
  Calendar,
  Star,
  ExternalLink,
  Info
} from 'lucide-react';
import { useStateContext, statesInfo } from '@/contexts/StateContext';

const StateDataPage = () => {
  const { selectedState, setSelectedState, currentStateInfo } = useStateContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'attractions' | 'culture' | 'marketplace'>('overview');

  // Enhanced state-specific data
  const stateData = {
    jharkhand: {
      attractions: [
        {
          name: 'Netarhat Hill Station',
          category: 'Hill Station',
          description: 'Known as the Queen of Chotanagpur, famous for sunrise and sunset views',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
          coordinates: { lat: 23.4676, lng: 84.2593 },
          rating: 4.6,
          bestTime: 'October to March'
        },
        {
          name: 'Dalma Wildlife Sanctuary',
          category: 'Wildlife',
          description: 'Home to elephants, leopards and diverse flora fauna',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
          coordinates: { lat: 22.8897, lng: 86.1864 },
          rating: 4.4,
          bestTime: 'November to April'
        },
        {
          name: 'Deoghar Temple Complex',
          category: 'Religious',
          description: 'One of the twelve Jyotirlingas, major pilgrimage destination',
          image: 'https://images.unsplash.com/photo-1580058572462-c3346c3c0625?w=800&q=80',
          coordinates: { lat: 24.4828, lng: 86.6992 },
          rating: 4.8,
          bestTime: 'July to September'
        }
      ],
      culture: [
        'Sohrai Festival - Harvest celebration with wall paintings',
        'Dokra metal casting - 4000-year-old technique',
        'Tussar silk weaving by tribal communities',
        'Traditional Santhal dance and music',
        'Tribal homestays with authentic experiences'
      ],
      marketplace: [
        {
          name: 'Handwoven Tussar Silk Saree',
          vendor: 'Malti Devi Weaver Collective',
          price: 2500,
          category: 'Textiles',
          location: 'Chaibasa'
        },
        {
          name: 'Dokra Metal Craft Elephant',
          vendor: 'Ramesh Kumar Arts',
          price: 850,
          category: 'Handicrafts',
          location: 'Khunti'
        },
        {
          name: 'Tribal Eco Homestay',
          vendor: 'Sushila Munda Homestay',
          price: 1200,
          category: 'Accommodation',
          location: 'Saraikela'
        }
      ]
    },
    assam: {
      attractions: [
        {
          name: 'Kaziranga National Park',
          category: 'Wildlife',
          description: 'UNESCO World Heritage site, home to one-horned rhinoceros',
          image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
          coordinates: { lat: 26.5775, lng: 93.1716 },
          rating: 4.8,
          bestTime: 'November to April'
        },
        {
          name: 'Tea Gardens of Jorhat',
          category: 'Plantation',
          description: 'Sprawling tea estates with guided tours and tastings',
          image: 'https://images.unsplash.com/photo-1580371806876-e5ad86a68e0c?w=800&q=80',
          coordinates: { lat: 26.7509, lng: 94.2037 },
          rating: 4.5,
          bestTime: 'October to March'
        },
        {
          name: 'Majuli Island',
          category: 'Cultural',
          description: 'World\'s largest river island, center of Assamese culture',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
          coordinates: { lat: 27.0000, lng: 94.2167 },
          rating: 4.7,
          bestTime: 'October to March'
        }
      ],
      culture: [
        'Bihu festival - New Year celebration with dance',
        'Muga silk weaving - Golden silk tradition',
        'Sattriya dance - Classical Assamese dance form',
        'Traditional mask making and pottery',
        'River island cultural experiences'
      ],
      marketplace: [
        {
          name: 'Golden Muga Silk Mekhela Chador',
          vendor: 'Assam Silk Weavers',
          price: 3500,
          category: 'Textiles',
          location: 'Sualkuchi'
        },
        {
          name: 'Assam Tea Gift Set',
          vendor: 'Jorhat Tea Estate',
          price: 1200,
          category: 'Food & Beverages',
          location: 'Jorhat'
        },
        {
          name: 'Traditional Bamboo Crafts',
          vendor: 'Bamboo Artisans Collective',
          price: 450,
          category: 'Handicrafts',
          location: 'Tezpur'
        }
      ]
    },
    odisha: {
      attractions: [
        {
          name: 'Konark Sun Temple',
          category: 'Heritage',
          description: 'UNESCO World Heritage Site shaped like a giant chariot',
          image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
          coordinates: { lat: 19.8876, lng: 86.0944 },
          rating: 4.9,
          bestTime: 'October to March'
        },
        {
          name: 'Puri Jagannath Temple',
          category: 'Religious',
          description: 'Famous for Jagannath Rath Yatra festival',
          image: 'https://images.unsplash.com/photo-1580058572462-c3346c3c0625?w=800&q=80',
          coordinates: { lat: 19.8135, lng: 85.8312 },
          rating: 4.8,
          bestTime: 'October to March'
        },
        {
          name: 'Chilika Lake',
          category: 'Nature',
          description: 'Largest coastal lagoon, migratory bird sanctuary',
          image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800&q=80',
          coordinates: { lat: 19.7165, lng: 85.3206 },
          rating: 4.6,
          bestTime: 'November to February'
        }
      ],
      culture: [
        'Odissi classical dance performances',
        'Pattachitra painting on palm leaves',
        'Jagannath Rath Yatra festival',
        'Stone carving and temple architecture',
        'Traditional handloom weaving'
      ],
      marketplace: [
        {
          name: 'Pattachitra Painting Set',
          vendor: 'Raghurajpur Artists',
          price: 2800,
          category: 'Art',
          location: 'Raghurajpur'
        },
        {
          name: 'Silver Filigree Jewelry',
          vendor: 'Cuttack Silversmiths',
          price: 4500,
          category: 'Jewelry',
          location: 'Cuttack'
        },
        {
          name: 'Handwoven Ikat Saree',
          vendor: 'Sambalpuri Weavers',
          price: 3200,
          category: 'Textiles',
          location: 'Sambalpur'
        }
      ]
    },
    bangalore: {
      attractions: [
        {
          name: 'Nandi Hills',
          category: 'Hill Station',
          description: 'Sunrise point with ancient Chola temple ruins',
          image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
          coordinates: { lat: 13.3777, lng: 77.6838 },
          rating: 4.5,
          bestTime: 'September to February'
        },
        {
          name: 'Lalbagh Botanical Garden',
          category: 'Garden',
          description: 'Historic botanical garden with glass house and lake',
          image: 'https://images.unsplash.com/photo-1585932351693-56babb919a79?w=800&q=80',
          coordinates: { lat: 12.9507, lng: 77.5848 },
          rating: 4.4,
          bestTime: 'Year-round'
        },
        {
          name: 'Bangalore Palace',
          category: 'Heritage',
          description: 'Tudor-style palace with beautiful gardens',
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
          coordinates: { lat: 12.9986, lng: 77.5926 },
          rating: 4.3,
          bestTime: 'Year-round'
        }
      ],
      culture: [
        'Craft beer culture and rooftop experiences',
        'Tech startup ecosystem tours',
        'South Indian classical music concerts',
        'Traditional Mysore painting workshops',
        'Modern art galleries and cultural spaces'
      ],
      marketplace: [
        {
          name: 'Mysore Silk Saree',
          vendor: 'Silk Mark Certified Store',
          price: 5500,
          category: 'Textiles',
          location: 'Commercial Street'
        },
        {
          name: 'Sandalwood Products',
          vendor: 'Karnataka Sandalwood',
          price: 1800,
          category: 'Cosmetics',
          location: 'Chickpet'
        },
        {
          name: 'Filter Coffee Experience',
          vendor: 'Traditional Coffee House',
          price: 350,
          category: 'Experiences',
          location: 'Basavanagudi'
        }
      ]
    },
    mumbai: {
      attractions: [
        {
          name: 'Gateway of India',
          category: 'Monument',
          description: 'Iconic colonial monument overlooking the Arabian Sea',
          image: 'https://images.unsplash.com/photo-1567613049458-2d9b0b8dde89?w=800&q=80',
          coordinates: { lat: 18.9220, lng: 72.8347 },
          rating: 4.6,
          bestTime: 'October to March'
        },
        {
          name: 'Marine Drive',
          category: 'Promenade',
          description: 'Queen\'s Necklace - curved boulevard along the coast',
          image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
          coordinates: { lat: 18.9432, lng: 72.8265 },
          rating: 4.5,
          bestTime: 'Evening hours'
        },
        {
          name: 'Elephanta Caves',
          category: 'Heritage',
          description: 'Ancient rock-cut cave temples dedicated to Shiva',
          image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
          coordinates: { lat: 18.9633, lng: 72.9311 },
          rating: 4.4,
          bestTime: 'October to March'
        }
      ],
      culture: [
        'Bollywood film industry tours and experiences',
        'Street food culture of Mohammed Ali Road',
        'Ganesh Chaturthi festival celebrations',
        'Art galleries in Kala Ghoda district',
        'Traditional textile markets of Mangaldas'
      ],
      marketplace: [
        {
          name: 'Bollywood Movie Props',
          vendor: 'Film City Souvenirs',
          price: 2500,
          category: 'Memorabilia',
          location: 'Goregaon'
        },
        {
          name: 'Mumbai Street Food Tour',
          vendor: 'Local Food Guides',
          price: 1500,
          category: 'Experiences',
          location: 'Various locations'
        },
        {
          name: 'Traditional Dhokla Thali',
          vendor: 'Gujarati Thali House',
          price: 450,
          category: 'Food',
          location: 'Kalbadevi'
        }
      ]
    }
  };

  const currentData = stateData[selectedState as keyof typeof stateData] || stateData.jharkhand;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'attractions', label: 'Attractions', icon: MapPin },
    { id: 'culture', label: 'Culture', icon: Palette },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag }
  ];

  return (
    <div className="min-h-screen bg-background p-4 pt-28">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge 
            className="px-4 py-2 rounded-full"
            style={{ 
              backgroundColor: currentStateInfo.colors.primary,
              color: 'white'
            }}
          >
            <MapPin className="w-4 h-4 mr-2" />
            State Explorer
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold">
            Discover <span className="gradient-text">{currentStateInfo.name}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {currentStateInfo.description}
          </p>
        </div>

        {/* State Selector Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.values(statesInfo).map((state) => (
            <Card 
              key={state.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedState === state.id ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => setSelectedState(state.id)}
            >
              <CardContent className="p-4 text-center space-y-2">
                <div 
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: state.colors.primary }}
                >
                  {state.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{state.name}</div>
                  <div className="text-xs text-muted-foreground">{state.capital}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hero Section */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
          <img 
            src={currentStateInfo.heroImage}
            alt={currentStateInfo.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{currentStateInfo.name}</h2>
            <p className="text-lg opacity-90">Capital: {currentStateInfo.capital}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
              className="rounded-full flex items-center space-x-2"
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mountain className="w-6 h-6" />
                  <span>Highlights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentStateInfo.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Star className="w-5 h-5 text-primary mt-0.5" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-6 h-6" />
                  <span>Quick Facts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <MapPin className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <div className="font-medium">Capital</div>
                      <div className="text-muted-foreground">{currentStateInfo.capital}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Users className="w-5 h-5 mx-auto mb-1 text-accent" />
                      <div className="font-medium">Attractions</div>
                      <div className="text-muted-foreground">{currentData.attractions.length}+ sites</div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Palette className="w-5 h-5 mx-auto mb-1 text-secondary" />
                    <div className="font-medium">Cultural Heritage</div>
                    <div className="text-muted-foreground">Rich traditions & festivals</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'attractions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentData.attractions.map((attraction, index) => (
              <Card key={index} className="premium-card hover:scale-105 transition-transform duration-300">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img 
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-background/80 text-foreground">
                    {attraction.category}
                  </Badge>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{attraction.name}</h3>
                    <p className="text-muted-foreground text-sm">{attraction.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{attraction.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{attraction.bestTime}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full rounded-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'culture' && (
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-6 h-6" />
                <span>Cultural Heritage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentData.culture.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'marketplace' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentData.marketplace.map((item, index) => (
              <Card key={index} className="premium-card hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.vendor}</p>
                    </div>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      ₹{item.price.toLocaleString()}
                    </div>
                  </div>
                  
                  <Button className="w-full rounded-full">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StateDataPage;