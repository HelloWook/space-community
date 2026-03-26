# Implementation Plan: 회원 전용 서비스 전환

**Branch**: `006-auth-required` | **Date**: 2026-03-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-auth-required/spec.md`

## Summary

비회원 접근(optional auth)을 제거하고 모든 쓰기 작업(게시글 작성, 별주기, 댓글)을 회원 전용으로 전환한다. 닉네임 입력 필드를 제거하고 로그인 사용자의 정보를 자동 연결하며, 행성당 1인 1별 중복 제한을 추가한다. 읽기(GET) 엔드포인트는 비회원도 접근 가능하게 유지한다.

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 22 LTS
**Primary Dependencies**: Next.js 15.x, NestJS 11.x, Clerk(@clerk/nextjs, @clerk/backend), Prisma 6.x, Zustand, TanStack Query, react-hook-form + zod, shadcn/ui + Tailwind CSS v4
**Storage**: PostgreSQL 16 (Docker), Prisma ORM
**Testing**: Jest (unit/integration), E2E (NestJS supertest)
**Target Platform**: WebGL 지원 모던 브라우저 (데스크톱 우선)
**Project Type**: Web application (monorepo: apps/api + apps/web)
**Performance Goals**: 30fps 이상 3D 렌더링 유지 (이번 기능은 렌더링에 영향 없음)
**Constraints**: 기존 닉네임 기반 데이터 하위 호환 필수, DB 스키마의 기존 nullable 필드 유지
**Scale/Scope**: 기존 컨트롤러 2개(Planet, Star) + DTO 3개 + 프론트엔드 피처 2개(create-post, give-star) 수정

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. 3D 성능 우선 | PASS | 이번 기능은 3D 렌더링에 영향 없음 |
| II. 사용자 경험 중심 | PASS | 닉네임 입력 제거로 UX 간소화, 비로그인 시 명확한 안내 |
| III. 단순성 (YAGNI) | PASS | 기존 가드 교체 + 닉네임 필드 제거만 수행, 새 추상화 없음 |
| IV. 스펙 기반 개발 (SDD) | PASS | specify → clarify → plan 순서 준수 |
| V. 점진적 전달 | PASS | US1(차단) → US2(닉네임 제거) → US3(열람 허용 UX) 순서로 독립 구현 가능 |
| VI. 테스트 우선 (TDD) | PASS | 모든 구현 태스크에서 테스트 먼저 작성 |
| VII. SOLID 원칙 | PASS | 기존 헥사고날 아키텍처 유지, 가드 교체는 SRP 준수 |

## Project Structure

### Documentation (this feature)

```text
specs/006-auth-required/
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
│   └── schema.prisma                          # Star에 unique 제약 추가
├── src/
│   ├── application/
│   │   ├── dto/
│   │   │   ├── planet.dto.ts                  # authorNickname 필드 제거 (CreatePlanetDto)
│   │   │   └── star.dto.ts                    # giverNickname 필드 제거 (CreateStarDto)
│   │   ├── services/
│   │   │   ├── planet.service.ts              # clerkId 필수 전환
│   │   │   └── star.service.ts                # 중복 별주기 검증 추가
│   │   └── mappers/
│   │       └── index.ts                       # 응답 매핑 시 User.name 사용
│   ├── infrastructure/
│   │   ├── api/controllers/
│   │   │   ├── planet.controller.ts           # OptionalClerkAuthGuard → ClerkAuthGuard (POST)
│   │   │   └── star.controller.ts             # OptionalClerkAuthGuard → ClerkAuthGuard
│   │   ├── auth/
│   │   │   └── optional-clerk-auth.guard.ts   # 읽기 전용으로 역할 축소 (또는 제거 검토)
│   │   └── database/repositories/
│   │       └── star.repository.ts             # 중복 별주기 검증 쿼리 추가
│   └── domain/entities/
│       ├── planet.entity.ts                   # authorId 필수 전환 로직
│       └── star.entity.ts                     # giverId 필수 전환 로직

apps/web/
├── src/
│   ├── features/
│   │   ├── create-post/
│   │   │   ├── model/schema.ts                # authorNickname 필드 제거
│   │   │   └── ui/                            # 닉네임 입력 UI 제거
│   │   └── give-star/
│   │       └── ui/GiveStarButton.tsx           # 닉네임 입력 제거, 1클릭 별주기, 로그인 체크
│   └── shared/
│       └── api/                               # API 호출 시 인증 헤더 자동 포함 확인
```

**Structure Decision**: 기존 monorepo 구조(apps/api + apps/web)를 유지. 새 모듈/파일 추가 없이 기존 파일 수정으로 완료.
