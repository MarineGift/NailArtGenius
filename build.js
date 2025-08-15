#!/usr/bin/env node
const { exec } = require('child_process');

console.log('🏗️ Building ConnieNail Next.js application for deployment...');

exec('npx next build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Build error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Build stderr: ${stderr}`);
  }
  console.log(stdout);
  console.log('✅ Build completed successfully!');
});