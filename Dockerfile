# Dockerfile - 안정적인 Next.js + TypeScript + Docker
FROM node:18-alpine AS base

# 필요한 시스템 패키지 설치
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 의존성 설치 단계
FROM base AS deps

# package.json과 package-lock.json 복사
COPY package.json package-lock.json* ./

# 의존성 설치 (안정적인 방법)
RUN \
  if [ -f package-lock.json ]; then npm ci --only=production; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 빌드 의존성 설치 단계
FROM base AS builder
WORKDIR /app

# 프로덕션 의존성 복사
COPY --from=deps /app/node_modules ./node_modules

# 소스코드 복사
COPY . .

# 환경변수 설정
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# TypeScript 타입 체크 및 빌드
RUN npm run type-check
RUN npm run build

# 런타임 단계
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 보안을 위한 비특권 사용자 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 퍼블릭 파일 복사
COPY --from=builder /app/public ./public

# Next.js 빌드 결과물 복사
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Standalone 빌드 복사 (Next.js 14 방식)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 사용자 전환
USER nextjs

# 포트 노출
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 헬스체크
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 서버 시작
CMD ["node", "server.js"]