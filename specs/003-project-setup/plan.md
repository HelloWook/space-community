# Implementation Plan: 프로젝트 초기 세팅

**Branch**: `003-project-setup` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-project-setup/spec.md`

## Summary

TypeScript 모노레포(yarn workspaces) 기반으로 Next.js 프론트엔드(FSD 구조)와 NestJS 백엔드(헥사고날 아키텍처)를 구성한다. Docker Compose로 PostgreSQL과 함께 전체 개발 환경을 컨테이너화하고, Jest 기반 테스트 환경과 ESLint/Prettier 린팅 설정을 포함한다.

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 22 LTS
**Primary Dependencies**: Next.js 15.x, NestJS 11.x, Three.js 0.183.x, @react-three/fiber 9.x, @react-three/drei 10.x, Prisma 7.x
**Storage**: PostgreSQL 16 (Docker 컨테이너)
**Testing**: Jest 29.x (프론트엔드: next/jest + jsdom, 백엔드: @swc/jest)
**Target Platform**: WebGL 지원 모던 브라우저 (데스크톱 우선)
**Project Type**: 웹 애플리케이션 (프론트엔드 + 백엔드 API)
**Performance Goals**: 3D 장면 30fps 이상, 개발 서버 시작 10초 이내
**Constraints**: yarn workspaces 모노레포, Docker Compose 통합
**Scale/Scope**: 은하계 게시판 MVP — 은하계(주제), 행성(게시글), 별(좋아요)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 상태 | 검증 |
|------|------|------|
| I. 3D 성능 우선 | ✅ | Three.js + R3F 도입, 성능 목표 30fps 설정 |
| II. 사용자 경험 중심 | ✅ | 프론트엔드 구조가 UX 중심 개발 지원 |
| III. 단순성 (YAGNI) | ✅ | 최소 필수 패키지만 포함, Turborepo 등 불필요한 도구 제외 |
| IV. 스펙 기반 개발 (SDD) | ✅ | speckit 워크플로우에 따라 진행 중 |
| V. 점진적 전달 | ✅ | 각 사용자 스토리 독립 구현 가능한 구조 |
| VI. 테스트 우선 (TDD) | ✅ | Jest 테스트 환경 포함, 샘플 테스트 제공 |
| VII. SOLID 원칙 | ✅ | 헥사고날 아키텍처가 SOLID (특히 DIP, SRP) 자연 지원 |
| FSD 폴더 구조 | ✅ | 프론트엔드 FSD 레이어 구조 적용 |
| 헥사고날 폴더 구조 | ✅ | 백엔드 domain/application/infrastructure 구조 적용 |

## Project Structure

### Documentation (this feature)

```text
specs/003-project-setup/
├── plan.md              # 이 파일
├── research.md          # Phase 0 리서치 결과
├── data-model.md        # Phase 1 데이터 모델 (초기 세팅이므로 최소)
├── quickstart.md        # Phase 1 빠른 시작 가이드
├── contracts/           # Phase 1 API 계약
└── tasks.md             # Phase 2 태스크 목록 (/speckit.tasks)
```

### Source Code (repository root)

```text
galaxy-board/                         # 프로젝트 루트
├── apps/
│   ├── web/                          # Next.js 프론트엔드
│   │   ├── app/                      # Next.js App Router (라우팅 전용)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # src/pages/home re-export
│   │   ├── src/                      # FSD 레이어
│   │   │   ├── app/                  # 프로바이더, 전역 스타일
│   │   │   │   ├── providers/
│   │   │   │   └── styles/
│   │   │   ├── pages/                # 페이지 컴포지션
│   │   │   ├── widgets/              # 대형 UI 블록
│   │   │   ├── features/             # 사용자 인터랙션 기능
│   │   │   ├── entities/             # 도메인 모델 + UI
│   │   │   └── shared/               # 공용 유틸, UI, 설정
│   │   │       ├── ui/
│   │   │       ├── lib/
│   │   │       ├── config/
│   │   │       └── types/
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   ├── jest.config.ts
│   │   └── package.json              # @galaxy-board/web
│   │
│   └── api/                          # NestJS 백엔드
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── modules/              # 기능 모듈 (헥사고날)
│       │   │   └── [module]/
│       │   │       ├── [module].module.ts
│       │   │       ├── domain/       # 순수 비즈니스 로직
│       │   │       │   ├── model/
│       │   │       │   ├── ports/
│       │   │       │   │   ├── in/
│       │   │       │   │   └── out/
│       │   │       │   └── services/
│       │   │       └── adapters/     # 인프라 구현
│       │   │           ├── in/http/
│       │   │           └── out/persistence/
│       │   ├── infrastructure/       # 공통 인프라
│       │   │   ├── database/
│       │   │   ├── config/
│       │   │   └── health/
│       │   └── common/               # 공용 데코레이터, 필터
│       ├── test/
│       │   ├── unit/
│       │   └── e2e/
│       ├── prisma/
│       │   └── schema.prisma
│       ├── nest-cli.json
│       ├── tsconfig.json
│       ├── jest.config.ts
│       ├── .swcrc
│       └── package.json              # @galaxy-board/api
│
├── packages/
│   ├── types/                        # 공유 TypeScript 타입
│   │   └── package.json              # @galaxy-board/types
│   ├── eslint-config/                # 공유 ESLint 설정
│   │   ├── index.js                  # 기본 설정
│   │   ├── next.js                   # Next.js용
│   │   ├── nest.js                   # NestJS용
│   │   └── package.json              # @galaxy-board/eslint-config
│   └── tsconfig/                     # 공유 TypeScript 설정
│       ├── base.json
│       ├── next.json
│       ├── nest.json
│       └── package.json              # @galaxy-board/tsconfig
│
├── docker-compose.yml
├── Dockerfile.web
├── Dockerfile.api
├── .env.example
├── .nvmrc                            # Node.js 22
├── .prettierrc.js
├── package.json                      # 루트: workspaces 정의
├── yarn.lock
└── tsconfig.base.json
```

**Structure Decision**: yarn workspaces 모노레포로 apps/(web, api)과 packages/(types, eslint-config, tsconfig) 구조를 채택. Next.js app/ 디렉토리는 라우팅 전용이며, FSD 레이어는 src/ 하위에 배치. NestJS는 모듈별 헥사고날 구조(domain + adapters) 적용.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| packages/types 별도 패키지 | 프론트/백엔드 간 엔티티 타입 공유 | 타입 중복 정의는 DRY 위반, 동기화 실패 위험 |
| packages/eslint-config 별도 패키지 | 모노레포 전체 린팅 일관성 | 앱별 개별 설정은 규칙 불일치 유발 |
