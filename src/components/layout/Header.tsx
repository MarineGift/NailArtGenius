'use client'

import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import Button from '@/components/ui/Button'
import { Dictionary, Locale } from '@/types/i18n'

interface HeaderProps {
  lang: Locale
  dict: Dictionary
}

export default function Header({ lang, dict }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: dict.navigation.home, href: `/${lang}` },
    { name: dict.navigation.services, href: `/${lang}/services` },
    { name: dict.navigation.about, href: `/${lang}/about` },
    { name: dict.navigation.contact, href: `/${lang}/contact` },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center">
            <span className="text-2xl font-bold text-pink-600">Connie's Nail</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector currentLang={lang} />
            <Button asChild>
              <Link href={`/${lang}/booking`}>
                {dict.navigation.booking}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <LanguageSelector currentLang={lang} />
                <Button asChild className="w-full">
                  <Link href={`/${lang}/booking`} onClick={() => setIsMenuOpen(false)}>
                    {dict.navigation.booking}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}