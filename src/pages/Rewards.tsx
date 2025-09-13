import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Leaf, Gift, Star, TreePine, Users, Heart, Zap } from 'lucide-react';

const Rewards = () => {
  const currentPoints = 1250;
  const nextTierPoints = 2000;
  const progressPercentage = (currentPoints / nextTierPoints) * 100;

  const recentActivities = [
    { id: 1, activity: 'Booked eco-friendly homestay', points: 50, date: '2 days ago', icon: TreePine },
    { id: 2, activity: 'Completed cultural workshop', points: 30, date: '1 week ago', icon: Users },
    { id: 3, activity: 'Purchased from local artisan', points: 25, date: '1 week ago', icon: Heart },
    { id: 4, activity: 'Used sustainable transport', points: 20, date: '2 weeks ago', icon: Leaf }
  ];

  const availableRewards = [
    {
      id: 1,
      title: '20% Off Next Eco Adventure',
      description: 'Valid for any eco-park or wildlife sanctuary booking',
      points: 500,
      category: 'Discount',
      icon: '🌿',
      available: true
    },
    {
      id: 2,
      title: 'Free Cultural Workshop',
      description: 'Join any artisan workshop for free',
      points: 800,
      category: 'Experience',
      icon: '🎨',
      available: true
    },
    {
      id: 3,
      title: 'Premium AR Experience Pack',
      description: 'Access to exclusive AR cultural experiences',
      points: 1000,
      category: 'Digital',
      icon: '📱',
      available: true
    },
    {
      id: 4,
      title: 'Local Artisan Product Voucher',
      description: '$50 voucher for marketplace purchases',
      points: 1200,
      category: 'Shopping',
      icon: '🛍️',
      available: true
    },
    {
      id: 5,
      title: 'Sustainable Travel Gear Set',
      description: 'Eco-friendly travel essentials bundle',
      points: 1500,
      category: 'Product',
      icon: '🎒',
      available: false
    },
    {
      id: 6,
      title: 'Tree Planting Ceremony Participation',
      description: 'Join a reforestation project with your name on a tree',
      points: 2000,
      category: 'Impact',
      icon: '🌳',
      available: false
    }
  ];

  const achievements = [
    { id: 1, title: 'Eco Warrior', description: 'Completed first sustainable trip', unlocked: true, icon: Leaf },
    { id: 2, title: 'Culture Explorer', description: 'Visited 3 cultural heritage sites', unlocked: true, icon: Star },
    { id: 3, title: 'Community Champion', description: 'Supported 5 local artisans', unlocked: true, icon: Users },
    { id: 4, title: 'Conservation Hero', description: 'Contributed to wildlife protection', unlocked: false, icon: TreePine },
    { id: 5, title: 'Ambassador', description: 'Referred 5 friends to EcoTravel', unlocked: false, icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/5 to-primary/5">
      {/* Header */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Your Eco Rewards</h1>
            <p className="text-muted-foreground text-lg">
              Earn points for sustainable choices and redeem them for amazing experiences
            </p>
          </div>

          {/* Points Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-primary to-success text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-6 h-6" />
                  Total Eco Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{currentPoints.toLocaleString()}</div>
                <p className="opacity-90">Points earned this month: 320</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-warning" />
                  Current Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning mb-2">Gold Explorer</div>
                <Progress value={progressPercentage} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  {nextTierPoints - currentPoints} points to Platinum
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-accent" />
                  Impact Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent mb-2">8.7/10</div>
                <p className="text-sm text-muted-foreground">
                  Your positive environmental impact rating
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-6 h-6 text-secondary" />
                  Redeem Rewards
                </CardTitle>
                <CardDescription>
                  Use your eco points to unlock amazing sustainable experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {availableRewards.map((reward) => (
                    <Card 
                      key={reward.id} 
                      className={`${!reward.available ? 'opacity-60' : 'hover:shadow-md transition-shadow'}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="text-2xl">{reward.icon}</div>
                          <Badge variant={reward.available ? "default" : "secondary"}>
                            {reward.points} pts
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {reward.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            {reward.category}
                          </Badge>
                          <Button 
                            size="sm" 
                            disabled={!reward.available || currentPoints < reward.points}
                            className={reward.available && currentPoints >= reward.points ? 'bg-primary hover:bg-primary/90' : ''}
                          >
                            {reward.available && currentPoints >= reward.points ? 'Redeem' : 'Not Available'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Your eco-friendly actions that earned you points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-success" />
                        </div>
                        <div className="flex-1">
                          <div className="font-mediu mb-1">{activity.activity}</div>
                          <div className="text-sm text-muted-foreground">{activity.date}</div>
                        </div>
                        <Badge className="bg-success text-success-foreground">
                          +{activity.points} pts
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-warning" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div 
                      key={achievement.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        achievement.unlocked ? 'bg-success/10' : 'bg-muted/30 opacity-60'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achievement.unlocked ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Points Earning Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Earn More Points</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Book eco-certified accommodations</div>
                    <div className="text-muted-foreground">+50 points per booking</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Support local artisans</div>
                    <div className="text-muted-foreground">+25 points per purchase</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Complete cultural experiences</div>
                    <div className="text-muted-foreground">+30 points each</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-culture rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Refer friends</div>
                    <div className="text-muted-foreground">+100 points per referral</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;