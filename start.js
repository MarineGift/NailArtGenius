#!/usr/bin/env node
const { spawn } = require('child_process');

console.log('🚀 Starting ConnieNail production server...');

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