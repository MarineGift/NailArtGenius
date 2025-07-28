import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// 기본 API 라우트
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 메인 페이지 라우트 - HTML 페이지 제공
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../client/index.html'));
});

// API 라우트들
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Connie\'s Nail Server',
    nextjs_structure: 'Available in /nextjs-structure directory',
    deployment: 'Ready for GitHub + Railway deployment',
    files: [
      'connienail-nextjs-clean-20250728-035545.tar.gz - Clean Next.js structure (24KB)',
      'CLEAN_PROJECT_STRUCTURE.md - Folder structure guide',
      'DEPLOYMENT_FINAL_GUIDE.md - GitHub + Railway deployment guide'
    ]
  });
});

// 모든 다른 라우트는 메인 페이지로 리다이렉트 (SPA 라우팅)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Development server running on port ${PORT}`);
  console.log(`📦 Next.js structure available in: /nextjs-structure`);
  console.log(`🚀 Ready for deployment: connienail-nextjs-clean-20250728-035545.tar.gz`);
});