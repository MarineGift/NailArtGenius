import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function BookingCTA({ lang, dict }) {
  return (
    <section className="py-20 bg-pink-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready for Beautiful Nails?
        </h2>
        <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
          Book your appointment today and experience the future of nail care with AI-powered designs.
        </p>
        <Button 
          as={Link}
          href={`/${lang}/contact`}
          variant="white"
          size="lg"
        >
          {dict.hero.bookNow}
        </Button>
      </div>
    </section>
  )
}