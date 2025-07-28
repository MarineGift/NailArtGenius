// Temporary server file for package.json compatibility
// This project uses Next.js standard structure in src/ folder

import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting Connie\'s Nail multilingual website...');
console.log('📁 Using Next.js standard structure in src/ folder');

// Start Next.js development server on port 5000
const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (error) => {
  console.error('❌ Error starting Next.js:', error);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code || 0);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  nextProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  nextProcess.kill();
  process.exit(0);
});