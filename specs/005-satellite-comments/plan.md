# Implementation Plan: 인공위성 댓글 시스템

**Branch**: `005-satellite-comments` | **Date**: 2026-03-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-satellite-comments/spec.md`

## Summary

게시글(행성)에 댓글/대댓글 기능을 추가하고, 각 댓글을 행성 주위를 도는 인공위성으로 3D 시각화한다. 인공위성은 은색 + 비구체 형태 + 혜성 꼬리 이펙트로 별(Star)과 시각적으로 구분하며, 인공위성 클릭 시 사이드 패널에서 해당 댓글이 포커싱되는 양방향 상호작용을 제공한다. 행성당 댓글 상한은 50개.

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 22 LTS
**Primary Dependencies**: Next.js 15.x, NestJS 11.x, Three.js 0.183.x, @react-three/fiber 9.x, @react-three/drei 10.x, Prisma 6.x, Clerk(@clerk/nextjs, @clerk/backend), Zustand, TanStack Query, react-hook-form + zod
**Storage**: PostgreSQL 16 (Docker), Prisma ORM
**Testing**: Jest (unit/integration)
**Target Platform**: WebGL 지원 모던 브라우저 (데스크톱 우선)
**Project Type**: Web application (monorepo: apps/api + apps/web)
**Performance Goals**: 행성당 50개 인공위성 + 100개 별을 30fps 이상으로 렌더링
**Constraints**: 기존 Star3D 렌더링 패턴과 공존, InstancedMesh 활용 필수
**Scale/Scope**: Comment 모델 추가, Satellite3D 컴포넌트, CommentList UI, 댓글 API 엔드포인트

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. 3D 성능 우선 | PASS | InstancedMesh 사용, 댓글 50개 상한, 성능 측정 예정 |
| II. 사용자 경험 중심 | PASS | 인공위성 클릭 → 댓글 포커싱 양방향 인터랙션 |
| III. 단순성 (YAGNI) | PASS | 댓글/대댓글만 구현, 삭제/수정/신고 미포함 |
| IV. 스펙 기반 개발 (SDD) | PASS | specify → clarify → plan 순서 준수 |
| V. 점진적 전달 | PASS | US1(댓글) → US2(포커싱) → US3(대댓글) 독립 구현 |
| VI. 테스트 우선 (TDD) | PASS | 모든 태스크에서 테스트 먼저 작성 |
| VII. SOLID 원칙 | PASS | 헥사고날 아키텍처 유지, Comment 도메인 분리 |

## Project Structure

### Documentation (this feature)

```text
specs/005-satellite-comments/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md
└── tasks.md             # Phase 2 output (by /speckit.tasks)
```

### Source Code (repository root)

```text
apps/api/
├── prisma/
│   └── schema.prisma                              # Comment 모델 추가
├── src/
│   ├── domain/
│   │   ├── entities/comment.entity.ts              # 댓글 도메인 엔티티
│   │   └── ports/comment-repository.port.ts        # 댓글 리포지토리 포트
│   ├── application/
│   │   ├── dto/comment.dto.ts                      # 댓글 요청/응답 DTO
│   │   ├── services/comment.service.ts             # 댓글 비즈니스 로직
│   │   └── mappers/index.ts                        # CommentMapper 추가
│   ├── infrastructure/
│   │   ├── api/controllers/comment.controller.ts   # 댓글 REST API
│   │   └── database/repositories/comment.repository.ts
│   └── comment.module.ts                           # 댓글 NestJS 모듈

apps/web/
├── src/
│   ├── entities/comment/
│   │   ├── api/hooks.ts                            # 댓글 API 훅
│   │   ├── ui/CommentList.tsx                      # 댓글 목록 UI
│   │   └── index.ts
│   ├── entities/satellite/
│   │   └── ui/Satellite3D.tsx                      # 인공위성 3D 컴포넌트
│   ├── features/write-comment/
│   │   ├── ui/WriteCommentForm.tsx                 # 댓글 작성 폼
│   │   └── model/schema.ts                         # 댓글 폼 유효성 스키마
│   └── widgets/
│       ├── post-overlay/ui/PostOverlay.tsx          # 댓글 목록 통합
│       └── galaxy-scene/ui/GalaxyScene.tsx          # Satellite3D 통합

packages/types/
└── src/index.ts                                    # Comment 타입 추가
```

**Structure Decision**: 기존 monorepo 구조(apps/api + apps/web) 유지. Comment는 Star와 유사한 패턴으로 별도 모듈/엔티티로 구성. Satellite3D는 Star3D와 동일한 entities 레이어에 배치.
