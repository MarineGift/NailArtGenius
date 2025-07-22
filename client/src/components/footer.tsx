import { useLanguage } from "@/hooks/useLanguage";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Connie's Nail</h3>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.company_description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">YouTube</span>
                📺
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quick_links')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">{t('nav.home')}</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">{t('nav.services')}</a></li>
              <li><a href="/booking" className="text-gray-400 hover:text-white transition-colors">{t('nav.booking')}</a></li>
              <li><a href="/gallery" className="text-gray-400 hover:text-white transition-colors">{t('nav.gallery')}</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.services_title')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">{t('footer.spa_manicure')}</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">{t('footer.ai_nail_art')}</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">{t('footer.waxing_service')}</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">{t('footer.massage_therapy')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact_title')}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-pink-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-400">
                  1300 Pennsylvania Avenue NW<br />
                  Washington, DC 20004
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-pink-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">202.898.0826</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-pink-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">Sungimconniekim@gmail.com</span>
              </div>
              <div className="flex items-start">
                <Clock className="h-4 w-4 text-pink-400 mt-1 mr-2 flex-shrink-0" />
                <div className="text-gray-400">
                  <div>{t('footer.hours_mon_fri')}</div>
                  <div>{t('footer.hours_weekend')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.privacy_policy')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.terms_of_service')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.cookie_policy')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}