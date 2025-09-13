import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Mountain,
  Camera,
  Globe,
  Phone,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    agreeToTerms: false,
  });
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null | undefined>(undefined);

  const navigate = useNavigate();

  // Set up the listener for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleInputChange = (field: string, value: string | boolean | React.ChangeEvent<HTMLInputElement>) => {
    const newValue = typeof value === 'object' ? value.target.value : value;
    setFormData((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Firebase Login
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success('Login successful! Welcome back 🌱');
      } else {
        // Firebase Signup
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        if (!formData.agreeToTerms) {
          toast.error('Please agree to the terms and conditions');
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Update the user's profile with their first and last name
        const fullName = `${formData.firstName} ${formData.lastName}`;
        await updateProfile(user, {
          displayName: fullName,
        });

        toast.success('Account created successfully! 🎉');
      }
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      switch (err.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use. Please sign in instead.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. It must be at least 6 characters long.';
          break;
        default:
          errorMessage = err.message;
          break;
      }

      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Logged in with Google 🚀');
    } catch (err: any) {
      let errorMessage = 'An error occurred with Google login. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login popup was closed. Please try again.';
      } else {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('You have been signed out.');
    } catch (err: any) {
      toast.error('Failed to sign out. Please try again.');
    }
  };

  // Show a loading spinner while authentication state is being determined
  if (currentUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Cultouria</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              Discover <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">India's Heritage</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Join thousands of travelers exploring India's rich cultural heritage, 
              pristine natural landscapes, and vibrant tribal traditions.
            </p>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-primary/5">
              <Camera className="w-8 h-8 text-primary" />
              <h3 className="font-semibold">AR Detection</h3>
              <p className="text-sm text-muted-foreground text-center">
                Upload images to discover landmarks with GPS and AI
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-accent/5">
              <Mountain className="w-8 h-8 text-accent" />
              <h3 className="font-semibold">Cultural Heritage</h3>
              <p className="text-sm text-muted-foreground text-center">
                Explore tribal traditions and historical significance
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-success/5">
              <Globe className="w-8 h-8 text-success" />
              <h3 className="font-semibold">Smart Planning</h3>
              <p className="text-sm text-muted-foreground text-center">
                AI-powered trip planning with eco-friendly options
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Sign in to continue your cultural journey' 
                : 'Join the community of heritage explorers'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <>
              {/* Google Login Button */}
              <Button 
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full border-primary/20 hover:border-primary/40"
              >
                <User className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e)}
                      className="pl-10"
                      required
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Link to="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{' '}
                      <Link to="#" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="#" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={handleGoogleLogin}
                >
                  🌐 Google
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => toast.info('Facebook login not yet configured')}
                >
                  📘 Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => toast.info('Apple login not yet configured')}
                >
                  🍎 Apple
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </Button>
              </div>
            </>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
