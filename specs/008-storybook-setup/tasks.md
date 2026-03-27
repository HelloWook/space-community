# Tasks: 스토리북 세팅 + 디자인 토큰 + WASD + 접근성

**Input**: Design documents from `/specs/008-storybook-setup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui-contracts.md

**Tests**: 테스트 태스크는 spec에서 명시적으로 요청하지 않았으므로 생략. 각 스토리 체크포인트에서 수동 검증.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Storybook 환경 구성)

**Purpose**: Storybook 8.x 설치 및 Next.js 15 + Tailwind CSS v4 통합 설정

- [x] T001 Storybook 10.x 및 관련 의존성 설치 (`@storybook/nextjs`, `@storybook/react`, `storybook`) — `apps/web/package.json`
- [x] T002 스토리북 메인 설정 파일 생성 — `apps/web/.storybook/main.ts` (stories 경로: `src/stories/**/*.stories.tsx`, framework: `@storybook/nextjs`)
- [x] T003 스토리북 프리뷰 설정 파일 생성 — `apps/web/.storybook/preview.ts` (globals.css import, 다크 테마 배경 데코레이터)
- [x] T004 package.json에 스토리북 스크립트 추가 (`storybook`, `build-storybook`) — `apps/web/package.json`
- [x] T005 스토리북 빌드 성공 확인 (`build-storybook` 정상 완료)

**Checkpoint**: `yarn workspace @galaxy-board/web storybook` 실행 시 빈 스토리북이 정상적으로 열림

---

## Phase 2: Foundational (디자인 토큰 CSS 정의)

**Purpose**: 모든 유저 스토리에서 사용할 디자인 토큰을 globals.css에 CSS 변수로 정의

**⚠️ CRITICAL**: US1~US6 모두 이 토큰 정의에 의존

- [x] T006 색상 토큰 정의/검증 — `apps/web/src/app/styles/globals.css`에 FR-008 색상 변수 이미 정의 확인
- [x] T007 [P] 타이포그래피 토큰 정의 — `apps/web/src/app/styles/globals.css`에 `--font-sans`, `--font-mono` 변수 및 기본 `html { font-size: 16px }` 설정 (FR-009)
- [x] T008 [P] 테두리 반경 토큰 확장 — `apps/web/src/app/styles/globals.css`에 `--radius-sm`, `--radius-lg`, `--radius-xl` 추가 (FR-011)

**Checkpoint**: globals.css에 색상/타이포그래피/테두리 반경 토큰이 CSS 변수로 정의됨. 앱이 정상 빌드됨

---

## Phase 3: User Story 2 — 디자인 토큰 시각적 문서화 (Priority: P1) 🎯 MVP

**Goal**: 스토리북 내에 색상/타이포그래피/간격 토큰을 시각적으로 확인할 수 있는 문서 페이지 제공

**Independent Test**: 스토리북 사이드바 "디자인 토큰" 카테고리에서 색상/타이포/간격 페이지 열어 CSS 변수명+값 표시 확인

### Implementation for User Story 2

- [x] T009 [P] [US2] 색상 팔레트 스토리 생성 — `apps/web/src/stories/design-tokens/Colors.stories.tsx`
- [x] T010 [P] [US2] 타이포그래피 스토리 생성 — `apps/web/src/stories/design-tokens/Typography.stories.tsx`
- [x] T011 [P] [US2] 간격 스토리 생성 — `apps/web/src/stories/design-tokens/Spacing.stories.tsx`

**Checkpoint**: 스토리북에서 "Design Tokens" 카테고리 아래 Colors/Typography/Spacing 3개 페이지가 정상 렌더링됨

---

## Phase 4: User Story 3 — 타이포그래피 및 폰트 설정 (Priority: P1)

**Goal**: 프로젝트 전체에 일관된 폰트 패밀리와 타이포그래피 스케일 적용, 본문 16px 이상 보장

**Independent Test**: 앱 전체 페이지에서 본문 텍스트가 16px 이상이고 제목/본문/캡션 시각적 계층 확인

### Implementation for User Story 3

- [x] T012 [US3] 기존 소스에서 `text-[11px]`, `text-[13px]` 등 WCAG 미달 폰트 크기 검색 — 4개 파일 17건 발견
- [x] T013 [US3] 소형 폰트 상향: `text-[11px]`→`text-xs`(12px), `text-[13px]`→`text-sm`(14px), `text-[15px]`→`text-base`, `text-[22px]`→`text-2xl`
- [x] T014 [US3] 제목 계층 확인 — 기존 `text-2xl`/`text-lg` 사용 일관성 확인 완료

**Checkpoint**: `grep -r "text-\[1[0-3]px\]"` 결과 0건. 앱 전체 텍스트가 14px 이상

---

## Phase 5: User Story 1 — 컴포넌트 독립 렌더링 및 상태 확인 (Priority: P1)

**Goal**: 주요 UI 컴포넌트(버튼, 입력, 카드, 오버레이)를 스토리북에서 독립 렌더링하고 다양한 상태 확인

**Independent Test**: 스토리북에서 각 컴포넌트 스토리를 열어 기본/비활성/에러 상태가 정상 렌더링되는지 확인

### Implementation for User Story 1

- [ ] T015 [P] [US1] Button 스토리 생성 — `apps/web/src/stories/ui/Button.stories.tsx` (기본, 비활성, 변형별 상태, args 컨트롤)
- [ ] T016 [P] [US1] Input 스토리 생성 — `apps/web/src/stories/ui/Input.stories.tsx` (기본, 포커스, 에러, 비활성 상태)
- [ ] T017 [P] [US1] Card 스토리 생성 — `apps/web/src/stories/ui/Card.stories.tsx` (기본, 호버, 다양한 콘텐츠)
- [ ] T018 [P] [US1] Overlay 스토리 생성 — `apps/web/src/stories/ui/Overlay.stories.tsx` (기존 오버레이 패널 독립 렌더링, 열기/닫기 상태)

**Checkpoint**: 스토리북 사이드바 "UI" 카테고리에 4개 컴포넌트 스토리가 표시되고 상태 전환 동작

---

## Phase 6: User Story 4 — WASD 키보드 우주 탐험 (Priority: P1)

**Goal**: 은하 보드에서 WASD 키로 카메라 이동 + 하단 조작 안내 HUD 표시

**Independent Test**: 은하 보드에서 WASD로 카메라 4방향 이동, 오버레이/입력 시 비활성화, 하단 안내 표시 후 페이드아웃 확인

### Implementation for User Story 4

- [ ] T019 [US4] `useWASDControls` 훅 구현 — `apps/web/src/shared/lib/hooks/use-wasd-controls.ts` (ui-contracts.md 인터페이스 준수, useFrame 기반 카메라 이동, bounds clamp, input 포커스 시 비활성화)
- [ ] T020 [US4] `ControlsHUD` 컴포넌트 구현 — `apps/web/src/features/navigate-galaxy/ui/ControlsHUD.tsx` (ui-contracts.md 준수, 하단 중앙 반투명 안내, 첫 인터랙션 후 3초+1초 페이드아웃, 세션 스토리지 저장)
- [ ] T021 [US4] GalaxyScene에 WASD 훅 및 ControlsHUD 통합 — `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx` (useWASDControls 호출, ControlsHUD 렌더링, 오버레이 상태 연동)

**Checkpoint**: 은하 보드에서 WASD 이동 동작, 마우스 회전과 동시 사용 가능, 안내 HUD 표시 후 자동 페이드아웃

---

## Phase 7: User Story 5 — 웹 접근성 준수 (Priority: P1)

**Goal**: WCAG 2.1 AA 기준 충족 — 텍스트 대비율, 키보드 탐색, 포커스 링, aria 레이블, 터치 영역

**Independent Test**: Lighthouse 접근성 감사에서 주요 페이지 위반 0건

### Implementation for User Story 5

- [ ] T022 [US5] 색상 대비율 감사 및 수정 — 기존 `#666`, `#555` 등 대비율 미달 색상을 `#8a8a8a`, `#7a7a7a` 이상으로 상향 (research.md 참조), 관련 컴포넌트 파일 수정
- [ ] T023 [P] [US5] 키보드 접근성 보강 — 모든 인터랙티브 요소에 포커스 링(`focus-visible:ring`) 확인/추가, 오버레이에 포커스 트랩 적용
- [ ] T024 [P] [US5] aria 레이블 및 터치 영역 보강 — 버튼/입력에 `aria-label` 누락 확인 및 추가, 인터랙티브 요소 최소 44x44px 보장

**Checkpoint**: 주요 페이지에서 Lighthouse 접근성 점수 90+ 또는 axe 위반 0건

---

## Phase 8: User Story 6 — 3D 컴포넌트 스토리북 미리보기 (Priority: P2)

**Goal**: 행성, 장식 요소 등 3D 컴포넌트를 스토리북 Canvas에서 독립 렌더링

**Independent Test**: 스토리북에서 3D 스토리 열어 Canvas 내 오브젝트 렌더링 및 회전/줌 동작 확인

### Implementation for User Story 6

- [ ] T025 [P] [US6] 3D 스토리용 Canvas 데코레이터 생성 — `apps/web/src/stories/3d/ThreeDecorator.tsx` (Canvas + OrbitControls + 조명 래퍼, 스토리 전환 시 리소스 정리)
- [ ] T026 [P] [US6] Planet 스토리 생성 — `apps/web/src/stories/3d/Planet.stories.tsx` (행성 컴포넌트 독립 렌더링, 색상/크기 args 컨트롤)
- [ ] T027 [P] [US6] Decorations 스토리 생성 — `apps/web/src/stories/3d/Decorations.stories.tsx` (유성, 운석 등 장식 요소 개별 렌더링, 애니메이션 확인)

**Checkpoint**: 스토리북 "3D" 카테고리에서 행성/장식 스토리가 WebGL Canvas 내에 정상 렌더링됨

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: 전체 통합 검증 및 마무리

- [ ] T028 스토리북 빌드 검증 — `yarn workspace @galaxy-board/web build-storybook` 성공 확인
- [ ] T029 [P] 프로덕션 빌드 검증 — `yarn workspace @galaxy-board/web build` 실행하여 스토리북이 프로덕션 번들에 미포함 확인
- [ ] T030 [P] quickstart.md 시나리오 검증 — 스토리북 실행, 개발 서버 실행, 테스트 실행 모두 정상 동작 확인

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 의존성 없음 — 즉시 시작
- **Foundational (Phase 2)**: Phase 1 완료 필요 — 모든 유저 스토리를 BLOCK
- **US2 디자인 토큰 문서 (Phase 3)**: Phase 2 완료 필요 (토큰 정의가 있어야 문서화 가능)
- **US3 타이포그래피 (Phase 4)**: Phase 2 완료 필요 (토큰 정의 기반 적용)
- **US1 컴포넌트 스토리 (Phase 5)**: Phase 1 완료 필요 (스토리북 세팅), Phase 4 완료 권장 (폰트 적용 후 스토리)
- **US4 WASD (Phase 6)**: Phase 2 완료 필요 (토큰 사용), 다른 스토리와 독립
- **US5 접근성 (Phase 7)**: Phase 4 완료 필요 (폰트 크기 상향 후 접근성 감사)
- **US6 3D 스토리 (Phase 8)**: Phase 1 완료 필요 (스토리북 세팅)
- **Polish (Phase 9)**: 모든 유저 스토리 완료 필요

### User Story Dependencies

- **US2 (P1)**: Phase 2 이후 즉시 시작 가능 — 다른 스토리와 독립
- **US3 (P1)**: Phase 2 이후 즉시 시작 가능 — 다른 스토리와 독립
- **US1 (P1)**: Phase 1 이후 시작 가능, Phase 4(US3) 완료 후 권장
- **US4 (P1)**: Phase 2 이후 즉시 시작 가능 — 완전 독립 (다른 파일)
- **US5 (P1)**: Phase 4(US3) 완료 후 시작 — 폰트 크기 적용 후 감사
- **US6 (P2)**: Phase 1 이후 시작 가능 — 다른 스토리와 독립

### Parallel Opportunities

- T007, T008: Foundational 내 병렬 가능
- T009, T010, T011: US2 내 3개 스토리 병렬 가능
- T015, T016, T017, T018: US1 내 4개 스토리 병렬 가능
- T023, T024: US5 내 병렬 가능
- T025, T026, T027: US6 내 3개 스토리 병렬 가능
- US2와 US4: 서로 독립이므로 동시 진행 가능
- US6: US1과 독립이므로 동시 진행 가능

---

## Parallel Example: Phase 3 (US2)

```bash
# 디자인 토큰 문서 스토리 3개를 동시 생성:
Task: "색상 팔레트 스토리 생성 — apps/web/src/stories/design-tokens/Colors.stories.tsx"
Task: "타이포그래피 스토리 생성 — apps/web/src/stories/design-tokens/Typography.stories.tsx"
Task: "간격 스토리 생성 — apps/web/src/stories/design-tokens/Spacing.stories.tsx"
```

---

## Implementation Strategy

### MVP First (Phase 1 + 2 + 3)

1. Phase 1: Storybook 설치 및 설정
2. Phase 2: 디자인 토큰 CSS 정의
3. Phase 3: 디자인 토큰 문서 스토리
4. **STOP and VALIDATE**: 스토리북에서 토큰 문서 정상 표시 확인
5. 바로 다음 스토리로 진행

### Recommended Execution Order

1. Phase 1 → Phase 2 (순차, 기초)
2. Phase 3 (US2) + Phase 6 (US4) 병렬 실행
3. Phase 4 (US3) 완료 후 → Phase 5 (US1) + Phase 7 (US5) 병렬 실행
4. Phase 8 (US6) — 언제든 Phase 1 이후 시작 가능
5. Phase 9 (Polish) — 전체 마무리
