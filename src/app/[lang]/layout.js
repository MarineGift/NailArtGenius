import { notFound } from 'next/navigation'
import { getDictionary } from '@/lib/i18n/dictionaries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Supported languages
const locales = ['ko', 'en', 'ja', 'es']

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }))
}

export default async function LocaleLayout({ children, params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  
  // Check if the locale is supported
  if (!locales.includes(lang)) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} dict={dict} />
      <main className="flex-1">
        {children}
      </main>
      <Footer lang={lang} dict={dict} />
    </div>
  )
}