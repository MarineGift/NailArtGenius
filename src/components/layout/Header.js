'use client'

import Link from 'next/link'
import { useState } from 'react'
import LanguageSelector from './LanguageSelector'

export default function Header({ lang, dict }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: dict?.nav?.home || 'Home', href: `/${lang}` },
    { name: dict?.nav?.services || 'Services', href: `/${lang}/services` },
    { name: dict?.nav?.booking || 'Booking', href: `/${lang}/booking` },
    { name: dict?.nav?.gallery || 'Gallery', href: `/${lang}/gallery` },
    { name: dict?.nav?.ai_nail_art || 'AI Nail Art', href: `/${lang}/ai-nail-art` },
    { name: dict?.nav?.contact || 'Contact', href: `/${lang}/contact` },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">💅</span>
            </div>
            <h1 className="text-2xl font-bold text-pink-600">
              Connie's Nail
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            <LanguageSelector currentLang={lang} />
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors">
              📱 {dict?.header?.web_app || 'Web App'}
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col space-y-1"
            >
              <span className="block w-6 h-0.5 bg-gray-600"></span>
              <span className="block w-6 h-0.5 bg-gray-600"></span>
              <span className="block w-6 h-0.5 bg-gray-600"></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-pink-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}