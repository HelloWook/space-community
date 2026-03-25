# Data Model: 은하계 게시판

**Feature Branch**: `001-galaxy-board` | **Date**: 2026-03-25

## 엔티티 관계도

```
Galaxy (은하계)
  │
  ├── 1:N ── Planet (행성/게시글)
  │            │
  │            └── 1:N ── Star (별/좋아요)
  │
  └── name, description, createdAt
```

## 엔티티 정의

### Galaxy (은하계)

게시판의 주제/카테고리를 나타내는 최상위 엔티티.

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | String (CUID) | PK, auto-generated | 고유 식별자 |
| name | String | NOT NULL, 1~50자, UNIQUE | 은하계 이름 |
| description | String | NOT NULL, 1~200자 | 은하계 설명 |
| positionX | Float | NOT NULL | 3D 공간 X 좌표 |
| positionY | Float | NOT NULL | 3D 공간 Y 좌표 |
| positionZ | Float | NOT NULL | 3D 공간 Z 좌표 |
| createdAt | DateTime | NOT NULL, auto | 생성 일시 |
| updatedAt | DateTime | NOT NULL, auto | 수정 일시 |

**관계**: Galaxy 1 → N Planet

**검증 규칙**:
- name: 공백 제거 후 1~50자, 중복 불가
- description: 1~200자

---

### Planet (행성/게시글)

은하계 내의 개별 게시글을 나타내는 엔티티.

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | String (CUID) | PK, auto-generated | 고유 식별자 |
| title | String | NOT NULL, 1~100자 | 게시글 제목 |
| content | String | NOT NULL, 1~10000자 | 게시글 내용 (마크다운) |
| authorNickname | String | NOT NULL, 1~20자 | 작성자 닉네임 |
| starCount | Int | NOT NULL, default 0, 0~100 | 받은 별 수 (비정규화) |
| positionX | Float | NOT NULL | 은하계 내 X 좌표 |
| positionY | Float | NOT NULL | 은하계 내 Y 좌표 |
| positionZ | Float | NOT NULL | 은하계 내 Z 좌표 |
| galaxyId | String | FK → Galaxy.id, NOT NULL | 소속 은하계 |
| createdAt | DateTime | NOT NULL, auto | 작성 일시 |
| updatedAt | DateTime | NOT NULL, auto | 수정 일시 |

**관계**:
- Planet N → 1 Galaxy
- Planet 1 → N Star

**검증 규칙**:
- title: 공백 제거 후 1~100자
- content: 마크다운 형식, 1~10000자
- authorNickname: 1~20자
- starCount: 0 이상 100 이하 (DB 레벨 CHECK 제약)

**인덱스**:
- `galaxyId` + `createdAt DESC` (은하계 내 행성 목록 조회)

---

### Star (별/좋아요)

게시글에 대한 좋아요를 나타내는 엔티티. 같은 사용자가 같은 게시글에 여러 번 부여 가능.

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | String (CUID) | PK, auto-generated | 고유 식별자 |
| giverNickname | String | NOT NULL, 1~20자 | 부여자 닉네임 |
| planetId | String | FK → Planet.id, NOT NULL | 대상 행성 |
| createdAt | DateTime | NOT NULL, auto | 부여 일시 |

**관계**: Star N → 1 Planet

**인덱스**:
- `planetId` (행성별 별 목록 조회)

---

## Prisma 스키마 (참고용)

```prisma
model Galaxy {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  positionX   Float
  positionY   Float
  positionZ   Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  planets     Planet[]
}

model Planet {
  id              String   @id @default(cuid())
  title           String
  content         String
  authorNickname  String
  starCount       Int      @default(0)
  positionX       Float
  positionY       Float
  positionZ       Float
  galaxyId        String
  galaxy          Galaxy   @relation(fields: [galaxyId], references: [id])
  stars           Star[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([galaxyId, createdAt(sort: Desc)])
}

model Star {
  id            String   @id @default(cuid())
  giverNickname String
  planetId      String
  planet        Planet   @relation(fields: [planetId], references: [id])
  createdAt     DateTime @default(now())

  @@index([planetId])
}
```

## 비정규화 전략

### starCount (Planet)

- **이유**: 행성 렌더링 시 매번 Star 테이블을 COUNT하는 것은 비효율적. 3D 씬에서 50개 행성의 별 수를 동시에 표시해야 하므로 비정규화 필수
- **동기화**: Star 생성 시 Planet.starCount를 원자적으로 increment (`{ increment: 1 }`)
- **상한 검증**: increment 전 starCount < 100 확인. 트랜잭션으로 Star 생성과 starCount 증가를 묶어 정합성 보장

## 상태 전이

### 별 부여 흐름

```
starCount < 100 → Star 생성 + starCount increment → 성공
starCount >= 100 → 에러 응답 ("별 상한에 도달했습니다") → 실패
```
