import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center space-y-8">
        {/* Hero Section */}
        <section className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            NailArt Genius
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered nail art design platform that brings your creative vision to life
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              View Gallery
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">AI Design Generation</h3>
            <p className="text-gray-600">
              Create stunning nail art designs with our advanced AI technology
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Custom Patterns</h3>
            <p className="text-gray-600">
              Upload your own images and transform them into unique nail art
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Community Gallery</h3>
            <p className="text-gray-600">
              Discover and share amazing designs with our creative community
            </p>
          </Card>
        </section>

        {/* Status Section */}
        <section className="mt-16 p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-medium">
              System Status: Online
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Next.js + TypeScript + Docker deployment successful
          </p>
        </section>
      </div>
    </main>
  )
}
