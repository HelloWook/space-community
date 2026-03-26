# Data Model: 회원 전용 서비스 전환

## 변경 사항

### Star 모델 — unique 제약 추가

| Field | Type | Change | Notes |
|-------|------|--------|-------|
| giverId | String? | 기존 유지 (nullable) | 기존 비회원 별 데이터 하위 호환 |
| giverNickname | String | 기존 유지 | 새 데이터는 서버에서 User.name 자동 채움 |
| — | — | `@@unique([giverId, planetId])` 추가 | 1인 1별 중복 제한 (giverId가 null인 기존 데이터는 영향 없음) |

### Planet 모델 — 변경 없음

| Field | Type | Change | Notes |
|-------|------|--------|-------|
| authorId | String? | 기존 유지 (nullable) | 기존 비회원 게시글 하위 호환 |
| authorNickname | String | 기존 유지 | 새 데이터는 서버에서 User.name 자동 채움 |

### User 모델 — 변경 없음

기존 구조 유지. `name` 필드를 닉네임 대체로 사용.

## DTO 변경

### CreatePlanetDto

| Field | Before | After |
|-------|--------|-------|
| title | required | required (변경 없음) |
| content | required | required (변경 없음) |
| authorNickname | required (클라이언트 입력) | **제거** (서버에서 User.name 자동 설정) |
| appearance 필드들 | optional | optional (변경 없음) |

### CreateStarDto

| Field | Before | After |
|-------|--------|-------|
| giverNickname | required (클라이언트 입력) | **제거** (서버에서 User.name 자동 설정) |

### StarResponseDto

| Field | Before | After |
|-------|--------|-------|
| giverNickname | string | string (변경 없음, User.name으로 채워짐) |
| alreadyGiven | — | **추가** (boolean, 해당 사용자의 기존 별 여부) |

### PlanetSummaryDto / PlanetDetailResponseDto

| Field | Before | After |
|-------|--------|-------|
| authorNickname | string | string (변경 없음) |
| authorName | — | **추가** (string?, User.name — authorId가 있을 경우) |

## 관계도

```text
User (1) ──── (*) Planet    [authorId: 새 게시글은 필수, 기존은 nullable]
User (1) ──── (*) Star      [giverId: 새 별은 필수, 기존은 nullable]
                             [@@unique(giverId, planetId): 1인 1별]
Planet (1) ── (*) Star      [planetId: 필수]
```

## 마이그레이션 전략

1. `Star`에 `@@unique([giverId, planetId])` 추가 (기존 giverId=null 데이터는 unique 비교에서 제외되므로 충돌 없음)
2. 기존 데이터는 변경하지 않음
3. 애플리케이션 레벨에서 새 데이터 생성 시 authorId/giverId 필수 검증
