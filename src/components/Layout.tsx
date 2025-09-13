import React from 'react';
import ModernNavbar from './ModernNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-muted border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center">
                  <img src="./src/assets/logo.jpg" alt="Logo"></img>
                </div>
                <span className="font-bold text-xl">Cultouria</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Discover sustainable tourism experiences that connect you with nature and local cultures.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Eco Parks</a></li>
                <li><a href="#" className="hover:text-foreground">Cultural Sites</a></li>
                <li><a href="#" className="hover:text-foreground">Homestays</a></li>
                <li><a href="#" className="hover:text-foreground">Adventures</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Local Artisans</a></li>
                <li><a href="#" className="hover:text-foreground">Eco Rewards</a></li>
                <li><a href="#" className="hover:text-foreground">Travel Stories</a></li>
                <li><a href="#" className="hover:text-foreground">Sustainability</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground">Feedback</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Cultouria. All rights reserved. Built with 💚 for sustainable tourism.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;