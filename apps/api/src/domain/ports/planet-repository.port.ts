// Planet 리포지토리 포트 - 헥사고날 아키텍처의 출력 포트

import { PlanetEntity } from '../entities/planet.entity';

/** Planet 리포지토리 주입 토큰 */
export const PLANET_REPOSITORY = Symbol('PLANET_REPOSITORY');

/** 커서 기반 페이지네이션 결과 */
export interface PaginatedPlanets {
  planets: PlanetEntity[];
  nextCursor: string | null;
  hasMore: boolean;
}

/** Planet 리포지토리 인터페이스 */
export interface IPlanetRepository {
  /** Galaxy별 Planet 목록 커서 기반 페이지네이션 조회 */
  findByGalaxyId(
    galaxyId: string,
    cursor: string | null,
    limit: number,
  ): Promise<PaginatedPlanets>;

  /** ID로 Planet 조회 */
  findById(id: string): Promise<PlanetEntity | null>;

  /** Planet 생성 */
  create(planet: PlanetEntity): Promise<PlanetEntity>;

  /** Galaxy별 Planet 개수 조회 */
  countByGalaxyId(galaxyId: string): Promise<number>;
}
