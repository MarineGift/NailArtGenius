import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { t, Language, saveLanguagePreference, loadLanguagePreference } from '@/lib/i18n';

export default function DemoLanguageTest() {
  const [currentLang, setCurrentLang] = useState<Language>(loadLanguagePreference());

  const switchLanguage = (lang: Language) => {
    setCurrentLang(lang);
    saveLanguagePreference(lang);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🌍 Multi-Language Demo</span>
          <div className="flex gap-2">
            <Button 
              variant={currentLang === 'ko' ? 'default' : 'outline'}
              size="sm"
              onClick={() => switchLanguage('ko')}
            >
              🇰🇷 한국어
            </Button>
            <Button 
              variant={currentLang === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => switchLanguage('en')}
            >
              🇺🇸 English
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Navigation Items */}
          <div>
            <h3 className="font-semibold mb-2">Navigation</h3>
            <div className="space-y-2">
              <Badge variant="outline">{t('nav.home', currentLang)}</Badge>
              <Badge variant="outline">{t('nav.photo_measurement', currentLang)}</Badge>
              <Badge variant="outline">{t('nav.design_studio', currentLang)}</Badge>
              <Badge variant="outline">{t('nav.analytics', currentLang)}</Badge>
            </div>
          </div>

          {/* Home Page Content */}
          <div>
            <h3 className="font-semibold mb-2">Home Page</h3>
            <div className="space-y-2">
              <p className="text-sm">{t('home.title', currentLang)}</p>
              <p className="text-xs text-gray-600">{t('home.subtitle', currentLang)}</p>
              <Button size="sm">{t('home.get_started', currentLang)}</Button>
            </div>
          </div>

          {/* Photo Measurement */}
          <div>
            <h3 className="font-semibold mb-2">Photo Measurement</h3>
            <div className="space-y-2">
              <p className="text-sm">{t('photo.title', currentLang)}</p>
              <p className="text-xs text-gray-600">{t('photo.card_required', currentLang)}</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {t('photo.finger_types.left_thumb', currentLang)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {t('photo.finger_types.right_index', currentLang)}
                </Badge>
              </div>
            </div>
          </div>

          {/* PDF Preview */}
          <div>
            <h3 className="font-semibold mb-2">PDF Preview</h3>
            <div className="space-y-2">
              <p className="text-sm">{t('pdf.title', currentLang)}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  {t('pdf.download', currentLang)}
                </Button>
                <Button variant="outline" size="sm">
                  {t('pdf.print', currentLang)}
                </Button>
              </div>
            </div>
          </div>

          {/* Common Actions */}
          <div>
            <h3 className="font-semibold mb-2">Common Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>{t('common.loading', currentLang)}</Badge>
              <Badge>{t('common.save', currentLang)}</Badge>
              <Badge>{t('common.cancel', currentLang)}</Badge>
              <Badge>{t('common.next', currentLang)}</Badge>
            </div>
          </div>

          {/* Error Messages */}
          <div>
            <h3 className="font-semibold mb-2">Error Messages</h3>
            <div className="space-y-1">
              <p className="text-xs text-red-600">{t('error.upload_failed', currentLang)}</p>
              <p className="text-xs text-red-600">{t('error.analysis_failed', currentLang)}</p>
              <p className="text-xs text-red-600">{t('error.quota_exceeded', currentLang)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">✅ Multi-Language Features Implemented:</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Korean/English translation system with 70+ translation keys</li>
            <li>• Language switcher component with flag indicators</li>
            <li>• Persistent language preference storage</li>
            <li>• Browser language auto-detection</li>
            <li>• Context-aware translation hook</li>
            <li>• Comprehensive translations for all UI components</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">🚀 How to Test:</h4>
          <ol className="text-sm space-y-1 text-gray-700">
            <li>1. Click the Korean/English buttons above to switch languages</li>
            <li>2. Watch all text content change in real-time</li>
            <li>3. Refresh the page - language preference is saved</li>
            <li>4. Try the language switcher in the header navigation</li>
            <li>5. Navigate through different pages to see full translation</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}