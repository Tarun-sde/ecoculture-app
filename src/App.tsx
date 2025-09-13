import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StateProvider } from "@/contexts/StateContext";
import Layout from "./components/Layout";
import ModernHome from "./pages/ModernHome";
import EnhancedTripPlanner from "./pages/EnhancedTripPlanner";
import EnhancedARExperience from "./pages/EnhancedARExperience";
import EnhancedRewards from "./pages/EnhancedRewards";
import EnhancedMarketplace from "./pages/EnhancedMarketplace";
import StateDataPage from "./pages/StateDataPage";
import Login from "./pages/Login";
import NotFound from "./pages/Login";

// Import EnhancedInteractiveMap from the correct path
import EnhancedInteractiveMap from "./components/EnhancedInteractiveMap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StateProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<ModernHome />} />
                  <Route path="/trip-planner" element={<EnhancedTripPlanner />} />
                  <Route path="/ar-experience" element={<EnhancedARExperience />} />
                  <Route path="/rewards" element={<EnhancedRewards />} />
                  <Route path="/marketplace" element={<EnhancedMarketplace />} />
                  <Route path="/state-data" element={<StateDataPage />} />
                  <Route path="/map" element={<EnhancedInteractiveMap />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </StateProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
