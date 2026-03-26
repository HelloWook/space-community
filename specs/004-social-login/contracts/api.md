# API Contracts: 소셜 로그인

## 인증 헤더

모든 보호된 엔드포인트는 Clerk 세션 토큰을 요구한다.

```
Authorization: Bearer <clerk_session_token>
```

## 엔드포인트

### POST /api/webhooks/clerk

Clerk Webhook 수신 엔드포인트. 인증 불필요 (Svix 서명 검증).

**Headers**:
- `svix-id`: 이벤트 고유 ID
- `svix-timestamp`: 이벤트 타임스탬프
- `svix-signature`: HMAC 서명

**Request Body** (user.created 예시):
```json
{
  "data": {
    "id": "user_2abc123",
    "email_addresses": [
      {
        "email_address": "user@example.com",
        "id": "idn_abc",
        "verification": { "status": "verified" }
      }
    ],
    "primary_email_address_id": "idn_abc",
    "first_name": "홍",
    "last_name": "길동",
    "image_url": "https://img.clerk.com/...",
    "external_accounts": [
      {
        "provider": "oauth_google",
        "email_address": "user@example.com"
      }
    ]
  },
  "type": "user.created"
}
```

**Response**:
- `200 OK` — 처리 성공
- `400 Bad Request` — 서명 검증 실패
- `500 Internal Server Error` — 처리 실패 (Svix 재시도)

---

### GET /api/users/me

현재 로그인한 사용자 정보 조회. 인증 필요.

**Response** `200 OK`:
```json
{
  "id": "clxxxxxxxx",
  "clerkId": "user_2abc123",
  "email": "user@example.com",
  "name": "홍길동",
  "imageUrl": "https://img.clerk.com/...",
  "providers": ["oauth_google", "oauth_github"]
}
```

**Response** `401 Unauthorized`:
```json
{
  "statusCode": 401,
  "message": "인증이 필요합니다"
}
```

---

## 기존 엔드포인트 변경

### POST /api/galaxies/:galaxyId/planets

**변경사항**: 인증된 사용자의 경우 `authorId`가 자동으로 설정됨.

**Request Body** (기존과 동일, authorNickname 유지):
```json
{
  "title": "첫 번째 행성",
  "content": "내용",
  "authorNickname": "홍길동"
}
```

> 인증 가드가 적용되면 `authorId`는 서버에서 JWT의 `sub`(clerkId)로부터 자동 설정.

### POST /api/planets/:planetId/stars

**변경사항**: 인증된 사용자의 경우 `giverId`가 자동으로 설정됨.

**Request Body** (기존과 동일):
```json
{
  "giverNickname": "홍길동"
}
```
