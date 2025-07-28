'use client'

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-4">An error occurred while loading the page.</p>
        <button
          onClick={() => reset()}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
        >
          Try again
        </button>
      </div>
    </div>
  )
}