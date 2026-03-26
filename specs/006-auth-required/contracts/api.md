# API Contracts: 회원 전용 서비스 전환

## 변경된 엔드포인트

### POST /api/galaxies/:galaxyId/planets — 게시글 작성

**Before**: `OptionalClerkAuthGuard` (인증 선택)
**After**: `ClerkAuthGuard` (인증 필수)

**Request** (변경):
```json
{
  "title": "제목",
  "content": "내용",
  // "authorNickname" 필드 제거됨
  "mainColor": "#4A90D9",
  "subColor": "#2C5F8A",
  "size": "MEDIUM",
  "shape": "SPHERE",
  "pattern": "SMOOTH",
  "hasRing": false
}
```

**Response 200** (변경):
```json
{
  "id": "...",
  "title": "제목",
  "content": "내용",
  "authorNickname": "사용자이름",
  "authorName": "사용자이름",
  "starCount": 0,
  "position": { "x": 0, "y": 0, "z": 0 },
  "mainColor": "#4A90D9",
  "subColor": "#2C5F8A",
  "size": "MEDIUM",
  "shape": "SPHERE",
  "pattern": "SMOOTH",
  "hasRing": false,
  "galaxyId": "...",
  "createdAt": "..."
}
```

**Response 401** (신규):
```json
{
  "statusCode": 401,
  "message": "인증이 필요합니다"
}
```

---

### POST /api/planets/:planetId/stars — 별주기

**Before**: `OptionalClerkAuthGuard` (인증 선택), body에 `giverNickname` 필수
**After**: `ClerkAuthGuard` (인증 필수), body 없음 (빈 객체 또는 생략)

**Request** (변경):
```json
{}
```

**Response 201** (변경):
```json
{
  "id": "...",
  "giverNickname": "사용자이름",
  "planetId": "...",
  "newStarCount": 5,
  "alreadyGiven": false,
  "createdAt": "..."
}
```

**Response 401** (신규):
```json
{
  "statusCode": 401,
  "message": "인증이 필요합니다"
}
```

**Response 409** (신규 — 중복 별주기):
```json
{
  "statusCode": 409,
  "message": "이미 이 게시글에 별을 주셨습니다"
}
```

---

### GET /api/galaxies/:galaxyId/planets — 게시글 목록 (변경 없음)

인증 불필요 (기존과 동일). 응답에 `authorName` 필드 추가.

### GET /api/planets/:id — 게시글 상세 (변경 없음)

인증 불필요 (기존과 동일). 응답에 `authorName` 필드 추가.
