import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Leaf, 
  Star, 
  Gift,
  Sparkles,
  TreePine,
  Users,
  MapPin,
  Camera,
  Heart,
  CheckCircle,
  Trophy,
  Zap,
  Target,
  ArrowRight,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { mockRewards } from '@/data/enhancedMockData';

const EnhancedRewards = () => {
  const [currentPoints, setCurrentPoints] = useState(230);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock user data
  const userStats = {
    totalPoints: currentPoints,
    pointsThisWeek: 45,
    pointsThisMonth: 180,
    ecoImpact: {
      carbonSaved: 120, // kg CO2
      treesPlanted: 5,
      communitiesSupported: 8,
      plasticAvoided: 15 // kg
    },
    achievements: mockRewards,
    currentLevel: 'Eco Explorer',
    nextLevel: 'Green Guardian',
    pointsToNextLevel: 270,
    streakDays: 12
  };

  const redeemableRewards = [
    {
      id: 1,
      title: "20% Off Local Crafts",
      description: "Get discount on authentic handmade products",
      points: 50,
      category: "marketplace",
      icon: "🎨",
      vendor: "Multiple Artisans",
      validUntil: "30 days",
      available: true
    },
    {
      id: 2,
      title: "Free Guided Nature Walk",
      description: "Complimentary eco-tour with local guide",
      points: 100,
      category: "experience",
      icon: "🥾",
      vendor: "Jharkhand Eco Tours",
      validUntil: "60 days",
      available: true
    },
    {
      id: 3,
      title: "Organic Meal Voucher",
      description: "Farm-to-table dining experience",
      points: 75,
      category: "food",
      icon: "🌱",
      vendor: "Green Valley Farm",
      validUntil: "45 days",
      available: true
    },
    {
      id: 4,
      title: "Traditional Pottery Class",
      description: "Learn from master artisans",
      points: 150,
      category: "experience",
      icon: "🏺",
      vendor: "Khurja Village Workshop",
      validUntil: "90 days",
      available: true
    },
    {
      id: 5,
      title: "Homestay Credit",
      description: "₹500 credit for tribal homestays",
      points: 200,
      category: "stay",
      icon: "🏡",
      vendor: "Community Homestays",
      validUntil: "120 days",
      available: currentPoints >= 200
    },
    {
      id: 6,
      title: "Premium AR Experience",
      description: "Unlock exclusive AR content",
      points: 300,
      category: "digital",
      icon: "🔮",
      vendor: "EcoCulture AR",
      validUntil: "Lifetime",
      available: currentPoints >= 300
    }
  ];

  const weeklyChallenge = {
    title: "Eco Warrior Week",
    description: "Complete sustainable travel activities",
    progress: 3,
    total: 5,
    reward: 50,
    tasks: [
      { title: "Visit a local market", completed: true },
      { title: "Use public transport", completed: true },
      { title: "Book eco-friendly stay", completed: true },
      { title: "Share cultural story", completed: false },
      { title: "Plant a tree", completed: false }
    ]
  };

  const filteredRewards = selectedCategory === 'all' 
    ? redeemableRewards 
    : redeemableRewards.filter(reward => reward.category === selectedCategory);

  const redeemReward = (rewardId: number, pointsCost: number) => {
    if (currentPoints >= pointsCost) {
      setCurrentPoints(prev => prev - pointsCost);
      // Show success message or modal in real app
    }
  };

  const getLevelProgress = () => {
    const currentLevelPoints = 200; // Points needed for current level
    const nextLevelPoints = userStats.pointsToNextLevel;
    const progress = (currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  return (
    <div className="ios-page pt-28">
      <div className="ios-container space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 gradient-green rounded-3xl mb-6 shadow-lg animate-bounce-in">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Your <span className="ios-text-gradient">Impact Rewards</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Earn eco-points for sustainable travel choices and redeem them for 
            authentic experiences, local products, and exclusive content
          </p>
        </div>

        {/* iOS-Style User Stats Dashboard */}
        <div className="ios-grid-4 gap-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
          {/* Total Points */}
          <div className="ios-card-hover p-6 text-center space-y-4">
            <div className="w-16 h-16 gradient-green rounded-3xl flex items-center justify-center mx-auto shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">{userStats.totalPoints}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Eco Points</div>
            </div>
            <div className="ios-badge-success">
              +{userStats.pointsThisWeek} this week
            </div>
          </div>

          {/* Current Level */}
          <div className="ios-card-hover p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 gradient-blue rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">{userStats.currentLevel}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Current Level</div>
              </div>
            </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {userStats.nextLevel}</span>
                  <span>{Math.round(getLevelProgress())}%</span>
                </div>
                <Progress value={getLevelProgress()} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {userStats.pointsToNextLevel - currentPoints} points to next level
                </div>
              </div>
            </div>

          {/* Streak */}
          <Card className="premium-card">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-warning to-secondary rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-warning">{userStats.streakDays}</div>
                <div className="text-muted-foreground">Day Streak</div>
              </div>
              <Badge className="bg-warning/10 text-warning">
                Keep it up! 🔥
              </Badge>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <Card className="premium-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center">
                  <TreePine className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Eco Impact</div>
                  <div className="text-sm text-muted-foreground">Your contribution</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Trees planted</span>
                  <span className="font-medium">{userStats.ecoImpact.treesPlanted} 🌱</span>
                </div>
                <div className="flex justify-between">
                  <span>CO₂ saved</span>
                  <span className="font-medium">{userStats.ecoImpact.carbonSaved}kg 🌍</span>
                </div>
                <div className="flex justify-between">
                  <span>Communities</span>
                  <span className="font-medium">{userStats.ecoImpact.communitiesSupported} 🤝</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Challenge */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6" />
                <span>{weeklyChallenge.title}</span>
              </div>
              <Badge className="bg-primary/10 text-primary">
                +{weeklyChallenge.reward} points
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{weeklyChallenge.description}</span>
                <span className="text-sm font-medium">
                  {weeklyChallenge.progress}/{weeklyChallenge.total} completed
                </span>
              </div>
              <Progress value={(weeklyChallenge.progress / weeklyChallenge.total) * 100} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weeklyChallenge.tasks.map((task, index) => (
                <Card key={index} className={`p-4 text-center transition-colors ${
                  task.completed ? 'bg-success/10 border-success' : 'bg-muted/30'
                }`}>
                  <div className="space-y-2">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                      task.completed ? 'bg-success text-white' : 'bg-muted'
                    }`}>
                      {task.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <div className="text-sm font-medium">{task.title}</div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-6 h-6" />
              <span>Your Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {userStats.achievements.map((achievement) => (
                <Card key={achievement.id} className={`p-4 text-center transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-primary/10 to-success/10 border-primary hover:scale-105' 
                    : 'bg-muted/30 opacity-60'
                }`}>
                  <div className="space-y-3">
                    <div className={`text-4xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </div>
                    </div>
                    <Badge variant={achievement.unlocked ? "default" : "secondary"} className="text-xs">
                      {achievement.points} pts
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Redeem Rewards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Redeem Rewards</h2>
            <div className="flex space-x-2">
              {['all', 'experience', 'marketplace', 'food', 'stay', 'digital'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <Card key={reward.id} className={`premium-card ${
                !reward.available ? 'opacity-60' : 'hover:scale-105'
              } transition-all duration-300`}>
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{reward.icon}</div>
                      <div>
                        <h3 className="font-semibold">{reward.title}</h3>
                        <p className="text-sm text-muted-foreground">{reward.vendor}</p>
                      </div>
                    </div>
                    <Badge variant={reward.available ? "default" : "secondary"}>
                      {reward.points} pts
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{reward.description}</p>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>Valid for {reward.validUntil}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Button 
                    className="w-full"
                    disabled={!reward.available}
                    onClick={() => redeemReward(reward.id, reward.points)}
                  >
                    {reward.available ? (
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        Redeem Now
                      </>
                    ) : (
                      <>
                        <span>Need {reward.points - currentPoints} more points</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Earn Points */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6" />
              <span>How to Earn More Points</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Visit Eco Sites</div>
                  <div className="text-sm text-muted-foreground">+10-20 points per visit</div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto">
                  <TreePine className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="font-semibold">Sustainable Choices</div>
                  <div className="text-sm text-muted-foreground">+5-15 points per action</div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="font-semibold">Share Stories</div>
                  <div className="text-sm text-muted-foreground">+25 points per story</div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold">Support Locals</div>
                  <div className="text-sm text-muted-foreground">+15-30 points per purchase</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="premium-card">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Earning Today
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to <span className="gradient-text">Make an Impact</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Every sustainable choice you make earns points and creates positive change 
                for local communities and the environment
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-premium">
                <MapPin className="w-5 h-5 mr-2" />
                Plan Eco Trip
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="w-5 h-5 mr-2" />
                Browse Marketplace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedRewards;