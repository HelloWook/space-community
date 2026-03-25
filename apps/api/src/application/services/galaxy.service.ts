// Galaxy 비즈니스 로직 서비스

import { randomUUID } from 'crypto';
import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  GALAXY_REPOSITORY,
  IGalaxyRepository,
} from '../../domain/ports/galaxy-repository.port';
import {
  PLANET_REPOSITORY,
  IPlanetRepository,
} from '../../domain/ports/planet-repository.port';
import { GalaxyEntity } from '../../domain/entities/galaxy.entity';
import {
  GalaxyResponseDto,
  GalaxyListResponseDto,
  CreateGalaxyDto,
} from '../dto/galaxy.dto';

@Injectable()
export class GalaxyService {
  constructor(
    @Inject(GALAXY_REPOSITORY)
    private readonly galaxyRepository: IGalaxyRepository,
    @Inject(PLANET_REPOSITORY)
    private readonly planetRepository: IPlanetRepository,
  ) {}

  /** 전체 Galaxy 목록 조회 (planetCount 포함) */
  async findAll(): Promise<GalaxyListResponseDto> {
    const galaxies = await this.galaxyRepository.findAll();

    // 각 Galaxy에 대해 Planet 개수 조회
    const data: GalaxyResponseDto[] = await Promise.all(
      galaxies.map(async (galaxy) => {
        const planetCount = await this.planetRepository.countByGalaxyId(
          galaxy.id,
        );
        return {
          id: galaxy.id,
          name: galaxy.name,
          description: galaxy.description,
          position: galaxy.position,
          planetCount,
          createdAt: galaxy.createdAt,
        };
      }),
    );

    return { data };
  }

  /** ID로 Galaxy 상세 조회 */
  async findById(id: string): Promise<GalaxyResponseDto> {
    const galaxy = await this.galaxyRepository.findById(id);

    if (!galaxy) {
      throw new NotFoundException(`Galaxy(${id})를 찾을 수 없습니다`);
    }

    const planetCount = await this.planetRepository.countByGalaxyId(galaxy.id);

    return {
      id: galaxy.id,
      name: galaxy.name,
      description: galaxy.description,
      position: galaxy.position,
      planetCount,
      createdAt: galaxy.createdAt,
    };
  }

  /** 새로운 Galaxy 생성 (자동 위치 할당) */
  async create(dto: CreateGalaxyDto): Promise<GalaxyResponseDto> {
    // 이름 중복 검사
    const existing = await this.galaxyRepository.findAll();
    const duplicate = existing.find((g) => g.name === dto.name);
    if (duplicate) {
      throw new ConflictException(
        `이미 동일한 이름의 Galaxy가 존재합니다: ${dto.name}`,
      );
    }

    // [-30, 30] 범위 내 랜덤 좌표 생성
    const position = {
      x: Math.random() * 60 - 30,
      y: Math.random() * 60 - 30,
      z: Math.random() * 60 - 30,
    };

    const now = new Date();
    const entity = GalaxyEntity.create({
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      position,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.galaxyRepository.create(entity);

    return {
      id: saved.id,
      name: saved.name,
      description: saved.description,
      position: saved.position,
      planetCount: 0,
      createdAt: saved.createdAt,
    };
  }
}
