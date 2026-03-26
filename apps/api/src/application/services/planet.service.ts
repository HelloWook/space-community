// Planet 비즈니스 로직 서비스

import { randomUUID } from 'crypto';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  PLANET_REPOSITORY,
  IPlanetRepository,
} from '../../domain/ports/planet-repository.port';
import { PlanetEntity } from '../../domain/entities/planet.entity';
import {
  PlanetListResponseDto,
  PlanetDetailResponseDto,
  CreatePlanetDto,
} from '../dto/planet.dto';
import { UserService } from './user.service';

@Injectable()
export class PlanetService {
  constructor(
    @Inject(PLANET_REPOSITORY)
    private readonly planetRepository: IPlanetRepository,
    private readonly userService: UserService,
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
        authorName: null,
        starCount: planet.starCount,
        commentCount: planet.commentCount,
        position: planet.position,
        mainColor: planet.mainColor,
        subColor: planet.subColor,
        size: planet.size,
        shape: planet.shape,
        pattern: planet.pattern,
        hasRing: planet.hasRing,
        createdAt: planet.createdAt,
      })),
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
    };
  }

  /** 새로운 Planet 생성 — 인증 필수, User.name 자동 설정 */
  async create(
    galaxyId: string,
    dto: CreatePlanetDto,
    clerkId: string,
  ): Promise<PlanetDetailResponseDto> {
    // clerkId로 User 조회/생성
    const user = await this.userService.findOrCreateByClerkId(clerkId);
    const authorNickname = user.name || '익명 사용자';

    // [-10, 10] 범위 내 랜덤 좌표 생성
    const position = {
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      z: Math.random() * 20 - 10,
    };

    const now = new Date();
    const entity = PlanetEntity.create({
      id: randomUUID(),
      title: dto.title,
      content: dto.content,
      authorNickname,
      starCount: 0,
      position,
      mainColor: dto.mainColor,
      subColor: dto.subColor,
      size: dto.size,
      shape: dto.shape,
      pattern: dto.pattern,
      hasRing: dto.hasRing,
      galaxyId,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.planetRepository.create(entity);
    const detailDto = this.toDetailDto(saved);
    detailDto.authorName = user.name;
    return detailDto;
  }

  /** ID로 Planet 상세 조회 */
  async findById(id: string): Promise<PlanetDetailResponseDto> {
    const planet = await this.planetRepository.findById(id);
    if (!planet) {
      throw new NotFoundException(`Planet(${id})을 찾을 수 없습니다`);
    }
    return this.toDetailDto(planet);
  }

  /** PlanetEntity를 PlanetDetailResponseDto로 변환하는 헬퍼 */
  private toDetailDto(planet: PlanetEntity): PlanetDetailResponseDto {
    const dto = new PlanetDetailResponseDto();
    dto.id = planet.id;
    dto.title = planet.title;
    dto.content = planet.content;
    dto.authorNickname = planet.authorNickname;
    dto.authorName = null;
    dto.starCount = planet.starCount;
    dto.commentCount = planet.commentCount;
    dto.position = planet.position;
    dto.mainColor = planet.mainColor;
    dto.subColor = planet.subColor;
    dto.size = planet.size;
    dto.shape = planet.shape;
    dto.pattern = planet.pattern;
    dto.hasRing = planet.hasRing;
    dto.galaxyId = planet.galaxyId;
    dto.createdAt = planet.createdAt;
    return dto;
  }
}
