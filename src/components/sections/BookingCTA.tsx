import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Dictionary, Locale } from '@/types/i18n'

interface BookingCTAProps {
  lang: Locale
  dict: Dictionary
}

export default function BookingCTA({ lang, dict }: BookingCTAProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          {dict.booking.title}
        </h2>
        <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
          {dict.booking.subtitle}
        </p>
        <Button size="lg" variant="outline" className="bg-white text-pink-600 hover:bg-pink-50" asChild>
          <Link href={`/${lang}/booking`}>
            {dict.booking.cta}
          </Link>
        </Button>
      </div>
    </section>
  )
}