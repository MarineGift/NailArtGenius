import Link from 'next/link'

export default function Footer({ lang, dict }) {
  const navigation = [
    { name: dict.nav.home, href: `/${lang}` },
    { name: dict.nav.services, href: `/${lang}/services` },
    { name: dict.nav.about, href: `/${lang}/about` },
    { name: dict.nav.contact, href: `/${lang}/contact` },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              Connie's Nail
            </h3>
            <p className="text-gray-300 mb-4">
              Professional nail care and beauty services with AI-powered design, 
              online booking, and multilingual support.
            </p>
            <div className="text-gray-400 space-y-1">
              <p>{dict.footer.address}</p>
              <p>{dict.footer.phone}</p>
              <p>{dict.footer.email}</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
            <div className="text-gray-300 space-y-1">
              <p>Mon - Sat: 10:00 - 20:00</p>
              <p>Sunday: 11:00 - 18:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {dict.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}