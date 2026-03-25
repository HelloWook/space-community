# Quickstart: 은하계 게시판

## 사전 요구사항

- Node.js 22 LTS
- Yarn 1.22+
- Docker & Docker Compose (PostgreSQL용)

## 환경 설정

```bash
# 1. 의존성 설치
yarn install

# 2. 환경 변수 설정
cp .env.example apps/api/.env
# DATABASE_URL=postgresql://appuser:apppassword@localhost:5432/galaxy_board

# 3. PostgreSQL 실행
docker compose up postgres -d

# 4. Prisma 마이그레이션 실행
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
cd ../..
```

## 개발 서버 실행

```bash
# 프론트엔드 + 백엔드 동시 실행
yarn dev

# 또는 개별 실행
yarn workspace @galaxy-board/web dev   # http://localhost:3000
yarn workspace @galaxy-board/api dev   # http://localhost:3001
```

## 테스트 실행

```bash
# 전체 테스트
yarn test

# 개별 워크스페이스 테스트
yarn workspace @galaxy-board/web test
yarn workspace @galaxy-board/api test

# API e2e 테스트
yarn workspace @galaxy-board/api test:e2e
```

## 프로젝트 구조

```
apps/
  web/                    # Next.js 15 프론트엔드
    src/
      app/                # Next.js App Router (라우트)
      views/              # FSD views 레이어 (화면 레이아웃)
      widgets/            # FSD widgets (복합 UI 섹션)
      features/           # FSD features (사용자 상호작용)
      entities/           # FSD entities (도메인 모델)
      shared/             # FSD shared (유틸리티, UI 프리미티브)
  api/                    # NestJS 11 백엔드
    src/
      domain/             # 도메인 엔티티, 포트 (인터페이스)
      application/        # 유스케이스, DTO, 매퍼
      infrastructure/     # 컨트롤러, Prisma 리포지토리
    prisma/
      schema.prisma       # Prisma 스키마
packages/
  types/                  # 공유 타입 (@galaxy-board/types)
  tsconfig/               # 공유 TypeScript 설정
  eslint-config/          # 공유 ESLint 설정
```

## 주요 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 15, React 19, TypeScript 5.7+ |
| 3D 렌더링 | Three.js 0.183, @react-three/fiber 9, @react-three/drei 10 |
| 상태 관리 | Zustand 5 (클라이언트), TanStack Query 5 (서버) |
| 폼/검증 | react-hook-form 7, zod 3 |
| UI | shadcn/ui, Tailwind CSS 4 |
| 백엔드 | NestJS 11, Prisma 7, PostgreSQL 16 |
| 테스트 | Jest 29, Testing Library, Supertest |
