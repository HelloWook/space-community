# Tasks: UX 개선 — WASD 자유이동, 모달 리디자인, 우주 장식 강화

**Input**: Design documents from `/specs/009-ux-polish/`
**Prerequisites**: spec.md (user stories, requirements, clarifications)

**Tests**: Constitution(VI)에 따라 TDD 필수 — 각 구현 태스크 전에 테스트를 먼저 작성한다.

**Organization**: 태스크는 User Story별로 그룹화하여 독립 구현·테스트가 가능하도록 한다.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 해당 태스크가 속한 User Story (US1, US2, US3, US4)

## Path Conventions

- **프론트엔드**: `apps/web/src/` (FSD 구조)
- **테스트**: 각 컴포넌트 디렉토리 내 `__tests__/`
- **스토리**: `apps/web/src/stories/`

---

## Phase 1: Setup

**Purpose**: 기존 코드의 문제점 파악 및 공통 기반 준비

- [x] T001 Zustand 스토어에 카메라 위치 저장 필드 추가 — `apps/web/src/entities/galaxy/model/index.ts`에 `savedCameraPosition: [number, number, number] | null` 필드와 `saveCameraPosition`, `getSavedCameraPosition` 액션 추가

---

## Phase 2: Foundational

**Purpose**: 모든 User Story에 공통으로 필요한 기반 작업

- [x] T002 기존 Overlay 위젯의 테스트 업데이트 — `apps/web/src/widgets/overlay/ui/__tests__/Overlay.test.tsx`에서 shadcn Dialog 마이그레이션 후에도 통과할 수 있도록 테스트 대상을 확인하고 현재 동작 스냅샷 기록

**Checkpoint**: 기반 작업 완료 — User Story 구현 시작 가능

---

## Phase 3: User Story 1 — WASD 자유 탐험 (Priority: P1) 🎯 MVP

**Goal**: WASD로 이동한 카메라가 원점으로 되돌아가지 않고 자유롭게 탐험 가능

**Independent Test**: WASD로 카메라를 임의 위치로 이동시킨 뒤 5초 대기 — 카메라 위치가 변하지 않으면 성공

### 테스트 (TDD Red)

- [x] T003 [P] [US1] `useCameraTransition` 테스트 작성 — `apps/web/src/features/navigate-galaxy/model/__tests__/use-camera-transition.test.ts` 생성. 전환 완료 후 lerp가 중단되는지, WASD 이동 후 원점으로 복귀하지 않는지 검증
- [x] T004 [P] [US1] `useGalaxyNavigationStore` 카메라 위치 저장/복원 테스트 — `apps/web/src/entities/galaxy/model/__tests__/store.test.ts`에 `saveCameraPosition`과 `returnToUniverse` 시 저장된 위치 반환 테스트 추가

### 구현 (TDD Green)

- [x] T005 [US1] `useCameraTransition` 수정 — `apps/web/src/features/navigate-galaxy/model/use-camera-transition.ts`에서 전환 완료 후 lerp를 중단하도록 수정. `isTransitioning` 상태를 명확하게 관리하여 도착 후에는 카메라 위치를 변경하지 않음
- [x] T006 [US1] `selectGalaxy` 호출 시 카메라 위치 저장 로직 추가 — `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx`의 `SceneContent`에서 은하 클릭 시 현재 카메라 위치를 스토어에 저장
- [x] T007 [US1] `returnToUniverse` 시 저장된 위치로 복귀 — `apps/web/src/features/navigate-galaxy/model/use-camera-transition.ts`에서 universe 모드 전환 시 `UNIVERSE_POSITION` 대신 저장된 위치를 목표로 사용
- [x] T008 [US1] WASD bounds를 200으로 확장 — `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx`에서 `useWASDControls`의 bounds를 `[-200, -100, -200]` ~ `[200, 100, 200]`으로 변경
- [x] T009 [US1] 탭 전환 시 키 상태 초기화 — `apps/web/src/shared/lib/hooks/use-wasd-controls.ts`에 `visibilitychange` 이벤트 리스너 추가, 탭 비활성화 시 모든 키를 false로 리셋

### 스토리 (Constitution VIII)

- [x] T010 [US1] WASD 자유이동 Storybook 스토리 — `apps/web/src/stories/3d/WASDControls.stories.tsx` 생성. ThreeDecorator 내에서 WASD 이동 후 카메라가 유지되는 것을 시연

**Checkpoint**: WASD로 자유 이동 가능, 은하 클릭 전환 후 원위치 복귀 동작

---

## Phase 4: User Story 2 — 모달 리디자인 (Priority: P1)

**Goal**: 모든 오버레이를 shadcn Dialog 기반으로 통일, 콘텐츠별 차등 크기, X 버튼·애니메이션·반응형

**Independent Test**: 각 모달을 열어 콘텐츠가 잘리지 않고, X 버튼·ESC·배경 클릭으로 닫히는지 확인

### 테스트 (TDD Red)

- [x] T011 [P] [US2] LoginOverlay Dialog 마이그레이션 테스트 — `apps/web/src/features/social-login/ui/__tests__/LoginOverlay.test.tsx` 수정. shadcn Dialog 기반 렌더링, X 버튼 닫기, ESC 닫기 검증
- [x] T012 [P] [US2] CreateGalaxyForm Dialog 마이그레이션 테스트 — `apps/web/src/features/create-galaxy/ui/__tests__/CreateGalaxyForm.test.tsx` 생성. sm 크기 Dialog, 폼 제출, 닫기 동작 검증
- [x] T013 [P] [US2] CreatePostForm 2단 레이아웃 테스트 — `apps/web/src/features/create-post/ui/__tests__/CreatePostForm.test.tsx` 생성. xl 크기 Dialog, 좌우 2단 레이아웃 렌더링 검증
- [x] T014 [P] [US2] PostOverlay Dialog 마이그레이션 테스트 — `apps/web/src/widgets/post-overlay/__tests__/PostOverlay.test.tsx` 수정. lg 크기 Dialog, 스크롤, X 버튼 닫기 검증

### 구현 (TDD Green)

- [x] T015 [US2] 기존 Overlay 위젯을 shadcn Dialog로 대체 — `apps/web/src/widgets/overlay/ui/Overlay.tsx`를 shadcn `Dialog`/`DialogContent` 기반으로 리팩토링. 크기 variant prop 추가 (sm/lg/xl), X 버튼(`DialogClose`), 우주 테마 스타일 유지
- [x] T016 [US2] LoginOverlay를 Dialog 기반으로 마이그레이션 — `apps/web/src/features/social-login/ui/LoginOverlay.tsx`에서 새 Overlay(sm variant) 사용
- [x] T017 [US2] CreateGalaxyForm을 Dialog 기반으로 마이그레이션 — `apps/web/src/features/create-galaxy/ui/CreateGalaxyForm.tsx`에서 새 Overlay(sm variant) 사용
- [x] T018 [US2] CreatePostForm을 2단 레이아웃 Dialog로 마이그레이션 — `apps/web/src/features/create-post/ui/CreatePostForm.tsx`에서 새 Overlay(xl variant) 사용, 좌우 2단 레이아웃 적용 (좌: 3D 프리뷰+커스터마이즈, 우: 제목+본문). 768px 미만에서는 세로 스택
- [x] T019 [US2] PostOverlay를 Dialog 기반으로 마이그레이션 — `apps/web/src/widgets/post-overlay/ui/PostOverlay.tsx`에서 새 Overlay(lg variant) 사용
- [x] T020 [US2] GalaxyScene의 모달 호출부 업데이트 — `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx`에서 기존 `<Overlay>` 사용을 새 Dialog 기반 API로 변경

### 스토리 (Constitution VIII)

- [x] T021 [P] [US2] Dialog 모달 변형 Storybook 스토리 — `apps/web/src/stories/ui/Dialog.stories.tsx` 생성. sm/lg/xl 변형 각각의 스토리 (Default, Small, Large, ExtraLarge)
- [x] T022 [P] [US2] 기존 Overlay 스토리 업데이트 — `apps/web/src/stories/ui/Overlay.stories.tsx`를 새 Dialog 기반으로 업데이트하거나 Dialog.stories.tsx로 대체

**Checkpoint**: 모든 모달이 shadcn Dialog 기반, 크기 차등, X 버튼·ESC·배경 클릭 닫기 동작

---

## Phase 5: User Story 3 — 우주 장식 강화 (Priority: P2)

**Goal**: 성운, 추가 소행성대, 배경 은하로 우주 공간의 밀도와 몰입감 향상

**Independent Test**: 우주 뷰에서 360도 둘러보았을 때 모든 방향에 시각 요소가 존재

### 테스트 (TDD Red)

- [x] T023 [P] [US3] Nebula 컴포넌트 테스트 — `apps/web/src/entities/decoration/ui/__tests__/Nebula.test.tsx` 생성. 렌더링 확인, position/color props 검증
- [x] T024 [P] [US3] DistantGalaxy 컴포넌트 테스트 — `apps/web/src/entities/decoration/ui/__tests__/DistantGalaxy.test.tsx` 생성. 렌더링 확인, raycast 비활성화(포인터 이벤트 투과) 검증
- [x] T025 [P] [US3] CosmicDust 컴포넌트 테스트 — `apps/web/src/entities/decoration/ui/__tests__/CosmicDust.test.tsx` 생성. 렌더링 확인

### 구현 (TDD Green)

- [x] T026 [P] [US3] Nebula 컴포넌트 생성 — `apps/web/src/entities/decoration/ui/Nebula.tsx`. BufferGeometry + Points로 구형 파티클 구름, 반투명 파스텔톤 PointsMaterial (vertexColors), position/color/size/opacity props
- [x] T027 [P] [US3] DistantGalaxy 컴포넌트 생성 — `apps/web/src/entities/decoration/ui/DistantGalaxy.tsx`. 작은 발광 구체 + 희미한 디스크, emissive material, `raycast={null}` 로 포인터 이벤트 차단
- [x] T028 [P] [US3] CosmicDust 컴포넌트 생성 — `apps/web/src/entities/decoration/ui/CosmicDust.tsx`. 넓은 범위에 분산된 미세 파티클, BufferGeometry + Points, 매우 낮은 opacity
- [x] T029 [US3] decoration barrel export 업데이트 — `apps/web/src/entities/decoration/index.ts`에 Nebula, DistantGalaxy, CosmicDust 추가
- [x] T030 [US3] 기존 소행성 배치 범위 확장 — `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx`에서 소행성 10개의 center 범위를 `[-70, 70]`으로 확장하고, `Math.random()` 대신 시드 기반 고정값으로 scale 설정 (리렌더 시 재랜덤화 방지)
- [x] T031 [US3] GalaxyScene에 새 장식 요소 배치 — `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx`에 Nebula 4~5개, DistantGalaxy 20~25개, CosmicDust 1개를 우주 공간 전역에 분산 배치. 모든 장식은 `raycast={null}`

### 스토리 (Constitution VIII)

- [x] T032 [P] [US3] 새 장식 컴포넌트 Storybook 스토리 — `apps/web/src/stories/3d/Decorations.stories.tsx` 업데이트. Nebula, DistantGalaxy, CosmicDust 스토리 추가

**Checkpoint**: 우주 공간이 성운·배경 은하·우주 먼지로 풍성하게 채워짐, 60fps 유지

---

## Phase 6: User Story 4 — 모달 접근성 (Priority: P3)

**Goal**: 모달 포커스 트랩, 스크린 리더 지원

**Independent Test**: 키보드만으로 모달 열기→내부 탐색→닫기 가능

### 테스트 (TDD Red)

- [x] T033 [US4] 모달 접근성 테스트 — `apps/web/src/widgets/overlay/ui/__tests__/Overlay.test.tsx`에 포커스 트랩 테스트 추가: Tab 키로 모달 내부만 순환, aria-label/role 검증

### 구현 (TDD Green)

- [x] T034 [US4] Dialog 접근성 속성 보강 — `apps/web/src/widgets/overlay/ui/Overlay.tsx`에서 `DialogTitle`, `DialogDescription` 올바르게 설정. shadcn Dialog가 Radix 기반이므로 포커스 트랩은 자동 제공 — 각 모달에서 title/description prop이 올바르게 전달되는지 확인
- [x] T035 [US4] 각 모달 컴포넌트에 aria 속성 전달 확인 — LoginOverlay, CreateGalaxyForm, CreatePostForm, PostOverlay 각각에서 Dialog에 적절한 title/description 전달

**Checkpoint**: Tab 포커스 트랩 동작, 스크린 리더가 모달 역할·제목 인식

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 전체 통합 검증, 성능 확인, 정리

- [x] T036 전체 테스트 실행 및 수정 — `npm test` 실행, 깨진 테스트 수정
- [x] T037 Storybook 빌드 검증 — `cd apps/web && npx storybook build` 실행하여 모든 스토리가 정상 빌드되는지 확인
- [x] T038 성능 확인 — 장식 요소 추가 후 브라우저에서 프레임 레이트 확인, 55fps 미만 시 파티클 수 조정
- [x] T039 기존 Overlay 스토리/테스트 정리 — 더 이상 사용하지 않는 기존 Overlay 관련 코드 제거

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 즉시 시작 가능
- **Phase 2 (Foundational)**: Phase 1 완료 후
- **Phase 3 (US1 WASD)**: Phase 2 완료 후 — 다른 스토리와 독립
- **Phase 4 (US2 모달)**: Phase 2 완료 후 — US1과 독립적으로 병렬 가능
- **Phase 5 (US3 장식)**: Phase 2 완료 후 — US1/US2와 독립적으로 병렬 가능
- **Phase 6 (US4 접근성)**: Phase 4 (US2 모달) 완료 후 — shadcn Dialog 마이그레이션이 선행되어야 함
- **Phase 7 (Polish)**: 모든 User Story 완료 후

### User Story Dependencies

- **US1 (WASD)**: 독립 — GalaxyScene의 카메라 로직만 수정
- **US2 (모달)**: 독립 — Overlay 위젯과 각 모달 컴포넌트 수정
- **US3 (장식)**: 독립 — 새 decoration 컴포넌트 추가 + GalaxyScene에 배치
- **US4 (접근성)**: US2에 의존 — Dialog 마이그레이션 완료 후 접근성 보강

### Parallel Opportunities

- T003, T004 병렬 (US1 테스트들)
- T011, T012, T013, T014 병렬 (US2 테스트들)
- T023, T024, T025 병렬 (US3 테스트들)
- T026, T027, T028 병렬 (US3 새 컴포넌트들)
- T021, T022 병렬 (US2 스토리들)
- US1, US2, US3 전체가 서로 독립적으로 병렬 가능

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Phase 1: Setup (T001)
2. Phase 2: Foundational (T002)
3. Phase 3: US1 WASD 자유이동 (T003~T010)
4. Phase 4: US2 모달 리디자인 (T011~T022)
5. **STOP and VALIDATE**: WASD 이동과 모달이 독립적으로 동작하는지 확인
6. 이후 US3 (장식), US4 (접근성) 순차 추가

### Incremental Delivery

1. Setup + Foundational → 기반 완료
2. US1 완료 → WASD 자유 이동 검증 (핵심 버그 수정)
3. US2 완료 → 모달 UX 검증 (핵심 UI 개선)
4. US3 완료 → 우주 풍성함 검증 (시각 개선)
5. US4 완료 → 접근성 검증 (품질 보강)
6. Polish → 통합 검증 및 정리

---

## Notes

- [P] 태스크 = 다른 파일, 의존성 없음
- [Story] 레이블로 태스크를 해당 User Story에 매핑
- Constitution VI(TDD): 각 구현 전에 테스트 먼저 작성하고 실패 확인
- Constitution VIII(스토리 필수): 모든 UI 컴포넌트에 Storybook 스토리 포함
- 태스크 완료 후 논리적 단위로 커밋
