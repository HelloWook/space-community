# Data Model: 소셜 로그인

## 엔티티

### User (신규)

서비스 사용자. Clerk에서 Webhook으로 동기화.

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | String | PK, cuid | 서비스 내부 ID |
| clerkId | String | unique, indexed | Clerk 사용자 ID (user_xxxx) |
| email | String | unique | 기본 이메일 주소 |
| name | String? | nullable | 표시 이름 (first_name + last_name) |
| imageUrl | String? | nullable | 프로필 이미지 URL |
| providers | String[] | array | 연동된 소셜 제공자 목록 (예: ["oauth_google", "oauth_github"]) |
| createdAt | DateTime | default(now()) | 생성 일시 |
| updatedAt | DateTime | @updatedAt | 수정 일시 |

**인덱스**: `clerkId` (unique), `email` (unique)

### 관계 (기존 모델 변경)

#### Planet (수정)

| 변경 필드 | 기존 | 변경 후 | 설명 |
|-----------|------|---------|------|
| authorNickname | String | 유지 (하위호환) | 기존 닉네임 필드 유지 |
| authorId | - | String? (FK → User) | 로그인 사용자 연결 (nullable, 기존 데이터 호환) |

> 기존 `authorNickname`은 유지하되, 로그인 사용자는 `authorId`로 연결. 비로그인 게시글(기존 데이터)은 `authorId`가 null.

#### Star (수정)

| 변경 필드 | 기존 | 변경 후 | 설명 |
|-----------|------|---------|------|
| giverNickname | String | 유지 (하위호환) | 기존 닉네임 필드 유지 |
| giverId | - | String? (FK → User) | 로그인 사용자 연결 (nullable) |

## 상태 전이

### 사용자 라이프사이클

```
[소셜 로그인 시도]
    ↓
[Clerk OAuth 처리]
    ↓
[Clerk user.created Webhook] → DB User 생성
    ↓
[활성 사용자] ←→ [Clerk user.updated Webhook] → DB User 갱신
    ↓
[Clerk user.deleted Webhook] → DB User 삭제
```

## Prisma 스키마 (예상)

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  imageUrl  String?
  providers String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  planets   Planet[]
  stars     Star[]
}
```

## 검증 규칙

- `clerkId`: 비어있을 수 없음, `user_` 접두사로 시작
- `email`: 유효한 이메일 형식
- `providers`: 허용 값 `oauth_google`, `oauth_github`
- User 삭제 시 관련 Planet/Star의 authorId/giverId는 null로 설정 (SET NULL)
