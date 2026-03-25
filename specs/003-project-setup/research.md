# Research: 프로젝트 초기 세팅

## 기술 스택 버전 결정

### Node.js

- **Decision**: Node.js 22 LTS
- **Rationale**: Active LTS 상태로 2027년 4월까지 지원. Next.js 16 최소 요구사항(20.9+) 충족. 안정적 생태계 호환성.
- **Alternatives**: Node.js 24 (최신이나 생태계 성숙도 부족), Node.js 20 (2026년 4월 EOL 임박)

### 프론트엔드 (Next.js + Three.js)

- **Decision**: Next.js 15.x, React 19, Three.js 0.183.x, @react-three/fiber 9.x, @react-three/drei 10.x
- **Rationale**: Next.js 15는 충분히 안정적이며 App Router를 완전 지원. R3F 9.x/Drei 10.x는 현재 stable 버전.
- **Alternatives**: Next.js 16 (매우 최신, breaking changes 다수), R3F 10 alpha (WebGPU 지원하나 불안정)

### 백엔드 (NestJS + ORM)

- **Decision**: NestJS 11.x, Prisma 7.x
- **Rationale**: NestJS 11은 현재 안정 버전. Prisma 7은 TypeScript 네이티브 클라이언트로 90% 작은 번들, 3배 빠른 쿼리. 헥사고날 아키텍처에서 포트/어댑터 패턴과 잘 맞음.
- **Alternatives**: TypeORM 0.3.x (데코레이터 기반이나 타입 안전성 부족)

### 테스트 프레임워크

- **Decision**: Jest 29.x (프론트엔드: next/jest + jsdom, 백엔드: @swc/jest)
- **Rationale**: Next.js/NestJS 모두 Jest를 공식 지원. @swc/jest로 NestJS 데코레이터 메타데이터 지원.
- **Alternatives**: Vitest (Next.js 공식 지원이 Jest 대비 약함)

### 린팅/포매팅

- **Decision**: ESLint 9.x (Flat Config), Prettier 3.x, @typescript-eslint 8.x
- **Rationale**: ESLint 9 Flat Config가 현재 표준. 모노레포 공유 설정 패키지로 일관성 유지.
- **Alternatives**: Biome (아직 ESLint 플러그인 생태계 부족)

### Docker

- **Decision**: PostgreSQL 16-alpine, Node.js 22-alpine 베이스 이미지
- **Rationale**: Alpine 이미지로 경량화. PostgreSQL 16은 현재 안정 LTS.
- **Alternatives**: PostgreSQL 17 (최신이나 16이 더 안정적)

## 모노레포 구조 결정

- **Decision**: yarn workspaces, apps/*/packages/* 구조
- **Rationale**: apps/에 배포 가능한 앱(web, api), packages/에 공유 코드(types, eslint-config, tsconfig). 명확한 경계.
- **Alternatives**: Turborepo 추가 (현 규모에서 불필요, YAGNI 원칙)

## FSD + Next.js App Router 통합

- **Decision**: Next.js app/ 디렉토리는 라우팅 전용, FSD 레이어는 src/ 하위에 배치
- **Rationale**: FSD 공식 가이드 권장 방식. app/의 page.tsx는 src/pages/의 컴포넌트를 re-export하는 thin proxy.
- **Alternatives**: app/ 내부에 FSD 구조 혼합 (라우팅과 비즈니스 로직 결합, 권장하지 않음)

## 헥사고날 아키텍처 + NestJS 통합

- **Decision**: 모듈별 domain/(ports/services) + adapters/(in/out) 구조
- **Rationale**: NestJS 모듈 시스템과 자연스럽게 매핑. domain/은 프레임워크 의존성 제로. 포트를 injection token으로 바인딩.
- **Alternatives**: 레이어별 분리(domain/, adapters/ 최상위) — 모듈 간 경계가 불명확해짐

## 공유 패키지

- **Decision**: @galaxy-board/types (공유 타입), @galaxy-board/eslint-config, @galaxy-board/tsconfig
- **Rationale**: 프론트/백엔드 간 엔티티 타입 공유 필수. 린팅/TS 설정은 모노레포 일관성을 위해 패키지화.
- **Alternatives**: 타입 중복 정의 (DRY 위반)
