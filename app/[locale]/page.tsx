import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-purple-600">
              Connie's Nail
            </h1>
            <nav className="flex space-x-6">
              <Link href="/services" className="text-gray-600 hover:text-purple-600">
                {t('services')}
              </Link>
              <Link href="/gallery" className="text-gray-600 hover:text-purple-600">
                {t('gallery')}
              </Link>
              <Link href="/booking" className="text-gray-600 hover:text-purple-600">
                {t('booking')}
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-purple-600">
                {t('contact')}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              {t('hero.bookNow')}
            </Button>
            <Button size="lg" variant="outline">
              {t('hero.viewGallery')}
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">
                {t('services.classic.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {t('services.classic.description')}
              </p>
              <p className="font-semibold text-2xl text-purple-600">₩45,000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">
                {t('services.ai.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {t('services.ai.description')}
              </p>
              <p className="font-semibold text-2xl text-purple-600">₩80,000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">
                {t('services.premium.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {t('services.premium.description')}
              </p>
              <p className="font-semibold text-2xl text-purple-600">₩120,000</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Connie's Nail</h3>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
              <p className="text-gray-400">📞 010-1234-5678</p>
              <p className="text-gray-400">📧 info@connienail.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.hours')}</h4>
              <p className="text-gray-400">{t('footer.weekdays')}: 10:00 - 19:00</p>
              <p className="text-gray-400">{t('footer.saturday')}: 10:00 - 18:00</p>
              <p className="text-gray-400">{t('footer.sunday')}: {t('footer.closed')}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}