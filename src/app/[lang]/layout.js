import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Supported languages
const locales = ['ko', 'en', 'ja', 'es']

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }))
}

export default async function LocaleLayout({ children, params }) {
  const { lang } = await params
  
  // Check if the locale is supported
  if (!locales.includes(lang)) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} />
      <main className="flex-1">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  )
}