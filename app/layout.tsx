import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'ConnieNail - 럭셔리 네일 살롱 관리',
  description: 'AR 가상 네일 체험과 고급 CRM 시스템을 제공하는 혁신적인 네일 살롱 관리 플랫폼',
  keywords: ['네일아트', 'AR', '가상체험', '네일살롱', '관리시스템', 'ConnieNail'],
  authors: [{ name: 'ConnieNail Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}