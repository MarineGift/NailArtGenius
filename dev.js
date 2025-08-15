#!/usr/bin/env node
const { spawn } = require('child_process');

console.log('🚀 ConnieNail - 럭셔리 네일 살롱 관리 시스템 시작 중...');

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