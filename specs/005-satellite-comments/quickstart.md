# Quickstart: 인공위성 댓글 시스템

## 개발 환경 준비

```bash
yarn install
docker compose up -d
cd apps/api && npx prisma migrate dev
cd apps/api && yarn dev
cd apps/web && yarn dev
```

## 주요 새 파일

### 백엔드 (apps/api)

1. `prisma/schema.prisma` — Comment 모델 추가, Planet에 commentCount 추가
2. `src/domain/entities/comment.entity.ts` — 댓글 도메인 엔티티
3. `src/domain/ports/comment-repository.port.ts` — 댓글 리포지토리 포트
4. `src/application/dto/comment.dto.ts` — 댓글 DTO
5. `src/application/services/comment.service.ts` — 댓글 비즈니스 로직
6. `src/application/mappers/index.ts` — CommentMapper 추가
7. `src/infrastructure/api/controllers/comment.controller.ts` — 댓글 REST API
8. `src/infrastructure/database/repositories/comment.repository.ts` — Prisma 구현체
9. `src/comment.module.ts` — NestJS 모듈

### 프론트엔드 (apps/web)

1. `src/entities/comment/api/hooks.ts` — 댓글 API 훅 (useComments, useCreateComment)
2. `src/entities/comment/ui/CommentList.tsx` — 댓글/대댓글 목록 UI
3. `src/entities/satellite/ui/Satellite3D.tsx` — 인공위성 3D 컴포넌트 (InstancedMesh)
4. `src/features/write-comment/ui/WriteCommentForm.tsx` — 댓글 작성 폼
5. `src/widgets/post-overlay/ui/PostOverlay.tsx` — 댓글 목록 통합
6. `src/widgets/galaxy-scene/ui/GalaxyScene.tsx` — Satellite3D 통합

### 공유 타입 (packages/types)

1. `src/index.ts` — Comment, CreateCommentInput, CommentResponse 타입 추가

## 테스트 실행

```bash
yarn test
cd apps/api && yarn test
cd apps/web && yarn test
```

## 검증 포인트

1. POST /api/planets/:id/comments — 댓글 생성 → 201 반환, commentCount 증가
2. POST /api/planets/:id/comments (parentId 포함) — 대댓글 생성 → 201 반환
3. POST /api/planets/:id/comments (대댓글에 parentId) — 400 반환 (1단계 제한)
4. GET /api/planets/:id/comments — 댓글 + 대댓글 트리 구조 조회
5. 댓글 50개 도달 후 추가 작성 → 422 반환
6. 3D 공간에서 인공위성이 행성 주위에 별과 다른 궤도/색상/형태로 표시
7. 인공위성 클릭 → 사이드 패널에서 해당 댓글 하이라이트 + 자동 스크롤
8. 사이드 패널 댓글 클릭 → 3D 인공위성 강조
