export default function TestPage() {
  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <h1 className="text-4xl font-bold text-pink-600 mb-4">
        🎉 Test Page Works!
      </h1>
      <p className="text-xl text-gray-700">
        If you can see this, Next.js is working correctly!
      </p>
      <div className="mt-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-2">Test Information:</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Next.js App Router: ✅ Working</li>
          <li>Tailwind CSS: ✅ Working</li>
          <li>Route: /test</li>
          <li>Component: Server Component</li>
        </ul>
      </div>
    </div>
  )
}