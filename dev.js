#!/usr/bin/env node
const { spawn } = require('child_process');

console.log('Starting Next.js development server...');

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
  process.exit(code || 0);
});