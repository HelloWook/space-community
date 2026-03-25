# Implementation Plan: 은하계 게시판

**Branch**: `001-galaxy-board` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-galaxy-board/spec.md`

## Summary

Three.js 기반 3D 우주 공간에서 은하계(주제), 행성(게시글), 별(좋아요) 시스템을 구현하는 인터랙티브 게시판. NestJS 백엔드(헥사고날 아키텍처)와 Next.js 프론트엔드(FSD 구조)로 구성된 모노레포 프로젝트.

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 22 LTS
**Primary Dependencies**:
- **Frontend**: Next.js 15.x, React 19, Three.js 0.183.x, @react-three/fiber 9.x, @react-three/drei 10.x, Zustand 5.x, TanStack Query 5.x, react-hook-form 7.x, Zod 3.x, shadcn/ui, Tailwind CSS 4.x
- **Backend**: NestJS 11.x, Prisma 6.x, class-validator 0.15.x, class-transformer 0.5.x

**Storage**: PostgreSQL 16 (Docker), Prisma ORM
**Testing**: Jest 29 + @testing-library/react (프론트엔드), Jest 29 + Supertest (백엔드 E2E), SWC 기반 트랜스파일
**Target Platform**: WebGL 지원 모던 브라우저 (Chrome, Firefox, Safari, Edge 최신 2개 버전), 데스크톱 우선
**Project Type**: Web application (모노레포: apps/api + apps/web + packages/*)
**Performance Goals**: 30fps 이상 (행성 50개 + 별 500개 장면), 초기 로딩 3초 이내, 전환 1초 이내
**Constraints**: 게시글당 별 최대 100개, 페이지당 행성 50개, WebGL 미지원 시 폴백
**Scale/Scope**: 데스크톱 브라우저 사용자, 다수 은하계/게시글 지원

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 상태 | 비고 |
|------|------|------|
| I. 3D 성능 우선 | ✅ PASS | 행성 50개/페이지, 별 100개/행성 상한 설정. 페이지네이션 적용 |
| II. 사용자 경험 중심 | ✅ PASS | 카메라 애니메이션 전환, 오버레이 패널 UI, 직관적 인터랙션 |
| III. 단순성 (YAGNI) | ✅ PASS | 현재 필요한 CRUD + 3D 시각화만 구현. 인증/수정/삭제 제외 |
| IV. 스펙 기반 개발 (SDD) | ✅ PASS | speckit 워크플로우 준수 |
| V. 점진적 전달 | ✅ PASS | 사용자 스토리별 독립 구현 가능 구조 |
| VI. 테스트 우선 (TDD) | ✅ PASS | Red-Green-Refactor 사이클 준수 필요 |
| VII. SOLID 원칙 | ✅ PASS | 헥사고날 아키텍처(백엔드) + FSD(프론트엔드)로 자연스럽게 충족 |

**기술 제약 충족**:
- ✅ Three.js 기반 3D 렌더링
- ✅ 닉네임 입력 방식 사용자 식별
- ✅ 마크다운 게시글
- ✅ PostgreSQL 서버 기반 영구 저장소
- ✅ Zustand + TanStack Query + react-hook-form + zod
- ✅ shadcn/ui + Tailwind CSS v4
- ✅ FSD 프론트엔드 구조
- ✅ 헥사고날 아키텍처 백엔드 구조

## Project Structure

### Documentation (this feature)

```text
specs/001-galaxy-board/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
# 모노레포: Yarn Workspaces
apps/
├── api/                          # NestJS 백엔드 (헥사고날 아키텍처)
│   ├── prisma/
│   │   ├── schema.prisma         # DB 스키마
│   │   └── seed.ts               # 시드 데이터
│   ├── src/
│   │   ├── main.ts               # 앱 진입점
│   │   ├── app.module.ts         # 루트 모듈
│   │   ├── domain/               # 도메인 레이어
│   │   │   ├── entities/         # 순수 도메인 엔티티
│   │   │   └── ports/            # 리포지토리 인터페이스
│   │   ├── application/          # 애플리케이션 레이어
│   │   │   ├── dto/              # DTO
│   │   │   ├── services/         # 비즈니스 로직
│   │   │   └── mappers/          # 엔티티 ↔ DTO 매핑
│   │   ├── infrastructure/       # 인프라 레이어
│   │   │   ├── api/controllers/  # REST 컨트롤러
│   │   │   ├── api/filters/      # 예외 필터
│   │   │   ├── database/         # Prisma 서비스 & 리포지토리 구현
│   │   │   └── health/           # 헬스 체크
│   │   └── generated/prisma/     # Prisma 생성 클라이언트
│   └── test/
│       ├── unit/                 # 단위 테스트
│       └── e2e/                  # E2E 테스트
└── web/                          # Next.js 프론트엔드 (FSD)
    └── src/
        ├── app/                  # Next.js App Router
        ├── views/                # 페이지 레벨 (FSD pages → views)
        ├── widgets/              # 대형 합성 컴포넌트
        ├── features/             # 사용자 인터랙션 기능
        ├── entities/             # 도메인 엔티티 (API 훅, 스토어, 3D UI)
        └── shared/               # 공유 유틸리티, API 클라이언트, UI

packages/
├── types/                        # 공유 TypeScript 타입
├── tsconfig/                     # 공유 TS 설정
└── eslint-config/                # 공유 ESLint 설정
```

**Structure Decision**: 모노레포(Yarn Workspaces) + 웹 애플리케이션 구조 선택. 프론트엔드(FSD)와 백엔드(헥사고날)가 독립적으로 개발/배포 가능하며, `packages/types`를 통해 타입 공유.

## Constitution Re-Check (Post Phase 1 Design)

| 원칙 | 상태 | 설계 반영 근거 |
|------|------|---------------|
| I. 3D 성능 우선 | ✅ PASS | InstancedMesh(별), 페이지네이션(50개/페이지), 프러스텀 컬링 적용 |
| II. 사용자 경험 중심 | ✅ PASS | useFrame+lerp 카메라 전환, DOM 오버레이 패널, 클릭 가드 훅 |
| III. 단순성 (YAGNI) | ✅ PASS | 현재 스펙만 구현, 추가 추상화 없음, 닉네임 기반 식별 |
| IV. 스펙 기반 개발 (SDD) | ✅ PASS | spec → research → data-model → contracts → tasks 순서 완료 |
| V. 점진적 전달 | ✅ PASS | P1 스토리(은하계 탐색 → 게시글 → 별) 순차 구현 가능 |
| VI. 테스트 우선 (TDD) | ✅ PASS | 도메인 엔티티, 서비스, 컨트롤러 E2E, 프론트엔드 컴포넌트 테스트 구조 확립 |
| VII. SOLID 원칙 | ✅ PASS | 포트/어댑터 DI, 엔티티별 단일 책임, FSD 레이어 분리 |

**결론**: 모든 헌법 원칙 충족. 위반 사항 없음.

## Complexity Tracking

해당 없음 — Constitution Check에서 위반 사항 없음.
