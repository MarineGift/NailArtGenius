#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 ConnieNail Deployment Script');
console.log('================================');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('.next')) {
  fs.rmSync('.next', { recursive: true, force: true });
}

// Build the application
console.log('🏗️ Building Next.js application...');
const build = spawn('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true
});

build.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ Build completed successfully!');
    console.log('🚀 Starting production server...');
    
    // Start production server
    const start = spawn('npx', ['next', 'start', '-p', '5000'], {
      stdio: 'inherit',
      shell: true
    });
    
    process.on('SIGTERM', () => {
      start.kill('SIGTERM');
    });
    
    process.on('SIGINT', () => {
      start.kill('SIGINT');
    });
    
    start.on('exit', (code) => {
      process.exit(code || 0);
    });
  } else {
    console.error(`❌ Build failed with exit code ${code}`);
    process.exit(code);
  }
});