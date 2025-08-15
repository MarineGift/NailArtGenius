import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import AIFeatures from '@/components/sections/AIFeatures'
import BookingCTA from '@/components/sections/BookingCTA'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Locale } from '@/types/i18n'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <div className="space-y-0">
      <Hero lang={lang as Locale} dict={dict} />
      <Services lang={lang as Locale} dict={dict} />
      <AIFeatures lang={lang as Locale} dict={dict} />
      <BookingCTA lang={lang as Locale} dict={dict} />
    </div>
  )
}