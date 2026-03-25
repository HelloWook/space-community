# REST API Contracts: 은하계 게시판

**Base URL**: `http://localhost:3001/api`
**Content-Type**: `application/json`

## 공통

### 에러 응답 형식

```json
{
  "statusCode": 400,
  "message": "에러 메시지",
  "error": "Bad Request"
}
```

### 페이지네이션 응답 형식

```json
{
  "data": [],
  "nextCursor": "string | null",
  "hasMore": true
}
```

---

## Galaxy (은하계) API

### GET /api/galaxies

은하계 목록 조회. 3D 우주 공간에 표시할 모든 은하계를 반환한다.

**Response** `200 OK`:
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "기술",
      "description": "기술 관련 이야기",
      "position": { "x": 10.5, "y": -3.2, "z": 5.0 },
      "planetCount": 42,
      "createdAt": "2026-03-25T00:00:00.000Z"
    }
  ]
}
```

> 은하계 수는 제한적이므로 페이지네이션 없이 전체 반환

---

### GET /api/galaxies/:id

은하계 상세 조회.

**Path Parameters**: `id` — 은하계 ID

**Response** `200 OK`:
```json
{
  "id": "clx...",
  "name": "기술",
  "description": "기술 관련 이야기",
  "position": { "x": 10.5, "y": -3.2, "z": 5.0 },
  "planetCount": 42,
  "createdAt": "2026-03-25T00:00:00.000Z"
}
```

**Response** `404 Not Found`:
```json
{ "statusCode": 404, "message": "은하계를 찾을 수 없습니다", "error": "Not Found" }
```

---

### POST /api/galaxies

은하계 생성 (P2).

**Request Body**:
```json
{
  "name": "기술",
  "description": "기술 관련 이야기"
}
```

| 필드 | 타입 | 필수 | 검증 |
|------|------|------|------|
| name | string | O | 1~50자, 중복 불가 |
| description | string | O | 1~200자 |

> position은 서버에서 자동 배정 (기존 은하계와 겹치지 않는 좌표)

**Response** `201 Created`:
```json
{
  "id": "clx...",
  "name": "기술",
  "description": "기술 관련 이야기",
  "position": { "x": 15.0, "y": 2.0, "z": -8.0 },
  "planetCount": 0,
  "createdAt": "2026-03-25T00:00:00.000Z"
}
```

**Response** `409 Conflict`:
```json
{ "statusCode": 409, "message": "이미 존재하는 은하계 이름입니다", "error": "Conflict" }
```

---

## Planet (행성/게시글) API

### GET /api/galaxies/:galaxyId/planets

은하계 내 행성(게시글) 목록 조회. 커서 기반 페이지네이션.

**Path Parameters**: `galaxyId` — 은하계 ID

**Query Parameters**:
| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| cursor | string | null | 페이지네이션 커서 |
| limit | number | 50 | 페이지당 항목 수 (1~50) |

**Response** `200 OK`:
```json
{
  "data": [
    {
      "id": "clx...",
      "title": "Three.js 시작하기",
      "authorNickname": "우주인",
      "starCount": 15,
      "position": { "x": 1.0, "y": 2.0, "z": 3.0 },
      "createdAt": "2026-03-25T00:00:00.000Z"
    }
  ],
  "nextCursor": "clx...",
  "hasMore": true
}
```

> 목록 조회에서는 content 필드를 제외하여 응답 크기 최적화

---

### GET /api/planets/:id

행성(게시글) 상세 조회.

**Path Parameters**: `id` — 행성 ID

**Response** `200 OK`:
```json
{
  "id": "clx...",
  "title": "Three.js 시작하기",
  "content": "# 소개\n\nThree.js는...",
  "authorNickname": "우주인",
  "starCount": 15,
  "position": { "x": 1.0, "y": 2.0, "z": 3.0 },
  "galaxyId": "clx...",
  "createdAt": "2026-03-25T00:00:00.000Z"
}
```

**Response** `404 Not Found`:
```json
{ "statusCode": 404, "message": "게시글을 찾을 수 없습니다", "error": "Not Found" }
```

---

### POST /api/galaxies/:galaxyId/planets

행성(게시글) 생성.

**Path Parameters**: `galaxyId` — 은하계 ID

**Request Body**:
```json
{
  "title": "Three.js 시작하기",
  "content": "# 소개\n\nThree.js는...",
  "authorNickname": "우주인"
}
```

| 필드 | 타입 | 필수 | 검증 |
|------|------|------|------|
| title | string | O | 1~100자 |
| content | string | O | 1~10000자, 마크다운 |
| authorNickname | string | O | 1~20자 |

> position은 서버에서 자동 배정 (은하계 내 겹치지 않는 좌표)

**Response** `201 Created`:
```json
{
  "id": "clx...",
  "title": "Three.js 시작하기",
  "content": "# 소개\n\nThree.js는...",
  "authorNickname": "우주인",
  "starCount": 0,
  "position": { "x": 1.0, "y": 2.0, "z": 3.0 },
  "galaxyId": "clx...",
  "createdAt": "2026-03-25T00:00:00.000Z"
}
```

---

## Star (별/좋아요) API

### POST /api/planets/:planetId/stars

행성에 별 부여.

**Path Parameters**: `planetId` — 행성 ID

**Request Body**:
```json
{
  "giverNickname": "탐험가"
}
```

| 필드 | 타입 | 필수 | 검증 |
|------|------|------|------|
| giverNickname | string | O | 1~20자 |

**Response** `201 Created`:
```json
{
  "id": "clx...",
  "giverNickname": "탐험가",
  "planetId": "clx...",
  "newStarCount": 16,
  "createdAt": "2026-03-25T00:00:00.000Z"
}
```

**Response** `422 Unprocessable Entity` (별 상한 도달):
```json
{ "statusCode": 422, "message": "이 게시글은 별 상한(100개)에 도달했습니다", "error": "Unprocessable Entity" }
```

**Response** `404 Not Found`:
```json
{ "statusCode": 404, "message": "게시글을 찾을 수 없습니다", "error": "Not Found" }
```
