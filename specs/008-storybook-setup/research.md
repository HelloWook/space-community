# Research: 스토리북 + 디자인 토큰 + WASD + 접근성

**Feature**: 008-storybook-setup
**Date**: 2026-03-26

## 1. Storybook 8 + Next.js 15 + Tailwind CSS v4 설정

**Decision**: Storybook 8.x를 `apps/web/` 워크스페이스에 설치. `@storybook/nextjs` 프레임워크 사용.

**Rationale**:
- Storybook 8은 Next.js App Router 지원 (`@storybook/nextjs`)
- Tailwind CSS v4는 PostCSS 플러그인 방식 → `.storybook/preview.ts`에서 `globals.css` import로 스타일 적용
- 모노레포 환경에서 `apps/web/.storybook/` 디렉토리에 설정 배치

**Alternatives considered**:
- Ladle → Next.js 통합 부족, 거부
- Histoire → Vue 전용, 거부

## 2. 디자인 토큰 정의 전략

**Decision**: CSS 변수(Custom Properties)로 모든 토큰을 `globals.css`에 정의. Tailwind CSS v4는 CSS 변수를 자동으로 유틸리티 클래스로 변환.

**Rationale**:
- 현재 이미 `globals.css`에 shadcn/ui 호환 CSS 변수가 정의됨 (007에서 확장)
- Tailwind CSS v4는 `@theme` 없이 CSS 변수를 직접 참조하므로 추가 설정 불필요
- 스토리북에서 `globals.css`를 import하면 동일 토큰 사용

**추가 정의할 토큰**:
- 타이포그래피: `--font-sans`, `--font-mono`, `--text-xs`~`--text-4xl`, `--leading-tight/normal/relaxed`
- 간격: Tailwind 기본 스케일 사용 (4px 단위), 커스텀 추가 불필요
- 테두리 반경: `--radius` 이미 정의됨, sm/md/lg/xl 확장

## 3. WASD 카메라 컨트롤 구현

**Decision**: `useWASDControls` 커스텀 훅으로 구현. `useFrame` 내에서 키보드 상태를 읽어 카메라 위치를 업데이트. OrbitControls와 공존.

**Rationale**:
- drei `KeyboardControls` 컴포넌트가 있지만 OrbitControls와 충돌 가능성
- 커스텀 훅으로 구현하면 OrbitControls 회전을 유지하면서 WASD 이동만 추가 가능
- `useFrame`에서 카메라의 forward/right 벡터를 계산하여 이동 방향 결정
- 입력 필드 포커스 시 비활성화: `document.activeElement` 태그 확인

**Alternatives considered**:
- drei PointerLockControls → OrbitControls와 호환 불가, 거부
- drei KeyboardControls → OrbitControls 회전과 충돌, 거부
- 커스텀 전체 카메라 시스템 → YAGNI, OrbitControls 확장이 더 단순, 거부

## 4. 타이포그래피 스케일 및 폰트

**Decision**: 시스템 폰트 스택 유지 (`system-ui, -apple-system, sans-serif`). 기본 폰트 크기 16px, 최소 14px. Tailwind 기본 스케일 사용.

**Rationale**:
- 시스템 폰트는 추가 다운로드 없이 각 OS에서 최적 렌더링
- 현재 11~13px 텍스트가 많음 → 최소 14px(캡션)~16px(본문)으로 상향
- Tailwind 기본 `text-sm`(14px), `text-base`(16px) 등 사용

**폰트 크기 매핑**:
| 용도 | 현재 | 변경 후 | Tailwind |
|------|------|---------|----------|
| 캡션/메타 | 11~12px | 14px | text-sm |
| 본문 | 13~14px | 16px | text-base |
| 소제목 | 14~16px | 18px | text-lg |
| 제목 | 18~20px | 24px | text-2xl |
| 대제목 | - | 30px | text-3xl |

## 5. 접근성 대비율 검증

**Decision**: 우주 테마 색상의 WCAG 2.1 AA 대비율 확인 및 조정.

**현재 대비율 분석** (배경 #000000 기준):
- `--foreground` (흰색 #ffffff): 21:1 ✅
- `--muted-foreground` (#9898a8 ≈ HSL 240 5% 65%): ~6.5:1 ✅
- `--destructive` (#e53935): ~4.8:1 ✅
- 기존 `#999`, `#666`, `#555` 회색 → 대비율 부족 가능 ⚠️

**조정 필요 항목**:
- `#666` (3.9:1 실패) → `#8a8a8a` (5.3:1)으로 상향
- `#555` (3.0:1 실패) → `#7a7a7a` (4.6:1)으로 상향
- 카드 배경(#0d0d0d) 위 텍스트도 대비율 확인 필요

## 6. 조작 안내 UI (Controls HUD)

**Decision**: 화면 하단 중앙에 반투명 배경의 안내 텍스트 표시. 첫 인터랙션 후 3초 딜레이 + 1초 페이드아웃.

**Rationale**:
- 헌법 II조: "처음 방문한 사용자도 별도 안내 없이 핵심 기능을 사용할 수 있어야 한다"
- 게임 UI 패턴: 첫 인터랙션 후 자연스럽게 사라지는 힌트
- 세션 스토리지에 "표시 완료" 상태 저장하여 재방문 시 미표시

**Alternatives considered**:
- 상시 표시 → 시각적 방해, 거부
- 툴팁/모달 → 과도한 인터럽션, 거부
