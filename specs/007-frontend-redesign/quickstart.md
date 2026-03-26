# Quickstart: 프론트엔드 전체 리디자인

**Feature**: 007-frontend-redesign
**Date**: 2026-03-26

## 사전 요구사항

- Node.js 22+
- Yarn 1.22+
- Docker (PostgreSQL용)

## 개발 환경 실행

```bash
# 1. 의존성 설치
yarn install

# 2. DB 시작 및 마이그레이션
docker compose up -d
yarn workspace @galaxy-board/api npx prisma migrate dev
yarn workspace @galaxy-board/api npx prisma db seed

# 3. 개발 서버 실행
yarn dev
```

- Web: http://localhost:3000
- API: http://localhost:3001

## 이 피처의 핵심 파일

### 신규 생성 파일

| 파일 | 설명 |
|------|------|
| `apps/web/src/entities/decoration/ui/Starfield.tsx` | 별 파티클 필드 |
| `apps/web/src/entities/decoration/ui/Meteor.tsx` | 유성 + 꼬리 효과 |
| `apps/web/src/entities/decoration/ui/Asteroid.tsx` | 운석 궤도 운동 |
| `apps/web/src/entities/decoration/ui/BlackHole.tsx` | 블랙홀 왜곡 효과 |
| `apps/web/src/entities/decoration/ui/Sun.tsx` | 태양 발광체 |
| `apps/web/src/widgets/overlay/ui/Overlay.tsx` | 공통 오버레이 컴포넌트 |
| `apps/web/src/shared/ui/shadcn/*.tsx` | shadcn/ui 컴포넌트들 |

### 주요 수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `apps/web/src/widgets/galaxy-scene/ui/GalaxyScene.tsx` | 장식 요소 통합, 인라인 스타일 제거 |
| `apps/web/src/widgets/post-overlay/ui/PostOverlay.tsx` | 공통 오버레이 전환, shadcn/ui 적용 |
| `apps/web/src/features/social-login/ui/social-login-buttons.tsx` | Clerk Custom Flow 전환 |
| `apps/web/src/features/create-post/ui/CreatePostForm.tsx` | shadcn/ui + Tailwind 전환 |
| `apps/web/src/features/create-galaxy/ui/CreateGalaxyForm.tsx` | shadcn/ui + Tailwind 전환 |
| `apps/web/src/app/styles/globals.css` | 우주 테마 토큰 확장 |
| 나머지 인라인 스타일 파일 17개 | Tailwind 유틸리티 클래스 전환 |

## 테스트

```bash
# 프론트엔드 테스트
yarn workspace @galaxy-board/web test

# 특정 파일 테스트
yarn workspace @galaxy-board/web test -- --testPathPattern="Overlay"
```

## 참고

- shadcn/ui 컴포넌트 설치: `npx shadcn@latest add button input textarea card dialog select radio-group slider` (apps/web/ 디렉토리에서 실행)
- Tailwind CSS v4 사용 중 — `@import "tailwindcss"` 방식
- FSD 레이어 규칙: shared → entities → features → widgets → views (상위만 import 가능)
