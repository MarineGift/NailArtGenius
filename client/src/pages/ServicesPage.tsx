// Services page component
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import type { Service } from '@shared/schema';

const ServicesPage = () => {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Our Services</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Services
        </h1>
        <p className="text-gray-600">
          {error instanceof Error ? error.message : 'Something went wrong'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Our Services</h1>
        <p className="text-gray-600">
          Professional nail care services tailored to your needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </div>
                <Badge variant="secondary">{service.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Duration:</span>
                  <span className="font-medium">{service.duration} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Price:</span>
                  <span className="font-bold text-lg">
                    ${(service.price / 100).toFixed(2)}
                  </span>
                </div>
                <Link href="/booking">
                  <Button className="w-full">Book This Service</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!services || services.length === 0) && (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No Services Available
          </h2>
          <p className="text-gray-500">
            Please check back later for available services.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;