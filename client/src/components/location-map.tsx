import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Phone, Clock, ExternalLink } from 'lucide-react';

export function LocationMap() {
  const businessAddress = "1300 Pennsylvania Avenue NW, Washington, DC 20004";
  const businessName = "Connie's Nail";
  const phoneNumber = "202.898.0826";
  
  const openInGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(`${businessName}, ${businessAddress}`);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  const openDirections = () => {
    const encodedAddress = encodeURIComponent(businessAddress);
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(directionsUrl, '_blank');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Visit Our Salon
          </h2>
          <p className="text-lg text-gray-600">
            Find us easily with our convenient location in Washington, DC
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Location Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                Location & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Address */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Address</h3>
                <p className="text-gray-600">{businessAddress}</p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Phone</h3>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <a 
                    href={`tel:${phoneNumber}`} 
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {phoneNumber}
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  Business Hours
                </h3>
                <div className="space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">10:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Saturday - Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <Button 
                  onClick={openDirections}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button 
                  onClick={openInGoogleMaps}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Google Maps
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Map */}
          <Card className="shadow-lg">
            <CardContent className="p-0 h-full">
              <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dw901SwHHqfeaM&q=${encodeURIComponent(businessAddress)}&zoom=15`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${businessName} Location Map`}
                />
                
                {/* Overlay for enhanced interactivity */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-semibold text-sm text-gray-800">{businessName}</div>
                      <div className="text-xs text-gray-600">Washington, DC</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transportation Information */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Transportation Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Navigation className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">By Car</h3>
                <p className="text-sm text-gray-600">
                  Convenient parking available nearby. 
                  Use GPS navigation for the most efficient route.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Public Transit</h3>
                <p className="text-sm text-gray-600">
                  Accessible via Metro. Check local transit schedules 
                  for the most up-to-date information.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Need Help?</h3>
                <p className="text-sm text-gray-600">
                  Call us if you need directions or have questions 
                  about finding our location.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}