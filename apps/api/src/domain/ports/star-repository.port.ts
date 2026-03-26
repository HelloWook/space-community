// Star 리포지토리 포트 - 헥사고날 아키텍처의 출력 포트

import { StarEntity } from '../entities/star.entity';

/** Star 리포지토리 주입 토큰 */
export const STAR_REPOSITORY = Symbol('STAR_REPOSITORY');

/** Star 생성 결과 */
export interface CreateStarResult {
  star: StarEntity;
  newStarCount: number;
}

/** Star 리포지토리 인터페이스 */
export interface IStarRepository {
  /** Star 생성 (트랜잭션으로 원자적 증가, maxStarCount 초과 시 에러) */
  create(star: StarEntity, maxStarCount: number, giverId: string): Promise<CreateStarResult>;

  /** giverId와 planetId로 기존 Star 조회 (중복 별주기 검증용) */
  findByGiverAndPlanet(giverId: string, planetId: string): Promise<StarEntity | null>;
}
