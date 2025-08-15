import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { Dictionary, Locale } from '@/types/i18n'

interface FooterProps {
  lang: Locale
  dict: Dictionary
}

export default function Footer({ lang, dict }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href={`/${lang}`} className="flex items-center mb-4">
              <span className="text-2xl font-bold text-pink-400">Connie's Nail</span>
            </Link>
            <p className="text-gray-300 mb-4">
              {dict.footer.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.footer.contact.title}</h3>
            <div className="space-y-2 text-gray-300">
              <p>{dict.footer.contact.phone}</p>
              <p>{dict.footer.contact.email}</p>
              <p>{dict.footer.contact.address}</p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.footer.social.title}</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-pink-400 transition-colors">
                Instagram
              </a>
              <a href="#" className="block text-gray-300 hover:text-pink-400 transition-colors">
                Facebook
              </a>
              <a href="#" className="block text-gray-300 hover:text-pink-400 transition-colors">
                KakaoTalk
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{dict.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}