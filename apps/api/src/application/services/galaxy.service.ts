// Galaxy 비즈니스 로직 서비스

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  GALAXY_REPOSITORY,
  IGalaxyRepository,
} from '../../domain/ports/galaxy-repository.port';
import {
  PLANET_REPOSITORY,
  IPlanetRepository,
} from '../../domain/ports/planet-repository.port';
import { GalaxyResponseDto, GalaxyListResponseDto } from '../dto/galaxy.dto';

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
}
