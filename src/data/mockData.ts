// Mock data for the Eco & Culture Tourism App

export const touristSites = [
  {
    id: 1,
    name: "Sundarban Mangrove Forest",
    type: "eco-park",
    location: { lat: 22.0685, lng: 89.0501 },
    description: "UNESCO World Heritage site with diverse wildlife",
    rating: 4.8,
    price: 45,
    image: "/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png"
  },
  {
    id: 2,
    name: "Khajuraho Temples",
    type: "cultural-site",
    location: { lat: 24.8318, lng: 79.9199 },
    description: "Ancient temple complex showcasing medieval Indian architecture",
    rating: 4.7,
    price: 30,
    image: "/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png"
  },
  {
    id: 3,
    name: "Kerala Backwater Homestay",
    type: "homestay",
    location: { lat: 9.4981, lng: 76.3388 },
    description: "Traditional Kerala experience with local families",
    rating: 4.9,
    price: 60,
    image: "/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png"
  }
];

export const marketplaceItems = [
  {
    id: 1,
    name: "Hand-woven Bamboo Crafts",
    artisan: "Maya Devi",
    location: "Assam",
    price: 25,
    category: "handicraft",
    rating: 4.8,
    image: "/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png",
    ecoPoints: 15
  },
  {
    id: 2,
    name: "Organic Spice Collection",
    artisan: "Ravi Kumar",
    location: "Kerala",
    price: 35,
    category: "food",
    rating: 4.9,
    image: "/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png",
    ecoPoints: 20
  },
  {
    id: 3,
    name: "Mountain View Eco Lodge",
    artisan: "Himalayan Retreats",
    location: "Himachal Pradesh",
    price: 80,
    category: "homestay",
    rating: 4.7,
    image: "/lovable-uploads/c1284faf-e0c6-4635-9058-9fcc2faa3b0b.png",
    ecoPoints: 30
  }
];

export const tripPlannerOptions = {
  destinationTypes: [
    { id: "eco-park", label: "Eco Parks & Wildlife", icon: "🌿" },
    { id: "cultural-site", label: "Cultural Heritage", icon: "🏛️" },
    { id: "homestay", label: "Local Homestays", icon: "🏡" },
    { id: "adventure", label: "Adventure Activities", icon: "🏔️" }
  ],
  durations: [
    { id: "weekend", label: "Weekend (2-3 days)", value: "2-3" },
    { id: "week", label: "One Week", value: "7" },
    { id: "extended", label: "Extended (10+ days)", value: "10+" }
  ],
  budgetRanges: [
    { id: "budget", label: "Budget ($50-100)", min: 50, max: 100 },
    { id: "mid", label: "Mid-range ($100-300)", min: 100, max: 300 },
    { id: "luxury", label: "Luxury ($300+)", min: 300, max: 1000 }
  ]
};

export const sampleItinerary = {
  title: "Eco-Cultural Adventure in Kerala",
  duration: "7 days",
  totalCost: 280,
  ecoPoints: 120,
  days: [
    {
      day: 1,
      title: "Arrival & Backwater Exploration",
      activities: ["Check into eco-friendly homestay", "Sunset backwater cruise", "Traditional Kerala dinner"],
      cost: 45
    },
    {
      day: 2,
      title: "Spice Plantation & Village Walk",
      activities: ["Organic spice farm tour", "Village cultural program", "Cooking class with locals"],
      cost: 35
    },
    {
      day: 3,
      title: "Wildlife Sanctuary Visit",
      activities: ["Early morning bird watching", "Elephant conservation center", "Nature photography workshop"],
      cost: 50
    }
  ]
};

export const categories = [
  {
    id: "eco-parks",
    name: "Eco Parks",
    icon: "🌳",
    color: "bg-success",
    description: "Protected natural areas and wildlife sanctuaries"
  },
  {
    id: "cultural-heritage",
    name: "Cultural Heritage",
    icon: "🏛️",
    color: "bg-culture",
    description: "Ancient temples, monuments, and historical sites"
  },
  {
    id: "homestays",
    name: "Homestays",
    icon: "🏡",
    color: "bg-secondary",
    description: "Authentic local living experiences"
  },
  {
    id: "adventure",
    name: "Adventure",
    icon: "🏔️",
    color: "bg-accent",
    description: "Trekking, water sports, and outdoor activities"
  },
  {
    id: "local-food",
    name: "Local Food",
    icon: "🍛",
    color: "bg-warning",
    description: "Traditional cuisine and food experiences"
  },
  {
    id: "crafts",
    name: "Handicrafts",
    icon: "🎨",
    color: "bg-primary",
    description: "Local artisans and traditional crafts"
  }
];