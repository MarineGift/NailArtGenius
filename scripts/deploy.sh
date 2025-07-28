#!/bin/bash

# Connie's Nail - Railway Deployment Script
echo "🚀 Starting deployment to Railway..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Railway (if railway CLI is installed)
if command -v railway &> /dev/null; then
    echo "🚂 Deploying to Railway..."
    railway up
    echo "✅ Deployment to Railway completed!"
else
    echo "ℹ️  Railway CLI not found. Please deploy manually through Railway dashboard."
    echo "📝 Make sure to:"
    echo "   1. Connect your GitHub repository to Railway"
    echo "   2. Set environment variables in Railway dashboard"
    echo "   3. Deploy will happen automatically on push"
fi

echo "🎉 Deployment process completed!"