# Connie's Nail - Complete Project Structure Guide

## 📁 Project Overview
완전한 네일샵 관리 시스템으로 고객 관리, 예약, 결제, AI 네일아트, PWA 모바일 앱 기능을 포함합니다.

## 🏗️ Main Directory Structure

```
connienail/
├── 📁 client/                    # React 프론트엔드
│   ├── src/
│   │   ├── components/           # UI 컴포넌트들
│   │   ├── pages/               # 페이지 컴포넌트들
│   │   ├── lib/                 # 유틸리티 라이브러리
│   │   └── hooks/               # React 훅들
│   └── public/                  # 정적 파일들
│
├── 📁 server/                   # Express.js 백엔드
│   ├── routes.ts               # API 라우트 정의
│   ├── storage.ts              # 데이터베이스 연산
│   ├── db.ts                   # 데이터베이스 연결
│   ├── admin-auth.ts           # 관리자 인증
│   └── *.ts                    # 기타 서버 로직
│
├── 📁 shared/                   # 공유 코드
│   └── schema.ts               # 데이터베이스 스키마 (Drizzle)
│
├── 📁 docs/                     # GitHub Pages 정적 사이트
│   ├── index.html              # 메인 HTML
│   ├── script.js               # JavaScript 로직
│   └── styles.css              # CSS 스타일
│
├── 📁 public/                   # 정적 리소스
├── 📁 uploads/                  # 업로드된 파일들
└── 📄 Configuration Files       # 설정 파일들
```

## 🗄️ Database Schema (PostgreSQL + Supabase)

### Core Tables
- **admins** - 관리자 계정 관리 (새로 추가됨)
- **users** - 기본 사용자 테이블 (Replit Auth 호환)
- **customers** - 고객 정보 및 VIP 관리
- **bookings** - 예약 관리
- **gallery** - 갤러리 이미지 관리
- **carousel_images** - 홈페이지 캐러셀

### Advanced Features Tables
- **customer_nail_info** - AI 네일아트 고객별 정보
- **ai_nail_art_images** - AI 생성 네일아트
- **contact_inquiries** - 고객 문의사항
- **sms_templates** - SMS 템플릿 관리

## 🚀 Key Features

### 1. 관리자 시스템
- **위치**: `/admin-dashboard`
- **로그인**: admin/1111
- **기능**: 
  - Admin 계정 관리 (새로 추가됨)
  - Customer 관리
  - 예약 관리
  - 갤러리 관리
  - AI 네일아트 관리

### 2. 고객 시스템
- **홈페이지**: 다국어 지원 (한국어, 영어, 일본어, 스페인어)
- **예약 시스템**: 실시간 예약 및 결제
- **AI 네일아트**: 6장 사진 업로드 → AI 분석 → 디자인 생성
- **갤러리**: 24개 네일아트 작품 (페이지네이션)

### 3. PWA 모바일 앱
- **설치 가능한 웹앱**
- **오프라인 지원**
- **푸시 알림**
- **모바일 최적화**

## 📱 Deployment Options

### 1. Replit 배포 (현재)
- **URL**: https://[replit-app-name].replit.app
- **데이터베이스**: Supabase PostgreSQL
- **실행**: `npm run dev`

### 2. GitHub Pages 배포 (준비됨)
- **URL**: https://marinegift.github.io/connienail/
- **위치**: `/docs` 폴더
- **타입**: 정적 사이트 (완전 기능)

## 🔧 Setup Instructions

### 1. 환경 변수 설정
```bash
DATABASE_URL=your_supabase_url
OPENAI_API_KEY=your_openai_key
PAYPAL_CLIENT_ID=your_paypal_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
```

### 2. 설치 및 실행
```bash
npm install
npm run db:push      # 데이터베이스 스키마 적용
npm run dev          # 개발 서버 시작
```

### 3. 관리자 계정
- **Username**: admin
- **Password**: 1111
- **기본 4개 관리자 계정 자동 생성됨**

## 📊 Database Sample Data

### Admins (4개)
- ADMIN-001: Connie Manager (Super Admin)
- ADMIN-002: Sarah Kim (Manager)
- ADMIN-003: Emily Park (Staff)
- ADMIN-004: Jenny Lee (Technician)

### Gallery (24개)
- 2페이지 페이지네이션
- Unsplash 고품질 이미지
- 카테고리: nail_art, seasonal, spa

### Customers (26개)
- VIP 레벨 시스템
- 로열티 포인트
- 방문 기록 추적

## 🎯 Main Features Overview

### ✅ 완료된 기능들
- [x] 관리자 시스템 (Admin 테이블 구조)
- [x] 고객 관리 시스템
- [x] 실시간 예약 시스템
- [x] 갤러리 페이지네이션 (24개 아이템)
- [x] AI 네일아트 생성
- [x] PWA 모바일 앱
- [x] 다국어 지원 (4개 언어)
- [x] GitHub Pages 정적 사이트
- [x] PayPal 결제 연동
- [x] SMS 알림 시스템

### 🚧 개선 가능한 부분들
- [ ] 관리자 권한 시스템 세분화
- [ ] 고객 리뷰 시스템
- [ ] 직원 일정 관리
- [ ] 재고 관리 시스템
- [ ] 매출 분석 대시보드

## 📞 Support & Contact
프로젝트 관련 문의사항은 관리자 대시보드의 Contact US 탭을 통해 확인 가능합니다.

---
**Last Updated**: 2025-07-25
**Version**: Complete System v1.0
**Database**: Supabase PostgreSQL + 35+ Tables