// Simple Next.js project launcher
import express from 'express';
import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Connie\'s Nail - Complete Next.js System');
console.log('✅ 4 languages: Korean, English, Japanese, Spanish');
console.log('✅ PWA mobile app + AI nail art + Supabase database');

// Next.js 서버 실행
const nextProcess = spawn('npx', ['next', 'dev', '--port', '3000'], {
  cwd: join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (err) => {
  console.error('❌ Next.js failed to start:', err);
});

// 상태 확인용 Express 서버
const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({
    message: 'Connie\'s Nail - Next.js System Running',
    nextjs_url: 'http://localhost:3000',
    languages: ['Korean (기본)', 'English', 'Japanese', 'Spanish'],
    features: [
      'PWA Mobile App',
      'AI Nail Art Generator', 
      'Supabase Database',
      'Customer Management',
      'Admin Dashboard',
      'Railway Deployment Ready'
    ]
  });
});

app.get('/', (req, res) => {
  res.redirect('http://localhost:3000/ko');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📊 Status server: http://localhost:${PORT}`);
  console.log(`🌟 Main Next.js app: http://localhost:3000/ko`);
  console.log(`🔗 Try: http://localhost:3000/en for English`);
});