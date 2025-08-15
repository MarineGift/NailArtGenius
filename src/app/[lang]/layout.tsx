import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Locale } from '@/types/i18n'

const locales = ['ko', 'en', 'ja', 'es']

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  
  return {
    title: dict.site.title,
    description: dict.site.description,
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  
  if (!locales.includes(lang)) {
    notFound()
  }

  const dict = await getDictionary(lang as Locale)

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang as Locale} dict={dict} />
      <main className="flex-1">
        {children}
      </main>
      <Footer lang={lang as Locale} dict={dict} />
    </div>
  )
}