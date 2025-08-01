import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Copy the Next.js config from config/ to root if it doesn't exist
import { existsSync, copyFileSync } from 'fs';

const configPath = join(projectRoot, 'next.config.js');
const sourceConfigPath = join(projectRoot, 'config', 'next.config.js');

if (!existsSync(configPath) && existsSync(sourceConfigPath)) {
  copyFileSync(sourceConfigPath, configPath);
  console.log('📦 Copied Next.js config to project root');
}

// Start Next.js development server
console.log('🚀 Starting Next.js development server...');

const nextProcess = spawn('npx', ['next', 'dev', '--port', '5000', '--hostname', '0.0.0.0'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

nextProcess.on('error', (error) => {
  console.error('❌ Failed to start Next.js:', error);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  console.log(`📝 Next.js process exited with code ${code}`);
  process.exit(code || 0);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Gracefully shutting down...');
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  nextProcess.kill('SIGTERM');
});