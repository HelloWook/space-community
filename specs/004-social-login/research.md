# Research: 소셜 로그인

## 1. Clerk Headless API — 커스텀 소셜 로그인 흐름

**Decision**: `signIn.authenticateWithRedirect()` 단일 호출로 로그인/회원가입 모두 처리
**Rationale**: Clerk는 계정이 없으면 자동으로 SignUp 흐름으로 전환하므로 별도의 sign-up 버튼 불필요. 커스텀 버튼에서 OAuth strategy만 지정하면 됨.
**Alternatives considered**:
- Clerk 프리빌트 컴포넌트(`<SignIn/>`) — 커스텀 디자인 불가로 제외
- NextAuth.js — Clerk 대비 세션 관리/Webhook 등 직접 구현 필요

**구현 흐름**:
1. 커스텀 버튼 클릭 → `signIn.authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: '/sso-callback', redirectUrlComplete: '/' })`
2. `/sso-callback` 페이지에서 `<AuthenticateWithRedirectCallback />` 렌더링
3. Clerk가 OAuth 콜백 처리 후 자동으로 로그인 또는 회원가입 완료

**OAuth Strategy 식별자**: `'oauth_google'`, `'oauth_github'`

## 2. NestJS에서 Clerk JWT 검증

**Decision**: `@clerk/backend`의 `verifyToken()` 사용
**Rationale**: `@clerk/express`는 Express 전용이므로 NestJS에는 `@clerk/backend`가 적합. NestJS Guard 패턴으로 깔끔하게 통합 가능.
**Alternatives considered**:
- `@clerk/express` middleware — NestJS와 호환성 문제 가능
- 직접 JWT 검증(jsonwebtoken + JWKS) — 불필요한 복잡도

**토큰 소스**: `Authorization: Bearer <token>` 헤더 또는 `__session` 쿠키
**핵심 옵션**: `secretKey`(필수), `authorizedParties`(권장), `jwtKey`(네트워크 없는 검증용, 선택)
**반환값**: JWT payload, `sub` 필드가 Clerk 사용자 ID (`user_xxxx`)

## 3. Clerk Webhook 구성

**Decision**: Svix 라이브러리로 서명 검증 후 Prisma로 DB 동기화
**Rationale**: Clerk 공식 권장 방식. Svix가 서명 검증, 재시도, 전달 보장 제공.
**Alternatives considered**:
- Polling Clerk API — 비효율적, rate limit 위험

**이벤트 페이로드 주요 필드**:
- `data.id` — Clerk 사용자 ID
- `data.email_addresses[]` — 이메일 목록 (primary_email_address_id로 기본 이메일 식별)
- `data.first_name`, `data.last_name` — 이름
- `data.image_url` — 프로필 이미지
- `data.external_accounts[]` — 연동된 소셜 계정 목록

**Webhook 헤더**: `svix-id`, `svix-timestamp`, `svix-signature`
**로컬 개발**: ngrok 등 터널 필요 (Clerk가 localhost 접근 불가)

## 4. Prisma User 동기화 패턴

**Decision**: Webhook 기반 동기화, `upsert`로 멱등성 보장
**Rationale**: 중복 Webhook 전달에도 안전하고, clerkId unique 제약으로 데이터 무결성 유지.
**Alternatives considered**:
- API 온디맨드 조회 — Clerk rate limit(1,000 req/10s) 위험, JOIN 불가

**저장 필드**: clerkId(unique), email(unique), name, imageUrl, providers(배열)
**이벤트별 처리**:
- `user.created` → `prisma.user.upsert({ where: { clerkId }, create: {...}, update: {...} })`
- `user.updated` → `prisma.user.update({ where: { clerkId }, data: {...} })`
- `user.deleted` → `prisma.user.delete({ where: { clerkId } })`

## 5. Next.js 15 Clerk Middleware

**Decision**: `clerkMiddleware()` + `createRouteMatcher()`로 보호 라우트 설정
**Rationale**: Clerk 공식 권장 패턴. 기본적으로 모든 라우트가 공개이며, 명시적으로 보호할 라우트만 지정.
**Alternatives considered**: 없음 (Clerk 표준 방식)

**공개 라우트**: `/sign-in`, `/sign-up`, `/sso-callback`, `/api/webhooks/clerk`
**보호 라우트**: `/settings(.*)`, 향후 인증 필요 페이지

## 6. 이메일 충돌 및 계정 연동

**Decision**: Clerk 자동 계정 연동에 의존, 커스텀 충돌 UI 불필요
**Rationale**: Clerk는 동일 인증된 이메일로 다른 소셜 제공자 로그인 시 자동으로 계정을 연동함. Google과 GitHub 모두 인증된 이메일을 반환하므로 US3의 이메일 충돌 시나리오가 Clerk에 의해 자동 처리됨.
**Alternatives considered**:
- 커스텀 충돌 처리 UI — Clerk 자동 연동으로 불필요

**영향**: US3(이메일 충돌 처리)의 구현 복잡도가 크게 감소. Clerk 자동 연동이 실패하는 엣지 케이스(미인증 이메일)에 대한 에러 핸들링만 필요.

## 참고 자료

- Clerk Custom OAuth Flow: clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections
- Clerk verifyToken: clerk.com/docs/reference/backend/verify-token
- Clerk Webhooks: clerk.com/docs/guides/development/webhooks/overview
- Clerk Account Linking: clerk.com/docs/guides/configure/auth-strategies/social-connections/account-linking
- Clerk + Next.js Middleware: clerk.com/docs/reference/nextjs/clerk-middleware
