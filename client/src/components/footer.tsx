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
              워싱턴 DC의 프리미엄 네일 살롱으로 전통적인 네일 케어와 혁신적인 AI 네일아트를 제공합니다.
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
            <h4 className="text-lg font-semibold mb-4">빠른 링크</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">홈</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">서비스</a></li>
              <li><a href="/booking" className="text-gray-400 hover:text-white transition-colors">예약</a></li>
              <li><a href="/gallery" className="text-gray-400 hover:text-white transition-colors">갤러리</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">연락처</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">스파 매니큐어</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">AI 네일아트</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">왁싱 서비스</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">마사지 테라피</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">연락처</h4>
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
                  <div>월-금: 오전 10시 - 오후 7시</div>
                  <div>주말: 휴무</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Connie's Nail. 모든 권리 보유.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                개인정보처리방침
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                이용약관
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                쿠키 정책
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}