#!/bin/bash
echo "🚀 ConnieNail Railway Deployment Script"
echo "====================================="

# Clean any previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install --production=false

# Build the Next.js application
echo "🏗️ Building Next.js application..."
npx next build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "🚀 Starting production server..."
    npx next start -p $PORT
else
    echo "❌ Build failed!"
    exit 1
fi