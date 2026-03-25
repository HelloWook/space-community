// Galaxy Prisma 리포지토리 구현체

import { Injectable } from '@nestjs/common';
import { IGalaxyRepository } from '../../../domain/ports/galaxy-repository.port';
import { GalaxyEntity } from '../../../domain/entities/galaxy.entity';
import { PrismaService } from '../prisma.service';
import { GalaxyMapper } from '../../../application/mappers';

/** Galaxy 리포지토리 Prisma 구현체 */
@Injectable()
export class GalaxyRepository implements IGalaxyRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** 전체 Galaxy 목록 조회 */
  async findAll(): Promise<GalaxyEntity[]> {
    const galaxies = await this.prisma.galaxy.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return galaxies.map(GalaxyMapper.toDomain);
  }

  /** ID로 Galaxy 조회 */
  async findById(id: string): Promise<GalaxyEntity | null> {
    const galaxy = await this.prisma.galaxy.findUnique({
      where: { id },
    });
    return galaxy ? GalaxyMapper.toDomain(galaxy) : null;
  }

  /** Galaxy 생성 */
  async create(galaxy: GalaxyEntity): Promise<GalaxyEntity> {
    const data = GalaxyMapper.toPrisma(galaxy);
    const created = await this.prisma.galaxy.create({ data });
    return GalaxyMapper.toDomain(created);
  }
}
