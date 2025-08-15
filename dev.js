#!/usr/bin/env node
const { spawn } = require('child_process');

console.log('🚀 Starting ConnieNail Next.js development server...');

const nextDev = spawn('npx', ['next', 'dev', '-p', '5000'], {
  stdio: 'inherit',
  shell: true
});

process.on('SIGTERM', () => {
  nextDev.kill('SIGTERM');
});

process.on('SIGINT', () => {
  nextDev.kill('SIGINT');
});

nextDev.on('exit', (code) => {
  console.log(code === 0 ? '✅ Development server stopped' : `❌ Server exited with code ${code}`);
  process.exit(code || 0);
});