// Main App component with routing
import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import Navigation from './components/Navigation';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/booking" component={BookingPage} />
            <Route path="/contact" component={ContactPage} />
            <Route>
              <div className="text-center py-16">
                <h1 className="text-2xl font-bold text-muted-foreground">
                  404 - Page Not Found
                </h1>
                <p className="mt-4">
                  The page you're looking for doesn't exist.
                </p>
              </div>
            </Route>
          </Switch>
        </main>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;