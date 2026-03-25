# Tasks: 행성 커스터마이징

**Input**: Design documents from `/specs/002-planet-customization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/rest-api.md

**Tests**: 헌법 VI. TDD (NON-NEGOTIABLE)에 따라 모든 구현 태스크 전에 테스트를 먼저 작성합니다.

**Organization**: 사용자 스토리별로 그룹화하여 독립적 구현/테스트 가능하도록 구성합니다.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 소속 사용자 스토리 (US1, US2, US3)
- 모든 태스크에 정확한 파일 경로 포함

---

## Phase 1: Setup (DB 스키마 + 공유 타입 + 의존성)

**Purpose**: Planet 테이블 외형 컬럼 추가, 공유 타입 정의, 프론트엔드 의존성 설치

- [x] T001 Prisma 스키마에 Planet 모델 외형 컬럼 추가 (mainColor, subColor, size, shape, pattern, hasRing) in apps/api/prisma/schema.prisma
- [x] T002 Prisma 마이그레이션 생성 및 적용 (npx prisma migrate dev --name planet-customization)
- [x] T003 [P] 공유 타입에 PlanetSize, PlanetShape, SurfacePattern, PlanetAppearance 타입 추가 in packages/types/src/index.ts
- [x] T004 [P] react-colorful 의존성 설치 (yarn workspace apps/web add react-colorful)

---

## Phase 2: Foundational (백엔드 도메인/인프라 수정)

**Purpose**: 기존 백엔드 레이어에 외형 필드를 관통시키는 수정. 모든 사용자 스토리의 전제 조건.

**⚠️ CRITICAL**: 이 단계 완료 전에는 사용자 스토리 작업을 시작할 수 없습니다

### 백엔드 테스트 (외형 필드 추가)

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현합니다 (Red-Green-Refactor)**

- [x] T005 [P] Planet 도메인 엔티티 외형 유효성 검증 테스트 추가 (HEX 형식, enum 값) in apps/api/test/unit/domain/planet.entity.spec.ts
- [x] T006 [P] PlanetService 외형 포함 생성/조회 단위 테스트 추가 in apps/api/test/unit/application/planet.service.spec.ts
- [x] T007 [P] POST /api/galaxies/:galaxyId/planets 외형 필드 포함 e2e 테스트 추가 in apps/api/test/e2e/planets.e2e-spec.ts
- [x] T008 [P] GET /api/planets/:id 외형 필드 응답 e2e 테스트 추가 in apps/api/test/e2e/planets.e2e-spec.ts

### 백엔드 구현 (외형 필드 추가)

- [x] T009 [P] Planet 도메인 엔티티에 외형 속성 + 유효성 검증 추가 in apps/api/src/domain/entities/planet.entity.ts
- [x] T010 [P] CreatePlanetDto에 외형 필드 + 유효성 데코레이터 추가 in apps/api/src/application/dto/planet.dto.ts
- [x] T011 [P] PlanetSummaryDto, PlanetDetailResponseDto에 외형 필드 추가 in apps/api/src/application/dto/planet.dto.ts
- [x] T012 PlanetMapper에 외형 필드 매핑 추가 in apps/api/src/application/mappers/index.ts
- [x] T013 PlanetService의 create, findById, findByGalaxy에 외형 필드 처리 추가 in apps/api/src/application/services/planet.service.ts
- [x] T014 PlanetRepository의 select에 외형 필드 추가 in apps/api/src/infrastructure/database/repositories/planet.repository.ts

### 프론트엔드 공유 인프라

- [x] T015 [P] Simplex Noise GLSL 함수 모듈 작성 in apps/web/src/shared/lib/shaders/noise.ts
- [x] T016 [P] 절차적 패턴 ShaderMaterial 팩토리 작성 (SMOOTH, CRATER, STRIPE, CLOUD) in apps/web/src/shared/lib/shaders/planet-material.ts

**Checkpoint**: 기반 완료 — 외형 포함 행성 생성/조회 API 동작, 셰이더 인프라 준비

---

## Phase 3: User Story 1 — 행성 외형 커스터마이징 (Priority: P1) 🎯 MVP

**Goal**: 게시글 작성 시 행성의 색상, 크기, 형태, 패턴, 고리를 직접 설정하고 저장할 수 있다

**Independent Test**: 게시글 작성 화면에서 행성 외형 옵션을 변경하고, 미리보기에 반영되는지 확인 후 저장하면 테스트 통과

### 프론트엔드 테스트 (US1)

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현합니다**

- [x] T017 [P] [US1] CustomizePanel 컴포넌트 테스트 작성 (옵션 변경, 콜백 호출) in apps/web/src/features/customize-planet/__tests__/CustomizePanel.test.tsx
- [x] T018 [P] [US1] Planet3D 컴포넌트 외형 반영 테스트 추가 (형태, 색상, 고리) in apps/web/src/entities/planet/ui/__tests__/Planet3D.test.tsx

### 프론트엔드 구현 (US1)

- [x] T019 [P] [US1] 행성 외형 zod 스키마 정의 in apps/web/src/features/customize-planet/model/schema.ts
- [x] T020 [P] [US1] ColorPicker 컴포넌트 구현 (react-colorful + shadcn Popover) in apps/web/src/features/customize-planet/ui/ColorPicker.tsx
- [x] T021 [US1] CustomizePanel 컴포넌트 구현 (색상 피커 × 2, 형태 8종, 크기 3종, 패턴 4종, 고리 토글) in apps/web/src/features/customize-planet/ui/CustomizePanel.tsx
- [x] T022 [US1] Planet3D 컴포넌트 수정 — 외형 속성으로 렌더링 (형태별 지오메트리, 셰이더 패턴, 고리) in apps/web/src/entities/planet/ui/Planet3D.tsx
- [x] T023 [US1] CreatePostForm에 CustomizePanel 통합 + 외형 데이터 제출 in apps/web/src/features/create-post/ui/CreatePostForm.tsx
- [x] T024 [US1] create-post 폼 스키마에 외형 필드 추가 in apps/web/src/features/create-post/model/schema.ts

**Checkpoint**: US1 완료 — 행성 외형 커스터마이징 + 저장 + 은하계 내 커스텀 렌더링 동작

---

## Phase 4: User Story 2 — 랜덤 행성 생성 (Priority: P1)

**Goal**: 랜덤 버튼으로 모든 외형 옵션을 무작위 생성, 반복 클릭 시 매번 다른 결과

**Independent Test**: 랜덤 버튼을 누르면 행성 외형이 무작위로 설정되고, 반복 클릭 시 매번 다른 결과가 나오면 테스트 통과

### 프론트엔드 테스트 (US2)

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현합니다**

- [x] T025 [P] [US2] 랜덤 외형 생성 로직 단위 테스트 작성 (모든 필드 랜덤, 연속 호출 시 다른 값) in apps/web/src/features/customize-planet/__tests__/random.test.ts

### 프론트엔드 구현 (US2)

- [x] T026 [US2] 랜덤 외형 생성 함수 구현 (generateRandomAppearance) in apps/web/src/features/customize-planet/model/random.ts
- [x] T027 [US2] CustomizePanel에 랜덤 버튼 추가 + 랜덤 후 수동 수정 지원 in apps/web/src/features/customize-planet/ui/CustomizePanel.tsx (기존 파일 수정)

**Checkpoint**: US2 완료 — 랜덤 생성, 반복 클릭 시 다른 결과, 랜덤 후 개별 수정 가능

---

## Phase 5: User Story 3 — 행성 외형 미리보기 (Priority: P1)

**Goal**: 커스터마이징 옵션 변경 시 3D 미리보기에서 실시간 반영, 드래그로 다양한 각도 확인

**Independent Test**: 옵션 변경 시 미리보기가 실시간 반영되고, 행성이 회전하여 전체 모습을 볼 수 있으면 테스트 통과

### 프론트엔드 테스트 (US3)

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현합니다**

- [x] T028 [P] [US3] PlanetPreview3D 컴포넌트 테스트 작성 (props 변경 시 리렌더, 회전 동작) in apps/web/src/entities/planet/ui/__tests__/PlanetPreview3D.test.tsx

### 프론트엔드 구현 (US3)

- [x] T029 [US3] PlanetPreview3D 컴포넌트 구현 (Canvas3D + 단일 행성 + 자동 회전 + OrbitControls) in apps/web/src/entities/planet/ui/PlanetPreview3D.tsx
- [x] T030 [US3] CreatePostForm에 PlanetPreview3D 미리보기 영역 통합 in apps/web/src/features/create-post/ui/CreatePostForm.tsx (기존 파일 수정)

**Checkpoint**: US3 완료 — 실시간 미리보기, 드래그 회전, 모든 옵션 즉시 반영

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 전체 스토리에 걸친 품질 개선

- [x] T031 [P] 시드 데이터 업데이트 — 기존 행성에 다양한 외형 적용 in apps/api/prisma/seed.ts
- [x] T032 [P] 기본 외형 미설정 시 기본값 적용 검증 (엣지 케이스) in apps/web/src/features/customize-planet/ui/CustomizePanel.tsx
- [x] T033 quickstart.md 검증 (전체 개발 환경 설정 → 실행 → 테스트 흐름 확인)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 의존성 없음 — 즉시 시작
- **Phase 2 (Foundational)**: Phase 1 완료 후 시작 — **모든 사용자 스토리를 차단**
- **Phase 3 (US1)**: Phase 2 완료 후 시작
- **Phase 4 (US2)**: Phase 3 (US1) 완료 후 시작 (CustomizePanel이 필요)
- **Phase 5 (US3)**: Phase 3 (US1) 완료 후 시작 가능 (US2와 독립적)
- **Phase 6 (Polish)**: 최소 US1~US3 완료 후 시작

### User Story Dependencies

- **US1 (커스터마이징)**: Foundational 이후 즉시 시작 — 다른 스토리 의존 없음
- **US2 (랜덤 생성)**: US1 이후 (CustomizePanel이 필요)
- **US3 (미리보기)**: US1 이후 (Planet3D 외형 렌더링이 필요), US2와 병렬 가능

### Within Each User Story

1. 테스트 작성 → 테스트 실패 확인 (Red)
2. 모델/스키마 구현 (Green)
3. 컴포넌트 구현
4. 통합 및 리팩토링 (Refactor)

### Parallel Opportunities

**Phase 2 내부**:
- T005, T006, T007, T008 (백엔드 테스트) 병렬
- T009, T010, T011 (도메인 + DTO) 병렬
- T015, T016 (셰이더 인프라) 병렬

**US1 내부**:
- T017, T018 (프론트엔드 테스트) 병렬
- T019, T020 (스키마 + 컬러 피커) 병렬

**US2와 US3 병렬 가능** (서로 독립적, US1만 선행 필요)

---

## Parallel Example: User Story 1

```bash
# 프론트엔드 테스트 병렬 실행:
Task: "CustomizePanel 컴포넌트 테스트 작성 in apps/web/src/features/customize-planet/__tests__/CustomizePanel.test.tsx"
Task: "Planet3D 컴포넌트 외형 반영 테스트 추가 in apps/web/src/entities/planet/ui/__tests__/Planet3D.test.tsx"

# 독립 컴포넌트 병렬 실행:
Task: "행성 외형 zod 스키마 정의 in apps/web/src/features/customize-planet/model/schema.ts"
Task: "ColorPicker 컴포넌트 구현 in apps/web/src/features/customize-planet/ui/ColorPicker.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 완료: Setup (DB 마이그레이션, 공유 타입)
2. Phase 2 완료: Foundational (백엔드 외형 관통, 셰이더 인프라)
3. Phase 3 완료: US1 (커스터마이징 패널 + Planet3D 수정)
4. **STOP and VALIDATE**: 행성 외형 설정 → 저장 → 렌더링 독립 테스트
5. 기본 커스터마이징 기능으로 데모 가능

### Incremental Delivery

1. Setup + Foundational → 기반 완료
2. US1 (커스터마이징) → 독립 테스트 → **MVP!**
3. US2 (랜덤 생성) → 독립 테스트 → 빠른 행성 생성 가능
4. US3 (미리보기) → 독립 테스트 → 완전한 사용자 경험
5. Polish → 시드 데이터, 엣지 케이스, quickstart 검증

### Parallel Team Strategy

2명 기준:
1. 함께: Phase 1 + Phase 2 완료
2. 이후:
   - 개발자 A: US1 → US2 (순차)
   - 개발자 B: (US1 완료 대기) → US3 → Polish

---

## Notes

- [P] 태스크 = 다른 파일, 의존성 없음 → 병렬 실행 가능
- [Story] 라벨 = 특정 사용자 스토리에 매핑 (추적용)
- 모든 구현 전에 반드시 테스트 먼저 작성 (헌법 VI. TDD)
- 커밋은 각 태스크 또는 논리적 그룹 단위로 수행
- 체크포인트에서 멈추고 스토리 독립 검증 가능
- 코드 주석은 한글로 작성 (헌법 개발 워크플로우)
- 기존 001-galaxy-board 코드를 수정하는 태스크가 많으므로 기존 테스트 깨지지 않도록 주의
