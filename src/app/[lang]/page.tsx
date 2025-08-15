import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import AIFeatures from '@/components/sections/AIFeatures'
import BookingCTA from '@/components/sections/BookingCTA'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Locale } from '@/types/i18n'

export default async function HomePage({
  params,
}: {
  params: { lang: string }
}) {
  const dict = await getDictionary(params.lang as Locale)

  return (
    <div className="space-y-0">
      <Hero lang={params.lang as Locale} dict={dict} />
      <Services lang={params.lang as Locale} dict={dict} />
      <AIFeatures lang={params.lang as Locale} dict={dict} />
      <BookingCTA lang={params.lang as Locale} dict={dict} />
    </div>
  )
}