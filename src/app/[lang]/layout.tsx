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
  params: { lang: string }
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang as Locale)
  
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
  params: { lang: string }
}) {
  if (!locales.includes(params.lang)) {
    notFound()
  }

  const dict = await getDictionary(params.lang as Locale)

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={params.lang as Locale} dict={dict} />
      <main className="flex-1">
        {children}
      </main>
      <Footer lang={params.lang as Locale} dict={dict} />
    </div>
  )
}