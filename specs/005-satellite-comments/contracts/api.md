# API Contracts: 인공위성 댓글 시스템

## 새 엔드포인트

### GET /api/planets/:planetId/comments — 댓글 목록 조회

인증 불필요 (읽기)

**Response 200**:
```json
{
  "data": [
    {
      "id": "comment-1",
      "content": "좋은 게시글이네요!",
      "authorNickname": "사용자A",
      "planetId": "planet-1",
      "parentId": null,
      "replies": [
        {
          "id": "comment-2",
          "content": "동의합니다!",
          "authorNickname": "사용자B",
          "planetId": "planet-1",
          "parentId": "comment-1",
          "replies": [],
          "createdAt": "2026-03-26T10:01:00.000Z"
        }
      ],
      "createdAt": "2026-03-26T10:00:00.000Z"
    }
  ],
  "totalCount": 2
}
```

---

### POST /api/planets/:planetId/comments — 댓글 작성

인증 선택 (OptionalClerkAuthGuard)

**Request**:
```json
{
  "content": "좋은 게시글이네요!",
  "authorNickname": "사용자A",
  "parentId": null
}
```

**Response 201**:
```json
{
  "id": "comment-1",
  "content": "좋은 게시글이네요!",
  "authorNickname": "사용자A",
  "planetId": "planet-1",
  "parentId": null,
  "replies": [],
  "createdAt": "2026-03-26T10:00:00.000Z"
}
```

**Response 422** (상한 초과):
```json
{
  "statusCode": 422,
  "message": "댓글 수가 최대치(50)에 도달했습니다"
}
```

**Response 400** (대댓글에 대한 대댓글 시도):
```json
{
  "statusCode": 400,
  "message": "대댓글에는 답글을 작성할 수 없습니다"
}
```

---

## 기존 엔드포인트 변경

### GET /api/planets/:id — 게시글 상세

응답에 `commentCount` 필드 추가:
```json
{
  "id": "planet-1",
  "title": "...",
  "commentCount": 3,
  "..."
}
```

### GET /api/galaxies/:galaxyId/planets — 게시글 목록

응답에 `commentCount` 필드 추가:
```json
{
  "data": [
    {
      "id": "planet-1",
      "title": "...",
      "commentCount": 3,
      "..."
    }
  ]
}
```
