#!/bin/bash

# Build script for Connie's Nail website
# This script handles the complete build process

echo "🚀 Starting build process for Connie's Nail website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Check for environment variables
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found. Creating from template..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your actual values before building."
fi

# Run build
echo "🔨 Building Next.js application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output is in the .next directory"
    echo "🚀 Ready for deployment!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi