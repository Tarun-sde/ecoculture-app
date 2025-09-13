// Enhanced mock data for the Eco & Culture Tourism App

export interface Activity {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  location: string;
  imageUrl: string;
  ecoScore: number;
  difficulty: string;
  includes: string[];
  coordinates?: { lat: number; lng: number };
}

export interface Reward {
  id: number;
  title: string;
  points: number;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface MarketplaceItem {
  id: number;
  name: string;
  category: 'crafts' | 'food' | 'stay' | 'activities';
  description: string;
  price: number;
  vendor: string;
  location: string;
  coordinates: { lat: number; lng: number };
  imageUrl: string;
  rating: number;
  isRecommended?: boolean;
  tags: string[];
}

export interface TouristPlace {
  id: number;
  name: string;
  state: string;
  category: string;
  description: string;
  imageUrl: string;
  coordinates: { lat: number; lng: number };
  activities: string[];
  culturalSignificance: string;
  bestTimeToVisit: string;
}

export interface CulturalStory {
  id: number;
  title: string;
  category: 'artisan' | 'festival' | 'homestay' | 'tradition';
  description: string;
  imageUrl: string;
  location: string;
  author: string;
  readTime: number;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  featured?: boolean;
  location?: string;
  state?: string;
  category?: string;
}

export const mockActivities: Activity[] = [
  {
    id: 1,
    name: "Forest Hiking at Dalma Wildlife Sanctuary",
    category: "Outdoor",
    description: "Explore pristine forest trails with guided eco-tours through Jharkhand's premier wildlife sanctuary",
    price: 25,
    duration: 3,
    location: "Dalma Wildlife Sanctuary, Jamshedpur",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    ecoScore: 9.2,
    difficulty: "Moderate",
    includes: ["Professional guide", "Eco-friendly snacks", "Wildlife spotting"],
    coordinates: { lat: 22.8897, lng: 86.1864 }
  },
  {
    id: 2,
    name: "Traditional Pottery Workshop",
    category: "Cultural",
    description: "Learn ancient pottery techniques from local artisans in authentic village settings",
    price: 30,
    duration: 4,
    location: "Khurja Village, Ranchi",
    imageUrl: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80",
    ecoScore: 8.5,
    difficulty: "Beginner",
    includes: ["Clay materials", "Expert instruction", "Take home creation"],
    coordinates: { lat: 23.3441, lng: 85.3096 }
  },
  {
    id: 3,
    name: "Subarnarekha River Conservation",
    category: "Conservation",
    description: "Join community efforts to clean and protect the golden river of Jharkhand",
    price: 0,
    duration: 6,
    location: "Subarnarekha River Banks, Jamshedpur",
    imageUrl: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800&q=80",
    ecoScore: 9.8,
    difficulty: "Easy",
    includes: ["Conservation tools", "Lunch", "Certificate"],
    coordinates: { lat: 22.8046, lng: 86.2029 }
  },
  {
    id: 4,
    name: "Santhal Tribal Village Experience",
    category: "Cultural",
    description: "Experience authentic tribal culture with homestay families in traditional Santhal villages",
    price: 45,
    duration: 24,
    location: "Dumka District",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d75d2f?w=800&q=80",
    ecoScore: 8.9,
    difficulty: "Moderate",
    includes: ["Traditional meals", "Cultural performances", "Village tour"],
    coordinates: { lat: 24.2965, lng: 87.2495 }
  },
  {
    id: 5,
    name: "Netarhat Sunset Point Trek",
    category: "Outdoor",
    description: "Trek to the famous Queen of Chotanagpur plateau for breathtaking sunset views",
    price: 35,
    duration: 5,
    location: "Netarhat, Latehar",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ecoScore: 9.1,
    difficulty: "Moderate",
    includes: ["Guide", "Tea & snacks", "Photography spots"],
    coordinates: { lat: 23.4676, lng: 84.2593 }
  },
  {
    id: 6,
    name: "Tribal Art Workshop",
    category: "Cultural",
    description: "Learn traditional Warli and Gond art techniques from master artists",
    price: 40,
    duration: 6,
    location: "Khunti District",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ecoScore: 8.7,
    difficulty: "Beginner",
    includes: ["Art supplies", "Lunch", "Certificate"],
    coordinates: { lat: 23.0718, lng: 85.2787 }
  },
  {
    id: 7,
    name: "Biodiversity Conservation Project",
    category: "Conservation",
    description: "Participate in seed collection and native plant restoration efforts",
    price: 0,
    duration: 8,
    location: "Palamau Tiger Reserve",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
    ecoScore: 9.6,
    difficulty: "Easy",
    includes: ["Equipment", "Meals", "Transport"],
    coordinates: { lat: 24.0333, lng: 83.7833 }
  },
  {
    id: 8,
    name: "Waterfall Rappelling Adventure",
    category: "Outdoor",
    description: "Experience the thrill of rappelling down Hundru Falls with safety equipment",
    price: 65,
    duration: 4,
    location: "Hundru Falls, Ranchi",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    ecoScore: 8.3,
    difficulty: "Hard",
    includes: ["Safety gear", "Professional instructor", "Photography"],
    coordinates: { lat: 23.2759, lng: 85.6093 }
  }
];

export const mockRewards: Reward[] = [
  {
    id: 1,
    title: "Eco Warrior",
    points: 100,
    description: "Complete 5 conservation activities",
    icon: "🌱",
    unlocked: true
  },
  {
    id: 2,
    title: "Culture Explorer",
    points: 75,
    description: "Visit 3 different cultural sites",
    icon: "🏛️",
    unlocked: false
  },
  {
    id: 3,
    title: "Green Traveler",
    points: 150,
    description: "Travel 500km using eco-friendly transport",
    icon: "🚲",
    unlocked: false
  },
  {
    id: 4,
    title: "Community Helper",
    points: 200,
    description: "Participate in 10 community service activities",
    icon: "🤝",
    unlocked: false
  },
  {
    id: 5,
    title: "Heritage Guardian",
    points: 125,
    description: "Document and share 5 cultural stories",
    icon: "📚",
    unlocked: true
  }
];

export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: 1,
    name: "Handwoven Tussar Silk Saree",
    category: 'crafts',
    description: "Authentic Jharkhand tussar silk saree with traditional tribal motifs",
    price: 2500,
    vendor: "Malti Devi Weaver Collective",
    location: "Chaibasa, West Singhbhum",
    coordinates: { lat: 22.5561, lng: 85.8088 },
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    rating: 4.8,
    isRecommended: true,
    tags: ["handwoven", "silk", "tribal", "authentic"]
  },
  {
    id: 2,
    name: "Dokra Metal Craft Elephant",
    category: 'crafts',
    description: "Traditional brass figurine made using ancient lost-wax casting technique",
    price: 850,
    vendor: "Ramesh Kumar Arts",
    location: "Khunti District",
    coordinates: { lat: 23.0718, lng: 85.2787 },
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    rating: 4.6,
    isRecommended: true,
    tags: ["dokra", "brass", "handcrafted", "traditional"]
  },
  {
    id: 3,
    name: "Organic Marua (Finger Millet) Pack",
    category: 'food',
    description: "Locally grown organic finger millet, rich in nutrients and sustainably farmed",
    price: 180,
    vendor: "Jharkhand Organic Farmers Cooperative",
    location: "Gumla District",
    coordinates: { lat: 23.0433, lng: 84.5385 },
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
    rating: 4.9,
    isRecommended: false,
    tags: ["organic", "millet", "healthy", "local"]
  },
  {
    id: 4,
    name: "Tribal Eco Homestay Experience",
    category: 'stay',
    description: "Authentic stay with Munda tribal family, including meals and cultural activities",
    price: 1200,
    vendor: "Sushila Munda Homestay",
    location: "Saraikela, Jharkhand",
    coordinates: { lat: 22.7011, lng: 85.9240 },
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    rating: 4.7,
    isRecommended: true,
    tags: ["homestay", "tribal", "authentic", "cultural"]
  },
  {
    id: 5,
    name: "Waterfall Trekking Adventure",
    category: 'activities',
    description: "Guided trek to hidden waterfalls with lunch and photography session",
    price: 800,
    vendor: "Jharkhand Adventure Tours",
    location: "Netarhat, Latehar",
    coordinates: { lat: 23.4676, lng: 84.2593 },
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    rating: 4.5,
    isRecommended: false,
    tags: ["trekking", "waterfall", "adventure", "nature"]
  }
];

export const statesData = {
  jharkhand: {
    name: "Jharkhand",
    capital: "Ranchi",
    description: "The land of forests, known for its rich tribal culture and mineral wealth",
    touristPlaces: [
      {
        id: 1,
        name: "Netarhat",
        state: "Jharkhand",
        category: "Hill Station",
        description: "Queen of Chotanagpur, famous for sunrise and sunset views",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        coordinates: { lat: 23.4676, lng: 84.2593 },
        activities: ["Sunrise viewing", "Nature walks", "Photography", "Camping"],
        culturalSignificance: "Sacred site for local tribes with ancient stories",
        bestTimeToVisit: "October to March"
      },
      {
        id: 2,
        name: "Deoghar Temple Complex",
        state: "Jharkhand",
        category: "Religious",
        description: "One of the twelve Jyotirlingas, major pilgrimage destination",
        imageUrl: "https://images.unsplash.com/photo-1580058572462-c3346c3c0625?w=800&q=80",
        coordinates: { lat: 24.4828, lng: 86.6992 },
        activities: ["Temple visits", "Spiritual tours", "Local festivals", "Cultural programs"],
        culturalSignificance: "Ancient Hindu pilgrimage site with rich mythological history",
        bestTimeToVisit: "July to September (Shravan month)"
      },
      {
        id: 3,
        name: "Dalma Wildlife Sanctuary",
        state: "Jharkhand",
        category: "Wildlife",
        description: "Home to elephants, leopards and diverse flora fauna",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
        coordinates: { lat: 22.8897, lng: 86.1864 },
        activities: ["Wildlife safari", "Bird watching", "Trekking", "Nature photography"],
        culturalSignificance: "Traditional hunting grounds of local tribes, now conservation area",
        bestTimeToVisit: "November to April"
      }
    ] as TouristPlace[]
  },
  odisha: {
    name: "Odisha",
    capital: "Bhubaneswar",
    description: "Land of temples, classical dance, and rich cultural heritage",
    touristPlaces: [
      {
        id: 4,
        name: "Konark Sun Temple",
        state: "Odisha",
        category: "Historical",
        description: "UNESCO World Heritage Site shaped like a giant chariot",
        imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
        coordinates: { lat: 19.8876, lng: 86.0944 },
        activities: ["Heritage walks", "Photography", "Cultural tours", "Sculpture viewing"],
        culturalSignificance: "13th century architectural marvel dedicated to Sun God",
        bestTimeToVisit: "October to March"
      },
      {
        id: 5,
        name: "Puri Jagannath Temple",
        state: "Odisha",
        category: "Religious",
        description: "Famous for Jagannath Rath Yatra festival",
        imageUrl: "https://images.unsplash.com/photo-1580058572462-c3346c3c0625?w=800&q=80",
        coordinates: { lat: 19.8135, lng: 85.8312 },
        activities: ["Temple visits", "Beach activities", "Festival participation", "Local cuisine"],
        culturalSignificance: "One of the Char Dham pilgrimage sites",
        bestTimeToVisit: "October to March"
      }
    ] as TouristPlace[]
  }
};

export const mockCulturalStories: CulturalStory[] = [
  {
    id: 1,
    title: "The Master Weaver of Chaibasa",
    category: 'artisan',
    description: "Meet Malti Devi, who has been preserving the ancient art of Tussar silk weaving for over 30 years, keeping tribal motifs alive through her intricate patterns.",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    location: "Chaibasa, West Singhbhum",
    author: "Priya Sharma",
    readTime: 5
  },
  {
    id: 2,
    title: "Sohrai Festival: Celebrating the Harvest",
    category: 'festival',
    description: "Experience the vibrant Sohrai festival where Santhal tribes celebrate the harvest season with colorful wall paintings and traditional dances that date back centuries.",
    imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d75d2f?w=800&q=80",
    location: "Dumka District",
    author: "Rajesh Kumar",
    readTime: 7
  },
  {
    id: 3,
    title: "Living with the Munda Family",
    category: 'homestay',
    description: "A heartwarming account of staying with a Munda tribal family, learning their sustainable farming practices and experiencing their deep connection with nature.",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    location: "Saraikela",
    author: "Anita Das",
    readTime: 6
  },
  {
    id: 4,
    title: "The Ancient Art of Dokra Casting",
    category: 'tradition',
    description: "Discover the 4000-year-old lost-wax casting technique still practiced by artisans in Jharkhand, creating beautiful brass figurines that tell stories of our heritage.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    location: "Khunti District",
    author: "Vikash Singh",
    readTime: 8
  }
];

export const mockItineraries = [
  {
    id: 1,
    title: "Eco-Cultural Jharkhand Explorer",
    duration: 5,
    budget: 8500,
    ecoRating: 9.2,
    highlights: ["Tribal village stay", "Wildlife sanctuary", "Organic farming", "Traditional crafts"],
    days: [
      {
        day: 1,
        title: "Arrival in Ranchi",
        activities: ["City tour", "Local market visit", "Traditional dinner"],
        accommodation: "Eco-friendly hotel",
        meals: "Breakfast, Lunch, Dinner"
      },
      {
        day: 2,
        title: "Netarhat Hill Station",
        activities: ["Sunrise viewing", "Nature walk", "Photography"],
        accommodation: "Mountain lodge",
        meals: "Breakfast, Lunch, Dinner"
      },
      {
        day: 3,
        title: "Tribal Village Experience",
        activities: ["Village tour", "Craft workshop", "Cultural performance"],
        accommodation: "Homestay",
        meals: "Traditional tribal cuisine"
      }
    ]
  },
  {
    id: 2,
    title: "Spiritual & Nature Retreat",
    duration: 3,
    budget: 4500,
    ecoRating: 8.5,
    highlights: ["Temple visits", "Meditation", "Organic food", "Nature therapy"],
    days: [
      {
        day: 1,
        title: "Deoghar Temple Complex",
        activities: ["Temple darshan", "Spiritual discourse", "Evening aarti"],
        accommodation: "Ashram stay",
        meals: "Sattvic meals"
      }
    ]
  }
];

export const mockHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Explore Your",
    subtitle: "Favorite Journey",
    description: "Discover breathtaking landscapes and cultural treasures across India's most pristine destinations",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    ctaText: "Start Exploring",
    ctaLink: "/trip-planner",
    featured: true,
    location: "All Destinations",
    state: "general",
    category: "adventure"
  },
  {
    id: 2,
    title: "Cultural",
    subtitle: "Heritage Tours",
    description: "Immerse yourself in authentic traditions and connect with local communities",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80",
    ctaText: "Discover Culture",
    ctaLink: "/marketplace",
    location: "Cultural Sites",
    state: "general",
    category: "cultural"
  },
  {
    id: 3,
    title: "Adventure",
    subtitle: "AR Experiences",
    description: "Experience destinations like never before with cutting-edge augmented reality",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    ctaText: "Try AR Mode",
    ctaLink: "/ar-experience",
    location: "AR Destinations",
    state: "general",
    category: "technology"
  },
  {
    id: 4,
    title: "Sustainable",
    subtitle: "Eco Tourism",
    description: "Travel responsibly while earning rewards for your eco-friendly choices",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80",
    ctaText: "Go Green",
    ctaLink: "/rewards",
    location: "Eco Destinations",
    state: "general",
    category: "sustainability"
  }
];

// State-specific hero slides for location-based relevancy
export const stateSpecificHeroSlides: Record<string, HeroSlide[]> = {
  jharkhand: [
    {
      id: 11,
      title: "Discover Jharkhand's",
      subtitle: "Tribal Heritage",
      description: "Experience authentic tribal culture, pristine forests, and ancient traditions in the land of forests",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80",
      ctaText: "Explore Jharkhand",
      ctaLink: "/trip-planner",
      featured: true,
      location: "Ranchi, Netarhat, Dalma",
      state: "jharkhand",
      category: "tribal-culture"
    },
    {
      id: 12,
      title: "Netarhat Hills",
      subtitle: "Queen of Chotanagpur",
      description: "Witness breathtaking sunrises, walk through pine forests, and connect with tribal communities",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
      ctaText: "Plan Netarhat Trip",
      ctaLink: "/trip-planner",
      location: "Netarhat Hill Station",
      state: "jharkhand",
      category: "nature-hills"
    },
    {
      id: 13,
      title: "Dalma Wildlife",
      subtitle: "Sanctuary Adventure",
      description: "Experience elephant safaris, conservation activities, and eco-friendly wildlife encounters",
      imageUrl: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=1920&q=80",
      ctaText: "Wildlife Safari",
      ctaLink: "/trip-planner",
      location: "Dalma Wildlife Sanctuary",
      state: "jharkhand",
      category: "wildlife"
    }
  ],
  assam: [
    {
      id: 21,
      title: "Assam's Majestic",
      subtitle: "Tea Gardens",
      description: "Journey through endless tea plantations, learn brewing secrets, and taste the world's finest teas",
      imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1920&q=80",
      ctaText: "Tea Tour Experience",
      ctaLink: "/trip-planner",
      featured: true,
      location: "Jorhat, Dibrugarh, Tezpur",
      state: "assam",
      category: "tea-culture"
    },
    {
      id: 22,
      title: "Kaziranga",
      subtitle: "Rhino Kingdom",
      description: "Witness one-horned rhinoceros in their natural habitat and support conservation efforts",
      imageUrl: "https://images.unsplash.com/photo-1549366021-9f761d040fb2?w=1920&q=80",
      ctaText: "Rhino Safari",
      ctaLink: "/trip-planner",
      location: "Kaziranga National Park",
      state: "assam",
      category: "wildlife-conservation"
    },
    {
      id: 23,
      title: "Majuli Island",
      subtitle: "River Heritage",
      description: "Explore the world's largest river island, traditional Satras, and unique Mishing culture",
      imageUrl: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1920&q=80",
      ctaText: "Island Adventure",
      ctaLink: "/trip-planner",
      location: "Majuli Island, Brahmaputra",
      state: "assam",
      category: "cultural-island"
    }
  ],
  odisha: [
    {
      id: 31,
      title: "Odisha's Sacred",
      subtitle: "Temple Heritage",
      description: "Discover magnificent Kalinga architecture, Jagannath culture, and ancient spiritual traditions",
      imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1920&q=80",
      ctaText: "Temple Tour",
      ctaLink: "/trip-planner",
      featured: true,
      location: "Bhubaneswar, Puri, Konark",
      state: "odisha",
      category: "temples-heritage"
    },
    {
      id: 32,
      title: "Konark Sun",
      subtitle: "Temple Marvel",
      description: "Experience the architectural wonder of the Sun Temple and learn ancient Pattachitra art",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80",
      ctaText: "Konark Experience",
      ctaLink: "/trip-planner",
      location: "Konark, Puri Coast",
      state: "odisha",
      category: "architecture-art"
    }
  ],
  bangalore: [
    {
      id: 41,
      title: "Bangalore's Modern",
      subtitle: "Garden City",
      description: "Experience the perfect blend of technology, gardens, and South Indian culture in Silicon Valley of India",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
      ctaText: "Explore Bangalore",
      ctaLink: "/trip-planner",
      featured: true,
      location: "Bangalore, Mysore, Coorg",
      state: "bangalore",
      category: "urban-nature"
    },
    {
      id: 42,
      title: "Coorg Coffee",
      subtitle: "Plantation Escape",
      description: "Journey through aromatic coffee plantations, misty hills, and traditional Kodava culture",
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&q=80",
      ctaText: "Coffee Tour",
      ctaLink: "/trip-planner",
      location: "Coorg, Madikeri, Chikmagalur",
      state: "bangalore",
      category: "coffee-hills"
    }
  ],
  mumbai: [
    {
      id: 51,
      title: "Mumbai's Vibrant",
      subtitle: "Coastal Culture",
      description: "Experience the city of dreams, from Bollywood magic to coastal fishing communities",
      imageUrl: "https://images.unsplash.com/photo-1567104544453-6bf7370ef072?w=1920&q=80",
      ctaText: "Mumbai Experience",
      ctaLink: "/trip-planner",
      featured: true,
      location: "Mumbai, Alibaug, Lonavala",
      state: "mumbai",
      category: "urban-coastal"
    },
    {
      id: 52,
      title: "Alibaug Coastal",
      subtitle: "Fishing Villages",
      description: "Discover traditional fishing communities, pristine beaches, and sustainable coastal tourism",
      imageUrl: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=1920&q=80",
      ctaText: "Coastal Adventure",
      ctaLink: "/trip-planner",
      location: "Alibaug, Murud, Kashid",
      state: "mumbai",
      category: "coastal-villages"
    }
  ]
};