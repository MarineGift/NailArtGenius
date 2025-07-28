#!/bin/bash

# Deployment script for Railway
# This script prepares and deploys the application

echo "🚀 Starting deployment process..."

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit or stash them first."
    git status --short
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Build the application
echo "🔨 Running build process..."
./scripts/build.sh

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Deployment aborted."
    exit 1
fi

# Push to repository
echo "📤 Pushing to GitHub..."
git push origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🚂 Railway will automatically deploy from GitHub."
    echo "📋 Monitor deployment status in Railway dashboard."
else
    echo "❌ Failed to push to GitHub."
    exit 1
fi

echo "🎉 Deployment process completed!"