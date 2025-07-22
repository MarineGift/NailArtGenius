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
            <h3 className="text-xl font-bold mb-4">AI 네일 스튜디오</h3>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.company.description')}
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
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.quickLinks.about')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.quickLinks.services')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.quickLinks.pricing')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.quickLinks.gallery')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.quickLinks.contact')}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.services.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.services.aiAnalysis')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.services.customDesign')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.services.printing')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.services.consultation')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact.title')}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-pink-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-400">{t('footer.contact.address')}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-pink-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">{t('footer.contact.phone')}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-pink-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">{t('footer.contact.email')}</span>
              </div>
              <div className="flex items-start">
                <Clock className="h-4 w-4 text-pink-400 mt-1 mr-2 flex-shrink-0" />
                <div className="text-gray-400">
                  <div>{t('footer.contact.hours.weekdays')}</div>
                  <div>{t('footer.contact.hours.weekend')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 AI 네일 스튜디오. {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.legal.privacy')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.legal.terms')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.legal.cookies')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}