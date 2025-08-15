#!/usr/bin/env node
const { spawn } = require('child_process');

console.log('🏗️ Building ConnieNail Next.js application for deployment...');

const build = spawn('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true
});

build.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ Build completed successfully!');
  } else {
    console.error(`❌ Build failed with exit code ${code}`);
    process.exit(code);
  }
});