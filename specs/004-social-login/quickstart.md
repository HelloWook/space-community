# Quickstart: 소셜 로그인

## 사전 준비

### 1. Clerk 프로젝트 생성

1. [clerk.com](https://clerk.com) 에서 프로젝트 생성
2. 소셜 제공자 설정: Google OAuth, GitHub OAuth 활성화
3. Dashboard → Webhooks → 엔드포인트 추가 (개발: ngrok URL + `/api/webhooks/clerk`)

### 2. 환경 변수

```bash
# apps/web/.env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# apps/api/.env
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

### 3. 패키지 설치

```bash
# 프론트엔드
cd apps/web && yarn add @clerk/nextjs

# 백엔드
cd apps/api && yarn add @clerk/backend svix
```

### 4. DB 마이그레이션

```bash
cd apps/api && npx prisma migrate dev --name add-user-model
```

## 개발 실행

```bash
# 루트에서
yarn dev

# Webhook 로컬 테스트 시
ngrok http 3001
# ngrok URL을 Clerk Dashboard Webhook 엔드포인트에 등록
```

## 핵심 흐름 검증

1. `http://localhost:3000/sign-in` 접속
2. "Google로 로그인" 클릭 → Google OAuth 완료 → 메인 화면 진입
3. DB에서 User 레코드 생성 확인: `npx prisma studio`
4. `GET /api/users/me` (Bearer 토큰 포함) → 사용자 정보 응답 확인
