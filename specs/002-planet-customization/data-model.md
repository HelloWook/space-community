# Data Model: 행성 커스터마이징

**Feature**: 002-planet-customization | **Date**: 2026-03-25

## 변경 대상: Planet 모델

기존 Planet 테이블에 외형 컬럼 6개를 추가한다. 별도 테이블 불필요.

### 추가 컬럼

| 컬럼명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| mainColor | String | '#4A90D9' | 메인 HEX 색상 |
| subColor | String | '#2C5F8A' | 보조 HEX 색상 |
| size | String | 'MEDIUM' | 크기 enum (SMALL, MEDIUM, LARGE) |
| shape | String | 'SPHERE' | 형태 enum (SPHERE, BOX, TETRAHEDRON, OCTAHEDRON, DODECAHEDRON, TORUS, CYLINDER, CONE) |
| pattern | String | 'SMOOTH' | 패턴 enum (SMOOTH, CRATER, STRIPE, CLOUD) |
| hasRing | Boolean | false | 고리 유무 |

### Prisma 스키마 변경

```prisma
model Planet {
  // 기존 필드 유지
  id              String   @id @default(uuid())
  title           String
  content         String
  authorNickname  String   @map("author_nickname")
  starCount       Int      @default(0) @map("star_count")
  positionX       Float    @map("position_x")
  positionY       Float    @map("position_y")
  positionZ       Float    @map("position_z")

  // 외형 컬럼 추가
  mainColor       String   @default("#4A90D9") @map("main_color")
  subColor        String   @default("#2C5F8A") @map("sub_color")
  size            String   @default("MEDIUM")
  shape           String   @default("SPHERE")
  pattern         String   @default("SMOOTH")
  hasRing         Boolean  @default(false) @map("has_ring")

  // 관계 및 타임스탬프 유지
  galaxyId        String   @map("galaxy_id")
  galaxy          Galaxy   @relation(fields: [galaxyId], references: [id])
  stars           Star[]
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("planets")
}
```

### 유효성 규칙

| 필드 | 규칙 |
|------|------|
| mainColor | 7자 HEX 형식 (#RRGGBB), 정규식: `/^#[0-9a-fA-F]{6}$/` |
| subColor | 7자 HEX 형식 (#RRGGBB), 정규식: `/^#[0-9a-fA-F]{6}$/` |
| size | 허용값: SMALL, MEDIUM, LARGE |
| shape | 허용값: SPHERE, BOX, TETRAHEDRON, OCTAHEDRON, DODECAHEDRON, TORUS, CYLINDER, CONE |
| pattern | 허용값: SMOOTH, CRATER, STRIPE, CLOUD |
| hasRing | boolean (true/false) |

### 크기 → 3D 스케일 매핑

| Size Enum | 3D 반지름 |
|-----------|-----------|
| SMALL | 0.3 |
| MEDIUM | 0.6 |
| LARGE | 1.0 |

### 공유 타입 (packages/types)

```typescript
// 행성 외형 관련 enum/타입
export type PlanetSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type PlanetShape = 'SPHERE' | 'BOX' | 'TETRAHEDRON' | 'OCTAHEDRON' | 'DODECAHEDRON' | 'TORUS' | 'CYLINDER' | 'CONE';
export type SurfacePattern = 'SMOOTH' | 'CRATER' | 'STRIPE' | 'CLOUD';

export interface PlanetAppearance {
  mainColor: string;
  subColor: string;
  size: PlanetSize;
  shape: PlanetShape;
  pattern: SurfacePattern;
  hasRing: boolean;
}

// 기존 PlanetSummary 확장
export interface PlanetSummary extends PlanetAppearance {
  id: string;
  title: string;
  authorNickname: string;
  starCount: number;
  position: Position;
  createdAt: string;
}

// 기존 CreatePlanetInput 확장
export interface CreatePlanetInput extends Partial<PlanetAppearance> {
  title: string;
  content: string;
  authorNickname: string;
}
```

### 기본 외형 (커스터마이징 미설정 시)

```typescript
export const DEFAULT_APPEARANCE: PlanetAppearance = {
  mainColor: '#4A90D9',
  subColor: '#2C5F8A',
  size: 'MEDIUM',
  shape: 'SPHERE',
  pattern: 'SMOOTH',
  hasRing: false,
};
```
