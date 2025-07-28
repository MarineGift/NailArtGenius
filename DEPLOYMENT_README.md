# 🚀 Connie's Nail - 배포 가이드

## 📦 압축 파일 구성

이 압축 파일에는 완전한 네일샵 관리 시스템이 포함되어 있습니다:

### 📁 주요 폴더 구조
```
connienail-complete-project/
├── client/          # React 프론트엔드 (사용자 인터페이스)
├── server/          # Express 백엔드 (API 서버)
├── shared/          # 공통 스키마 및 타입
├── docs/            # GitHub Pages 정적 사이트 (배포 준비됨)
├── public/          # 정적 파일들
└── 설정 파일들      # package.json, tsconfig.json 등
```

## 🛠️ 설치 방법

### 1단계: 파일 압축 해제
```bash
tar -xzf connienail-complete-project-[날짜].tar.gz
cd connienail-complete-project/
```

### 2단계: 의존성 설치
```bash
npm install
```

### 3단계: 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가:
```
DATABASE_URL=your_supabase_postgresql_url
OPENAI_API_KEY=your_openai_api_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### 4단계: 데이터베이스 설정
```bash
npm run db:push
```

### 5단계: 서버 실행
```bash
npm run dev
```

## 🌐 배포 옵션

### Option 1: Replit 배포 (추천)
1. Replit에서 새 프로젝트 생성
2. 파일들을 업로드
3. Supabase 데이터베이스 연결
4. 환경 변수 설정
5. "Run" 버튼 클릭

### Option 2: GitHub Pages 배포
1. GitHub 저장소 생성
2. `docs/` 폴더 내용을 저장소에 업로드
3. Settings → Pages → Source를 "Deploy from a branch" 선택
4. Branch를 "main", Folder를 "/docs" 선택
5. https://[username].github.io/[repository] 에서 접속

### Option 3: 기타 클라우드 서비스
- Vercel, Netlify, Heroku 등에서도 배포 가능
- Node.js 18+ 환경 필요
- PostgreSQL 데이터베이스 필요

## 🔑 기본 로그인 정보

### 관리자 계정
- **URL**: `/admin-dashboard`
- **Username**: `admin`
- **Password**: `1111`

### 사전 생성된 관리자들
1. **ADMIN-001**: Connie Manager (Super Admin)
2. **ADMIN-002**: Sarah Kim (Manager) - `manager1/manager123`
3. **ADMIN-003**: Emily Park (Staff) - `staff1/staff123`
4. **ADMIN-004**: Jenny Lee (Technician) - `technician1/tech123`

## 📊 포함된 데이터

### ✅ 완전한 샘플 데이터
- **4개 관리자 계정** (역할별 권한 설정)
- **26개 고객 데이터** (VIP 레벨, 로열티 포인트 포함)
- **24개 갤러리 아이템** (Unsplash 고품질 이미지)
- **예약 및 주문 샘플 데이터**
- **AI 네일아트 샘플**

## 🎯 주요 기능들

### 🏢 관리자 기능
- **Admin 관리**: 관리자 계정 생성/수정/비활성화
- **Customer 관리**: VIP 레벨, 로열티 포인트 관리
- **예약 관리**: 실시간 예약 현황 및 관리
- **갤러리 관리**: 네일아트 작품 업로드 및 관리
- **Contact US**: 고객 문의사항 관리
- **SMS 발송**: 예약 확인 SMS 자동 발송

### 👥 고객 기능
- **다국어 지원**: 한국어, 영어, 일본어, 스페인어
- **실시간 예약**: 시간대별 예약 가능 여부 확인
- **AI 네일아트**: 6장 사진 업로드 → AI 분석 → 맞춤 디자인
- **갤러리 탐색**: 24개 작품, 페이지네이션, 검색/필터
- **PayPal 결제**: 온라인 결제 (10% 할인)
- **PWA 모바일**: 앱처럼 설치 가능

## 🔧 기술 스택

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** + Shadcn/ui
- **Wouter** (라우팅)
- **TanStack Query** (상태 관리)

### Backend
- **Express.js** + TypeScript
- **Drizzle ORM** (타입 안전한 데이터베이스)
- **PostgreSQL** (Supabase)
- **JWT** 인증

### 외부 서비스
- **OpenAI API** (AI 네일아트)
- **PayPal SDK** (결제)
- **SendGrid** (이메일)
- **SMS 서비스** (알림)

## 🚨 중요 참고사항

### 데이터베이스
- **Supabase PostgreSQL** 사용 권장
- 35개 이상의 테이블로 구성
- 완전한 관계형 데이터베이스 구조

### 보안
- **JWT 토큰** 기반 인증
- **bcrypt** 패스워드 해싱
- **환경 변수**로 민감 정보 관리

### 성능
- **이미지 최적화** (Sharp)
- **캐싱** (TanStack Query)
- **페이지네이션** (대용량 데이터)

## 📞 지원 및 문의

### 문제 해결
1. **로그 확인**: 콘솔에서 에러 메시지 확인
2. **환경 변수**: DATABASE_URL 등 필수 변수 설정 확인
3. **포트**: 기본 포트 5000 사용

### 추가 개발
- 코드는 완전히 모듈화되어 있어 쉽게 확장 가능
- TypeScript로 타입 안전성 보장
- 컴포넌트 기반 아키텍처

---

**개발 완료일**: 2025-07-25  
**버전**: Complete System v1.0  
**포함 기능**: 관리자 시스템, 고객 관리, AI 네일아트, PWA, 다국어, 결제 연동

이 시스템은 완전한 네일샵 운영을 위한 모든 기능을 포함하고 있습니다.