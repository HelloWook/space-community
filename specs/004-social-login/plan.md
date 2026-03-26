# Implementation Plan: 소셜 로그인

**Branch**: `004-social-login` | **Date**: 2026-03-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-social-login/spec.md`

## Summary

Clerk를 외부 인증 서비스로 사용하여 Google, GitHub 소셜 로그인을 구현한다. 프론트엔드는 Clerk headless API로 커스텀 로그인 UI를 구축하고, 백엔드는 Clerk JWT 검증 가드와 Webhook 수신으로 사용자 데이터를 서비스 DB에 동기화한다.

## Technical Context

**Language/Version**: TypeScript 5.7+, Node.js 22 LTS
**Primary Dependencies**: Next.js 15.x, NestJS 11.x, Clerk(@clerk/nextjs, @clerk/backend), Prisma 6.x
**Storage**: PostgreSQL 16 (Docker), Prisma ORM
**Testing**: Jest + @swc (백엔드), Jest + testing-library (프론트엔드)
**Target Platform**: WebGL 지원 모던 브라우저 (데스크톱 우선)
**Project Type**: Web application (모노레포: apps/api + apps/web)
**Performance Goals**: 소셜 로그인 버튼 클릭~서비스 진입 10초 이내 (SC-001)
**Constraints**: Clerk 무료 플랜 MAU 10,000 제한
**Scale/Scope**: 로그인/회원가입 화면 1개, 계정 설정 화면 1개, Webhook 엔드포인트 1개, Auth 가드 1개

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 상태 | 비고 |
|------|------|------|
| I. 3D 성능 우선 | N/A | 소셜 로그인은 3D 렌더링에 영향 없음 |
| II. 사용자 경험 중심 | ✅ PASS | 소셜 로그인으로 가입 허들 최소화, 커스텀 UI로 일관된 경험 제공 |
| III. 단순성 (YAGNI) | ✅ PASS | Clerk 사용으로 인증 로직 자체 구현 회피, Kakao 제외로 범위 최소화 |
| IV. 스펙 기반 개발 (SDD) | ✅ PASS | specify → clarify → plan 워크플로우 준수 중 |
| V. 점진적 전달 | ✅ PASS | US1(로그인) → US2(연동) → US3(충돌처리) 순서로 독립 구현 가능 |
| VI. 테스트 우선 (TDD) | ✅ PASS | 모든 구현 태스크에서 Red-Green-Refactor 사이클 적용 예정 |
| VII. SOLID 원칙 | ✅ PASS | 헥사고날 아키텍처 포트/어댑터 패턴으로 의존성 역전 유지 |
| 기술 제약: FSD | ✅ PASS | 프론트엔드 auth 관련 코드를 FSD 레이어에 맞게 배치 |
| 기술 제약: 헥사고날 | ✅ PASS | 백엔드 Clerk 연동을 infrastructure 레이어에 배치 |

**Gate 결과**: 모든 원칙 통과. Phase 0 진행 가능.

## Project Structure

### Documentation (this feature)

```text
specs/004-social-login/
├── plan.md              # 이 파일
├── research.md          # Phase 0 출력
├── data-model.md        # Phase 1 출력
├── quickstart.md        # Phase 1 출력
├── contracts/           # Phase 1 출력
└── tasks.md             # Phase 2 출력 (/speckit.tasks)
```

### Source Code (repository root)

```text
apps/api/
├── prisma/
│   └── schema.prisma            # User, SocialConnection 모델 추가
├── src/
│   ├── user.module.ts            # 사용자 모듈
│   ├── domain/
│   │   ├── entities/
│   │   │   └── user.entity.ts    # 사용자 도메인 엔티티
│   │   └── ports/
│   │       └── user-repository.port.ts
│   ├── application/
│   │   ├── dto/
│   │   │   └── user.dto.ts
│   │   └── services/
│   │       └── user.service.ts
│   ├── infrastructure/
│   │   ├── auth/
│   │   │   ├── clerk-auth.guard.ts       # Clerk JWT 검증 가드
│   │   │   └── clerk-webhook.controller.ts # Webhook 수신 컨트롤러
│   │   └── database/
│   │       └── repositories/
│   │           └── user.repository.ts
│   └── common/
│       └── decorators/
│           └── current-user.decorator.ts  # @CurrentUser() 데코레이터
└── tests/

apps/web/
├── src/
│   ├── app/
│   │   ├── sign-in/[[...sign-in]]/page.tsx  # 로그인 페이지
│   │   ├── sign-up/[[...sign-up]]/page.tsx  # 회원가입 페이지
│   │   └── providers/
│   │       └── clerk-provider.tsx           # ClerkProvider 래퍼
│   ├── entities/
│   │   └── user/                            # 사용자 엔티티 (FSD)
│   │       ├── api/
│   │       ├── model/
│   │       └── ui/
│   ├── features/
│   │   ├── social-login/                    # 소셜 로그인 기능 (FSD)
│   │   │   ├── ui/
│   │   │   └── model/
│   │   └── manage-social-accounts/          # 소셜 계정 관리 기능 (FSD)
│   │       ├── ui/
│   │       └── model/
│   └── shared/
│       └── lib/
│           └── clerk.ts                     # Clerk 설정/유틸
└── tests/
```

**Structure Decision**: 기존 모노레포 구조(apps/api, apps/web)를 유지하며, 백엔드는 헥사고날 아키텍처 레이어에 auth 관련 코드를 추가하고, 프론트엔드는 FSD 레이어에 user 엔티티와 social-login 피처를 추가한다.

## Complexity Tracking

> Constitution Check 위반 없음. 해당 없음.
