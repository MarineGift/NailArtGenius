import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NailArt Genius',
  description: 'AI-powered nail art design platform',
  keywords: ['nail art', 'AI', 'design', 'beauty'],
  authors: [{ name: 'NailArt Genius Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}