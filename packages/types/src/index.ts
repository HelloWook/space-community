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

// === 행성 (Planet) ===

/** 행성 목록용 요약 (content 제외) */
export interface PlanetSummary {
  id: string;
  title: string;
  authorNickname: string;
  starCount: number;
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
