# Quickstart: 회원 전용 서비스 전환

## 개발 환경 준비

```bash
# 의존성 설치
yarn install

# DB 실행 (Docker)
docker compose up -d

# Prisma 마이그레이션
cd apps/api && npx prisma migrate dev

# API 서버 실행
cd apps/api && yarn dev

# 웹 앱 실행
cd apps/web && yarn dev
```

## 환경 변수

기존 Clerk 환경 변수가 설정되어 있어야 함:

```env
# apps/web/.env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# apps/api/.env
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
```

## 주요 수정 파일

### 백엔드 (apps/api)

1. `prisma/schema.prisma` — Star에 `@@unique([giverId, planetId])` 추가
2. `src/infrastructure/api/controllers/planet.controller.ts` — 가드 교체
3. `src/infrastructure/api/controllers/star.controller.ts` — 가드 교체, body 제거
4. `src/application/dto/planet.dto.ts` — authorNickname 입력 제거
5. `src/application/dto/star.dto.ts` — giverNickname 입력 제거
6. `src/application/services/planet.service.ts` — clerkId 필수, User.name 자동 설정
7. `src/application/services/star.service.ts` — 중복 별주기 검증, User.name 자동 설정
8. `src/infrastructure/database/repositories/star.repository.ts` — 중복 체크 쿼리

### 프론트엔드 (apps/web)

1. `src/features/create-post/model/schema.ts` — authorNickname 필드 제거
2. `src/features/create-post/ui/` — 닉네임 입력 UI 제거
3. `src/features/give-star/ui/GiveStarButton.tsx` — 닉네임 입력 제거, 1클릭 전환, 로그인 체크
4. `src/widgets/post-overlay/ui/PostOverlay.tsx` — 비로그인 시 쓰기 UI 비활성화

## 테스트 실행

```bash
# 전체 테스트
yarn test

# API 단위 테스트
cd apps/api && yarn test

# 프론트엔드 테스트
cd apps/web && yarn test

# E2E 테스트
cd apps/api && yarn test:e2e
```

## 검증 포인트

1. 비로그인 상태에서 POST /api/galaxies/:id/planets → 401 반환
2. 비로그인 상태에서 POST /api/planets/:id/stars → 401 반환
3. 로그인 상태에서 게시글 작성 시 authorNickname 없이도 성공
4. 로그인 상태에서 별주기 시 body 없이도 성공
5. 동일 사용자가 같은 행성에 두 번 별주기 → 409 반환
6. GET 엔드포인트는 인증 없이 정상 조회
7. 기존 닉네임 기반 데이터 정상 표시
