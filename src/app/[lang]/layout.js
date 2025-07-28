import { notFound } from 'next/navigation'

// Supported languages
const locales = ['ko', 'en', 'ja', 'es']

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }))
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params
  
  // Check if the locale is supported
  if (!locales.includes(lang)) {
    notFound()
  }

  return (
    <html lang={lang}>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
          {children}
        </div>
      </body>
    </html>
  )
}