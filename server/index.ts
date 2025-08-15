// Compatibility bridge for Next.js app
// This file exists to make the workflow work with Next.js

import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting Next.js development server...');

// Change to the project root directory
const projectRoot = path.resolve(process.cwd());

// Start Next.js dev server
const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (err) => {
  console.error('❌ Failed to start Next.js server:', err);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js server exited with code ${code}`);
  process.exit(code || 0);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  nextProcess.kill('SIGTERM');
});