import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { Phone, Hand, Palette, Clock, Sparkles, Camera, Bot } from 'lucide-react';
import type { CustomerNailInfo } from '@shared/schema';

export function CustomerNailInfo() {
  const [location, setLocation] = useLocation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nailInfo, setNailInfo] = useState<CustomerNailInfo[]>([]);
  const [latestSession, setLatestSession] = useState<CustomerNailInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  const fingerNames = {
    'left_thumb': 'Left Thumb',
    'left_index': 'Left Index',
    'left_middle': 'Left Middle',
    'left_ring': 'Left Ring',
    'left_pinky': 'Left Pinky',
    'right_thumb': 'Right Thumb',
    'right_index': 'Right Index',
    'right_middle': 'Right Middle',
    'right_ring': 'Right Ring',
    'right_pinky': 'Right Pinky'
  };

  const searchCustomerNails = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get all nail info for this customer
      const response = await fetch(`/api/customer/${phoneNumber}/nail-info`);
      if (response.ok) {
        const data = await response.json();
        setNailInfo(data);
      } else {
        setError('Customer not found or no nail information available');
      }

      // Get latest session nail info
      const latestResponse = await fetch(`/api/customer/${phoneNumber}/nail-info/latest`);
      if (latestResponse.ok) {
        const latestData = await latestResponse.json();
        setLatestSession(latestData);
        if (latestData.length > 0) {
          setActiveTab('latest');
        }
      }
    } catch (error) {
      console.error('Error fetching nail info:', error);
      setError('Failed to fetch nail information');
    }

    setLoading(false);
  };

  const renderNailCard = (nail: CustomerNailInfo) => (
    <Card key={nail.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-purple-700">
            {fingerNames[nail.fingerPosition as keyof typeof fingerNames]}
          </CardTitle>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {nail.designStyle}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600">
          Session: {nail.sessionId}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Images */}
        <div className="grid grid-cols-2 gap-2">
          {nail.originalImagePath && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">Original</p>
              <img 
                src={nail.originalImagePath} 
                alt="Original nail" 
                className="w-full h-20 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          {nail.aiGeneratedImagePath && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">AI Design</p>
              <img 
                src={nail.aiGeneratedImagePath} 
                alt="AI generated design" 
                className="w-full h-20 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Nail Information */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Hand className="h-4 w-4 text-purple-500" />
            <span className="font-medium">Shape:</span>
            <span className="text-gray-600">{nail.nailShape}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Length:</span>
            <span className="text-gray-600">{nail.nailLength}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Condition:</span>
            <span className="text-gray-600">{nail.nailCondition}</span>
          </div>
        </div>

        {/* Color Preferences */}
        {nail.colorPreferences && nail.colorPreferences.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Colors:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {nail.colorPreferences.map((color, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {color}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Design Prompt */}
        {nail.designPrompt && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">AI Prompt:</span>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {nail.designPrompt}
            </p>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Created: {nail.createdAt ? new Date(nail.createdAt).toLocaleDateString() : 'Unknown'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Nail Information</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View your nail art designs and information stored in our AI system. 
            Enter your phone number to access your nail profile.
          </p>
        </div>

        {/* Phone Number Search */}
        <Card className="max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-purple-600" />
              <span>Find Your Nail Info</span>
            </CardTitle>
            <CardDescription>
              Enter your phone number to view your nail art history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="010-1234-5678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchCustomerNails()}
            />
            <Button 
              onClick={searchCustomerNails} 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Searching...' : 'Search Nail Info'}
            </Button>
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {(nailInfo.length > 0 || latestSession.length > 0) && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="latest" className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Latest Session ({latestSession.length})</span>
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span>All History ({nailInfo.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="latest" className="space-y-6">
              {latestSession.length > 0 ? (
                <div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    Latest Nail Session - All 10 Fingers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {latestSession.map(renderNailCard)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent nail session found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-6">
              {nailInfo.length > 0 ? (
                <div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    Complete Nail Art History
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {nailInfo.map(renderNailCard)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No nail information found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* No Results State */}
        {nailInfo.length === 0 && latestSession.length === 0 && phoneNumber && !loading && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Hand className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Nail Information Found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any nail art information for this phone number.
            </p>
            <Button onClick={() => setLocation('/')} variant="outline">
              Return Home
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}