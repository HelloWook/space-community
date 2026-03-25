# Quickstart: 행성 커스터마이징

**Feature**: 002-planet-customization | **Date**: 2026-03-25

## 사전 조건

- 001-galaxy-board 기능이 master에 머지된 상태
- Docker Desktop 실행 중 (PostgreSQL 16)
- Node.js 22 LTS, Yarn

## 개발 환경 설정

```bash
# 1. 브랜치 전환
git checkout 002-planet-customization

# 2. 의존성 설치 (react-colorful 추가됨)
yarn install

# 3. DB 컨테이너 시작
docker compose up -d db

# 4. Prisma 마이그레이션 (외형 컬럼 추가)
cd apps/api && npx prisma migrate dev --name planet-customization && cd ../..

# 5. Prisma 클라이언트 생성
cd apps/api && npx prisma generate && cd ../..

# 6. 시드 데이터 업데이트 (외형 포함 행성)
cd apps/api && npx prisma db seed && cd ../..

# 7. 개발 서버 시작
yarn dev
```

## 확인 방법

1. http://localhost:3000 접속
2. 은하계에 진입
3. 게시글 작성 버튼 클릭
4. 커스터마이징 패널에서 색상, 형태, 크기, 패턴, 고리 설정
5. 실시간 미리보기 확인
6. 랜덤 버튼으로 무작위 외형 생성 확인
7. 제출 후 은하계에서 커스터마이징된 행성 표시 확인

## 테스트

```bash
# 전체 테스트
yarn test

# 백엔드 단위 테스트
cd apps/api && yarn test

# 백엔드 e2e 테스트
cd apps/api && yarn test:e2e

# 프론트엔드 테스트
cd apps/web && yarn test
```

## 주요 파일

- `apps/api/prisma/schema.prisma` — Planet 모델 (외형 컬럼)
- `apps/web/src/features/customize-planet/` — 커스터마이징 기능 슬라이스
- `apps/web/src/shared/lib/shaders/` — 셰이더 패턴
- `apps/web/src/entities/planet/ui/Planet3D.tsx` — 3D 행성 렌더링
