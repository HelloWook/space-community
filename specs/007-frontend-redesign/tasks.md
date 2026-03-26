# Tasks: 프론트엔드 전체 리디자인

**Input**: Design documents from `/specs/007-frontend-redesign/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md

**Tests**: 포함 (헌법 VI조 TDD 원칙 준수 — 모든 구현 전 테스트 작성)

**Organization**: 사용자 스토리별 그룹화. 각 스토리 독립 구현/테스트 가능.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 소속 사용자 스토리 (US1, US2, US3, US4, US5)
- 모든 설명에 정확한 파일 경로 포함

---

## Phase 1: Setup (공유 인프라)

**Purpose**: shadcn/ui 설치, 우주 테마 토큰 확장, 디렉토리 구조 생성

- [x] T001 shadcn/ui 초기 설치 및 설정 — `apps/web/` 디렉토리에서 `npx shadcn@latest init` 실행, `components.json` 설정 (컴포넌트 경로: `src/shared/ui/shadcn/`)
- [x] T002 shadcn/ui 컴포넌트 설치 — Button, Input, Textarea, Card, Dialog, Select, RadioGroup, Slider 8종 설치 (`apps/web/src/shared/ui/shadcn/`)
- [x] T003 [P] 우주 테마 CSS 변수 확장 — `apps/web/src/app/styles/globals.css`에 `--accent`를 연보라(`270 50% 40%`)로 변경, `--overlay-bg`, `--overlay-border`, `--glow-purple` 토큰 추가
- [x] T004 [P] 장식 요소 엔티티 디렉토리 구조 생성 — `apps/web/src/entities/decoration/ui/` 디렉토리 및 `apps/web/src/entities/decoration/index.ts` barrel 파일 생성
- [x] T005 [P] 공통 오버레이 위젯 디렉토리 구조 생성 — `apps/web/src/widgets/overlay/ui/` 디렉토리 및 `apps/web/src/widgets/overlay/index.ts` barrel 파일 생성

**Checkpoint**: shadcn/ui 컴포넌트 import 가능, 테마 토큰 적용 확인, 디렉토리 구조 완료

---

## Phase 2: Foundational (차단 전제조건)

**Purpose**: 모든 사용자 스토리에서 공유하는 공통 오버레이 컴포넌트 구축 (US4, US5의 전제조건이며, US2/US3에서도 오버레이 마이그레이션에 사용)

**⚠️ CRITICAL**: US4, US5는 이 단계 완료 후 시작 가능

### 테스트

> **NOTE: 테스트 먼저 작성, 실패 확인 후 구현**

- [x] T006 [P] 공통 Overlay 컴포넌트 렌더링 테스트 — `apps/web/src/widgets/overlay/ui/__tests__/Overlay.test.tsx` (open/close 상태, ESC 닫기, 배경 클릭 닫기, 포커스 트랩, 페이드 애니메이션 클래스)

### 구현

- [x] T007 공통 Overlay 컴포넌트 구현 — `apps/web/src/widgets/overlay/ui/Overlay.tsx` (shadcn/ui Dialog 기반, 연보라 글래스모피즘 스타일, `backdrop-blur-md bg-[hsl(var(--overlay-bg))] border-[hsl(var(--overlay-border))]`, 페이드인/아웃 200ms)

**Checkpoint**: `<Overlay open={true} onClose={fn}>` 렌더링 가능, 테스트 통과

---

## Phase 3: User Story 1 — 풍부한 우주 환경 체험 (Priority: P1) 🎯 MVP

**Goal**: 은하 보드에 별 파티클, 유성, 운석, 블랙홀, 태양 5종 장식 요소를 추가하여 생동감 있는 우주 공간 제공

**Independent Test**: 은하 보드 진입 시 4종 이상 장식 요소가 렌더링되고 자연스럽게 움직이는지 확인

### 테스트 (US1) ⚠️

> **NOTE: 테스트 먼저 작성, 실패 확인 후 구현**

- [x] T008 [P] [US1] Starfield 컴포넌트 렌더링 테스트 — `apps/web/src/entities/decoration/ui/__tests__/Starfield.test.tsx` (R3F TestCanvas 내 렌더링, count/radius props 검증)
- [x] T009 [P] [US1] Meteor 컴포넌트 렌더링 테스트 — `apps/web/src/entities/decoration/ui/__tests__/Meteor.test.tsx` (렌더링, 위치/방향 props 검증)
- [x] T010 [P] [US1] Asteroid 컴포넌트 렌더링 테스트 — `apps/web/src/entities/decoration/ui/__tests__/Asteroid.test.tsx` (렌더링, 궤도 props 검증)
- [x] T011 [P] [US1] BlackHole 컴포넌트 렌더링 테스트 — `apps/web/src/entities/decoration/ui/__tests__/BlackHole.test.tsx` (렌더링, 위치/왜곡 props 검증)
- [x] T012 [P] [US1] Sun 컴포넌트 렌더링 테스트 — `apps/web/src/entities/decoration/ui/__tests__/Sun.test.tsx` (렌더링, 조명/발광 props 검증)

### 구현 (US1)

- [x] T013 [P] [US1] Starfield 컴포넌트 구현 — `apps/web/src/entities/decoration/ui/Starfield.tsx` (drei `Stars` 기반, count=1000, radius=100 기본값)
- [x] T014 [P] [US1] Meteor 컴포넌트 구현 — `apps/web/src/entities/decoration/ui/Meteor.tsx` (drei `Trail` + `useFrame` 이동 애니메이션, 발광 꼬리, 불규칙 간격 재생성)
- [x] T015 [P] [US1] Asteroid 컴포넌트 구현 — `apps/web/src/entities/decoration/ui/Asteroid.tsx` (`useFrame` 기반 궤도 운동, DodecahedronGeometry 불규칙 형태, 느린 자전)
- [x] T016 [P] [US1] BlackHole 컴포넌트 구현 — `apps/web/src/entities/decoration/ui/BlackHole.tsx` (커스텀 셰이더로 빛 왜곡 효과, SphereGeometry 중심 + 왜곡 디스크)
- [x] T017 [P] [US1] Sun 컴포넌트 구현 — `apps/web/src/entities/decoration/ui/Sun.tsx` (SphereGeometry + MeshStandardMaterial emissive, PointLight 추가, 글로우 효과)
- [x] T018 [US1] entities/decoration barrel export 업데이트 — `apps/web/src/entities/decoration/index.ts`에 5종 컴포넌트 export
- [x] T019 [US1] GalaxyScene에 장식 요소 통합 — `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx`에 Starfield(항상), Meteor(최대 3개), Asteroid(최대 10개), BlackHole(1개), Sun(1개) 배치. 사용자 오브젝트(행성/은하)와 겹치지 않는 위치 계산
- [x] T020 [US1] 장식 요소 성능 측정 — GalaxyScene에 개발 모드 FPS 모니터링(drei `Stats` 또는 `useFrame` 기반) 추가, 30fps 이상 확인 및 기록

**Checkpoint**: 은하 보드 진입 시 별 파티클, 유성, 운석, 블랙홀, 태양이 렌더링되고 30fps 유지

---

## Phase 4: User Story 2 — shadcn/ui 기반 일관된 UI 컴포넌트 (Priority: P1)

**Goal**: 모든 UI 컴포넌트를 shadcn/ui로 교체하여 일관된 디자인 시스템 구축

**Independent Test**: 게시글 작성 폼, 댓글 UI, 행성 커스터마이즈 패널에서 shadcn/ui 컴포넌트가 렌더링되는지 확인

### 테스트 (US2) ⚠️

> **NOTE: 테스트 먼저 작성, 실패 확인 후 구현**

- [x] T021 [P] [US2] CreatePostForm shadcn/ui 전환 테스트 — `apps/web/src/features/create-post/__tests__/CreatePostForm.test.tsx` 업데이트 (shadcn Button, Input, Textarea 렌더링 검증)
- [x] T022 [P] [US2] WriteCommentForm shadcn/ui 전환 테스트 — `apps/web/src/features/write-comment/ui/__tests__/WriteCommentForm.test.tsx` (shadcn Textarea, Button 렌더링 검증)
- [x] T023 [P] [US2] CommentList shadcn/ui Card 전환 테스트 — `apps/web/src/entities/comment/ui/__tests__/CommentList.test.tsx` (shadcn Card 렌더링 검증)
- [x] T024 [P] [US2] CustomizePanel shadcn/ui 전환 테스트 — `apps/web/src/features/customize-planet/__tests__/CustomizePanel.test.tsx` (shadcn Select, RadioGroup, Slider 렌더링 검증)
- [x] T025 [P] [US2] CreateGalaxyForm shadcn/ui 전환 테스트 — `apps/web/src/features/create-galaxy/__tests__/CreateGalaxyForm.test.tsx` 업데이트 (shadcn Input, Button 렌더링 검증)

### 구현 (US2)

- [x] T026 [P] [US2] CreatePostForm → shadcn/ui 전환 — `apps/web/src/features/create-post/ui/CreatePostForm.tsx` (`<button>` → `<Button>`, `<input>` → `<Input>`, `<textarea>` → `<Textarea>`)
- [x] T027 [P] [US2] WriteCommentForm → shadcn/ui 전환 — `apps/web/src/features/write-comment/ui/WriteCommentForm.tsx` (`<textarea>` → `<Textarea>`, `<button>` → `<Button>`)
- [x] T028 [P] [US2] CommentList → shadcn/ui Card 전환 — `apps/web/src/entities/comment/ui/CommentList.tsx` (댓글 카드를 shadcn `<Card>` 컴포넌트로 교체)
- [x] T029 [P] [US2] CustomizePanel → shadcn/ui 전환 — `apps/web/src/features/customize-planet/ui/CustomizePanel.tsx` (shape/pattern `<select>` → `<Select>`, size 슬라이더 → `<Slider>`, 옵션 → `<RadioGroup>`)
- [x] T030 [P] [US2] ColorPicker → Tailwind 통합 — `apps/web/src/features/customize-planet/ui/ColorPicker.tsx` (react-colorful 유지, 래퍼 스타일링 shadcn 테마와 통일)
- [x] T031 [P] [US2] CreateGalaxyForm → shadcn/ui 전환 — `apps/web/src/features/create-galaxy/ui/CreateGalaxyForm.tsx` (`<input>` → `<Input>`, `<button>` → `<Button>`)
- [x] T032 [P] [US2] GiveStarButton → shadcn/ui Button 전환 — `apps/web/src/features/give-star/ui/GiveStarButton.tsx` (`<button>` → `<Button>` variant)
- [x] T033 [US2] shadcn/ui 테마 우주 테마 미세 조정 — `apps/web/src/app/styles/globals.css` CSS 변수 미세 조정 (호버/포커스/액티브 상태 색상이 우주 테마와 조화되는지 확인)

**Checkpoint**: 모든 폼/버튼/입력 컴포넌트가 shadcn/ui로 렌더링되고 기존 기능 유지

---

## Phase 5: User Story 3 — 인라인 스타일 제거 및 Tailwind CSS 전환 (Priority: P1)

**Goal**: 17개 파일의 인라인 스타일을 Tailwind CSS 유틸리티 클래스로 전환

**Independent Test**: `style=` 속성 검색 시 Three.js Canvas 설정 제외 0건 확인

### 테스트 (US3) ⚠️

> **NOTE: 기존 테스트가 마이그레이션 후에도 통과하는지 검증 — 시각적 회귀 없음 확인**

- [x] T034 [US3] 인라인 스타일 마이그레이션 회귀 테스트 계획 — 기존 테스트 스위트(`yarn workspace @galaxy-board/web test`) 전체 실행하여 기준선 확보

### 구현 (US3)

- [x] T035 [P] [US3] GalaxyScene 인라인 스타일 → Tailwind 전환 — `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx` (오버레이 패널 `style={{}}` → Tailwind 클래스, Canvas 자체 속성은 유지)
- [x] T036 [P] [US3] PostOverlay 인라인 스타일 → Tailwind 전환 — `apps/web/src/widgets/post-overlay/ui/PostOverlay.tsx` (`position: fixed, width: 400px, backgroundColor: rgba(...)` → `fixed w-[400px] bg-[...]`)
- [x] T037 [P] [US3] CommentList 인라인 스타일 → Tailwind 전환 — `apps/web/src/entities/comment/ui/CommentList.tsx` (카드 레이아웃, 인덴트, 보더 스타일)
- [x] T038 [P] [US3] CreatePostForm 인라인 스타일 → Tailwind 전환 — `apps/web/src/features/create-post/ui/CreatePostForm.tsx`
- [x] T039 [P] [US3] WriteCommentForm 인라인 스타일 → Tailwind 전환 — `apps/web/src/features/write-comment/ui/WriteCommentForm.tsx`
- [x] T040 [P] [US3] CustomizePanel + ColorPicker 인라인 스타일 → Tailwind 전환 — `apps/web/src/features/customize-planet/ui/CustomizePanel.tsx`, `ColorPicker.tsx`
- [x] T041 [P] [US3] GiveStarButton 인라인 스타일 → Tailwind 전환 — `apps/web/src/features/give-star/ui/GiveStarButton.tsx`
- [x] T042 [P] [US3] NavigateGalaxy 컴포넌트 인라인 스타일 → Tailwind 전환 — `apps/web/src/features/navigate-galaxy/ui/BackButton.tsx`, `PaginationControls.tsx`
- [x] T043 [P] [US3] CreateGalaxyForm 인라인 스타일 → Tailwind 전환 — `apps/web/src/features/create-galaxy/ui/CreateGalaxyForm.tsx`
- [x] T044 [P] [US3] Planet3D, PlanetPreview3D 인라인 스타일 → Tailwind 전환 — `apps/web/src/entities/planet/ui/Planet3D.tsx`, `PlanetPreview3D.tsx` (UI 요소만, 3D mesh 속성 유지)
- [x] T045 [P] [US3] Galaxy3D 인라인 스타일 → Tailwind 전환 — `apps/web/src/entities/galaxy/ui/Galaxy3D.tsx` (UI 요소만)
- [x] T046 [P] [US3] HomePage, WebGLFallback, Canvas3D 인라인 스타일 → Tailwind 전환 — `apps/web/src/views/home/ui/HomePage.tsx`, `apps/web/src/shared/ui/WebGLFallback.tsx`, `apps/web/src/shared/ui/Canvas3D.tsx`
- [x] T047 [US3] 인라인 스타일 제로 검증 — 프로젝트 전체에서 `style={` grep 실행, Three.js Canvas 설정 제외 0건 확인

**Checkpoint**: `style=` 검색 시 Three.js 필수 설정 외 0건, 기존 테스트 전체 통과

---

## Phase 6: User Story 5 — 공통 오버레이 디자인 시스템 (Priority: P2)

**Goal**: 모든 오버레이가 동일한 연보라 글래스모피즘 공통 컴포넌트를 사용하도록 통합

**Independent Test**: 게시글 작성 오버레이와 은하 생성 오버레이가 동일한 Overlay 컴포넌트를 사용하는지 확인

> **NOTE**: US5를 US4보다 먼저 배치 — US4(로그인 오버레이)가 US5(공통 오버레이)에 의존

### 테스트 (US5) ⚠️

- [x] T048 [P] [US5] PostOverlay → 공통 Overlay 전환 테스트 — `apps/web/src/widgets/post-overlay/__tests__/PostOverlay.test.tsx` 업데이트 (공통 Overlay 컴포넌트 사용 검증)
- [x] T049 [P] [US5] CreatePostForm → 공통 Overlay 전환 테스트 — 게시글 작성 폼이 Overlay 내에서 렌더링되는지 검증
- [x] T050 [P] [US5] CreateGalaxyForm → 공통 Overlay 전환 테스트 — 은하 생성 폼이 Overlay 내에서 렌더링되는지 검증

### 구현 (US5)

- [x] T051 [US5] PostOverlay → 공통 Overlay 전환 — `apps/web/src/widgets/post-overlay/ui/PostOverlay.tsx` (기존 커스텀 패널을 `<Overlay>` 래핑으로 전환)
- [x] T052 [P] [US5] CreatePostForm 오버레이 전환 — `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx` 내 CreatePostForm 래핑을 `<Overlay>`로 전환
- [x] T053 [P] [US5] CreateGalaxyForm 오버레이 전환 — `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx` 내 CreateGalaxyForm 래핑을 `<Overlay>`로 전환
- [x] T054 [US5] 오버레이 열림 시 3D 씬 인터랙션 차단 — GalaxyScene에서 오버레이 open 상태 시 Canvas 포인터 이벤트 비활성화
- [x] T055 [US5] 오버레이 통일성 검증 — 모든 오버레이(PostOverlay, CreatePostForm, CreateGalaxyForm)가 동일한 Overlay 컴포넌트를 사용하고 동일한 애니메이션/스타일 적용 확인

**Checkpoint**: 모든 오버레이가 동일한 연보라 글래스모피즘 스타일, 동일한 페이드 애니메이션 사용

---

## Phase 7: User Story 4 — 우주 테마 오버레이 로그인 폼 (Priority: P2)

**Goal**: Clerk Custom Flow 기반 오버레이 로그인으로 전환, 페이지 이동 없이 현재 우주 화면 위에서 로그인 완료

**Independent Test**: 비로그인 상태에서 로그인 버튼 클릭 시 오버레이가 우주 배경 위에 표시되고, OAuth 완료 후 자동 닫힘

### 테스트 (US4) ⚠️

- [x] T056 [P] [US4] LoginOverlay 렌더링 테스트 — `apps/web/src/features/social-login/ui/__tests__/LoginOverlay.test.tsx` 신규 (공통 Overlay 내 렌더링, Google/GitHub OAuth 버튼, 닫기 동작)
- [x] T057 [P] [US4] Clerk Custom Flow useSignIn 훅 테스트 — `apps/web/src/features/social-login/ui/__tests__/social-login-buttons.test.tsx` 업데이트 (authenticateWithRedirect → Custom Flow 전환 검증)

### 구현 (US4)

- [x] T058 [US4] LoginOverlay 컴포넌트 생성 — `apps/web/src/features/social-login/ui/LoginOverlay.tsx` (공통 `<Overlay>` 내에 Clerk `useSignIn()` 기반 OAuth 버튼, shadcn/ui Button 사용, 에러 표시, 로딩 상태)
- [x] T059 [US4] SocialLoginButtons Clerk Custom Flow 전환 — `apps/web/src/features/social-login/ui/social-login-buttons.tsx` 수정 (authenticateWithRedirect → Custom Flow, 오버레이 내 동작)
- [x] T060 [US4] AuthStatusBar 로그인 트리거 연동 — `apps/web/src/widgets/auth-status/ui/auth-status-bar.tsx` (로그인 버튼 클릭 시 LoginOverlay 열기, shadcn/ui Button 적용)
- [x] T061 [US4] GalaxyScene에 LoginOverlay 통합 — `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx`에 LoginOverlay 추가, 오버레이 상태 관리
- [x] T062 [US4] OAuth 콜백 처리 중 오버레이 상태 유지 — OAuth 리다이렉트 후 오버레이 자동 닫힘 또는 재표시 로직
- [x] T063 [US4] 모바일 반응형 로그인 오버레이 — LoginOverlay에 반응형 Tailwind 클래스 적용 (sm/md 브레이크포인트)

**Checkpoint**: 비로그인 → 로그인 버튼 클릭 → 오버레이 표시 → OAuth 완료 → 오버레이 자동 닫힘 전체 플로우 동작

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: 전체 스토리에 걸친 최종 정리 및 품질 보증

- [x] T064 [P] AuthStatusBar Tailwind 마이그레이션 — `apps/web/src/widgets/auth-status/ui/auth-status-bar.tsx` (이미 대부분 Tailwind이지만 shadcn/ui Button 통합)
- [x] T065 전체 테스트 스위트 실행 및 회귀 검증 — `yarn workspace @galaxy-board/web test` 전체 통과 확인
- [x] T066 [P] 불필요한 인라인 스타일 유틸리티/상수 정리 — 마이그레이션 후 사용되지 않는 스타일 관련 코드 제거
- [x] T067 3D 장식 요소 성능 최종 검증 — 장식 요소 포함 상태에서 다양한 시나리오(은하 뷰, 행성 포커스, 오버레이 열림) FPS 측정, 30fps 이상 확인
- [x] T068 quickstart.md 검증 — quickstart.md 절차대로 클린 셋업 후 모든 기능 동작 확인

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 의존성 없음 — 즉시 시작
- **Foundational (Phase 2)**: Setup 완료 후 시작 — US4, US5 차단
- **US1 (Phase 3)**: Setup 완료 후 시작 — 다른 스토리와 독립
- **US2 (Phase 4)**: Setup 완료 후 시작 (shadcn/ui 설치 필요) — 다른 스토리와 독립
- **US3 (Phase 5)**: Setup 완료 후 시작 — US2와 병렬 가능 (같은 파일 주의)
- **US5 (Phase 6)**: Foundational(Phase 2) 완료 후 시작 — US4의 전제조건
- **US4 (Phase 7)**: US5(Phase 6) 완료 후 시작 — 공통 Overlay 필요
- **Polish (Phase 8)**: 모든 스토리 완료 후

### User Story Dependencies

```
Phase 1 (Setup)
    ├── Phase 2 (Foundational: 공통 Overlay)
    │       ├── Phase 6 (US5: 오버레이 시스템 통합)
    │       │       └── Phase 7 (US4: 로그인 오버레이)
    │       └────────────────────────────────────────────┐
    ├── Phase 3 (US1: 장식 요소) ─────── 독립 ──────────┤
    ├── Phase 4 (US2: shadcn/ui 전환) ── 독립 ──────────┤
    └── Phase 5 (US3: Tailwind 전환) ─── 독립 ──────────┤
                                                         └── Phase 8 (Polish)
```

### Within Each User Story

1. 테스트 먼저 작성 → 실패 확인
2. 구현 (모델 → 서비스 → UI 순)
3. 테스트 통과 확인
4. 스토리 완료 후 다음 우선순위로 이동

### Parallel Opportunities

- **Phase 1**: T003, T004, T005 병렬 실행 가능
- **Phase 3 (US1)**: T008-T012 테스트 병렬, T013-T017 구현 병렬
- **Phase 4 (US2)**: T021-T025 테스트 병렬, T026-T032 구현 병렬
- **Phase 5 (US3)**: T035-T046 전체 병렬 가능 (모두 다른 파일)
- **Phase 6 (US5)**: T048-T050 테스트 병렬, T052-T053 구현 병렬
- **Phase 7 (US4)**: T056-T057 테스트 병렬
- **US1, US2, US3**: 서로 독립 → 동시 진행 가능

---

## Parallel Example: User Story 1

```bash
# 테스트 병렬 작성:
Task: "Starfield 렌더링 테스트 — apps/web/src/entities/decoration/ui/__tests__/Starfield.test.tsx"
Task: "Meteor 렌더링 테스트 — apps/web/src/entities/decoration/ui/__tests__/Meteor.test.tsx"
Task: "Asteroid 렌더링 테스트 — apps/web/src/entities/decoration/ui/__tests__/Asteroid.test.tsx"
Task: "BlackHole 렌더링 테스트 — apps/web/src/entities/decoration/ui/__tests__/BlackHole.test.tsx"
Task: "Sun 렌더링 테스트 — apps/web/src/entities/decoration/ui/__tests__/Sun.test.tsx"

# 구현 병렬:
Task: "Starfield 컴포넌트 — apps/web/src/entities/decoration/ui/Starfield.tsx"
Task: "Meteor 컴포넌트 — apps/web/src/entities/decoration/ui/Meteor.tsx"
Task: "Asteroid 컴포넌트 — apps/web/src/entities/decoration/ui/Asteroid.tsx"
Task: "BlackHole 컴포넌트 — apps/web/src/entities/decoration/ui/BlackHole.tsx"
Task: "Sun 컴포넌트 — apps/web/src/entities/decoration/ui/Sun.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup 완료
2. Phase 3: US1 (장식 요소) 완료
3. **STOP and VALIDATE**: 은하 보드에서 장식 요소 렌더링 + 30fps 확인
4. 데모 가능

### Incremental Delivery

1. Setup + Foundational → 기반 준비
2. US1 (장식 요소) → 시각적 풍부함 즉시 확인 → 데모 (MVP!)
3. US2 (shadcn/ui) + US3 (Tailwind) → 병렬 진행 → 코드 품질 향상
4. US5 (공통 오버레이) → 디자인 통일
5. US4 (로그인 오버레이) → 사용자 경험 완성
6. Polish → 최종 품질 보증

### Parallel Team Strategy

2명 이상 개발자:

1. 팀 전체: Setup + Foundational 완료
2. 이후:
   - 개발자 A: US1 (장식 요소)
   - 개발자 B: US2 (shadcn/ui) + US3 (Tailwind) — 같은 파일이므로 한 사람이 담당
3. US1, US2/US3 완료 후:
   - 개발자 A: US5 (공통 오버레이)
   - 개발자 B: 코드 리뷰 / 테스트 보강
4. US5 완료 → US4 (로그인 오버레이)

---

## Notes

- [P] 태스크 = 다른 파일, 의존성 없음
- [Story] 라벨 = 사용자 스토리 추적용
- US2와 US3는 동일 파일을 대상으로 하므로 한 개발자가 순차 진행 권장
- 헌법 VI조(TDD): 모든 구현 전 테스트 작성, 실패 확인 후 구현
- 커밋은 태스크 단위 또는 논리적 그룹 단위
- 각 체크포인트에서 스토리 독립 동작 검증
