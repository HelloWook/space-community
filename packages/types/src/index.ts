// === 공통 타입 ===

/** 3D 공간 좌표 */
export interface Position {
  x: number;
  y: number;
  z: number;
}

/** 커서 기반 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

// === 은하계 (Galaxy) ===

export interface Galaxy {
  id: string;
  name: string;
  description: string;
  position: Position;
  planetCount: number;
  createdAt: string;
}

export interface CreateGalaxyInput {
  name: string;
  description: string;
}

// === 행성 외형 (Planet Appearance) ===

/** 행성 크기 */
export type PlanetSize = 'SMALL' | 'MEDIUM' | 'LARGE';

/** 행성 형태 (Three.js 기본 지오메트리) */
export type PlanetShape = 'SPHERE' | 'BOX' | 'TETRAHEDRON' | 'OCTAHEDRON' | 'DODECAHEDRON' | 'TORUS' | 'CYLINDER' | 'CONE';

/** 표면 패턴 */
export type SurfacePattern = 'SMOOTH' | 'CRATER' | 'STRIPE' | 'CLOUD';

/** 행성 외형 속성 */
export interface PlanetAppearance {
  mainColor: string;
  subColor: string;
  size: PlanetSize;
  shape: PlanetShape;
  pattern: SurfacePattern;
  hasRing: boolean;
}

/** 기본 행성 외형 */
export const DEFAULT_APPEARANCE: PlanetAppearance = {
  mainColor: '#4A90D9',
  subColor: '#2C5F8A',
  size: 'MEDIUM',
  shape: 'SPHERE',
  pattern: 'SMOOTH',
  hasRing: false,
};

export const PLANET_SIZES: PlanetSize[] = ['SMALL', 'MEDIUM', 'LARGE'];
export const PLANET_SHAPES: PlanetShape[] = ['SPHERE', 'BOX', 'TETRAHEDRON', 'OCTAHEDRON', 'DODECAHEDRON', 'TORUS', 'CYLINDER', 'CONE'];
export const SURFACE_PATTERNS: SurfacePattern[] = ['SMOOTH', 'CRATER', 'STRIPE', 'CLOUD'];

// === 행성 (Planet) ===

/** 행성 목록용 요약 (content 제외) */
export interface PlanetSummary extends PlanetAppearance {
  id: string;
  title: string;
  authorNickname: string;
  starCount: number;
  commentCount: number;
  position: Position;
  createdAt: string;
}

/** 행성 상세 (content 포함) */
export interface PlanetDetail extends PlanetSummary {
  content: string;
  galaxyId: string;
}

export interface CreatePlanetInput {
  title: string;
  content: string;
  authorNickname: string;
  mainColor?: string;
  subColor?: string;
  size?: PlanetSize;
  shape?: PlanetShape;
  pattern?: SurfacePattern;
  hasRing?: boolean;
}

// === 사용자 (User) ===

/** 사용자 응답 */
export interface UserResponse {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  providers: string[];
}

// === 별 (Star) ===

export interface StarResponse {
  id: string;
  giverNickname: string;
  planetId: string;
  newStarCount: number;
  createdAt: string;
}

export interface CreateStarInput {
  giverNickname: string;
}

// === 댓글 (Comment) ===

export interface CommentResponse {
  id: string;
  content: string;
  authorNickname: string;
  planetId: string;
  parentId: string | null;
  replies: CommentResponse[];
  createdAt: string;
}

export interface CommentListResponse {
  data: CommentResponse[];
  totalCount: number;
}

export interface CreateCommentInput {
  content: string;
  authorNickname: string;
  parentId?: string;
}
