# Tasks: 프로젝트 초기 세팅

**Input**: Design documents from `/specs/003-project-setup/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 소속 사용자 스토리 (US1, US2, US3, US4)
- 정확한 파일 경로 포함

---

## Phase 1: Setup (모노레포 초기화)

**Purpose**: yarn workspaces 모노레포 루트 구조 생성

- [x] T001 루트 package.json 생성 (workspaces: ["apps/*", "packages/*"], name: "galaxy-board", private: true, yarn workspaces 설정) in package.json
- [x] T002 .nvmrc 파일 생성 (Node.js 22 명시) in .nvmrc
- [x] T003 [P] .gitignore 생성 (node_modules, .env, dist, .next, coverage, .prisma 등) in .gitignore

- [x] T004 [P] .env.example 생성 (DATABASE_URL, NEXT_PUBLIC_API_URL, NODE_ENV) in .env.example
- [x] T005 [P] tsconfig.base.json 생성 (strict: true, 공용 TypeScript 설정) in tsconfig.base.json
- [x] T006 [P] .prettierrc.js 생성 (Prettier 3.x 설정: singleQuote, semi, trailingComma 등) in .prettierrc.js

**Checkpoint**: 루트 모노레포 구조 초기화 완료

---

## Phase 2: Foundational (공유 패키지)

**Purpose**: 모든 앱이 의존하는 공유 패키지 생성

**⚠️ CRITICAL**: 앱(web, api) 생성 전에 공유 패키지가 먼저 준비되어야 함

- [x] T007 packages/tsconfig/ 패키지 생성 — package.json (@galaxy-board/tsconfig), base.json, next.json, nest.json in packages/tsconfig/
- [x] T008 [P] packages/eslint-config/ 패키지 생성 — package.json (@galaxy-board/eslint-config), index.js (기본), next.js (Next.js용), nest.js (NestJS용), ESLint 9 Flat Config + @typescript-eslint 8.x + eslint-config-prettier in packages/eslint-config/
- [x] T009 [P] packages/types/ 패키지 생성 — package.json (@galaxy-board/types), src/index.ts (빈 barrel export) in packages/types/
- [x] T010 yarn install 실행하여 워크스페이스 의존성 연결 확인

**Checkpoint**: 공유 패키지 준비 완료 — 앱 생성 가능

---

## Phase 3: User Story 1 - 프론트엔드 프로젝트 구조 세팅 (Priority: P1)

**Goal**: FSD 구조의 Next.js 프론트엔드에서 빈 3D 장면을 렌더링

**Independent Test**: 개발 서버 실행 후 브라우저에서 빈 3D 장면이 표시되면 통과

### Tests for User Story 1 ⚠️

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현**

- [x] T011 [P] [US1] FSD 레이어 디렉토리 존재 여부를 검증하는 테스트 작성 in apps/web/**tests**/structure.test.ts
- [x] T012 [P] [US1] 3D 장면 컴포넌트 렌더링 테스트 작성 (React Testing Library + R3F) in apps/web/src/shared/ui/**tests**/Scene.test.tsx

### Implementation for User Story 1

- [x] T013 [US1] apps/web/ Next.js 프로젝트 초기화 — package.json (@galaxy-board/web), next.config.ts, tsconfig.json (@galaxy-board/tsconfig/next.json 확장) in apps/web/
- [x] T014 [US1] apps/web/eslint.config.js 생성 (@galaxy-board/eslint-config/next 사용) in apps/web/eslint.config.js
- [x] T015 [US1] apps/web/jest.config.ts 생성 (next/jest, jsdom, @testing-library 설정) in apps/web/jest.config.ts
- [x] T016 [US1] FSD 레이어 디렉토리 구조 생성 — src/app/providers/, src/app/styles/, src/pages/, src/widgets/, src/features/, src/entities/, src/shared/ui/, src/shared/lib/, src/shared/config/, src/shared/types/ 각 디렉토리 + index.ts barrel export in apps/web/src/
- [x] T017 [US1] Next.js App Router 엔트리 생성 — app/layout.tsx (루트 레이아웃 + 프로바이더), app/page.tsx (src/pages/home re-export) in apps/web/app/
- [x] T018 [US1] src/app/providers/index.tsx 생성 (글로벌 프로바이더 래퍼) in apps/web/src/app/providers/index.tsx
- [x] T019 [US1] src/app/styles/globals.css 생성 (기본 리셋 + 전체화면 캔버스 스타일) in apps/web/src/app/styles/globals.css
- [x] T020 [US1] src/shared/ui/Scene.tsx 생성 — @react-three/fiber Canvas + 기본 카메라/조명으로 빈 3D 장면 컴포넌트 in apps/web/src/shared/ui/Scene.tsx
- [x] T021 [US1] src/pages/home/index.ts + ui/HomePage.tsx 생성 — Scene 컴포넌트를 포함한 홈 페이지 in apps/web/src/pages/home/
- [x] T022 [US1] Three.js 의존성 설치 (three, @react-three/fiber, @react-three/drei, @types/three) in apps/web/package.json
- [x] T023 [US1] T011, T012 테스트 실행하여 통과 확인

**Checkpoint**: 프론트엔드 개발 서버 실행 시 빈 3D 장면이 브라우저에 표시됨

---

## Phase 4: User Story 2 - 백엔드 프로젝트 구조 세팅 (Priority: P1)

**Goal**: 헥사고날 아키텍처의 NestJS 백엔드에서 Health Check 엔드포인트 응답

**Independent Test**: 백엔드 서버 실행 후 GET /health가 200 OK로 응답하면 통과

### Tests for User Story 2 ⚠️

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현**

- [x] T024 [P] [US2] Health Check 엔드포인트 e2e 테스트 작성 (GET /health → 200, 응답 형식 검증) in apps/api/test/e2e/health.e2e-spec.ts
- [x] T025 [P] [US2] 헥사고날 디렉토리 구조 존재 여부 검증 테스트 작성 in apps/api/test/unit/structure.spec.ts

### Implementation for User Story 2

- [x] T026 [US2] apps/api/ NestJS 프로젝트 초기화 — package.json (@galaxy-board/api), nest-cli.json, tsconfig.json (@galaxy-board/tsconfig/nest.json 확장), tsconfig.build.json in apps/api/
- [x] T027 [US2] apps/api/.swcrc 생성 (decorators + decoratorMetadata 활성화) in apps/api/.swcrc
- [x] T028 [US2] apps/api/jest.config.ts 생성 (@swc/jest 트랜스포머, node 환경) in apps/api/jest.config.ts
- [x] T029 [US2] apps/api/eslint.config.js 생성 (@galaxy-board/eslint-config/nest 사용) in apps/api/eslint.config.js
- [x] T030 [US2] 헥사고날 디렉토리 구조 생성 — src/modules/, src/infrastructure/database/, src/infrastructure/config/, src/infrastructure/health/, src/common/exceptions/, src/common/decorators/, src/common/guards/, test/unit/, test/e2e/ in apps/api/src/
- [x] T031 [US2] src/main.ts 생성 (NestJS 부트스트랩, 포트 3001) in apps/api/src/main.ts
- [x] T032 [US2] src/app.module.ts 생성 (루트 모듈, HealthModule import) in apps/api/src/app.module.ts
- [x] T033 [US2] src/infrastructure/health/health.controller.ts 생성 (GET /health 엔드포인트, contracts/health.md 스펙 준수) in apps/api/src/infrastructure/health/health.controller.ts
- [x] T034 [US2] src/infrastructure/health/health.module.ts 생성 in apps/api/src/infrastructure/health/health.module.ts
- [x] T035 [US2] prisma/schema.prisma 초기화 (generator + datasource 설정만, 모델 없음) in apps/api/prisma/schema.prisma
- [x] T036 [US2] src/infrastructure/database/prisma.service.ts 생성 (PrismaClient 래퍼) in apps/api/src/infrastructure/database/prisma.service.ts
- [x] T037 [US2] T024, T025 테스트 실행하여 통과 확인

**Checkpoint**: 백엔드 서버 실행 후 GET /health가 정상 응답

---

## Phase 5: User Story 3 - 테스트 환경 구성 (Priority: P1)

**Goal**: 프론트엔드/백엔드 모두에서 샘플 테스트가 실행되고 통과

**Independent Test**: 각 프로젝트에서 yarn test 실행 시 샘플 테스트 통과

### Tests for User Story 3 ⚠️

> **NOTE: 이 스토리 자체가 테스트 환경 검증이므로, 샘플 테스트 = 검증 수단**

- [x] T038 [P] [US3] 프론트엔드 샘플 유닛 테스트 작성 (간단한 유틸 함수 테스트) in apps/web/**tests**/sample.test.ts
- [x] T039 [P] [US3] 백엔드 샘플 유닛 테스트 작성 (간단한 서비스 테스트) in apps/api/test/unit/sample.spec.ts

### Implementation for User Story 3

- [x] T040 [US3] 프론트엔드 jest.setup.ts 생성 (@testing-library/jest-dom 설정) in apps/web/jest.setup.ts
- [x] T041 [US3] 루트 package.json에 test 스크립트 추가 (yarn workspaces foreach run test) in package.json
- [x] T042 [US3] T038, T039 테스트 실행하여 통과 확인 (yarn test 루트에서 실행)

**Checkpoint**: 루트에서 yarn test 실행 시 프론트엔드/백엔드 모든 샘플 테스트 통과

---

## Phase 6: User Story 4 - 통합 개발 환경 (Priority: P2)

**Goal**: Docker Compose 또는 루트 스크립트로 전체 서비스 동시 실행

**Independent Test**: docker compose up 실행 후 프론트엔드(3000), 백엔드(3001), DB(5432) 모두 접근 가능

### Tests for User Story 4 ⚠️

- [x] T043 [US4] Docker Compose 서비스 구성 검증 테스트 작성 (docker-compose.yml 파싱하여 services 키 존재 확인) in scripts/validate-docker.sh

### Implementation for User Story 4

- [x] T044 [US4] docker-compose.yml 생성 — postgres (16-alpine, healthcheck), api (Dockerfile.api, depends_on postgres), web (Dockerfile.web, depends_on api) in docker-compose.yml
- [x] T045 [P] [US4] Dockerfile.api 생성 (node:22-alpine, yarn install, dev 모드) in Dockerfile.api
- [x] T046 [P] [US4] Dockerfile.web 생성 (node:22-alpine, yarn install, dev 모드) in Dockerfile.web
- [x] T047 [US4] 루트 package.json에 dev 스크립트 추가 (프론트엔드/백엔드 동시 실행, concurrently 사용) in package.json
- [x] T048 [US4] 루트 package.json에 lint 스크립트 추가 (전체 워크스페이스 린팅) in package.json
- [x] T049 [US4] docker compose up으로 전체 서비스 실행 검증

**Checkpoint**: docker compose up 실행 후 모든 서비스 정상 동작

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 문서화 및 최종 정리

- [x] T050 [P] README.md 작성 (프로젝트 소개, 사전 요구사항, 설치/실행 방법, 프로젝트 구조, 테스트, 린팅 — quickstart.md 기반) in README.md
- [x] T051 [P] 전체 프로젝트 린팅 실행 (yarn lint) 및 오류 수정
- [x] T052 전체 테스트 스위트 실행 (yarn test) 및 통과 확인

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 의존성 없음 — 즉시 시작
- **Foundational (Phase 2)**: Phase 1 완료 필요 — 모든 앱을 블로킹
- **User Story 1 (Phase 3)**: Phase 2 완료 필요
- **User Story 2 (Phase 4)**: Phase 2 완료 필요
- **User Story 3 (Phase 5)**: Phase 3, 4 완료 필요 (테스트 환경은 앱이 있어야 검증 가능)
- **User Story 4 (Phase 6)**: Phase 3, 4 완료 필요 (Docker는 앱이 있어야 컨테이너화 가능)
- **Polish (Phase 7)**: 모든 Phase 완료 필요

### User Story Dependencies

- **US1 (프론트엔드)**: Phase 2 이후 독립 시작 가능
- **US2 (백엔드)**: Phase 2 이후 독립 시작 가능 — US1과 병렬 가능
- **US3 (테스트 환경)**: US1 + US2 완료 후
- **US4 (통합 환경)**: US1 + US2 완료 후

### Within Each User Story

- 테스트 먼저 작성 → 실패 확인 → 구현 → 테스트 통과 (TDD)
- 설정 파일 → 디렉토리 구조 → 코드 → 검증

### Parallel Opportunities

- Phase 1: T003, T004, T005, T006 병렬
- Phase 2: T008, T009 병렬
- Phase 3+4: US1과 US2 전체가 병렬 실행 가능
- Phase 5: T038, T039 병렬
- Phase 6: T045, T046 병렬

---

## Parallel Example: US1 + US2 동시 진행

```bash
# Phase 2 완료 후, 두 스토리를 동시에 시작:

# 개발자 A: US1 (프론트엔드)
Task: T011 - FSD 구조 테스트 작성
Task: T012 - 3D 장면 테스트 작성
Task: T013~T023 - 프론트엔드 구현

# 개발자 B: US2 (백엔드)
Task: T024 - Health 엔드포인트 테스트 작성
Task: T025 - 디렉토리 구조 테스트 작성
Task: T026~T037 - 백엔드 구현
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Phase 1: Setup 완료
2. Phase 2: Foundational 완료
3. Phase 3: US1 (프론트엔드) — 빈 3D 장면 렌더링 확인
4. Phase 4: US2 (백엔드) — Health 엔드포인트 응답 확인
5. **STOP and VALIDATE**: 프론트엔드/백엔드 각각 독립 동작 확인
6. Phase 5: US3 (테스트 환경) — 전체 테스트 통과 확인
7. Phase 6: US4 (Docker 통합) — 전체 서비스 컨테이너 동작 확인
8. Phase 7: Polish — README, 최종 검증

### Incremental Delivery

1. Setup + Foundational → 모노레포 기반 준비
2. US1 → 프론트엔드 독립 동작 (MVP 일부)
3. US2 → 백엔드 독립 동작 (MVP 완성)
4. US3 → TDD 환경 준비
5. US4 → Docker 통합 완성
6. 각 스토리는 독립적으로 가치를 전달

---

## Notes

- [P] 태스크 = 다른 파일, 의존성 없음
- [Story] 라벨은 spec.md의 사용자 스토리에 매핑
- TDD 필수: 테스트 작성 → 실패 확인 → 구현 → 통과
- 태스크 또는 논리적 그룹 완료 후 커밋
- 체크포인트에서 스토리 독립 검증
