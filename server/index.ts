import { exec } from 'child_process';

console.log('🚀 Starting ConnieNail Next.js application...');

const nextProcess = exec('npx next dev -p 5000', {
  cwd: process.cwd(),
  env: process.env
});

nextProcess.stdout?.on('data', (data) => {
  console.log(data.toString());
});

nextProcess.stderr?.on('data', (data) => {
  console.error(data.toString());
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code || 0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  nextProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  nextProcess.kill('SIGINT');
});