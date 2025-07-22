import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/components/language-provider";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import PhotoUpload from "@/pages/photo-upload";
import AiProcessing from "@/pages/ai-processing";
import DesignSelection from "@/pages/design-selection";
import DesignPreview from "@/pages/design-preview";
import Payment from "@/pages/payment";
import AppointmentBooking from "@/pages/appointment-booking-new";
import AdminDashboard from "@/pages/admin-dashboard";
import PrintingStatus from "@/pages/printing-status";
import AdminPanel from "@/pages/admin-panel";
import { EnhancedAdminPanel } from "@/components/enhanced-admin-panel";
import Gallery from "@/pages/gallery";
import AITailGenerator from "@/pages/ai-nail-generator";
import GalleryAdmin from "@/pages/gallery-admin";
import RealTimeBooking from "@/pages/real-time-booking";
import CustomerManagementPage from "@/pages/customer-management";
import Signup from "@/pages/signup";
import Booking from "@/pages/booking";
import StylePreferences from "@/pages/style-preferences";
import CustomDesign from "@/pages/custom-design";
import PhotoMeasurement from "@/pages/photo-measurement";
import DesignGeneration from "@/pages/design-generation";
import AdvancedDesignStudio from "@/pages/advanced-design-studio";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import EnhancedPhotoGuide from "@/pages/enhanced-photo-guide";
import TestGuide from "@/pages/test-guide";
import PDFPreview from "@/pages/pdf-preview";
import Services from "@/pages/services";
import Contact from "@/pages/contact";

// Lazy load AI Nail System
const AINetworkSystem = lazy(() => import("./pages/ai-nail-system"));

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <>
        {/* Public pages - accessible to everyone */}
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/contact" component={Contact} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/ai-generator" component={AITailGenerator} />
        <Route path="/ai-nail-system" component={() => (
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <AINetworkSystem />
          </Suspense>
        )} />
        <Route path="/booking" component={Booking} />
        <Route path="/real-time-booking" component={RealTimeBooking} />
        <Route path="/signup" component={Signup} />
        <Route path="/landing" component={Landing} />
        
        {/* Protected pages - only for authenticated users */}
        {isAuthenticated && (
          <>
            <Route path="/upload" component={PhotoUpload} />
            <Route path="/design-selection" component={DesignSelection} />
            <Route path="/processing" component={AiProcessing} />
            <Route path="/preview" component={DesignPreview} />
            <Route path="/payment" component={Payment} />
            <Route path="/appointment-booking" component={AppointmentBooking} />
            <Route path="/printing" component={PrintingStatus} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin-panel" component={AdminPanel} />
            <Route path="/enhanced-admin" component={() => <EnhancedAdminPanel />} />
            <Route path="/customer-management" component={CustomerManagementPage} />
            <Route path="/gallery-admin" component={GalleryAdmin} />
            <Route path="/style-preferences" component={StylePreferences} />
            <Route path="/custom-design" component={CustomDesign} />
            <Route path="/photo-measurement" component={PhotoMeasurement} />
            <Route path="/design-generation" component={DesignGeneration} />
            <Route path="/advanced-design-studio" component={AdvancedDesignStudio} />
            <Route path="/analytics" component={AnalyticsDashboard} />
            <Route path="/photo-guide" component={EnhancedPhotoGuide} />
            <Route path="/test-guide" component={TestGuide} />
            <Route path="/pdf-preview" component={PDFPreview} />
          </>
        )}
      </>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
