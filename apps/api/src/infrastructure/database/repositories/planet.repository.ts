// Planet Prisma 리포지토리 구현체

import { Injectable } from '@nestjs/common';
import {
  IPlanetRepository,
  PaginatedPlanets,
} from '../../../domain/ports/planet-repository.port';
import { PlanetEntity } from '../../../domain/entities/planet.entity';
import { PrismaService } from '../prisma.service';
import { PlanetMapper } from '../../../application/mappers';

/** Planet 리포지토리 Prisma 구현체 */
@Injectable()
export class PlanetRepository implements IPlanetRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Galaxy별 Planet 목록 커서 기반 페이지네이션 조회 */
  async findByGalaxyId(
    galaxyId: string,
    cursor: string | null,
    limit: number,
  ): Promise<PaginatedPlanets> {
    // limit+1개를 가져와서 다음 페이지 존재 여부 확인
    const planets = await this.prisma.planet.findMany({
      where: { galaxyId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor
        ? {
            skip: 1, // 커서 자체는 건너뜀
            cursor: { id: cursor },
          }
        : {}),
    });

    // 다음 페이지 존재 여부 판단
    const hasMore = planets.length > limit;
    const resultPlanets = hasMore ? planets.slice(0, limit) : planets;
    const nextCursor = hasMore
      ? resultPlanets[resultPlanets.length - 1].id
      : null;

    return {
      planets: resultPlanets.map(PlanetMapper.toDomain),
      nextCursor,
      hasMore,
    };
  }

  /** ID로 Planet 조회 */
  async findById(id: string): Promise<PlanetEntity | null> {
    const planet = await this.prisma.planet.findUnique({
      where: { id },
    });
    return planet ? PlanetMapper.toDomain(planet) : null;
  }

  /** Planet 생성 */
  async create(planet: PlanetEntity): Promise<PlanetEntity> {
    const data = PlanetMapper.toPrisma(planet);
    const created = await this.prisma.planet.create({ data });
    return PlanetMapper.toDomain(created);
  }

  /** Galaxy별 Planet 개수 조회 */
  async countByGalaxyId(galaxyId: string): Promise<number> {
    return this.prisma.planet.count({
      where: { galaxyId },
    });
  }
}
