my-multilang-website/
├── README.md
├── next.config.js              # Next.js 설정 (i18n 포함)
├── package.json
├── tailwind.config.js          # Tailwind CSS 설정
├── tsconfig.json               # TypeScript 설정 (선택사항)
├── .env.local                  # 환경변수 (Supabase 키 등)
├── .env.example               # 환경변수 예시
├── .gitignore
├── middleware.js              # Next.js 미들웨어 (언어 감지)
│
├── public/                    # 정적 파일
│   ├── favicon.ico
│   ├── images/
│   │   ├── common/           # 공통 이미지
│   │   ├── hero/            # 히어로 섹션 이미지
│   │   └── icons/           # 아이콘들
│   └── locales/             # 번역 파일
│       ├── en/
│       │   └── common.json
│       ├── ko/
│       │   └── common.json
│       └── ja/
│           └── common.json
│
├── src/                      # 소스 코드
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── globals.css      # 전역 CSS
│   │   ├── layout.js        # 루트 레이아웃
│   │   ├── page.js          # 홈페이지
│   │   ├── loading.js       # 로딩 컴포넌트
│   │   ├── error.js         # 에러 컴포넌트
│   │   ├── not-found.js     # 404 페이지
│   │   │
│   │   ├── [lang]/          # 동적 언어 라우팅
│   │   │   ├── layout.js    # 언어별 레이아웃
│   │   │   ├── page.js      # 언어별 홈페이지
│   │   │   ├── about/
│   │   │   │   └── page.js
│   │   │   ├── services/
│   │   │   │   ├── page.js
│   │   │   │   └── [slug]/
│   │   │   │       └── page.js
│   │   │   └── contact/
│   │   │       └── page.js
│   │   │
│   │   └── api/             # API 라우트
│   │       ├── auth/
│   │       ├── contact/
│   │       └── webhook/
│   │
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── ui/             # 기본 UI 컴포넌트
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Modal.js
│   │   │   ├── Input.js
│   │   │   └── index.js    # 컴포넌트 export
│   │   │
│   │   ├── layout/         # 레이아웃 관련 컴포넌트
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── Navbar.js
│   │   │   └── Sidebar.js
│   │   │
│   │   ├── sections/       # 페이지 섹션 컴포넌트
│   │   │   ├── Hero.js
│   │   │   ├── Features.js
│   │   │   ├── Testimonials.js
│   │   │   └── CTA.js
│   │   │
│   │   └── forms/          # 폼 관련 컴포넌트
│   │       ├── ContactForm.js
│   │       ├── NewsletterForm.js
│   │       └── AuthForm.js
│   │
│   ├── lib/                # 유틸리티 및 설정
│   │   ├── supabase/       # Supabase 설정
│   │   │   ├── client.js   # 클라이언트 설정
│   │   │   ├── server.js   # 서버 설정
│   │   │   └── types.js    # 타입 정의
│   │   │
│   │   ├── i18n/          # 국제화 설정
│   │   │   ├── config.js   # i18n 설정
│   │   │   ├── dictionaries.js  # 사전 로더
│   │   │   └── locales.js  # 지원 언어 목록
│   │   │
│   │   ├── utils/          # 유틸리티 함수
│   │   │   ├── cn.js       # className 유틸리티
│   │   │   ├── format.js   # 포맷팅 함수
│   │   │   └── validation.js # 유효성 검사
│   │   │
│   │   └── constants/      # 상수 정의
│   │       ├── routes.js   # 라우트 상수
│   │       ├── config.js   # 앱 설정
│   │       └── api.js      # API 엔드포인트
│   │
│   ├── hooks/              # 커스텀 훅
│   │   ├── useTranslation.js
│   │   ├── useSupabase.js
│   │   ├── useLocalStorage.js
│   │   └── useAuth.js
│   │
│   ├── context/            # React Context
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   └── LanguageContext.js
│   │
│   ├── styles/             # 스타일 파일
│   │   ├── globals.css     # 전역 스타일
│   │   ├── components.css  # 컴포넌트 스타일
│   │   └── utilities.css   # 유틸리티 클래스
│   │
│   └── types/              # TypeScript 타입 (TypeScript 사용시)
│       ├── index.ts
│       ├── auth.ts
│       └── database.ts
│
├── docs/                   # 문서
│   ├── deployment.md
│   ├── i18n-guide.md
│   └── contributing.md
│
└── scripts/               # 빌드/배포 스크립트
    ├── build.sh
    ├── deploy.sh
    └── seed-db.js