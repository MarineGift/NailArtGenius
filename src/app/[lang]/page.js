import { getDictionary } from '@/lib/i18n/dictionaries'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import AIFeatures from '@/components/sections/AIFeatures'
import BookingCTA from '@/components/sections/BookingCTA'

export default async function HomePage({ params }) {
  const { lang } = params
  const dict = await getDictionary(lang)

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <Services lang={lang} dict={dict} />
      <AIFeatures lang={lang} dict={dict} />
      <BookingCTA lang={lang} dict={dict} />
    </>
  )
}