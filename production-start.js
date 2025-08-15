#!/usr/bin/env node
// ConnieNail Production Server - Pure Next.js Standalone
const { spawn } = require('child_process');

console.log('🚀 ConnieNail 프로덕션 서버 시작');
console.log('===================================');
console.log('✅ Next.js Standalone 모드');
console.log('✅ AR 가상 네일 체험 기능 포함');
console.log('✅ 럭셔리 CRM 시스템');

const port = process.env.PORT || 5000;

const server = spawn('npx', ['next', 'start', '-p', port], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

server.on('error', (err) => {
  console.error('❌ 서버 시작 실패:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM 신호 수신, 서버 종료 중...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT 신호 수신, 서버 종료 중...');
  server.kill('SIGINT');
});

server.on('exit', (code) => {
  const message = code === 0 ? '✅ 서버 정상 종료' : `❌ 서버 비정상 종료 (코드: ${code})`;
  console.log(message);
  process.exit(code || 0);
});