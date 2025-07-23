import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Clock, DollarSign } from 'lucide-react';

interface NailDesign {
  id: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  reviews: number;
  duration: number;
  category: string;
  emoji: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
}

interface NailArtDesignSelectionProps {
  onDesignSelect?: (design: NailDesign) => void;
}

export function EnglishNailArtDesignSelection({ onDesignSelect }: NailArtDesignSelectionProps) {
  const [selectedDesign, setSelectedDesign] = useState<NailDesign | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const designs: NailDesign[] = [
    {
      id: 1,
      name: "Classic French Manicure",
      price: 45,
      description: "Traditional French manicure style",
      rating: 4.8,
      reviews: 127,
      duration: 45,
      category: "classic",
      emoji: "💅",
      difficulty: "Easy",
      image: "/images/french-manicure.jpg"
    },
    {
      id: 2,
      name: "Floral Design",
      price: 65,
      description: "Delicate floral nail art",
      rating: 4.9,
      reviews: 89,
      duration: 90,
      category: "floral",
      emoji: "🌸",
      difficulty: "Medium",
      image: "/images/floral-design.jpg"
    },
    {
      id: 3,
      name: "Geometric Pattern",
      price: 55,
      description: "Modern geometric patterns",
      rating: 4.7,
      reviews: 156,
      duration: 60,
      category: "modern",
      emoji: "⚡",
      difficulty: "Medium",
      image: "/images/geometric-pattern.jpg"
    },
    {
      id: 4,
      name: "Glitter & Sparkle",
      price: 70,
      description: "Glamorous glitter nail art",
      rating: 4.6,
      reviews: 92,
      duration: 75,
      category: "glamour",
      emoji: "✨",
      difficulty: "Easy",
      image: "/images/glitter-sparkle.jpg"
    },
    {
      id: 5,
      name: "Minimalist Style",
      price: 40,
      description: "Simple and sophisticated minimal design",
      rating: 4.8,
      reviews: 134,
      duration: 30,
      category: "minimalist",
      emoji: "🤍",
      difficulty: "Easy",
      image: "/images/minimalist-style.jpg"
    },
    {
      id: 6,
      name: "Seasonal Design",
      price: 60,
      description: "Special seasonal designs",
      rating: 4.7,
      reviews: 78,
      duration: 60,
      category: "seasonal",
      emoji: "🍂",
      difficulty: "Medium",
      image: "/images/seasonal-design.jpg"
    },
    {
      id: 7,
      name: "Wedding Special",
      price: 80,
      description: "Elegant nail art for weddings",
      rating: 4.9,
      reviews: 45,
      duration: 90,
      category: "wedding",
      emoji: "💍",
      difficulty: "Hard",
      image: "/images/wedding-special.jpg"
    },
    {
      id: 8,
      name: "Ombre Effect",
      price: 65,
      description: "Soft gradient effects",
      rating: 4.7,
      reviews: 103,
      duration: 60,
      category: "gradient",
      emoji: "🌈",
      difficulty: "Medium",
      image: "/images/ombre-effect.jpg"
    },
    {
      id: 9,
      name: "3D Art Design",
      price: 90,
      description: "Three-dimensional nail art",
      rating: 4.8,
      reviews: 67,
      duration: 120,
      category: "3d",
      emoji: "🎨",
      difficulty: "Hard",
      image: "/images/3d-art-design.jpg"
    }
  ];

  const handleDesignSelect = (design: NailDesign) => {
    setSelectedDesign(design);
    onDesignSelect?.(design);
  };

  const toggleFavorite = (designId: number) => {
    setFavorites(prev => 
      prev.includes(designId) 
        ? prev.filter(id => id !== designId)
        : [...prev, designId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            🎨 Select Your Nail Art Design
          </CardTitle>
          <p className="text-center text-gray-600">
            Choose from our collection of professional nail art designs
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <Card 
                key={design.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedDesign?.id === design.id ? 'ring-2 ring-pink-500 shadow-lg' : ''
                }`}
                onClick={() => handleDesignSelect(design)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{design.emoji}</span>
                      <Badge className={getDifficultyColor(design.difficulty)}>
                        {design.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(design.id);
                        }}
                        className="p-1 h-auto"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favorites.includes(design.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </Button>
                      <div className="text-right">
                        <p className="text-lg font-bold text-pink-600">${design.price}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{design.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{design.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{design.rating}</span>
                      <span>({design.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{design.duration}min</span>
                    </div>
                  </div>

                  {selectedDesign?.id === design.id && (
                    <div className="mt-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                      <p className="text-sm text-pink-800 font-medium">
                        ✨ Selected Design
                      </p>
                      <p className="text-xs text-pink-600 mt-1">
                        This design will be prepared using AI analysis
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedDesign && (
            <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
              <h4 className="text-lg font-semibold mb-2">Selected Design Details</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Design:</strong> {selectedDesign.name}</p>
                  <p><strong>Price:</strong> ${selectedDesign.price}</p>
                  <p><strong>Duration:</strong> {selectedDesign.duration} minutes</p>
                </div>
                <div>
                  <p><strong>Difficulty:</strong> {selectedDesign.difficulty}</p>
                  <p><strong>Rating:</strong> {selectedDesign.rating}/5 ({selectedDesign.reviews} reviews)</p>
                  <p><strong>Category:</strong> {selectedDesign.category}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Description:</strong> {selectedDesign.description}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}