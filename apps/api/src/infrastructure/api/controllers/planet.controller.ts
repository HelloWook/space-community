// Planet REST API 컨트롤러

import { Controller, Get, Post, Param, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PlanetService } from '../../../application/services/planet.service';
import {
  PlanetListResponseDto,
  PlanetDetailResponseDto,
  CreatePlanetDto,
} from '../../../application/dto/planet.dto';
import { PaginationQueryDto } from '../../../application/dto/common.dto';

/** Galaxy 하위 Planet 라우트 컨트롤러 */
@Controller('api/galaxies')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  /** Galaxy별 Planet 목록 커서 기반 페이지네이션 조회 */
  @Get(':galaxyId/planets')
  async findByGalaxy(
    @Param('galaxyId') galaxyId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PlanetListResponseDto> {
    return this.planetService.findByGalaxy(
      galaxyId,
      query.cursor ?? null,
      query.limit,
    );
  }

  /** 새로운 Planet 생성 */
  @Post(':galaxyId/planets')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('galaxyId') galaxyId: string,
    @Body() dto: CreatePlanetDto,
  ): Promise<PlanetDetailResponseDto> {
    return this.planetService.create(galaxyId, dto);
  }
}

/** Planet 상세 조회 컨트롤러 */
@Controller('api/planets')
export class PlanetDetailController {
  constructor(private readonly planetService: PlanetService) {}

  /** ID로 Planet 상세 조회 */
  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<PlanetDetailResponseDto> {
    return this.planetService.findById(id);
  }
}
