# ---- Base image ----
FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ---- Dependencies (with devDeps for build) ----
FROM base AS deps
# 패키지 잠금 파일이 있으면 ci, 없으면 install
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ---- Build ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 빌드 타임에 필요한 공개 키(클라이언트 주입)는 ARG/ENV로 전달
# Railway(또는 로컬 빌드)에서 --build-arg 로 주입 가능
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

# 타입체크/린트는 선택
# RUN npm run type-check && npm run lint
RUN npm run build

# ---- Runtime (standalone) ----
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 보안상 비루트 사용자
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Next standalone 산출물만 복사 → 런타임 슬림
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER 1001
EXPOSE 3000
CMD ["node", "server.js"]
