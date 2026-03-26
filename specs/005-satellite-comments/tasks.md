# Tasks: 인공위성 댓글 시스템

**Input**: Design documents from `/specs/005-satellite-comments/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Constitution에 TDD(NON-NEGOTIABLE) 원칙이 명시되어 있으므로 모든 구현 태스크에 테스트를 포함합니다.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: DB 스키마 변경, Comment 도메인/인프라 기반 구축

- [x] T001 Prisma 스키마에 Comment 모델 추가 및 Planet에 commentCount 필드 추가 in `apps/api/prisma/schema.prisma`
- [x] T002 Prisma 마이그레이션 생성 in `apps/api/prisma/migrations/`
- [x] T003 [P] Comment 도메인 엔티티 생성 (content 1~500자, authorNickname 1~20자, parentId nullable 검증) in `apps/api/src/domain/entities/comment.entity.ts`
- [x] T004 [P] Comment 리포지토리 포트 정의 (create, findByPlanetId, findById) in `apps/api/src/domain/ports/comment-repository.port.ts`
- [x] T005 [P] Comment DTO 정의 (CreateCommentDto, CommentResponseDto, CommentListResponseDto) in `apps/api/src/application/dto/comment.dto.ts`
- [x] T006 [P] CommentMapper 추가 (Prisma ↔ 도메인 엔티티 변환) in `apps/api/src/application/mappers/index.ts`
- [x] T007 [P] Comment 공유 타입 추가 (CommentResponse, CreateCommentInput) in `packages/types/src/index.ts`
- [x] T008 [P] PlanetSummaryDto/PlanetDetailResponseDto에 commentCount 필드 추가 in `apps/api/src/application/dto/planet.dto.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Comment 리포지토리 구현, 서비스, 컨트롤러, 모듈 등록

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T009 [P] Comment 엔티티 단위 테스트 (content/authorNickname 유효성, parentId nullable) in `apps/api/src/domain/entities/__tests__/comment.entity.spec.ts`
- [x] T010 [P] CommentService 단위 테스트 (댓글 생성, 조회, 상한 50개, 대댓글 1단계 제한) in `apps/api/src/application/services/__tests__/comment.service.spec.ts`

### Implementation

- [x] T011 Comment Prisma 리포지토리 구현 (create with 트랜잭션 commentCount 증가, findByPlanetId with replies, findById) in `apps/api/src/infrastructure/database/repositories/comment.repository.ts`
- [x] T012 CommentService 구현 (create: 상한 검증 + 대댓글 1단계 제한 + commentCount 증가, findByPlanet: 트리 구조 반환) in `apps/api/src/application/services/comment.service.ts`
- [x] T013 CommentController 구현 (GET /api/planets/:planetId/comments, POST /api/planets/:planetId/comments) in `apps/api/src/infrastructure/api/controllers/comment.controller.ts`
- [x] T014 CommentModule 등록 (DatabaseModule + 서비스 + 컨트롤러) in `apps/api/src/comment.module.ts`
- [x] T015 AppModule에 CommentModule import 추가 in `apps/api/src/app.module.ts`
- [x] T016 PlanetService의 findByGalaxy/findById 매핑에 commentCount 추가 in `apps/api/src/application/services/planet.service.ts`

**Checkpoint**: 댓글 CRUD API 동작 가능

---

## Phase 3: User Story 1 — 게시글에 댓글 작성 (Priority: P1) 🎯 MVP

**Goal**: 게시글 상세 화면에서 댓글을 작성하고, 댓글 목록에 표시되며, 3D 공간에 인공위성이 나타난다.

**Independent Test**: 댓글 작성 후 사이드 패널에 목록 표시 + 3D 인공위성 렌더링 확인

### Tests ⚠️

- [x] T017 [P] [US1] 프론트엔드 댓글 작성 폼 테스트 (유효성 검증, 제출 동작) in `apps/web/src/features/write-comment/ui/__tests__/WriteCommentForm.test.tsx`
- [x] T018 [P] [US1] Satellite3D 컴포넌트 테스트 (렌더링, 인스턴스 수, 별과 다른 궤도) in `apps/web/src/entities/satellite/ui/__tests__/Satellite3D.test.tsx`

### Implementation

- [x] T019 [P] [US1] 댓글 API 훅 생성 (useComments, useCreateComment) in `apps/web/src/entities/comment/api/hooks.ts`
- [x] T020 [P] [US1] 댓글 쿼리 키 추가 in `apps/web/src/shared/api/query-keys.ts`
- [x] T021 [P] [US1] 댓글 작성 폼 zod 스키마 (content 1~500, authorNickname 1~20) in `apps/web/src/features/write-comment/model/schema.ts`
- [x] T022 [US1] 댓글 작성 폼 UI 구현 (react-hook-form + zod, 닉네임/내용 입력, 제출 버튼) in `apps/web/src/features/write-comment/ui/WriteCommentForm.tsx`
- [x] T023 [US1] 댓글 목록 UI 구현 (시간순 정렬, 작성자/시간/내용 표시) in `apps/web/src/entities/comment/ui/CommentList.tsx`
- [x] T024 [US1] 댓글 엔티티 barrel export in `apps/web/src/entities/comment/index.ts`
- [x] T025 [US1] 댓글 작성 피처 barrel export in `apps/web/src/features/write-comment/index.ts`
- [x] T026 [US1] Satellite3D 컴포넌트 구현 (InstancedMesh, 은색 원통/큐브, 혜성 꼬리 이펙트, 별보다 바깥 궤도) in `apps/web/src/entities/satellite/ui/Satellite3D.tsx`
- [x] T027 [US1] Satellite3D barrel export in `apps/web/src/entities/satellite/index.ts`
- [x] T028 [US1] PostOverlay에 CommentList + WriteCommentForm 통합 (댓글 작성 성공 시 목록 갱신) in `apps/web/src/widgets/post-overlay/ui/PostOverlay.tsx`
- [x] T029 [US1] GalaxyScene에 Satellite3D 통합 (각 행성에 commentCount 기반 인공위성 렌더링) in `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx`

**Checkpoint**: 댓글 작성 → 목록 표시 + 인공위성 3D 렌더링 동작

---

## Phase 4: User Story 2 — 인공위성 클릭 시 댓글 포커싱 (Priority: P1)

**Goal**: 인공위성 클릭 → 사이드 패널 댓글 포커싱, 사이드 패널 댓글 클릭 → 인공위성 강조 (양방향)

**Independent Test**: 인공위성 클릭 시 해당 댓글이 하이라이트 + 스크롤, 댓글 클릭 시 인공위성 강조

### Tests ⚠️

- [x] T030 [P] [US2] 댓글 포커싱 상태 스토어 테스트 (focusedCommentId 설정/해제) in `apps/web/src/entities/comment/model/__tests__/comment-focus-store.test.ts`

### Implementation

- [x] T031 [US2] 댓글 포커싱 상태 Zustand 스토어 생성 (focusedCommentId, setFocusedComment, clearFocus) in `apps/web/src/entities/comment/model/comment-focus-store.ts`
- [x] T032 [US2] Satellite3D에 클릭 이벤트 추가 — instanceId로 댓글 인덱스 매핑, focusedCommentId 설정 in `apps/web/src/entities/satellite/ui/Satellite3D.tsx`
- [x] T033 [US2] Satellite3D에서 focusedCommentId에 해당하는 인공위성 시각적 강조 (발광/크기 증가) in `apps/web/src/entities/satellite/ui/Satellite3D.tsx`
- [x] T034 [US2] CommentList에서 focusedCommentId에 해당하는 댓글 하이라이트 + scrollIntoView in `apps/web/src/entities/comment/ui/CommentList.tsx`
- [x] T035 [US2] CommentList에서 댓글 클릭 시 focusedCommentId 설정 (역방향 연결) in `apps/web/src/entities/comment/ui/CommentList.tsx`

**Checkpoint**: 인공위성 ↔ 댓글 양방향 포커싱 동작

---

## Phase 5: User Story 3 — 대댓글(답글) 작성 (Priority: P2)

**Goal**: 기존 댓글에 답글 작성, 부모 댓글 아래 들여쓰기, 부모 인공위성 근처 작은 위성

**Independent Test**: 대댓글 작성 후 부모 아래 들여쓰기 + 3D 부모 위성 근처 작은 위성 확인

### Tests ⚠️

- [x] T036 [P] [US3] CommentList 대댓글 렌더링 테스트 (들여쓰기, 답글 버튼) in `apps/web/src/entities/comment/ui/__tests__/CommentList.test.tsx`

### Implementation

- [x] T037 [US3] CommentList에 "답글" 버튼 추가 — 클릭 시 해당 댓글 아래 WriteCommentForm 토글 (parentId 전달) in `apps/web/src/entities/comment/ui/CommentList.tsx`
- [x] T038 [US3] CommentList에 대댓글 들여쓰기 스타일 적용 (replies 배열 렌더링) in `apps/web/src/entities/comment/ui/CommentList.tsx`
- [x] T039 [US3] Satellite3D에 대댓글 인공위성 렌더링 — 부모 위성 근처 더 작은 크기로 표시 in `apps/web/src/entities/satellite/ui/Satellite3D.tsx`

**Checkpoint**: 대댓글 작성 + 들여쓰기 + 부모 근처 작은 위성 동작

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 테스트 정리, 성능 검증, 하위 호환

- [x] T040 기존 PlanetService 단위 테스트에 commentCount 필드 추가 반영 in `apps/api/test/unit/application/planet.service.spec.ts`
- [x] T041 댓글 상한(50개) 도달 시 프론트엔드 작성 UI 비활성화 + 안내 메시지 in `apps/web/src/features/write-comment/ui/WriteCommentForm.tsx`
- [x] T042 3D 성능 검증 — 50개 인공위성 + 100개 별 동시 렌더링 시 30fps 이상 확인
- [x] T043 quickstart.md 검증 포인트 실행 및 전체 테스트 통과 확인

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — 즉시 시작
- **Foundational (Phase 2)**: Phase 1 완료 후 시작 — 모든 User Story 차단
- **US1 (Phase 3)**: Phase 2 완료 후 시작
- **US2 (Phase 4)**: Phase 3 완료 후 시작 (Satellite3D와 CommentList가 필요)
- **US3 (Phase 5)**: Phase 3 완료 후 시작 (US2와 병렬 가능)
- **Polish (Phase 6)**: 모든 User Story 완료 후

### Within Each User Story

- 테스트 먼저 작성 → 실패 확인 → 구현 → 테스트 통과
- [P] 태스크는 병렬 실행 가능
- 백엔드 → 프론트엔드 → 3D 통합 순서

### Parallel Opportunities

- T003, T004, T005, T006, T007, T008: 도메인/DTO 병렬 가능
- T009, T010: 테스트 병렬 가능
- T017, T018: US1 테스트 병렬 가능
- T019, T020, T021: US1 프론트엔드 기반 병렬 가능
- US2 (Phase 4)와 US3 (Phase 5)는 Phase 3 이후 병렬 가능

---

## Parallel Example: Phase 1 Setup

```bash
# 도메인/인프라 (병렬):
Task: "Comment 엔티티" (T003)
Task: "Comment 리포지토리 포트" (T004)
Task: "Comment DTO" (T005)
Task: "CommentMapper" (T006)
Task: "공유 타입" (T007)
Task: "Planet DTO commentCount" (T008)
```

## Parallel Example: User Story 1

```bash
# 테스트 먼저 (병렬):
Task: "WriteCommentForm 테스트" (T017)
Task: "Satellite3D 테스트" (T018)

# 프론트엔드 기반 (병렬):
Task: "댓글 API 훅" (T019)
Task: "쿼리 키" (T020)
Task: "폼 스키마" (T021)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup (스키마 + 도메인 + DTO)
2. Phase 2: Foundational (서비스 + 컨트롤러 + 모듈)
3. Phase 3: User Story 1 (댓글 작성 + Satellite3D)
4. **STOP and VALIDATE**: 댓글 작성 → 목록 표시 + 인공위성 렌더링 확인
5. 배포 가능

### Incremental Delivery

1. Setup + Foundational → 백엔드 완료
2. US1 (댓글 + 인공위성) → 테스트 → 배포 (MVP!)
3. US2 (클릭 포커싱) → 테스트 → 배포
4. US3 (대댓글) → 테스트 → 배포
5. Polish → 최종 검증

---

## Notes

- [P] 태스크 = 다른 파일, 의존성 없음
- [Story] 라벨은 해당 User Story에 매핑
- Satellite3D는 Star3D의 InstancedMesh 패턴을 참고하되, 별과 다른 궤도/색상/형태 사용
- 혜성 꼬리 이펙트는 Trail 또는 커스텀 구현
- 행성당 댓글 상한 50개, commentCount 필드로 관리
- Constitution TDD 원칙: 테스트 먼저 작성 → 실패 확인 → 구현
