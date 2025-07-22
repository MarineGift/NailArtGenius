import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  Zap, 
  Palette, 
  Download, 
  Star, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Brain,
  Eye,
  Target
} from "lucide-react";
import { Link } from "wouter";

export default function AINetworkSystem() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Photo Upload",
      description: "Upload hand photos with reference card",
      icon: <Camera className="h-6 w-6" />,
      status: "completed"
    },
    {
      id: 2,
      title: "AI Analysis",
      description: "Precise nail measurement & shape detection",
      icon: <Brain className="h-6 w-6" />,
      status: "active"
    },
    {
      id: 3,
      title: "Design Generation",
      description: "Custom nail art with your measurements",
      icon: <Palette className="h-6 w-6" />,
      status: "pending"
    },
    {
      id: 4,
      title: "Download & Print",
      description: "High-quality designs ready for salon",
      icon: <Download className="h-6 w-6" />,
      status: "pending"
    }
  ];

  const features = [
    {
      icon: <Eye className="h-8 w-8 text-blue-600" />,
      title: "Advanced Vision AI",
      description: "OpenAI GPT-4o Vision analyzes your nail shape, size, and curvature with precision"
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Precise Measurements",
      description: "Credit card scale reference ensures accurate millimeter-level measurements"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-purple-600" />,
      title: "Custom Design Generation",
      description: "AI creates personalized nail art designs that perfectly fit your nail dimensions"
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      title: "Instant Results",
      description: "Get professional-quality designs in minutes, not hours"
    }
  ];

  const measurements = [
    { finger: "Thumb", width: "14.2mm", length: "18.5mm", shape: "Oval" },
    { finger: "Index", width: "11.8mm", length: "16.3mm", shape: "Almond" },
    { finger: "Middle", width: "12.5mm", length: "17.8mm", shape: "Square" },
    { finger: "Ring", width: "11.2mm", length: "16.1mm", shape: "Round" },
    { finger: "Pinky", width: "8.9mm", length: "13.4mm", shape: "Oval" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Nail Technology
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Advanced AI Nail System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Revolutionary AI technology that measures your nails with precision and creates personalized designs 
            tailored exactly to your unique nail shape and size.
          </p>
          <Link href="/photo-upload">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
              Start AI Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How Our AI System Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card 
                key={step.id} 
                className={`relative transition-all duration-300 ${
                  step.status === 'active' ? 'ring-2 ring-blue-500 shadow-lg scale-105' : 
                  step.status === 'completed' ? 'border-green-500' : 'opacity-70'
                }`}
              >
                <CardHeader className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    step.status === 'active' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                    step.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                    'bg-gray-100 text-gray-400 dark:bg-gray-800'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle className="h-6 w-6" /> : step.icon}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    {step.description}
                  </p>
                </CardContent>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Advanced AI Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sample Analysis Results */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Precise Measurement Results
          </h2>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-6 w-6 text-green-600" />
                AI Analysis Results - Sample Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Analysis Confidence</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <Progress value={94} className="h-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
                  {measurements.map((measurement) => (
                    <Card key={measurement.finger} className="p-4">
                      <h4 className="font-semibold text-sm mb-2">{measurement.finger}</h4>
                      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                        <div>Width: <span className="font-medium">{measurement.width}</span></div>
                        <div>Length: <span className="font-medium">{measurement.length}</span></div>
                        <div>Shape: <Badge variant="outline" className="text-xs">{measurement.shape}</Badge></div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience AI Nail Technology?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get precise measurements and custom designs in minutes with our advanced AI system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/photo-upload">
              <Button size="lg" variant="secondary" className="px-8 py-4">
                <Camera className="mr-2 h-5 w-5" />
                Start Photo Analysis
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600">
                <Star className="mr-2 h-5 w-5" />
                View Gallery
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}