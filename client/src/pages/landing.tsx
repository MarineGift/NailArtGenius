import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Palette, Printer, UserPlus } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import LanguageSelector from "@/components/language-selector";

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-white to-accent/10">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Palette className="text-secondary text-2xl mr-2" />
                <span className="text-xl font-bold text-gray-900">AI Nail Studio</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = "/api/login"}
                className="text-gray-600 hover:text-secondary"
              >
                {t('nav.login')}
              </Button>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-secondary text-white hover:bg-pink-600"
              >
                {t('nav.signup')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('landing.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('landing.subtitle')}
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = "/api/login"}
              className="bg-secondary text-white px-8 py-4 text-lg font-semibold hover:bg-pink-600 shadow-lg"
            >
              {t('landing.getStarted')}
              <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('howItWorks.title')}</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="text-secondary text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">1. {t('howItWorks.step1')}</h3>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Camera className="text-secondary text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">2. {t('howItWorks.step2')}</h3>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Palette className="text-secondary text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">3. {t('howItWorks.step3')}</h3>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Printer className="text-secondary text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">4. {t('howItWorks.step4')}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Palette className="text-secondary text-xl mr-2" />
                <span className="text-lg font-bold">AI Nail Studio</span>
              </div>
              <p className="text-gray-400 text-sm">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.nailAnalysis')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.designGallery')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.autoPrinting')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.faq')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.contact')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.contactInfo')}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📞 02-1234-5678</li>
                <li>✉️ support@ainail.com</li>
                <li>📍 서울시 강남구</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
