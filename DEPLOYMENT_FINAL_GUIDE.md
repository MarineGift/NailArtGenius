# 🚀 Next.js + Supabase + Railway 최종 배포 가이드

## 📦 압축파일 내용

현재 작업한 프로젝트가 다음과 같이 정리되었습니다:

### ✅ 정리 완료
- **불필요한 파일 삭제**: 로그파일, 캐시, 임시파일 등 제거
- **구조 최적화**: Next.js App Router 구조로 재구성
- **압축파일 생성**: `connienail-nextjs-optimized-[날짜].tar.gz`

### 📁 최적화된 폴더 구조

```
📦 connienail-nextjs-optimized/
├── 🗂️ nextjs-structure/          # 새로운 Next.js 구조 (권장)  
│   ├── app/                      # Next.js 13+ App Router
│   ├── components/               # 재사용 컴포넌트
│   ├── lib/                      # 유틸리티 & 설정
│   ├── locales/                  # 다국어 번역 파일
│   ├── types/                    # TypeScript 타입
│   ├── package.json              # Next.js 의존성
│   ├── next.config.js            # Next.js 설정
│   ├── middleware.ts             # i18n 미들웨어  
│   ├── tailwind.config.ts        # Tailwind 설정
│   └── railway.json              # Railway 배포 설정
│
├── 🗂️ client/                    # 기존 React 구조 (참고용)
├── 🗂️ server/                    # 기존 Express 구조 (참고용)
├── 🗂️ shared/                    # 공유 스키마
├── 🗂️ docs/                      # GitHub Pages 정적 사이트
└── 📄 CLEAN_PROJECT_STRUCTURE.md  # 구조 가이드
```

## 🎯 권장 배포 방법

### Option 1: Next.js 구조 사용 (권장 ⭐)

1. **압축 해제 후 Next.js 구조로 이동**:
   ```bash
   tar -xzf connienail-nextjs-optimized-*.tar.gz
   cd nextjs-structure/
   ```

2. **의존성 설치**:
   ```bash
   npm install
   ```

3. **환경 변수 설정** (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

5. **Railway 배포**:
   - GitHub에 업로드
   - Railway에서 GitHub 연결
   - 자동 배포 실행

### Option 2: 기존 구조 유지

기존 `client/`, `server/` 구조를 그대로 사용하려는 경우:
- Express + React 구조 유지
- Replit에서 계속 개발 가능

## 🌍 다국어 지원 (i18n)

### 지원 언어
- **한국어** (ko) - 기본
- **영어** (en)
- **일본어** (ja)  
- **스페인어** (es)

### URL 구조
```
https://your-domain.com/ko/     # 한국어
https://your-domain.com/en/     # 영어
https://your-domain.com/ja/     # 일본어
https://your-domain.com/es/     # 스페인어
```

## 🗄️ Supabase 데이터베이스

### 핵심 테이블 (기존 유지)
- `admins` - 관리자 계정 (4개 샘플)
- `customers` - 고객 정보 (26개 샘플)
- `gallery` - 갤러리 (24개 아이템)
- `bookings` - 예약 관리
- `services` - 서비스 정보

### 연결 방법
1. Supabase 프로젝트 생성
2. 기존 데이터 마이그레이션
3. API 키 설정

## 🚀 Railway 배포 설정

### railway.json 포함
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

### 자동 배포 과정
1. GitHub 푸시
2. Railway 자동 빌드
3. 배포 완료
4. 커스텀 도메인 연결 가능

## 📱 PWA 기능 유지

- 모바일 앱처럼 설치 가능
- 오프라인 지원
- 푸시 알림
- 반응형 디자인

## 🎨 주요 기능

### ✅ 완료된 기능들
- [x] 관리자 시스템 (Admin 테이블)
- [x] 고객 관리 (VIP 레벨, 로열티)
- [x] 갤러리 페이지네이션 (24개)
- [x] 다국어 지원 (4개 언어)
- [x] AI 네일아트 생성
- [x] PayPal 결제 연동
- [x] SMS 알림 시스템
- [x] PWA 모바일 앱

## 📋 다음 단계

### 1. 구조 선택
- **Next.js 구조** 사용 시: 현대적이고 확장 가능
- **기존 구조** 유지 시: 빠른 배포 가능

### 2. 데이터베이스 마이그레이션
- Supabase 프로젝트 생성
- 기존 데이터 이전
- API 키 설정

### 3. 배포 실행
- GitHub 업로드
- Railway 연결
- 도메인 설정

## 💡 추천사항

1. **Next.js 구조 사용**: 미래 확장성과 유지보수성
2. **점진적 마이그레이션**: 기능별로 단계적 이전
3. **데이터 백업**: 배포 전 반드시 데이터 백업

---

**압축파일**: `connienail-nextjs-optimized-[날짜].tar.gz`  
**권장 구조**: `nextjs-structure/` 폴더  
**배포 플랫폼**: Railway + Supabase  
**도메인**: 커스텀 도메인 연결 가능