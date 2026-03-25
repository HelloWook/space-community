# Implementation Plan: 은하계 게시판

**Branch**: `001-galaxy-board` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-galaxy-board/spec.md`

## Summary

Three.js 기반 3D 우주 공간에서 은하계(주제), 행성(게시글), 별(좋아요) 메타포를 활용한 게시판 시스템.
프론트엔드는 Next.js 15 + @react-three/fiber로 3D 시각화를, 백엔드는 NestJS 11 + Prisma + PostgreSQL로 데이터 영속화를 담당한다.
카메라 전환 애니메이션, InstancedMesh 기반 별 렌더링, 커서 기반 페이지네이션으로 성능과 UX를 확보한다.

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 22 LTS
**Primary Dependencies**:
- 프론트엔드: Next.js 15.x, React 19, Three.js 0.183, @react-three/fiber 9.x, @react-three/drei 10.x, Zustand 5, TanStack Query 5, react-hook-form 7, zod 3, shadcn/ui, Tailwind CSS 4
- 백엔드: NestJS 11.x, Prisma 7.x, class-validator, class-transformer
- 공유: @galaxy-board/types

**Storage**: PostgreSQL 16 (Docker), Prisma ORM
**Testing**: Jest 29, @testing-library/react, Supertest (e2e)
**Target Platform**: WebGL 지원 모던 브라우저 (Chrome, Firefox, Safari, Edge 최신 2개 버전), 데스크톱 우선
**Project Type**: Web application (monorepo — apps/web + apps/api)
**Performance Goals**: 30fps 이상 (행성 50개 + 별 500개 씬), 은하계 전환 1초 이내, 초기 로딩 3초 이내
**Constraints**: 행성당 별 최대 100개, 페이지당 행성 50개
**Scale/Scope**: 닉네임 기반 사용자 식별, 수정/삭제 미포함 (초기 버전)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 사전 검증 | 사후 검증 | 비고 |
|------|----------|----------|------|
| I. 3D 성능 우선 | ✅ | ✅ | InstancedMesh(별), 페이지당 50개 행성, 프러스텀 컬링 |
| II. 사용자 경험 중심 | ✅ | ✅ | OrbitControls + lerp 카메라 전환, 오버레이 패널 |
| III. 단순성 (YAGNI) | ✅ | ✅ | 수정/삭제 미포함, LOD 미적용 (현재 규모 불필요) |
| IV. SDD | ✅ | ✅ | speckit 워크플로우 준수 중 |
| V. 점진적 전달 | ✅ | ✅ | P1(탐색/게시글/별) → P2(은하계 생성) 분리 |
| VI. TDD | ✅ | ✅ | 태스크 단계에서 Red-Green-Refactor 적용 |
| VII. SOLID | ✅ | ✅ | 헥사고날(백엔드) + FSD(프론트엔드), 포트/어댑터 패턴 |

**게이트 결과**: 통과 — 위반 사항 없음

## Project Structure

### Documentation (this feature)

```text
specs/001-galaxy-board/
├── plan.md              # 이 파일
├── research.md          # Phase 0 리서치 결과
├── data-model.md        # 데이터 모델 정의
├── quickstart.md        # 개발 환경 설정 가이드
├── contracts/
│   └── rest-api.md      # REST API 계약
└── tasks.md             # (Phase 2에서 생성)
```

### Source Code (repository root)

```text
apps/
  web/                              # Next.js 15 프론트엔드
    src/
      app/                          # Next.js App Router (라우트 정의)
        layout.tsx
        page.tsx
        providers/
      views/                        # FSD views (화면 레이아웃)
        home/                       # 우주 공간 뷰
        galaxy/                     # 은하계 내부 뷰
      widgets/                      # FSD widgets (복합 UI 섹션)
        galaxy-scene/               # 3D 씬 전체 조합
        post-overlay/               # 게시글 오버레이 패널
      features/                     # FSD features (사용자 상호작용)
        navigate-galaxy/            # 은하계 탐색/진입/복귀
        create-post/                # 게시글 작성
        give-star/                  # 별 부여
        create-galaxy/              # 은하계 생성 (P2)
      entities/                     # FSD entities (도메인 모델)
        galaxy/
          model/                    # Galaxy 타입, Zustand 스토어
          api/                      # TanStack Query 훅
          ui/                       # Galaxy3D 컴포넌트
        planet/
          model/
          api/
          ui/                       # Planet3D 컴포넌트
        star/
          model/
          api/
          ui/                       # Star3D (InstancedMesh)
      shared/                       # FSD shared (유틸리티)
        api/                        # API 클라이언트, 쿼리키 팩토리
        ui/                         # Canvas3D 래퍼, shadcn 컴포넌트
        lib/                        # 유틸리티 함수
        config/                     # 환경 설정
    __tests__/                      # 통합 테스트

  api/                              # NestJS 11 백엔드
    src/
      domain/                       # 도메인 계층 (외부 의존성 없음)
        entities/                   # Galaxy, Planet, Star 도메인 엔티티
        ports/                      # 리포지토리 인터페이스 (포트)
      application/                  # 애플리케이션 계층
        services/                   # 유스케이스 서비스
        dto/                        # 요청/응답 DTO
        mappers/                    # 도메인 ↔ DTO 매퍼
      infrastructure/               # 인프라 계층
        api/
          controllers/              # REST 컨트롤러
          filters/                  # 예외 필터
        database/
          prisma.service.ts         # Prisma 서비스
          repositories/             # Prisma 리포지토리 구현체 (어댑터)
      app.module.ts
      main.ts
    prisma/
      schema.prisma
    test/
      unit/                         # 단위 테스트
      e2e/                          # e2e 테스트

packages/
  types/                            # 공유 타입 정의
  tsconfig/                         # 공유 TypeScript 설정
  eslint-config/                    # 공유 ESLint 설정
```

**Structure Decision**: Yarn 워크스페이스 모노레포 구조 (이미 003-project-setup에서 구성됨). 프론트엔드는 FSD, 백엔드는 헥사고날 아키텍처를 따른다.

## Complexity Tracking

> 위반 사항 없음 — 해당 없음
