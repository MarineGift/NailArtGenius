import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Connie's Nail - Premium Nail Care & AI Nail Art",
  description: 'Professional nail care and beauty services with AI-powered design, online booking, and multilingual support',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}