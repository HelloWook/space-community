# Implementation Plan: 행성 커스터마이징

**Branch**: `002-planet-customization` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-planet-customization/spec.md`

## Summary

게시글 작성 시 행성 외형을 커스터마이징(색상, 크기, 형태, 패턴, 고리)할 수 있는 기능. 기존 Planet 테이블에 외형 컬럼을 추가하고, 프론트엔드에서 실시간 3D 미리보기와 랜덤 생성을 제공한다. 표면 패턴은 셰이더 기반 절차적 생성, 형태는 Three.js 기본 지오메트리 8종을 활용한다.

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 22 LTS
**Primary Dependencies**: Next.js 15.x, NestJS 11.x, Three.js 0.183.x, @react-three/fiber 9.x, @react-three/drei 10.x, Prisma 7.x
**Storage**: PostgreSQL 16 (Docker), Prisma ORM
**Testing**: Jest (단위/e2e)
**Target Platform**: WebGL 지원 모던 브라우저 (데스크톱 우선)
**Project Type**: web-service (모노레포: apps/api + apps/web + packages/*)
**Performance Goals**: 30fps 이상 (커스터마이징된 행성 50개 은하계), 미리보기 반영 0.5초 이내
**Constraints**: 셰이더 기반 패턴은 WebGL 1.0+ 호환 필요
**Scale/Scope**: 기존 001-galaxy-board 위에 확장 — Planet 모델 수정 + 프론트엔드 커스터마이징 UI/3D 추가

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 상태 | 비고 |
|------|------|------|
| I. 3D 성능 우선 | PASS | 셰이더 절차적 패턴은 텍스처 로딩보다 가벼움. 8종 지오메트리는 Three.js 내장. 50개 행성 30fps 목표 유지 |
| II. 사용자 경험 중심 | PASS | 실시간 미리보기 + 랜덤 생성으로 직관적 인터랙션 제공 |
| III. 단순성 (YAGNI) | PASS | Planet 테이블에 컬럼 추가 (별도 테이블 불필요), 고리는 토글만 |
| IV. SDD | PASS | specify → clarify → plan 절차 진행 중 |
| V. 점진적 전달 | PASS | US1(커스터마이징) → US2(랜덤) → US3(미리보기) 독립 구현 가능 |
| VI. TDD | PASS | 모든 구현 전 테스트 작성 예정 |
| VII. SOLID | PASS | 셰이더 로직 분리, 지오메트리 팩토리 분리로 단일 책임 유지 |

## Project Structure

### Documentation (this feature)

```text
specs/002-planet-customization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── rest-api.md      # 변경된 API 엔드포인트 문서
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
# 백엔드 (기존 파일 수정 + 신규)
apps/api/
├── prisma/
│   └── schema.prisma                    # Planet 모델에 외형 컬럼 추가
├── src/
│   ├── domain/
│   │   └── entities/
│   │       └── planet.entity.ts         # 외형 속성 + 유효성 검증 추가
│   ├── application/
│   │   ├── dto/
│   │   │   └── planet.dto.ts            # CreatePlanetDto, Response DTO에 외형 필드 추가
│   │   ├── mappers/
│   │   │   └── index.ts                 # PlanetMapper에 외형 필드 매핑 추가
│   │   └── services/
│   │       └── planet.service.ts        # create, findById, findByGalaxy에 외형 처리
│   └── infrastructure/
│       └── database/
│           └── repositories/
│               └── planet.repository.ts # 외형 필드 select 추가
└── test/
    ├── unit/
    │   ├── domain/
    │   │   └── planet.entity.spec.ts    # 외형 유효성 검증 테스트 추가
    │   └── application/
    │       └── planet.service.spec.ts   # 외형 포함 생성/조회 테스트 추가
    └── e2e/
        └── planets.e2e-spec.ts          # 외형 포함 API 테스트 추가

# 프론트엔드 (기존 파일 수정 + 신규)
apps/web/src/
├── entities/
│   └── planet/
│       ├── model/
│       │   └── index.ts                 # 외형 타입 추가
│       └── ui/
│           ├── Planet3D.tsx             # 커스텀 외형으로 렌더링 (형태, 색상, 패턴, 고리)
│           └── PlanetPreview3D.tsx      # [신규] 미리보기 전용 3D 컴포넌트
├── features/
│   ├── create-post/
│   │   ├── model/
│   │   │   └── schema.ts               # 외형 필드 zod 스키마 추가
│   │   └── ui/
│   │       └── CreatePostForm.tsx       # 커스터마이징 UI 통합
│   └── customize-planet/               # [신규] 행성 커스터마이징 기능
│       ├── model/
│       │   ├── schema.ts               # 외형 옵션 zod 스키마
│       │   └── random.ts               # 랜덤 외형 생성 로직
│       ├── ui/
│       │   ├── CustomizePanel.tsx       # 커스터마이징 패널 (색상 피커, 형태/크기/패턴 선택, 고리 토글)
│       │   └── ColorPicker.tsx          # HEX 컬러 피커 컴포넌트
│       └── __tests__/
│           ├── CustomizePanel.test.tsx  # 패널 UI 테스트
│           └── random.test.ts          # 랜덤 생성 로직 테스트
├── shared/
│   └── lib/
│       └── shaders/                    # [신규] 셰이더 모듈
│           ├── planet-material.ts      # 절차적 패턴 ShaderMaterial 팩토리
│           └── noise.ts               # Simplex noise GLSL 함수
└── widgets/
    └── galaxy-scene/
        └── ui/
            └── GalaxyScene.tsx         # 변경 없음 (Planet3D가 자동 반영)

# 공유 타입
packages/types/src/
└── index.ts                            # PlanetSize, PlanetShape, SurfacePattern enum + 외형 타입 추가
```

**Structure Decision**: 기존 001-galaxy-board 모노레포 구조를 유지. FSD 원칙에 따라 `customize-planet` 기능을 새 feature 슬라이스로 추가. 셰이더는 shared/lib에 배치 (여러 컴포넌트에서 재사용).

## Complexity Tracking

해당 없음 — 헌법 위반 없음.
