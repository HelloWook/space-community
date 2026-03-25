// Galaxy 리포지토리 포트 - 헥사고날 아키텍처의 출력 포트

import { GalaxyEntity } from '../entities/galaxy.entity';

/** Galaxy 리포지토리 주입 토큰 */
export const GALAXY_REPOSITORY = Symbol('GALAXY_REPOSITORY');

/** Galaxy 리포지토리 인터페이스 */
export interface IGalaxyRepository {
  /** 전체 Galaxy 목록 조회 */
  findAll(): Promise<GalaxyEntity[]>;

  /** ID로 Galaxy 조회 */
  findById(id: string): Promise<GalaxyEntity | null>;

  /** Galaxy 생성 */
  create(galaxy: GalaxyEntity): Promise<GalaxyEntity>;
}
