# Research: 프론트엔드 전체 리디자인

**Feature**: 007-frontend-redesign
**Date**: 2026-03-26

## 1. shadcn/ui 초기 설정 및 우주 테마 커스터마이징

**Decision**: shadcn/ui를 `apps/web/` 워크스페이스에 설치하고, 기존 `globals.css` CSS 변수를 우주 테마(연보라 악센트)로 확장한다.

**Rationale**:
- 프로젝트에 이미 `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`가 설치되어 있어 shadcn/ui의 핵심 의존성이 충족됨
- `apps/web/src/shared/ui/shadcn/` 디렉토리가 이미 존재(비어있음) — 여기에 컴포넌트 배치
- `globals.css`에 shadcn/ui 호환 CSS 변수(`--background`, `--foreground`, `--primary` 등)가 이미 정의됨
- 연보라 악센트 추가: `--accent` 값을 `270 50% 40%` (보라 계열)로 변경

**Alternatives considered**:
- Radix UI 직접 사용 → shadcn/ui가 Radix 기반이면서 커스터마이징이 더 쉬움, 거부
- Material UI → 프로젝트 테마와 부적합, 번들 크기 과대, 거부

## 2. 인라인 스타일 → Tailwind 마이그레이션 전략

**Decision**: 컴포넌트별 점진적 마이그레이션. shadcn/ui 전환 대상 컴포넌트는 UI 교체와 동시에 마이그레이션. 나머지는 개별 마이그레이션.

**Rationale**:
- 대상 파일 17개로 파악됨 (grep 결과)
- Three.js Canvas 관련 인라인 스타일(`width`, `height`, WebGL 속성)은 유지 — Tailwind로 대체 불가
- 오버레이/패널의 `position: absolute/fixed`, `backgroundColor: rgba(...)` 등은 Tailwind 유틸리티로 1:1 대응 가능
- 컴포넌트당 마이그레이션하면 기존 테스트로 회귀 검증 가능

**Alternatives considered**:
- 일괄 마이그레이션 → 회귀 리스크 높음, 거부
- CSS Modules → Tailwind과 중복, 프로젝트 방향과 불일치, 거부

## 3. 우주 장식 3D 오브젝트 구현 접근

**Decision**: 각 장식 요소를 독립 R3F 컴포넌트로 구현. 별 파티클은 `InstancedMesh`, 유성은 `Trail` + `useFrame`, 운석은 `useFrame` 궤도 애니메이션, 블랙홀은 커스텀 셰이더, 태양은 `PointLight` + 발광 메시.

**Rationale**:
- `@react-three/drei`에 `Stars`, `Trail` 등 유틸리티가 이미 포함됨 — 별 파티클에 활용 가능
- 헌법 I조(3D 성능): 오브젝트 수 상한 필수
  - 별 파티클: drei `Stars` 컴포넌트 (GPU 인스턴싱, 성능 영향 최소)
  - 유성: 최대 3개 동시 렌더링 (Trail 효과가 GPU 부하 유발)
  - 운석: 최대 10개 (단순 지오메트리, 낮은 부하)
  - 블랙홀: 1개 (셰이더 연산 비용 높음)
  - 태양: 1개 (PointLight 추가)
- FSD 구조: `entities/decoration/` 레이어에 배치 — 데이터 의존성 없는 순수 시각 요소

**Alternatives considered**:
- 파티클 시스템으로 통합 → 요소별 독립 제어 어려움, 거부
- 2D 스프라이트 오버레이 → 3D 깊이감/시차 효과 불가, 거부

## 4. 공통 오버레이 시스템

**Decision**: `widgets/overlay/ui/Overlay.tsx` 공통 컴포넌트 생성. shadcn/ui `Dialog` 기반으로 커스터마이징하여 연보라 글래스모피즘 스타일 적용.

**Rationale**:
- 현재 GalaxyScene.tsx 내에 PostOverlay, CreatePostForm, CreateGalaxyForm이 각각 독립적인 인라인 스타일로 동일 패턴 반복 (`rgba(10, 10, 30, 0.92)`, `position: fixed`, `zIndex: 50/100`)
- shadcn/ui Dialog를 기반으로 하면 접근성(ESC 닫기, 포커스 트랩), 애니메이션이 기본 제공됨
- 글래스모피즘: `backdrop-blur-md bg-purple-950/80 border border-purple-500/20`

**Alternatives considered**:
- 순수 커스텀 모달 → 접근성/애니메이션 직접 구현 필요, 거부
- shadcn/ui Sheet(사이드 패널) → 현재 오른쪽 패널 패턴과 유사하나, Dialog가 더 범용적, Dialog 선택

## 5. Clerk Custom Flow 오버레이 로그인

**Decision**: Clerk의 `useSignIn()` / `useSignUp()` 훅을 사용한 Custom Flow로 전환. 공통 오버레이 컴포넌트 내에 로그인 UI 배치.

**Rationale**:
- 현재 `authenticateWithRedirect`로 페이지 이동 발생 — 오버레이 방식과 호환 불가
- Clerk Custom Flow는 리다이렉트 없이 OAuth 처리 가능 (`authenticateWithPopup` 또는 커스텀 플로우)
- `@clerk/nextjs` 7.x에서 Custom Flow API 완전 지원
- 기존 `social-login-buttons.tsx`를 Custom Flow 방식으로 리팩토링

**Alternatives considered**:
- Clerk Hosted UI (기본 제공 모달) → 커스텀 테마 적용 어려움, 우주 테마와 부조화, 거부
- iframe 삽입 → 보안 문제, UX 불일치, 거부

## 6. 설치할 shadcn/ui 컴포넌트 목록

**Decision**: 필요한 컴포넌트만 선별 설치 (YAGNI 원칙)

| 컴포넌트 | 사용처 |
|----------|--------|
| Button | 모든 폼, 오버레이, 네비게이션 |
| Input | 게시글/댓글 작성, 로그인 |
| Textarea | 게시글/댓글 작성 |
| Card | 댓글 카드, 정보 표시 |
| Dialog | 공통 오버레이 기반 |
| Select | 행성 커스터마이즈 (shape, pattern) |
| RadioGroup | 행성 커스터마이즈 옵션 |
| Slider | 행성 커스터마이즈 (size) |

**Rationale**: 현재 UI에서 사용 중인 요소를 1:1 매핑. 미사용 컴포넌트는 설치하지 않음.

## 7. 성능 측정 전략

**Decision**: 장식 요소 추가 전/후 FPS 측정. `@react-three/drei`의 `Stats` 컴포넌트 또는 `useFrame` 내 `performance.now()` 기반 측정.

**Rationale**:
- 헌법 I조: "새로운 시각 요소 추가 시 성능 영향을 측정하고 기록해야 한다"
- 개발 환경에서 Stats 패널로 실시간 FPS 모니터링
- 장식 요소 수 조절 가능한 구조 (props로 count 제어)
