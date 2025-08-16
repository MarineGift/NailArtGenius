# 🔧 완전 안정적인 Dockerfile - npm 에러 완전 해결
FROM node:18.17.1-alpine AS base

# 시스템 의존성 설치 및 npm 안정화
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    && npm install -g npm@9.8.1 \
    && npm cache clean --force

WORKDIR /app

# 의존성 설치 단계 (최대한 안정적으로)
FROM base AS deps

# package.json 먼저 복사
COPY package.json ./

# package-lock.json이 있으면 복사 (선택적)
COPY package-lock.json* ./

# npm 설치를 여러 단계로 분리하여 디버깅 가능하게
RUN echo "📦 Starting npm install..." \
    && echo "Node version: $(node --version)" \
    && echo "npm version: $(npm --version)" \
    && echo "Current directory: $(pwd)" \
    && echo "Files in directory:" && ls -la \
    && echo "package.json contents:" && cat package.json \
    && echo "🔧 Removing any existing node_modules..." \
    && rm -rf node_modules \
    && echo "🔧 Clearing npm cache..." \
    && npm cache clean --force \
    && echo "🔧 Starting fresh npm install..." \
    && npm install --verbose --no-optional --legacy-peer-deps \
    && echo "✅ npm install completed successfully" \
    && echo "📋 Installed packages:" && ls -la node_modules/ | head -20

# 개발 의존성도 설치 (빌드에 필요할 수 있음)
RUN echo "🔧 Installing dev dependencies..." \
    && npm install --only=dev --verbose --legacy-peer-deps \
    && echo "✅ Dev dependencies installed"

# 빌드 단계
FROM base AS builder
WORKDIR /app

# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json* ./

# 모든 소스 파일 복사
COPY . .

# 환경변수 설정
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Next.js 빌드 (디버깅 포함)
RUN echo "🏗️ Starting Next.js build..." \
    && echo "Files in app directory:" && ls -la \
    && echo "Checking next.config.js:" && (test -f next.config.js && cat next.config.js || echo "No next.config.js found") \
    && echo "Checking app directory:" && (test -d app && ls -la app/ || echo "No app directory found") \
    && echo "Starting build process..." \
    && npm run build \
    && echo "✅ Build completed successfully" \
    && echo "Build output:" && ls -la .next/

# 런타임 단계
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 비특권 사용자 생성
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# 퍼블릭 파일 복사
COPY --from=builder /app/public ./public

# Next.js 빌드 결과물 복사
RUN mkdir .next \
    && chown nextjs:nodejs .next

# Standalone 빌드 복사 (Next.js 14 방식)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 헬스체크 스크립트 복사
COPY --from=builder --chown=nextjs:nodejs /app/healthcheck.js ./healthcheck.js

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node healthcheck.js || exit 1

# 서버 시작
CMD echo "🚀 Starting NailArt Genius server..." && node server.js