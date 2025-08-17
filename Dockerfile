# 🔧 개선된 Dockerfile - next 명령어 문제 해결
FROM node:18-alpine

WORKDIR /app

# package.json 복사
COPY package.json ./

# npm 설치 (더 명확한 로깅)
RUN echo "📦 Installing dependencies..." \
    && npm install \
    && echo "✅ Dependencies installed" \
    && echo "📋 Checking next installation:" \
    && ls -la node_modules/.bin/next || echo "❌ next not found" \
    && npm list next || echo "❌ next not in package list"

# 모든 파일 복사
COPY . .

# Next.js 빌드 (절대 경로 사용)
RUN echo "🏗️ Building Next.js app..." \
    && echo "Current directory: $(pwd)" \
    && echo "Files in directory:" \
    && ls -la \
    && echo "node_modules/.bin contents:" \
    && ls -la node_modules/.bin/ | head -10 \
    && echo "Starting build with npx..." \
    && npx next build \
    && echo "✅ Build completed"

# 포트 설정
EXPOSE 3000

# 서버 시작 (절대 경로 사용)
CMD ["npx", "next", "start"]