import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MapPin, Clock, DollarSign, Leaf, Users } from 'lucide-react';
import { tripPlannerOptions, sampleItinerary } from '@/data/mockData';

interface FormData {
  destination: string;
  destinationType: string;
  duration: string;
  budget: string;
  groupSize: string;
  interests: string[];
  specialRequests: string;
}

const TripPlanner = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    destinationType: '',
    duration: '',
    budget: '',
    groupSize: '',
    interests: [],
    specialRequests: ''
  });
  const [showItinerary, setShowItinerary] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateItinerary = () => {
    setShowItinerary(true);
  };

  if (showItinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Your Personalized Itinerary</h1>
            <p className="text-muted-foreground">
              Based on your preferences, here's your eco-cultural adventure
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                {sampleItinerary.title}
              </CardTitle>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {sampleItinerary.duration}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${sampleItinerary.totalCost}
                </div>
                <div className="flex items-center gap-1">
                  <Leaf className="w-4 h-4 text-success" />
                  {sampleItinerary.ecoPoints} Eco Points
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-6">
            {sampleItinerary.days.map((day) => (
              <Card key={day.day} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardTitle className="text-xl">
                    Day {day.day}: {day.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3 mb-4">
                    {day.activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <Badge variant="outline" className="text-primary border-primary">
                      ${day.cost} per person
                    </Badge>
                    <Button size="sm" variant="outline">
                      Customize Day
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center space-y-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Book This Adventure
            </Button>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setShowItinerary(false)}>
                Modify Preferences
              </Button>
              <Button variant="outline">
                Share Itinerary
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Plan Your Eco Adventure</h1>
          <p className="text-muted-foreground">
            Tell us your preferences and we'll create a personalized sustainable travel experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 ${
                    step > stepNum ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Step {step} of 3: {step === 1 ? 'Destination & Duration' : step === 2 ? 'Preferences & Budget' : 'Final Details'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="destination">Preferred Destination (Optional)</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Kerala, Rajasthan, or leave blank for suggestions"
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>What type of experience are you looking for?</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {tripPlannerOptions.destinationTypes.map((type) => (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          formData.destinationType === type.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleInputChange('destinationType', type.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-medium">{type.label}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How long is your trip?" />
                    </SelectTrigger>
                    <SelectContent>
                      {tripPlannerOptions.durations.map((duration) => (
                        <SelectItem key={duration.id} value={duration.id}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <div className="grid gap-3">
                    {tripPlannerOptions.budgetRanges.map((budget) => (
                      <Card
                        key={budget.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          formData.budget === budget.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleInputChange('budget', budget.id)}
                      >
                        <CardContent className="p-4">
                          <div className="font-medium">{budget.label}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Group Size</Label>
                  <Select value={formData.groupSize} onValueChange={(value) => handleInputChange('groupSize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How many people?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo Travel</SelectItem>
                      <SelectItem value="couple">Couple (2 people)</SelectItem>
                      <SelectItem value="small">Small Group (3-5 people)</SelectItem>
                      <SelectItem value="large">Large Group (6+ people)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Interests (Select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Wildlife Photography', 'Local Cuisine', 'Adventure Sports', 'Cultural Immersion', 'Meditation & Wellness', 'Artisan Workshops'].map((interest) => (
                      <Badge
                        key={interest}
                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="special-requests">Special Requests or Dietary Restrictions</Label>
                  <Textarea
                    id="special-requests"
                    placeholder="Any special accommodations, dietary needs, or specific interests..."
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  />
                </div>

                <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-success" />
                      Your Eco Impact Preview
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Support local communities</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Carbon-neutral transport</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Eco-friendly accommodations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Conservation contributions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  className="ml-auto"
                  disabled={
                    (step === 1 && !formData.destinationType) ||
                    (step === 2 && !formData.budget)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={generateItinerary}
                  className="ml-auto bg-primary hover:bg-primary/90"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Generate My Itinerary
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripPlanner;