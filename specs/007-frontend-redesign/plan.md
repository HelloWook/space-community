# Implementation Plan: 프론트엔드 전체 리디자인

**Branch**: `007-frontend-redesign` | **Date**: 2026-03-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-frontend-redesign/spec.md`

## Summary

프론트엔드 전체 리디자인 — 우주 장식 3D 오브젝트(별 파티클, 유성, 운석, 블랙홀, 태양) 추가, shadcn/ui 컴포넌트 전환 및 우주 테마 커스터마이징, 인라인 스타일→Tailwind CSS 마이그레이션, 공통 오버레이 시스템 구축, Clerk Custom Flow 기반 오버레이 로그인 폼 구현.

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 22 LTS
**Primary Dependencies**: Next.js 15.3.2, React 19.1.0, Three.js 0.183.0, @react-three/fiber 9.1.2, @react-three/drei 10.0.4, shadcn/ui (신규 설치), Tailwind CSS v4, Clerk (@clerk/nextjs 7.0.7), Zustand 5.0.0, TanStack Query 5.64.0
**Storage**: PostgreSQL (Prisma 6.x) — 이 피처에서 스키마 변경 없음
**Testing**: Jest 29 + @testing-library/react 16 + jest-environment-jsdom
**Target Platform**: WebGL 지원 모던 브라우저 (Chrome, Firefox, Safari, Edge 최신 2개 버전), 데스크톱 우선
**Project Type**: Web application (모노레포: apps/web + apps/api + packages/*)
**Performance Goals**: 장식 요소 포함 30fps 이상, 오버레이 열기/닫기 200ms 이내 트랜지션
**Constraints**: 장식 요소 총 수 상한 필요 (별 파티클 제외), FSD 레이어 규칙 준수, 기존 기능 동작 유지
**Scale/Scope**: 인라인 스타일 마이그레이션 대상 17개 파일, shadcn/ui 컴포넌트 약 10종 설치

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 상태 | 비고 |
|------|------|------|
| I. 3D 성능 우선 | ✅ PASS | 장식 요소 수 상한 설정(유성 3개, 운석 10개, 블랙홀 1개, 태양 1개), 별 파티클은 InstancedMesh로 최적화. 30fps 목표 명시 |
| II. 사용자 경험 중심 | ✅ PASS | 오버레이 기반 UI, 부드러운 트랜지션, 직관적 인터랙션 유지 |
| III. 단순성 (YAGNI) | ✅ PASS | 필요한 shadcn/ui 컴포넌트만 설치, 장식 요소는 최소 종류로 한정 |
| IV. 스펙 기반 개발 (SDD) | ✅ PASS | speckit 워크플로우 준수 중 |
| V. 점진적 전달 | ✅ PASS | 5개 사용자 스토리 독립 구현 가능, P1→P2 순서 |
| VI. 테스트 우선 (TDD) | ✅ PASS | 모든 구현 전 테스트 작성. 3D 컴포넌트는 렌더 테스트, UI 컴포넌트는 인터랙션 테스트 |
| VII. SOLID 원칙 | ✅ PASS | 장식 요소 각각 독립 컴포넌트(S), 공통 오버레이는 합성 패턴(O/D) |

## Project Structure

### Documentation (this feature)

```text
specs/007-frontend-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── ui-contracts.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
apps/web/src/
├── app/
│   └── styles/globals.css          # CSS 변수 (우주 테마 토큰 확장)
├── shared/
│   ├── ui/
│   │   ├── shadcn/                 # shadcn/ui 컴포넌트 (Button, Input, Card, Dialog, Select, Textarea, RadioGroup, Slider)
│   │   ├── Canvas3D.tsx            # 기존 3D 캔버스 래퍼
│   │   ├── Scene.tsx               # 기존 씬 컴포넌트
│   │   └── WebGLFallback.tsx       # WebGL 미지원 폴백
│   └── lib/                        # 유틸리티
├── entities/
│   ├── decoration/                 # 신규: 우주 장식 요소 엔티티
│   │   └── ui/
│   │       ├── Starfield.tsx       # 별 파티클 필드 (InstancedMesh)
│   │       ├── Meteor.tsx          # 유성 + 꼬리(trail)
│   │       ├── Asteroid.tsx        # 운석 (궤도 운동)
│   │       ├── BlackHole.tsx       # 블랙홀 (빛 왜곡 셰이더)
│   │       └── Sun.tsx             # 태양 (발광 + 조명)
│   ├── comment/ui/                 # Tailwind 마이그레이션
│   ├── galaxy/ui/                  # Tailwind 마이그레이션
│   ├── planet/ui/                  # Tailwind 마이그레이션
│   └── satellite/ui/               # 기존 유지
├── features/
│   ├── social-login/ui/            # Clerk Custom Flow 오버레이 전환
│   ├── create-post/ui/             # shadcn/ui + Tailwind 전환
│   ├── create-galaxy/ui/           # shadcn/ui + Tailwind 전환
│   ├── customize-planet/ui/        # shadcn/ui + Tailwind 전환
│   ├── give-star/ui/               # Tailwind 전환
│   ├── navigate-galaxy/ui/         # Tailwind 전환
│   └── write-comment/ui/           # shadcn/ui + Tailwind 전환
├── widgets/
│   ├── galaxy-scene/ui/            # 장식 요소 통합, 인라인 스타일 제거
│   ├── post-overlay/ui/            # 공통 오버레이 전환
│   ├── auth-status/ui/             # Tailwind 전환
│   └── overlay/                    # 신규: 공통 오버레이 위젯
│       └── ui/
│           └── Overlay.tsx         # 연보라 글래스모피즘 공통 오버레이
└── views/
    └── home/ui/                    # Tailwind 전환
```

**Structure Decision**: 기존 FSD 구조를 유지하며 확장. 장식 요소는 `entities/decoration/` 레이어에 배치 (비인터랙티브 3D 오브젝트이므로 entity로 분류). 공통 오버레이는 `widgets/overlay/`에 배치 (여러 feature에서 사용하는 합성 컴포넌트).

## Complexity Tracking

> 헌법 위반 없음 — 복잡성 추가 불필요
