import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Dictionary, Locale } from '@/types/i18n'

interface HeroProps {
  lang: Locale
  dict: Dictionary
}

export default function Hero({ lang, dict }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-pink-50 to-purple-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
              {dict.hero.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {dict.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href={`/${lang}/booking`}>
                  {dict.hero.cta}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/${lang}/services`}>
                  {dict.navigation.services}
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                <span className="text-6xl">💅</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}