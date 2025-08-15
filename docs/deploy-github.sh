#!/bin/bash

# GitHub Pages 배포 스크립트
# marinegift.github.io/connienail 배포용

echo "🚀 Connie's Nail GitHub Pages 배포 스크립트"
echo "=========================================="

# 1. Repository 복제 (이미 존재하면 스킵)
if [ ! -d "connienail" ]; then
    echo "📦 Repository 복제 중..."
    git clone https://github.com/marinegift/connienail.git
    cd connienail
else
    echo "📁 기존 repository 사용"
    cd connienail
    git pull origin main
fi

# 2. 이전 파일 제거 (README.md 제외)
echo "🧹 이전 파일 정리 중..."
find . -type f ! -name "README.md" ! -name ".git*" ! -path "./.git/*" -delete

# 3. 새 파일 복사
echo "📋 새 파일 복사 중..."
cp -r ../docs/* .

# 4. Git 설정 확인
echo "⚙️  Git 설정 확인 중..."
git config --global user.email "marinegift@example.com" 2>/dev/null || true
git config --global user.name "Marine Gift" 2>/dev/null || true

# 5. 변경사항 커밋
echo "💾 변경사항 커밋 중..."
git add .
git commit -m "Deploy Connie's Nail website - $(date '+%Y-%m-%d %H:%M:%S')"

# 6. 푸시
echo "🌐 GitHub에 푸시 중..."
git push origin main

echo ""
echo "✅ 배포 완료!"
echo "🔗 웹사이트 확인: https://marinegift.github.io/connienail/"
echo "⏰ GitHub Pages 빌드까지 1-2분 소요될 수 있습니다."
echo ""
echo "📱 모바일에서도 확인해보세요!"
echo "🌍 다국어 지원: 한국어, 영어, 일본어, 스페인어"