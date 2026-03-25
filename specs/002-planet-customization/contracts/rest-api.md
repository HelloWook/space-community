# REST API Contract: 행성 커스터마이징

**Feature**: 002-planet-customization | **Date**: 2026-03-25

## 변경되는 엔드포인트

기존 001-galaxy-board에서 정의한 Planet 관련 엔드포인트의 요청/응답에 외형 필드를 추가한다. URL 경로 변경 없음.

---

### POST /api/galaxies/:galaxyId/planets (수정)

**변경 사항**: 요청 본문에 외형 필드 추가 (모두 optional — 미설정 시 기본값 적용)

**Request Body**:
```json
{
  "title": "나의 첫 게시글",
  "content": "# 안녕하세요\n마크다운 내용입니다.",
  "authorNickname": "우주인",
  "mainColor": "#FF6B35",
  "subColor": "#004E64",
  "size": "LARGE",
  "shape": "DODECAHEDRON",
  "pattern": "CRATER",
  "hasRing": true
}
```

**Validation**:
| 필드 | 타입 | 필수 | 규칙 |
|------|------|------|------|
| title | string | Y | 1~100자 |
| content | string | Y | 1~10000자 |
| authorNickname | string | Y | 1~20자 |
| mainColor | string | N | HEX 형식 `/^#[0-9a-fA-F]{6}$/`, 기본값 '#4A90D9' |
| subColor | string | N | HEX 형식 `/^#[0-9a-fA-F]{6}$/`, 기본값 '#2C5F8A' |
| size | string | N | SMALL \| MEDIUM \| LARGE, 기본값 'MEDIUM' |
| shape | string | N | SPHERE \| BOX \| TETRAHEDRON \| OCTAHEDRON \| DODECAHEDRON \| TORUS \| CYLINDER \| CONE, 기본값 'SPHERE' |
| pattern | string | N | SMOOTH \| CRATER \| STRIPE \| CLOUD, 기본값 'SMOOTH' |
| hasRing | boolean | N | 기본값 false |

**Response 201**:
```json
{
  "id": "uuid",
  "title": "나의 첫 게시글",
  "authorNickname": "우주인",
  "starCount": 0,
  "position": { "x": 3.5, "y": -2.1, "z": 7.8 },
  "mainColor": "#FF6B35",
  "subColor": "#004E64",
  "size": "LARGE",
  "shape": "DODECAHEDRON",
  "pattern": "CRATER",
  "hasRing": true,
  "createdAt": "2026-03-25T12:00:00.000Z"
}
```

**Error 400** (유효성 검증 실패):
```json
{
  "statusCode": 400,
  "message": ["mainColor must match /^#[0-9a-fA-F]{6}$/", "size must be one of: SMALL, MEDIUM, LARGE"],
  "error": "Bad Request"
}
```

---

### GET /api/galaxies/:galaxyId/planets (수정)

**변경 사항**: 응답의 각 행성에 외형 필드 포함

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "나의 첫 게시글",
      "authorNickname": "우주인",
      "starCount": 5,
      "position": { "x": 3.5, "y": -2.1, "z": 7.8 },
      "mainColor": "#FF6B35",
      "subColor": "#004E64",
      "size": "LARGE",
      "shape": "DODECAHEDRON",
      "pattern": "CRATER",
      "hasRing": true,
      "createdAt": "2026-03-25T12:00:00.000Z"
    }
  ],
  "nextCursor": "uuid-or-null",
  "hasMore": true
}
```

---

### GET /api/planets/:id (수정)

**변경 사항**: 응답에 외형 필드 포함

**Response 200**:
```json
{
  "id": "uuid",
  "title": "나의 첫 게시글",
  "content": "# 안녕하세요\n마크다운 내용입니다.",
  "authorNickname": "우주인",
  "starCount": 5,
  "position": { "x": 3.5, "y": -2.1, "z": 7.8 },
  "mainColor": "#FF6B35",
  "subColor": "#004E64",
  "size": "LARGE",
  "shape": "DODECAHEDRON",
  "pattern": "CRATER",
  "hasRing": true,
  "galaxyId": "uuid",
  "createdAt": "2026-03-25T12:00:00.000Z"
}
```
