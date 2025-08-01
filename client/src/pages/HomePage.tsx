// Home page component
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

const HomePage = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Connie's Nail
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience professional nail care with AI-powered design suggestions and personalized service
        </p>
        <div className="space-x-4">
          <Link href="/booking">
            <Button size="lg">Book Appointment</Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" size="lg">View Services</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Professional Services</CardTitle>
            <CardDescription>
              High-quality nail care with premium products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              From classic manicures to custom nail art designs, 
              we offer comprehensive nail care services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Designs</CardTitle>
            <CardDescription>
              Innovative nail art with AI suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Get personalized nail art recommendations based on 
              your style preferences and latest trends.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Easy Booking</CardTitle>
            <CardDescription>
              Convenient online appointment scheduling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Book your appointment online with real-time availability 
              and automatic reminders.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;