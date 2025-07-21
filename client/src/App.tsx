import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/lib/i18n";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import PhotoUpload from "@/pages/photo-upload";
import AiProcessing from "@/pages/ai-processing";
import DesignSelection from "@/pages/design-selection";
import Payment from "@/pages/payment";
import AppointmentBooking from "@/pages/appointment-booking";
import PrintingStatus from "@/pages/printing-status";
import AdminPanel from "@/pages/admin-panel";
import Signup from "@/pages/signup";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/signup" component={Signup} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/upload" component={PhotoUpload} />
          <Route path="/processing" component={AiProcessing} />
          <Route path="/designs" component={DesignSelection} />
          <Route path="/payment" component={Payment} />
          <Route path="/booking" component={AppointmentBooking} />
          <Route path="/printing" component={PrintingStatus} />
          <Route path="/admin-panel" component={AdminPanel} />
        </>
      )}
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
