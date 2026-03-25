# Tasks: 은하계 게시판

**Input**: Design documents from `/specs/001-galaxy-board/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/rest-api.md

**Tests**: 헌법 VI. TDD (NON-NEGOTIABLE)에 따라 모든 구현 태스크 전에 테스트를 먼저 작성합니다.

**Organization**: 사용자 스토리별로 그룹화하여 독립적 구현/테스트 가능하도록 구성합니다.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 소속 사용자 스토리 (US1, US2, US3, US4)
- 모든 태스크에 정확한 파일 경로 포함

---

## Phase 1: Setup (프로젝트 초기화)

**Purpose**: 데이터베이스 스키마, 공유 타입, 기본 인프라 구성

- [x] T001 Prisma 스키마에 Galaxy, Planet, Star 모델 정의 in apps/api/prisma/schema.prisma
- [x] T002 Prisma 마이그레이션 생성 및 적용 (npx prisma migrate dev --name galaxy-board-init)
- [x] T003 [P] 공유 타입 정의 (Galaxy, Planet, Star, Position, PaginatedResponse) in packages/types/src/index.ts
- [x] T004 [P] 프론트엔드 API 클라이언트 설정 in apps/web/src/shared/api/client.ts
- [x] T005 [P] 프론트엔드 쿼리키 팩토리 정의 in apps/web/src/shared/api/query-keys.ts
- [x] T006 [P] 프론트엔드 TanStack Query Provider 설정 in apps/web/src/app/providers/query-provider.tsx

---

## Phase 2: Foundational (기반 인프라)

**Purpose**: 모든 사용자 스토리에서 필요한 도메인 엔티티, 포트, 리포지토리 구현

**⚠️ CRITICAL**: 이 단계 완료 전에는 사용자 스토리 작업을 시작할 수 없습니다

### 백엔드 도메인 계층 테스트

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현합니다 (Red-Green-Refactor)**

- [x] T007 [P] Galaxy 도메인 엔티티 단위 테스트 작성 in apps/api/test/unit/domain/galaxy.entity.spec.ts
- [x] T008 [P] Planet 도메인 엔티티 단위 테스트 작성 in apps/api/test/unit/domain/planet.entity.spec.ts
- [x] T009 [P] Star 도메인 엔티티 단위 테스트 작성 in apps/api/test/unit/domain/star.entity.spec.ts

### 백엔드 도메인 계층 구현

- [x] T010 [P] Galaxy 도메인 엔티티 구현 in apps/api/src/domain/entities/galaxy.entity.ts
- [x] T011 [P] Planet 도메인 엔티티 구현 in apps/api/src/domain/entities/planet.entity.ts
- [x] T012 [P] Star 도메인 엔티티 구현 in apps/api/src/domain/entities/star.entity.ts
- [x] T013 [P] Galaxy 리포지토리 포트(인터페이스) 정의 in apps/api/src/domain/ports/galaxy-repository.port.ts
- [x] T014 [P] Planet 리포지토리 포트(인터페이스) 정의 in apps/api/src/domain/ports/planet-repository.port.ts
- [x] T015 [P] Star 리포지토리 포트(인터페이스) 정의 in apps/api/src/domain/ports/star-repository.port.ts

### 백엔드 인프라 계층 (Prisma 어댑터)

- [x] T016 [P] Galaxy Prisma 리포지토리 구현 in apps/api/src/infrastructure/database/repositories/galaxy.repository.ts
- [x] T017 [P] Planet Prisma 리포지토리 구현 (커서 기반 페이지네이션 포함) in apps/api/src/infrastructure/database/repositories/planet.repository.ts
- [x] T018 [P] Star Prisma 리포지토리 구현 (원자적 increment + 상한 검증) in apps/api/src/infrastructure/database/repositories/star.repository.ts
- [x] T019 Database 모듈 구성 (포트-어댑터 바인딩) in apps/api/src/infrastructure/database/database.module.ts

### 백엔드 공통 인프라

- [x] T020 [P] 공통 DTO 정의 (PaginationQueryDto, PaginatedResponseDto) in apps/api/src/application/dto/common.dto.ts
- [x] T021 [P] 전역 예외 필터 구현 in apps/api/src/infrastructure/api/filters/http-exception.filter.ts
- [x] T022 [P] 도메인-Prisma 매퍼 (GalaxyMapper, PlanetMapper, StarMapper) in apps/api/src/application/mappers/index.ts

### 프론트엔드 공유 인프라

- [x] T023 [P] Canvas3D 래퍼 컴포넌트 테스트 작성 in apps/web/src/shared/ui/__tests__/Canvas3D.test.tsx
- [x] T024 [P] Canvas3D 래퍼 컴포넌트 구현 (R3F Canvas + OrbitControls + WebGL 감지) in apps/web/src/shared/ui/Canvas3D.tsx
- [x] T025 [P] 드래그/클릭 구분 훅 구현 in apps/web/src/shared/lib/use-click-guard.ts

**Checkpoint**: 기반 인프라 완료 — 사용자 스토리 구현 시작 가능

---

## Phase 3: User Story 1 — 은하계(주제) 탐색 (Priority: P1) 🎯 MVP

**Goal**: 3D 우주 공간에서 은하계들을 탐색하고, 클릭하여 진입하고, 줌아웃으로 복귀할 수 있다

**Independent Test**: 앱 접속 후 3D 공간에서 은하계들을 확인하고, 하나를 클릭하여 진입할 수 있으면 테스트 통과

### 백엔드 테스트 (US1)

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현합니다**

- [x] T026 [P] [US1] GalaxyService 단위 테스트 작성 (findAll, findById) in apps/api/test/unit/application/galaxy.service.spec.ts
- [x] T027 [P] [US1] PlanetService.findByGalaxy 단위 테스트 작성 (커서 페이지네이션) in apps/api/test/unit/application/planet.service.spec.ts
- [x] T028 [P] [US1] GET /api/galaxies e2e 테스트 작성 in apps/api/test/e2e/galaxies.e2e-spec.ts
- [x] T029 [P] [US1] GET /api/galaxies/:galaxyId/planets e2e 테스트 작성 in apps/api/test/e2e/planets.e2e-spec.ts

### 백엔드 구현 (US1)

- [x] T030 [P] [US1] Galaxy DTO 정의 (GalaxyResponseDto, GalaxyListResponseDto) in apps/api/src/application/dto/galaxy.dto.ts
- [x] T031 [P] [US1] Planet DTO 정의 (PlanetSummaryDto, PlanetListResponseDto) in apps/api/src/application/dto/planet.dto.ts
- [x] T032 [US1] GalaxyService 구현 (findAll, findById) in apps/api/src/application/services/galaxy.service.ts
- [x] T033 [US1] PlanetService 구현 (findByGalaxy — 커서 기반 페이지네이션) in apps/api/src/application/services/planet.service.ts
- [x] T034 [US1] GalaxyController 구현 (GET /api/galaxies, GET /api/galaxies/:id) in apps/api/src/infrastructure/api/controllers/galaxy.controller.ts
- [x] T035 [US1] PlanetController 구현 (GET /api/galaxies/:galaxyId/planets) in apps/api/src/infrastructure/api/controllers/planet.controller.ts
- [x] T036 [US1] Galaxy 모듈 구성 (GalaxyModule) in apps/api/src/galaxy.module.ts
- [x] T037 [US1] Planet 모듈 구성 (PlanetModule) in apps/api/src/planet.module.ts
- [x] T038 [US1] AppModule에 Galaxy, Planet 모듈 등록 in apps/api/src/app.module.ts

### 프론트엔드 테스트 (US1)

- [x] T039 [P] [US1] Galaxy 엔티티 모델/스토어 테스트 작성 in apps/web/src/entities/galaxy/model/__tests__/store.test.ts
- [x] T040 [P] [US1] Galaxy API 훅 테스트 작성 in apps/web/src/entities/galaxy/api/__tests__/hooks.test.ts

### 프론트엔드 구현 (US1)

- [x] T041 [P] [US1] Galaxy 엔티티 모델 (타입 + Zustand 스토어) in apps/web/src/entities/galaxy/model/index.ts
- [x] T042 [P] [US1] Galaxy API 훅 (useGalaxies, useGalaxy) in apps/web/src/entities/galaxy/api/hooks.ts
- [x] T043 [US1] Galaxy3D 컴포넌트 구현 (은하계 3D 메시 + 이름 라벨) in apps/web/src/entities/galaxy/ui/Galaxy3D.tsx
- [x] T044 [US1] Planet 엔티티 모델 (타입 + Zustand 스토어) in apps/web/src/entities/planet/model/index.ts
- [x] T045 [US1] Planet API 훅 (usePlanets — 커서 페이지네이션) in apps/web/src/entities/planet/api/hooks.ts
- [x] T046 [US1] Planet3D 컴포넌트 구현 (행성 3D 메시) in apps/web/src/entities/planet/ui/Planet3D.tsx
- [x] T047 [US1] navigate-galaxy 기능 구현 (카메라 전환 훅 — lerp 줌인/줌아웃) in apps/web/src/features/navigate-galaxy/model/use-camera-transition.ts
- [x] T048 [US1] navigate-galaxy UI 구현 (뒤로가기 버튼) in apps/web/src/features/navigate-galaxy/ui/BackButton.tsx
- [x] T049 [US1] galaxy-scene 위젯 구현 (Canvas3D + Galaxy3D + Planet3D + 카메라 전환 조합) in apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx
- [x] T050 [US1] home 뷰 구현 (GalaxyScene 위젯 배치) in apps/web/src/views/home/ui/HomePage.tsx
- [x] T051 [US1] Next.js App Router 페이지 연결 in apps/web/src/app/page.tsx

**Checkpoint**: US1 완료 — 3D 우주 공간에서 은하계 탐색, 진입, 복귀 가능

---

## Phase 4: User Story 2 — 행성(게시글) 작성 및 조회 (Priority: P1)

**Goal**: 은하계 내부에서 게시글을 작성하고, 행성을 클릭하여 마크다운 게시글을 조회할 수 있다

**Independent Test**: 은하계에 진입 후 게시글을 작성하고, 생성된 행성을 클릭하여 내용을 확인할 수 있으면 테스트 통과

### 백엔드 테스트 (US2)

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현합니다**

- [ ] T052 [P] [US2] PlanetService.create 단위 테스트 작성 in apps/api/test/unit/application/planet.service.spec.ts (기존 파일에 추가)
- [ ] T053 [P] [US2] PlanetService.findById 단위 테스트 작성 in apps/api/test/unit/application/planet.service.spec.ts (기존 파일에 추가)
- [ ] T054 [P] [US2] POST /api/galaxies/:galaxyId/planets e2e 테스트 작성 in apps/api/test/e2e/planets.e2e-spec.ts (기존 파일에 추가)
- [ ] T055 [P] [US2] GET /api/planets/:id e2e 테스트 작성 in apps/api/test/e2e/planets.e2e-spec.ts (기존 파일에 추가)

### 백엔드 구현 (US2)

- [ ] T056 [US2] CreatePlanetDto, PlanetDetailResponseDto 정의 in apps/api/src/application/dto/planet.dto.ts (기존 파일에 추가)
- [ ] T057 [US2] PlanetService에 create, findById 메서드 추가 (좌표 자동 배정 포함) in apps/api/src/application/services/planet.service.ts
- [ ] T058 [US2] PlanetController에 POST, GET /:id 엔드포인트 추가 in apps/api/src/infrastructure/api/controllers/planet.controller.ts

### 프론트엔드 테스트 (US2)

- [ ] T059 [P] [US2] create-post 기능 테스트 작성 (폼 제출, 유효성 검증) in apps/web/src/features/create-post/__tests__/CreatePostForm.test.tsx
- [ ] T060 [P] [US2] post-overlay 위젯 테스트 작성 (게시글 표시, 마크다운 렌더링) in apps/web/src/widgets/post-overlay/__tests__/PostOverlay.test.tsx

### 프론트엔드 구현 (US2)

- [ ] T061 [US2] Planet 상세 조회 API 훅 (usePlanet) in apps/web/src/entities/planet/api/hooks.ts (기존 파일에 추가)
- [ ] T062 [US2] Planet 생성 API 뮤테이션 훅 (useCreatePlanet) in apps/web/src/entities/planet/api/hooks.ts (기존 파일에 추가)
- [ ] T063 [US2] create-post 폼 스키마 (zod) 정의 in apps/web/src/features/create-post/model/schema.ts
- [ ] T064 [US2] CreatePostForm 컴포넌트 구현 (react-hook-form + zod + shadcn) in apps/web/src/features/create-post/ui/CreatePostForm.tsx
- [ ] T065 [US2] post-overlay 위젯 구현 (반투명 오버레이 패널 + 마크다운 렌더링) in apps/web/src/widgets/post-overlay/ui/PostOverlay.tsx
- [ ] T066 [US2] GalaxyScene에 행성 클릭→조회, 게시글 작성 버튼 통합 in apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx (기존 파일 수정)

**Checkpoint**: US2 완료 — 게시글 작성, 조회, 마크다운 렌더링, 오버레이 닫기 가능

---

## Phase 5: User Story 3 — 별(좋아요) 부여 및 시각적 표현 (Priority: P1)

**Goal**: 게시글에 별을 부여하면 행성 주위에 회전하는 별 오브젝트가 표시되고, 별이 많을수록 화려하게 보인다

**Independent Test**: 게시글에 별을 부여한 뒤, 행성 주위에 별 오브젝트가 회전하며 표시되는지 확인하면 테스트 통과

### 백엔드 테스트 (US3)

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현합니다**

- [ ] T067 [P] [US3] StarService 단위 테스트 작성 (create, 상한 검증, 원자적 증가) in apps/api/test/unit/application/star.service.spec.ts
- [ ] T068 [P] [US3] POST /api/planets/:planetId/stars e2e 테스트 작성 (정상, 상한 도달, 404) in apps/api/test/e2e/stars.e2e-spec.ts

### 백엔드 구현 (US3)

- [ ] T069 [US3] Star DTO 정의 (CreateStarDto, StarResponseDto) in apps/api/src/application/dto/star.dto.ts
- [ ] T070 [US3] StarService 구현 (create — 트랜잭션: Star 생성 + starCount 원자적 increment + 상한 100 검증) in apps/api/src/application/services/star.service.ts
- [ ] T071 [US3] StarController 구현 (POST /api/planets/:planetId/stars) in apps/api/src/infrastructure/api/controllers/star.controller.ts
- [ ] T072 [US3] Star 모듈 구성 (StarModule) + AppModule 등록 in apps/api/src/star.module.ts

### 프론트엔드 테스트 (US3)

- [ ] T073 [P] [US3] give-star 기능 테스트 작성 (별 부여 버튼, 상한 메시지) in apps/web/src/features/give-star/__tests__/GiveStarButton.test.tsx

### 프론트엔드 구현 (US3)

- [ ] T074 [US3] Star 엔티티 모델 (타입) in apps/web/src/entities/star/model/index.ts
- [ ] T075 [US3] Star API 뮤테이션 훅 (useGiveStar) in apps/web/src/entities/star/api/hooks.ts
- [ ] T076 [US3] Star3D 컴포넌트 구현 (InstancedMesh — 행성 주위 회전 별 렌더링) in apps/web/src/entities/star/ui/Star3D.tsx
- [ ] T077 [US3] 별 수에 따른 시각 효과 구현 (발광 강도, 색상 변화) in apps/web/src/entities/planet/ui/Planet3D.tsx (기존 파일 수정)
- [ ] T078 [US3] GiveStarButton 컴포넌트 구현 (별 부여 + 상한 안내) in apps/web/src/features/give-star/ui/GiveStarButton.tsx
- [ ] T079 [US3] PostOverlay에 별 부여 버튼 통합 in apps/web/src/widgets/post-overlay/ui/PostOverlay.tsx (기존 파일 수정)
- [ ] T080 [US3] GalaxyScene에 Star3D 렌더링 통합 (각 행성 주위 별 표시) in apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx (기존 파일 수정)

**Checkpoint**: US3 완료 — 별 부여, 회전 별 오브젝트, 화려한 시각 효과 동작

---

## Phase 6: User Story 4 — 은하계(주제) 생성 (Priority: P2)

**Goal**: 사용자가 새 은하계(주제/게시판)를 생성하면 우주 공간에 나타나고 진입할 수 있다

**Independent Test**: 은하계 생성 후 우주 공간에 새 은하계가 표시되고 진입 가능하면 테스트 통과

### 백엔드 테스트 (US4)

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현합니다**

- [ ] T081 [P] [US4] GalaxyService.create 단위 테스트 작성 (생성, 중복 이름 검증) in apps/api/test/unit/application/galaxy.service.spec.ts (기존 파일에 추가)
- [ ] T082 [P] [US4] POST /api/galaxies e2e 테스트 작성 (정상, 중복 409) in apps/api/test/e2e/galaxies.e2e-spec.ts (기존 파일에 추가)

### 백엔드 구현 (US4)

- [ ] T083 [US4] CreateGalaxyDto 정의 in apps/api/src/application/dto/galaxy.dto.ts (기존 파일에 추가)
- [ ] T084 [US4] GalaxyService에 create 메서드 추가 (좌표 자동 배정 + 중복 이름 검증) in apps/api/src/application/services/galaxy.service.ts
- [ ] T085 [US4] GalaxyController에 POST /api/galaxies 엔드포인트 추가 in apps/api/src/infrastructure/api/controllers/galaxy.controller.ts

### 프론트엔드 테스트 (US4)

- [ ] T086 [P] [US4] create-galaxy 기능 테스트 작성 (폼 제출, 유효성 검증) in apps/web/src/features/create-galaxy/__tests__/CreateGalaxyForm.test.tsx

### 프론트엔드 구현 (US4)

- [ ] T087 [US4] Galaxy 생성 API 뮤테이션 훅 (useCreateGalaxy) in apps/web/src/entities/galaxy/api/hooks.ts (기존 파일에 추가)
- [ ] T088 [US4] create-galaxy 폼 스키마 (zod) 정의 in apps/web/src/features/create-galaxy/model/schema.ts
- [ ] T089 [US4] CreateGalaxyForm 컴포넌트 구현 (react-hook-form + zod + shadcn) in apps/web/src/features/create-galaxy/ui/CreateGalaxyForm.tsx
- [ ] T090 [US4] GalaxyScene에 은하계 생성 버튼 + 폼 통합 in apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx (기존 파일 수정)

**Checkpoint**: US4 완료 — 은하계 생성, 우주 공간에 표시, 진입 가능

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 전체 스토리에 걸친 품질 개선

- [ ] T091 [P] 페이지네이션 UI 구현 (은하계 내 페이지 전환 버튼 + 3D 애니메이션) in apps/web/src/features/navigate-galaxy/ui/PaginationControls.tsx
- [ ] T092 [P] WebGL 미지원 브라우저 폴백 메시지 구현 in apps/web/src/shared/ui/WebGLFallback.tsx
- [ ] T093 [P] 시드 데이터 스크립트 작성 (기본 은하계 3~5개) in apps/api/prisma/seed.ts
- [ ] T094 quickstart.md 검증 (전체 개발 환경 설정 → 실행 → 테스트 흐름 확인)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 의존성 없음 — 즉시 시작
- **Phase 2 (Foundational)**: Phase 1 완료 후 시작 — **모든 사용자 스토리를 차단**
- **Phase 3 (US1)**: Phase 2 완료 후 시작
- **Phase 4 (US2)**: Phase 3 (US1) 완료 후 시작 (은하계 탐색 UI가 필요)
- **Phase 5 (US3)**: Phase 4 (US2) 완료 후 시작 (게시글 조회 오버레이가 필요)
- **Phase 6 (US4)**: Phase 3 (US1) 완료 후 시작 가능 (US2/US3과 독립적)
- **Phase 7 (Polish)**: 최소 US1~US3 완료 후 시작

### User Story Dependencies

- **US1 (은하계 탐색)**: Foundational 이후 즉시 시작 — 다른 스토리 의존 없음
- **US2 (게시글 작성/조회)**: US1 이후 (은하계 진입 UI 필요)
- **US3 (별 부여)**: US2 이후 (게시글 조회 오버레이 필요)
- **US4 (은하계 생성)**: US1 이후 (우주 공간 뷰 필요), US2/US3과 병렬 가능

### Within Each User Story

1. 테스트 작성 → 테스트 실패 확인 (Red)
2. 도메인/모델 구현 (Green)
3. 서비스 구현
4. 컨트롤러/UI 구현
5. 통합 및 리팩토링 (Refactor)

### Parallel Opportunities

**Phase 2 내부**:
- T007, T008, T009 (도메인 테스트) 병렬
- T010~T015 (도메인 엔티티 + 포트) 병렬
- T016~T018 (리포지토리) 병렬
- T020~T022 (공통 인프라) 병렬
- T023~T025 (프론트엔드 공유) 병렬

**US1 내부**:
- T026~T029 (백엔드 테스트) 병렬
- T039, T040 (프론트엔드 테스트) 병렬
- T030, T031 (DTO) 병렬

**US4는 US2/US3과 병렬 가능** (서로 독립적)

---

## Parallel Example: User Story 1

```bash
# 백엔드 테스트 병렬 실행:
Task: "GalaxyService 단위 테스트 작성 in apps/api/test/unit/application/galaxy.service.spec.ts"
Task: "PlanetService.findByGalaxy 단위 테스트 작성 in apps/api/test/unit/application/planet.service.spec.ts"
Task: "GET /api/galaxies e2e 테스트 작성 in apps/api/test/e2e/galaxies.e2e-spec.ts"
Task: "GET /api/galaxies/:galaxyId/planets e2e 테스트 작성 in apps/api/test/e2e/planets.e2e-spec.ts"

# 프론트엔드 테스트 병렬 실행:
Task: "Galaxy 엔티티 모델/스토어 테스트 작성 in apps/web/src/entities/galaxy/model/__tests__/store.test.ts"
Task: "Galaxy API 훅 테스트 작성 in apps/web/src/entities/galaxy/api/__tests__/hooks.test.ts"

# DTO 병렬 실행:
Task: "Galaxy DTO 정의 in apps/api/src/application/dto/galaxy.dto.ts"
Task: "Planet DTO 정의 in apps/api/src/application/dto/planet.dto.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 완료: Setup (Prisma 스키마, 공유 타입)
2. Phase 2 완료: Foundational (도메인, 리포지토리, 공통 인프라)
3. Phase 3 완료: US1 (은하계 탐색)
4. **STOP and VALIDATE**: 3D 우주 공간에서 은하계 탐색/진입/복귀 독립 테스트
5. 시드 데이터로 데모 가능

### Incremental Delivery

1. Setup + Foundational → 기반 완료
2. US1 (은하계 탐색) → 독립 테스트 → **MVP!**
3. US2 (게시글 작성/조회) → 독립 테스트 → 게시판 기본 기능 완성
4. US3 (별 부여) → 독립 테스트 → 핵심 차별화 기능 완성
5. US4 (은하계 생성) → 독립 테스트 → 사용자 콘텐츠 확장 가능
6. Polish → 페이지네이션 UI, WebGL 폴백, 시드 데이터

### Parallel Team Strategy

2명 기준:
1. 함께: Phase 1 + Phase 2 완료
2. 이후:
   - 개발자 A: US1 → US2 → US3 (순차)
   - 개발자 B: (US1 완료 대기) → US4 → Polish

---

## Notes

- [P] 태스크 = 다른 파일, 의존성 없음 → 병렬 실행 가능
- [Story] 라벨 = 특정 사용자 스토리에 매핑 (추적용)
- 모든 구현 전에 반드시 테스트 먼저 작성 (헌법 VI. TDD)
- 커밋은 각 태스크 또는 논리적 그룹 단위로 수행
- 체크포인트에서 멈추고 스토리 독립 검증 가능
- 코드 주석은 한글로 작성 (헌법 개발 워크플로우)
