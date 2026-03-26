# Tasks: 회원 전용 서비스 전환

**Input**: Design documents from `/specs/006-auth-required/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Constitution에 TDD(NON-NEGOTIABLE) 원칙이 명시되어 있으므로 모든 구현 태스크에 테스트를 포함합니다.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: DB 스키마 변경 및 마이그레이션

- [x] T001 Star 모델에 `@@unique([giverId, planetId])` 제약 추가 in `apps/api/prisma/schema.prisma`
- [x] T002 Prisma 마이그레이션 생성 및 적용 (`npx prisma migrate dev --name auth-required-unique-star`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 User Story에서 공유하는 DTO/엔티티 변경

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] `CreatePlanetDto`에서 `authorNickname` 필수 입력 제거 in `apps/api/src/application/dto/planet.dto.ts` — 서버에서 User.name 자동 설정으로 전환
- [x] T004 [P] `CreateStarDto`에서 `giverNickname` 필수 입력 제거 in `apps/api/src/application/dto/star.dto.ts` — 서버에서 User.name 자동 설정으로 전환
- [x] T005 [P] `PlanetSummaryDto`/`PlanetDetailResponseDto`에 `authorName` 필드 추가 in `apps/api/src/application/dto/planet.dto.ts`
- [x] T006 [P] `StarResponseDto`에 `alreadyGiven` 필드 추가 in `apps/api/src/application/dto/star.dto.ts`

**Checkpoint**: DTO 변경 완료 — User Story 구현 가능

---

## Phase 3: User Story 1 — 비로그인 사용자 접근 차단 (Priority: P1) 🎯 MVP

**Goal**: 모든 쓰기 작업(게시글 작성, 별주기)에서 `OptionalClerkAuthGuard`를 `ClerkAuthGuard`로 교체하여 비인증 요청을 차단한다.

**Independent Test**: 비로그인 상태에서 POST /api/galaxies/:id/planets, POST /api/planets/:id/stars 호출 시 401 반환 확인

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] PlanetController 인증 필수 테스트 작성 in `apps/api/src/infrastructure/api/controllers/__tests__/planet.controller.spec.ts` — 인증 없이 POST 요청 시 401 반환 검증
- [x] T008 [P] [US1] StarController 인증 필수 테스트 작성 in `apps/api/src/infrastructure/api/controllers/__tests__/star.controller.spec.ts` — 인증 없이 POST 요청 시 401 반환 검증

### Implementation for User Story 1

- [x] T009 [P] [US1] PlanetController의 create 메서드에서 `OptionalClerkAuthGuard` → `ClerkAuthGuard`로 교체, `clerkId` 파라미터를 필수로 변경 in `apps/api/src/infrastructure/api/controllers/planet.controller.ts`
- [x] T010 [P] [US1] StarController의 create 메서드에서 `OptionalClerkAuthGuard` → `ClerkAuthGuard`로 교체, `clerkId` 파라미터를 필수로 변경 in `apps/api/src/infrastructure/api/controllers/star.controller.ts`
- [x] T011 [US1] E2E 테스트 업데이트 — 인증 없는 POST 요청이 401을 반환하도록 검증 in `apps/api/test/e2e/planets.e2e-spec.ts`, `apps/api/test/e2e/stars.e2e-spec.ts`

**Checkpoint**: 비로그인 사용자의 모든 쓰기 API 호출이 401로 차단됨

---

## Phase 4: User Story 2 — 닉네임 입력 제거 및 사용자 정보 자동 연결 (Priority: P1)

**Goal**: 닉네임 입력 필드를 제거하고 로그인 사용자의 이름을 자동 연결한다. 별주기는 1클릭으로 전환하고 행성당 1인 1별 중복 제한을 추가한다.

**Independent Test**: 로그인 사용자가 닉네임 입력 없이 게시글 작성/별주기를 완료하고, 동일 행성에 중복 별주기 시 409 반환 확인

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T012 [P] [US2] PlanetService 테스트 — clerkId로 User 조회 후 authorNickname에 User.name 자동 설정 검증 in `apps/api/src/application/services/__tests__/planet.service.spec.ts`
- [x] T013 [P] [US2] StarService 테스트 — clerkId로 User 조회 후 giverNickname에 User.name 자동 설정, 중복 별주기 시 409 반환 검증 in `apps/api/src/application/services/__tests__/star.service.spec.ts`
- [x] T014 [P] [US2] 프론트엔드 create-post 스키마 테스트 — authorNickname 없이 유효성 검증 통과 확인 in `apps/web/src/features/create-post/model/__tests__/schema.test.ts`

### Implementation for User Story 2

- [x] T015 [US2] PlanetService.create에서 clerkId로 User 조회, `authorNickname`에 User.name 자동 설정, `authorId` 필수 연결 in `apps/api/src/application/services/planet.service.ts`
- [x] T016 [US2] Planet 매퍼에서 `authorName` 필드 매핑 추가 (authorId가 있으면 User.name, 없으면 null) in `apps/api/src/application/mappers/index.ts`
- [x] T017 [US2] StarService.create에서 clerkId로 User 조회, `giverNickname`에 User.name 자동 설정, `giverId` 필수 연결 in `apps/api/src/application/services/star.service.ts`
- [x] T018 [US2] StarService/Repository에 중복 별주기 검증 추가 — 동일 giverId+planetId 존재 시 409 ConflictException in `apps/api/src/application/services/star.service.ts`, `apps/api/src/infrastructure/database/repositories/star.repository.ts`
- [x] T019 [P] [US2] 프론트엔드 create-post 스키마에서 `authorNickname` 제거 in `apps/web/src/features/create-post/model/schema.ts`
- [x] T020 [P] [US2] 프론트엔드 게시글 작성 폼 UI에서 닉네임 입력 필드 제거 in `apps/web/src/features/create-post/ui/`
- [x] T021 [US2] GiveStarButton에서 닉네임 입력 제거, 1클릭 별주기로 전환, 중복 별주기 시 비활성화 표시 in `apps/web/src/features/give-star/ui/GiveStarButton.tsx`
- [x] T022 [US2] 프론트엔드 Star API 호출에서 body의 `giverNickname` 제거 in `apps/web/src/entities/star/`

**Checkpoint**: 닉네임 입력 없이 게시글 작성/별주기 완료, 중복 별주기 차단

---

## Phase 5: User Story 3 — 비로그인 사용자 열람 허용 UX (Priority: P2)

**Goal**: 비로그인 사용자에게 3D 공간 탐색과 게시글 열람은 허용하되, 쓰기 관련 UI를 비활성화하고 로그인 유도 메시지를 표시한다.

**Independent Test**: 비로그인 상태에서 은하/행성 탐색 가능, 게시글 읽기 가능, 작성/별주기 UI가 비활성화되고 "로그인이 필요합니다" 메시지 확인

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T023 [P] [US3] GiveStarButton 비로그인 상태 테스트 — 비활성화 및 로그인 안내 메시지 표시 검증 in `apps/web/src/features/give-star/ui/__tests__/GiveStarButton.test.tsx`
- [x] T024 [P] [US3] PostOverlay 비로그인 상태 테스트 — 쓰기 UI 비활성화 및 로그인 유도 메시지 검증 in `apps/web/src/widgets/post-overlay/ui/__tests__/PostOverlay.test.tsx`

### Implementation for User Story 3

- [x] T025 [US3] GiveStarButton에 로그인 상태 체크 추가 — 비로그인 시 버튼 비활성화 + "로그인이 필요합니다" 표시, 클릭 시 /sign-in 리다이렉트 in `apps/web/src/features/give-star/ui/GiveStarButton.tsx`
- [x] T026 [US3] PostOverlay에서 비로그인 시 쓰기 관련 UI(게시글 작성, 별주기, 댓글) 비활성화 + 로그인 유도 메시지 표시 in `apps/web/src/widgets/post-overlay/ui/PostOverlay.tsx`
- [x] T027 [US3] GalaxyScene에서 비로그인 시 게시글 작성 버튼 비활성화 + 로그인 유도 메시지 표시 in `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx`

**Checkpoint**: 비로그인 사용자가 탐색/열람은 가능하지만 쓰기 UI가 차단되고 로그인이 안내됨

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 하위 호환 검증, 기존 테스트 업데이트, 정리

- [x] T028 기존 단위 테스트 업데이트 — 닉네임 필수 입력이 제거된 DTO/서비스 변경에 맞춰 기존 테스트 수정 in `apps/api/test/unit/`
- [x] T029 기존 E2E 테스트 업데이트 — 인증 필수 전환에 맞춰 E2E 시나리오 수정 in `apps/api/test/e2e/`
- [x] T030 하위 호환 검증 — 기존 닉네임 기반 데이터(authorId=null)가 정상 표시되는지 수동/자동 검증
- [x] T031 `OptionalClerkAuthGuard` 사용처 정리 — 더 이상 사용하지 않으면 제거, 읽기 전용으로 사용하면 유지 in `apps/api/src/infrastructure/auth/optional-clerk-auth.guard.ts`
- [x] T032 quickstart.md 검증 포인트 실행 및 전체 테스트 통과 확인

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — 즉시 시작
- **Foundational (Phase 2)**: Phase 1 완료 후 시작 — 모든 User Story 차단
- **US1 (Phase 3)**: Phase 2 완료 후 시작
- **US2 (Phase 4)**: Phase 3 완료 후 시작 (US1의 가드 교체가 선행되어야 함)
- **US3 (Phase 5)**: Phase 3 완료 후 시작 (US1과 독립적이나 US2와 병렬 가능)
- **Polish (Phase 6)**: 모든 User Story 완료 후

### Within Each User Story

- 테스트 먼저 작성 → 실패 확인 → 구현 → 테스트 통과
- [P] 태스크는 병렬 실행 가능
- 서비스 → 컨트롤러 → 프론트엔드 순서

### Parallel Opportunities

- T003, T004, T005, T006: DTO 변경 병렬 가능
- T007, T008: 컨트롤러 테스트 병렬 가능
- T009, T010: 컨트롤러 가드 교체 병렬 가능
- T012, T013, T014: US2 테스트 병렬 가능
- T019, T020: 프론트엔드 닉네임 제거 병렬 가능
- T023, T024: US3 테스트 병렬 가능

---

## Parallel Example: User Story 1

```bash
# 테스트 먼저 (병렬):
Task: "PlanetController 인증 필수 테스트" (T007)
Task: "StarController 인증 필수 테스트" (T008)

# 구현 (병렬):
Task: "PlanetController 가드 교체" (T009)
Task: "StarController 가드 교체" (T010)
```

## Parallel Example: User Story 2

```bash
# 테스트 먼저 (병렬):
Task: "PlanetService 자동 연결 테스트" (T012)
Task: "StarService 중복 제한 테스트" (T013)
Task: "create-post 스키마 테스트" (T014)

# 프론트엔드 (병렬):
Task: "create-post 스키마 닉네임 제거" (T019)
Task: "게시글 작성 폼 닉네임 UI 제거" (T020)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup (DB 마이그레이션)
2. Phase 2: Foundational (DTO 변경)
3. Phase 3: User Story 1 (가드 교체)
4. **STOP and VALIDATE**: 비로그인 POST → 401 확인
5. 배포 가능

### Incremental Delivery

1. Setup + Foundational → 기반 완료
2. US1 (접근 차단) → 테스트 → 배포 (MVP!)
3. US2 (닉네임 제거 + 중복 제한) → 테스트 → 배포
4. US3 (열람 UX) → 테스트 → 배포
5. Polish → 최종 검증

---

## Notes

- [P] 태스크 = 다른 파일, 의존성 없음
- [Story] 라벨은 해당 User Story에 매핑
- 기존 닉네임 기반 데이터 하위 호환 필수 — DB 필드 삭제 금지
- 커밋은 태스크 단위로 논리적 단위 유지
- Constitution TDD 원칙: 테스트 먼저 작성 → 실패 확인 → 구현
