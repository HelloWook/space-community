// 도메인 엔티티 <-> Prisma 모델 매퍼

import { GalaxyEntity } from '../../domain/entities/galaxy.entity';
import { PlanetEntity } from '../../domain/entities/planet.entity';
import { StarEntity } from '../../domain/entities/star.entity';

/** Prisma Galaxy 모델 타입 */
interface PrismaGalaxy {
  id: string;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Prisma Planet 모델 타입 */
interface PrismaPlanet {
  id: string;
  title: string;
  content: string;
  authorNickname: string;
  starCount: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  galaxyId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Prisma Star 모델 타입 */
interface PrismaStar {
  id: string;
  giverNickname: string;
  planetId: string;
  createdAt: Date;
}

/** Galaxy 도메인 엔티티 <-> Prisma 모델 변환 매퍼 */
export class GalaxyMapper {
  /** Prisma 모델을 도메인 엔티티로 변환 */
  static toDomain(prismaGalaxy: PrismaGalaxy): GalaxyEntity {
    return GalaxyEntity.create({
      id: prismaGalaxy.id,
      name: prismaGalaxy.name,
      description: prismaGalaxy.description,
      position: {
        x: prismaGalaxy.positionX,
        y: prismaGalaxy.positionY,
        z: prismaGalaxy.positionZ,
      },
      createdAt: prismaGalaxy.createdAt,
      updatedAt: prismaGalaxy.updatedAt,
    });
  }

  /** 도메인 엔티티를 Prisma 생성 데이터로 변환 */
  static toPrisma(entity: GalaxyEntity): Omit<PrismaGalaxy, 'createdAt' | 'updatedAt'> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      positionX: entity.position.x,
      positionY: entity.position.y,
      positionZ: entity.position.z,
    };
  }
}

/** Planet 도메인 엔티티 <-> Prisma 모델 변환 매퍼 */
export class PlanetMapper {
  /** Prisma 모델을 도메인 엔티티로 변환 */
  static toDomain(prismaPlanet: PrismaPlanet): PlanetEntity {
    return PlanetEntity.create({
      id: prismaPlanet.id,
      title: prismaPlanet.title,
      content: prismaPlanet.content,
      authorNickname: prismaPlanet.authorNickname,
      starCount: prismaPlanet.starCount,
      position: {
        x: prismaPlanet.positionX,
        y: prismaPlanet.positionY,
        z: prismaPlanet.positionZ,
      },
      galaxyId: prismaPlanet.galaxyId,
      createdAt: prismaPlanet.createdAt,
      updatedAt: prismaPlanet.updatedAt,
    });
  }

  /** 도메인 엔티티를 Prisma 생성 데이터로 변환 */
  static toPrisma(entity: PlanetEntity): Omit<PrismaPlanet, 'createdAt' | 'updatedAt'> {
    return {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      authorNickname: entity.authorNickname,
      starCount: entity.starCount,
      positionX: entity.position.x,
      positionY: entity.position.y,
      positionZ: entity.position.z,
      galaxyId: entity.galaxyId,
    };
  }
}

/** Star 도메인 엔티티 <-> Prisma 모델 변환 매퍼 */
export class StarMapper {
  /** Prisma 모델을 도메인 엔티티로 변환 */
  static toDomain(prismaStar: PrismaStar): StarEntity {
    return StarEntity.create({
      id: prismaStar.id,
      giverNickname: prismaStar.giverNickname,
      planetId: prismaStar.planetId,
      createdAt: prismaStar.createdAt,
    });
  }

  /** 도메인 엔티티를 Prisma 생성 데이터로 변환 */
  static toPrisma(entity: StarEntity): PrismaStar {
    return {
      id: entity.id,
      giverNickname: entity.giverNickname,
      planetId: entity.planetId,
      createdAt: entity.createdAt,
    };
  }
}
