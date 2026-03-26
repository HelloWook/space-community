# Implementation Plan: 스토리북 세팅 + 디자인 토큰 + WASD + 접근성

**Branch**: `008-storybook-setup` | **Date**: 2026-03-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-storybook-setup/spec.md`

## Summary

스토리북 개발 환경 세팅, 디자인 토큰(색상/타이포그래피/간격) 체계 정의 및 문서화, WASD 키보드 우주 탐험 시스템, 폰트 크기 상향 및 WCAG 2.1 AA 접근성 준수.

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 22 LTS
**Primary Dependencies**: Next.js 15.3.2, React 19.1.0, Storybook 8.x, Three.js 0.183.0, @react-three/fiber 9.x, @react-three/drei 10.x, shadcn/ui, Tailwind CSS v4
**Storage**: N/A (프론트엔드 전용 피처)
**Testing**: Jest 29 + @testing-library/react 16, Storybook interaction tests
**Target Platform**: WebGL 지원 모던 브라우저, 데스크톱 우선
**Project Type**: Web application (모노레포: apps/web)
**Performance Goals**: 스토리북 핫 리로드 3초 이내, WASD 이동 시 30fps 유지
**Constraints**: FSD 레이어 규칙, 프로덕션 번들에 스토리북 미포함, WCAG 2.1 AA 준수
**Scale/Scope**: 디자인 토큰 ~30개 정의, 컴포넌트 스토리 10+개, WASD 카메라 시스템 1개, 접근성 감사 대상 UI 컴포넌트 ~15개

## Constitution Check

| 원칙 | 상태 | 비고 |
|------|------|------|
| I. 3D 성능 우선 | ✅ PASS | WASD 이동은 useFrame 기반, 30fps 유지. 성능 영향 측정 |
| II. 사용자 경험 중심 | ✅ PASS | WASD 직관적 탐험, 조작 안내 UI, 폰트 크기 상향 |
| III. 단순성 (YAGNI) | ✅ PASS | 필요한 토큰만 정의, WASD는 기존 OrbitControls 확장 |
| IV. 스펙 기반 개발 (SDD) | ✅ PASS | speckit 워크플로우 준수 |
| V. 점진적 전달 | ✅ PASS | 6개 스토리 독립 구현 가능 |
| VI. 테스트 우선 (TDD) | ✅ PASS | 모든 구현 전 테스트 작성 |
| VII. SOLID 원칙 | ✅ PASS | WASD 컨트롤러 독립 모듈, 디자인 토큰 단일 소스 |

## Project Structure

### Documentation (this feature)

```text
specs/008-storybook-setup/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contracts.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── .storybook/                       # 신규: 스토리북 설정
│   ├── main.ts                       # 스토리북 메인 설정
│   └── preview.ts                    # 글로벌 데코레이터 (Tailwind, 테마)
├── src/
│   ├── app/styles/globals.css        # 디자인 토큰 확장 (타이포그래피, 간격)
│   ├── shared/
│   │   ├── ui/
│   │   │   └── shadcn/               # 기존 shadcn 컴포넌트
│   │   └── lib/
│   │       └── hooks/
│   │           └── use-wasd-controls.ts  # 신규: WASD 카메라 컨트롤 훅
│   ├── entities/
│   │   └── decoration/               # 기존 장식 요소
│   ├── features/
│   │   └── navigate-galaxy/
│   │       └── ui/
│   │           └── ControlsHUD.tsx   # 신규: 조작 안내 UI
│   ├── widgets/
│   │   └── galaxy-scene/
│   │       └── ui/GalaxyScene.tsx     # WASD 통합
│   └── stories/                      # 신규: 스토리북 스토리
│       ├── design-tokens/
│       │   ├── Colors.stories.tsx
│       │   ├── Typography.stories.tsx
│       │   └── Spacing.stories.tsx
│       ├── ui/
│       │   ├── Button.stories.tsx
│       │   ├── Input.stories.tsx
│       │   ├── Card.stories.tsx
│       │   └── Overlay.stories.tsx
│       └── 3d/
│           ├── Planet.stories.tsx
│           └── Decorations.stories.tsx
```

**Structure Decision**: 스토리북 설정은 `.storybook/`에, 스토리 파일은 `src/stories/`에 카테고리별 배치. WASD 훅은 `shared/lib/hooks/`에 위치 (여러 위젯에서 재사용 가능). 조작 안내 UI는 `features/navigate-galaxy/`에 배치 (은하 탐색 기능의 일부).

## Complexity Tracking

> 헌법 위반 없음 — 복잡성 추가 불필요
