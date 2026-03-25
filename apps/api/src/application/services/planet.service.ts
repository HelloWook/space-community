// Planet 비즈니스 로직 서비스

import { Injectable, Inject } from '@nestjs/common';
import {
  PLANET_REPOSITORY,
  IPlanetRepository,
} from '../../domain/ports/planet-repository.port';
import { PlanetListResponseDto } from '../dto/planet.dto';

@Injectable()
export class PlanetService {
  constructor(
    @Inject(PLANET_REPOSITORY)
    private readonly planetRepository: IPlanetRepository,
  ) {}

  /** Galaxy별 Planet 목록 커서 기반 페이지네이션 조회 */
  async findByGalaxy(
    galaxyId: string,
    cursor: string | null,
    limit: number,
  ): Promise<PlanetListResponseDto> {
    const result = await this.planetRepository.findByGalaxyId(
      galaxyId,
      cursor,
      limit,
    );

    return {
      data: result.planets.map((planet) => ({
        id: planet.id,
        title: planet.title,
        authorNickname: planet.authorNickname,
        starCount: planet.starCount,
        position: planet.position,
        createdAt: planet.createdAt,
      })),
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
    };
  }
}
