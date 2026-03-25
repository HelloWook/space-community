# 은하계 게시판 (Galaxy Board)

3D 우주 공간에서 게시글을 탐색하는 게시판. 은하계(주제) 안에 행성(게시글)이 있고, 별(좋아요)이 행성 주위를 회전합니다.

## 사전 요구사항

- Node.js 22 LTS
- Yarn 1.x
- Docker + Docker Compose

## 설치

```bash
yarn install
```

## 실행

### Docker Compose (전체 서비스)

```bash
docker compose up
```

- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:3001
- Health Check: http://localhost:3001/health

### 로컬 개발 (PostgreSQL만 Docker)

```bash
docker compose up postgres

# 터미널 분할
yarn workspace @galaxy-board/api dev
yarn workspace @galaxy-board/web dev

# 또는 동시 실행
yarn dev
```

## 테스트

```bash
yarn test
```

## 린팅

```bash
yarn lint
```

## 프로젝트 구조

```
galaxy-board/
├── apps/
│   ├── web/          # Next.js 프론트엔드 (FSD 구조)
│   └── api/          # NestJS 백엔드 (헥사고날 아키텍처)
├── packages/
│   ├── types/        # 공유 TypeScript 타입
│   ├── eslint-config/# 공유 ESLint 설정
│   └── tsconfig/     # 공유 TypeScript 설정
├── docker-compose.yml
└── package.json      # yarn workspaces 루트
```

## 기술 스택

- **프론트엔드**: Next.js 15, React 19, Three.js, @react-three/fiber
- **백엔드**: NestJS 11, Prisma, PostgreSQL
- **모노레포**: yarn workspaces
- **테스트**: Jest
- **컨테이너**: Docker + Docker Compose
