#!/bin/bash

# Setup script for new developers
# This script sets up the development environment

echo "🎯 Setting up Connie's Nail development environment..."

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "📥 Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm version: $NPM_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment file
if [ ! -f ".env.local" ]; then
    echo "⚙️  Setting up environment variables..."
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
    echo "⚠️  Please update .env.local with your Supabase credentials"
else
    echo "✅ .env.local already exists"
fi

# Make scripts executable
chmod +x scripts/*.sh
echo "✅ Made scripts executable"

# Check if everything is working
echo "🧪 Testing development server..."
timeout 10s npm run dev > /dev/null 2>&1
if [ $? -eq 124 ]; then
    echo "✅ Development server can start successfully"
else
    echo "⚠️  There might be issues with the development server"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For more information, see docs/DEVELOPMENT.md"