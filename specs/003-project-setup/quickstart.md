# Quickstart: 은하계 게시판

## 사전 요구사항

- Node.js 22 LTS
- Yarn 1.x 이상
- Docker + Docker Compose

## 설치 및 실행

### 1. 의존성 설치

```bash
yarn install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

### 3. Docker Compose로 전체 실행

```bash
docker compose up
```

서비스 접속:
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:3001
- 상태 확인: http://localhost:3001/health

### 4. 로컬 개발 (Docker 없이)

PostgreSQL만 Docker로 실행:

```bash
docker compose up postgres
```

프론트엔드/백엔드 개별 실행:

```bash
# 터미널 1 - 백엔드
yarn workspace @galaxy-board/api dev

# 터미널 2 - 프론트엔드
yarn workspace @galaxy-board/web dev
```

또는 루트에서 동시 실행:

```bash
yarn dev
```

## 테스트

```bash
# 전체 테스트
yarn test

# 프론트엔드 테스트
yarn workspace @galaxy-board/web test

# 백엔드 테스트
yarn workspace @galaxy-board/api test
```

## 린팅

```bash
yarn lint
```

## 데이터베이스 마이그레이션

```bash
yarn workspace @galaxy-board/api prisma migrate dev
```

## 프로젝트 구조

- `apps/web/` — Next.js 프론트엔드 (FSD 구조)
- `apps/api/` — NestJS 백엔드 (헥사고날 아키텍처)
- `packages/types/` — 공유 TypeScript 타입
- `packages/eslint-config/` — 공유 ESLint 설정
- `packages/tsconfig/` — 공유 TypeScript 설정
