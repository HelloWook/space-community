// Star Prisma 리포지토리 구현체

import { Injectable } from '@nestjs/common';
import {
  IStarRepository,
  CreateStarResult,
} from '../../../domain/ports/star-repository.port';
import { StarEntity } from '../../../domain/entities/star.entity';
import { PrismaService } from '../prisma.service';
import { StarMapper } from '../../../application/mappers';

/** Star 리포지토리 Prisma 구현체 */
@Injectable()
export class StarRepository implements IStarRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Star 생성 - 트랜잭션으로 원자적 증가, starCount 상한 초과 시 에러 */
  async create(
    star: StarEntity,
    maxStarCount: number,
    giverId: string,
  ): Promise<CreateStarResult> {
    return this.prisma.$transaction(async (tx) => {
      // 현재 Planet의 starCount 확인
      const planet = await tx.planet.findUniqueOrThrow({
        where: { id: star.planetId },
        select: { starCount: true },
      });

      // 상한 초과 검사
      if (planet.starCount >= maxStarCount) {
        throw new Error(
          `별 개수가 최대치(${maxStarCount})에 도달했습니다`,
        );
      }

      // Star 레코드 생성 (giverId 포함)
      const data = StarMapper.toPrisma(star);
      const createdStar = await tx.star.create({
        data: {
          id: data.id,
          giverNickname: data.giverNickname,
          planetId: data.planetId,
          giverId,
        },
      });

      // Planet의 starCount 원자적 증가
      const updatedPlanet = await tx.planet.update({
        where: { id: star.planetId },
        data: { starCount: { increment: 1 } },
        select: { starCount: true },
      });

      return {
        star: StarMapper.toDomain(createdStar),
        newStarCount: updatedPlanet.starCount,
      };
    });
  }

  /** giverId와 planetId로 기존 Star 조회 (중복 별주기 검증용) */
  async findByGiverAndPlanet(
    giverId: string,
    planetId: string,
  ): Promise<StarEntity | null> {
    const star = await this.prisma.star.findFirst({
      where: { giverId, planetId },
    });
    return star ? StarMapper.toDomain(star) : null;
  }
}
