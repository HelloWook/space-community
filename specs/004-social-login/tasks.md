# Tasks: 소셜 로그인

**Input**: Design documents from `/specs/004-social-login/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Constitution VI (TDD NON-NEGOTIABLE)에 따라 모든 기능 구현 전 테스트를 먼저 작성한다.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (공유 인프라)

**Purpose**: Clerk 패키지 설치, 환경 변수 설정, DB 스키마 추가

- [x] T001 Clerk 패키지 설치 — apps/web에 @clerk/nextjs, apps/api에 @clerk/backend svix 추가
- [x] T002 [P] 환경 변수 설정 — apps/web/.env.local (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_SIGN_IN_URL, NEXT_PUBLIC_CLERK_SIGN_UP_URL), apps/api/.env (CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET)
- [x] T003 [P] Prisma User 모델 추가 및 마이그레이션 — apps/api/prisma/schema.prisma에 User 모델(id, clerkId, email, name, imageUrl, providers, createdAt, updatedAt) 추가, Planet/Star에 optional authorId/giverId FK 추가, prisma migrate dev 실행

---

## Phase 2: Foundational (기반 인프라)

**Purpose**: Clerk 프로바이더, 미들웨어, 인증 가드 등 모든 US가 의존하는 핵심 인프라

**⚠️ CRITICAL**: 이 Phase 완료 전까지 US 작업 불가

### 테스트 ⚠️

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현한다**

- [x] T004 [P] ClerkAuthGuard 단위 테스트 작성 — apps/api/src/infrastructure/auth/__tests__/clerk-auth.guard.spec.ts (유효 토큰 → 통과, 무효 토큰 → 401, 토큰 없음 → 401)
- [x] T005 [P] User 도메인 엔티티 단위 테스트 작성 — apps/api/src/domain/entities/__tests__/user.entity.spec.ts (생성, 유효성 검증)
- [x] T006 [P] UserService 단위 테스트 작성 — apps/api/src/application/services/__tests__/user.service.spec.ts (findByClerkId, createFromWebhook, updateFromWebhook, deleteByClerkId)

### 구현

- [x] T007 [P] User 도메인 엔티티 구현 — apps/api/src/domain/entities/user.entity.ts (clerkId, email, name, imageUrl, providers 필드)
- [x] T008 [P] UserRepository 포트 정의 — apps/api/src/domain/ports/user-repository.port.ts (findByClerkId, findByEmail, create, update, delete 인터페이스)
- [x] T009 UserRepository 구현 — apps/api/src/infrastructure/database/repositories/user.repository.ts (Prisma 기반, UserRepositoryPort 구현)
- [x] T010 User DTO 정의 — apps/api/src/application/dto/user.dto.ts (UserResponseDto, CreateUserDto, UpdateUserDto)
- [x] T011 UserService 구현 — apps/api/src/application/services/user.service.ts (findByClerkId, createFromWebhook, updateFromWebhook, deleteByClerkId)
- [x] T012 ClerkAuthGuard 구현 — apps/api/src/infrastructure/auth/clerk-auth.guard.ts (@clerk/backend verifyToken 사용, Bearer 토큰 추출, request.auth에 payload 할당)
- [x] T013 [P] @CurrentUser 데코레이터 구현 — apps/api/src/common/decorators/current-user.decorator.ts (request.auth에서 Clerk userId 추출)
- [x] T014 UserModule 등록 — apps/api/src/user.module.ts (UserService, UserRepository, ClerkAuthGuard 프로바이더 등록, AppModule에 import)
- [x] T015 [P] ClerkProvider 래퍼 구현 — apps/web/src/app/providers/clerk-provider.tsx (ClerkProvider로 앱 래핑, layout.tsx에 통합)
- [x] T016 [P] clerkMiddleware 설정 — apps/web/src/middleware.ts (createRouteMatcher로 보호 라우트 설정, 공개: /sign-in, /sign-up, /sso-callback, /api/webhooks)

**Checkpoint**: 기반 인프라 완료 — 인증 가드, 사용자 서비스, Clerk 프로바이더 준비 완료

---

## Phase 3: User Story 1 — 소셜 계정으로 회원가입 및 로그인 (Priority: P1) 🎯 MVP

**Goal**: Google, GitHub 소셜 로그인 버튼으로 신규 가입 및 기존 로그인이 가능하다

**Independent Test**: 소셜 제공자 인증 흐름을 통해 신규 계정이 생성되고 서비스에 로그인된 상태가 되는지 확인

### 테스트 ⚠️

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현한다**

- [x] T017 [P] [US1] Clerk Webhook 컨트롤러 테스트 작성 — apps/api/src/infrastructure/auth/__tests__/clerk-webhook.controller.spec.ts (user.created → User 생성, 서명 검증 실패 → 400, user.updated → User 갱신, user.deleted → User 삭제)
- [x] T018 [P] [US1] /api/users/me 엔드포인트 테스트 작성 — apps/api/src/infrastructure/api/controllers/__tests__/user.controller.spec.ts (인증 사용자 → 200 + UserResponseDto, 미인증 → 401)
- [x] T019 [P] [US1] 소셜 로그인 버튼 컴포넌트 테스트 작성 — apps/web/src/features/social-login/ui/__tests__/social-login-buttons.test.tsx (Google/GitHub 버튼 렌더링, 클릭 시 authenticateWithRedirect 호출)

### 구현

- [x] T020 [US1] Clerk Webhook 컨트롤러 구현 — apps/api/src/infrastructure/auth/clerk-webhook.controller.ts (POST /api/webhooks/clerk, svix 서명 검증, user.created/updated/deleted 이벤트 처리, UserService 호출)
- [x] T021 [US1] Webhook 엔드포인트를 NestJS 라우팅에 등록 — apps/api/src/user.module.ts에 ClerkWebhookController 추가
- [x] T022 [US1] /api/users/me 컨트롤러 구현 — apps/api/src/infrastructure/api/controllers/user.controller.ts (GET /api/users/me, ClerkAuthGuard 적용, @CurrentUser로 clerkId 추출, UserService.findByClerkId 호출)
- [x] T023 [P] [US1] User 엔티티 타입 정의 — packages/types/src/index.ts에 UserResponse 타입 추가 (id, clerkId, email, name, imageUrl, providers)
- [x] T024 [US1] 소셜 로그인 버튼 컴포넌트 구현 — apps/web/src/features/social-login/ui/social-login-buttons.tsx (useSignIn 훅으로 Google/GitHub authenticateWithRedirect 호출, 로딩/에러 상태 처리)
- [x] T025 [US1] SSO 콜백 페이지 구현 — apps/web/src/app/sso-callback/page.tsx (AuthenticateWithRedirectCallback 렌더링, 로딩 상태 UI)
- [x] T026 [US1] 커스텀 로그인 페이지 구현 — apps/web/src/app/sign-in/[[...sign-in]]/page.tsx (SocialLoginButtons 컴포넌트 배치, 서비스 브랜딩 적용)
- [x] T027 [US1] User 엔티티 API/모델 레이어 구현 — apps/web/src/entities/user/api/user-queries.ts (fetchCurrentUser TanStack Query), apps/web/src/entities/user/model/types.ts, apps/web/src/entities/user/index.ts

**Checkpoint**: US1 완료 — Google/GitHub 소셜 로그인으로 가입/로그인 가능, Webhook으로 DB 동기화, /api/users/me 응답 확인

---

## Phase 4: User Story 2 — 여러 소셜 계정 연동 (Priority: P2)

**Goal**: 로그인한 사용자가 설정 화면에서 추가 소셜 계정을 연동/해제할 수 있다

**Independent Test**: 로그인된 사용자가 설정 화면에서 다른 소셜 계정을 연동한 후, 해당 소셜 계정으로도 로그인할 수 있는지 확인

### 테스트 ⚠️

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현한다**

- [x] T028 [P] [US2] 소셜 계정 관리 컴포넌트 테스트 작성 — apps/web/src/features/manage-social-accounts/ui/__tests__/social-account-list.test.tsx (연동된 계정 목록 렌더링, 연동 버튼 표시, 해제 버튼 표시, 마지막 계정 해제 차단)

### 구현

- [x] T029 [US2] 계정 설정 페이지 구현 — apps/web/src/app/settings/page.tsx (보호 라우트, 사용자 프로필 표시, SocialAccountList 컴포넌트 배치)
- [x] T030 [US2] 소셜 계정 관리 컴포넌트 구현 — apps/web/src/features/manage-social-accounts/ui/social-account-list.tsx (useUser 훅으로 연동 계정 조회, 추가 연동: user.createExternalAccount, 연동 해제: user.externalAccounts[].destroy, 마지막 계정 해제 차단 로직)
- [x] T031 [US2] 설정 페이지 네비게이션 추가 — 기존 UI에 설정 페이지 링크 추가 (로그인 상태에서만 표시)

**Checkpoint**: US2 완료 — 설정 화면에서 Google/GitHub 계정 연동/해제 가능, 마지막 계정 해제 차단

---

## Phase 5: User Story 3 — 이메일 충돌 에러 처리 (Priority: P3)

**Goal**: 동일 이메일로 다른 소셜 제공자 로그인 시 Clerk 자동 연동 동작, 실패 시 에러 안내

**Independent Test**: 동일 이메일로 다른 소셜 제공자를 통해 로그인을 시도하여 자동 연동이 정상 동작하는지 확인

### 테스트 ⚠️

> **NOTE: 테스트를 먼저 작성하고, 실패를 확인한 후 구현한다**

- [x] T032 [P] [US3] SSO 콜백 에러 핸들링 테스트 작성 — apps/web/src/app/sso-callback/__tests__/sso-callback-error.test.tsx (OAuth 에러 시 에러 메시지 표시, 다른 로그인 방법 안내 링크 렌더링)

### 구현

- [x] T033 [US3] SSO 콜백 에러 핸들링 구현 — apps/web/src/app/sso-callback/page.tsx에 에러 상태 처리 추가 (AuthenticateWithRedirectCallback의 signInFallbackRedirectUrl/signUpFallbackRedirectUrl 설정, 에러 메시지 UI)
- [x] T034 [US3] 로그인 페이지 에러 표시 구현 — apps/web/src/app/sign-in/[[...sign-in]]/page.tsx에 URL 파라미터 기반 에러 메시지 표시 (연동 실패 안내, 다른 제공자로 로그인 유도)

**Checkpoint**: US3 완료 — Clerk 자동 이메일 연동 동작, 실패 시 사용자에게 명확한 에러 안내

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 엣지 케이스 처리, 기존 엔드포인트 인증 연동, 최종 검증

- [x] T035 기존 Planet/Star 엔드포인트에 optional 인증 연동 — apps/api/src/infrastructure/api/controllers/planet.controller.ts, star.controller.ts에 ClerkAuthGuard 선택 적용 (인증 시 authorId/giverId 자동 설정, 미인증 시 기존 동작 유지)
- [x] T036 [P] 소셜 제공자 인증 실패 에러 메시지 처리 — apps/web/src/features/social-login/ui/social-login-buttons.tsx에 제공자별 에러 메시지 (인증 서버 무응답, 이메일 미제공 등)
- [x] T037 [P] 로그인 상태 기반 UI 분기 — 기존 메인 화면 헤더에 로그인/로그아웃 상태 표시 (UserButton 또는 커스텀 프로필 UI), 미로그인 시 로그인 버튼 표시
- [x] T038 quickstart.md 기반 E2E 검증 수행 — specs/004-social-login/quickstart.md의 핵심 흐름 검증 절차 실행

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — 즉시 시작 가능
- **Foundational (Phase 2)**: Phase 1 완료 후 시작 — 모든 US를 BLOCK
- **US1 (Phase 3)**: Phase 2 완료 후 시작 — 다른 US에 대한 의존 없음
- **US2 (Phase 4)**: Phase 2 완료 후 시작 — US1과 독립적으로 테스트 가능 (Clerk useUser 훅 사용)
- **US3 (Phase 5)**: Phase 2 완료 후 시작 — US1의 SSO 콜백 페이지 존재 필요 (실질적으로 US1 이후 권장)
- **Polish (Phase 6)**: US1 완료 후 시작 가능, 전체 완료 후 최종 검증

### Within Each User Story

1. 테스트 작성 → 테스트 실패 확인 (Red)
2. 모델/서비스 구현 (Green)
3. 컨트롤러/UI 구현
4. 테스트 통과 확인
5. 리팩토링 (Refactor)
6. 태스크 단위 커밋

### Parallel Opportunities

- Phase 1: T002, T003 병렬 실행 가능
- Phase 2: T004, T005, T006 테스트 병렬 → T007, T008 병렬 → T015, T016 병렬
- Phase 3: T017, T018, T019 테스트 병렬 → T023과 백엔드/프론트엔드 태스크 병렬
- Phase 4: 프론트엔드 위주로 순차 진행
- Phase 5: 프론트엔드 위주로 순차 진행
- Phase 6: T035, T036, T037 병렬 실행 가능

---

## Parallel Example: User Story 1

```bash
# 테스트 병렬 작성 (Red):
Task: "T017 Clerk Webhook 컨트롤러 테스트"
Task: "T018 /api/users/me 엔드포인트 테스트"
Task: "T019 소셜 로그인 버튼 컴포넌트 테스트"

# 백엔드/프론트엔드 구현 병렬:
Task: "T020 Webhook 컨트롤러 구현" + "T024 소셜 로그인 버튼 구현"
Task: "T022 /api/users/me 구현" + "T026 로그인 페이지 구현"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup 완료
2. Phase 2: Foundational 완료 (CRITICAL — 모든 US를 BLOCK)
3. Phase 3: User Story 1 완료
4. **STOP and VALIDATE**: 소셜 로그인 E2E 테스트
5. MVP 데모 가능

### Incremental Delivery

1. Setup + Foundational → 기반 인프라 완료
2. US1 추가 → 소셜 로그인/가입 동작 → MVP 데모
3. US2 추가 → 계정 연동/해제 → 데모
4. US3 추가 → 에러 핸들링 → 데모
5. Polish → 기존 엔드포인트 연동, UI 마무리

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Constitution VI (TDD): 모든 구현 태스크 전에 테스트를 먼저 작성하고 실패를 확인한다
- Constitution III (YAGNI): Clerk가 처리하는 기능은 직접 구현하지 않는다
- 태스크 단위로 커밋한다 (feedback_commit_per_task.md)
- 기존 Planet/Star 엔드포인트는 하위호환을 유지한다 (authorId/giverId nullable)
