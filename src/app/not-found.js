import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-pink-600 mb-4">404</h2>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h3>
        <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
        <Link 
          href="/ko"
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}