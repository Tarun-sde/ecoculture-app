import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MapPin, 
  Camera, 
  Award, 
  ShoppingBag,
  Menu, 
  X,
  Globe,
  User,
  Compass,
  LogOut,
  Settings,
  UserCircle
} from 'lucide-react';
import { useStateContext, statesInfo } from '@/contexts/StateContext';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the path as needed
import { toast } from 'sonner';

const ModernNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedState, setSelectedState, currentStateInfo } = useStateContext();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { path: '/', label: 'Home', shortLabel: 'Home', icon: Home },
    { path: '/trip-planner', label: 'Trip Planner', shortLabel: 'Trips', icon: MapPin },
    { path: '/ar-experience', label: 'AR Explore', shortLabel: 'AR', icon: Camera },
    { path: '/marketplace', label: 'Marketplace', shortLabel: 'Shop', icon: ShoppingBag },
    { path: '/rewards', label: 'Rewards', shortLabel: 'Rewards', icon: Award },
    { path: '/state-data', label: 'Discover', shortLabel: 'Discover', icon: Compass },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("You have been signed out!");
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const getUserInitials = (name: string | null | undefined): string => {
    if (!name) return '??';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return initials.length > 2 ? initials.slice(0, 2) : initials;
  };

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0];

  return (
    <>
      {/* Main Navigation - Optimized Container */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[96%] max-w-7xl">
        <div className="bg-white/95 backdrop-blur-xl border border-emerald-100/50 rounded-3xl px-2 sm:px-4 lg:px-6 py-2.5 shadow-2xl shadow-emerald-500/10">
          <div className="flex items-center justify-between gap-2">
            {/* Logo - Optimized */}
            <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                <img src='../src/assets/logo.jpg' alt="Cultouria Logo" className="w-6 h-6 rounded-xl"/>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-emerald-700 tracking-tight">
                  Cultouria
                </span>
                <div className="text-xs text-emerald-500 font-medium -mt-1 leading-none">
                  Discover
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Optimized with better responsive behavior */}
            <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 flex-1 justify-center max-w-2xl overflow-hidden">
              {navItems.map(({ path, label, shortLabel, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-1.5 lg:px-3 py-2 rounded-2xl text-xs font-medium transition-all duration-300 relative group whitespace-nowrap ${
                    location.pathname === path
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:block text-xs">{shortLabel}</span>
                  
                  {/* Active indicator */}
                  {location.pathname === path && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side Controls - Optimized */}
            <div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
              {/* State Selector - More Compact */}
              <div className="hidden xl:block">
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-[100px] h-8 rounded-2xl border-0 bg-emerald-50 hover:bg-emerald-100 transition-colors text-emerald-700 font-medium text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-emerald-100 bg-white/95 backdrop-blur-xl shadow-xl">
                    {Object.values(statesInfo).map((state) => (
                      <SelectItem key={state.id} value={state.id} className="rounded-xl">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: state.colors.primary }}
                          />
                          <span className="text-xs">{state.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language Toggle - More Compact */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="rounded-2xl hidden lg:flex items-center space-x-1 hover:bg-emerald-50 text-emerald-600 font-medium px-2 py-1.5 text-xs h-8"
              >
                <Globe className="w-3 h-3" />
                <span className="hidden xl:inline">{language === 'en' ? 'EN' : 'हिं'}</span>
              </Button>

              {/* Authentication Menu - Optimized */}
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="rounded-2xl hover:bg-emerald-50 text-emerald-600 font-medium px-2 py-1.5 text-xs h-8"
                    >
                      <div className="flex items-center space-x-1.5">
                        {currentUser.photoURL ? (
                          <img 
                            src={currentUser.photoURL} 
                            alt={userDisplayName || 'User'} 
                            className="w-5 h-5 rounded-full object-cover border border-emerald-200"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-medium flex items-center justify-center">
                            {getUserInitials(userDisplayName)}
                          </div>
                        )}
                        <span className="hidden xl:block text-xs">{userDisplayName?.split(' ')[0]}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 rounded-2xl border-emerald-100 bg-white/95 backdrop-blur-xl shadow-xl"
                  >
                    <DropdownMenuLabel className="font-medium text-emerald-700">
                      <div className="flex flex-col space-y-1">
                        <span>{userDisplayName}</span>
                        <span className="text-xs text-emerald-500 font-normal">{currentUser.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-emerald-100" />
                    <DropdownMenuItem className="rounded-xl cursor-pointer hover:bg-emerald-50">
                      <UserCircle className="w-4 h-4 mr-2 text-emerald-600" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl cursor-pointer hover:bg-emerald-50">
                      <Settings className="w-4 h-4 mr-2 text-emerald-600" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-emerald-100" />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="rounded-xl cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login" className="hidden md:block">
                  <Button className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-3 py-1.5 text-xs shadow-lg shadow-emerald-500/30 transition-all duration-200 h-8">
                    <User className="w-3 h-3 mr-1" />
                    <span className="hidden lg:inline">Login</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm">
            <div className="bg-white/95 backdrop-blur-xl border border-emerald-100/50 rounded-3xl p-6 shadow-2xl shadow-emerald-500/10">
              <div className="space-y-3">
                {/* Mobile Navigation Items */}
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                      location.pathname === path
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
                
                {/* Mobile State Selector */}
                <div className="pt-4 border-t border-emerald-100">
                  <label className="text-sm font-medium text-emerald-700 mb-3 block">
                    Select State
                  </label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-full rounded-2xl border-emerald-100 bg-emerald-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-emerald-100 bg-white/95 backdrop-blur-xl">
                      {Object.values(statesInfo).map((state) => (
                        <SelectItem key={state.id} value={state.id} className="rounded-xl">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: state.colors.primary }}
                            />
                            <span>{state.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Controls */}
                <div className="pt-4 border-t border-emerald-100">
                  {currentUser ? (
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 px-4 py-3 bg-emerald-50 rounded-2xl">
                        {currentUser.photoURL ? (
                          <img 
                            src={currentUser.photoURL} 
                            alt={userDisplayName || 'User'} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white text-sm font-medium flex items-center justify-center">
                            {getUserInitials(userDisplayName)}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-emerald-700">{userDisplayName}</div>
                          <div className="text-xs text-emerald-500">{currentUser.email}</div>
                        </div>
                      </div>
                      
                      {/* User Actions */}
                      <div className="space-y-2">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start rounded-2xl hover:bg-emerald-50 text-emerald-600"
                        >
                          <UserCircle className="w-4 h-4 mr-3" />
                          Profile
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start rounded-2xl hover:bg-emerald-50 text-emerald-600"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Button>
                        <Button 
                          onClick={handleSignOut}
                          variant="ghost" 
                          className="w-full justify-start rounded-2xl hover:bg-red-50 text-red-600"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleLanguage}
                        className="flex items-center space-x-2 rounded-2xl hover:bg-emerald-50 text-emerald-600 flex-1"
                      >
                        <Globe className="w-4 h-4" />
                        <span>{language === 'en' ? 'English' : 'हिंदी'}</span>
                      </Button>
                      
                      <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                        <Button className="w-full rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/30 transition-all duration-200">
                          <User className="w-4 h-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernNavbar;