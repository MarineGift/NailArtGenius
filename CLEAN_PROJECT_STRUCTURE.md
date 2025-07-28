# 🚀 Next.js + i18n + Supabase + Railway 최적화 구조

## 📁 권장 폴더 구조 (Next.js 13+ App Router)

```
connienail-nextjs/
├── 📂 app/                          # Next.js 13+ App Router
│   ├── [locale]/                    # 다국어 라우팅 (ko, en, ja, es)
│   │   ├── admin/                   # 관리자 페이지
│   │   │   ├── dashboard/
│   │   │   ├── customers/
│   │   │   └── gallery/
│   │   ├── booking/                 # 예약 페이지
│   │   ├── gallery/                 # 갤러리 페이지
│   │   ├── services/                # 서비스 페이지
│   │   └── page.tsx                 # 홈페이지
│   ├── api/                         # API Routes
│   │   ├── admin/
│   │   ├── customers/
│   │   ├── bookings/
│   │   └── gallery/
│   ├── globals.css                  # Tailwind CSS
│   └── layout.tsx                   # 루트 레이아웃
│
├── 📂 components/                   # 재사용 가능한 컴포넌트
│   ├── ui/                         # Shadcn/ui 컴포넌트
│   ├── admin/                      # 관리자 전용 컴포넌트
│   ├── forms/                      # 폼 컴포넌트
│   └── layout/                     # 레이아웃 컴포넌트
│
├── 📂 lib/                         # 유틸리티 & 설정
│   ├── supabase.ts                 # Supabase 클라이언트
│   ├── i18n.ts                     # 다국어 설정
│   ├── utils.ts                    # 공통 유틸리티
│   └── validations.ts              # Zod 스키마
│
├── 📂 locales/                     # 다국어 번역
│   ├── ko.json                     # 한국어
│   ├── en.json                     # 영어
│   ├── ja.json                     # 일본어
│   └── es.json                     # 스페인어
│
├── 📂 types/                       # TypeScript 타입 정의
│   ├── database.ts                 # Supabase 타입
│   ├── admin.ts                    # 관리자 타입
│   └── customer.ts                 # 고객 타입
│
├── 📂 public/                      # 정적 파일
│   ├── images/                     # 이미지
│   ├── icons/                      # 아이콘
│   └── manifest.json               # PWA 설정
│
├── 📂 middleware/                  # Next.js 미들웨어
│   └── auth.ts                     # 인증 미들웨어
│
├── 📂 hooks/                       # 커스텀 React 훅
│   ├── useAuth.ts                  # 인증 훅
│   ├── useSupabase.ts              # Supabase 훅
│   └── useI18n.ts                  # 다국어 훅
│
├── 📂 store/                       # 상태 관리 (Zustand)
│   ├── authStore.ts                # 인증 상태
│   └── adminStore.ts               # 관리자 상태
│
├── 📂 database/                    # 데이터베이스 관련
│   ├── migrations/                 # Supabase 마이그레이션
│   ├── seed/                       # 시드 데이터
│   └── schema.sql                  # 데이터베이스 스키마
│
└── 📄 Configuration Files
    ├── next.config.js              # Next.js 설정
    ├── tailwind.config.ts          # Tailwind 설정
    ├── middleware.ts               # 다국어 미들웨어
    ├── package.json                # 의존성
    └── railway.json                # Railway 배포 설정
```

## 🛠️ 주요 개선사항

### 1. Next.js App Router 구조
- **app/** 디렉토리 사용 (Next.js 13+)
- **[locale]** 기반 다국어 라우팅
- **API Routes** 체계적 구성

### 2. 명확한 관심사 분리
- **components/** - UI 컴포넌트만
- **lib/** - 비즈니스 로직 & 유틸리티
- **types/** - TypeScript 타입 정의
- **hooks/** - React 훅들

### 3. 국제화 (i18n) 최적화
- **locales/** - 번역 파일 중앙 관리
- **middleware.ts** - 자동 언어 감지
- **[locale]** - URL 기반 언어 라우팅

### 4. Railway 배포 최적화
- **railway.json** - 배포 설정
- **Dockerfile** - 컨테이너 설정 (필요시)
- 환경 변수 관리

## 📦 필수 패키지 목록

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "next-intl": "^3.0.0",
    "tailwindcss": "^3.0.0",
    "@tailwindcss/typography": "^0.5.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.300.0",
    "zustand": "^4.0.0",
    "zod": "^3.0.0",
    "@hookform/resolvers": "^3.0.0",
    "react-hook-form": "^7.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

## 🔧 핵심 설정 파일

### next.config.js
```javascript
const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
});
```

### middleware.ts
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ko', 'en', 'ja', 'es'],
  defaultLocale: 'ko'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

### railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 🗄️ Supabase 스키마 최적화

### 핵심 테이블
```sql
-- 관리자 테이블
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 고객 테이블
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  phone VARCHAR UNIQUE,
  email VARCHAR,
  vip_level VARCHAR DEFAULT 'regular',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 예약 테이블
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  service_type VARCHAR NOT NULL,
  booking_date TIMESTAMP NOT NULL,
  status VARCHAR DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 갤러리 테이블
CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  image_url VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 배포 프로세스

### 1. GitHub 저장소 준비
```bash
git init
git add .
git commit -m "Initial Next.js structure"
git push origin main
```

### 2. Railway 배포
1. Railway 계정 연결
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 자동 배포 활성화

### 3. Supabase 연결
1. Supabase 프로젝트 생성
2. 데이터베이스 스키마 적용
3. API 키 및 URL 설정

## 🌍 다국어 구현 예시

### locales/ko.json
```json
{
  "navigation": {
    "home": "홈",
    "services": "서비스",
    "gallery": "갤러리",
    "booking": "예약"
  },
  "hero": {
    "title": "코니네일에 오신 것을 환영합니다",
    "subtitle": "전문적인 네일 케어 서비스"
  }
}
```

### 컴포넌트에서 사용
```typescript
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('hero');
  
  return (
    <h1>{t('title')}</h1>
  );
}
```

이 구조는 유지보수성, 확장성, 그리고 팀 협업에 최적화되어 있습니다.