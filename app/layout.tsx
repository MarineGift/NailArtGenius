// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Connie's Nail",
  description: "Premium Nail Salon in Washington DC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <NavBar />
        {children}
      </body>
    </html>
  );
}

function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-pink-600 text-white">
            P
          </span>
          <span>Connie&apos;s Nail</span>
        </Link>

        {/* Center: Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/">Home</Link>
          <Link href="#services">Services</Link>
          <Link href="/booking">Booking</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/ai-nail-art">AI Nail Art</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/admin-login">Log In</Link>
        </nav>

        {/* Right: small pills (시각적 요소) */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs">
            <span role="img" aria-label="globe">🌐</span> English
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-pink-50 text-pink-700 px-2 py-1 text-xs border border-pink-200">
            Web App
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-1 text-xs border border-emerald-200">
            Online
          </span>
        </div>
      </div>
    </header>
  );
}
