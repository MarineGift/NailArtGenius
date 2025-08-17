import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NailArt Genius - AI-Powered Nail Art & Professional Services',
  description: 'Transform your nails into works of art with our AI-powered design tools and professional nail services. Book your appointment today!',
  keywords: 'nail art, manicure, gel nails, nail design, AI nail art, professional nail services',
  authors: [{ name: 'NailArt Genius Team' }],
  openGraph: {
    title: 'NailArt Genius - AI-Powered Nail Art',
    description: 'Professional nail services with AI-powered design tools',
    url: 'https://marinebeauty.kr',
    siteName: 'NailArt Genius',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}