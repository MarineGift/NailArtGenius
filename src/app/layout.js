import './globals.css'

export const metadata = {
  title: "Connie's Nail - Multilingual Nail Salon",
  description: 'Professional nail salon with AI-powered nail art generation',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <title>Connie's Nail</title>
        <meta name="description" content="AI-powered nail salon" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        {children}
      </body>
    </html>
  )
}