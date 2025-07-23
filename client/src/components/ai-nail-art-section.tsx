import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function AINailArtSection() {
  const { t } = useTranslation();

  return (
    <section className="py-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-6">
        {/* AI Nail Art Feature Highlight */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  🤖 AI Nail Art - Revolutionary Nail Art Service
                </h2>
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Register your nails → select nail art design → payment → visit date process. 
                  Connie's Nail AI analyzes your nails and pre-creates your selected nail art design, 
                  dramatically reducing treatment time and cost during your visit.
                </p>
              </div>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/ai-nail-generator'}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                ✨ Go to AI Nail Art
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}