# Data Model: 인공위성 댓글 시스템

## 새 모델: Comment

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String | PK, cuid | 고유 ID |
| content | String | 1~500자 | 댓글 내용 |
| authorNickname | String | 1~20자 | 작성자 닉네임 |
| authorId | String? | FK → User.id, nullable | 로그인 사용자 연결 (optional auth) |
| planetId | String | FK → Planet.id | 소속 행성 |
| parentId | String? | FK → Comment.id, nullable | 부모 댓글 (대댓글인 경우) |
| createdAt | DateTime | default now() | 작성 시간 |

### 제약 조건

- `parentId`가 null이면 최상위 댓글, non-null이면 대댓글
- 대댓글의 `parentId`가 가리키는 댓글의 `parentId`는 반드시 null이어야 함 (1단계 제한, 애플리케이션 레벨 검증)
- 행성당 댓글 수 최대 50개 (commentCount 필드로 관리)

## 기존 모델 변경: Planet

| Field | Type | Change | Notes |
|-------|------|--------|-------|
| commentCount | Int | **추가** (default 0) | 행성의 총 댓글 수 (상한 50) |

## 관계도

```text
User (1) ──── (*) Comment    [authorId: optional auth]
Planet (1) ── (*) Comment    [planetId: 필수]
Comment (1) ─ (*) Comment    [parentId: 자기참조, 1단계 대댓글]
```

## DTO

### CreateCommentDto (요청)

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| content | String | 1~500자 필수 | 댓글 내용 |
| authorNickname | String | 1~20자 필수 | 작성자 닉네임 |
| parentId | String? | optional | 대댓글인 경우 부모 댓글 ID |

### CommentResponseDto (응답)

| Field | Type | Notes |
|-------|------|-------|
| id | String | 댓글 ID |
| content | String | 댓글 내용 |
| authorNickname | String | 작성자 닉네임 |
| planetId | String | 소속 행성 ID |
| parentId | String? | 부모 댓글 ID (대댓글인 경우) |
| replies | CommentResponseDto[] | 대댓글 목록 (최상위 댓글에만 포함) |
| createdAt | DateTime | 작성 시간 |

### CommentListResponseDto (응답)

| Field | Type | Notes |
|-------|------|-------|
| data | CommentResponseDto[] | 최상위 댓글 목록 (replies 포함) |
| totalCount | number | 전체 댓글 수 (대댓글 포함) |
